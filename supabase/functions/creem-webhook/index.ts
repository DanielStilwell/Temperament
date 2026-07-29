// Creem Webhook 处理
// 接收 Creem 的订阅/支付通知，验签后更新用户 tier 和过期时间

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CREEM_WEBHOOK_SECRET = Deno.env.get("CREEM_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// HMAC-SHA256 验签
async function verifySignature(rawBody: string, signature: string | null): Promise<boolean> {
  if (!signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(CREEM_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return signature === expected;
}

// 按 billing_period 计算过期时间
function calcExpiresAt(period: string): Date {
  const expiresAt = new Date();
  switch (period) {
    case "monthly":
      expiresAt.setDate(expiresAt.getDate() + 30);
      break;
    case "6months":
      expiresAt.setDate(expiresAt.getDate() + 180);
      break;
    case "yearly":
    default:
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }
  return expiresAt;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, creem-signature",
      },
    });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("creem-signature");

    // 验签
    const isValid = await verifySignature(rawBody, signature);
    if (!isValid) {
      console.error("[creem-webhook] Invalid signature");
      return json({ error: "Invalid signature" }, 401);
    }

    const event = JSON.parse(rawBody);
    const eventType = event.eventType || event.event_type || event.type;
    const obj = event.object || event.data || event;

    console.log(`[creem-webhook] Received event: ${eventType}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 处理 checkout 完成事件
    if (eventType === "checkout.completed") {
      const metadata = obj.metadata || {};
      const userId = metadata.user_id;
      const tier = metadata.tier;
      const billingPeriod = metadata.billing_period || "yearly";
      const orderId = metadata.order_id;
      const isUpgrade = metadata.is_upgrade === "true";
      const upgradeFrom = metadata.upgrade_from || null;

      if (!userId || !tier) {
        console.error("[creem-webhook] Missing metadata:", metadata);
        return json({ ok: true }); // 返回 200 避免重试
      }

      // 计算过期时间
      const expiresAt = calcExpiresAt(billingPeriod);

      // 更新订单状态
      if (orderId) {
        const { error: orderError } = await supabase
          .from("payment_orders")
          .update({
            status: "paid",
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (orderError) {
          console.error("[creem-webhook] Order update error:", orderError);
        }
      }

      // 更新用户 tier
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          tier,
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          tier_expires_at: expiresAt.toISOString(),
        })
        .eq("id", userId);

      if (profileError) {
        console.error("[creem-webhook] Profile update error:", profileError);
      } else {
        console.log(`[creem-webhook] User ${userId} upgraded to ${tier} (${billingPeriod}), expires at ${expiresAt.toISOString()}`);
      }
    }

    // 处理订阅续费事件
    else if (eventType === "subscription.paid" || eventType === "subscription.active") {
      const metadata = obj.metadata || {};
      const userId = metadata.user_id;
      const tier = metadata.tier;
      const billingPeriod = metadata.billing_period || "yearly";

      if (!userId || !tier) {
        console.error("[creem-webhook] Missing metadata for subscription event:", metadata);
        return json({ ok: true });
      }

      const expiresAt = calcExpiresAt(billingPeriod);

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          tier,
          payment_status: "paid",
          tier_expires_at: expiresAt.toISOString(),
        })
        .eq("id", userId);

      if (profileError) {
        console.error("[creem-webhook] Subscription update error:", profileError);
      } else {
        console.log(`[creem-webhook] User ${userId} subscription renewed: ${tier} (${billingPeriod}), expires at ${expiresAt.toISOString()}`);
      }
    }

    // 处理订阅取消
    else if (eventType === "subscription.canceled" || eventType === "subscription.expired") {
      const metadata = obj.metadata || {};
      const userId = metadata.user_id;

      if (userId) {
        // 不立即降级，等过期时间到了再降级（前端已处理）
        console.log(`[creem-webhook] User ${userId} subscription canceled/expired`);
      }
    }

    // 返回 200，确认收到通知
    return json({ ok: true });
  } catch (err) {
    console.error("[creem-webhook] Unexpected error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
