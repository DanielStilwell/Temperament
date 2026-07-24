import type { Scenario } from '../types';

const scenarios: Scenario[] = [
  {
    id: 1,
    situation: '在一次团队会议中，被观察者发现同事的方案存在明显漏洞，但该同事是团队中资历较深的前辈。此时被观察者会怎么做？',
    options: [
      {
        id: '1a',
        text: '当场委婉地指出问题，并提出具体的改进建议',
        weights: { sanguine: 3, choleric: 2, phlegmatic: 0, melancholic: 0, communication: 4, leadership: 3, creativity: 1, analysis: 2, resilience: 0, empathy: 2 },
      },
      {
        id: '1b',
        text: '直接指出问题，认为对事不对人，效率优先',
        weights: { sanguine: 0, choleric: 4, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 4, creativity: 0, analysis: 3, resilience: 3, empathy: 0 },
      },
      {
        id: '1c',
        text: '会后私下找这位同事沟通，避免在众人面前让对方难堪',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 4, melancholic: 1, communication: 3, leadership: 1, creativity: 0, analysis: 1, resilience: 0, empathy: 4 },
      },
      {
        id: '1d',
        text: '先观察其他人的反应，如果没人提出来，自己也不说',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 3, melancholic: 3, communication: 0, leadership: 0, creativity: 0, analysis: 2, resilience: 0, empathy: 1 },
      },
    ],
  },
  {
    id: 2,
    situation: '被观察者面临一个紧急项目，截止时间只剩两天，但还有大量工作未完成。他/她会怎么做？',
    options: [
      {
        id: '2a',
        text: '迅速制定计划，列出优先级，集中精力完成核心部分',
        weights: { sanguine: 1, choleric: 3, phlegmatic: 0, melancholic: 0, communication: 1, leadership: 3, creativity: 0, analysis: 4, resilience: 3, empathy: 0 },
      },
      {
        id: '2b',
        text: '积极寻求团队帮助，组织大家一起分担任务',
        weights: { sanguine: 4, choleric: 1, phlegmatic: 0, melancholic: 0, communication: 4, leadership: 3, creativity: 0, analysis: 0, resilience: 1, empathy: 1 },
      },
      {
        id: '2c',
        text: '冷静分析哪些可以简化，用替代方案确保核心目标达成',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 3, melancholic: 1, communication: 0, leadership: 1, creativity: 3, analysis: 4, resilience: 2, empathy: 0 },
      },
      {
        id: '2d',
        text: '加班加点独自完成，尽量不打扰他人',
        weights: { sanguine: 0, choleric: 1, phlegmatic: 1, melancholic: 3, communication: 0, leadership: 0, creativity: 0, analysis: 1, resilience: 4, empathy: 0 },
      },
    ],
  },
  {
    id: 3,
    situation: '被观察者在一个社交聚会上，周围大多是陌生人。他/她通常会怎么表现？',
    options: [
      {
        id: '3a',
        text: '主动与人攀谈，很快就能融入不同的聊天圈子',
        weights: { sanguine: 5, choleric: 1, phlegmatic: 0, melancholic: 0, communication: 5, leadership: 1, creativity: 0, analysis: 0, resilience: 0, empathy: 1 },
      },
      {
        id: '3b',
        text: '找一两个看起来有趣的人深入交流，不喜欢泛泛而谈',
        weights: { sanguine: 1, choleric: 2, phlegmatic: 0, melancholic: 3, communication: 3, leadership: 0, creativity: 0, analysis: 1, resilience: 0, empathy: 3 },
      },
      {
        id: '3c',
        text: '站在一旁观察，等待合适的时机再加入对话',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 2, melancholic: 4, communication: 0, leadership: 0, creativity: 0, analysis: 3, resilience: 0, empathy: 2 },
      },
      {
        id: '3d',
        text: '找熟悉的朋友待在一起，或者帮忙做一些组织工作',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 4, melancholic: 0, communication: 1, leadership: 1, creativity: 0, analysis: 0, resilience: 1, empathy: 2 },
      },
    ],
  },
  {
    id: 4,
    situation: '被观察者负责的项目失败了，需要向上级汇报原因。他/她的反应是？',
    options: [
      {
        id: '4a',
        text: '坦诚分析失败原因，承担自己的责任，同时提出改进方案',
        weights: { sanguine: 0, choleric: 2, phlegmatic: 1, melancholic: 0, communication: 2, leadership: 4, creativity: 0, analysis: 3, resilience: 4, empathy: 0 },
      },
      {
        id: '4b',
        text: '详细梳理整个过程，用数据和事实客观说明问题所在',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 3, melancholic: 2, communication: 1, leadership: 0, creativity: 0, analysis: 5, resilience: 1, empathy: 0 },
      },
      {
        id: '4c',
        text: '强调外部不可控因素，说明团队已经尽力了',
        weights: { sanguine: 1, choleric: 1, phlegmatic: 2, melancholic: 0, communication: 2, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 1 },
      },
      {
        id: '4d',
        text: '虽然沮丧但迅速调整心态，开始思考如何补救',
        weights: { sanguine: 1, choleric: 3, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 2, creativity: 2, analysis: 0, resilience: 5, empathy: 0 },
      },
    ],
  },
  {
    id: 5,
    situation: '被观察者看到有人在公共场合做出不文明行为（如插队、乱扔垃圾）。他/她通常会怎么做？',
    options: [
      {
        id: '5a',
        text: '直接上前礼貌地提醒对方',
        weights: { sanguine: 2, choleric: 4, phlegmatic: 0, melancholic: 0, communication: 2, leadership: 3, creativity: 0, analysis: 0, resilience: 3, empathy: 1 },
      },
      {
        id: '5b',
        text: '虽然心里不舒服，但选择不介入，避免冲突',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 4, melancholic: 2, communication: 0, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 2 },
      },
      {
        id: '5c',
        text: '用眼神或表情表达不满，希望对方能意识到',
        weights: { sanguine: 0, choleric: 1, phlegmatic: 1, melancholic: 3, communication: 0, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 3 },
      },
      {
        id: '5d',
        text: '自己默默地把垃圾捡起来或做正确的事，以身作则',
        weights: { sanguine: 1, choleric: 0, phlegmatic: 3, melancholic: 0, communication: 0, leadership: 2, creativity: 0, analysis: 0, resilience: 0, empathy: 4 },
      },
    ],
  },
  {
    id: 6,
    situation: '被观察者需要学习一项全新的技能以适应工作变化。他/她的学习方式更接近？',
    options: [
      {
        id: '6a',
        text: '报名课程或参加培训，喜欢有老师指导的系统学习',
        weights: { sanguine: 2, choleric: 0, phlegmatic: 2, melancholic: 0, communication: 1, leadership: 0, creativity: 0, analysis: 2, resilience: 0, empathy: 0 },
      },
      {
        id: '6b',
        text: '直接上手实践，边做边学，在实践中摸索',
        weights: { sanguine: 1, choleric: 4, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 2, creativity: 3, analysis: 0, resilience: 3, empathy: 0 },
      },
      {
        id: '6c',
        text: '找相关书籍和资料，自己深入研究理解原理',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 1, melancholic: 4, communication: 0, leadership: 0, creativity: 0, analysis: 5, resilience: 0, empathy: 0 },
      },
      {
        id: '6d',
        text: '与同行交流请教，通过讨论和分享来学习',
        weights: { sanguine: 3, choleric: 0, phlegmatic: 0, melancholic: 0, communication: 4, leadership: 0, creativity: 1, analysis: 0, resilience: 0, empathy: 2 },
      },
    ],
  },
  {
    id: 7,
    situation: '朋友向被观察者倾诉一个困扰已久的问题，他/她通常会怎么回应？',
    options: [
      {
        id: '7a',
        text: '认真倾听，先共情对方的感受，再一起分析问题',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 2, melancholic: 2, communication: 3, leadership: 0, creativity: 0, analysis: 2, resilience: 0, empathy: 5 },
      },
      {
        id: '7b',
        text: '直接给出解决方案和建议，帮助对方快速解决问题',
        weights: { sanguine: 0, choleric: 3, phlegmatic: 0, melancholic: 0, communication: 1, leadership: 2, creativity: 2, analysis: 3, resilience: 0, empathy: 0 },
      },
      {
        id: '7c',
        text: '用轻松幽默的方式转移对方注意力，让对方开心起来',
        weights: { sanguine: 4, choleric: 0, phlegmatic: 0, melancholic: 0, communication: 3, leadership: 0, creativity: 3, analysis: 0, resilience: 0, empathy: 2 },
      },
      {
        id: '7d',
        text: '分享自己类似的经历和感受，让对方知道不是一个人',
        weights: { sanguine: 1, choleric: 0, phlegmatic: 0, melancholic: 3, communication: 2, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 4 },
      },
    ],
  },
  {
    id: 8,
    situation: '在团队合作中，出现了意见分歧，双方各执一词。被观察者会如何处理？',
    options: [
      {
        id: '8a',
        text: '充当调解者，帮助双方找到共同点和折中方案',
        weights: { sanguine: 1, choleric: 0, phlegmatic: 3, melancholic: 0, communication: 4, leadership: 3, creativity: 1, analysis: 1, resilience: 0, empathy: 3 },
      },
      {
        id: '8b',
        text: '坚持自己的想法，用逻辑和数据说服对方',
        weights: { sanguine: 0, choleric: 4, phlegmatic: 0, melancholic: 0, communication: 1, leadership: 3, creativity: 0, analysis: 4, resilience: 2, empathy: 0 },
      },
      {
        id: '8c',
        text: '先退一步，让大家冷静下来，之后再讨论',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 4, melancholic: 1, communication: 0, leadership: 0, creativity: 0, analysis: 0, resilience: 3, empathy: 2 },
      },
      {
        id: '8d',
        text: '逐一分析每个方案的优缺点，让数据和事实说话',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 1, melancholic: 3, communication: 0, leadership: 0, creativity: 0, analysis: 5, resilience: 0, empathy: 1 },
      },
    ],
  },
  {
    id: 9,
    situation: '被观察者获得了意外的三天假期，完全自由支配。他/她最可能怎么度过？',
    options: [
      {
        id: '9a',
        text: '约朋友出去玩，安排各种社交活动和聚会',
        weights: { sanguine: 5, choleric: 1, phlegmatic: 0, melancholic: 0, communication: 3, leadership: 0, creativity: 1, analysis: 0, resilience: 0, empathy: 0 },
      },
      {
        id: '9b',
        text: '给自己安排一个挑战性项目，比如学新技能或完成某个目标',
        weights: { sanguine: 0, choleric: 4, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 2, creativity: 2, analysis: 0, resilience: 3, empathy: 0 },
      },
      {
        id: '9c',
        text: '在家好好休息，看书、看电影，享受独处时光',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 3, melancholic: 3, communication: 0, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 0 },
      },
      {
        id: '9d',
        text: '去一个没去过的地方旅行，探索新鲜事物',
        weights: { sanguine: 2, choleric: 1, phlegmatic: 0, melancholic: 1, communication: 0, leadership: 0, creativity: 4, analysis: 0, resilience: 0, empathy: 0 },
      },
    ],
  },
  {
    id: 10,
    situation: '被观察者发现一个同事正在使用明显低效的工作方法。他/她会怎么做？',
    options: [
      {
        id: '10a',
        text: '主动分享自己的高效方法，并耐心教对方如何使用',
        weights: { sanguine: 2, choleric: 0, phlegmatic: 2, melancholic: 0, communication: 3, leadership: 2, creativity: 0, analysis: 0, resilience: 0, empathy: 3 },
      },
      {
        id: '10b',
        text: '直接告诉对方有更好的方法，建议对方改进',
        weights: { sanguine: 0, choleric: 3, phlegmatic: 0, melancholic: 0, communication: 1, leadership: 3, creativity: 0, analysis: 1, resilience: 0, empathy: 0 },
      },
      {
        id: '10c',
        text: '先观察对方是否愿意接受建议，再决定是否开口',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 2, melancholic: 3, communication: 0, leadership: 0, creativity: 0, analysis: 2, resilience: 0, empathy: 2 },
      },
      {
        id: '10d',
        text: '不干涉，每个人有自己的工作方式',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 4, melancholic: 0, communication: 0, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 1 },
      },
    ],
  },
  {
    id: 11,
    situation: '在被观察者做重要决策时，他/她更倾向于哪种方式？',
    options: [
      {
        id: '11a',
        text: '依靠直觉和第一感觉，相信自己的判断',
        weights: { sanguine: 2, choleric: 3, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 2, creativity: 3, analysis: 0, resilience: 2, empathy: 0 },
      },
      {
        id: '11b',
        text: '收集大量信息，用数据和分析来支撑决策',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 1, melancholic: 4, communication: 0, leadership: 0, creativity: 0, analysis: 5, resilience: 0, empathy: 0 },
      },
      {
        id: '11c',
        text: '广泛征求他人意见，综合各方建议再做决定',
        weights: { sanguine: 1, choleric: 0, phlegmatic: 3, melancholic: 0, communication: 3, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 3 },
      },
      {
        id: '11d',
        text: '列出利弊清单，权衡各方因素后理性选择',
        weights: { sanguine: 0, choleric: 1, phlegmatic: 2, melancholic: 1, communication: 0, leadership: 1, creativity: 0, analysis: 4, resilience: 0, empathy: 0 },
      },
    ],
  },
  {
    id: 12,
    situation: '被观察者突然被要求在公开场合做一次即兴演讲。他/她的反应是？',
    options: [
      {
        id: '12a',
        text: '欣然接受，觉得这是一个展示自己的好机会',
        weights: { sanguine: 4, choleric: 3, phlegmatic: 0, melancholic: 0, communication: 4, leadership: 3, creativity: 0, analysis: 0, resilience: 2, empathy: 0 },
      },
      {
        id: '12b',
        text: '虽然紧张但迅速整理思路，用结构化的方式表达',
        weights: { sanguine: 0, choleric: 1, phlegmatic: 1, melancholic: 2, communication: 2, leadership: 1, creativity: 0, analysis: 3, resilience: 3, empathy: 0 },
      },
      {
        id: '12c',
        text: '感到非常紧张，需要一些时间准备才能开始',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 0, melancholic: 4, communication: 0, leadership: 0, creativity: 0, analysis: 1, resilience: 0, empathy: 1 },
      },
      {
        id: '12d',
        text: '用轻松随意的方式开场，以对话风格完成演讲',
        weights: { sanguine: 3, choleric: 0, phlegmatic: 2, melancholic: 0, communication: 3, leadership: 0, creativity: 2, analysis: 0, resilience: 0, empathy: 1 },
      },
    ],
  },
  {
    id: 13,
    situation: '被观察者遇到一个复杂的问题，一时找不到解决方案。他/她会怎么做？',
    options: [
      {
        id: '13a',
        text: '暂时放下，去做别的事情，期待灵感自然出现',
        weights: { sanguine: 2, choleric: 0, phlegmatic: 2, melancholic: 0, communication: 0, leadership: 0, creativity: 4, analysis: 0, resilience: 0, empathy: 0 },
      },
      {
        id: '13b',
        text: '坚持不懈地尝试各种方法，不达目的不罢休',
        weights: { sanguine: 0, choleric: 5, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 2, creativity: 0, analysis: 0, resilience: 5, empathy: 0 },
      },
      {
        id: '13c',
        text: '将问题拆解成小部分，逐一分析和解决',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 1, melancholic: 3, communication: 0, leadership: 0, creativity: 0, analysis: 5, resilience: 1, empathy: 0 },
      },
      {
        id: '13d',
        text: '找有经验的人一起讨论，碰撞思路',
        weights: { sanguine: 1, choleric: 0, phlegmatic: 0, melancholic: 0, communication: 3, leadership: 0, creativity: 2, analysis: 0, resilience: 0, empathy: 1 },
      },
    ],
  },
  {
    id: 14,
    situation: '在被观察者感到压力很大时，他/她通常会如何调节？',
    options: [
      {
        id: '14a',
        text: '通过运动或户外活动来释放压力',
        weights: { sanguine: 2, choleric: 3, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 0, creativity: 0, analysis: 0, resilience: 4, empathy: 0 },
      },
      {
        id: '14b',
        text: '找朋友聊天倾诉，把情绪说出来',
        weights: { sanguine: 3, choleric: 0, phlegmatic: 0, melancholic: 1, communication: 2, leadership: 0, creativity: 0, analysis: 0, resilience: 1, empathy: 2 },
      },
      {
        id: '14c',
        text: '独自安静地待着，听音乐、冥想或写日记',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 2, melancholic: 4, communication: 0, leadership: 0, creativity: 1, analysis: 0, resilience: 2, empathy: 0 },
      },
      {
        id: '14d',
        text: '化压力为动力，更专注地投入工作',
        weights: { sanguine: 0, choleric: 4, phlegmatic: 1, melancholic: 0, communication: 0, leadership: 2, creativity: 0, analysis: 0, resilience: 5, empathy: 0 },
      },
    ],
  },
  {
    id: 15,
    situation: '被观察者注意到团队中有新成员显得格格不入，不太融入集体。他/她会怎么做？',
    options: [
      {
        id: '15a',
        text: '主动接近对方，带他/她融入团队活动和话题',
        weights: { sanguine: 4, choleric: 0, phlegmatic: 0, melancholic: 0, communication: 4, leadership: 2, creativity: 0, analysis: 0, resilience: 0, empathy: 4 },
      },
      {
        id: '15b',
        text: '默默观察，在合适的时机给予帮助和鼓励',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 2, melancholic: 3, communication: 0, leadership: 0, creativity: 0, analysis: 1, resilience: 0, empathy: 4 },
      },
      {
        id: '15c',
        text: '在团队活动中特意安排对方参与，创造融入机会',
        weights: { sanguine: 0, choleric: 1, phlegmatic: 2, melancholic: 0, communication: 1, leadership: 3, creativity: 1, analysis: 0, resilience: 0, empathy: 3 },
      },
      {
        id: '15d',
        text: '认为每个人有自己的节奏，给对方时间和空间',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 4, melancholic: 0, communication: 0, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 2 },
      },
    ],
  },
  {
    id: 16,
    situation: '被观察者正在做一个创意项目，但灵感枯竭了。他/她会怎么应对？',
    options: [
      {
        id: '16a',
        text: '去接触完全不同领域的内容，寻找跨界灵感',
        weights: { sanguine: 1, choleric: 0, phlegmatic: 0, melancholic: 1, communication: 0, leadership: 0, creativity: 5, analysis: 0, resilience: 0, empathy: 0 },
      },
      {
        id: '16b',
        text: '和团队成员头脑风暴，碰撞出新的想法',
        weights: { sanguine: 3, choleric: 1, phlegmatic: 0, melancholic: 0, communication: 3, leadership: 1, creativity: 3, analysis: 0, resilience: 0, empathy: 0 },
      },
      {
        id: '16c',
        text: '研究成功案例，分析规律，在此基础上创新',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 1, melancholic: 3, communication: 0, leadership: 0, creativity: 2, analysis: 4, resilience: 0, empathy: 0 },
      },
      {
        id: '16d',
        text: '给自己一些压力，设定截止时间逼迫自己产出',
        weights: { sanguine: 0, choleric: 3, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 1, creativity: 0, analysis: 0, resilience: 3, empathy: 0 },
      },
    ],
  },
  {
    id: 17,
    situation: '被观察者与一位亲密朋友产生了严重分歧，关系变得紧张。他/她会怎么处理？',
    options: [
      {
        id: '17a',
        text: '主动找对方沟通，坦诚表达自己的感受并倾听对方',
        weights: { sanguine: 1, choleric: 0, phlegmatic: 0, melancholic: 0, communication: 4, leadership: 1, creativity: 0, analysis: 0, resilience: 1, empathy: 4 },
      },
      {
        id: '17b',
        text: '给彼此一些冷静的时间，等情绪平复后再处理',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 4, melancholic: 1, communication: 0, leadership: 0, creativity: 0, analysis: 0, resilience: 3, empathy: 2 },
      },
      {
        id: '17c',
        text: '坚持自己的立场，认为时间会证明谁是对的',
        weights: { sanguine: 0, choleric: 4, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 2, creativity: 0, analysis: 1, resilience: 2, empathy: 0 },
      },
      {
        id: '17d',
        text: '深入反思自己是否有问题，尝试从对方角度理解',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 0, melancholic: 4, communication: 0, leadership: 0, creativity: 0, analysis: 2, resilience: 0, empathy: 5 },
      },
    ],
  },
  {
    id: 18,
    situation: '被观察者同时收到多个任务，都需要在短时间内完成。他/她会怎么安排？',
    options: [
      {
        id: '18a',
        text: '快速评估每个任务的重要性和紧急度，排定优先级',
        weights: { sanguine: 0, choleric: 2, phlegmatic: 1, melancholic: 0, communication: 0, leadership: 2, creativity: 0, analysis: 4, resilience: 2, empathy: 0 },
      },
      {
        id: '18b',
        text: '先做最有把握的，快速完成一部分获得成就感',
        weights: { sanguine: 2, choleric: 1, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 0, creativity: 0, analysis: 1, resilience: 2, empathy: 0 },
      },
      {
        id: '18c',
        text: '先做最难的，趁精力最好的时候攻克难关',
        weights: { sanguine: 0, choleric: 4, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 1, creativity: 0, analysis: 1, resilience: 4, empathy: 0 },
      },
      {
        id: '18d',
        text: '把任务分给团队，发挥每个人的优势协同完成',
        weights: { sanguine: 1, choleric: 0, phlegmatic: 0, melancholic: 0, communication: 3, leadership: 4, creativity: 0, analysis: 0, resilience: 0, empathy: 1 },
      },
    ],
  },
  {
    id: 19,
    situation: '在被观察者情绪低落的一天，他/她最希望身边的人怎么做？',
    options: [
      {
        id: '19a',
        text: '带他/她去做一些有趣的事情，转移注意力',
        weights: { sanguine: 4, choleric: 0, phlegmatic: 0, melancholic: 0, communication: 1, leadership: 0, creativity: 1, analysis: 0, resilience: 0, empathy: 2 },
      },
      {
        id: '19b',
        text: '安静地陪在身边，不需要说太多话',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 3, melancholic: 3, communication: 0, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 3 },
      },
      {
        id: '19c',
        text: '帮他/她分析问题，给出实际的建议和方向',
        weights: { sanguine: 0, choleric: 2, phlegmatic: 0, melancholic: 0, communication: 1, leadership: 2, creativity: 0, analysis: 3, resilience: 0, empathy: 0 },
      },
      {
        id: '19d',
        text: '耐心倾听他/她的感受，给予理解和认可',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 0, melancholic: 2, communication: 2, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 5 },
      },
    ],
  },
  {
    id: 20,
    situation: '被观察者回顾过去一年，觉得自己最大的成长是什么？',
    options: [
      {
        id: '20a',
        text: '认识了更多有趣的人，拓展了社交圈和人脉',
        weights: { sanguine: 4, choleric: 0, phlegmatic: 0, melancholic: 0, communication: 3, leadership: 0, creativity: 0, analysis: 0, resilience: 0, empathy: 1 },
      },
      {
        id: '20b',
        text: '完成了几个重要的目标，能力得到了实质提升',
        weights: { sanguine: 0, choleric: 4, phlegmatic: 0, melancholic: 0, communication: 0, leadership: 3, creativity: 0, analysis: 0, resilience: 3, empathy: 0 },
      },
      {
        id: '20c',
        text: '对自己有了更深刻的认识，内心更加平和稳定',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 2, melancholic: 4, communication: 0, leadership: 0, creativity: 0, analysis: 0, resilience: 2, empathy: 2 },
      },
      {
        id: '20d',
        text: '学会了更好地处理复杂问题，思维能力有了突破',
        weights: { sanguine: 0, choleric: 0, phlegmatic: 1, melancholic: 2, communication: 0, leadership: 0, creativity: 1, analysis: 4, resilience: 0, empathy: 0 },
      },
    ],
  },
];

export default scenarios;