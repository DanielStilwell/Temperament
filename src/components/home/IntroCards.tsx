import { Eye, Users, Target } from 'lucide-react';
import Card from '../ui/Card';

const introItems = [
  {
    icon: Eye,
    title: 'Observer Perspective',
    desc: 'Evaluate behavior patterns from a third-party perspective',
    color: '#E8B4B8',
    bg: 'bg-[#F5E1E3]/60',
  },
  {
    icon: Users,
    title: 'Real Scenarios',
    desc: 'Based on 20 real-life scenarios, capturing natural behavioral responses',
    color: '#A3C4D9',
    bg: 'bg-[#DBEAF2]/60',
  },
  {
    icon: Target,
    title: 'Objective Assessment',
    desc: 'Multi-dimensional analysis of temperament & abilities, non-labeling evaluation',
    color: '#B8C9A8',
    bg: 'bg-[#E5EDDE]/60',
  },
];

export default function IntroCards() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {introItems.map((item) => (
        <Card key={item.title} hover className="p-4 text-center">
          <div
            className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${item.bg} mb-3 mx-auto`}
          >
            <item.icon className="w-5 h-5" style={{ color: item.color }} />
          </div>
          <h3 className="text-sm font-semibold text-[#3D3A5C] mb-1">{item.title}</h3>
          <p className="text-xs text-[#8E8CA8] leading-relaxed">{item.desc}</p>
        </Card>
      ))}
    </div>
  );
}