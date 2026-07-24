import type { AssessmentResult, TemperamentType, TemperamentScores, AbilityScores, AbilityDimension, DimensionWeights, Scenario, MotivationScores, ThinkingScores } from '../types';

// 综合评价结构
interface ComprehensiveEvaluation {
  temperament: TemperamentType | 'unknown';
  behaviors: string[];
  abilities: AbilityDimension[];
  emotion: string;
}

// 自定义选项的完整评价
interface CustomEvaluation {
  text: string;
  evaluation: ComprehensiveEvaluation;
  weights: DimensionWeights;
}

// 创建初始零分对象（包含所有维度）
function zeroScores(): DimensionWeights {
  return {
    sanguine: 0, choleric: 0, phlegmatic: 0, melancholic: 0,
    communication: 0, leadership: 0, creativity: 0,
    analysis: 0, resilience: 0, empathy: 0,
    achievement: 0, affiliation: 0, power: 0, security: 0,
    proactive: 0, reactive: 0, rational: 0, emotional: 0,
    independent: 0, collaborative: 0, innovative: 0, conventional: 0,
  };
}

// 根据答案和题库计算得分（多选时取权重平均值）
// customEvaluations: 存储自定义选项的完整评价（包含权重）
export function calculateScores(
  answers: Record<number, string[]>,
  scenarios: Scenario[],
  customEvaluations?: Record<number, CustomEvaluation>
): AssessmentResult {
  const rawScores = zeroScores();

  // 累加所有答案的权重（多选取平均值）
  for (const scenario of scenarios) {
    const chosenIds = answers[scenario.id];
    if (!chosenIds || chosenIds.length === 0) continue;

    // 检查是否选择了自定义选项
    const hasCustomOption = chosenIds.includes('custom');

    if (hasCustomOption && customEvaluations && customEvaluations[scenario.id]) {
      // 使用自定义选项的权重
      const customWeights = customEvaluations[scenario.id].weights;

      for (const key of Object.keys(rawScores) as (keyof DimensionWeights)[]) {
        rawScores[key] += customWeights[key];
      }
    } else {
      // 使用标准选项的权重
      const selectedOptions = scenario.options.filter((o) => chosenIds.includes(o.id));
      if (selectedOptions.length === 0) continue;

      for (const key of Object.keys(rawScores) as (keyof DimensionWeights)[]) {
        // 对于新增的维度，如果选项中没有该字段，默认为0
        const avg =
          selectedOptions.reduce((sum, opt) => {
            const weight = opt.weights[key as keyof typeof opt.weights];
            return sum + (weight !== undefined ? weight : 0);
          }, 0) / selectedOptions.length;
        rawScores[key] += avg;
      }
    }
  }

  // 计算每个维度的最大值（用于归一化）
  const maxPossible = computeMaxPossible(scenarios);

  // 归一化为百分比 - 气质得分
  const temperamentScores: TemperamentScores = {
    sanguine: Math.round((rawScores.sanguine / maxPossible.sanguine) * 100),
    choleric: Math.round((rawScores.choleric / maxPossible.choleric) * 100),
    phlegmatic: Math.round((rawScores.phlegmatic / maxPossible.phlegmatic) * 100),
    melancholic: Math.round((rawScores.melancholic / maxPossible.melancholic) * 100),
  };

  // 归一化为百分比 - 能力得分
  const abilityScores: AbilityScores = {
    communication: Math.round((rawScores.communication / maxPossible.communication) * 100),
    leadership: Math.round((rawScores.leadership / maxPossible.leadership) * 100),
    creativity: Math.round((rawScores.creativity / maxPossible.creativity) * 100),
    analysis: Math.round((rawScores.analysis / maxPossible.analysis) * 100),
    resilience: Math.round((rawScores.resilience / maxPossible.resilience) * 100),
    empathy: Math.round((rawScores.empathy / maxPossible.empathy) * 100),
  };

  // 归一化为百分比 - 动机类型得分
  const motivationScores: MotivationScores = {
    achievement: Math.min(100, Math.round((rawScores.achievement / 20) * 100)),
    affiliation: Math.min(100, Math.round((rawScores.affiliation / 20) * 100)),
    power: Math.min(100, Math.round((rawScores.power / 20) * 100)),
    security: Math.min(100, Math.round((rawScores.security / 20) * 100)),
  };

  // 归一化为百分比 - 思维行为倾向得分
  const thinkingScores: ThinkingScores = {
    proactive: Math.min(100, Math.round((rawScores.proactive / 30) * 100)),
    reactive: Math.min(100, Math.round((rawScores.reactive / 30) * 100)),
    rational: Math.min(100, Math.round((rawScores.rational / 30) * 100)),
    emotional: Math.min(100, Math.round((rawScores.emotional / 30) * 100)),
    independent: Math.min(100, Math.round((rawScores.independent / 30) * 100)),
    collaborative: Math.min(100, Math.round((rawScores.collaborative / 30) * 100)),
    innovative: Math.min(100, Math.round((rawScores.innovative / 30) * 100)),
    conventional: Math.min(100, Math.round((rawScores.conventional / 30) * 100)),
  };

  // 确定主导气质
  const temperament = getDominantTemperament(temperamentScores);

  return { temperament, temperamentScores, abilityScores, motivationScores, thinkingScores };
}

// 计算每个维度可达到的最大值（逐题取最大再求和）
function computeMaxPossible(scenarios: Scenario[]): DimensionWeights {
  const max = zeroScores();
  for (const scenario of scenarios) {
    // 每题中该维度的最大权重
    const perQuestionMax: DimensionWeights = { ...zeroScores() };
    for (const option of scenario.options) {
      for (const key of Object.keys(max) as (keyof DimensionWeights)[]) {
        if (option.weights[key] > perQuestionMax[key]) {
          perQuestionMax[key] = option.weights[key];
        }
      }
    }
    // 累加每题的最大值
    for (const key of Object.keys(max) as (keyof DimensionWeights)[]) {
      max[key] += perQuestionMax[key];
    }
  }
  return max;
}

function getDominantTemperament(scores: TemperamentScores): TemperamentType {
  const entries: [TemperamentType, number][] = [
    ['sanguine', scores.sanguine],
    ['choleric', scores.choleric],
    ['phlegmatic', scores.phlegmatic],
    ['melancholic', scores.melancholic],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}