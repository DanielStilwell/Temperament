import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AbilityScores, AbilityDimension } from '../../types';

interface DimensionDetailsProps {
  scores: AbilityScores;
}

export default function DimensionDetails({ scores }: DimensionDetailsProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<AbilityDimension | null>(null);

  const toggle = (key: AbilityDimension) => {
    setExpanded(expanded === key ? null : key);
  };

  return (
    <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
      <h3 className="text-sm font-semibold text-[#3D3A5C] mb-3">{t('result.dimensionDetails')}</h3>
      <div className="space-y-2">
        {(Object.keys(scores) as AbilityDimension[]).map((key) => {
          const isExpanded = expanded === key;
          return (
            <div
              key={key}
              className="rounded-2xl border border-[#F0EEF8] overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggle(key)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F8F7FF] transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#3D3A5C]">{t(`abilities.${key}`)}</span>
                  <div className="w-20 h-2 bg-[#F0EEF8] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5B4FCF] to-[#7B6FE0] transition-all duration-500"
                      style={{ width: `${scores[key]}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#5B4FCF]">{scores[key]}%</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#A9A7C8] transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 text-sm text-[#6B6990] leading-[1.7]">
                  {t(`abilityDescription.${key}`)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}