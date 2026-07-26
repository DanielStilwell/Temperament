import type { ThinkingScores } from '../../types';

interface ThinkingAnalysisProps {
  scores: ThinkingScores;
}

const thinkingDimensions = [
  {
    pair: ['proactive', 'reactive'],
    left: { name: 'Proactive', desc: 'Takes initiative, actively seeks solutions', color: '#FF6B6B' },
    right: { name: 'Reactive', desc: 'Waits and observes, tends to respond rather than initiate', color: '#4ECDC4' },
  },
  {
    pair: ['rational', 'emotional'],
    left: { name: 'Rational', desc: 'Focuses on logical analysis, objectively weighing pros and cons', color: '#6B9AC4' },
    right: { name: 'Intuitive', desc: 'Values emotional experience, makes judgments by intuition', color: '#E8A87C' },
  },
  {
    pair: ['independent', 'collaborative'],
    left: { name: 'Independent', desc: 'Prefers independent thinking, completes tasks autonomously', color: '#D96459' },
    right: { name: 'Collaborative', desc: 'Skilled at teamwork, values collective wisdom', color: '#8E7CC3' },
  },
  {
    pair: ['innovative', 'conventional'],
    left: { name: 'Innovative', desc: 'Pursues novel and unique approaches, breaks conventions', color: '#5B4FCF' },
    right: { name: 'Conventional', desc: 'Follows established norms, steady and reliable', color: '#A8E6CF' },
  },
];

export default function ThinkingAnalysis({ scores }: ThinkingAnalysisProps) {
  return (
    <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
      <h3 className="text-base font-semibold text-[#3D3A5C] mb-3 flex items-center gap-2">
        🧠 Thinking & Behavioral Tendencies
      </h3>

      <div className="space-y-4">
        {thinkingDimensions.map(({ pair, left, right }) => {
          const leftScore = scores[pair[0] as keyof ThinkingScores];
          const rightScore = scores[pair[1] as keyof ThinkingScores];
          const total = leftScore + rightScore || 1;
          const leftPercent = Math.round((leftScore / total) * 100);

          // 判断倾向程度
          let tendency = '';
          if (leftPercent >= 65) {
            tendency = `${left.name} Lean`;
          } else if (leftPercent <= 35) {
            tendency = `${right.name} Lean`;
          } else {
            tendency = 'Balanced';
          }

          return (
            <div key={pair[0]} className="p-3 rounded-xl bg-[#F8F7FF] border border-[#E8E6F5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#5A5880]">{left.name}</span>
                <span className="text-xs font-semibold text-[#5B4FCF]">{tendency}</span>
                <span className="text-sm font-medium text-[#5A5880]">{right.name}</span>
              </div>

              {/* 对比进度条 */}
              <div className="relative h-3 bg-white rounded-full overflow-hidden flex">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${leftPercent}%`,
                    backgroundColor: left.color,
                  }}
                />
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${100 - leftPercent}%`,
                    backgroundColor: right.color,
                  }}
                />
                {/* 中线 */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50" />
              </div>

              {/* 百分比 */}
              <div className="flex justify-between mt-1">
                <span className="text-xs font-semibold" style={{ color: left.color }}>
                  {leftPercent}%
                </span>
                <span className="text-xs font-semibold" style={{ color: right.color }}>
                  {100 - leftPercent}%
                </span>
              </div>

              {/* 解读 */}
              <p className="text-xs text-[#8E8CA8] mt-2 leading-[1.5]">
                {leftPercent >= 65 ? left.desc : leftPercent <= 35 ? right.desc : 'Combines both traits, able to flexibly adjust thinking and behavior based on context'}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#8E8CA8] mt-3 italic">
        * Thinking & behavioral tendencies are not fixed and may adjust with context and personal growth
      </p>
    </div>
  );
}
