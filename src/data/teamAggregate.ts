import type { Observer, TeamAggregate } from '../types/account';
import type { TemperamentType, AbilityDimension, MotivationType } from '../types';

const TEMPERAMENT_LABELS: Record<TemperamentType, string> = {
  sanguine: 'Sanguine',
  choleric: 'Choleric',
  phlegmatic: 'Phlegmatic',
  melancholic: 'Melancholic',
};

const ABILITY_KEYS: AbilityDimension[] = ['communication', 'leadership', 'creativity', 'analysis', 'resilience', 'empathy'];
const MOTIVATION_KEYS: MotivationType[] = ['achievement', 'affiliation', 'power', 'security'];
const TEMPERAMENT_KEYS: TemperamentType[] = ['sanguine', 'choleric', 'phlegmatic', 'melancholic'];

// 计算均值
function mean(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

// 计算标准差（用于多样性度量）
function std(nums: number[]): number {
  if (nums.length === 0) return 0;
  const m = mean(nums);
  const variance = nums.reduce((s, n) => s + (n - m) ** 2, 0) / nums.length;
  return Math.sqrt(variance);
}

// 根据团队画像生成特质标签
function generateTeamTraits(
  size: number,
  temperamentDistribution: Record<TemperamentType, number>,
  averageAbilities: Record<AbilityDimension, number>,
  diversity: { temperament: number; abilities: number }
): string[] {
  const traits: string[] = [];

  // 规模标签
  if (size === 0) return ['No members'];
  if (size <= 5) traits.push('Small close-knit team');
  else if (size <= 15) traits.push('Medium-sized team');
  else traits.push('Large diverse team');

  // 主导气质
  const sorted = [...TEMPERAMENT_KEYS].sort((a, b) => temperamentDistribution[b] - temperamentDistribution[a]);
  const dominant = sorted[0];
  const dominantPct = Math.round(temperamentDistribution[dominant]);
  if (dominantPct >= 50) {
    traits.push(`${TEMPERAMENT_LABELS[dominant]} dominant (${dominantPct}%)`);
  } else {
    traits.push('Balanced temperament distribution');
  }

  // 突出能力
  const abilityEntries = ABILITY_KEYS.map((k) => ({ k, v: averageAbilities[k] }));
  abilityEntries.sort((a, b) => b.v - a.v);
  const topAbility = abilityEntries[0];
  if (topAbility.v >= 65) {
    traits.push(`Strong in ${ABILITY_LABELS[topAbility.k]}`);
  }
  const bottomAbility = abilityEntries[abilityEntries.length - 1];
  if (bottomAbility.v <= 35) {
    traits.push(`${ABILITY_LABELS[bottomAbility.k]} needs development`);
  }

  // 多样性标签
  if (diversity.temperament >= 25) {
    traits.push('Temperament diversity & complementarity');
  } else if (diversity.temperament <= 10 && size >= 3) {
    traits.push('Highly homogeneous temperament');
  }

  if (diversity.abilities >= 20) {
    traits.push('Rich ability gradient');
  }

  return traits;
}

const ABILITY_LABELS: Record<AbilityDimension, string> = {
  communication: 'Communication',
  leadership: 'Leadership',
  creativity: 'Creativity',
  analysis: 'Analysis',
  resilience: 'Resilience',
  empathy: 'Empathy',
};

// 主聚合函数
export function aggregateTeam(observers: Observer[]): TeamAggregate {
  const size = observers.length;

  // 主导气质分布（每个被观察者的主气质计入对应桶）
  const temperamentDistribution: Record<TemperamentType, number> = {
    sanguine: 0,
    choleric: 0,
    phlegmatic: 0,
    melancholic: 0,
  };

  const abilityValues: Record<AbilityDimension, number[]> = {
    communication: [],
    leadership: [],
    creativity: [],
    analysis: [],
    resilience: [],
    empathy: [],
  };

  const motivationValues: Record<MotivationType, number[]> = {
    achievement: [],
    affiliation: [],
    power: [],
    security: [],
  };

  const proactiveVals: number[] = [];
  const rationalVals: number[] = [];
  const collaborativeVals: number[] = [];
  const innovativeVals: number[] = [];

  for (const ob of observers) {
    const r = ob.result;
    if (!r) continue;

    // 主导气质计数
    temperamentDistribution[r.temperament]++;

    // 能力
    for (const k of ABILITY_KEYS) {
      abilityValues[k].push(r.abilityScores[k]);
    }

    // 动机
    for (const k of MOTIVATION_KEYS) {
      motivationValues[k].push(r.motivationScores[k]);
    }

    // 思维倾向（每对取相对倾向）
    proactiveVals.push(r.thinkingScores.proactive - r.thinkingScores.reactive);
    rationalVals.push(r.thinkingScores.rational - r.thinkingScores.emotional);
    collaborativeVals.push(r.thinkingScores.collaborative - r.thinkingScores.independent);
    innovativeVals.push(r.thinkingScores.innovative - r.thinkingScores.conventional);
  }

  // 主导气质分布归一化为百分比
  if (size > 0) {
    for (const k of TEMPERAMENT_KEYS) {
      temperamentDistribution[k] = (temperamentDistribution[k] / size) * 100;
    }
  }

  // 能力均值
  const averageAbilities = ABILITY_KEYS.reduce((acc, k) => {
    acc[k] = Math.round(mean(abilityValues[k]));
    return acc;
  }, {} as Record<AbilityDimension, number>);

  // 动机均值
  const averageMotivations = MOTIVATION_KEYS.reduce((acc, k) => {
    acc[k] = Math.round(mean(motivationValues[k]));
    return acc;
  }, {} as Record<MotivationType, number>);

  // 思维倾向均值（差值再映射回 0-100，50=中性）
  const averageThinking = {
    proactive: Math.round(50 + mean(proactiveVals) / 2),
    rational: Math.round(50 + mean(rationalVals) / 2),
    collaborative: Math.round(50 + mean(collaborativeVals) / 2),
    innovative: Math.round(50 + mean(innovativeVals) / 2),
  };

  // 多样性：所有被观察者所有能力维度的标准差均值
  const allAbilityStd = ABILITY_KEYS.map((k) => std(abilityValues[k]));
  const abilitiesStd = mean(allAbilityStd);

  // 气质多样性：分布的标准差（越均衡越大）
  const temperamentPercentages = TEMPERAMENT_KEYS.map((k) => temperamentDistribution[k]);
  const temperamentStd = std(temperamentPercentages);

  const diversity = {
    temperament: Math.round(temperamentStd * 10) / 10,
    abilities: Math.round(abilitiesStd * 10) / 10,
  };

  const teamTraits = generateTeamTraits(size, temperamentDistribution, averageAbilities, diversity);

  return {
    size,
    temperamentDistribution,
    averageAbilities,
    averageMotivations,
    averageThinking,
    diversity,
    teamTraits,
  };
}

export { ABILITY_LABELS, TEMPERAMENT_LABELS };
