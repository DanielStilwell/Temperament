import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
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
          Back
        </Link>

        <div className="rounded-[20px] bg-white/70 backdrop-blur-[10px] border border-white/50 p-8 md:p-10">
          <h1
            className="text-2xl md:text-3xl font-bold text-[#3D3A5C] mb-6"
            style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}
          >
            Terms of Service
          </h1>

          <div className="space-y-6 text-[#5D5A7C] text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">1. Service Description</h2>
              <p className="mb-3">
                Personality Assessment is a personality assessment tool based on psychological theory, designed to help users with self-exploration and personal growth. We offer a free version and paid subscription versions (Pro and Max).
              </p>
              <p>
                <strong className="text-[#3D3A5C]">Important Disclaimer:</strong> This application is for self-exploration and entertainment purposes only and does not constitute professional psychological assessment or medical advice. Assessment results should not be used as the sole basis for clinical diagnosis, medical decisions, or career choices.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">2. User Account</h2>
              <p className="mb-3">
                Using Pro or Max versions requires account registration. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, complete, and up-to-date registration information</li>
                <li>Protect the security and confidentiality of your account password</li>
                <li>Take responsibility for all activities under your account</li>
                <li>Notify us immediately if you discover unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">3. Subscriptions and Payments</h2>
              <p className="mb-3">
                <strong className="text-[#3D3A5C]">Subscription Plans:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Pro Version: $5/month, $17/6 months, $27/year</li>
                <li>Max Version: $12/month, $43/6 months, $79/year</li>
              </ul>
              <p className="mb-3">
                <strong className="text-[#3D3A5C]">Payment Policy:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscriptions auto-renew unless canceled before the renewal date</li>
                <li>Prices may change at any time; existing subscriptions are unaffected</li>
                <li>All fees are in USD and may include taxes</li>
                <li>Payments are processed through third-party payment platforms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">4. Refund Policy</h2>
              <p className="mb-3">
                We offer the following refund policy:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full refund available within 7 days of first subscription</li>
                <li>Renewal fees are non-refundable unless the service has significant defects</li>
                <li>Refund requests must be submitted via support email</li>
                <li>Refunds will be processed within 5-10 business days after approval</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">5. Acceptable Use</h2>
              <p className="mb-3">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service for illegal purposes or violate any laws</li>
                <li>Infringe upon the intellectual property or other rights of others</li>
                <li>Spread viruses, malicious code, or other harmful content</li>
                <li>Attempt to crack, reverse engineer, or interfere with service operation</li>
                <li>Impersonate others or provide false information</li>
                <li>Share your account with others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">6. Intellectual Property</h2>
              <p className="mb-3">
                All content, features, and services are protected by intellectual property laws. Without our written permission, you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copy, modify, distribute, or display any content</li>
                <li>Create derivative works or use content for commercial purposes</li>
                <li>Remove any copyright notices or ownership markings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">7. Disclaimer</h2>
              <p className="mb-3">
                <strong className="text-[#3D3A5C]">The service is provided "as is" without any express or implied warranties.</strong> We are not liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The continuity, security, or error-free nature of the service</li>
                <li>The accuracy or applicability of assessment results</li>
                <li>Any decisions made based on assessment results</li>
                <li>Losses resulting from the use or inability to use the service</li>
                <li>Third-party actions or content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, our total liability shall not exceed the fees you paid in the past 12 months. We are not liable for any indirect, incidental, special, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">9. Service Changes and Termination</h2>
              <p className="mb-3">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify, suspend, or terminate the service (in whole or in part) at any time</li>
                <li>Delete accounts and all related data</li>
                <li>Restrict usage permissions for certain users</li>
                <li>Change pricing and features</li>
              </ul>
              <p className="mt-3">
                If service is terminated, we will notify users 30 days in advance and provide reasonable refund or compensation options.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">10. Dispute Resolution</h2>
              <p>
                Any disputes arising from these terms shall first be resolved through friendly negotiation. If negotiation fails, the dispute shall be submitted to the court with jurisdiction in the location of the service provider. These terms are governed by the laws of the People's Republic of China.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">11. Miscellaneous</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>These terms constitute the entire agreement between you and us</li>
                <li>Our failure to exercise any right does not constitute a waiver of that right</li>
                <li>If any provision of these terms is found invalid, the remaining terms remain in effect</li>
                <li>We may assign this agreement at any time; you need our consent to assign</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">12. Contact Us</h2>
              <p>
                For any questions or suggestions, please contact:
              </p>
              <div className="mt-3 p-4 rounded-xl bg-[#F8F7FC] border border-[#E8E6F5]">
                <p className="font-medium text-[#5B4FCF]">tempesup@qq.com</p>
              </div>
            </section>

            <div className="pt-6 border-t border-[#E8E6F5]">
              <p className="text-xs text-[#8E8CA8]">
                Last updated: July 30, 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}