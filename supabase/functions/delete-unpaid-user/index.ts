// 删除未支付用户
// 接收 user_id，删除 auth.users 和 profiles 中的记录
// 仅删除 payment_status='pending' 的用户，防止误删已付费用户

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
    const { user_id } = await req.json();

    if (!user_id) {
      return json({ error: "Missing required field: user_id" }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. 先检查用户是否为 pending 状态（防止误删已付费用户）
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("payment_status, tier_expires_at")
      .eq("id", user_id)
      .maybeSingle();

    if (profileError) {
      console.error("[delete-unpaid-user] Profile query error:", profileError);
      return json({ error: "Database error" }, 500);
    }

    // 用户不存在或已付费 → 不删除
    if (!profile) {
      return json({ ok: true, message: "User not found, nothing to delete" });
    }

    if (profile.payment_status === "paid" || profile.tier_expires_at) {
      console.error(`[delete-unpaid-user] User ${user_id} is already paid, refusing to delete`);
      return json({ error: "Cannot delete a paid user" }, 403);
    }

    // 2. 删除 profiles 记录
    const { error: deleteProfileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user_id);

    if (deleteProfileError) {
      console.error("[delete-unpaid-user] Profile delete error:", deleteProfileError);
    }

    // 3. 删除 payment_orders 中该用户的 pending 订单
    const { error: deleteOrdersError } = await supabase
      .from("payment_orders")
      .delete()
      .eq("user_id", user_id)
      .eq("status", "pending");

    if (deleteOrdersError) {
      console.error("[delete-unpaid-user] Orders delete error:", deleteOrdersError);
    }

    // 4. 删除 auth.users 记录（使用 admin API）
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user_id);

    if (authDeleteError) {
      console.error("[delete-unpaid-user] Auth user delete error:", authDeleteError);
      return json({ error: "Failed to delete auth user" }, 500);
    }

    console.log(`[delete-unpaid-user] Successfully deleted unpaid user: ${user_id}`);
    return json({ ok: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("[delete-unpaid-user] Unexpected error:", err);
    return json({ error: "Internal server error", detail: String(err) }, 500);
  }
});
