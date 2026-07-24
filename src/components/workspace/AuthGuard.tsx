import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import type { AccountTier } from '../../types/account';

interface Props {
  tier: Exclude<AccountTier, 'free'>;
  children: ReactNode;
}

export default function AuthGuard({ tier, children }: Props) {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuthStore();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(`/login`, { replace: true });
      return;
    }
    // tier 校验：profile 已加载后判断
    if (profile && profile.tier !== tier) {
      // 用户版本不匹配，跳回对应工作台或首页
      if (profile.tier === 'pro') navigate('/pro', { replace: true });
      else if (profile.tier === 'max') navigate('/max', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [user, profile, loading, tier, navigate]);

  if (loading || !user || (profile && profile.tier !== tier)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#5B4FCF] animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#5B4FCF] animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
