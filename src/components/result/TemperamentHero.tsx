import { useTranslation } from 'react-i18next';
import { temperamentMap, getInterpretation } from '../../data/results';
import type { TemperamentType, TemperamentScores, AbilityScores } from '../../types';

interface TemperamentHeroProps {
  temperament: TemperamentType;
  temperamentScores: TemperamentScores;
  abilityScores: AbilityScores;
}

export default function TemperamentHero({ temperament, temperamentScores, abilityScores }: TemperamentHeroProps) {
  const { t } = useTranslation();
  const info = temperamentMap[temperament];
  const interpretation = getInterpretation(temperament, temperamentScores, abilityScores, t);
  const features = t(`temperament.${temperament}.features`, { returnObjects: true }) as string[];

  return (
    <div className="space-y-4">
      {/* 气质概览卡片 */}
      <div
        className="rounded-[24px] p-8 text-center text-white relative overflow-hidden"
        style={{ background: info.gradient }}
      >
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-4 right-6 w-24 h-24 rounded-full bg-white" />
          <div className="absolute bottom-2 left-4 w-16 h-16 rounded-full bg-white" />
        </div>

        <div className="relative">
          <div className="text-5xl mb-3">{getAnimalEmoji(temperament)}</div>
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
            {t(`temperament.${temperament}.name`)}
          </h2>
          <p className="text-white/70 text-sm mb-4">{t(`temperament.${temperament}.animal`)}</p>

          <div className="flex flex-wrap justify-center gap-2">
            {features.map((f) => (
              <span
                key={f}
                className="px-3 py-1 rounded-full bg-white/20 text-sm text-white/90"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 气质维度得分 */}
      <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
        <h3 className="text-sm font-semibold text-[#3D3A5C] mb-3">{t('result.temperamentDistribution')}</h3>
        <div className="space-y-2.5">
          {(['sanguine', 'choleric', 'phlegmatic', 'melancholic'] as TemperamentType[]).map((tempType) => {
            const ti = temperamentMap[tempType];
            return (
              <div key={tempType} className="flex items-center gap-3">
                <span className="w-14 text-xs text-[#8E8CA8] flex-shrink-0">{t(`temperament.${tempType}.name`)}</span>
                <div className="flex-1 h-2.5 bg-[#F0EEF8] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${temperamentScores[tempType]}%`,
                      backgroundColor: ti.color,
                    }}
                  />
                </div>
                <span className="w-8 text-xs font-semibold text-right" style={{ color: ti.color }}>
                  {temperamentScores[tempType]}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 综合解读 */}
      <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
        <h3 className="text-sm font-semibold text-[#3D3A5C] mb-3">{t('result.comprehensiveInterpretation')}</h3>
        <p className="text-[15px] leading-[1.8] text-[#5A5880] whitespace-pre-line">
          {interpretation}
        </p>
      </div>
    </div>
  );
}

function getAnimalEmoji(temperament: TemperamentType): string {
  const map: Record<TemperamentType, string> = {
    sanguine: '🐬',
    choleric: '🦁',
    phlegmatic: '🐘',
    melancholic: '🦉',
  };
  return map[temperament];
}
