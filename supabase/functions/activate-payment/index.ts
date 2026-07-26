// Supabase Edge Function: activate-payment
// Fallback activation when LianLian webhook notification is delayed or unavailable.
// Triggered from PaymentCallbackPage after user returns from LianLian checkout.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return json({ error: 'Missing Authorization header' }, 401);
    }

    const { order_id: orderId } = await req.json();
    if (!orderId) {
      return json({ error: 'Missing order_id' }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify JWT and get user
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      console.error('[activate-payment] Auth error:', userError);
      return json({ error: 'Unauthorized' }, 401);
    }
    const userId = userData.user.id;

    // Look up the order and ensure it belongs to this user
    const { data: order, error: orderError } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .maybeSingle();

    if (orderError || !order) {
      console.error('[activate-payment] Order not found:', orderId, orderError);
      return json({ error: 'Order not found' }, 404);
    }

    if (order.status === 'paid') {
      return json({ activated: true, message: 'Order already paid' });
    }

    if (order.status === 'failed') {
      return json({ error: 'Order has failed' }, 400);
    }

    // Activate the order and upgrade tier
    const now = new Date().toISOString();

    const { error: updateOrderError } = await supabase
      .from('payment_orders')
      .update({
        status: 'paid',
        paid_at: now,
        updated_at: now,
      })
      .eq('id', orderId);

    if (updateOrderError) {
      console.error('[activate-payment] Update order error:', updateOrderError);
      return json({ error: 'Failed to activate order' }, 500);
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        tier: order.tier,
        payment_status: 'paid',
        paid_at: now,
      })
      .eq('id', userId);

    if (profileError) {
      console.error('[activate-payment] Profile update error:', profileError);
      return json({ error: 'Failed to upgrade profile' }, 500);
    }

    console.log(`[activate-payment] User ${userId} activated to ${order.tier} for order ${orderId}`);
    return json({ activated: true, tier: order.tier });

  } catch (err) {
    console.error('[activate-payment] Error:', err);
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
