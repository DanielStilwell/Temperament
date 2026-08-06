import { useTranslation } from 'react-i18next';
import type { ThinkingScores } from '../../types';

interface ThinkingAnalysisProps {
  scores: ThinkingScores;
}

const thinkingDimensions = [
  {
    pair: ['proactive', 'reactive'] as const,
    left: { i18nKey: 'proactive', color: '#FF6B6B' },
    right: { i18nKey: 'reactive', color: '#4ECDC4' },
  },
  {
    pair: ['rational', 'emotional'] as const,
    left: { i18nKey: 'rational', color: '#6B9AC4' },
    right: { i18nKey: 'intuitive', color: '#E8A87C' },
  },
  {
    pair: ['independent', 'collaborative'] as const,
    left: { i18nKey: 'independent', color: '#D96459' },
    right: { i18nKey: 'collaborative', color: '#8E7CC3' },
  },
  {
    pair: ['innovative', 'conventional'] as const,
    left: { i18nKey: 'innovative', color: '#5B4FCF' },
    right: { i18nKey: 'conventional', color: '#A8E6CF' },
  },
];

export default function ThinkingAnalysis({ scores }: ThinkingAnalysisProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
      <h3 className="text-base font-semibold text-[#3D3A5C] mb-3 flex items-center gap-2">
        {t('result.thinkingTitle')}
      </h3>

      <div className="space-y-4">
        {thinkingDimensions.map(({ pair, left, right }) => {
          const leftScore = scores[pair[0] as keyof ThinkingScores];
          const rightScore = scores[pair[1] as keyof ThinkingScores];
          const total = leftScore + rightScore || 1;
          const leftPercent = Math.round((leftScore / total) * 100);

          const leftName = t(`thinking.${left.i18nKey}.name`);
          const rightName = t(`thinking.${right.i18nKey}.name`);

          // 判断倾向程度
          let tendency = '';
          if (leftPercent >= 65) {
            tendency = t('result.thinkingLean', { name: leftName });
          } else if (leftPercent <= 35) {
            tendency = t('result.thinkingLean', { name: rightName });
          } else {
            tendency = t('result.thinkingBalanced');
          }

          return (
            <div key={pair[0]} className="p-3 rounded-xl bg-[#F8F7FF] border border-[#E8E6F5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#5A5880]">{leftName}</span>
                <span className="text-xs font-semibold text-[#5B4FCF]">{tendency}</span>
                <span className="text-sm font-medium text-[#5A5880]">{rightName}</span>
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
                {leftPercent >= 65
                  ? t(`thinking.${left.i18nKey}.desc`)
                  : leftPercent <= 35
                    ? t(`thinking.${right.i18nKey}.desc`)
                    : t('result.thinkingBalancedDesc')}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#8E8CA8] mt-3 italic">
        {t('result.thinkingFooter')}
      </p>
    </div>
  );
}
