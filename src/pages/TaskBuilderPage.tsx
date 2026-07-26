import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, Save, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import ObserverList from '../components/workspace/ObserverList';
import { useAuthStore } from '../stores/auth';
import { listObservers } from '../lib/observers';
import { createTask } from '../lib/tasks';
import { predictTask, TASK_TEMPLATES, emptyTaskParams } from '../data/prediction';
import type { TaskParams, TaskTeamConfig, Observer, TaskType } from '../types/account';

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  creative: 'Creative',
  execution: 'Execution',
  communication: 'Communication',
  analysis: 'Analysis',
  leadership: 'Leadership',
  resilience: 'Resilience',
};

const ABILITY_FIELDS: { key: keyof TaskParams['abilities']; label: string }[] = [
  { key: 'communication', label: 'Communication' },
  { key: 'leadership', label: 'Leadership' },
  { key: 'creativity', label: 'Creativity' },
  { key: 'analysis', label: 'Analysis' },
  { key: 'resilience', label: 'Resilience' },
  { key: 'empathy', label: 'Empathy' },
];

const MOTIVATION_FIELDS: { key: keyof TaskParams['motivations']; label: string }[] = [
  { key: 'achievement', label: 'Achievement' },
  { key: 'affiliation', label: 'Affiliation' },
  { key: 'power', label: 'Power' },
  { key: 'security', label: 'Security' },
];

const THINKING_FIELDS: { key: keyof TaskParams['thinking']; label: string; left: string; right: string }[] = [
  { key: 'proactive', label: 'Action', left: 'Reactive', right: 'Proactive' },
  { key: 'rational', label: 'Decision', left: 'Intuitive', right: 'Rational' },
  { key: 'collaborative', label: 'Style', left: 'Independent', right: 'Collaborative' },
  { key: 'innovative', label: 'Innovation', left: 'Conventional', right: 'Innovative' },
];

