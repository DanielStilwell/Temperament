import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Users, Lightbulb, AlertTriangle, ChevronRight } from 'lucide-react';
import { listObservers } from '../../lib/observers';
import { recommendCombinations, type TeamCombination } from '../../lib/teamCombination';
import type { TaskParams, Observer } from '../../types/account';
import type { AbilityDimension, TemperamentType } from '../../types';

const TEMPERAMENT_COLORS: Record<TemperamentType, { bg: string; text: string }> = {
  sanguine: { bg: 'bg-[#FDF0E6]', text: 'text-[#E8A87C]' },
  choleric: { bg: 'bg-[#FBE8E6]', text: 'text-[#D96459]' },
  phlegmatic: { bg: 'bg-[#E8F0F8]', text: 'text-[#6B9AC4]' },
  melancholic: { bg: 'bg-[#F0ECF8]', text: 'text-[#8E7CC3]' },
};

interface Props {
  taskParams: TaskParams;
}

export default function CombinationRecommender({ taskParams }: Props) {
  const { t } = useTranslation();
  const [combinations, setCombinations] = useState<TeamCombination[]>([]);
  const [loading, setLoading] = useState(true);
  const [observers, setObservers] = useState<Observer[]>([]);

  useEffect(() => {
    (async () => {
      const list = await listObservers();
      setObservers(list);
      const combos = recommendCombinations(taskParams, list);
      setCombinations(combos);
      setLoading(false);
    })();
  }, [taskParams]);

  if (loading) {
    return (
      <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-[#C9A86A] animate-spin" />
        <span className="text-sm text-[#8E8CA8]">{t('combination.loading')}</span>
      </div>
    );
  }

  if (combinations.length === 0) {
    return (
      <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#C9A86A]/10 flex items-center justify-center mx-auto mb-3">
          <Users className="w-6 h-6 text-[#C9A86A]" />
        </div>
        <p className="text-sm text-[#8E8CA8]">{t('combination.empty')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-[#C9A86A]" />
        <h3 className="text-base font-bold text-[#3D3A5C]">{t('combination.title')}</h3>
      </div>
      <p className="text-xs text-[#8E8CA8] mb-4">{t('combination.subtitle')}</p>

      <div className="flex flex-col gap-4">
        {combinations.map((combo, i) => {
          const synergyColor = combo.synergyScore >= 70 ? '#5B8C5A' : combo.synergyScore >= 50 ? '#C9A86A' : '#D96459';
          const strategyLabel = t(`combination.strategy.${combo.strategyKey}`);
          const rationaleText = t(`combination.rationale.${combo.strategyKey}`, combo.rationaleParams);
          const riskText = t(`combination.risk.${combo.strategyKey}`, combo.riskParams);

          return (
            <div key={i} className="rounded-2xl bg-gradient-to-br from-[#C9A86A]/5 to-[#E5C58A]/5 border border-[#C9A86A]/15 p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#C9A86A]/15 text-[#C9A86A] text-xs font-medium">
                    #{i + 1} {strategyLabel}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: synergyColor }}>
                    {combo.synergyScore}
                  </div>
                  <div className="text-[10px] text-[#8E8CA8]">{t('combination.synergyScore')}</div>
                </div>
              </div>

              {/* Completion probability bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#8E8CA8]">{t('combination.completionProb')}</span>
                  <span className="font-medium" style={{ color: synergyColor }}>{combo.completionProbability}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#E8E6F5] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${combo.completionProbability}%`, background: synergyColor }}
                  />
                </div>
                <div className="mt-1 text-[10px] text-[#8E8CA8]/70 italic">
                  {t('combination.forReferenceOnly')}
                </div>
              </div>

              {/* Members */}
              <div className="flex flex-col gap-1.5 mb-3">
                {combo.members.map((m, j) => {
                  const tempColor = TEMPERAMENT_COLORS[m.temperament] || TEMPERAMENT_COLORS.sanguine;
                  return (
                    <div key={m.observerId} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/40">
                      <span className="text-xs text-[#8E8CA8] w-4">{j + 1}</span>
                      <span className="text-sm font-medium text-[#3D3A5C] flex-1 truncate">{m.observerName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${tempColor.bg} ${tempColor.text}`}>
                        {t(`temperament.${m.temperament}.animal`)}
                      </span>
                      <span className="text-[10px] text-[#8E8CA8]">{t(`abilities.${m.roleKey}`)}</span>
                      <span className="text-xs font-bold text-[#C9A86A] w-8 text-right">{m.fitScore}</span>
                    </div>
                  );
                })}
              </div>

              {/* Rationale */}
              <div className="flex items-start gap-1.5 mb-2">
                <ChevronRight className="w-3.5 h-3.5 text-[#5B8C5A] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#3D3A5C] leading-relaxed">{rationaleText}</p>
              </div>

              {/* Risk */}
              <div className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#8E8CA8] leading-relaxed">{riskText}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
