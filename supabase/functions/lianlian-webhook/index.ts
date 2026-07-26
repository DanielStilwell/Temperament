// Supabase Edge Function: lianlian-webhook
// Receives LianLian Global Pay payment result notifications (async webhook)
// Verifies signature, updates user tier upon successful payment

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Config from environment ───
const LIANLIAN_PUBLIC_KEY = Deno.env.get('LL_LIANLIAN_PUBLIC_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// ─── RSA verification helpers ───

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function importPublicKey(pemBase64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'spki',
    base64ToArrayBuffer(pemBase64),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-1' },
    false,
    ['verify']
  );
}

async function rsaVerify(
  publicKey: CryptoKey,
  signatureBase64: string,
  data: string
): Promise<boolean> {
  try {
    const sigBuf = base64ToArrayBuffer(signatureBase64);
    const dataBuf = new TextEncoder().encode(data);
    return crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      sigBuf,
      dataBuf
    );
  } catch {
    return false;
  }
}

// ─── LianLian signing: recursive alphabetical sort, flatten nested objects ───
function buildSignString(params: Record<string, unknown>): string {
  return serializeObject(params);
}

function serializeObject(obj: Record<string, unknown>): string {
  const entries = Object.entries(obj)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .sort(([a], [b]) => a.localeCompare(b));

  const parts: string[] = [];
  for (const [k, v] of entries) {
    const part = serializeValue(k, v);
    if (part) parts.push(part);
  }
  return parts.join('&');
}

function serializeValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) {
    const parts = value
      .map((v) => serializeValue(key, v))
      .filter((p) => p !== '');
    return parts.join('&');
  }
  if (typeof value === 'object') {
    return serializeObject(value as Record<string, unknown>);
  }
  return `${key}=${value}`;
}

// ─── Main handler ───

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('signature') ?? '';
    const timestamp = req.headers.get('timestamp') ?? '';

    console.log('[webhook] Received notification');
    console.log('[webhook] signature header present:', signature.length > 0);
    console.log('[webhook] timestamp header:', timestamp);
    console.log('[webhook] body preview:', body.slice(0, 500));

    if (!signature) {
      console.error('[webhook] Missing signature header');
      return ok();
    }

    // 1. Parse body and build sign string
    let notification: Record<string, unknown>;
    try {
      notification = JSON.parse(body);
    } catch {
      console.error('[webhook] Failed to parse body as JSON');
      return ok();
    }

    const signString = buildSignString(notification);
    console.log('[webhook] signString:', signString);

    // 2. Verify signature
    const publicKey = await importPublicKey(LIANLIAN_PUBLIC_KEY);
    const isValid = await rsaVerify(publicKey, signature, signString);

    if (!isValid) {
      // Fallback: some LianLian products sign raw body instead of sorted params
      const rawBodyValid = await rsaVerify(publicKey, signature, body);
      if (!rawBodyValid) {
        console.error('[webhook] Signature verification FAILED (both sorted and raw body)');
        return ok();
      }
      console.log('[webhook] Signature verified using raw body');
    } else {
      console.log('[webhook] Signature verified using sorted params');
    }

    // 3. Process the notification
    const returnCode = notification.return_code;
    const orderInfo = notification.order as Record<string, unknown> | undefined;

    if (!orderInfo) {
      console.error('[webhook] No order info in notification');
      return ok();
    }

    const merchantTransactionId = String(orderInfo.merchant_transaction_id ?? '');
    const paymentStatus = String(orderInfo.payment_status ?? '');

    if (!merchantTransactionId) {
      console.error('[webhook] No merchant_transaction_id');
      return ok();
    }

    console.log('[webhook] merchant_transaction_id:', merchantTransactionId);
    console.log('[webhook] payment_status:', paymentStatus);
    console.log('[webhook] return_code:', returnCode);

    // 4. Look up the order in our database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: order, error: orderError } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('id', merchantTransactionId)
      .maybeSingle();

    if (orderError || !order) {
      console.error('[webhook] Order not found:', merchantTransactionId, orderError);
      return ok();
    }

    // 5. Update order status
    // LianLian payment_status: '2' usually means paid, '3' means failed
    const isPaid = returnCode === 'SUCCESS' && paymentStatus === '2';

    await supabase
      .from('payment_orders')
      .update({
        status: isPaid ? 'paid' : 'failed',
        lianlian_payment_status: paymentStatus,
        paid_at: isPaid ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', merchantTransactionId);

    // 6. If paid, update user's tier
    if (isPaid && order.user_id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          tier: order.tier,
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', order.user_id);

      if (profileError) {
        console.error('[webhook] Profile update error:', profileError);
      } else {
        console.log(`[webhook] User ${order.user_id} upgraded to ${order.tier}`);
      }
    }

    // 7. Acknowledge receipt
    return ok();

  } catch (err) {
    console.error('[webhook] Error:', err);
    return ok();
  }
});

function ok(): Response {
  return new Response(JSON.stringify({ code: '200', message: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
