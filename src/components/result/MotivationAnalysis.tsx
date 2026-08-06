import { useTranslation } from 'react-i18next';
import type { MotivationScores } from '../../types';

interface MotivationAnalysisProps {
  scores: MotivationScores;
}

const motivationInfo: Record<keyof MotivationScores, { icon: string; color: string }> = {
  achievement: {
    icon: '🎯',
    color: '#FF6B6B',
  },
  affiliation: {
    icon: '🤝',
    color: '#4ECDC4',
  },
  power: {
    icon: '⚡',
    color: '#FFE66D',
  },
  security: {
    icon: '🛡️',
    color: '#A8E6CF',
  },
};

export default function MotivationAnalysis({ scores }: MotivationAnalysisProps) {
  const { t } = useTranslation();

  const sortedScores = Object.entries(scores)
    .map(([key, value]) => ({
      key: key as keyof MotivationScores,
      value,
      info: motivationInfo[key as keyof typeof motivationInfo],
    }))
    .sort((a, b) => b.value - a.value);

  const dominantMotivation = sortedScores[0];
  const secondaryMotivation = sortedScores[1];

  const getDescription = (key: keyof MotivationScores, score: number) => {
    if (score >= 70) return t(`motivations.${key}.high`);
    if (score >= 40) return t(`motivations.${key}.medium`);
    return t(`motivations.${key}.low`);
  };

  return (
    <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
      <h3 className="text-base font-semibold text-[#3D3A5C] mb-3 flex items-center gap-2">
        {t('result.motivationAnalysis')}
      </h3>

      {/* 主要动机 */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#5B4FCF]/5 to-[#7B6FE0]/5 border border-[#E0DCF5]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{dominantMotivation.info.icon}</span>
          <span className="text-sm font-semibold text-[#3D3A5C]">
            {t('result.dominant', { name: t(`motivations.${dominantMotivation.key}.name`) })}
          </span>
        </div>
        <p className="text-sm text-[#6B6990] leading-[1.6]">
          {getDescription(dominantMotivation.key, dominantMotivation.value)}
        </p>
      </div>

      {/* 次要动机（得分≥30%时显示） */}
      {secondaryMotivation.value >= 30 && (
        <div className="mb-4 p-3 rounded-xl bg-[#F8F7FF] border border-[#E8E6F5]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{secondaryMotivation.info.icon}</span>
            <span className="text-sm font-medium text-[#5A5880]">
              {t('result.secondary', { name: t(`motivations.${secondaryMotivation.key}.name`) })}
            </span>
          </div>
          <p className="text-sm text-[#8E8CA8] leading-[1.6]">
            {getDescription(secondaryMotivation.key, secondaryMotivation.value)}
          </p>
        </div>
      )}

      {/* 动机得分条 */}
      <div className="space-y-2">
        {sortedScores.map(({ key, value, info }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#5A5880] w-20">{t(`motivations.${key}.name`)}</span>
            <div className="flex-1 h-2 bg-[#F0EEF8] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${value}%`,
                  backgroundColor: info.color,
                }}
              />
            </div>
            <span className="text-sm font-semibold text-[#5B4FCF] w-10 text-right">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
