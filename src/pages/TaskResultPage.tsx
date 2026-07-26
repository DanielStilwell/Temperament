import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Loader2, Trash2, AlertTriangle, CheckCircle2, Trophy, Target,
} from 'lucide-react';
import {
  Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import { listTasks, deleteTask } from '../lib/tasks';
import type { TaskRecord } from '../types/account';
import type { AbilityDimension } from '../types';

const ABILITY_LABELS: Record<AbilityDimension, string> = {
  communication: 'Communication',
  leadership: 'Leadership',
  creativity: 'Creativity',
  analysis: 'Analysis',
  resilience: 'Resilience',
  empathy: 'Empathy',
};

const RISK_COLORS = {
  yellow: { bg: 'bg-amber-50/70', border: 'border-amber-200/60', text: 'text-amber-700', label: 'Low' },
  orange: { bg: 'bg-orange-50/70', border: 'border-orange-200/60', text: 'text-orange-700', label: 'Medium' },
  red: { bg: 'bg-red-50/70', border: 'border-red-200/60', text: 'text-red-700', label: 'High' },
};

export default function TaskResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await listTasks();
      setTask(list.find((t) => t.id === id) ?? null);
      setLoading(false);
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!task) return;
    if (!confirm(`Confirm delete task "${task.name}"?`)) return;
    setDeleting(true);
    try {
      await deleteTask(task.id);
      navigate('/max');
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

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-[#8E8CA8]">Task not found</p>
        <Link to="/max" className="text-sm text-[#5B4FCF] hover:underline">Back to Max Workspace</Link>
      </div>
    );
  }

  const p = task.prediction;
  const radarData = (Object.keys(ABILITY_LABELS) as AbilityDimension[]).map((k) => ({
    dimension: ABILITY_LABELS[k],
    required: p.requiredAbilities[k],
    actual: p.teamAbilityAverage[k],
  }));

  // 完成概率配色
  const probColor = p.completionProbability >= 70 ? '#5B8C5A' : p.completionProbability >= 40 ? '#C9A86A' : '#D96459';
  const probLabel = p.completionProbability >= 70 ? 'Good prospects' : p.completionProbability >= 40 ? 'Moderate risk' : 'Poor prospects';

  return (
    <div className="min-h-screen p-4 pb-10">
      <div className="max-w-[420px] md:max-w-[820px] lg:max-w-[960px] mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Link to="/max" className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Max Workspace
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors disabled:opacity-40"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete Task
          </button>
        </div>

        {/* 任务标题 */}
        <div className="rounded-[20px] bg-gradient-to-br from-[#C9A86A] via-[#D4B575] to-[#E5C58A] p-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs text-white/80">Task Prediction Result</span>
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
            {task.name}
          </h2>
          <p className="text-white/85 text-sm">
            Based on {task.teamConfig.selectedObserverIds.length} selected observers' temperament and ability dimensions
          </p>
        </div>

        {/* 完成概率 */}
        <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-6 text-center">
          <div className="text-xs text-[#8E8CA8] mb-2">Completion Probability</div>
          <div className="text-5xl font-bold mb-2" style={{ color: probColor }}>
            {p.completionProbability}%
          </div>
          <div className="text-sm font-medium" style={{ color: probColor }}>
            {probLabel}
          </div>
          <div className="mt-3 text-xs text-[#8E8CA8] leading-relaxed max-w-md mx-auto">
            Fit Score {p.overallFit} · Difficulty {task.params.base.difficulty} · Time Pressure {task.params.base.timePressure} · Risk Tolerance {task.params.base.riskTolerance}
          </div>
        </div>

        {/* 适配度雷达图 */}
        <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
          <h3 className="text-base font-bold text-[#3D3A5C] mb-2">Fit Radar Chart</h3>
          <p className="text-xs text-[#8E8CA8] mb-3">
            <span className="inline-block w-3 h-0.5 bg-[#C9A86A] align-middle mr-1" />Task Requirements
            <span className="inline-block w-3 h-0.5 bg-[#5B4FCF] align-middle mr-1 ml-3" />Team Actual
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadar data={radarData} outerRadius="70%">
                <PolarGrid stroke="#E8E6F5" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#3D3A5C', fontSize: 13 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#8E8CA8', fontSize: 10 }} />
                <Radar name="Task Requirements" dataKey="required" stroke="#C9A86A" strokeWidth={2} fill="#C9A86A" fillOpacity={0.15} />
                <Radar name="Team Actual" dataKey="actual" stroke="#5B4FCF" strokeWidth={2} fill="#5B4FCF" fillOpacity={0.3} />
              </RechartsRadar>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 推荐核心成员 */}
        {p.recommendedMembers.length > 0 && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-[#C9A86A]" />
              <h3 className="text-base font-bold text-[#3D3A5C]">Recommended Core Members (Top 3 by Fit)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {p.recommendedMembers.map((m, i) => (
                <div key={m.observerId} className="rounded-2xl bg-gradient-to-br from-[#C9A86A]/8 to-[#E5C58A]/8 border border-[#C9A86A]/15 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#3D3A5C]">{m.observerName}</span>
                    <span className="text-xs text-[#8E8CA8]">#{i + 1}</span>
                  </div>
                  <div className="text-2xl font-bold text-[#C9A86A]">{m.fitScore}</div>
                  <div className="text-xs text-[#8E8CA8]">Overall Fit Score</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 优势项 */}
        {p.strengths.length > 0 && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <h3 className="text-base font-bold text-[#3D3A5C]">Strengths</h3>
            </div>
            <div className="flex flex-col gap-2">
              {p.strengths.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-green-50/60 border border-green-200/40">
                  <div>
                    <div className="text-sm font-medium text-[#3D3A5C]">{s.label}</div>
                    <div className="text-xs text-[#8E8CA8]">Required {s.required} · Actual {s.actual}</div>
                  </div>
                  <span className="text-sm font-bold text-green-700">+{s.surplus}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 风险点 */}
        {p.risks.length > 0 ? (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-[#3D3A5C]">Risk Points ({p.risks.length})</h3>
            </div>
            <div className="flex flex-col gap-2">
              {p.risks.map((r, i) => {
                const c = RISK_COLORS[r.level];
                return (
                  <div key={i} className={`p-3 rounded-2xl border ${c.bg} ${c.border}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#3D3A5C]">{r.label}</span>
                      <span className={`text-xs font-medium ${c.text}`}>{c.label}</span>
                    </div>
                    <div className="text-xs text-[#8E8CA8] mb-1">
                      Required {r.required} · Actual {r.actual} · Gap {r.gap}
                    </div>
                    <div className="text-xs text-[#5B4FCF]">{r.suggestion}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-[20px] bg-green-50/50 border border-green-200/40 p-5 text-center">
            <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700">No risk points detected, team configuration matches task requirements well</p>
          </div>
        )}

        {/* 详细匹配表 */}
        <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
          <h3 className="text-base font-bold text-[#3D3A5C] mb-3">Detailed Match</h3>
          <MatchTable title="Ability Dimensions" matches={p.abilityMatches} />
          <MatchTable title="Motivation Match" matches={p.motivationMatches} />
          <MatchTable title="Thinking Style" matches={p.thinkingMatches} />
        </div>

        <Disclaimer />

        <Button variant="outline" size="md" fullWidth onClick={() => navigate('/max')}>
          Back to Max Workspace
        </Button>
      </div>
    </div>
  );
}

function MatchTable({ title, matches }: { title: string; matches: { label: string; required: number; actual: number; gap: number; matchScore: number }[] }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="text-xs font-semibold text-[#8E8CA8] mb-1.5">{title}</div>
      <div className="flex flex-col gap-1">
        {matches.map((m, i) => {
          const isRisk = m.gap <= -15;
          const isStrength = m.gap >= 15;
          return (
            <div key={i} className="grid grid-cols-4 gap-2 text-xs px-2 py-1.5 rounded-lg bg-white/40">
              <span className="text-[#3D3A5C] font-medium">{m.label}</span>
              <span className="text-[#8E8CA8]">Required {m.required}</span>
              <span className="text-[#8E8CA8]">Actual {m.actual}</span>
              <span className={`font-medium ${isRisk ? 'text-red-600' : isStrength ? 'text-green-600' : 'text-[#5B4FCF]'}`}>
                {m.matchScore}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
