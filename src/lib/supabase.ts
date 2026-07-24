import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] 缺少环境变量 VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY');
}

// 前端使用的 Supabase 客户端（带 anon key + RLS 保护）
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// 账号版本类型
export type AccountTier = 'free' | 'pro' | 'max';

// 账号版本对应的被观察者上限
export const TIER_LIMITS: Record<Exclude<AccountTier, 'free'>, number> = {
  pro: 60,
  max: 160,
};
