import type { AssessmentResult, ProfessionType, TemperamentType, AbilityDimension, MotivationType } from './index';

// 账号版本
export type AccountTier = 'free' | 'pro' | 'max';

// 支付状态
export type PaymentStatus = 'none' | 'pending' | 'paid';

// 性别（与数据库 check 一致）
export type Gender = 'male' | 'female' | 'other' | 'unknown';

// 用户档案（对应 profiles 表）
export interface Profile {
  id: string;
  nickname: string;
  tier: AccountTier;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// 被观察者（对应 observers 表）
export interface Observer {
  id: string;
  ownerId: string;
  name: string;
  gender: Gender;
  profession: ProfessionType | '';
  result: AssessmentResult;
  answers: Record<number, string[]>;
  note: string;
  createdAt: string;
  updatedAt: string;
}

// ============ Max 版任务参数 ============

// 任务类型（多选，对应 6 项能力维度）
export type TaskType = 'creative' | 'execution' | 'communication' | 'analysis' | 'leadership' | 'resilience';

// 任务基础参数
export interface TaskBaseParams {
  // T1 任务类型（多选）
  types: TaskType[];
  // T2 难度系数 1-10
  difficulty: number;
  // T3 协作强度 0-100
  collaboration: number;
  // T4 时间压力 1-10
  timePressure: number;
  // T5 风险容忍度 0-100
  riskTolerance: number;
}

// 任务能力维度要求（0-100）
export interface TaskAbilityRequirements {
  communication: number; // A1
  leadership: number;    // A2
  creativity: number;    // A3
  analysis: number;      // A4
  resilience: number;    // A5
  empathy: number;       // A6
}

// 任务动机匹配要求（0-100）
export interface TaskMotivationRequirements {
  achievement: number; // M1
  affiliation: number; // M2
  power: number;       // M3
  security: number;    // M4
}

// 任务思维倾向要求（0-100，每对 0=偏左，100=偏右）
export interface TaskThinkingRequirements {
  proactive: number;    // S1 反应型 0 ←→ 主动型 100
  rational: number;     // S2 感性 0 ←→ 理性 100
  collaborative: number;// S3 独立 0 ←→ 协作 100
  innovative: number;   // S4 常规 0 ←→ 创新 100
}

// 完整任务参数
export interface TaskParams {
  base: TaskBaseParams;
  abilities: TaskAbilityRequirements;
  motivations: TaskMotivationRequirements;
  thinking: TaskThinkingRequirements;
}

// 团队配置
export interface TaskTeamConfig {
  // 选中的被观察者 ID 列表
  selectedObserverIds: string[];
  // 团队规模下限
  minSize: number;
  // 是否指定关键角色 + 关键被观察者 ID
  hasKeyRole: boolean;
  keyObserverId: string | null;
}

// ============ 预判结果 ============

// 单维度匹配情况
export interface DimensionMatch {
  dimension: string;
  label: string;
  required: number;
  actual: number;
  gap: number;       // actual - required，负数表示不足
  matchScore: number; // 0-100
}

// 风险点
export interface RiskPoint {
  dimension: string;
  label: string;
  required: number;
  actual: number;
  gap: number;
  level: 'yellow' | 'orange' | 'red';
  suggestion: string;
}

// 优势项
export interface StrengthPoint {
  dimension: string;
  label: string;
  actual: number;
  required: number;
  surplus: number;
}

// 推荐核心成员
export interface RecommendedMember {
  observerId: string;
  observerName: string;
  fitScore: number;
}

// 完整预判结果
export interface TaskPrediction {
  // 完成概率 0-100
  completionProbability: number;
  // 适配度（与任务要求的整体匹配度 0-100）
  overallFit: number;
  // 各维度匹配详情
  abilityMatches: DimensionMatch[];
  motivationMatches: DimensionMatch[];
  thinkingMatches: DimensionMatch[];
  // 风险点
  risks: RiskPoint[];
  // 优势项
  strengths: StrengthPoint[];
  // 推荐核心成员（按综合适配分排序）
  recommendedMembers: RecommendedMember[];
  // 团队实际能力均值（用于雷达图）
  teamAbilityAverage: Record<AbilityDimension, number>;
  // 任务要求能力（用于雷达图）
  requiredAbilities: Record<AbilityDimension, number>;
}

// ============ 团队聚合分析（Pro 版用） ============

export interface TeamAggregate {
  // 团队规模
  size: number;
  // 主导气质分布
  temperamentDistribution: Record<TemperamentType, number>;
  // 能力均值
  averageAbilities: Record<AbilityDimension, number>;
  // 动机均值
  averageMotivations: Record<MotivationType, number>;
  // 思维倾向均值
  averageThinking: {
    proactive: number;
    rational: number;
    collaborative: number;
    innovative: number;
  };
  // 维度多样性（标准差，越大越多样）
  diversity: {
    temperament: number;
    abilities: number;
  };
  // 团队特质标签
  teamTraits: string[];
}

// Max 版任务记录（对应 tasks 表）
export interface TaskRecord {
  id: string;
  ownerId: string;
  name: string;
  params: TaskParams;
  teamConfig: TaskTeamConfig;
  prediction: TaskPrediction;
  createdAt: string;
  updatedAt: string;
}
