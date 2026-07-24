import type { MotivationScores } from '../../types';

interface MotivationAnalysisProps {
  scores: MotivationScores;
}

const motivationInfo = {
  achievement: {
    name: '成就动机',
    icon: '🎯',
    color: '#FF6B6B',
    description: '追求卓越、目标导向、渴望成功与成就',
    highDesc: '被观察者具有强烈的成就动机，渴望成功和卓越表现，喜欢挑战自我，追求目标达成。在面对任务时，倾向于设定高标准并努力实现。',
    mediumDesc: '被观察者具有一定的成就动机，会为达成目标而努力，但也能平衡工作与生活的关系，不过分追求完美。',
    lowDesc: '被观察者的成就动机相对较弱，更注重过程体验而非结果导向，对竞争和挑战的兴趣较低，更倾向于安稳和舒适的状态。',
  },
  affiliation: {
    name: '亲和动机',
    icon: '🤝',
    color: '#4ECDC4',
    description: '重视人际关系、归属感与和谐共处',
    highDesc: '被观察者具有强烈的亲和动机，非常重视人际关系和归属感，喜欢与人交往，善于建立和维护社交网络，在团队中表现活跃。',
    mediumDesc: '被观察者具有一定的亲和动机，重视人际关系，但也保持适度的独立性，既享受社交也接受独处。',
    lowDesc: '被观察者的亲和动机相对较弱，更享受独立工作，对社交活动的需求较低，可能在团队合作中需要更多鼓励。',
  },
  power: {
    name: '权力动机',
    icon: '⚡',
    color: '#FFE66D',
    description: '追求影响力、控制感与决策主导权',
    highDesc: '被观察者具有强烈的权力动机，渴望影响他人和掌控局面，喜欢主导决策过程，在领导岗位上能够发挥优势。',
    mediumDesc: '被观察者具有一定的权力动机，能够在需要时承担领导责任，但也尊重他人意见，不过分追求主导地位。',
    lowDesc: '被观察者的权力动机相对较弱，更倾向于配合而非主导，对管理和控制他人的兴趣较低，适合执行层面的角色。',
  },
  security: {
    name: '安全动机',
    icon: '🛡️',
    color: '#A8E6CF',
    description: '追求稳定、规避风险、强调安全与保障',
    highDesc: '被观察者具有强烈的安全动机，追求稳定和可预测的环境，谨慎决策，避免风险，重视长期规划和保障措施。',
    mediumDesc: '被观察者具有一定的安全动机，在决策时会考虑风险因素，但不过分保守，能够在安全与冒险间找到平衡。',
    lowDesc: '被观察者的安全动机相对较弱，更愿意冒险和尝试新事物，对不确定性的容忍度较高，适合创新型或挑战性的任务。',
  },
};

export default function MotivationAnalysis({ scores }: MotivationAnalysisProps) {
  const sortedScores = Object.entries(scores)
    .map(([key, value]) => ({
      key: key as keyof MotivationScores,
      value,
      info: motivationInfo[key as keyof typeof motivationInfo],
    }))
    .sort((a, b) => b.value - a.value);

  const dominantMotivation = sortedScores[0];
  const secondaryMotivation = sortedScores[1];

  const getDescription = (key: keyof MotivationScores, score: number) => {
    const info = motivationInfo[key];
    if (score >= 70) return info.highDesc;
    if (score >= 40) return info.mediumDesc;
    return info.lowDesc;
  };

  return (
    <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
      <h3 className="text-base font-semibold text-[#3D3A5C] mb-3 flex items-center gap-2">
        💡 动机类型分析
      </h3>

      {/* 主要动机 */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#5B4FCF]/5 to-[#7B6FE0]/5 border border-[#E0DCF5]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{dominantMotivation.info.icon}</span>
          <span className="text-sm font-semibold text-[#3D3A5C]">
            主导动机：{dominantMotivation.info.name}
          </span>
        </div>
        <p className="text-sm text-[#6B6990] leading-[1.6]">
          {getDescription(dominantMotivation.key, dominantMotivation.value)}
        </p>
      </div>

      {/* 次要动机（得分≥30%时显示） */}
      {secondaryMotivation.value >= 30 && (
        <div className="mb-4 p-3 rounded-xl bg-[#F8F7FF] border border-[#E8E6F5]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{secondaryMotivation.info.icon}</span>
            <span className="text-sm font-medium text-[#5A5880]">
              次要动机：{secondaryMotivation.info.name}
            </span>
          </div>
          <p className="text-sm text-[#8E8CA8] leading-[1.6]">
            {getDescription(secondaryMotivation.key, secondaryMotivation.value)}
          </p>
        </div>
      )}

      {/* 动机得分条 */}
      <div className="space-y-2">
        {sortedScores.map(({ key, value, info }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#5A5880] w-20">{info.name}</span>
            <div className="flex-1 h-2 bg-[#F0EEF8] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${value}%`,
                  backgroundColor: info.color,
                }}
              />
            </div>
            <span className="text-sm font-semibold text-[#5B4FCF] w-10 text-right">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}