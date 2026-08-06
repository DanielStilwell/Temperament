import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile, AccountTier, PaymentStatus } from '../types/account';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;

  // 初始化：监听 session
  init: () => () => void;
  // 拉取当前 profile
  fetchProfile: () => Promise<void>;
  // 注册
  signUp: (params: { nickname: string; email: string; password: string; tier: AccountTier }) => Promise<{ error: string | null }>;
  // 登录
  signIn: (params: { email: string; password: string }) => Promise<{ error: string | null }>;
  // 退出
  signOut: () => Promise<void>;
  // 清空错误
  clearError: () => void;
  // 升级 tier（Pro→Max 等）
  upgradeTier: (newTier: Exclude<AccountTier, 'free'>) => Promise<{ error: string | null }>;
}

// 把 supabase profiles 行映射为前端 Profile
function mapProfile(row: any): Profile {
  const tier = row.tier ?? 'free';
  const tierExpiresAt = row.tier_expires_at ?? null;

  // 年度订阅过期检查：tier 非 free 且过期时间已过 → 前端视为 free
  let effectiveTier: AccountTier = tier;
  if (tier !== 'free' && tierExpiresAt) {
    const expires = new Date(tierExpiresAt).getTime();
    if (Date.now() > expires) {
      effectiveTier = 'free';
    }
  }

  return {
    id: row.id,
    nickname: row.nickname ?? '',
    tier: effectiveTier,
    paymentStatus: row.payment_status ?? 'none',
    paidAt: row.paid_at ?? null,
    tierExpiresAt,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  error: null,

  init: () => {
    // 首次拉取 session
    supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session, user: data.session?.user ?? null, loading: false });
      if (data.session?.user) {
        get().fetchProfile();
      }
    });

    // 监听 auth 状态变化
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        get().fetchProfile();
      } else {
        set({ profile: null });
      }
    });

    return () => sub.subscription.unsubscribe();
  },

  fetchProfile: async () => {
    const user = get().user;
    if (!user) {
      set({ profile: null });
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('[fetchProfile]', error);
      return;
    }
    if (data) {
      // 检测未支付用户：在非注册/支付回调页面自动清理
      const currentPath = window.location.pathname;
      const isOnPaymentPage = currentPath.startsWith('/register') || currentPath.startsWith('/payment-callback');

      if (data.payment_status === 'pending' && !data.tier_expires_at && !isOnPaymentPage) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        await fetch(`${supabaseUrl}/functions/v1/delete-unpaid-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ user_id: user.id }),
        });
        await supabase.auth.signOut();
        set({ user: null, session: null, profile: null });
        return;
      }

      set({ profile: mapProfile(data) });
    }
  },

  signUp: async ({ nickname, email, password, tier }) => {
    set({ error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname, intended_tier: tier } },
    });

    if (error) {
      // 邮箱已注册 → 尝试登录检测是否为未支付用户，如果是则删除后重试注册
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError && signInData.user) {
          const { data: profileRow } = await supabase
            .from('profiles')
            .select('payment_status, tier_expires_at')
            .eq('id', signInData.user.id)
            .maybeSingle();

          if (profileRow && profileRow.payment_status === 'pending' && !profileRow.tier_expires_at) {
            // 删除未支付账户
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            await fetch(`${supabaseUrl}/functions/v1/delete-unpaid-user`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({ user_id: signInData.user.id }),
            });
            await supabase.auth.signOut();

            // 重试注册
            const { data: retryData, error: retryError } = await supabase.auth.signUp({
              email,
              password,
              options: { data: { nickname, intended_tier: tier } },
            });

            if (retryError) {
              set({ error: retryError.message });
              return { error: retryError.message };
            }

            if (retryData.user) {
              await supabase
                .from('profiles')
                .upsert({
                  id: retryData.user.id,
                  nickname,
                  tier,
                  payment_status: 'pending',
                }, { onConflict: 'id' });
            }

            set({ user: retryData.user, session: retryData.session });
            return { error: null };
          }
        }
        // 无法登录（密码不匹配）→ 提示用户
        set({ error: 'This email is already registered but unpaid. Please log in with your previous password to cancel, or use a different email.' });
        return { error: 'This email is already registered but unpaid. Please log in with your previous password to cancel, or use a different email.' };
      }
      set({ error: error.message });
      return { error: error.message };
    }

    // 创建/更新 profile 行（带上 nickname 与目标 tier）
    // 注意：tier 升级需要支付成功后才能正式生效，这里先写入目标 tier 但 payment_status='pending'
    if (data.user) {
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          nickname,
          tier,
          payment_status: 'pending',
        }, { onConflict: 'id' });

      if (upsertError) {
        console.error('[signUp upsert profile]', upsertError);
      }
    }

    set({ user: data.user, session: data.session });
    return { error: null };
  },

  signIn: async ({ email, password }) => {
    set({ error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ error: error.message });
      return { error: error.message };
    }

    // 检查是否为未支付用户 → 删除并拒绝登录
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('payment_status, tier_expires_at')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileRow && profileRow.payment_status === 'pending' && !profileRow.tier_expires_at) {
      // 未支付用户 → 删除账户
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      await fetch(`${supabaseUrl}/functions/v1/delete-unpaid-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ user_id: data.user.id }),
      });
      await supabase.auth.signOut();
      set({ user: null, session: null, profile: null, error: 'This account was not activated. Please register again.' });
      return { error: 'This account was not activated. Please register again.' };
    }

    set({ user: data.user, session: data.session });
    await get().fetchProfile();
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },

  clearError: () => set({ error: null }),

  upgradeTier: async (newTier) => {
    const user = get().user;
    if (!user) return { error: 'Not logged in' };

    const { error } = await supabase
      .from('profiles')
      .update({ tier: newTier, payment_status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error('[upgradeTier]', error);
      return { error: error.message };
    }

    await get().fetchProfile();
    return { error: null };
  },
}));
