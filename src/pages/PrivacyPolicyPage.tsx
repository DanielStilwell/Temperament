import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const backTo = (location.state as { from?: string } | null)?.from || '/login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7FC] to-[#F0EEF8] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('privacy.back')}
        </Link>

        <div className="rounded-[20px] bg-white/70 backdrop-blur-[10px] border border-white/50 p-8 md:p-10">
          <h1
            className="text-2xl md:text-3xl font-bold text-[#3D3A5C] mb-6"
            style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}
          >
            {t('privacy.title')}
          </h1>

          <div className="space-y-6 text-[#5D5A7C] text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('privacy.sections.infoCollection.title')}</h2>
              <p className="mb-3">
                {t('privacy.sections.infoCollection.p1')}
              </p>
              <p>
                {t('privacy.sections.infoCollection.p2')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('privacy.sections.infoUsage.title')}</h2>
              <p className="mb-3">
                {t('privacy.sections.infoUsage.p1')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('privacy.sections.infoUsage.l1')}</li>
                <li>{t('privacy.sections.infoUsage.l2')}</li>
                <li>{t('privacy.sections.infoUsage.l3')}</li>
                <li>{t('privacy.sections.infoUsage.l4')}</li>
                <li>{t('privacy.sections.infoUsage.l5')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('privacy.sections.infoSharing.title')}</h2>
              <p className="mb-3">
                {t('privacy.sections.infoSharing.p1')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('privacy.sections.infoSharing.l1')}</li>
                <li>{t('privacy.sections.infoSharing.l2')}</li>
                <li>{t('privacy.sections.infoSharing.l3')}</li>
                <li>{t('privacy.sections.infoSharing.l4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('privacy.sections.dataSecurity.title')}</h2>
              <p>
                {t('privacy.sections.dataSecurity.p1')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('privacy.sections.cookies.title')}</h2>
              <p>
                {t('privacy.sections.cookies.p1')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('privacy.sections.rights.title')}</h2>
              <p className="mb-3">
                {t('privacy.sections.rights.p1')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('privacy.sections.rights.l1')}</li>
                <li>{t('privacy.sections.rights.l2')}</li>
                <li>{t('privacy.sections.rights.l3')}</li>
                <li>{t('privacy.sections.rights.l4')}</li>
                <li>{t('privacy.sections.rights.l5')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('privacy.sections.policyUpdates.title')}</h2>
              <p>
                {t('privacy.sections.policyUpdates.p1')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('privacy.sections.contact.title')}</h2>
              <p>
                {t('privacy.sections.contact.p1')}
              </p>
              <div className="mt-3 p-4 rounded-xl bg-[#F8F7FC] border border-[#E8E6F5]">
                <p className="font-medium text-[#5B4FCF]">tempesup@qq.com</p>
              </div>
            </section>

            <div className="pt-6 border-t border-[#E8E6F5]">
              <p className="text-xs text-[#8E8CA8]">
                {t('privacy.lastUpdated')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}