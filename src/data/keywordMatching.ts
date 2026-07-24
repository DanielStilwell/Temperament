import type { TemperamentType, AbilityDimension, DimensionWeights } from '../types';

// 气质关键词映射
const temperamentKeywords: Record<TemperamentType, { keywords: string[]; weight: number }> = {
  sanguine: {
    keywords: [
      '活泼', '外向', '开朗', '乐观', '热情', '社交', '交际', '活跃', '健谈', '爱说话',
      '喜欢交流', '反应快', '灵活', '适应力强', '善于沟通', '外向型', '人缘好', '合群',
      '乐观开朗', '乐天派', '积极主动', '主动沟通', '喜欢尝试', '不拘小节', '随和',
      '喜欢热闹', '不怕生', '善于表达', '话多', '喜欢聊天', '容易相处', '人来疯',
      '先玩', '放松', '开心', '无所谓', '随便', '凑热闹', '玩一玩', '试试看', '随它去',
    ],
    weight: 3,
  },
  choleric: {
    keywords: [
      '果断', '坚定', '强势', '领导', '主导', '决策', '目标', '行动力', '魄力', '敢作敢当',
      '直率', '坦诚', '不拐弯抹角', '干脆', '利落', '雷厉风行', '有主见', '坚持己见',
      '不喜欢拖延', '效率', '快速', '主动出击', '掌控', '主导权', '不妥协', '强硬',
      '坚持', '抗争', '反驳', '辩论', '争论', '质疑', '挑战', '竞争', '不认输',
      '先做', '立刻', '马上', '直接', '毫不犹豫', '坚决', '一定', '必须', '立刻行动',
    ],
    weight: 3,
  },
  phlegmatic: {
    keywords: [
      '稳重', '安静', '冷静', '沉稳', '淡定', '平和', '温和', '稳定', '耐心', '忍耐',
      '按部就班', '循规蹈矩', '守规矩', '谨慎', '保守', '不急不躁', '不冲动', '稳扎稳打',
      '倾听', '配合', '协调', '调和', '不争执', '不冲突', '回避矛盾', '求同存异',
      '慢慢', '不着急', '无所谓', '随缘', '顺其自然', '不强求', '躺平', '混日子',
      '服从', '遵守', '按安排', '听从', '随大流', '不主动', '被动', '等待',
    ],
    weight: 3,
  },
  melancholic: {
    keywords: [
      '敏感', '细腻', '深入', '思考', '分析', '观察', '细节', '完美', '追求', '认真',
      '内敛', '内向', '沉默', '安静', '独处', '不爱说话', '不善表达', '内心丰富',
      '担心', '焦虑', '纠结', '犹豫', '反复', '内耗', '煎熬', '压抑', '不安',
      '容易受伤', '情绪化', '多想', '胡思乱想', '自我怀疑', '自责', '愧疚',
      '追求完美', '高标准', '严要求', '认真负责', '一丝不苟', '精益求精',
      '失眠', '睡不着', '吃不好', '情绪低落', '郁闷', '煎熬', '痛苦', '挣扎',
    ],
    weight: 3,
  },
};

// 根据文本内容分析气质类型
export function analyzeTemperamentFromText(text: string): TemperamentType {
  const scores: Record<TemperamentType, number> = {
    sanguine: 0,
    choleric: 0,
    phlegmatic: 0,
    melancholic: 0,
  };

  const lowerText = text.toLowerCase();

  // 统计各气质关键词匹配次数
  for (const [temperament, data] of Object.entries(temperamentKeywords)) {
    for (const keyword of data.keywords) {
      if (lowerText.includes(keyword)) {
        scores[temperament as TemperamentType] += data.weight;
      }
    }
  }

  // 找出得分最高的气质类型
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  // 如果最高分为0（没有匹配到任何关键词），默认返回黏液质（中性）
  if (sorted[0][1] === 0) {
    return 'phlegmatic';
  }

  return sorted[0][0] as TemperamentType;
}

// 创建初始零分对象（包含所有维度）
function zeroWeights(): DimensionWeights {
  return {
    sanguine: 0, choleric: 0, phlegmatic: 0, melancholic: 0,
    communication: 0, leadership: 0, creativity: 0,
    analysis: 0, resilience: 0, empathy: 0,
    // 动机类型
    achievement: 0, affiliation: 0, power: 0, security: 0,
    // 思维行为倾向
    proactive: 0, reactive: 0, rational: 0, emotional: 0,
    independent: 0, collaborative: 0, innovative: 0, conventional: 0,
  };
}

// 根据综合评价生成权重（包含动机类型和思维行为倾向）
export function getWeightsFromEvaluation(
  temperament: TemperamentType,
  behaviors: string[],
  abilities: AbilityDimension[],
  emotion: string
): DimensionWeights {
  const weights = zeroWeights();

  // 气质权重
  weights[temperament] = 4;

  // 行为倾向权重
  if (behaviors.includes('proactive')) {
    weights.choleric += 1;
    weights.resilience += 2;
    weights.proactive += 3;
    weights.achievement += 2;
  }
  if (behaviors.includes('rational')) {
    weights.melancholic += 1;
    weights.analysis += 2;
    weights.rational += 3;
  }
  if (behaviors.includes('collaborative')) {
    weights.sanguine += 1;
    weights.communication += 2;
    weights.empathy += 1;
    weights.collaborative += 3;
    weights.affiliation += 2;
  }
  if (behaviors.includes('creative')) {
    weights.sanguine += 1;
    weights.creativity += 2;
    weights.innovative += 3;
  }

  // 能力维度权重
  for (const ability of abilities) {
    weights[ability] += 2;
  }

  // 情绪态度权重
  if (emotion === 'positive') {
    weights.sanguine += 1;
    weights.resilience += 1;
    weights.proactive += 1;
  } else if (emotion === 'negative') {
    weights.phlegmatic += 1;
    weights.reactive += 2;
    weights.security += 1;
  } else if (emotion === 'anxious') {
    weights.melancholic += 2;
    weights.emotional += 2;
    weights.security += 2;
  }

  return weights;
}