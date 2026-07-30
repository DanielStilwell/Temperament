import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User as UserIcon, AlertCircle, Loader2, ArrowUpCircle, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import { useAuthStore } from '../stores/auth';
import type { AccountTier } from '../types/account';
import { TIER_PRICING, calculateUpgradePrice, PERIOD_LABELS, type BillingPeriod } from '../config/pricing';

const TIER_INFO: Record<Exclude<AccountTier, 'free'>, { name: string; gradient: string }> = {
  pro: { name: 'Pro', gradient: 'from-[#5B4FCF] to-[#7B6FE0]' },
  max: { name: 'Max', gradient: 'from-[#C9A86A] via-[#D4B575] to-[#E5C58A]' },
};

export { PERIOD_LABELS };

export default function RegisterPage() {
  const { tier } = useParams<{ tier: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, user, profile, loading: authLoading, error, clearError } = useAuthStore();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const targetTier = (tier as Exclude<AccountTier, 'free'>) || 'pro';
  const info = TIER_INFO[targetTier] || TIER_INFO.pro;

  // 从 URL 读取计费周期，默认 yearly
  const periodParam = searchParams.get('period') as BillingPeriod | null;
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>(
    periodParam && ['monthly', '6months', 'yearly'].includes(periodParam) ? periodParam : 'yearly'
  );

  // 升级模式检测
  const isUpgrade = searchParams.get('upgrade') === 'true' && !!user && !!profile;
  const upgradeFrom = profile?.tier;

  // 当前定价信息
  const pricing = TIER_PRICING[targetTier][selectedPeriod];
  const isProToMax = isUpgrade && upgradeFrom === 'pro' && targetTier === 'max';
  const upgradeAmount = isProToMax ? calculateUpgradePrice('pro', 'max', selectedPeriod) : pricing.price;
  const displayAmount = isUpgrade ? upgradeAmount : pricing.price;
  const displayPriceStr = `$${displayAmount}`;

  useEffect(() => {
    if (targetTier !== 'pro' && targetTier !== 'max') {
      navigate('/', { replace: true });
    }
  }, [targetTier, navigate]);

  // 升级模式下，已登录用户直接进入支付步骤
  useEffect(() => {
    if (isUpgrade && step === 'form') {
      setStep('payment');
    }
  }, [isUpgrade, step]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!nickname.trim() || !email.trim() || password.length < 6) {
      return;
    }
    setSubmitting(true);
    const { error } = await signUp({ nickname: nickname.trim(), email: email.trim(), password, tier: targetTier });
    setSubmitting(false);
    if (!error) {
      setStep('payment');
    }
  };

  // Call Supabase Edge Function to create Creem checkout session, then redirect
  const handlePay = async () => {
    setPaying(true);
    setPayError(null);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const currentUserId = user?.id;
      const currentTier = profile?.tier ?? 'free';

      if (!currentUserId) {
        setPayError('Please log in before payment.');
        setPaying(false);
        return;
      }

      const res = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          user_id: currentUserId,
          tier: targetTier,
          billing_period: selectedPeriod,
          is_upgrade: isUpgrade,
          upgrade_from: isUpgrade ? currentTier : null,
        }),
      });

      const data = await res.json();

      if (data.error) {
        console.error('[handlePay] Edge Function error:', data.error, data.detail);
        setPayError(data.detail || data.error || 'Payment initialization failed. Please try again.');
        setPaying(false);
        return;
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        console.error('[handlePay] No checkout_url returned');
        setPayError('No checkout URL returned. Please contact support.');
        setPaying(false);
      }
    } catch (err) {
      console.error('[handlePay] Error:', err);
      setPayError('Network error. Please check your connection and try again.');
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] md:max-w-[480px] flex flex-col gap-5">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* 版本标识 */}
        <div className={`rounded-[20px] bg-gradient-to-br ${info.gradient} p-6 text-white text-center`}>
          {isUpgrade ? (
            <>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <ArrowUpCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
                Upgrade to {info.name}
              </h2>
              <p className="text-white/80 text-sm">
                From {TIER_INFO[upgradeFrom as 'pro']?.name ?? 'Free'} · {displayPriceStr} · {PERIOD_LABELS[selectedPeriod]} access
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
                Sign Up — {info.name}
              </h2>
              <p className="text-white/80 text-sm">
                {pricing.display} · {PERIOD_LABELS[selectedPeriod]} access
              </p>
            </>
          )}
        </div>

        {step === 'form' && (
          <form onSubmit={handleRegister} className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-6 flex flex-col gap-4">
            <Field
              label="Nickname"
              icon={<UserIcon className="w-4 h-4" />}
              value={nickname}
              onChange={setNickname}
              placeholder="How should we address you"
              type="text"
              autoComplete="nickname"
            />
            <Field
              label="Email"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={setEmail}
              placeholder="example@email.com"
              type="email"
              autoComplete="email"
            />
            <Field
              label="Password"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={setPassword}
              placeholder="At least 6 characters"
              type="password"
              autoComplete="new-password"
            />

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50/70 border border-red-200/50 rounded-2xl p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* 已阅声明勾选框 */}
            <label className="flex items-start gap-2.5 cursor-pointer group p-3 rounded-2xl bg-white/40 border border-[#E8E6F5] hover:border-[#5B4FCF]/40 transition-all">
              <span
                className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  agreed
                    ? 'bg-[#5B4FCF] border-[#5B4FCF]'
                    : 'bg-white border-[#C9C7DC] group-hover:border-[#5B4FCF]'
                }`}
              >
                {agreed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </span>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <span className="text-xs text-[#5D5A7C] leading-relaxed">
                I have read and agree to the{' '}
                <Link
                  to="/privacy"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#5B4FCF] font-medium hover:underline"
                >
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link
                  to="/terms"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#5B4FCF] font-medium hover:underline"
                >
                  Terms of Service
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={submitting || !nickname.trim() || !email.trim() || password.length < 6 || !agreed}
              className="disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing up...
                </>
              ) : (
                `Sign Up & Pay ${pricing.display}`
              )}
            </Button>

            <p className="text-xs text-[#8E8CA8] text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-[#5B4FCF] font-medium hover:underline">
                Log In
              </Link>
            </p>
          </form>
        )}

        {step === 'payment' && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-6 flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#5B4FCF]/10 flex items-center justify-center mx-auto">
              {isUpgrade ? (
                <ArrowUpCircle className="w-6 h-6 text-[#5B4FCF]" />
              ) : (
                <Mail className="w-6 h-6 text-[#5B4FCF]" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#3D3A5C] mb-1">
                {isUpgrade ? 'Complete Upgrade Payment' : 'Sign up successful, complete payment'}
              </h3>
              <p className="text-sm text-[#8E8CA8] leading-relaxed">
                {isUpgrade ? (
                  <>
                    You are currently a {TIER_INFO[upgradeFrom as 'pro']?.name ?? 'Free'} user.
                    Upgrading to {info.name} requires a price difference of {displayPriceStr}.
                    <br />
                    Observer limit will expand from 60 to 160, and the prediction feature will be unlocked.
                  </>
                ) : (
                  <>
                    We've sent a verification email to <span className="font-medium text-[#3D3A5C]">{email}</span>.
                    <br />
                    Pay {pricing.display} to get {PERIOD_LABELS[selectedPeriod].toLowerCase()} access to all {info.name} features.
                  </>
                )}
              </p>
            </div>

            {/* 周期选择器（支付页可选周期） */}
            <div className="flex justify-center gap-1 p-1 rounded-full bg-white/60 border border-[#E8E6F5]">
              {(Object.keys(PERIOD_LABELS) as BillingPeriod[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-[#5B4FCF] text-white'
                      : 'text-[#8E8CA8] hover:text-[#5B4FCF]'
                  }`}
                >
                  {PERIOD_LABELS[period]}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-[#5B4FCF]/5 border border-[#5B4FCF]/15 p-4 text-left">
              <p className="text-xs text-[#5B4FCF] font-semibold mb-2">
                {isUpgrade ? 'Upgrade Order' : 'Order Details'}
              </p>
              <div className="flex justify-between text-sm text-[#3D3A5C] mb-1">
                <span>Version</span>
                <span className="font-medium">
                  {isUpgrade
                    ? `${TIER_INFO[upgradeFrom as 'pro']?.name ?? 'Free'} → ${info.name}`
                    : `${info.name} · ${PERIOD_LABELS[selectedPeriod]}`
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm text-[#3D3A5C] mb-1">
                <span>Account</span>
                <span className="font-medium">{isUpgrade ? user?.email : email}</span>
              </div>
              <div className="flex justify-between text-base text-[#3D3A5C] mt-2 pt-2 border-t border-[#5B4FCF]/15">
                <span className="font-semibold">Amount Due</span>
                <span className="font-bold text-[#5B4FCF]">{displayPriceStr} USD</span>
              </div>
            </div>

            {payError && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50/70 border border-red-200/50 rounded-2xl p-3 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{payError}</span>
              </div>
            )}

            {/* 已阅声明勾选框 */}
            <label className="flex items-start gap-2.5 cursor-pointer group p-3 rounded-2xl bg-white/40 border border-[#E8E6F5] hover:border-[#5B4FCF]/40 transition-all text-left">
              <span
                className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  agreed
                    ? 'bg-[#5B4FCF] border-[#5B4FCF]'
                    : 'bg-white border-[#C9C7DC] group-hover:border-[#5B4FCF]'
                }`}
              >
                {agreed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </span>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <span className="text-xs text-[#5D5A7C] leading-relaxed">
                I have read and agree to the{' '}
                <Link
                  to="/privacy"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#5B4FCF] font-medium hover:underline"
                >
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link
                  to="/terms"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#5B4FCF] font-medium hover:underline"
                >
                  Terms of Service
                </Link>
              </span>
            </label>

            <Button variant="primary" size="lg" fullWidth onClick={handlePay} disabled={paying || !agreed}>
              {paying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting to payment...
                </>
              ) : (
                `Pay ${displayPriceStr}`
              )}
            </Button>

            <p className="text-xs text-[#8E8CA8]/80 leading-relaxed">
              Access enabled immediately after payment
            </p>
          </div>
        )}

        <Disclaimer />
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type: string;
  autoComplete?: string;
}

function Field({ label, icon, value, onChange, placeholder, type, autoComplete }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[#3D3A5C]">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8CA8]">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 border border-[#E8E6F5] text-[#3D3A5C] text-sm placeholder:text-[#8E8CA8]/60 focus:outline-none focus:border-[#5B4FCF] focus:bg-white transition-all"
        />
      </div>
    </label>
  );
}
