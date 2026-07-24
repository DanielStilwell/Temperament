// 职业类型
export type ProfessionType = 'service' | 'student' | 'office' | 'civil' | 'artist' | 'media' | 'teacher' | 'doctor';

// 职业信息
export interface ProfessionInfo {
  id: ProfessionType;
  name: string;
  icon: string;
  color: string;
  bg: string;
  description: string;
}

// 气质类型
export type TemperamentType = 'sanguine' | 'choleric' | 'phlegmatic' | 'melancholic';

// 能力维度
export type AbilityDimension = 'communication' | 'leadership' | 'creativity' | 'analysis' | 'resilience' | 'empathy';

// 动机类型
export type MotivationType = 'achievement' | 'affiliation' | 'power' | 'security';

// 思维行为倾向
export type ThinkingTendency = 'proactive' | 'reactive' | 'rational' | 'emotional' | 'independent' | 'collaborative' | 'innovative' | 'conventional';

// 维度权重
export interface DimensionWeights {
  sanguine: number;
  choleric: number;
  phlegmatic: number;
  melancholic: number;
  communication: number;
  leadership: number;
  creativity: number;
  analysis: number;
  resilience: number;
  empathy: number;
  // 动机类型权重（可选，用于向后兼容）
  achievement?: number;
  affiliation?: number;
  power?: number;
  security?: number;
  // 思维行为倾向权重（可选，用于向后兼容）
  proactive?: number;
  reactive?: number;
  rational?: number;
  emotional?: number;
  independent?: number;
  collaborative?: number;
  innovative?: number;
  conventional?: number;
}

// 情境题选项
export interface ScenarioOption {
  id: string;
  text: string;
  weights: DimensionWeights;
}

// 一道情境题
export interface Scenario {
  id: number;
  situation: string;
  options: ScenarioOption[];
}

// 气质得分
export interface TemperamentScores {
  sanguine: number;
  choleric: number;
  phlegmatic: number;
  melancholic: number;
}

// 能力得分
export interface AbilityScores {
  communication: number;
  leadership: number;
  creativity: number;
  analysis: number;
  resilience: number;
  empathy: number;
}

// 动机类型得分
export interface MotivationScores {
  achievement: number; // 成就动机
  affiliation: number; // 亲和动机
  power: number;       // 权力动机
  security: number;    // 安全动机
}

// 思维行为倾向得分
export interface ThinkingScores {
  proactive: number;     // 主动型
  reactive: number;      // 被动型
  rational: number;      // 理性型
  emotional: number;     // 感性型
  independent: number;   // 独立型
  collaborative: number; // 协作型
  innovative: number;    // 创新型
  conventional: number;  // 传统型
}

// 评估结果
export interface AssessmentResult {
  temperament: TemperamentType;
  temperamentScores: TemperamentScores;
  abilityScores: AbilityScores;
  motivationScores: MotivationScores;
  thinkingScores: ThinkingScores;
}

// 气质信息
export interface TemperamentInfo {
  name: string;
  englishName: string;
  color: string;
  gradient: string;
  animal: string;
  features: string[];
  description: string;
}

// 能力信息
export interface AbilityInfo {
  name: string;
  icon: string;
  description: string;
}