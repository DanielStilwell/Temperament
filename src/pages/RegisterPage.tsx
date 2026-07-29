import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User as UserIcon, AlertCircle, Loader2, ArrowUpCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import { useAuthStore } from '../stores/auth';
import type { AccountTier } from '../types/account';

const TIER_INFO: Record<Exclude<AccountTier, 'free'>, { name: string; price: string; gradient: string }> = {
  pro: { name: 'Pro', price: '$9', gradient: 'from-[#5B4FCF] to-[#7B6FE0]' },
  max: { name: 'Max', price: '$19', gradient: 'from-[#C9A86A] via-[#D4B575] to-[#E5C58A]' },
};

// 升级差价映射
const UPGRADE_PRICE: Record<string, string> = {
  'pro→max': '$10', // 补差价：19 - 9 = 10
};

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

  const targetTier = (tier as Exclude<AccountTier, 'free'>) || 'pro';
  const info = TIER_INFO[targetTier] || TIER_INFO.pro;

  // 升级模式检测：URL 有 ?upgrade=true 且当前已登录
  const isUpgrade = searchParams.get('upgrade') === 'true' && !!user && !!profile;
  const upgradeFrom = profile?.tier;
  const upgradeKey = upgradeFrom ? `${upgradeFrom}→${targetTier}` : '';
  const upgradePrice = UPGRADE_PRICE[upgradeKey] ?? info.price;

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

  // Call Supabase Edge Function to create LianLian payment order, then redirect to checkout
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

      // Determine payment amount
      const isProToMax = isUpgrade && upgradeFrom === 'pro' && targetTier === 'max';
      const amount = isProToMax ? 10 : (targetTier === 'max' ? 19 : 9);

      const res = await fetch(`${supabaseUrl}/functions/v1/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          user_id: currentUserId,
          tier: targetTier,
          amount,
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

      // Redirect user to LianLian hosted checkout page
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
                From {TIER_INFO[upgradeFrom as 'pro']?.name ?? 'Free'} · Upgrade price {upgradePrice} · 1 year access
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
                Sign Up — {info.name}
              </h2>
              <p className="text-white/80 text-sm">
                One-time payment {info.price} · Lifetime access
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={submitting || !nickname.trim() || !email.trim() || password.length < 6}
              className="disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing up...
                </>
              ) : (
                `Sign Up & Pay ${info.price}`
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
                    Upgrading to {info.name} requires a price difference of {upgradePrice}.
                    <br />
                    Observer limit will expand from 60 to 160, and the prediction feature will be unlocked.
                  </>
                ) : (
                  <>
                    We've sent a verification email to <span className="font-medium text-[#3D3A5C]">{email}</span>.
                    <br />
                    Pay {info.price} to get 1 year access to all {info.name} features.
                  </>
                )}
              </p>
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
                    : `${info.name} · 1 year access`
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm text-[#3D3A5C] mb-1">
                <span>Account</span>
                <span className="font-medium">{isUpgrade ? user?.email : email}</span>
              </div>
              <div className="flex justify-between text-base text-[#3D3A5C] mt-2 pt-2 border-t border-[#5B4FCF]/15">
                <span className="font-semibold">Amount Due</span>
                <span className="font-bold text-[#5B4FCF]">{upgradePrice} USD</span>
              </div>
            </div>

            {payError && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50/70 border border-red-200/50 rounded-2xl p-3 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{payError}</span>
              </div>
            )}

            <Button variant="primary" size="lg" fullWidth onClick={handlePay} disabled={paying}>
              {paying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting to payment...
                </>
              ) : (
                `Pay with LianLian Pay ${upgradePrice}`
              )}
            </Button>

            <p className="text-xs text-[#8E8CA8]/80 leading-relaxed">
              Payment: LianLian Pay · Receiving bank: DBS Bank (Hong Kong)
              <br />
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
