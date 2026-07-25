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
  return {
    id: row.id,
    nickname: row.nickname ?? '',
    tier: row.tier ?? 'free',
    paymentStatus: row.payment_status ?? 'none',
    paidAt: row.paid_at ?? null,
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
    if (!user) return { error: '未登录' };

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
