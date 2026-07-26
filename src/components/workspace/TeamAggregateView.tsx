import { useMemo } from 'react';
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import type { Observer } from '../../types/account';
import { aggregateTeam, ABILITY_LABELS, TEMPERAMENT_LABELS } from '../../data/teamAggregate';
import type { AbilityDimension, TemperamentType } from '../../types';

const TEMPERAMENT_COLORS: Record<TemperamentType, string> = {
  sanguine: '#E8A87C',
  choleric: '#D96459',
  phlegmatic: '#6B9AC4',
  melancholic: '#8E7CC3',
};

interface Props {
  observers: Observer[];
}

export default function TeamAggregateView({ observers }: Props) {
  const aggregate = useMemo(() => aggregateTeam(observers), [observers]);

  if (observers.length === 0) {
    return (
      <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 text-center">
        <p className="text-sm text-[#8E8CA8]">No observers added, unable to generate team analysis</p>
      </div>
    );
  }

  // 雷达图数据
  const radarData = (Object.keys(ABILITY_LABELS) as AbilityDimension[]).map((k) => ({
    dimension: ABILITY_LABELS[k],
    score: aggregate.averageAbilities[k],
  }));

  // 气质分布柱状图数据
  const temperamentData = (Object.keys(TEMPERAMENT_LABELS) as TemperamentType[]).map((k) => ({
    name: TEMPERAMENT_LABELS[k],
    value: Math.round(aggregate.temperamentDistribution[k]),
    color: TEMPERAMENT_COLORS[k],
  }));

  // 动机数据
  const motivationData = [
    { name: 'Achievement', value: aggregate.averageMotivations.achievement },
    { name: 'Affiliation', value: aggregate.averageMotivations.affiliation },
    { name: 'Power', value: aggregate.averageMotivations.power },
    { name: 'Security', value: aggregate.averageMotivations.security },
  ];

  // 思维倾向数据（4 对）
  const thinkingData = [
    { name: 'Proactive', value: aggregate.averageThinking.proactive, left: 'Reactive', right: 'Proactive' },
    { name: 'Rational', value: aggregate.averageThinking.rational, left: 'Intuitive', right: 'Rational' },
    { name: 'Collaborative', value: aggregate.averageThinking.collaborative, left: 'Independent', right: 'Collaborative' },
    { name: 'Innovative', value: aggregate.averageThinking.innovative, left: 'Conventional', right: 'Innovative' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* 团队特质标签 */}
      <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#3D3A5C]">Team Trait Profile</h3>
          <span className="text-xs text-[#8E8CA8]">Based on {aggregate.size} observers</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {aggregate.teamTraits.map((trait, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-full bg-[#5B4FCF]/8 border border-[#5B4FCF]/15 text-xs font-medium text-[#5B4FCF]"
            >
              {trait}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E8E6F5]">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#5B4FCF]">{aggregate.diversity.temperament}</div>
            <div className="text-xs text-[#8E8CA8] mt-0.5">Temperament Diversity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#C9A86A]">{aggregate.diversity.abilities}</div>
            <div className="text-xs text-[#8E8CA8] mt-0.5">Ability Diversity</div>
          </div>
        </div>
      </div>

      {/* 能力雷达图 */}
      <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
        <h3 className="text-base font-bold text-[#3D3A5C] mb-4">Team Ability Average</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadar data={radarData} outerRadius="70%">
              <PolarGrid stroke="#E8E6F5" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#3D3A5C', fontSize: 13 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#8E8CA8', fontSize: 10 }} />
              <Radar
                name="Team Ability"
                dataKey="score"
                stroke="#5B4FCF"
                strokeWidth={2}
                fill="#5B4FCF"
                fillOpacity={0.35}
              />
            </RechartsRadar>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 气质分布柱状图 */}
      <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
        <h3 className="text-base font-bold text-[#3D3A5C] mb-4">Dominant Temperament Distribution</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={temperamentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#3D3A5C', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#8E8CA8', fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: 'rgba(91,79,207,0.05)' }}
                contentStyle={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(91,79,207,0.2)',
                  borderRadius: '12px',
                  fontSize: '13px',
                }}
                formatter={(v: number) => [`${v}%`, 'Percentage']}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {temperamentData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 动机与思维倾向 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
          <h3 className="text-base font-bold text-[#3D3A5C] mb-3">Motivation Average</h3>
          <div className="flex flex-col gap-2.5">
            {motivationData.map((m) => (
              <BarRow key={m.name} label={m.name} value={m.value} color="#6B9AC4" />
            ))}
          </div>
        </div>
        <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
          <h3 className="text-base font-bold text-[#3D3A5C] mb-3">Thinking Style Average</h3>
          <div className="flex flex-col gap-2.5">
            {thinkingData.map((t) => (
              <div key={t.name} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-[#8E8CA8]">
                  <span>{t.left}</span>
                  <span>{t.right}</span>
                </div>
                <BarRow label={t.name} value={t.value} color="#C9A86A" hideLabel />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BarRow({ label, value, color, hideLabel = false }: { label: string; value: number; color: string; hideLabel?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {!hideLabel && <span className="text-xs text-[#3D3A5C] w-10 flex-shrink-0">{label}</span>}
      <div className="flex-1 h-2 rounded-full bg-[#E8E6F5] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-xs font-medium text-[#3D3A5C] w-8 text-right">{value}</span>
    </div>
  );
}
