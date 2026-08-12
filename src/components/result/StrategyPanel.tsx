import { useTranslation } from 'react-i18next';
import { Sparkles, TrendingUp, MessageCircle, Target, Users, AlertTriangle } from 'lucide-react';
import type { TemperamentType, AbilityScores, MotivationScores } from '../../types';

interface StrategyPanelProps {
  temperament: TemperamentType;
  abilityScores: AbilityScores;
  motivationScores: MotivationScores;
}

export default function StrategyPanel({ temperament, abilityScores, motivationScores }: StrategyPanelProps) {
  const { t } = useTranslation();

  // 能力排序：高分=优势，低分=待发展
  const sortedAbilities = Object.entries(abilityScores)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);
  const topAbilities = sortedAbilities.slice(0, 2);
  const bottomAbilities = sortedAbilities.slice(-2);

  // 主要动机
  const sortedMotivations = Object.entries(motivationScores)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);
  const dominantMotivation = sortedMotivations[0].key;

  // 从 i18n 获取数组型文案
  const strengths = t(`strategy.temperament.${temperament}.strengths`, { returnObjects: true }) as string[];
  const growthAreas = t(`strategy.temperament.${temperament}.growthAreas`, { returnObjects: true }) as string[];
  const communicationTips = t(`strategy.temperament.${temperament}.communication`, { returnObjects: true }) as string[];
  const collaborationTips = t(`strategy.temperament.${temperament}.collaboration`, { returnObjects: true }) as string[];
  const conflictTip = t(`strategy.temperament.${temperament}.conflict`) as string;
  const motivationTip = t(`strategy.motivation.${dominantMotivation}.tip`) as string;

  return (
    <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
      <h3 className="text-base font-semibold text-[#3D3A5C] mb-1 flex items-center gap-2">
        <Users className="w-5 h-5 text-[#5B4FCF]" />
        {t('strategy.title')}
      </h3>
      <p className="text-xs text-[#A9A7C8] mb-4">{t('strategy.subtitle')}</p>

      {/* 天然优势 */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#7BC47F]/8 to-[#5BAE5F]/8 border border-[#D4EDD5]">
        <h4 className="text-sm font-semibold text-[#3D3A5C] mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#5BAE5F]" />
          {t('strategy.strengths')}
        </h4>
        <ul className="space-y-1.5">
          {strengths.map((item, i) => (
            <li key={i} className="text-sm text-[#6B6990] leading-[1.7] pl-4 relative">
              <span className="absolute left-0 text-[#5BAE5F]">•</span>
              {item}
            </li>
          ))}
          {topAbilities.map(({ key, value }) => (
            <li key={key} className="text-sm text-[#6B6990] leading-[1.7] pl-4 relative">
              <span className="absolute left-0 text-[#5BAE5F]">•</span>
              {t(`abilities.${key}`)}（{value}%）
            </li>
          ))}
        </ul>
      </div>

      {/* 可发展方向 */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#E8A87C]/8 to-[#D96459]/8 border border-[#F5D5C5]">
        <h4 className="text-sm font-semibold text-[#3D3A5C] mb-2 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-[#D96459]" />
          {t('strategy.growthAreas')}
        </h4>
        <ul className="space-y-1.5">
          {growthAreas.map((item, i) => (
            <li key={i} className="text-sm text-[#6B6990] leading-[1.7] pl-4 relative">
              <span className="absolute left-0 text-[#D96459]">•</span>
              {item}
            </li>
          ))}
          {bottomAbilities.map(({ key, value }) => (
            <li key={key} className="text-sm text-[#6B6990] leading-[1.7] pl-4 relative">
              <span className="absolute left-0 text-[#D96459]">•</span>
              {t(`abilities.${key}`)}（{value}%）
            </li>
          ))}
        </ul>
      </div>

      {/* 沟通策略 */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#5B4FCF]/8 to-[#7B6FE0]/8 border border-[#E0DCF5]">
        <h4 className="text-sm font-semibold text-[#3D3A5C] mb-2 flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4 text-[#5B4FCF]" />
          {t('strategy.communication')}
        </h4>
        <ul className="space-y-1.5">
          {communicationTips.map((item, i) => (
            <li key={i} className="text-sm text-[#6B6990] leading-[1.7] pl-4 relative">
              <span className="absolute left-0 text-[#5B4FCF]">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* 激励方式 */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#FFE66D]/10 to-[#FFD93D]/10 border border-[#FFF3C4]">
        <h4 className="text-sm font-semibold text-[#3D3A5C] mb-2 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-[#C9A227]" />
          {t('strategy.motivation')}
        </h4>
        <p className="text-sm text-[#6B6990] leading-[1.7]">
          {motivationTip}
        </p>
      </div>

      {/* 协作建议 */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#4ECDC4]/8 to-[#44A5A0]/8 border border-[#C5EDEA]">
        <h4 className="text-sm font-semibold text-[#3D3A5C] mb-2 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#44A5A0]" />
          {t('strategy.collaboration')}
        </h4>
        <ul className="space-y-1.5">
          {collaborationTips.map((item, i) => (
            <li key={i} className="text-sm text-[#6B6990] leading-[1.7] pl-4 relative">
              <span className="absolute left-0 text-[#44A5A0]">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* 摩擦提醒 */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-[#FF6B6B]/8 to-[#E8817A]/8 border border-[#F5C5C0]">
        <h4 className="text-sm font-semibold text-[#3D3A5C] mb-2 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-[#E8817A]" />
          {t('strategy.conflictWarning')}
        </h4>
        <p className="text-sm text-[#6B6990] leading-[1.7]">
          {conflictTip}
        </p>
      </div>
    </div>
  );
}
