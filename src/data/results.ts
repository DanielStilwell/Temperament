import type { TFunction } from 'i18next';
import type { TemperamentInfo, TemperamentType, TemperamentScores, AbilityInfo, AbilityDimension, AbilityScores } from '../types';

// 仅保留与语言无关的结构字段；所有文案（名称、描述、特征、动物）统一走 i18n
export const temperamentMap: Record<TemperamentType, TemperamentInfo> = {
  sanguine: {
    color: '#E8A87C',
    gradient: 'linear-gradient(135deg, #E8A87C 0%, #F3C9A0 100%)',
  },
  choleric: {
    color: '#D96459',
    gradient: 'linear-gradient(135deg, #D96459 0%, #E8817A 100%)',
  },
  phlegmatic: {
    color: '#6B9AC4',
    gradient: 'linear-gradient(135deg, #6B9AC4 0%, #8FB8D8 100%)',
  },
  melancholic: {
    color: '#8E7CC3',
    gradient: 'linear-gradient(135deg, #8E7CC3 0%, #A89BD4 100%)',
  },
};

export const abilityMap: Record<AbilityDimension, AbilityInfo> = {
  communication: { icon: 'MessageCircle' },
  leadership: { icon: 'Flag' },
  creativity: { icon: 'Lightbulb' },
  analysis: { icon: 'Brain' },
  resilience: { icon: 'Shield' },
  empathy: { icon: 'Heart' },
};

// 根据气质类型和能力得分生成综合解读（文案全部走 i18n，保证每种语言下只有对应语言）
export function getInterpretation(
  temperament: TemperamentType,
  temperamentScores: TemperamentScores,
  abilityScores: AbilityScores,
  t: TFunction
): string {
  // 找出主要气质（最高分）和次要气质（第二高分）
  const sortedTemperaments = (Object.entries(temperamentScores) as [TemperamentType, number][])
    .sort((a, b) => b[1] - a[1]);

  const primaryTemperament = sortedTemperaments[0][0];
  const secondaryTemperament = sortedTemperaments[1][0];
  const secondaryScore = sortedTemperaments[1][1];

  // 找出最高和较低的能力维度
  const abilities = Object.entries(abilityScores).sort((a, b) => b[1] - a[1]);
  const topAbilityKey = abilities[0][0] as AbilityDimension;
  const bottomAbilityKey = abilities[3][0] as AbilityDimension;

  // 综合主要气质进行解读
  let interpretation = t(`temperament.${primaryTemperament}.description`);

  // 如果次要气质得分较高（≥30%），补充次要气质的特点
  if (secondaryScore >= 30) {
    const secondaryFeatures = t(`temperament.${secondaryTemperament}.features`, { returnObjects: true }) as string[];
    interpretation += `\n\n${t('result.interpretation.secondary', {
      secondaryName: t(`temperament.${secondaryTemperament}.name`),
      features: secondaryFeatures.slice(0, 3).join(', '),
      primaryName: t(`temperament.${primaryTemperament}.name`),
    })}`;
  }

  interpretation += `\n\n${t('result.interpretation.ability', {
    topName: t(`abilities.${topAbilityKey}`),
    bottomName: t(`abilities.${bottomAbilityKey}`),
  })}`;

  interpretation += `\n\n${t('result.interpretation.footer')}`;

  return interpretation;
}
