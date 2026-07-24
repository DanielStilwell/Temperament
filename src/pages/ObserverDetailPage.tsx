import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import type { Observer } from '../types/account';
import { listObservers, deleteObserver } from '../lib/observers';
import TemperamentHero from '../components/result/TemperamentHero';
import RadarChart from '../components/result/RadarChart';
import DimensionDetails from '../components/result/DimensionDetails';
import MotivationAnalysis from '../components/result/MotivationAnalysis';
import ThinkingAnalysis from '../components/result/ThinkingAnalysis';
import Disclaimer from '../components/ui/Disclaimer';

const GENDER_LABEL: Record<string, string> = {
  male: '男',
  female: '女',
  other: '其他',
  unknown: '不便透露',
};

export default function ObserverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [observer, setObserver] = useState<Observer | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await listObservers();
      const ob = list.find((o) => o.id === id) ?? null;
      setObserver(ob);
      setLoading(false);
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!observer) return;
    if (!confirm(`确认删除被观察者「${observer.name}」？`)) return;
    setDeleting(true);
    try {
      await deleteObserver(observer.id);
      navigate(-1);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#5B4FCF] animate-spin" />
      </div>
    );
  }

  if (!observer || !observer.result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-[#8E8CA8]">未找到该被观察者</p>
        <Link to="/" className="text-sm text-[#5B4FCF] hover:underline">返回首页</Link>
      </div>
    );
  }

  const r = observer.result;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-8">
      <div className="w-full max-w-[420px] md:max-w-[520px] lg:max-w-[640px] xl:max-w-[720px] flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors disabled:opacity-40"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            删除
          </button>
        </div>

        {/* 被观察者信息卡 */}
        <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5B4FCF]/15 to-[#7B6FE0]/15 flex items-center justify-center text-[#5B4FCF] font-bold text-lg">
              {observer.name.slice(0, 1)}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#3D3A5C]">{observer.name}</h2>
              <div className="text-xs text-[#8E8CA8] mt-0.5">
                {GENDER_LABEL[observer.gender] && <span>{GENDER_LABEL[observer.gender]} · </span>}
                {observer.profession || '未指定职业'}
                {observer.note && ` · ${observer.note}`}
              </div>
            </div>
          </div>
        </div>

        <TemperamentHero
          temperament={r.temperament}
          temperamentScores={r.temperamentScores}
          abilityScores={r.abilityScores}
        />
        <RadarChart scores={r.abilityScores} />
        <DimensionDetails scores={r.abilityScores} />
        <MotivationAnalysis scores={r.motivationScores} />
        <ThinkingAnalysis scores={r.thinkingScores} />

        <Disclaimer />
      </div>
    </div>
  );
}
