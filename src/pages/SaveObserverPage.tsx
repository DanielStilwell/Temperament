import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import useAssessmentStore from '../stores/assessment';
import { useAuthStore } from '../stores/auth';
import { createObserver } from '../lib/observers';
import { TIER_LIMITS } from '../lib/supabase';
import type { AccountTier } from '../types/account';

export default function SaveObserverPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { result, answers, profession, observerDraft, reset, clearObserverDraft } = useAssessmentStore.getState();
  const profile = useAuthStore((s) => s.profile);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!result || !observerDraft) {
      navigate('/');
    }
  }, [result, observerDraft, navigate]);

  if (!result || !observerDraft || !profession) {
    return null;
  }

  const tier = (profile?.tier as AccountTier) || 'free';
  const backLink = tier === 'max' ? '/max' : '/pro';

  const handleSave = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await createObserver({
        name: observerDraft.name,
        gender: observerDraft.gender,
        profession,
        result,
        answers,
        note: observerDraft.note,
      });
      setSaved(true);
      // 刷新 profile（虽然 observer 数量不存 profile，但保持一致性）
      await fetchProfile();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || t('observer.save.saveFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    reset();
    clearObserverDraft();
    navigate(backLink);
  };

  if (saved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] flex flex-col gap-5">
          <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#3D3A5C]">{t('observer.save.savedTitle')}</h3>
            <p className="text-sm text-[#8E8CA8] leading-relaxed">
              <Trans
                i18nKey="observer.save.savedDesc"
                components={{ name: <span className="font-medium text-[#3D3A5C]" /> }}
                values={{ name: observerDraft.name }}
              />
            </p>
            <Button variant="primary" size="lg" fullWidth onClick={handleDone}>
              {t('observer.save.backToWorkspace')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] md:max-w-[520px] flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Link to={backLink} className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('observer.save.backToWorkspace')}
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="rounded-[20px] bg-gradient-to-br from-[#5B4FCF] to-[#7B6FE0] p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Save className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
              {t('observer.save.title')}
            </h2>
          </div>
          <p className="text-white/80 text-sm">{t('observer.save.subtitle')}</p>
        </div>

        <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-6 flex flex-col gap-3">
          <InfoRow label={t('observer.save.name')} value={observerDraft.name} />
          <InfoRow
            label={t('observer.save.gender')}
            value={t(`observer.add.${observerDraft.gender}`)}
          />
          <InfoRow label={t('observer.save.profession')} value={profession} />
          {observerDraft.note && <InfoRow label={t('observer.save.note')} value={observerDraft.note} />}
          <InfoRow
            label={t('observer.save.dominantTemperament')}
            value={t(`temperament.${result.temperament}.name`)}
          />
          {profile && (tier === 'pro' || tier === 'max') && (
            <div className="text-xs text-[#8E8CA8] mt-2 pt-3 border-t border-[#E8E6F5]">
              {t('observer.save.currentPlan', { tier: tier.toUpperCase(), limit: TIER_LIMITS[tier] })}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50/70 border border-red-200/50 rounded-2xl p-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Disclaimer />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
          disabled={submitting}
          className="disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('observer.save.saving')}
            </>
          ) : (
            t('observer.save.confirmSave')
          )}
        </Button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-[#8E8CA8]">{label}</span>
      <span className="font-medium text-[#3D3A5C]">{value}</span>
    </div>
  );
}
