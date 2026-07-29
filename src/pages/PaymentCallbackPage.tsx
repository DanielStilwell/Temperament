import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import { useAuthStore } from '../stores/auth';
import { supabase } from '../lib/supabase';

export default function PaymentCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchProfile } = useAuthStore();

  const [status, setStatus] = useState<'checking' | 'success' | 'pending' | 'error'>('checking');
  const orderId = searchParams.get('order');
  const tier = searchParams.get('tier') as 'pro' | 'max' | null;
  const isUpgrade = searchParams.get('upgrade') === '1';

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] md:max-w-[480px] flex flex-col gap-5">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors">
          ← Back to Home
        </Link>

        {status === 'checking' && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex flex-col gap-4 text-center">
            <Loader2 className="w-10 h-10 text-[#5B4FCF] animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-[#3D3A5C]">Verifying payment...</h3>
            <p className="text-sm text-[#8E8CA8]">Please wait while we confirm your payment.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#3D3A5C]">
              {isUpgrade ? 'Upgrade complete!' : 'Payment successful!'}
            </h3>
            <p className="text-sm text-[#8E8CA8] leading-relaxed">
              Your {tier?.toUpperCase()} version is now active.
              {isUpgrade ? ' Observer limit expanded, prediction feature unlocked.' : ' You can now manage team observers.'}
            </p>
            <Button variant="primary" size="lg" fullWidth onClick={handleEnterWorkspace}>
              Enter {tier?.toUpperCase()} Workspace
            </Button>
          </div>
        )}

        {status === 'pending' && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
              <Loader2 className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-[#3D3A5C]">Payment is being processed</h3>
            <p className="text-sm text-[#8E8CA8] leading-relaxed">
              Your payment was submitted successfully. It may take a few moments to confirm.
              If access is not enabled shortly, please contact support.
            </p>
            <Button variant="primary" size="lg" fullWidth onClick={handleRetry}>
              Check Again
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-[#3D3A5C]">Payment not confirmed</h3>
            <p className="text-sm text-[#8E8CA8] leading-relaxed">
              We could not confirm your payment. If you believe this is an error, please contact support
              or try again.
            </p>
            <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        )}

        <Disclaimer />
      </div>
    </div>
  );
}
