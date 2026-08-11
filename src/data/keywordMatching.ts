import type { TemperamentType, AbilityDimension, DimensionWeights } from '../types';

// ====== 综合评价结构 ======
export interface ComprehensiveEvaluation {
  temperament: TemperamentType | 'unknown';
  behaviors: string[];
  abilities: AbilityDimension[];
  emotion: string;
}

// ====== 自动分析结果（气质一定有值） ======
export interface AnalyzedEvaluation {
  temperament: TemperamentType;
  behaviors: string[];
  abilities: AbilityDimension[];
  emotion: string;
}

// ====== 气质关键词（7 种语言） ======
const temperamentKeywords: Record<TemperamentType, { keywords: string[]; weight: number }> = {
  sanguine: {
    keywords: [
      // 中文
      '活泼', '外向', '开朗', '乐观', '热情', '社交', '交际', '活跃', '健谈', '爱说话',
      '喜欢交流', '反应快', '灵活', '适应力强', '善于沟通', '外向型', '人缘好', '合群',
      '乐观开朗', '乐天派', '积极主动', '主动沟通', '喜欢尝试', '不拘小节', '随和',
      '喜欢热闹', '不怕生', '善于表达', '话多', '喜欢聊天', '容易相处', '人来疯',
      '先玩', '放松', '开心', '无所谓', '随便', '凑热闹', '玩一玩', '试试看', '随它去',
      // English
      'outgoing', 'cheerful', 'optimistic', 'enthusiastic', 'sociable', 'talkative', 'lively',
      'energetic', 'expressive', 'fun', 'playful', 'spontaneous', 'flexible', 'adaptable',
      'warm', 'friendly', 'chat', 'social', 'active', 'enjoy', 'happy', 'relax', 'whatever',
      'casual', 'try it', 'hang out',
      // Español
      'extrovertido', 'alegre', 'optimista', 'entusiasta', 'sociable', 'hablador', 'animado',
      'energico', 'expresivo', 'divertido', 'flexible', 'adaptable', 'calido', 'amigable',
      // Deutsch
      'lebhaft', 'extrovertiert', 'fröhlich', 'optimistisch', 'begeisterungsfähig', 'gesprächig',
      'energisch', 'ausdrucksstark', 'flexibel', 'anpassungsfähig', 'warmherzig', 'freundlich',
      // Français
      'extraverti', 'joyeux', 'optimiste', 'enthousiaste', 'sociable', 'bavard', 'animé',
      'énergique', 'expressif', 'souple', 'adaptable', 'chaleureux', 'amical',
      // 日本語
      '活発', '外交的', '明るい', '楽観的', '情熱的', '社交的', 'おしゃべり', '元気',
      '柔軟', '適応力', '表現豊か', '楽しい', '人懐っこい',
      // 한국어
      '외향적', '쾌활한', '낙관적', '열정적인', '사교적인', '수다스러운', '활기찬',
      '유연한', '적응력', '표현력', '친근한',
    ],
    weight: 3,
  },
  choleric: {
    keywords: [
      // 中文
      '果断', '坚定', '强势', '领导', '主导', '决策', '目标', '行动力', '魄力', '敢作敢当',
      '直率', '坦诚', '不拐弯抹角', '干脆', '利落', '雷厉风行', '有主见', '坚持己见',
      '不喜欢拖延', '效率', '快速', '主动出击', '掌控', '主导权', '不妥协', '强硬',
      '坚持', '抗争', '反驳', '辩论', '争论', '质疑', '挑战', '竞争', '不认输',
      '先做', '立刻', '马上', '直接', '毫不犹豫', '坚决', '一定', '必须', '立刻行动',
      // English
      'decisive', 'firm', 'assertive', 'lead', 'leader', 'dominant', 'decision', 'goal',
      'action', 'direct', 'straightforward', 'efficient', 'fast', 'take charge', 'control',
      'no compromise', 'persistent', 'argue', 'debate', 'challenge', 'compete', 'do it now',
      'immediately', 'must', 'insist', 'determined',
      // Español
      'decidido', 'firme', 'asertivo', 'liderar', 'dominante', 'decisión', 'meta', 'acción',
      'directo', 'eficiente', 'rápido', 'tomar control', 'competir', 'desafiar',
      // Deutsch
      'entschlossen', 'bestimmt', 'dominant', 'führen', 'leiter', 'ziel', 'aktion', 'direkt',
      'effizient', 'schnell', 'kontrolle', 'wettbewerbsfähig', 'herausfordern',
      // Français
      'décidé', 'ferme', 'assertif', 'mener', 'dominant', 'décision', 'objectif', 'action',
      'direct', 'efficace', 'rapide', 'prendre le contrôle', 'compétitif', 'défier',
      // 日本語
      '断固', '決定的', '主導的', 'リード', '目標', '行動', '直接的', '効率的', '迅速',
      '競争', '挑戦', '主張',
      // 한국어
      '단호한', '결단력', '주도적', '리드', '목표', '행동', '직접적', '효율적', '신속',
      '경쟁', '도전',
    ],
    weight: 3,
  },
  phlegmatic: {
    keywords: [
      // 中文
      '稳重', '安静', '冷静', '沉稳', '淡定', '平和', '温和', '稳定', '耐心', '忍耐',
      '按部就班', '循规蹈矩', '守规矩', '谨慎', '保守', '不急不躁', '不冲动', '稳扎稳打',
      '倾听', '配合', '协调', '调和', '不争执', '不冲突', '回避矛盾', '求同存异',
      '慢慢', '不着急', '无所谓', '随缘', '顺其自然', '不强求', '躺平', '混日子',
      '服从', '遵守', '按安排', '听从', '随大流', '不主动', '被动', '等待',
      // English
      'steady', 'calm', 'quiet', 'composed', 'patient', 'stable', 'mild', 'gentle', 'careful',
      'cautious', 'conservative', 'follow rules', 'step by step', 'listen', 'cooperate',
      'coordinate', 'avoid conflict', 'slow', 'no rush', 'go with the flow', 'wait', 'passive',
      'obey', 'comply', 'laid back',
      // Español
      'sereno', 'tranquilo', 'calmado', 'paciente', 'estable', 'suave', 'cuidadoso',
      'cauteloso', 'cooperar', 'evitar conflictos', 'lento', 'pasivo', 'obedecer',
      // Deutsch
      'ruhig', 'gelassen', 'geduldig', 'stabil', 'mild', 'vorsichtig', 'kooperieren',
      'konflikte vermeiden', 'langsam', 'passiv', 'gehorchen',
      // Français
      'serein', 'calme', 'patient', 'stable', 'doux', 'prudent', 'coopérer',
      'éviter les conflits', 'lent', 'passif', 'obéir',
      // 日本語
      '穏やか', '冷静', '辛抱強い', '安定', '穏健', '慎重', '協力', '対立回避',
      'ゆっくり', '受動的', '従う',
      // 한국어
      '차분한', '침착한', '인내심', '안정적', '온화한', '신중한', '협력', '느긋한',
      '수동적', '따르는',
    ],
    weight: 3,
  },
  melancholic: {
    keywords: [
      // 中文
      '敏感', '细腻', '深入', '思考', '分析', '观察', '细节', '完美', '追求', '认真',
      '内敛', '内向', '沉默', '安静', '独处', '不爱说话', '不善表达', '内心丰富',
      '担心', '焦虑', '纠结', '犹豫', '反复', '内耗', '煎熬', '压抑', '不安',
      '容易受伤', '情绪化', '多想', '胡思乱想', '自我怀疑', '自责', '愧疚',
      '追求完美', '高标准', '严要求', '认真负责', '一丝不苟', '精益求精',
      '失眠', '睡不着', '吃不好', '情绪低落', '郁闷', '痛苦', '挣扎',
      // English
      'sensitive', 'delicate', 'deep', 'think', 'analyze', 'observe', 'detail', 'perfection',
      'introvert', 'introverted', 'quiet', 'silent', 'alone', 'solitude', 'worry', 'anxious',
      'hesitate', 'overthink', 'self-doubt', 'guilty', 'perfectionist', 'high standard',
      'meticulous', 'insomnia', 'sleepless', 'depressed', 'struggle', 'emotional',
      // Español
      'sensible', 'delicado', 'profundo', 'pensar', 'analizar', 'observar', 'detalle',
      'perfeccionista', 'introvertido', 'preocupar', 'ansioso', 'dudar', 'culpable',
      'meticuloso', 'insomnio', 'deprimido', 'lucha',
      // Deutsch
      'empfindlich', 'feinfühlig', 'tief', 'denken', 'analysieren', 'beobachten', 'detail',
      'perfektionist', 'introvertiert', 'sorge', 'ängstlich', 'zweifeln', 'schuldig',
      'penibel', 'schlaflos', 'deprimiert',
      // Français
      'sensible', 'délicat', 'profond', 'réfléchir', 'analyser', 'observer', 'détail',
      'perfectionniste', 'introverti', 'inquiet', 'anxieux', 'douter', 'coupable',
      'minutieux', 'insomniaque', 'déprimé',
      // 日本語
      '敏感', '繊細', '深い', '考える', '分析', '観察', '詳細', '完璧主義',
      '内向的', '心配', '不安', '迷う', '罪悪感', '几帳面', '不眠', '憂鬱',
      // 한국어
      '민감한', '섬세한', '깊이', '생각하다', '분석', '관찰', '세부', '완벽주의',
      '내향적', '걱정', '불안', '망설임', '죄책감', '꼼꼼한', '불면', '우울',
    ],
    weight: 3,
  },
};

