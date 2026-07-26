import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { AbilityScores, AbilityDimension } from '../../types';
import { abilityMap } from '../../data/results';

interface RadarChartProps {
  scores: AbilityScores;
}

// 自定义Tooltip
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { dimension: string; score: number } }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-xl bg-white/90 backdrop-blur-[10px] shadow-lg border border-white/60 px-3 py-2">
      <p className="text-sm font-semibold text-[#3D3A5C]">{data.dimension}</p>
      <p className="text-lg font-bold text-[#5B4FCF]">{data.score}<span className="text-xs font-normal text-[#A9A7C8] ml-0.5">pts</span></p>
    </div>
  );
}

// 自定义轴标签（带分数）
function CustomTick({ x, y, payload, scores }: { x: number; y: number; payload: { value: string }; scores: AbilityScores }) {
  const dimensionName = payload.value;
  // 找到对应的分数
  const scoreEntry = Object.entries(abilityMap).find(([, info]) => info.name === dimensionName);
  const score = scoreEntry ? scores[scoreEntry[0] as AbilityDimension] : 0;
  const scoreColor = score >= 70 ? '#5B4FCF' : score >= 40 ? '#8B7FD4' : '#B8B0E8';

  return (
    <g>
      <text x={x} y={y - 8} textAnchor="middle" fill="#5A5880" fontSize={12} fontWeight={500}>
        {dimensionName}
      </text>
      <text x={x} y={y + 7} textAnchor="middle" fill={scoreColor} fontSize={13} fontWeight={700}>
        {score}
      </text>
    </g>
  );
}

export default function RadarChart({ scores }: RadarChartProps) {
  const data: { dimension: string; score: number; fullMark: number }[] = (
    Object.keys(scores) as AbilityDimension[]
  ).map((key) => ({
    dimension: abilityMap[key].name,
    score: scores[key],
    fullMark: 100,
  }));

  return (
    <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
      <h3 className="text-sm font-semibold text-[#3D3A5C] mb-2">Ability Radar Chart</h3>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid
              stroke="#E0DCF5"
              strokeWidth={1}
              polarRadius={[25, 50, 75, 100]}
            />
            <PolarAngleAxis
              dataKey="dimension"
              tick={(props: { x: number; y: number; payload: { value: string } }) => (
                <CustomTick x={props.x} y={props.y} payload={props.payload} scores={scores} />
              )}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Ability Score"
              dataKey="score"
              stroke="#5B4FCF"
              strokeWidth={2.5}
              fill="url(#radarGradient)"
              fillOpacity={1}
              animationDuration={1200}
              animationEasing="ease-out"
              dot={{
                r: 4,
                fill: '#5B4FCF',
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5B4FCF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8B7FD4" stopOpacity={0.15} />
              </linearGradient>
            </defs>
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
      {/* 图例说明 */}
      <div className="flex justify-center gap-4 mt-2 text-xs text-[#A9A7C8]">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[#5B4FCF]" />
          70+ Strong
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[#8B7FD4]" />
          40-69 Balanced
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[#B8B0E8]" />
          &lt;40 Growth Area
        </span>
      </div>
    </div>
  );
}
