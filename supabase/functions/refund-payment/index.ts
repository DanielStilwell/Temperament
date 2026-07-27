// Supabase Edge Function: refund-payment
// Calls LianLian Global Pay refund API and records the refund request

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Config from environment ───
const MERCHANT_ID = Deno.env.get('LL_MERCHANT_ID')!;
const SUB_MERCHANT_ID = Deno.env.get('LL_SUB_MERCHANT_ID')!;
const MERCHANT_PRIVATE_KEY = Deno.env.get('LL_MERCHANT_PRIVATE_KEY')!;
const LIANLIAN_PUBLIC_KEY = Deno.env.get('LL_LIANLIAN_PUBLIC_KEY')!;
const IS_SANDBOX = Deno.env.get('LL_SANDBOX') === 'true';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const API_BASE = IS_SANDBOX
  ? 'https://celer-api.lianlianpay-inc.com'
  : 'https://gpapi.lianlianpay.com';

// ─── RSA helpers ───

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function importPrivateKey(pemBase64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'pkcs8',
    base64ToArrayBuffer(pemBase64),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-1' },
    false,
    ['sign']
  );
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

async function rsaSign(privateKey: CryptoKey, data: string): Promise<string> {
  const sigBuf = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(data)
  );
  return btoa(String.fromCharCode(...new Uint8Array(sigBuf)));
}

async function rsaVerify(
  publicKey: CryptoKey,
  signatureBase64: string,
  data: string
): Promise<boolean> {
  try {
    const sigBuf = base64ToArrayBuffer(signatureBase64);
    const dataBuf = new TextEncoder().encode(data);
    return await crypto.subtle.verify(
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

// ─── Timestamp ───
// Supabase Edge Functions run in UTC, so we must format in the target timezone
// to match the timezone declared in the request header.
const TIMEZONE = 'Asia/Shanghai';

function llTimestamp(timeZone = TIMEZONE): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
  return `${get('year')}${get('month')}${get('day')}${get('hour')}${get('minute')}${get('second')}`;
}

// ─── Main handler ───
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const accessToken = authHeader.replace('Bearer ', '');
    if (!accessToken) {
      return json({ error: 'Missing access token' }, 401);
    }

    // Verify user token
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !userData.user) {
      return json({ error: 'Invalid access token' }, 401);
    }

    const { order_id, refund_amount, refund_reason } = await req.json();

    if (!order_id) {
      return json({ error: 'Missing order_id' }, 400);
    }

    // Look up the order
    const { data: order, error: orderError } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('id', order_id)
      .maybeSingle();

    if (orderError || !order) {
      console.error('[refund-payment] Order not found:', order_id, orderError);
      return json({ error: 'Order not found' }, 404);
    }

    if (order.user_id !== userData.user.id) {
      return json({ error: 'Unauthorized' }, 403);
    }

    if (order.status !== 'paid') {
      return json({ error: 'Order is not paid' }, 400);
    }

    // Generate refund IDs
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const merchantRefundId = `RFD${timestamp}${random}`;
    const reqTimestamp = llTimestamp();

    const amount = refund_amount ?? order.amount;

    // Build refund request body
    // See: https://doc.lianlianpay.com/doc-api/open-api/refund
    // merchant_transaction_id = new refund transaction ID (unique)
    // original_transaction_id = the original payment order ID
    // refund_data is a nested object containing refund_amount and refund_currency_code
    const refundBody: Record<string, unknown> = {
      merchant_id: MERCHANT_ID,
      sub_merchant_id: SUB_MERCHANT_ID,
      merchant_transaction_id: merchantRefundId,
      merchant_refund_time: reqTimestamp,
      original_transaction_id: order.id,
      notification_url: `${SUPABASE_URL}/functions/v1/lianlian-webhook`,
      refund_data: {
        refund_amount: Math.round(Number(amount) * 100) / 100,
        refund_currency_code: 'USD',
      },
      reason: refund_reason ?? 'User requested refund',
    };

    // Sign
    const signString = buildSignString(refundBody);
    console.log('[refund-payment] signString:', signString);

    const privateKey = await importPrivateKey(MERCHANT_PRIVATE_KEY);
    const signature = await rsaSign(privateKey, signString);

    // Call LianLian API
    // POST /v3/merchants/<merchant_id>/payments/<original_transaction_id>/refunds
    const apiUrl = `${API_BASE}/v3/merchants/${MERCHANT_ID}/payments/${order.id}/refunds`;
    console.log('[refund-payment] calling:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'signature': signature,
        'timezone': TIMEZONE,
        'timestamp': reqTimestamp,
      },
      body: JSON.stringify(refundBody),
    });

    const responseText = await response.text();
    console.log('[refund-payment] response status:', response.status);
    console.log('[refund-payment] response body:', responseText);

    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch {
      return json({ error: 'Invalid response from LianLian', detail: responseText }, 502);
    }

    if (result.return_code !== 'SUCCESS') {
      console.error('[refund-payment] LianLian error:', JSON.stringify(result));
      return json({
        error: 'Refund creation failed',
        detail: result.return_message || result.return_code,
      }, 400);
    }

    // Update order with refund info
    // Response structure: { return_code, return_message, trace_id, order: { ll_transaction_id, merchant_transaction_id, original_transaction_id, refund_data: {...} } }
    // return_code=SUCCESS means request accepted, NOT that refund is complete.
    // Refund completion is notified via webhook when refund_status = "RS".
    const refundOrder = result.order ?? {};
    const llTransactionId = refundOrder.ll_transaction_id ?? null;

    const { error: updateError } = await supabase
      .from('payment_orders')
      .update({
        refund_status: 'pending',
        refund_amount: amount,
        merchant_refund_id: merchantRefundId,
        lianlian_refund_id: llTransactionId,
        refund_reason: refund_reason ?? 'User requested refund',
        refund_requested_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('[refund-payment] DB update error:', updateError);
    }

    return json({
      success: true,
      merchant_refund_id: merchantRefundId,
      lianlian_refund_id: llTransactionId,
    });

  } catch (err) {
    console.error('[refund-payment] Error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
});

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
