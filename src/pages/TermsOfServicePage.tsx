import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
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
            服务条款
          </h1>

          <div className="space-y-6 text-[#5D5A7C] text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">1. 服务说明</h2>
              <p className="mb-3">
                Personality Assessment 是一款基于心理学理论的人格测评工具，旨在帮助用户进行自我探索和个人成长。我们提供免费版本和付费订阅版本（Pro 和 Max）。
              </p>
              <p>
                <strong className="text-[#3D3A5C]">重要声明：</strong>本应用仅供自我探索和娱乐参考，不构成专业心理评估或医疗建议。测评结果不应作为临床诊断、医疗决策或职业选择的唯一依据。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">2. 用户账户</h2>
              <p className="mb-3">
                使用 Pro 或 Max 版本需要注册账户。您同意：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>提供准确、完整和最新的注册信息</li>
                <li>保护账户密码的安全性和机密性</li>
                <li>对账户下发生的所有活动负责</li>
                <li>如发现未经授权使用，立即通知我们</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">3. 订阅和付款</h2>
              <p className="mb-3">
                <strong className="text-[#3D3A5C]">订阅计划：</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Pro 版本：$5/月、$17/6个月、$27/年</li>
                <li>Max 版本：$12/月、$43/6个月、$79/年</li>
              </ul>
              <p className="mb-3">
                <strong className="text-[#3D3A5C]">付款政策：</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>订阅自动续订，除非在续订日期前取消</li>
                <li>价格可能随时调整，现有订阅不受影响</li>
                <li>所有费用均以美元计价，可能产生税费</li>
                <li>付款通过第三方支付平台处理</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">4. 退款政策</h2>
              <p className="mb-3">
                我们提供以下退款政策：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>首次订阅7天内可申请全额退款</li>
                <li>续订费用不支持退款，除非服务存在重大缺陷</li>
                <li>退款申请需通过客服邮箱提交</li>
                <li>退款将在审核通过后5-10个工作日内处理</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">5. 使用规范</h2>
              <p className="mb-3">
                您同意不进行以下行为：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>以非法目的使用服务或违反任何法律</li>
                <li>侵犯他人的知识产权或其他权利</li>
                <li>传播病毒、恶意代码或其他有害内容</li>
                <li>尝试破解、反向工程或干扰服务运行</li>
                <li>冒充他人或提供虚假信息</li>
                <li>将账户共享给他人使用</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">6. 知识产权</h2>
              <p className="mb-3">
                所有内容、功能和服务均受知识产权法保护。未经我们书面许可，您不得：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>复制、修改、分发或展示任何内容</li>
                <li>创建衍生作品或使用内容进行商业目的</li>
                <li>删除任何版权声明或所有权标记</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">7. 免责声明</h2>
              <p className="mb-3">
                <strong className="text-[#3D3A5C]">服务按"现状"提供，不提供任何明示或暗示的担保。</strong>我们不对以下情况承担责任：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>服务的连续性、安全性或无错误性</li>
                <li>测评结果的准确性或适用性</li>
                <li>基于测评结果做出的任何决策</li>
                <li>因使用或无法使用服务导致的损失</li>
                <li>第三方行为或内容</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">8. 责任限制</h2>
              <p>
                在适用法律允许的最大范围内，我们的总责任不超过您在过去12个月内支付的费用。我们不对任何间接、偶然、特殊或后果性损害承担责任。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">9. 服务变更和终止</h2>
              <p className="mb-3">
                我们保留以下权利：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>随时修改、暂停或终止服务（全部或部分）</li>
                <li>删除账户和所有相关数据</li>
                <li>限制某些用户的使用权限</li>
                <li>变更定价和功能</li>
              </ul>
              <p className="mt-3">
                如终止服务，我们将提前30天通知用户，并提供合理的退款或补偿方案。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">10. 争议解决</h2>
              <p>
                任何因本条款引起的争议应首先通过友好协商解决。协商不成时，应提交至服务提供方所在地有管辖权的法院诉讼解决。本条款适用中华人民共和国法律。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">11. 其他条款</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>本条款构成您与我们之间的完整协议</li>
                <li>我们未行使任何权利不构成对该权利的放弃</li>
                <li>如本条款任何条款被认定无效，其他条款仍然有效</li>
                <li>我们可随时转让本协议，您需获得我们同意方可转让</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#3D3A5C] mb-3">12. 联系我们</h2>
              <p>
                如有任何问题或建议，请联系：
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