export default function TaskBuilderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [observers, setObservers] = useState<Observer[]>([]);
  const [loadingObservers, setLoadingObservers] = useState(true);
  const [name, setName] = useState('');
  const [params, setParams] = useState<TaskParams>(emptyTaskParams());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hasKeyRole, setHasKeyRole] = useState(false);
  const [keyObserverId, setKeyObserverId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(TASK_TEMPLATES[0]?.id ?? null);

  // 加载被观察者列表，并应用 URL 中的预选成员
  useEffect(() => {
    (async () => {
      const list = await listObservers();
      setObservers(list);
      setLoadingObservers(false);

      // 从 URL ?preselect=id1,id2,id3 接收预选成员
      const preselect = searchParams.get('preselect');
      if (preselect) {
        const ids = preselect.split(',').filter((id) => list.some((o) => o.id === id));
        if (ids.length > 0) {
          setSelectedIds(ids);
        }
      }
    })();
  }, []);

  const applyTemplate = (templateId: string) => {
    const tpl = TASK_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    setActiveTemplateId(templateId);
    setParams(JSON.parse(JSON.stringify(tpl.params)));
    if (!name) setName(tpl.name);
  };

  const switchMode = (m: 'template' | 'custom') => {
    setMode(m);
    if (m === 'custom' && activeTemplateId === null) {
      // 切到自定义时若未选模板，保留当前参数
    }
  };

  const toggleTaskType = (t: TaskType) => {
    setParams((p) => ({
      ...p,
      base: {
        ...p.base,
        types: p.base.types.includes(t) ? p.base.types.filter((x) => x !== t) : [...p.base.types, t],
      },
    }));
  };

  const toggleSelectObserver = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    if (keyObserverId === id) {
      setKeyObserverId(null);
      setHasKeyRole(false);
    }
  };

  const handlePredict = async () => {
    if (!name.trim() || selectedIds.length === 0) return;
    setSubmitting(true);
    try {
      const teamConfig: TaskTeamConfig = {
        selectedObserverIds: selectedIds,
        minSize: 1,
        hasKeyRole: hasKeyRole && !!keyObserverId,
        keyObserverId: hasKeyRole ? keyObserverId : null,
      };
      const prediction = predictTask(params, teamConfig, observers);
      const record = await createTask({ name: name.trim(), taskParams: params, teamConfig, prediction });
      navigate(`/task/${record.id}`);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Prediction failed, please retry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 pb-10">
      <div className="max-w-[420px] md:max-w-[820px] lg:max-w-[960px] mx-auto flex flex-col gap-5">
        <Link to="/max" className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Max Workspace
        </Link>

        <div className="rounded-[20px] bg-gradient-to-br from-[#C9A86A] via-[#D4B575] to-[#E5C58A] p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
              New Task Prediction
            </h2>
          </div>
          <p className="text-white/85 text-sm leading-relaxed">
            Configure task parameters and team, system will predict completion based on temperament and ability dimensions
          </p>
        </div>

        {/* 任务名称 + 模板切换 */}
        <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3D3A5C]">Task Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Q4 Product Launch Sprint"
              className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-[#E8E6F5] text-[#3D3A5C] text-sm placeholder:text-[#8E8CA8]/60 focus:outline-none focus:border-[#C9A86A] focus:bg-white transition-all"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[#3D3A5C]">Input Mode</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => switchMode('template')}
                className={`px-3 py-2.5 rounded-2xl text-sm font-medium border-2 transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'template' ? 'border-[#C9A86A] bg-[#C9A86A]/5 text-[#C9A86A]' : 'border-[#E8E6F5] bg-white/40 text-[#3D3A5C]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Template
              </button>
              <button
                type="button"
                onClick={() => switchMode('custom')}
                className={`px-3 py-2.5 rounded-2xl text-sm font-medium border-2 transition-all ${
                  mode === 'custom' ? 'border-[#C9A86A] bg-[#C9A86A]/5 text-[#C9A86A]' : 'border-[#E8E6F5] bg-white/40 text-[#3D3A5C]'
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {mode === 'template' && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#3D3A5C]">Select Task Template</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {TASK_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => applyTemplate(tpl.id)}
                    className={`px-3 py-3 rounded-2xl text-left border-2 transition-all ${
                      activeTemplateId === tpl.id
                        ? 'border-[#C9A86A] bg-[#C9A86A]/5'
                        : 'border-[#E8E6F5] bg-white/40 hover:border-[#D4B575]'
                    }`}
                  >
                    <div className="text-sm font-semibold text-[#3D3A5C]">{tpl.name}</div>
                    <div className="text-xs text-[#8E8CA8] mt-0.5 leading-relaxed">{tpl.description}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#8E8CA8] mt-1">You can fine-tune parameters after selecting a template</p>
            </div>
          )}
        </div>

        {/* 任务基础参数 */}
        <Section title="Basic Parameters">
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-xs font-medium text-[#3D3A5C]">Task Types (multiple)</span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TASK_TYPE_LABELS) as TaskType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTaskType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                    params.base.types.includes(t)
                      ? 'border-[#C9A86A] bg-[#C9A86A]/10 text-[#C9A86A]'
                      : 'border-[#E8E6F5] bg-white/40 text-[#3D3A5C]'
                  }`}
                >
                  {TASK_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <Slider
            label="Difficulty"
            value={params.base.difficulty}
            min={1}
            max={10}
            step={1}
            display={`${params.base.difficulty} / 10`}
            onChange={(v) => setParams((p) => ({ ...p, base: { ...p.base, difficulty: v } }))}
            accent="#C9A86A"
          />
          <Slider
            label="Collaboration"
            value={params.base.collaboration}
            min={0}
            max={100}
            step={5}
            display={`${params.base.collaboration}%`}
            onChange={(v) => setParams((p) => ({ ...p, base: { ...p.base, collaboration: v } }))}
            accent="#C9A86A"
            leftLabel="Independent"
            rightLabel="Full Collaboration"
          />
          <Slider
            label="Time Pressure"
            value={params.base.timePressure}
            min={1}
            max={10}
            step={1}
            display={`${params.base.timePressure} / 10`}
            onChange={(v) => setParams((p) => ({ ...p, base: { ...p.base, timePressure: v } }))}
            accent="#C9A86A"
            leftLabel="Relaxed"
            rightLabel="Urgent"
          />
          <Slider
            label="Risk Tolerance"
            value={params.base.riskTolerance}
            min={0}
            max={100}
            step={5}
            display={`${params.base.riskTolerance}%`}
            onChange={(v) => setParams((p) => ({ ...p, base: { ...p.base, riskTolerance: v } }))}
            accent="#C9A86A"
            leftLabel="Zero Error"
            rightLabel="Encourage Risk"
          />
        </Section>

        {/* 能力要求 */}
        <Section title="Ability Requirements (0-100)">
          <p className="text-xs text-[#8E8CA8] mb-3">Minimum ability thresholds for this task, overlay on radar chart to compare with team abilities</p>
          <div className="flex flex-col gap-3">
            {ABILITY_FIELDS.map((f) => (
              <Slider
                key={f.key}
                label={f.label}
                value={params.abilities[f.key]}
                min={0}
                max={100}
                step={5}
                display={`${params.abilities[f.key]}`}
                onChange={(v) => setParams((p) => ({ ...p, abilities: { ...p.abilities, [f.key]: v } }))}
                accent="#5B4FCF"
              />
            ))}
          </div>
        </Section>

        {/* 动机要求 */}
        <Section title="Motivation Requirements (0-100)">
          <p className="text-xs text-[#8E8CA8] mb-3">Expected motivation strength, higher means more dependent</p>
          <div className="flex flex-col gap-3">
            {MOTIVATION_FIELDS.map((f) => (
              <Slider
                key={f.key}
                label={f.label}
                value={params.motivations[f.key]}
                min={0}
                max={100}
                step={5}
                display={`${params.motivations[f.key]}`}
                onChange={(v) => setParams((p) => ({ ...p, motivations: { ...p.motivations, [f.key]: v } }))}
                accent="#6B9AC4"
              />
            ))}
          </div>
        </Section>

        {/* 思维倾向要求 */}
        <Section title="Thinking Style Requirements (0-100)">
          <p className="text-xs text-[#8E8CA8] mb-3">0=left end, 100=right end, 50=neutral</p>
          <div className="flex flex-col gap-3">
            {THINKING_FIELDS.map((f) => (
              <Slider
                key={f.key}
                label={f.label}
                value={params.thinking[f.key]}
                min={0}
                max={100}
                step={5}
                display={`${params.thinking[f.key]}`}
                onChange={(v) => setParams((p) => ({ ...p, thinking: { ...p.thinking, [f.key]: v } }))}
                accent="#8E7CC3"
                leftLabel={f.left}
                rightLabel={f.right}
              />
            ))}
          </div>
        </Section>

        {/* 团队配置 */}
        <Section title="Team Configuration">
          <p className="text-xs text-[#8E8CA8] mb-3">
            Select observers for this task ({selectedIds.length} selected)
          </p>
          <ObserverList
            observers={observers}
            loading={loadingObservers}
            onDelete={async () => {}}
            selectable
            selectedIds={selectedIds}
            onToggleSelect={toggleSelectObserver}
            emptyHint="No observers yet, add them in workspace first"
          />

          {selectedIds.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-[#3D3A5C]">
                <input
                  type="checkbox"
                  checked={hasKeyRole}
                  onChange={(e) => {
                    setHasKeyRole(e.target.checked);
                    if (!e.target.checked) setKeyObserverId(null);
                  }}
                  className="w-4 h-4 accent-[#C9A86A]"
                />
                Assign key role (lead, leadership/resilience weighted 2x)
              </label>
              {hasKeyRole && (
                <select
                  value={keyObserverId ?? ''}
                  onChange={(e) => setKeyObserverId(e.target.value || null)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/70 border border-[#E8E6F5] text-[#3D3A5C] text-sm focus:outline-none focus:border-[#C9A86A]"
                >
                  <option value="">Select key member</option>
                  {observers
                    .filter((o) => selectedIds.includes(o.id))
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                </select>
              )}
            </div>
          )}
        </Section>

        <Disclaimer />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handlePredict}
          disabled={submitting || !name.trim() || selectedIds.length === 0}
          className="disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Generate Prediction
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
      <h3 className="text-base font-bold text-[#3D3A5C] mb-3">{title}</h3>
      {children}
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
  accent?: string;
  leftLabel?: string;
  rightLabel?: string;
}

function Slider({ label, value, min, max, step, display, onChange, accent = '#5B4FCF', leftLabel, rightLabel }: SliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#3D3A5C]">{label}</span>
        <span className="text-xs font-semibold" style={{ color: accent }}>
          {display}
        </span>
      </div>
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-[10px] text-[#8E8CA8]">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${accent} 0%, ${accent} ${((value - min) / (max - min)) * 100}%, #E8E6F5 ${((value - min) / (max - min)) * 100}%, #E8E6F5 100%)`,
        }}
      />
    </div>
  );
}
