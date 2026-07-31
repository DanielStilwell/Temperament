import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import { useAuthStore } from '../stores/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    const { error } = await signIn({ email: email.trim(), password });
    setSubmitting(false);
    if (!error) {
      // signIn 内部已 await fetchProfile()，profile 此时已就绪
      const { profile } = useAuthStore.getState();
      if (profile?.tier === 'pro') navigate('/pro');
      else if (profile?.tier === 'max') navigate('/max');
      else navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] md:max-w-[480px] flex flex-col gap-5">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="rounded-[20px] bg-gradient-to-br from-[#5B4FCF] to-[#7B6FE0] p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
            Welcome Back
          </h2>
          <p className="text-white/80 text-sm">Log in to continue managing your team</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-6 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3D3A5C]">Email</span>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8CA8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 border border-[#E8E6F5] text-[#3D3A5C] text-sm placeholder:text-[#8E8CA8]/60 focus:outline-none focus:border-[#5B4FCF] focus:bg-white transition-all"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3D3A5C]">Password</span>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8CA8]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 border border-[#E8E6F5] text-[#3D3A5C] text-sm placeholder:text-[#8E8CA8]/60 focus:outline-none focus:border-[#5B4FCF] focus:bg-white transition-all"
              />
            </div>
          </label>

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
            disabled={submitting || !email.trim() || password.length < 6}
            className="disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </Button>

          <p className="text-xs text-[#8E8CA8] text-center">
            Don't have a Pro / Max account?{' '}
            <Link to="/" className="text-[#5B4FCF] font-medium hover:underline">
              Choose a plan to sign up
            </Link>
          </p>
        </form>

        {/* 页脚链接和邮箱 */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/privacy"
              state={{ from: '/login' }}
              className="text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-[#8E8CA8]/50">|</span>
            <Link
              to="/terms"
              state={{ from: '/login' }}
              className="text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#8E8CA8]">
            <Mail className="w-3.5 h-3.5" />
            <a
              href="mailto:tempesup@qq.com"
              className="hover:text-[#5B4FCF] transition-colors"
            >
              tempesup@qq.com
            </a>
          </div>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
