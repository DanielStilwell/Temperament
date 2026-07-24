import type {
  TaskParams,
  TaskTeamConfig,
  TaskPrediction,
  DimensionMatch,
  RiskPoint,
  StrengthPoint,
  RecommendedMember,
} from '../types/account';
import type { Observer } from '../types/account';
import type { AbilityDimension, MotivationType } from '../types';

const ABILITY_KEYS: AbilityDimension[] = ['communication', 'leadership', 'creativity', 'analysis', 'resilience', 'empathy'];
const MOTIVATION_KEYS: MotivationType[] = ['achievement', 'affiliation', 'power', 'security'];

const ABILITY_LABELS: Record<AbilityDimension, string> = {
  communication: '沟通',
  leadership: '领导',
  creativity: '创造',
  analysis: '分析',
  resilience: '抗压',
  empathy: '共情',
};

const MOTIVATION_LABELS: Record<MotivationType, string> = {
  achievement: '成就动机',
  affiliation: '亲和动机',
  power: '权力动机',
  security: '安全动机',
};

const THINKING_LABELS = {
  proactive: '主动倾向',
  rational: '理性倾向',
  collaborative: '协作倾向',
  innovative: '创新倾向',
};

// clamp 工具
const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

// 单维度匹配度：实际 ≥ 要求 → 100；实际 < 要求 → 按差距线性扣分（每分差距扣 1.2 分）
function matchScore(actual: number, required: number): number {
  if (actual >= required) return 100;
  const gap = required - actual;
  return clamp(100 - gap * 1.2);
}

// 风险等级（按差距）
function riskLevel(gap: number): 'yellow' | 'orange' | 'red' {
  if (gap >= 35) return 'red';
  if (gap >= 25) return 'orange';
  return 'yellow';
}

// 风险建议
function riskSuggestion(label: string, gap: number): string {
  if (gap >= 35) return `${label}维度严重不足，建议补充该维度 ≥ 70 的成员`;
  if (gap >= 25) return `${label}维度明显偏弱，建议补充或加强培训`;
  return `${label}维度略低于要求，可在执行中重点关注`;
}

// 把单个被观察者的思维倾向（4 对）映射为 0-100（50=中性）
function observerThinkingScore(observer: Observer): {
  proactive: number;
  rational: number;
  collaborative: number;
  innovative: number;
} {
  const t = observer.result.thinkingScores;
  return {
    proactive: clamp(50 + (t.proactive - t.reactive) / 2),
    rational: clamp(50 + (t.rational - t.emotional) / 2),
    collaborative: clamp(50 + (t.collaborative - t.independent) / 2),
    innovative: clamp(50 + (t.innovative - t.conventional) / 2),
  };
}

