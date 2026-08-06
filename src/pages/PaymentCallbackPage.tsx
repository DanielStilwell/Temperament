import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import { useAuthStore } from '../stores/auth';
import { supabase } from '../lib/supabase';

export default function PaymentCallbackPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchProfile, user, signOut } = useAuthStore();

  const [status, setStatus] = useState<'checking' | 'success' | 'pending' | 'error'>('checking');
  const orderId = searchParams.get('order');
  const tier = searchParams.get('tier') as 'pro' | 'max' | null;
  const isUpgrade = searchParams.get('upgrade') === '1';

  // 构建返回注册页的 URL
  const registerUrl = `/register/${tier}${isUpgrade ? '?upgrade=true&period=yearly' : '?period=yearly'}`;

  // 删除未支付用户（仅首次注册用户，非升级用户）
  const cleanupUnpaidUser = async () => {
    if (!user || isUpgrade) return;
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      await fetch(`${supabaseUrl}/functions/v1/delete-unpaid-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      await signOut();
    } catch (err) {
      console.error('[PaymentCallback] Cleanup error:', err);
    }
  };

  useEffect(() => {
    if (!orderId || !tier) {
      setStatus('error');
      return;
    }
    checkPaymentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, tier]);

  const checkPaymentStatus = async () => {
    // Poll the payment_orders table for up to 60s (20 attempts × 3s)
    for (let i = 0; i < 20; i++) {
      const { data, error } = await supabase
        .from('payment_orders')
        .select('status')
        .eq('id', orderId)
        .maybeSingle();

      if (error) {
        console.error('[PaymentCallback] DB error:', error);
        break;
      }

      if (data?.status === 'paid') {
        // Refresh profile to get updated tier
        await fetchProfile();
        setStatus('success');
        return;
      }

      if (data?.status === 'failed') {
        // 支付失败 → 删除未支付用户并跳转回注册页
        await cleanupUnpaidUser();
        setStatus('error');
        return;
      }

      // Wait 3s before next check
      await new Promise((r) => setTimeout(r, 3000));
    }

    // Webhook hasn't arrived yet — show pending state
    setStatus('pending');
  };

  const handleEnterWorkspace = () => {
    navigate(`/${tier}`);
  };

  const handleRetry = () => {
    setStatus('checking');
    checkPaymentStatus();
  };

  // 用户主动放弃支付 → 删除账户并返回注册页
  const handleGiveUp = async () => {
    await cleanupUnpaidUser();
    navigate(registerUrl);
  };

  // 支付失败 → 返回注册页
  const handleBackToRegister = () => {
    navigate(registerUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] md:max-w-[480px] flex flex-col gap-5">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors">
          {t('paymentCallback.backToHome')}
        </Link>

        {status === 'checking' && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex flex-col gap-4 text-center">
            <Loader2 className="w-10 h-10 text-[#5B4FCF] animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-[#3D3A5C]">{t('paymentCallback.verifying')}</h3>
            <p className="text-sm text-[#8E8CA8]">{t('paymentCallback.verifyHint')}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#3D3A5C]">
              {isUpgrade ? t('paymentCallback.upgradeSuccessTitle') : t('paymentCallback.successTitle')}
            </h3>
            <p className="text-sm text-[#8E8CA8] leading-relaxed">
              {isUpgrade
                ? t('paymentCallback.upgradeSuccessDesc', { tier: tier?.toUpperCase() })
                : t('paymentCallback.successDesc', { tier: tier?.toUpperCase() })}
            </p>
            <Button variant="primary" size="lg" fullWidth onClick={handleEnterWorkspace}>
              {t('paymentCallback.enterWorkspace', { tier: tier?.toUpperCase() })}
            </Button>
          </div>
        )}

        {status === 'pending' && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
              <Loader2 className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-[#3D3A5C]">{t('paymentCallback.pendingTitle')}</h3>
            <p className="text-sm text-[#8E8CA8] leading-relaxed">
              {t('paymentCallback.pendingDesc')}
            </p>
            <Button variant="primary" size="lg" fullWidth onClick={handleRetry}>
              {t('paymentCallback.checkAgain')}
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={handleGiveUp}>
              {t('paymentCallback.cancelBack')}
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-[#3D3A5C]">{t('paymentCallback.errorTitle')}</h3>
            <p className="text-sm text-[#8E8CA8] leading-relaxed">
              {t('paymentCallback.errorDesc')}
            </p>
            <Button variant="primary" size="lg" fullWidth onClick={handleBackToRegister}>
              {t('paymentCallback.backToRegister')}
            </Button>
          </div>
        )}

        <Disclaimer />
      </div>
    </div>
  );
}
