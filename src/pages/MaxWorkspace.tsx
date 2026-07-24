import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, LogOut, Plus, Trash2, Loader2, Users, ChevronRight, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import AuthGuard from '../components/workspace/AuthGuard';
import TeamAggregateView from '../components/workspace/TeamAggregateView';
import { useAuthStore } from '../stores/auth';
import { listObservers, deleteObserver } from '../lib/observers';
import { listTasks, deleteTask } from '../lib/tasks';
import { TIER_LIMITS } from '../lib/supabase';
import type { Observer } from '../types/account';
import type { TaskRecord } from '../types/account';

function MaxWorkspaceInner() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuthStore();
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

  const handleDeleteObserver = async (id: string) => {
    await deleteObserver(id);
    setObservers((prev) => prev.filter((o) => o.id !== id));
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('确认删除此任务？')) return;
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

  const usage = `${observers.length} / ${TIER_LIMITS.max}`;

  return (
    <div className="min-h-screen p-4 pb-10">
      <div className="max-w-[420px] md:max-w-[820px] lg:max-w-[960px] mx-auto flex flex-col gap-5">
        {/* 顶部欢迎栏 */}
        <div className="rounded-[20px] bg-gradient-to-br from-[#C9A86A] via-[#D4B575] to-[#E5C58A] p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs text-white/85">Max 版工作台</span>
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
              欢迎，{profile?.nickname || '管理者'}
            </h2>
            <p className="text-white/85 text-xs mt-1">被观察者容量：{usage}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            退出
          </button>
        </div>

        {/* 操作行 */}
        <div className="flex gap-3">
          <Button variant="primary" size="md" onClick={() => navigate('/add-observer/max')} className="flex-1">
            <Users className="w-4 h-4" />
            添加被观察者
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/task/new')}
            className="flex-1"
            style={{ borderColor: '#C9A86A', color: '#C9A86A' }}
          >
            <Plus className="w-4 h-4" />
            新建任务预判
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

        {/* 任务预判列表 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#3D3A5C]">任务预判记录</h3>
            <span className="text-xs text-[#8E8CA8]">{tasks.length} 个</span>
          </div>
          {loading ? (
            <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-[#5B4FCF] animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#C9A86A]/15 flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-[#C9A86A]" />
              </div>
              <p className="text-sm text-[#8E8CA8]">尚未创建任务预判，点击上方按钮开始</p>
            </div>
          ) : (
            <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 overflow-hidden">
              {tasks.map((t, i) => {
                const prob = t.prediction.completionProbability;
                const probColor = prob >= 70 ? '#5B8C5A' : prob >= 40 ? '#C9A86A' : '#D96459';
                return (
                  <div
                    key={t.id}
                    className={`flex items-center gap-3 p-4 transition-colors hover:bg-white/40 ${
                      i > 0 ? 'border-t border-[#E8E6F5]' : ''
                    }`}
                  >
                    <button onClick={() => navigate(`/task/${t.id}`)} className="flex-1 flex items-center gap-3 text-left min-w-0">
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center"
                        style={{ background: `${probColor}15` }}
                      >
                        <span className="text-base font-bold" style={{ color: probColor }}>{prob}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#3D3A5C] truncate">{t.name}</div>
                        <div className="text-xs text-[#8E8CA8] mt-0.5">
                          {t.teamConfig.selectedObserverIds.length} 位成员 · 适配度 {t.prediction.overallFit}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8E8CA8]" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(t.id)}
                      disabled={deletingTaskId === t.id}
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#8E8CA8] hover:text-red-500 hover:bg-red-50/60 transition-all disabled:opacity-40"
                    >
                      {deletingTaskId === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 团队画像 */}
        <div>
          <h3 className="text-base font-bold text-[#3D3A5C] mb-3">团队整体画像</h3>
          <TeamAggregateView observers={observers} />
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}

export default function MaxWorkspace() {
  return (
    <AuthGuard tier="max">
      <MaxWorkspaceInner />
    </AuthGuard>
  );
}
