import type { ThinkingScores } from '../../types';

interface ThinkingAnalysisProps {
  scores: ThinkingScores;
}

const thinkingDimensions = [
  {
    pair: ['proactive', 'reactive'],
    left: { name: '主动型', desc: '主动采取行动，积极寻求解决方案', color: '#FF6B6B' },
    right: { name: '被动型', desc: '等待观望，倾向于回应而非发起', color: '#4ECDC4' },
  },
  {
    pair: ['rational', 'emotional'],
    left: { name: '理性型', desc: '注重逻辑分析，客观权衡利弊', color: '#6B9AC4' },
    right: { name: '感性型', desc: '重视情感体验，凭直觉做判断', color: '#E8A87C' },
  },
  {
    pair: ['independent', 'collaborative'],
    left: { name: '独立型', desc: '偏好独立思考，自主完成任务', color: '#D96459' },
    right: { name: '协作型', desc: '善于团队合作，重视集体智慧', color: '#8E7CC3' },
  },
  {
    pair: ['innovative', 'conventional'],
    left: { name: '创新型', desc: '追求新颖独特，勇于打破常规', color: '#5B4FCF' },
    right: { name: '传统型', desc: '遵循既定规范，稳健可靠', color: '#A8E6CF' },
  },
];

export default function ThinkingAnalysis({ scores }: ThinkingAnalysisProps) {
  return (
    <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
      <h3 className="text-base font-semibold text-[#3D3A5C] mb-3 flex items-center gap-2">
        🧠 思维行为倾向
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
            tendency = `偏${left.name}`;
          } else if (leftPercent <= 35) {
            tendency = `偏${right.name}`;
          } else {
            tendency = '均衡型';
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
                {leftPercent >= 65 ? left.desc : leftPercent <= 35 ? right.desc : '两者特点兼具，能够根据情境灵活调整思维和行为方式'}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#8E8CA8] mt-3 italic">
        * 思维行为倾向并非固定不变，会随情境和成长而调整
      </p>
    </div>
  );
}