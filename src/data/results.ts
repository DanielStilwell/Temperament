import type { TemperamentInfo, TemperamentType, TemperamentScores, AbilityInfo, AbilityDimension, AbilityScores } from '../types';

export const temperamentMap: Record<TemperamentType, TemperamentInfo> = {
  sanguine: {
    name: 'Sanguine',
    englishName: 'Sanguine',
    color: '#E8A87C',
    gradient: 'linear-gradient(135deg, #E8A87C 0%, #F3C9A0 100%)',
    animal: 'Dolphin',
    features: ['Sociable', 'Quick Response', 'Outgoing', 'Adaptable', 'Optimistic'],
    description: 'The observer exhibits a distinct Sanguine tendency. People with this temperament are typically energetic and socially adept, able to quickly adapt to environmental changes. They think quickly and are curious about new things, often serving as the key role in enlivening team atmosphere. Note that they may sometimes shift attention easily due to wide interests, and tasks requiring sustained focus may need extra self-management.',
  },
  choleric: {
    name: 'Choleric',
    englishName: 'Choleric',
    color: '#D96459',
    gradient: 'linear-gradient(135deg, #D96459 0%, #E8817A 100%)',
    animal: 'Lion',
    features: ['Energetic', 'Direct', 'Decisive', 'Goal-Oriented', 'Strong Leader'],
    description: 'The observer exhibits a distinct Choleric tendency. People with this temperament naturally possess a strong sense of purpose and drive, showing decisiveness and courage when facing challenges. They are frank and straightforward, not beating around the bush — natural leaders and drivers. Note that they may sometimes affect interpersonal relationships by being overly direct; learning to balance their own views with others\' feelings would be a valuable growth direction.',
  },
  phlegmatic: {
    name: 'Phlegmatic',
    englishName: 'Phlegmatic',
    color: '#6B9AC4',
    gradient: 'linear-gradient(135deg, #6B9AC4 0%, #8FB8D8 100%)',
    animal: 'Elephant',
    features: ['Calm', 'Patient', 'Emotionally Stable', 'Focused', 'Reliable'],
    description: 'The observer exhibits a distinct Phlegmatic tendency. People with this temperament are like still waters running deep — calm on the outside but steadfast within. They work steadily and reliably, not easily swayed by emotions, serving as the stabilizing force in a team. In tasks requiring patience and persistence, they often demonstrate extraordinary resilience. Their gentle approach also makes them excellent listeners and mediators.',
  },
  melancholic: {
    name: 'Melancholic',
    englishName: 'Melancholic',
    color: '#8E7CC3',
    gradient: 'linear-gradient(135deg, #8E7CC3 0%, #A89BD4 100%)',
    animal: 'Owl',
    features: ['Sensitive', 'Perceptive', 'Deep Thinker', 'Perfectionist', 'Creative'],
    description: 'The observer exhibits a distinct Melancholic tendency. Note that "Melancholic" here is a psychological temperament term, not a reference to emotional state. People with this temperament possess keen insight and deep thinking ability, able to notice details others easily overlook. They experience emotions profoundly and have rich inner worlds, often excelling in artistic creation and in-depth analysis. They need an environment that provides a sense of security to fully express their talents.',
  },
};

export const abilityMap: Record<AbilityDimension, AbilityInfo> = {
  communication: {
    name: 'Communication',
    icon: 'MessageCircle',
    description: 'The ability to express ideas effectively, listen to others, and facilitate information exchange. High communicators can convey viewpoints clearly, understand others\' intentions, and build positive interpersonal interactions.',
  },
  leadership: {
    name: 'Leadership',
    icon: 'Flag',
    description: 'The ability to influence others and guide teams toward goals. High leaders possess vision, decisiveness, and the ability to motivate others, steering teams through difficulties.',
  },
  creativity: {
    name: 'Creativity',
    icon: 'Lightbulb',
    description: 'The ability to generate novel ideas, solve problems flexibly, and break through conventional thinking. High creatives excel at discovering new possibilities, unbound by traditional methods.',
  },
  analysis: {
    name: 'Analysis',
    icon: 'Brain',
    description: 'The ability to reason logically, think systematically, and decompose problems. High analysts can extract key elements from complex information and make rational judgments.',
  },
  resilience: {
    name: 'Resilience',
    icon: 'Shield',
    description: 'The ability to maintain emotional stability in adversity, adapt to change, and recover quickly. High resilience individuals stay calm under setbacks, transforming pressure into forward momentum.',
  },
  empathy: {
    name: 'Empathy',
    icon: 'Heart',
    description: 'The ability to understand others\' emotions, think from their perspective, and respond with compassion. High empathy individuals can keenly sense others\' emotional states and build deep emotional connections.',
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

Additionally, the observer also exhibits certain ${secondaryInfo.name} traits, such as ${secondaryInfo.features.slice(0, 3).join(', ')}, etc. This temperament combination gives the observer both the core characteristics of ${primaryInfo.name} and certain advantages of ${secondaryInfo.name}, presenting richer behavioral patterns.`;
  }

  interpretation += `

In terms of ability dimensions, the observer performs most outstandingly in "${topAbility.name}", which means ${topAbility.description.slice(0, 50)}... At the same time, there is room for further growth in "${bottomAbility.name}" — this is not a deficiency, but a natural tendency resulting from each person's unique temperament.

It should be emphasized that temperament and ability assessments are based on behavioral choices in specific scenarios by the observer, reflecting behavioral tendencies rather than fixed labels. Everyone is malleable; in different environments and experiences, our temperament and abilities will continue to develop and change. This assessment aims to provide a reference perspective to help observers better understand the behavioral patterns of the observed individual.`;

  return interpretation;
}
