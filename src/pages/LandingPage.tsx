import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Users, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Disclaimer from '../components/ui/Disclaimer';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { useAuthStore } from '../stores/auth';
import type { AccountTier } from '../types/account';
import { TIER_PRICING, PERIOD_LABELS, type BillingPeriod } from '../config/pricing';

interface TierCardConfig {
  tier: AccountTier;
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
    icon: Sparkles,
    gradient: 'from-[#E8E6F5] to-[#D5D0E8]',
    iconBg: 'bg-white/70',
    iconColor: 'text-[#6B6491]',
    accentColor: 'text-[#4A4566]',
    borderHover: 'hover:border-[#B5B0CC]',
  },
  {
    tier: 'pro',
    icon: Users,
    gradient: 'from-[#5B4FCF] to-[#7B6FE0]',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    accentColor: 'text-white',
    borderHover: 'hover:border-[#5B4FCF]',
  },
  {
    tier: 'max',
    icon: Target,
    gradient: 'from-[#C9A86A] via-[#D4B575] to-[#E5C58A]',
    iconBg: 'bg-white/25',
    iconColor: 'text-white',
    accentColor: 'text-white',
    borderHover: 'hover:border-[#C9A86A]',
  },
];

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('yearly');

  // 检测未支付用户访问首页 → 自动清理
  useEffect(() => {
    if (user && profile?.paymentStatus === 'pending' && !profile?.tierExpiresAt) {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      fetch(`${supabaseUrl}/functions/v1/delete-unpaid-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ user_id: user.id }),
      }).then(() => signOut());
    }
  }, [user, profile, signOut]);

  const handleSelect = (tier: AccountTier) => {
    if (tier === 'free') {
      navigate('/free');
      return;
    }

    // 已登录用户：根据当前 tier 决定行为
    if (user && profile) {
      // 未支付用户 → 清理后进入注册页
      if (profile.paymentStatus === 'pending') {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        fetch(`${supabaseUrl}/functions/v1/delete-unpaid-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ user_id: user.id }),
        }).then(() => signOut());
        navigate(`/register/${tier}?period=${selectedPeriod}`);
        return;
      }

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
        <header className="text-center pt-4 relative">
          {/* 语言切换器：右上角 */}
          <div className="absolute top-0 right-0">
            <LanguageSwitcher />
          </div>

          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-[10px] border border-white/50 text-[#5B4FCF] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
            {t('landing.badge')}
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
          </div>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#3D3A5C] mb-3"
            style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}
          >
            {t('landing.titleLine1')}
            <br />
            <span className="bg-gradient-to-r from-[#5B4FCF] to-[#C9A86A] bg-clip-text text-transparent">
              {t('landing.titleLine2')}
            </span>
          </h1>
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
            const tierKey = card.tier as 'free' | 'pro' | 'max';

            const features: string[] = [
              t(`tiers.${tierKey}.feature1`),
              t(`tiers.${tierKey}.feature2`),
              ...(tierKey === 'max' ? [t('tiers.max.feature3')] : []),
            ];

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
                      {t(`tiers.${tierKey}.name`)}
                    </h3>
                    <p className={`text-xs ${isPaid ? 'text-white/80' : 'text-[#6B6491]'} mt-0.5`}>
                      {t(`tiers.${tierKey}.subtitle`)}
                    </p>
                  </div>

                  {isPaid && pricing && (
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-2xl font-bold ${card.accentColor}`}>{pricing.display}</span>
                        <span className={`text-xs ${isPaid ? 'text-white/70' : 'text-[#8E8CA8]'}`}>
                          {t('landing.perPeriod', { period: PERIOD_LABELS[selectedPeriod].toLowerCase() })}
                        </span>
                      </div>
                      {selectedPeriod !== 'monthly' && pricing.perMonth && (
                        <span className={`text-[10px] ${isPaid ? 'text-white/60' : 'text-[#8E8CA8]'}`}>
                          {t('landing.billedAs', { perMonth: pricing.perMonth, display: pricing.display })}
                        </span>
                      )}
                    </div>
                  )}

                  <ul className="flex flex-col gap-1.5 mt-1">
                    {features.map((f, i) => (
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
                    {t(`tiers.${tierKey}.cta`)}
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
            state={{ from: '/' }}
            className="text-xs text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors"
          >
            {t('landing.privacyPolicy')}
          </Link>
          <Link
            to="/terms"
            state={{ from: '/' }}
            className="text-xs text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors"
          >
            {t('landing.termsOfService')}
          </Link>
        </div>

        {/* 更多策略按钮 */}
        <div className="flex justify-center">
          <a
            href="https://www.dsrsilk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#5B4FCF] to-[#7B6FE0] text-white text-xs font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            {t('landing.moreStrategies')}
          </a>
        </div>

        <Disclaimer />

        <footer className="text-center text-xs text-[#8E8CA8]/70">
          {t('landing.footer', { year: new Date().getFullYear() })}
        </footer>
      </div>
    </div>
  );
}
