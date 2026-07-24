import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User as UserIcon, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import { useAuthStore } from '../stores/auth';
import type { AccountTier } from '../types/account';

const TIER_INFO: Record<Exclude<AccountTier, 'free'>, { name: string; price: string; gradient: string }> = {
  pro: { name: 'Pro 版', price: '$17', gradient: 'from-[#5B4FCF] to-[#7B6FE0]' },
  max: { name: 'Max 版', price: '$37', gradient: 'from-[#C9A86A] via-[#D4B575] to-[#E5C58A]' },
};

export default function RegisterPage() {
  const { tier } = useParams<{ tier: string }>();
  const navigate = useNavigate();
  const { signUp, loading, error, clearError } = useAuthStore();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'form' | 'payment' | 'done'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);

  const targetTier = (tier as Exclude<AccountTier, 'free'>) || 'pro';
  const info = TIER_INFO[targetTier] || TIER_INFO.pro;

  useEffect(() => {
    if (targetTier !== 'pro' && targetTier !== 'max') {
      navigate('/', { replace: true });
    }
  }, [targetTier, navigate]);

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

  // 连连国际未完善：此处为占位逻辑，正式接入后替换为连连 Hosted Payment 调用
  const handlePay = async () => {
    setPaying(true);
    // TODO: 接入连连国际后，改为调用后端 Edge Function 生成签名订单并跳转连连支付页
    // 当前模拟：等待 1.2s 后标记为已支付（仅用于开发联调，上线前必须移除）
    await new Promise((r) => setTimeout(r, 1200));
    setPaying(false);
    setStep('done');
  };

  const handleEnterWorkspace = () => {
    navigate(`/${targetTier}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] md:max-w-[480px] flex flex-col gap-5">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        {/* 版本标识 */}
        <div className={`rounded-[20px] bg-gradient-to-br ${info.gradient} p-6 text-white text-center`}>
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
            注册 {info.name}
          </h2>
          <p className="text-white/80 text-sm">
            一次性付费 {info.price} · 永久权限
          </p>
        </div>

        {step === 'form' && (
          <form onSubmit={handleRegister} className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-6 flex flex-col gap-4">
            <Field
              label="昵称"
              icon={<UserIcon className="w-4 h-4" />}
              value={nickname}
              onChange={setNickname}
              placeholder="希望我们如何称呼您"
              type="text"
              autoComplete="nickname"
            />
            <Field
              label="真实邮箱"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={setEmail}
              placeholder="example@email.com"
              type="email"
              autoComplete="email"
            />
            <Field
              label="密码"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={setPassword}
              placeholder="至少 6 位"
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
                  注册中...
                </>
              ) : (
                `注册并继续支付 ${info.price}`
              )}
            </Button>

            <p className="text-xs text-[#8E8CA8] text-center">
              已有账号？{' '}
              <Link to="/login" className="text-[#5B4FCF] font-medium hover:underline">
                直接登录
              </Link>
            </p>
          </form>
        )}

        {step === 'payment' && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-6 flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#5B4FCF]/10 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6 text-[#5B4FCF]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#3D3A5C] mb-1">注册成功，请完成支付</h3>
              <p className="text-sm text-[#8E8CA8] leading-relaxed">
                我们已向 <span className="font-medium text-[#3D3A5C]">{email}</span> 发送验证邮件。
                <br />
                支付 {info.price} 后即可永久使用 {info.name} 全部功能。
              </p>
            </div>

            <div className="rounded-2xl bg-[#5B4FCF]/5 border border-[#5B4FCF]/15 p-4 text-left">
              <p className="text-xs text-[#5B4FCF] font-semibold mb-2">订单信息</p>
              <div className="flex justify-between text-sm text-[#3D3A5C] mb-1">
                <span>版本</span>
                <span className="font-medium">{info.name} · 永久权限</span>
              </div>
              <div className="flex justify-between text-sm text-[#3D3A5C] mb-1">
                <span>账号</span>
                <span className="font-medium">{email}</span>
              </div>
              <div className="flex justify-between text-base text-[#3D3A5C] mt-2 pt-2 border-t border-[#5B4FCF]/15">
                <span className="font-semibold">应付金额</span>
                <span className="font-bold text-[#5B4FCF]">{info.price} USD</span>
              </div>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={handlePay} disabled={paying}>
              {paying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  正在跳转支付...
                </>
              ) : (
                `使用连连国际支付 ${info.price}`
              )}
            </Button>

            <p className="text-xs text-[#8E8CA8]/80 leading-relaxed">
              支付通道：连连国际（LianLian Pay）· 银行收款：DBS Bank (Hong Kong)
              <br />
              支付完成后权限立即生效
            </p>
          </div>
        )}

        {step === 'done' && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#3D3A5C] mb-2">支付完成，权限已开通</h3>
              <p className="text-sm text-[#8E8CA8] leading-relaxed">
                您的 {info.name} 已激活，现在可以开始管理团队被观察者。
              </p>
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={handleEnterWorkspace}>
              进入 {info.name} 工作台
            </Button>
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
