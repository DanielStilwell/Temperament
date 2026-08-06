import { Link, useLocation } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
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
          {t('terms.back')}
        </Link>

        <div className="rounded-[20px] bg-white/70 backdrop-blur-[10px] border border-white/50 p-8 md:p-10">
          <h1
            className="text-2xl md:text-3xl font-bold text-[#3D3A5C] mb-6"
            style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}
          >
            {t('terms.title')}
          </h1>

          <div className="space-y-6 text-[#5D5A7C] text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.serviceDesc.title')}</h2>
              <p className="mb-3">
                {t('terms.sections.serviceDesc.p1')}
              </p>
              <p>
                <Trans i18nKey="terms.sections.serviceDesc.p2" components={{ strong: <strong className="text-[#3D3A5C]" /> }} />
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.userAccount.title')}</h2>
              <p className="mb-3">
                {t('terms.sections.userAccount.p1')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.sections.userAccount.l1')}</li>
                <li>{t('terms.sections.userAccount.l2')}</li>
                <li>{t('terms.sections.userAccount.l3')}</li>
                <li>{t('terms.sections.userAccount.l4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.subscriptions.title')}</h2>
              <p className="mb-3">
                <Trans i18nKey="terms.sections.subscriptions.p1" components={{ strong: <strong className="text-[#3D3A5C]" /> }} />
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>{t('terms.sections.subscriptions.l1')}</li>
                <li>{t('terms.sections.subscriptions.l2')}</li>
              </ul>
              <p className="mb-3">
                <Trans i18nKey="terms.sections.subscriptions.p2" components={{ strong: <strong className="text-[#3D3A5C]" /> }} />
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.sections.subscriptions.l3')}</li>
                <li>{t('terms.sections.subscriptions.l4')}</li>
                <li>{t('terms.sections.subscriptions.l5')}</li>
                <li>{t('terms.sections.subscriptions.l6')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.refund.title')}</h2>
              <p className="mb-3">
                {t('terms.sections.refund.p1')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.sections.refund.l1')}</li>
                <li>{t('terms.sections.refund.l2')}</li>
                <li>{t('terms.sections.refund.l3')}</li>
                <li>{t('terms.sections.refund.l4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.acceptableUse.title')}</h2>
              <p className="mb-3">
                {t('terms.sections.acceptableUse.p1')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.sections.acceptableUse.l1')}</li>
                <li>{t('terms.sections.acceptableUse.l2')}</li>
                <li>{t('terms.sections.acceptableUse.l3')}</li>
                <li>{t('terms.sections.acceptableUse.l4')}</li>
                <li>{t('terms.sections.acceptableUse.l5')}</li>
                <li>{t('terms.sections.acceptableUse.l6')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.intellectualProperty.title')}</h2>
              <p className="mb-3">
                {t('terms.sections.intellectualProperty.p1')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.sections.intellectualProperty.l1')}</li>
                <li>{t('terms.sections.intellectualProperty.l2')}</li>
                <li>{t('terms.sections.intellectualProperty.l3')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.disclaimer.title')}</h2>
              <p className="mb-3">
                <Trans i18nKey="terms.sections.disclaimer.p1" components={{ strong: <strong className="text-[#3D3A5C]" /> }} />
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.sections.disclaimer.l1')}</li>
                <li>{t('terms.sections.disclaimer.l2')}</li>
                <li>{t('terms.sections.disclaimer.l3')}</li>
                <li>{t('terms.sections.disclaimer.l4')}</li>
                <li>{t('terms.sections.disclaimer.l5')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.liability.title')}</h2>
              <p>
                {t('terms.sections.liability.p1')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.serviceChanges.title')}</h2>
              <p className="mb-3">
                {t('terms.sections.serviceChanges.p1')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.sections.serviceChanges.l1')}</li>
                <li>{t('terms.sections.serviceChanges.l2')}</li>
                <li>{t('terms.sections.serviceChanges.l3')}</li>
                <li>{t('terms.sections.serviceChanges.l4')}</li>
              </ul>
              <p className="mt-3">
                {t('terms.sections.serviceChanges.p2')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.disputes.title')}</h2>
              <p>
                {t('terms.sections.disputes.p1')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.miscellaneous.title')}</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.sections.miscellaneous.l1')}</li>
                <li>{t('terms.sections.miscellaneous.l2')}</li>
                <li>{t('terms.sections.miscellaneous.l3')}</li>
                <li>{t('terms.sections.miscellaneous.l4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">{t('terms.sections.contact.title')}</h2>
              <p>
                {t('terms.sections.contact.p1')}
              </p>
              <div className="mt-3 p-4 rounded-xl bg-[#F8F7FC] border border-[#E8E6F5]">
                <p className="font-medium text-[#5B4FCF]">tempesup@qq.com</p>
              </div>
            </section>

            <div className="pt-6 border-t border-[#E8E6F5]">
              <p className="text-xs text-[#8E8CA8]">
                {t('terms.lastUpdated')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}