// ====== 能力关键词（7 种语言） ======
const abilityKeywords: Record<AbilityDimension, { keywords: string[]; weight: number }> = {
  communication: {
    keywords: [
      '沟通', '交流', '表达', '说服', '谈判', '倾听', '反馈', '说话', '聊天', '讨论',
      'communicate', 'talk', 'express', 'persuade', 'negotiate', 'listen', 'feedback', 'discuss',
      'comunicar', 'expresar', 'persuadir', 'escuchar',
      'kommunizieren', 'ausdrücken', 'überreden', 'zuhören',
      'communiquer', 'exprimer', 'persuader', 'écouter',
      '伝える', '話す', '説得', '聞く',
      '소통', '표현', '설득', '듣다',
    ],
    weight: 2,
  },
  leadership: {
    keywords: [
      '领导', '带领', '指挥', '组织', '管理', '决策', '负责', '协调团队', '分配任务',
      'lead', 'leader', 'guide', 'direct', 'organize', 'manage', 'decide', 'responsible',
      'liderar', 'guiar', 'organizar', 'gestionar',
      'führen', 'leiten', 'organisieren', 'verwalten',
      'mener', 'guider', 'organiser', 'gérer',
      'リード', '指揮', '組織', '管理',
      '이끌다', '지휘', '조직', '관리',
    ],
    weight: 2,
  },
  creativity: {
    keywords: [
      '创造', '创新', '创意', '灵感', '想象', '新颖', '独特', '突破', '设计', '构思',
      'create', 'creative', 'innovation', 'idea', 'inspire', 'imagine', 'novel', 'unique',
      'crear', 'innovar', 'idea', 'imaginación',
      'erschaffen', 'innovativ', 'idee', 'phantasie',
      'créer', 'innover', 'idée', 'imagination',
      '創造', '革新', 'アイデア', '想像',
      '창조', '혁신', '아이디어', '상상',
    ],
    weight: 2,
  },
  analysis: {
    keywords: [
      '分析', '逻辑', '推理', '拆解', '研究', '调查', '数据', '比较', '评估', '计划',
      'analyze', 'analysis', 'logic', 'reasoning', 'research', 'investigate', 'data', 'compare',
      'analizar', 'lógica', 'investigar', 'datos',
      'analysieren', 'logik', 'forschen', 'daten',
      'analyser', 'logique', 'rechercher', 'données',
      '分析', '論理', '調査', 'データ',
      '분석', '논리', '조사', '데이터',
    ],
    weight: 2,
  },
  resilience: {
    keywords: [
      '坚持', '抗压', '克服', '恢复', '韧性', '毅力', '不放弃', '忍受', '挺过', '面对困难',
      'persist', 'resilience', 'overcome', 'recover', 'endure', 'tough', 'never give up',
      'persistir', 'resiliencia', 'superar', 'recuperar',
      'durchhalten', 'widerstandsfähig', 'überwinden', 'erholen',
      'persister', 'résilience', 'surmonter', 'récupérer',
      '忍耐', '回復', '乗り越える', '諦めない',
      '인내', '회복', '극복', '포기하지 않다',
    ],
    weight: 2,
  },
  empathy: {
    keywords: [
      '共情', '理解', '关心', '体谅', '感受', '同情', '照顾', '支持', '帮助', '温暖',
      'empathy', 'understand', 'care', 'support', 'help', 'sympathy', 'compassion', 'considerate',
      'empatía', 'comprender', 'cuidar', 'apoyar',
      'empathie', 'verstehen', 'kümmern', 'unterstützen',
      'empathie', 'comprendre', 'soutenir', 'aider',
      '共感', '理解する', '気遣う', '支える',
      '공감', '이해하다', '돌보다', '지지하다',
    ],
    weight: 2,
  },
};

