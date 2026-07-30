import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Users, Target } from 'lucide-react';
import Disclaimer from '../components/ui/Disclaimer';
import { useAuthStore } from '../stores/auth';
import type { AccountTier } from '../types/account';
import { TIER_PRICING, type BillingPeriod } from '../config/pricing';

interface TierCardConfig {
  tier: AccountTier;
  title: string;
  subtitle: string;
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
    title: 'Free',
    subtitle: 'Personal temperament & ability exploration',
    features: ['Assess temperament type', 'Analyze 6 ability dimensions'],
    icon: Sparkles,
    gradient: 'from-[#E8E6F5] to-[#D5D0E8]',
    iconBg: 'bg-white/70',
    iconColor: 'text-[#6B6491]',
    accentColor: 'text-[#4A4566]',
    borderHover: 'hover:border-[#B5B0CC]',
  },
  {
    tier: 'pro',
    title: 'Pro',
    subtitle: 'Team temperament & ability insights',
    features: ['Up to 60 observers', 'Team temperament & ability analysis'],
    icon: Users,
    gradient: 'from-[#5B4FCF] to-[#7B6FE0]',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    accentColor: 'text-white',
    borderHover: 'hover:border-[#5B4FCF]',
  },
  {
    tier: 'max',
    title: 'Max',
    subtitle: 'Task completion prediction',
    features: ['Up to 160 observers', 'Team aggregate analysis', 'Task fit prediction'],
    icon: Target,
    gradient: 'from-[#C9A86A] via-[#D4B575] to-[#E5C58A]',
    iconBg: 'bg-white/25',
    iconColor: 'text-white',
    accentColor: 'text-white',
    borderHover: 'hover:border-[#C9A86A]',
  },
];

const PERIOD_LABELS: Record<BillingPeriod, string> = {
  monthly: 'Monthly',
  '6months': '6 Months',
  yearly: '1 Year',
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('yearly');

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

      // Pro → Max 升级：跳转升级页
      if (currentTier === 'pro' && tier === 'max') {
        navigate(`/register/max?upgrade=true&period=${selectedPeriod}`);
        return;
      }

      // free → Pro/Max：跳转注册页
      navigate(`/register/${tier}?period=${selectedPeriod}`);
      return;
    }

    // 未登录 → 注册页
    navigate(`/register/${tier}?period=${selectedPeriod}`);
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
            Start from individual temperament insights, build team synergy — choose your plan
          </p>
        </header>

        {/* 周期切换器 */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-full bg-white/60 backdrop-blur-[10px] border border-white/50">
            {(Object.keys(PERIOD_LABELS) as BillingPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-[#5B4FCF] text-white shadow-sm'
                    : 'text-[#8E8CA8] hover:text-[#5B4FCF]'
                }`}
              >
                {PERIOD_LABELS[period]}
              </button>
            ))}
          </div>
        </div>

        {/* 三张卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {TIERS.map((card) => {
            const Icon = card.icon;
            const isPaid = card.tier === 'pro' || card.tier === 'max';
            const pricing = isPaid ? TIER_PRICING[card.tier as 'pro' | 'max'][selectedPeriod] : null;

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

                  {isPaid && pricing && (
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-2xl font-bold ${card.accentColor}`}>{pricing.display}</span>
                        <span className={`text-xs ${isPaid ? 'text-white/70' : 'text-[#8E8CA8]'}`}>
                          / {PERIOD_LABELS[selectedPeriod].toLowerCase()}
                        </span>
                      </div>
                      {selectedPeriod !== 'monthly' && pricing.perMonth && (
                        <span className={`text-[10px] ${isPaid ? 'text-white/60' : 'text-[#8E8CA8]'}`}>
                          {pricing.perMonth} billed as {pricing.display}
                        </span>
                      )}
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
                    {isPaid ? `Select ${card.title}` : 'Start Free'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 隐私政策和服务条款按钮 */}
        <div className="flex justify-center gap-6">
          <Link
            to="/privacy"
            className="text-xs text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-xs text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors"
          >
            Terms of Service
          </Link>
        </div>

        <Disclaimer />

        <footer className="text-center text-xs text-[#8E8CA8]/70">
          © {new Date().getFullYear()} Temperament Insight · For self-exploration & team insight reference only
        </footer>
      </div>
    </div>
  );
}
