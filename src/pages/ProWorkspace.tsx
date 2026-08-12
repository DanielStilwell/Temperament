import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus, LogOut, Users, RefreshCw, Loader2, Plus, Trash2, ChevronRight, Target } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import AuthGuard from '../components/workspace/AuthGuard';
import ObserverList from '../components/workspace/ObserverList';
import TeamAggregateView from '../components/workspace/TeamAggregateView';
import { useAuthStore } from '../stores/auth';
import { listObservers, deleteObserver } from '../lib/observers';
import { listTasks, deleteTask } from '../lib/tasks';
import { TIER_LIMITS } from '../lib/supabase';
import type { Observer, TaskRecord } from '../types/account';

function ProWorkspaceInner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, signOut, fetchProfile } = useAuthStore();
  const [observers, setObservers] = useState<Observer[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const loadAll = async () => {
    setRefreshing(true);
    try {
      const [obList, taskList] = await Promise.all([listObservers(), listTasks()]);
      setObservers(obList);
      setTasks(taskList);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteObserver(id);
    setObservers((prev) => prev.filter((o) => o.id !== id));
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm(t('proWorkspace.confirmDeletePrediction'))) return;
    setDeletingTaskId(id);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setDeletingTaskId(null);
    }
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
            onClick={() => navigate('/task/new')}
            className="flex-1"
            style={{ borderColor: '#5B4FCF', color: '#5B4FCF' }}
          >
            <Plus className="w-4 h-4" />
            {t('proWorkspace.newPrediction')}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={loadAll}
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

        {/* 任务预判记录 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#3D3A5C]">{t('proWorkspace.predictionRecords')}</h3>
            <span className="text-xs text-[#8E8CA8]">{tasks.length}</span>
          </div>
          {loading ? (
            <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-[#5B4FCF] animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#5B4FCF]/10 flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-[#5B4FCF]" />
              </div>
              <p className="text-sm text-[#8E8CA8]">{t('proWorkspace.emptyPredictions')}</p>
            </div>
          ) : (
            <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 overflow-hidden">
              {tasks.map((task, i) => {
                const prob = task.prediction.completionProbability;
                const probColor = prob >= 70 ? '#5B8C5A' : prob >= 40 ? '#C9A86A' : '#D96459';
                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-4 transition-colors hover:bg-white/40 ${
                      i > 0 ? 'border-t border-[#E8E6F5]' : ''
                    }`}
                  >
                    <button onClick={() => navigate(`/task/${task.id}`)} className="flex-1 flex items-center gap-3 text-left min-w-0">
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center"
                        style={{ background: `${probColor}15` }}
                      >
                        <span className="text-base font-bold" style={{ color: probColor }}>{prob}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#3D3A5C] truncate">{task.name}</div>
                        <div className="text-xs text-[#8E8CA8] mt-0.5">
                          {t('proWorkspace.members', { count: task.teamConfig.selectedObserverIds.length })} · {t('proWorkspace.fitScore', { score: task.prediction.overallFit })}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8E8CA8]" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={deletingTaskId === task.id}
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#8E8CA8] hover:text-red-500 hover:bg-red-50/60 transition-all disabled:opacity-40"
                    >
                      {deletingTaskId === task.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
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