// ====== 行为倾向关键词 ======
const behaviorKeywords: Record<string, { keywords: string[] }> = {
  proactive: {
    keywords: [
      '主动', '先做', '发起', '提议', '积极', '行动', '立刻', '马上',
      'proactive', 'initiative', 'take action', 'immediately', 'volunteer', 'step up',
      'proactivo', 'iniciativa', 'inmediato',
      'proaktiv', 'initiative', 'sofort',
      'proactif', 'initiative', 'immédiatement',
      '主体的', '自発的', 'すぐに',
      '주도적', '자발적', '즉시',
    ],
  },
  rational: {
    keywords: [
      '理性', '逻辑', '分析', '思考', '客观', '冷静判断', '权衡',
      'rational', 'logical', 'analytical', 'objective', 'reasoning', 'weigh',
      'racional', 'lógico', 'objetivo',
      'rational', 'logisch', 'objektiv',
      'rationnel', 'logique', 'objectif',
      '理性的', '論理的', '客観的',
      '합리적', '논리적', '객관적',
    ],
  },
  collaborative: {
    keywords: [
      '合作', '协作', '团队', '一起', '商量', '配合', '寻求帮助', '讨论',
      'collaborate', 'team', 'together', 'cooperate', 'discuss', 'seek help',
      'colaborar', 'equipo', 'juntos', 'cooperar',
      'zusammenarbeiten', 'team', 'gemeinsam', 'kooperieren',
      'collaborer', 'équipe', 'ensemble', 'coopérer',
      '協力', 'チーム', '一緒に', '相談',
      '협력', '팀', '함께', '협동',
    ],
  },
  creative: {
    keywords: [
      '创新', '创意', '新方法', '打破常规', '灵感', '想象', '尝试新',
      'innovate', 'creative', 'new approach', 'break rules', 'inspiration', 'try new',
      'innovar', 'creativo', 'nuevo enfoque',
      'innovation', 'kreativ', 'neuer ansatz',
      'innover', 'créatif', 'nouvelle approche',
      '革新', '創造的', '新しい方法',
      '혁신', '창의적', '새로운 방법',
    ],
  },
};

