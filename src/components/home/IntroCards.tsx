import { Eye, Users, Target } from 'lucide-react';
import Card from '../ui/Card';

const introItems = [
  {
    icon: Eye,
    title: '观察者视角',
    desc: '以第三方视角，客观评估被观察者的行为模式',
    color: '#E8B4B8',
    bg: 'bg-[#F5E1E3]/60',
  },
  {
    icon: Users,
    title: '真实情境',
    desc: '基于20个真实生活场景，还原自然行为反应',
    color: '#A3C4D9',
    bg: 'bg-[#DBEAF2]/60',
  },
  {
    icon: Target,
    title: '客观判断',
    desc: '多维分析气质与能力，提供非标签化评估',
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