// 主预判函数
export function predictTask(
  params: TaskParams,
  teamConfig: TaskTeamConfig,
  allObservers: Observer[]
): TaskPrediction {
  // 1. 选取参与任务的被观察者
  const selectedObservers = allObservers.filter((o) => teamConfig.selectedObserverIds.includes(o.id));
  const size = selectedObservers.length;

  // 2. 团队能力均值（关键角色加权）
  const teamAbilitySum: Record<AbilityDimension, number> = {
    communication: 0, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 0,
  };
  const teamMotivationSum: Record<MotivationType, number> = {
    achievement: 0, affiliation: 0, power: 0, security: 0,
  };
  const teamThinkingSum = { proactive: 0, rational: 0, collaborative: 0, innovative: 0 };

  let totalWeight = 0;
  for (const ob of selectedObservers) {
    let weight = 1;
    // 关键角色：领导/抗压维度权重加倍
    if (teamConfig.hasKeyRole && teamConfig.keyObserverId === ob.id) {
      weight = 2;
    }

    for (const k of ABILITY_KEYS) {
      teamAbilitySum[k] += ob.result.abilityScores[k] * weight;
    }
    for (const k of MOTIVATION_KEYS) {
      teamMotivationSum[k] += ob.result.motivationScores[k] * weight;
    }
    const ts = observerThinkingScore(ob);
    teamThinkingSum.proactive += ts.proactive * weight;
    teamThinkingSum.rational += ts.rational * weight;
    teamThinkingSum.collaborative += ts.collaborative * weight;
    teamThinkingSum.innovative += ts.innovative * weight;

    totalWeight += weight;
  }

  const teamAbilityAverage = ABILITY_KEYS.reduce((acc, k) => {
    acc[k] = totalWeight > 0 ? Math.round(teamAbilitySum[k] / totalWeight) : 0;
    return acc;
  }, {} as Record<AbilityDimension, number>);

  const teamMotivationAverage = MOTIVATION_KEYS.reduce((acc, k) => {
    acc[k] = totalWeight > 0 ? Math.round(teamMotivationSum[k] / totalWeight) : 0;
    return acc;
  }, {} as Record<MotivationType, number>);

  const teamThinkingAverage = {
    proactive: totalWeight > 0 ? Math.round(teamThinkingSum.proactive / totalWeight) : 50,
    rational: totalWeight > 0 ? Math.round(teamThinkingSum.rational / totalWeight) : 50,
    collaborative: totalWeight > 0 ? Math.round(teamThinkingSum.collaborative / totalWeight) : 50,
    innovative: totalWeight > 0 ? Math.round(teamThinkingSum.innovative / totalWeight) : 50,
  };

  // 3. 计算各维度匹配情况
  const abilityMatches: DimensionMatch[] = ABILITY_KEYS.map((k) => {
    const required = params.abilities[k];
    const actual = teamAbilityAverage[k];
    return {
      dimension: k,
      label: ABILITY_LABELS[k],
      required,
      actual,
      gap: actual - required,
      matchScore: matchScore(actual, required),
    };
  });

  const motivationMatches: DimensionMatch[] = MOTIVATION_KEYS.map((k) => {
    const required = params.motivations[k];
    const actual = teamMotivationAverage[k];
    return {
      dimension: k,
      label: MOTIVATION_LABELS[k],
      required,
      actual,
      gap: actual - required,
      matchScore: matchScore(actual, required),
    };
  });

  const thinkingMatches: DimensionMatch[] = (['proactive', 'rational', 'collaborative', 'innovative'] as const).map((k) => {
    const required = params.thinking[k];
    const actual = teamThinkingAverage[k];
    return {
      dimension: k,
      label: THINKING_LABELS[k],
      required,
      actual,
      gap: actual - required,
      matchScore: matchScore(actual, required),
    };
  });

  // 4. 风险点（差距 ≥ 15）
  const allMatches = [...abilityMatches, ...motivationMatches, ...thinkingMatches];
  const risks: RiskPoint[] = allMatches
    .filter((m) => m.gap <= -15)
    .map((m) => ({
      dimension: m.dimension,
      label: m.label,
      required: m.required,
      actual: m.actual,
      gap: Math.abs(m.gap),
      level: riskLevel(Math.abs(m.gap)),
      suggestion: riskSuggestion(m.label, Math.abs(m.gap)),
    }))
    .sort((a, b) => b.gap - a.gap);

  // 5. 优势项（超出 ≥ 15）
  const strengths: StrengthPoint[] = allMatches
    .filter((m) => m.gap >= 15)
    .map((m) => ({
      dimension: m.dimension,
      label: m.label,
      actual: m.actual,
      required: m.required,
      surplus: m.gap,
    }))
    .sort((a, b) => b.surplus - a.surplus);

  // 6. 整体适配度（加权平均）
  const abilityFit = mean(abilityMatches.map((m) => m.matchScore));
  const motivationFit = mean(motivationMatches.map((m) => m.matchScore));
  const thinkingFit = mean(thinkingMatches.map((m) => m.matchScore));
  const overallFit = Math.round(abilityFit * 0.5 + motivationFit * 0.25 + thinkingFit * 0.25);

  // 7. 完成概率（用难度/时间压力/风险容忍度作调节）
  // 调节系数：难度越高 → 概率越低；时间压力越大 → 概率越低；风险容忍度越低 → 失误空间小，对匹配度要求更高
  const difficultyFactor = 1.1 - (params.base.difficulty - 1) * 0.06; // 难度 1 → 1.04，难度 10 → 0.56
  const timePressureFactor = 1.05 - (params.base.timePressure - 1) * 0.05; // 时间压力 1 → 1.00，10 → 0.60
  // 风险容忍度低时，对风险点更敏感（扣分更多）
  const riskPenalty = risks.length > 0 ? (1 - params.base.riskTolerance / 100) * risks.reduce((s, r) => s + r.gap, 0) * 0.005 : 0;

  let completionProbability = Math.round(overallFit * difficultyFactor * timePressureFactor - riskPenalty * 100);
  completionProbability = clamp(completionProbability);

  // 团队规模下限校验
  if (size < teamConfig.minSize) {
    completionProbability = Math.min(completionProbability, 30);
  }
  if (size === 0) {
    completionProbability = 0;
  }

  // 8. 推荐核心成员（按综合适配分）
  let recommendedMembers: RecommendedMember[] = [];
  if (size > 0) {
    recommendedMembers = selectedObservers
      .map((ob) => {
        // 该成员对各能力维度的匹配度均值
        const obAbilityFit = mean(
          ABILITY_KEYS.map((k) => matchScore(ob.result.abilityScores[k], params.abilities[k]))
        );
        const obMotivationFit = mean(
          MOTIVATION_KEYS.map((k) => matchScore(ob.result.motivationScores[k], params.motivations[k]))
        );
        const ts = observerThinkingScore(ob);
        const obThinkingFit = mean(
          (['proactive', 'rational', 'collaborative', 'innovative'] as const).map((k) =>
            matchScore(ts[k], params.thinking[k])
          )
        );
        const fitScore = Math.round(obAbilityFit * 0.5 + obMotivationFit * 0.25 + obThinkingFit * 0.25);
        return { observerId: ob.id, observerName: ob.name, fitScore };
      })
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, Math.min(3, size));
  }

  return {
    completionProbability,
    overallFit,
    abilityMatches,
    motivationMatches,
    thinkingMatches,
    risks,
    strengths,
    recommendedMembers,
    teamAbilityAverage,
    requiredAbilities: { ...params.abilities },
  };
}