// ====== 情绪关键词 ======
const emotionKeywords: Record<string, { keywords: string[] }> = {
  positive: {
    keywords: [
      '开心', '快乐', '兴奋', '期待', '满意', '乐观', '积极', '愉快',
      'happy', 'excited', 'looking forward', 'satisfied', 'positive', 'glad', 'enthusiastic',
      'feliz', 'emocionado', 'satisfecho', 'positivo',
      'glücklich', 'begeistert', 'zufrieden', 'positiv',
      'heureux', 'excité', 'satisfait', 'positif',
      '嬉しい', '楽しい', 'ワクワク', '前向き',
      '행복', '신나는', '만족', '긍정적',
    ],
  },
  negative: {
    keywords: [
      '不开心', '失望', '沮丧', '消极', '烦', '无聊', '厌倦', '抗拒',
      'unhappy', 'disappointed', 'frustrated', 'negative', 'annoyed', 'bored', 'reluctant',
      'infeliz', 'decepcionado', 'frustrado', 'negativo',
      'unglücklich', 'enttäuscht', 'frustriert', 'negativ',
      'malheureux', 'déçu', 'frustré', 'négatif',
      '不幸せ', '失望', '不満', '消極的',
      '불행', '실망', '불만', '소극적',
    ],
  },
  anxious: {
    keywords: [
      '焦虑', '紧张', '害怕', '担心', '不安', '恐惧', '压力', '慌',
      'anxious', 'nervous', 'afraid', 'worried', 'stressed', 'fear', 'panic',
      'ansioso', 'nervioso', 'miedo', 'preocupado', 'estrés',
      'ängstlich', 'nervös', 'angst', 'besorgt', 'stress',
      'anxieux', 'nerveux', 'peur', 'inquiet', 'stress',
      '不安', '緊張', '怖い', '心配', 'ストレス',
      '불안', '긴장', '두려움', '걱정', '스트레스',
    ],
  },
};

