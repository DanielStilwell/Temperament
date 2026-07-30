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
          返回登录
        </Link>

        <div className="rounded-[20px] bg-white/70 backdrop-blur-[10px] border border-white/50 p-8 md:p-10">
          <h1
            className="text-2xl md:text-3xl font-bold text-[#3D3A5C] mb-6"
            style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}
          >
            隐私政策
          </h1>

          <div className="space-y-6 text-[#5D5A7C] text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">1. 信息收集</h2>
              <p className="mb-3">
                我们收集的信息包括但不限于：电子邮件地址、账户密码（加密存储）、测评结果数据、团队管理数据等。这些信息用于提供个性化服务、改善用户体验以及保护账户安全。
              </p>
              <p>
                对于免费版本用户，数据仅存储在本地浏览器中，不会上传至服务器。对于 Pro 和 Max 版本用户，数据将存储在我们的安全服务器上，以便实现跨设备访问和团队协作功能。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">2. 信息使用</h2>
              <p className="mb-3">
                我们使用收集的信息来：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>提供、维护和改进我们的服务</li>
                <li>处理您的订阅和付款</li>
                <li>发送服务相关的通知和更新</li>
                <li>分析使用趋势以优化产品功能</li>
                <li>防止欺诈和确保平台安全</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">3. 信息共享</h2>
              <p className="mb-3">
                我们不会出售、交易或以其他方式将您的个人信息转让给第三方。但在以下情况下，我们可能会共享您的信息：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>经您明确同意</li>
                <li>与帮助我们运营的服务提供商共享（如支付处理商、云服务提供商）</li>
                <li>遵守法律义务或响应合法的政府请求</li>
                <li>保护我们的权利、隐私、安全或财产</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">4. 数据安全</h2>
              <p>
                我们采用业界标准的安全措施来保护您的信息，包括但不限于：数据加密传输（HTTPS）、密码哈希存储、访问控制、定期安全审计等。然而，没有任何互联网传输或电子存储方法是 100% 安全的，我们无法保证绝对的安全性。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">5. Cookie 和跟踪技术</h2>
              <p>
                我们使用 Cookie 和类似的跟踪技术来收集信息、改善服务性能和个性化用户体验。您可以在浏览器设置中管理 Cookie 偏好，但禁用 Cookie 可能会影响某些功能的正常使用。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">6. 您的权利</h2>
              <p className="mb-3">
                您有权：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>访问和更新您的个人信息</li>
                <li>请求删除您的账户和相关数据</li>
                <li>选择退出营销通信</li>
                <li>请求获取您的数据副本</li>
                <li>反对某些数据处理活动</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">7. 儿童隐私</h2>
              <p>
                我们的服务不面向 13 岁以下的儿童。我们不会故意收集 13 岁以下儿童的个人信息。如果您发现您的孩子向我们提供了信息，请联系我们，我们将采取适当措施删除该信息。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">8. 政策更新</h2>
              <p>
                我们可能会不时更新本隐私政策。重大变更将在本页面显著位置通知您。继续使用我们的服务即表示您接受更新后的政策。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">9. 联系我们</h2>
              <p>
                如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
              </p>
              <div className="mt-3 p-4 rounded-xl bg-[#F8F7FC] border border-[#E8E6F5]">
                <p className="font-medium text-[#5B4FCF]">tempesup@qq.com</p>
              </div>
            </section>

            <div className="pt-6 border-t border-[#E8E6F5]">
              <p className="text-xs text-[#8E8CA8]">
                最后更新日期：2026年7月30日
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}