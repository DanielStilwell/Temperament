// Creem Checkout 创建支付会话
// 接收前端请求，调用 Creem API 创建 checkout session，返回 checkout_url

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CREEM_API_KEY = Deno.env.get("CREEM_API_KEY")!;
const CREEM_TEST_MODE = Deno.env.get("CREEM_TEST_MODE") === "true";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_BASE = Deno.env.get("SITE_BASE_URL") || "https://dsrtempe.top";

// Creem API base URL（测试/生产）
const CREEM_BASE = CREEM_TEST_MODE ? "https://test-api.creem.io" : "https://api.creem.io";

// 产品 ID 映射
const PRODUCT_IDS = {
  pro: {
    monthly: Deno.env.get("CREEM_PRO_MONTHLY")!,
    "6months": Deno.env.get("CREEM_PRO_6MONTHS")!,
    yearly: Deno.env.get("CREEM_PRO_YEARLY")!,
  },
  max: {
    monthly: Deno.env.get("CREEM_MAX_MONTHLY")!,
    "6months": Deno.env.get("CREEM_MAX_6MONTHS")!,
    yearly: Deno.env.get("CREEM_MAX_YEARLY")!,
  },
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const { user_id, tier, billing_period, is_upgrade, upgrade_from } = await req.json();

    if (!user_id || !tier || !billing_period) {
      return json({ error: "Missing required fields: user_id, tier, billing_period" }, 400);
    }

    // 获取对应的产品 ID
    const productId = PRODUCT_IDS[tier as keyof typeof PRODUCT_IDS]?.[billing_period as "monthly"];
    if (!productId) {
      return json({ error: `Invalid tier or billing_period: ${tier}/${billing_period}` }, 400);
    }

    // 生成订单 ID（用于内部追踪）
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const orderId = `CREEM${timestamp}${random}`;

    // 调用 Creem API 创建 checkout session
    const checkoutBody = {
      product_id: productId,
      request_id: orderId,
      success_url: `${SITE_BASE}/payment-callback?order=${orderId}&tier=${tier}&provider=creem${is_upgrade ? "&upgrade=1" : ""}`,
      metadata: {
        user_id,
        tier,
        billing_period,
        order_id: orderId,
        is_upgrade: is_upgrade ? "true" : "false",
        upgrade_from: upgrade_from || "",
      },
    };

    console.log(`[create-checkout] Creating checkout for user=${user_id}, tier=${tier}, period=${billing_period}, product=${productId}`);

    const creemResp = await fetch(`${CREEM_BASE}/v1/checkouts`, {
      method: "POST",
      headers: {
        "x-api-key": CREEM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutBody),
    });

    const creemData = await creemResp.json();

    if (!creemResp.ok) {
      console.error("[create-checkout] Creem API error:", creemData);
      return json({
        error: "Creem checkout creation failed",
        detail: creemData.message || creemData.error || "Unknown error",
      }, 400);
    }

    const checkoutUrl = creemData.checkout_url;
    if (!checkoutUrl) {
      console.error("[create-checkout] No checkout_url in response:", creemData);
      return json({ error: "No checkout URL returned from Creem" }, 500);
    }

    // 存储订单到 Supabase（用于 webhook 匹配）
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error: dbError } = await supabase.from("payment_orders").insert({
      id: orderId,
      user_id,
      tier,
      amount: 0, // 金额由 Creem 产品决定，webhook 回调时更新
      billing_period,
      is_upgrade: is_upgrade ?? false,
      upgrade_from: upgrade_from ?? null,
      status: "pending",
      creem_checkout_id: creemData.id || null,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("[create-checkout] DB insert error:", dbError);
      // 不阻塞流程，订单追踪可在 webhook 中补
    }

    console.log(`[create-checkout] Success: order=${orderId}, checkout_url=${checkoutUrl}`);

    return json({
      checkout_url: checkoutUrl,
      order_id: orderId,
    });
  } catch (err) {
    console.error("[create-checkout] Unexpected error:", err);
    return json({ error: "Internal server error", detail: String(err) }, 500);
  }
});
