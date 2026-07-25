import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, Target } from 'lucide-react';
import Disclaimer from '../components/ui/Disclaimer';
import { useAuthStore } from '../stores/auth';
import type { AccountTier } from '../types/account';

interface TierCardConfig {
  tier: AccountTier;
  title: string;
  subtitle: string;
  price?: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  // 卡片配色（差异化气质色）
  gradient: string;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  borderHover: string;
}

const TIERS: TierCardConfig[] = [
  {
    tier: 'free',
    title: '免费版',
    subtitle: '个人气质与能力探索',
    features: ['测气质类型', '分析 6 项能力维度'],
    icon: Sparkles,
    gradient: 'from-[#E8E6F5] to-[#D5D0E8]',
    iconBg: 'bg-white/70',
    iconColor: 'text-[#6B6491]',
    accentColor: 'text-[#4A4566]',
    borderHover: 'hover:border-[#B5B0CC]',
  },
  {
    tier: 'pro',
    title: 'Pro 版',
    subtitle: '团队气质与能力洞察',
    price: '$17',
    features: ['最多 60 位被观察者', '团队气质能力聚合分析', '永久权限'],
    icon: Users,
    gradient: 'from-[#5B4FCF] to-[#7B6FE0]',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    accentColor: 'text-white',
    borderHover: 'hover:border-[#5B4FCF]',
  },
  {
    tier: 'max',
    title: 'Max 版',
    subtitle: '任务完成情况预判',
    price: '$37',
    features: ['最多 160 位被观察者', '团队聚合分析', '任务适配度预判', '永久权限'],
    icon: Target,
    gradient: 'from-[#C9A86A] via-[#D4B575] to-[#E5C58A]',
    iconBg: 'bg-white/25',
    iconColor: 'text-white',
    accentColor: 'text-white',
    borderHover: 'hover:border-[#C9A86A]',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();

  const handleSelect = (tier: AccountTier) => {
    if (tier === 'free') {
      navigate('/free');
      return;
    }

    // 已登录用户：根据当前 tier 决定行为
    if (user && profile) {
      const currentTier = profile.tier;

      // 已是该版本或更高版本 → 直接进入工作台
      if (currentTier === tier || (currentTier === 'max' && tier === 'pro')) {
        navigate(`/${currentTier === 'max' ? 'max' : tier}`);
        return;
      }

      // Pro → Max 升级：跳转升级页（补差价 $20）
      if (currentTier === 'pro' && tier === 'max') {
        navigate('/register/max?upgrade=true');
        return;
      }

      // free → Pro/Max：跳转注册页（新购买）
      navigate(`/register/${tier}`);
      return;
    }

    // 未登录 → 注册页
    navigate(`/register/${tier}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] md:max-w-[820px] lg:max-w-[960px] flex flex-col gap-8">
        {/* 顶部主题 */}
        <header className="text-center pt-4">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-[10px] border border-white/50 text-[#5B4FCF] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
            Temperament Insight
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
          </div>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#3D3A5C] mb-3"
            style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}
          >
            Figure out individual personalities first,
            <br />
            <span className="bg-gradient-to-r from-[#5B4FCF] to-[#C9A86A] bg-clip-text text-transparent">
              then unify the team
            </span>
          </h1>
          <p className="text-sm md:text-base text-[#8E8CA8] leading-relaxed max-w-md mx-auto">
            从个体气质洞察出发，构建团队合力 — 选择适合你的版本
          </p>
        </header>

        {/* 三张卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {TIERS.map((card) => {
            const Icon = card.icon;
            const isPaid = !!card.price;
            return (
              <button
                key={card.tier}
                onClick={() => handleSelect(card.tier)}
                className={`group relative overflow-hidden rounded-[20px] bg-gradient-to-br ${card.gradient} p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(91,79,207,0.18)] border-2 border-white/40 ${card.borderHover}`}
              >
                {/* 装饰圆点 */}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10 blur-xl pointer-events-none" />

                <div className="relative flex flex-col gap-3">
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>

                  <div>
                    <h3 className={`text-lg font-bold ${card.accentColor}`} style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
                      {card.title}
                    </h3>
                    <p className={`text-xs ${isPaid ? 'text-white/80' : 'text-[#6B6491]'} mt-0.5`}>
                      {card.subtitle}
                    </p>
                  </div>

                  {isPaid && (
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-bold ${card.accentColor}`}>{card.price}</span>
                      <span className={`text-xs ${isPaid ? 'text-white/70' : 'text-[#8E8CA8]'}`}>永久权限</span>
                    </div>
                  )}

                  <ul className="flex flex-col gap-1.5 mt-1">
                    {card.features.map((f, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-1.5 text-xs leading-relaxed ${
                          isPaid ? 'text-white/90' : 'text-[#4A4566]'
                        }`}
                      >
                        <span className={`mt-1 w-1 h-1 rounded-full flex-shrink-0 ${isPaid ? 'bg-white/70' : 'bg-[#6B6491]/60'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`mt-3 text-xs font-medium px-3 py-2 rounded-full text-center transition-all ${
                      isPaid
                        ? 'bg-white/20 text-white group-hover:bg-white/30'
                        : 'bg-white/50 text-[#5B4FCF] group-hover:bg-white/80'
                    }`}
                  >
                    {isPaid ? `选择 ${card.title}` : '开始免费体验'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <Disclaimer />

        <footer className="text-center text-xs text-[#8E8CA8]/70">
          © {new Date().getFullYear()} Temperament Insight · 仅用于自我探索与团队洞察参考
        </footer>
      </div>
    </div>
  );
}
