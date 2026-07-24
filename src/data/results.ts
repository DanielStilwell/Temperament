import type { TemperamentInfo, TemperamentType, TemperamentScores, AbilityInfo, AbilityDimension, AbilityScores } from '../types';

export const temperamentMap: Record<TemperamentType, TemperamentInfo> = {
  sanguine: {
    name: '多血质',
    englishName: 'Sanguine',
    color: '#E8A87C',
    gradient: 'linear-gradient(135deg, #E8A87C 0%, #F3C9A0 100%)',
    animal: '海豚',
    features: ['活泼外向', '反应迅速', '喜欢交际', '适应力强', '乐观开朗'],
    description: '被观察者表现出明显的多血质倾向。这类气质的人通常精力充沛、善于社交，能够快速适应环境变化。他们思维敏捷，对新鲜事物充满好奇，在团队中往往是活跃气氛的关键角色。需要注意的是，有时可能会因为兴趣广泛而注意力易转移，对需要长期专注的任务可能需要额外的自我管理。',
  },
  choleric: {
    name: '胆汁质',
    englishName: 'Choleric',
    color: '#D96459',
    gradient: 'linear-gradient(135deg, #D96459 0%, #E8817A 100%)',
    animal: '雄狮',
    features: ['精力旺盛', '直率热情', '行动果断', '目标明确', '领导力强'],
    description: '被观察者表现出明显的胆汁质倾向。这类气质的人天生具有强烈的目标感和行动力，面对挑战时展现出果断和勇气。他们直率坦诚，不拐弯抹角，是天生的领导者和推动者。需要注意的是，有时可能会因过于直接而影响人际关系，学会在坚持己见的同时兼顾他人感受，会是很好的成长方向。',
  },
  phlegmatic: {
    name: '黏液质',
    englishName: 'Phlegmatic',
    color: '#6B9AC4',
    gradient: 'linear-gradient(135deg, #6B9AC4 0%, #8FB8D8 100%)',
    animal: '大象',
    features: ['安静稳重', '善于忍耐', '情绪稳定', '注意力集中', '可靠务实'],
    description: '被观察者表现出明显的黏液质倾向。这类气质的人如同静水深流，外表平静但内心坚定。他们做事稳重可靠，不轻易被情绪左右，是团队中稳定军心的存在。在需要耐心和持久力的任务中，他们往往能展现出非凡的韧性。温和的处事方式也让他们成为很好的倾听者和调和者。',
  },
  melancholic: {
    name: '抑郁质',
    englishName: 'Melancholic',
    color: '#8E7CC3',
    gradient: 'linear-gradient(135deg, #8E7CC3 0%, #A89BD4 100%)',
    animal: '猫头鹰',
    features: ['敏感细腻', '观察力强', '思考深入', '追求完美', '富有创造力'],
    description: '被观察者表现出明显的抑郁质倾向。请注意，这里"抑郁质"是心理学气质类型术语，并非指情绪状态。这类气质的人拥有敏锐的洞察力和深度的思考能力，能够察觉到他人容易忽略的细节。他们情感体验深刻，内心世界丰富，在艺术创作和深度分析领域往往有出色表现。他们需要的是一个能给予安全感的环境来绽放自己的才华。',
  },
};

export const abilityMap: Record<AbilityDimension, AbilityInfo> = {
  communication: {
    name: '沟通力',
    icon: 'MessageCircle',
    description: '指有效表达思想、倾听他人和促进信息交流的能力。高沟通力者能清晰传达观点，善于理解他人意图，建立良好的人际互动。',
  },
  leadership: {
    name: '领导力',
    icon: 'Flag',
    description: '指影响他人、引导团队达成目标的能力。高领导力者具有远见、决策力和激励他人的能力，能够带领团队克服困难。',
  },
  creativity: {
    name: '创造力',
    icon: 'Lightbulb',
    description: '指产生新颖想法、灵活解决问题和突破常规思维的能力。高创造力者善于发现新的可能性，不拘泥于传统方法。',
  },
  analysis: {
    name: '分析力',
    icon: 'Brain',
    description: '指逻辑推理、系统性思考和问题拆解的能力。高分析力者能够从复杂信息中提取关键要素，做出理性判断。',
  },
  resilience: {
    name: '抗压力',
    icon: 'Shield',
    description: '指在逆境中保持情绪稳定、适应变化和快速恢复的能力。高抗压力者面对挫折能保持冷静，将压力转化为前进动力。',
  },
  empathy: {
    name: '同理心',
    icon: 'Heart',
    description: '指理解他人情感、换位思考和共情回应的能力。高同理心者能够敏锐感知他人的情绪状态，建立深厚的情感连接。',
  },
};

// 根据气质类型和能力得分生成综合解读
export function getInterpretation(
  temperament: TemperamentType,
  temperamentScores: TemperamentScores,
  abilityScores: AbilityScores
): string {
  const tInfo = temperamentMap[temperament];

  // 找出主要气质（最高分）和次要气质（第二高分）
  const sortedTemperaments = (Object.entries(temperamentScores) as [TemperamentType, number][])
    .sort((a, b) => b[1] - a[1]);

  const primaryTemperament = sortedTemperaments[0][0];
  const secondaryTemperament = sortedTemperaments[1][0];
  const secondaryScore = sortedTemperaments[1][1];

  const primaryInfo = temperamentMap[primaryTemperament];
  const secondaryInfo = temperamentMap[secondaryTemperament];

  // 找出最高和最低的能力维度
  const abilities = Object.entries(abilityScores).sort((a, b) => b[1] - a[1]);
  const topAbility = abilityMap[abilities[0][0] as AbilityDimension];
  const bottomAbility = abilityMap[abilities[3][0] as AbilityDimension];

  // 综合主要和次要气质进行解读
  let interpretation = `${primaryInfo.description}`;

  // 如果次要气质得分较高（≥30%），补充次要气质的特点
  if (secondaryScore >= 30) {
    interpretation += `

同时，被观察者也展现出一定的${secondaryInfo.name}特质，如${secondaryInfo.features.slice(0, 3).join('、')}等。这种气质组合使得被观察者既有${primaryInfo.name}的核心特点，又兼具${secondaryInfo.name}的某些优势，呈现出更为丰富的行为模式。`;
  }

  interpretation += `

在能力维度方面，被观察者在「${topAbility.name}」方面表现最为突出，这意味着${topAbility.description.slice(0, 30)}……同时，在「${bottomAbility.name}」方面有进一步的成长空间，这并非缺陷，而是每个人独特气质带来的自然倾向。

需要强调的是，气质和能力的判断是基于观察者在特定情境中的行为选择，反映的是行为倾向而非固定不变的标签。每个人都有可塑性，在不同的环境和经历中，我们的气质和能力都会不断发展和变化。本评估旨在提供一种参考视角，帮助观察者更好地理解被观察对象的行为模式。`;

  return interpretation;
}