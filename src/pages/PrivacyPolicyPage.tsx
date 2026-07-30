import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7FC] to-[#F0EEF8] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="rounded-[20px] bg-white/70 backdrop-blur-[10px] border border-white/50 p-8 md:p-10">
          <h1
            className="text-2xl md:text-3xl font-bold text-[#3D3A5C] mb-6"
            style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}
          >
            Privacy Policy
          </h1>

          <div className="space-y-6 text-[#5D5A7C] text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">1. Information Collection</h2>
              <p className="mb-3">
                We collect information including but not limited to: email addresses, account passwords (encrypted), assessment results, and team management data. This information is used to provide personalized services, improve user experience, and protect account security.
              </p>
              <p>
                For free version users, data is stored locally in the browser and not uploaded to servers. For Pro and Max version users, data is stored on our secure servers to enable cross-device access and team collaboration features.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">2. Information Usage</h2>
              <p className="mb-3">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your subscriptions and payments</li>
                <li>Send service-related notifications and updates</li>
                <li>Analyze usage trends to optimize product features</li>
                <li>Prevent fraud and ensure platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">3. Information Sharing</h2>
              <p className="mb-3">
                We do not sell, trade, or otherwise transfer your personal information to third parties. However, we may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With your explicit consent</li>
                <li>With service providers who help us operate (such as payment processors, cloud service providers)</li>
                <li>To comply with legal obligations or respond to lawful government requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">4. Data Security</h2>
              <p>
                We employ industry-standard security measures to protect your information, including but not limited to: encrypted data transmission (HTTPS), password hashing, access controls, and regular security audits. However, no internet transmission or electronic storage method is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">5. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to collect information, improve service performance, and personalize user experience. You can manage cookie preferences in your browser settings, but disabling cookies may affect the functionality of certain features.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">6. Your Rights</h2>
              <p className="mb-3">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and related data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">7. Policy Updates</h2>
              <p>
                We may update this privacy policy from time to time. Significant changes will be notified to you prominently on this page. Continued use of our services indicates your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">8. Contact Us</h2>
              <p>
                If you have any questions or suggestions about this privacy policy, please contact us at:
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