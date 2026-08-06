import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus, LogOut, Users, RefreshCw, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import AuthGuard from '../components/workspace/AuthGuard';
import ObserverList from '../components/workspace/ObserverList';
import TeamAggregateView from '../components/workspace/TeamAggregateView';
import { useAuthStore } from '../stores/auth';
import { listObservers, deleteObserver } from '../lib/observers';
import { TIER_LIMITS } from '../lib/supabase';
import type { Observer } from '../types/account';

function ProWorkspaceInner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, signOut, fetchProfile } = useAuthStore();
  const [observers, setObservers] = useState<Observer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadObservers = async () => {
    setRefreshing(true);
    try {
      const list = await listObservers();
      setObservers(list);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadObservers();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteObserver(id);
    setObservers((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const handleSelectObserver = (ob: Observer) => {
    navigate(`/observer/${ob.id}`);
  };

  const usage = `${observers.length} / ${TIER_LIMITS.pro}`;

  return (
    <div className="min-h-screen p-4 pb-10">
      <div className="max-w-[420px] md:max-w-[820px] lg:max-w-[960px] mx-auto flex flex-col gap-5">
        {/* 顶部欢迎栏 */}
        <div className="rounded-[20px] bg-gradient-to-br from-[#5B4FCF] to-[#7B6FE0] p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs text-white/80">{t('proWorkspace.badge')}</span>
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
              {t('proWorkspace.welcome', { name: profile?.nickname || t('proWorkspace.manager') })}
            </h2>
            <p className="text-white/80 text-xs mt-1">{t('proWorkspace.capacity', { usage })}</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="onColor" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('proWorkspace.signOut')}
            </button>
          </div>
        </div>

        {/* 操作行 */}
        <div className="flex gap-3">
          <Button variant="primary" size="md" onClick={() => navigate('/add-observer/pro')} className="flex-1">
            <UserPlus className="w-4 h-4" />
            {t('proWorkspace.addObserver')}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={loadObservers}
            disabled={refreshing}
            className="px-4"
          >
            {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </div>

        {/* 被观察者列表 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#3D3A5C]">{t('proWorkspace.observers')}</h3>
            <span className="text-xs text-[#8E8CA8]">{observers.length}</span>
          </div>
          <ObserverList
            observers={observers}
            loading={loading}
            onDelete={handleDelete}
            onSelect={handleSelectObserver}
            emptyHint={t('proWorkspace.emptyHint')}
          />
        </div>

        {/* 团队聚合分析 */}
        <div>
          <h3 className="text-base font-bold text-[#3D3A5C] mb-3">{t('proWorkspace.teamProfile')}</h3>
          <TeamAggregateView observers={observers} />
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}

export default function ProWorkspace() {
  return (
    <AuthGuard tier="pro">
      <ProWorkspaceInner />
    </AuthGuard>
  );
}
