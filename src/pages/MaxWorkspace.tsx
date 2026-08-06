import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Target, LogOut, Plus, Trash2, Loader2, Users, ChevronRight, RefreshCw, CheckSquare, Square, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import AuthGuard from '../components/workspace/AuthGuard';
import TeamAggregateView from '../components/workspace/TeamAggregateView';
import { useAuthStore } from '../stores/auth';
import { listObservers, deleteObserver } from '../lib/observers';
import { listTasks, deleteTask } from '../lib/tasks';
import { TIER_LIMITS } from '../lib/supabase';
import type { Observer, TaskRecord } from '../types/account';
import type { TemperamentType } from '../types';

const TEMPERAMENT_BADGE: Record<TemperamentType, { label: string; bg: string; color: string }> = {
  sanguine: { label: 'San', bg: 'bg-[#FDF0E6]', color: 'text-[#E8A87C]' },
  choleric: { label: 'Cho', bg: 'bg-[#FBE8E6]', color: 'text-[#D96459]' },
  phlegmatic: { label: 'Phl', bg: 'bg-[#E8F0F8]', color: 'text-[#6B9AC4]' },
  melancholic: { label: 'Mel', bg: 'bg-[#F0ECF8]', color: 'text-[#8E7CC3]' },
};

const GENDER_LABEL: Record<string, string> = {
  male: 'M',
  female: 'F',
  other: 'Other',
  unknown: '',
};

