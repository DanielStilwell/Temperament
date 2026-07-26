// Supabase Edge Function: create-payment
// Creates a LianLian Global Pay checkout order and returns the hosted payment page URL

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Config from environment ───
const MERCHANT_ID = Deno.env.get('LL_MERCHANT_ID')!;
const SUB_MERCHANT_ID = Deno.env.get('LL_SUB_MERCHANT_ID')!;
const MERCHANT_PRIVATE_KEY = Deno.env.get('LL_MERCHANT_PRIVATE_KEY')!;
const IS_SANDBOX = Deno.env.get('LL_SANDBOX') === 'true';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const API_BASE = IS_SANDBOX
  ? 'https://celer-api.LianLianpay-inc.com'
  : 'https://gpapi.lianlianpay.com';

const SITE_BASE = Deno.env.get('SITE_BASE_URL') ?? 'http://localhost:5174';

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

async function rsaSign(privateKey: CryptoKey, data: string): Promise<string> {
  const sigBuf = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(data)
  );
  return btoa(String.fromCharCode(...new Uint8Array(sigBuf)));
}

// ─── LianLian signing: recursive alphabetical sort, flatten nested objects ───
// Docs: https://doc.lianlianpay.com/338527m0
// Example body {"a":"100","b":[{"f":"3","e":"2","d":"1"},{"j":"6","i":"5","h":"4"}],"c":{"b":"11","a":"10"}}
// becomes sign string: a=100&d=1&e=2&f=3&h=4&i=5&j=6&a=10&b=11

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
// LianLian requires the timestamp to match the timezone declared in the header.
// Supabase Edge Functions run in UTC, so we must format in the target timezone.

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

  try {
    const { user_id, tier, amount, is_upgrade, upgrade_from } = await req.json();

    if (!user_id || !tier || !amount) {
      return json({ error: 'Missing required fields: user_id, tier, amount' }, 400);
    }

    // Generate unique order IDs
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const merchantTransactionId = `TEMP${timestamp}${random}`;
    const merchantOrderId = `ORD${timestamp}${random}`;
    const orderTime = llTimestamp();

    // Build payment request body
    const paymentBody: Record<string, unknown> = {
      merchant_transaction_id: merchantTransactionId,
      merchant_id: MERCHANT_ID,
      sub_merchant_id: SUB_MERCHANT_ID,
      notification_url: `${SUPABASE_URL}/functions/v1/lianlian-webhook`,
      redirect_url: `${SITE_BASE}/payment-callback?order=${merchantTransactionId}&tier=${tier}${is_upgrade ? '&upgrade=1' : ''}`,
      country: 'US',
      merchant_order: {
        merchant_order_id: merchantOrderId,
        merchant_user_no: user_id,
        merchant_order_time: orderTime,
        order_description: `Temperament App - ${tier.toUpperCase()} Version${is_upgrade ? ` (Upgrade from ${upgrade_from})` : ''}`,
        order_amount: Number(amount).toFixed(2),
        order_currency_code: 'USD',
        products: [
          {
            product_id: '1',
            name: `Temperament ${tier.toUpperCase()} Version`,
            description: `Lifetime access to ${tier.toUpperCase()} features`,
            quantity: '1',
            price: Number(amount).toFixed(2),
            currency_code: 'USD',
          },
        ],
      },
    };

    // Build sign string from body params
    const signString = buildSignString(paymentBody);
    console.log('[create-payment] signString:', signString);

    // Sign with merchant private key
    const privateKey = await importPrivateKey(MERCHANT_PRIVATE_KEY);
    const signature = await rsaSign(privateKey, signString);
    console.log('[create-payment] signature length:', signature.length);

    // Call LianLian API
    const apiUrl = `${API_BASE}/v3/merchants/${MERCHANT_ID}/payments`;
    const reqTimestamp = llTimestamp();

    console.log('[create-payment] calling:', apiUrl);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'signature': signature,
        'timezone': TIMEZONE,
        'timestamp': reqTimestamp,
      },
      body: JSON.stringify(paymentBody),
    });

    const responseText = await response.text();
    console.log('[create-payment] response status:', response.status);
    console.log('[create-payment] response body:', responseText);

    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch {
      return json({ error: 'Invalid response from LianLian', detail: responseText }, 502);
    }

    const checkoutUrl = result.order?.checkout_url || result.order?.payment_url;
    if (result.return_code !== 'SUCCESS' || !checkoutUrl) {
      console.error('[create-payment] LianLian error:', JSON.stringify(result));
      return json({
        error: 'Payment creation failed',
        detail: result.return_message || result.decline_code || responseText,
      }, 400);
    }

    // Store order in Supabase for tracking
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error: dbError } = await supabase.from('payment_orders').insert({
      id: merchantTransactionId,
      user_id,
      tier,
      amount,
      is_upgrade: is_upgrade ?? false,
      upgrade_from: upgrade_from ?? null,
      status: 'pending',
      lianlian_order_id: result.order?.order_id ?? null,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error('[create-payment] DB insert error:', dbError);
      // Non-fatal: payment can still proceed, webhook will update
    }

    return json({
      checkout_url: checkoutUrl,
      order_id: merchantTransactionId,
    });

  } catch (err) {
    console.error('[create-payment] Error:', err);
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
