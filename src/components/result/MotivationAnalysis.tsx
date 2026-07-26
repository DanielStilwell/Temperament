import type { MotivationScores } from '../../types';

interface MotivationAnalysisProps {
  scores: MotivationScores;
}

const motivationInfo = {
  achievement: {
    name: 'Achievement',
    icon: '🎯',
    color: '#FF6B6B',
    description: 'Pursuing excellence, goal-oriented, driven by success',
    highDesc: 'The observer has a strong achievement motive, driven by success and excellence. They enjoy challenging themselves and pursuing goal attainment. When facing tasks, they tend to set high standards and strive to meet them.',
    mediumDesc: 'The observer has a moderate achievement motive, working toward goals while maintaining work-life balance, without excessive perfectionism.',
    lowDesc: 'The observer has a relatively weak achievement motive, focusing more on the process experience than outcome orientation, with lower interest in competition and challenges, preferring a stable and comfortable state.',
  },
  affiliation: {
    name: 'Affiliation',
    icon: '🤝',
    color: '#4ECDC4',
    description: 'Valuing relationships, belonging, and harmony',
    highDesc: 'The observer has a strong affiliation motive, deeply valuing interpersonal relationships and a sense of belonging. They enjoy socializing, are skilled at building and maintaining social networks, and are active in teams.',
    mediumDesc: 'The observer has a moderate affiliation motive, valuing relationships while maintaining appropriate independence, enjoying both social interaction and solitude.',
    lowDesc: 'The observer has a relatively weak affiliation motive, preferring independent work with lower need for social activities, and may need more encouragement in teamwork.',
  },
  power: {
    name: 'Power',
    icon: '⚡',
    color: '#FFE66D',
    description: 'Seeking influence, control, and decision-making authority',
    highDesc: 'The observer has a strong power motive, desiring to influence others and control situations. They enjoy leading decision-making processes and can leverage their strengths in leadership roles.',
    mediumDesc: 'The observer has a moderate power motive, able to take on leadership responsibilities when needed while respecting others\' opinions, without excessive desire for dominance.',
    lowDesc: 'The observer has a relatively weak power motive, preferring to cooperate rather than lead, with lower interest in managing or controlling others, suited for execution-level roles.',
  },
  security: {
    name: 'Security',
    icon: '🛡️',
    color: '#A8E6CF',
    description: 'Seeking stability, avoiding risk, emphasizing safety and security',
    highDesc: 'The observer has a strong security motive, pursuing stable and predictable environments, making cautious decisions, avoiding risks, and valuing long-term planning and safeguards.',
    mediumDesc: 'The observer has a moderate security motive, considering risk factors in decisions without being overly conservative, able to balance security and risk-taking.',
    lowDesc: 'The observer has a relatively weak security motive, more willing to take risks and try new things, with higher tolerance for uncertainty, suited for innovative or challenging tasks.',
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
        💡 Motivation Analysis
      </h3>

      {/* 主要动机 */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#5B4FCF]/5 to-[#7B6FE0]/5 border border-[#E0DCF5]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{dominantMotivation.info.icon}</span>
          <span className="text-sm font-semibold text-[#3D3A5C]">
            Dominant: {dominantMotivation.info.name}
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
              Secondary: {secondaryMotivation.info.name}
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