// ====== 根据文本分析气质类型 ======
export function analyzeTemperamentFromText(text: string): TemperamentType {
  const scores: Record<TemperamentType, number> = {
    sanguine: 0,
    choleric: 0,
    phlegmatic: 0,
    melancholic: 0,
  };

  const lowerText = text.toLowerCase();

  for (const [temperament, data] of Object.entries(temperamentKeywords)) {
    for (const keyword of data.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        scores[temperament as TemperamentType] += data.weight;
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  // 无匹配时默认黏液质
  if (sorted[0][1] === 0) {
    return 'phlegmatic';
  }

  return sorted[0][0] as TemperamentType;
}

// ====== 根据文本做多维度综合分析 ======
export function analyzeFromText(text: string): AnalyzedEvaluation {
  const lowerText = text.toLowerCase();

  // 1. 气质分析
  const tempScores: Record<TemperamentType, number> = {
    sanguine: 0, choleric: 0, phlegmatic: 0, melancholic: 0,
  };
  for (const [temp, data] of Object.entries(temperamentKeywords)) {
    for (const kw of data.keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        tempScores[temp as TemperamentType] += data.weight;
      }
    }
  }
  const tempSorted = Object.entries(tempScores).sort((a, b) => b[1] - a[1]);
  const temperament = tempSorted[0][1] > 0
    ? tempSorted[0][0] as TemperamentType
    : 'phlegmatic';

  // 2. 能力分析
  const detectedAbilities: AbilityDimension[] = [];
  for (const [ability, data] of Object.entries(abilityKeywords)) {
    for (const kw of data.keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        detectedAbilities.push(ability as AbilityDimension);
        break;
      }
    }
  }

  // 3. 行为倾向分析
  const detectedBehaviors: string[] = [];
  for (const [behavior, data] of Object.entries(behaviorKeywords)) {
    for (const kw of data.keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        detectedBehaviors.push(behavior);
        break;
      }
    }
  }

  // 4. 情绪分析
  let emotion = 'neutral';
  let bestEmotionScore = 0;
  for (const [emo, data] of Object.entries(emotionKeywords)) {
    let score = 0;
    for (const kw of data.keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        score++;
      }
    }
    if (score > bestEmotionScore) {
      bestEmotionScore = score;
      emotion = emo;
    }
  }

  return {
    temperament,
    behaviors: detectedBehaviors,
    abilities: detectedAbilities,
    emotion,
  };
}

// ====== 创建初始零分对象 ======
function zeroWeights(): DimensionWeights {
  return {
    sanguine: 0, choleric: 0, phlegmatic: 0, melancholic: 0,
    communication: 0, leadership: 0, creativity: 0,
    analysis: 0, resilience: 0, empathy: 0,
    achievement: 0, affiliation: 0, power: 0, security: 0,
    proactive: 0, reactive: 0, rational: 0, emotional: 0,
    independent: 0, collaborative: 0, innovative: 0, conventional: 0,
  };
}

// ====== 根据综合评价生成权重 ======
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
