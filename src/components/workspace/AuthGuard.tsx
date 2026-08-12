import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import type { AccountTier } from '../../types/account';

interface Props {
  tier: Exclude<AccountTier, 'free'>;
  shared?: boolean;
  children: ReactNode;
}

export default function AuthGuard({ tier, shared, children }: Props) {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuthStore();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(`/login`, { replace: true });
      return;
    }
    if (profile) {
      const currentTier = profile.tier;
      if (currentTier === 'max' && tier === 'pro') {
        if (shared) {
          return;
        }
        navigate('/max', { replace: true });
        return;
      }
      if (currentTier !== tier) {
        if (currentTier === 'pro') navigate('/pro', { replace: true });
        else if (currentTier === 'max') navigate('/max', { replace: true });
        else navigate('/', { replace: true });
      }
    }
  }, [user, profile, loading, tier, shared, navigate]);

  if (loading || !user || (profile && profile.tier !== tier && !(shared && profile.tier === 'max' && tier === 'pro'))) {
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