function MaxWorkspaceInner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuthStore();
  const [observers, setObservers] = useState<Observer[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // 自由选择/组合
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);

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
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm(t('maxWorkspace.confirmDeletePrediction'))) return;
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

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => {
    setSelectedIds(observers.map((o) => o.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  // 预判选中团队：把选中的 observer IDs 通过 URL 传给 TaskBuilderPage
  const handlePredictTeam = () => {
    if (selectedIds.length === 0) return;
    const params = new URLSearchParams();
    params.set('preselect', selectedIds.join(','));
    navigate(`/task/new?${params.toString()}`);
  };

  const usage = `${observers.length} / ${TIER_LIMITS.max}`;
  const selectedObservers = observers.filter((o) => selectedIds.includes(o.id));

  return (
    <div className="min-h-screen p-4 pb-10">
      <div className="max-w-[420px] md:max-w-[820px] lg:max-w-[960px] mx-auto flex flex-col gap-5">
        {/* 顶部欢迎栏 */}
        <div className="rounded-[20px] bg-gradient-to-br from-[#C9A86A] via-[#D4B575] to-[#E5C58A] p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs text-white/85">{t('maxWorkspace.badge')}</span>
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
              {t('maxWorkspace.welcome', { name: profile?.nickname || t('maxWorkspace.manager') })}
            </h2>
            <p className="text-white/85 text-xs mt-1">{t('maxWorkspace.capacity', { usage })}</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="onColor" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('maxWorkspace.signOut')}
            </button>
          </div>
        </div>

        {/* 操作行 */}
        <div className="flex gap-3">
          <Button variant="primary" size="md" onClick={() => navigate('/add-observer/max')} className="flex-1">
            <Users className="w-4 h-4" />
            {t('maxWorkspace.addObserver')}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/task/new')}
            className="flex-1"
            style={{ borderColor: '#C9A86A', color: '#C9A86A' }}
          >
            <Plus className="w-4 h-4" />
            {t('maxWorkspace.newPrediction')}
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

        {/* 被观察者列表 + 自由选择/组合 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#3D3A5C]">{t('maxWorkspace.observers')}</h3>
            <div className="flex items-center gap-2">
              {observers.length > 0 && (
                <button
                  onClick={() => { setSelectMode(!selectMode); if (selectMode) clearSelection(); }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border-2 transition-all ${
                    selectMode
                      ? 'border-[#5B4FCF] bg-[#5B4FCF]/5 text-[#5B4FCF]'
                      : 'border-[#E8E6F5] bg-white/40 text-[#8E8CA8] hover:border-[#B5B0CC]'
                  }`}
                >
                  {selectMode ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                  {selectMode ? t('maxWorkspace.exitSelection') : t('maxWorkspace.selectCombine')}
                </button>
              )}
              <span className="text-xs text-[#8E8CA8]">{observers.length}</span>
            </div>
          </div>

          {selectMode && observers.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={selectAll}
                className="px-3 py-1.5 rounded-full text-xs font-medium border-2 border-[#E8E6F5] bg-white/40 text-[#3D3A5C] hover:border-[#B5B0CC] transition-all"
              >
                {t('maxWorkspace.selectAll')}
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1.5 rounded-full text-xs font-medium border-2 border-[#E8E6F5] bg-white/40 text-[#3D3A5C] hover:border-[#B5B0CC] transition-all"
              >
                {t('maxWorkspace.clear')}
              </button>
              {selectedIds.length > 0 && (
                <>
                  <span className="text-xs text-[#5B4FCF] font-medium ml-auto">
                    {t('maxWorkspace.selected', { count: selectedIds.length })}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handlePredictTeam}
                    className="ml-2"
                    style={{ background: 'linear-gradient(135deg, #C9A86A, #D4B575)' }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {t('maxWorkspace.predictTeam')}
                  </Button>
                </>
              )}
            </div>
          )}

          {loading ? (
            <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-[#5B4FCF] animate-spin" />
            </div>
          ) : observers.length === 0 ? (
            <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#5B4FCF]/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[#5B4FCF]" />
              </div>
              <p className="text-sm text-[#8E8CA8]">{t('maxWorkspace.emptyObservers')}</p>
            </div>
          ) : (
            <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 overflow-hidden">
              {observers.map((ob, i) => {
                const badge = TEMPERAMENT_BADGE[ob.result?.temperament || 'sanguine'];
                const isSelected = selectedIds.includes(ob.id);
                return (
                  <div
                    key={ob.id}
                    className={`flex items-center gap-3 p-4 transition-colors ${
                      i > 0 ? 'border-t border-[#E8E6F5]' : ''
                    } ${selectMode && isSelected ? 'bg-[#5B4FCF]/5' : 'hover:bg-white/40'}`}
                  >
                    {selectMode && (
                      <button
                        onClick={() => toggleSelect(ob.id)}
                        className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#5B4FCF] bg-[#5B4FCF]' : 'border-[#C5C0E8] bg-white'
                        }`}
                      >
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </button>
                    )}

                    <button
                      onClick={() => !selectMode && navigate(`/observer/${ob.id}`)}
                      className="flex-1 flex items-center gap-3 text-left min-w-0"
                      disabled={selectMode}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#5B4FCF]/15 to-[#7B6FE0]/15 flex items-center justify-center text-[#5B4FCF] font-semibold">
                        {ob.name.slice(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#3D3A5C] truncate">{ob.name}</span>
                          {GENDER_LABEL[ob.gender] && (
                            <span className="text-xs text-[#8E8CA8]">{GENDER_LABEL[ob.gender]}</span>
                          )}
                          <span className={`px-1.5 py-0.5 rounded text-xs ${badge.bg} ${badge.color}`}>{badge.label}</span>
                        </div>
                        <div className="text-xs text-[#8E8CA8] mt-0.5 truncate">
                          {ob.profession || t('maxWorkspace.noProfession')}
                        </div>
                      </div>
                    </button>

                    {!selectMode && (
                      <>
                        <ChevronRight className="w-4 h-4 text-[#8E8CA8] flex-shrink-0" />
                        <button
                          onClick={() => handleDeleteObserver(ob.id)}
                          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#8E8CA8] hover:text-red-500 hover:bg-red-50/60 transition-all"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 团队画像：根据选择动态切换 */}
        <div>
          <h3 className="text-base font-bold text-[#3D3A5C] mb-3">
            {selectMode && selectedIds.length > 0
              ? t('maxWorkspace.selectedTeamProfile', { count: selectedIds.length })
              : t('maxWorkspace.teamProfile')
            }
          </h3>
          <TeamAggregateView observers={selectMode && selectedIds.length > 0 ? selectedObservers : observers} />
        </div>

        {/* 任务预判列表 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#3D3A5C]">{t('maxWorkspace.predictionRecords')}</h3>
            <span className="text-xs text-[#8E8CA8]">{tasks.length}</span>
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
              <p className="text-sm text-[#8E8CA8]">{t('maxWorkspace.emptyPredictions')}</p>
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
                          {t('maxWorkspace.members', { count: task.teamConfig.selectedObserverIds.length })} · {t('maxWorkspace.fitScore', { score: task.prediction.overallFit })}
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

export default function MaxWorkspace() {
  return (
    <AuthGuard tier="max">
      <MaxWorkspaceInner />
    </AuthGuard>
  );
}
