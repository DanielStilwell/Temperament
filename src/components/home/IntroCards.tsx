import { Eye, Users, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';

export default function IntroCards() {
  const { t } = useTranslation();

  const introItems = [
    {
      icon: Eye,
      title: t('home.introObserverTitle'),
      desc: t('home.introObserverDesc'),
      color: '#E8B4B8',
      bg: 'bg-[#F5E1E3]/60',
    },
    {
      icon: Users,
      title: t('home.introScenariosTitle'),
      desc: t('home.introScenariosDesc'),
      color: '#A3C4D9',
      bg: 'bg-[#DBEAF2]/60',
    },
    {
      icon: Target,
      title: t('home.introObjectiveTitle'),
      desc: t('home.introObjectiveDesc'),
      color: '#B8C9A8',
      bg: 'bg-[#E5EDDE]/60',
    },
  ];

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