function mean(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

// ============ 任务模板 ============

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  params: TaskParams;
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'product-launch',
    name: '产品上线攻坚',
    description: '高强度、跨职能、时间紧迫的产品发布任务',
    params: {
      base: {
        types: ['execution', 'leadership', 'communication'],
        difficulty: 8,
        collaboration: 80,
        timePressure: 9,
        riskTolerance: 40,
      },
      abilities: { communication: 70, leadership: 75, creativity: 50, analysis: 70, resilience: 80, empathy: 50 },
      motivations: { achievement: 80, affiliation: 40, power: 60, security: 30 },
      thinking: { proactive: 80, rational: 70, collaborative: 75, innovative: 60 },
    },
  },
  {
    id: 'client-negotiation',
    name: '客户谈判',
    description: '一对一或多对多的商务谈判场景',
    params: {
      base: {
        types: ['communication', 'leadership', 'resilience'],
        difficulty: 7,
        collaboration: 50,
        timePressure: 6,
        riskTolerance: 30,
      },
      abilities: { communication: 85, leadership: 70, creativity: 55, analysis: 75, resilience: 80, empathy: 70 },
      motivations: { achievement: 75, affiliation: 50, power: 70, security: 40 },
      thinking: { proactive: 75, rational: 80, collaborative: 50, innovative: 50 },
    },
  },
  {
    id: 'cross-dept-project',
    name: '跨部门协作项目',
    description: '需要多部门配合的中长期项目',
    params: {
      base: {
        types: ['communication', 'leadership', 'analysis'],
        difficulty: 6,
        collaboration: 90,
        timePressure: 5,
        riskTolerance: 50,
      },
      abilities: { communication: 75, leadership: 65, creativity: 50, analysis: 70, resilience: 60, empathy: 70 },
      motivations: { achievement: 65, affiliation: 70, power: 50, security: 50 },
      thinking: { proactive: 70, rational: 70, collaborative: 85, innovative: 55 },
    },
  },
  {
    id: 'crisis-pr',
    name: '危机公关',
    description: '突发负面事件的紧急响应与对外沟通',
    params: {
      base: {
        types: ['communication', 'leadership', 'resilience'],
        difficulty: 9,
        collaboration: 70,
        timePressure: 10,
        riskTolerance: 20,
      },
      abilities: { communication: 85, leadership: 80, creativity: 60, analysis: 75, resilience: 90, empathy: 75 },
      motivations: { achievement: 70, affiliation: 50, power: 70, security: 50 },
      thinking: { proactive: 85, rational: 85, collaborative: 65, innovative: 60 },
    },
  },
  {
    id: 'daily-ops',
    name: '日常运维',
    description: '常规运营维护任务，节奏稳定',
    params: {
      base: {
        types: ['execution', 'analysis'],
        difficulty: 3,
        collaboration: 40,
        timePressure: 3,
        riskTolerance: 30,
      },
      abilities: { communication: 50, leadership: 40, creativity: 40, analysis: 65, resilience: 55, empathy: 45 },
      motivations: { achievement: 50, affiliation: 55, power: 30, security: 75 },
      thinking: { proactive: 55, rational: 70, collaborative: 50, innovative: 40 },
    },
  },
  {
    id: 'creative-campaign',
    name: '创意策划活动',
    description: '从 0 到 1 的创意产出与活动设计',
    params: {
      base: {
        types: ['creative', 'communication'],
        difficulty: 6,
        collaboration: 65,
        timePressure: 5,
        riskTolerance: 70,
      },
      abilities: { communication: 70, leadership: 55, creativity: 85, analysis: 60, resilience: 55, empathy: 65 },
      motivations: { achievement: 75, affiliation: 60, power: 40, security: 30 },
      thinking: { proactive: 75, rational: 55, collaborative: 65, innovative: 85 },
    },
  },
  {
    id: 'research-analysis',
    name: '研究分析任务',
    description: '深度数据研究与分析报告产出',
    params: {
      base: {
        types: ['analysis', 'creative'],
        difficulty: 7,
        collaboration: 35,
        timePressure: 4,
        riskTolerance: 50,
      },
      abilities: { communication: 55, leadership: 40, creativity: 65, analysis: 90, resilience: 65, empathy: 45 },
      motivations: { achievement: 75, affiliation: 40, power: 40, security: 50 },
      thinking: { proactive: 70, rational: 90, collaborative: 40, innovative: 70 },
    },
  },
  {
    id: 'team-building',
    name: '团队建设活动',
    description: '提升团队凝聚力与氛围的活动组织',
    params: {
      base: {
        types: ['communication', 'leadership'],
        difficulty: 4,
        collaboration: 85,
        timePressure: 3,
        riskTolerance: 70,
      },
      abilities: { communication: 80, leadership: 65, creativity: 65, analysis: 40, resilience: 50, empathy: 85 },
      motivations: { achievement: 50, affiliation: 90, power: 40, security: 50 },
      thinking: { proactive: 70, rational: 50, collaborative: 85, innovative: 65 },
    },
  },
];

// 默认空参数（自定义模式）
export function emptyTaskParams(): TaskParams {
  return {
    base: {
      types: [],
      difficulty: 5,
      collaboration: 50,
      timePressure: 5,
      riskTolerance: 50,
    },
    abilities: { communication: 50, leadership: 50, creativity: 50, analysis: 50, resilience: 50, empathy: 50 },
    motivations: { achievement: 50, affiliation: 50, power: 50, security: 50 },
    thinking: { proactive: 50, rational: 50, collaborative: 50, innovative: 50 },
  };
}
