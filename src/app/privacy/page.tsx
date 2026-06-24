"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

const LAST_UPDATED_EN = "25 June 2026";
const LAST_UPDATED_ZH = "2026年6月25日";
const COMPANY = "ArkAgentic";
const ABN = "92 627 301 153";
const ADDRESS_EN = "11 Hassall Street, Parramatta NSW 2150, Australia";
const ADDRESS_ZH = "澳大利亚新南威尔士州帕拉马塔哈萨尔街11号2150";
const EMAIL = "support@arkagentic.com";
const WEBSITE = "https://www.arkagentic.com";

const prose = "prose prose-invert prose-slate max-w-none text-slate-300 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-white [&_p]:mb-4 [&_p]:leading-7 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul>li]:mb-2 [&_a]:text-blue-300 [&_a:hover]:text-blue-200";

function EnglishPrivacy() {
  return (
    <div className={prose}>
      <p>
        <strong className="text-white">{COMPANY} (ABN {ABN})</strong> is committed to protecting
        your privacy in accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian
        Privacy Principles (APPs). This policy explains how we collect, use, store, and disclose
        personal information when you use <a href={WEBSITE}>{WEBSITE}</a> and our services,
        including Invoice Extractor.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Account information</h3>
      <p>
        Email address, name (if provided), and a securely hashed password. We never store
        plain-text passwords.
      </p>
      <h3>Billing information</h3>
      <p>
        Payments are processed by Stripe, Inc. We do not store credit card numbers. Stripe provides
        us with limited non-sensitive data (subscription status, billing country, last four card
        digits). See the{" "}
        <a href="https://stripe.com/au/privacy" target="_blank" rel="noopener noreferrer">
          Stripe Privacy Policy
        </a>
        .
      </p>
      <h3>Usage data</h3>
      <p>
        IP address (used for security and trial fraud prevention), browser type, pages visited,
        access timestamps, and error logs.
      </p>
      <h3>Documents you process</h3>
      <p>
        When you use Invoice Extractor, we temporarily access files from your connected cloud storage
        to extract invoice data. Documents are removed from our servers within 24 hours of
        processing. We do not permanently store your invoice documents.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Provide, operate, and improve our services</li>
        <li>Process payments and manage your subscription</li>
        <li>Authenticate your identity and secure your account</li>
        <li>Detect and prevent fraud and security incidents</li>
        <li>Send transactional emails (receipts, service notices)</li>
        <li>Respond to your enquiries and provide support</li>
        <li>Comply with legal obligations</li>
      </ul>
      <p>
        We <strong className="text-white">do not</strong> use your documents or invoice data to
        train or improve any AI or machine learning models. We do not sell your personal information.
      </p>

      <h2>3. Cloud Drive Access</h2>
      <p>
        When you connect a cloud drive (e.g. Microsoft OneDrive), we request access only to the
        specific folders you select. We use this access solely to read invoice files and write
        result files back to your chosen output folder. We do not access any files outside your
        selected folders. You can revoke access at any time through your cloud provider settings or
        your ArkAgentic account settings.
      </p>

      <h2>4. AI and Third-Party Providers</h2>
      <p>
        Our services use third-party AI providers to assist with document processing. Limited
        extracted text from your documents may be transmitted to these providers to generate outputs.
        We require our AI providers to operate under data processing terms that prohibit use of your
        data for model training. Providers we may use include:
      </p>
      <ul>
        <li>
          OpenAI, Inc. (United States) —{" "}
          <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </li>
        <li>
          Anthropic, PBC (United States) —{" "}
          <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </li>
      </ul>

      <h2>5. Disclosure of Your Information</h2>
      <p>We may disclose your personal information to:</p>
      <ul>
        <li>
          <strong className="text-white">Service providers</strong> — companies helping us operate
          our services (authentication, hosting, payment, email) under strict data processing
          agreements
        </li>
        <li>
          <strong className="text-white">Legal requirements</strong> — when required by law, court
          order, or to protect our legal rights
        </li>
        <li>
          <strong className="text-white">Business transfers</strong> — if ArkAgentic is acquired or
          merges with another entity, subject to equivalent privacy protections
        </li>
      </ul>
      <p>We do not share your personal information for third-party marketing.</p>

      <h2>6. Data Storage and Security</h2>
      <p>
        Account data is stored via Supabase on AWS infrastructure. Invoice processing occurs on AWS
        in the Asia-Pacific (Sydney) region. We implement TLS/HTTPS encryption in transit, encrypted
        storage at rest, and strict access controls. No transmission method is 100% secure, but we
        take reasonable measures to protect your information.
      </p>

      <h2>7. Data Retention</h2>
      <ul>
        <li>
          <strong className="text-white">Account data</strong> — retained for the account lifetime
          and up to 2 years after closure
        </li>
        <li>
          <strong className="text-white">Processed documents</strong> — deleted within 24 hours of
          processing
        </li>
        <li>
          <strong className="text-white">Billing records</strong> — retained for 7 years as required
          by Australian taxation law
        </li>
        <li>
          <strong className="text-white">Usage logs</strong> — retained for up to 90 days
        </li>
      </ul>

      <h2>8. Cookies</h2>
      <p>
        We use session cookies necessary for authentication and service operation. We do not use
        advertising cookies or third-party tracking pixels. Disabling cookies may limit certain
        service features.
      </p>

      <h2>9. Your Privacy Rights</h2>
      <p>Under the Australian Privacy Principles, you have the right to:</p>
      <ul>
        <li>
          <strong className="text-white">Access</strong> — request a copy of your personal
          information
        </li>
        <li>
          <strong className="text-white">Correction</strong> — request correction of inaccurate
          information
        </li>
        <li>
          <strong className="text-white">Deletion</strong> — request deletion of your personal
          information (subject to legal retention requirements)
        </li>
        <li>
          <strong className="text-white">Complaint</strong> — lodge a complaint with the Office of
          the Australian Information Commissioner (OAIC) at{" "}
          <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">
            oaic.gov.au
          </a>{" "}
          if you believe we have not handled your information correctly
        </li>
      </ul>
      <p>
        To exercise these rights, contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We will
        respond within 30 days.
      </p>

      <h2>10. Children</h2>
      <p>
        Our services are not intended for anyone under 18. We do not knowingly collect information
        from minors. If you believe a child has provided us with personal information, please contact
        us immediately.
      </p>

      <h2>11. International Transfers</h2>
      <p>
        Some service providers are located in the United States. We take reasonable steps to ensure
        they handle your information in accordance with the Australian Privacy Principles or
        equivalent protections.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be notified by email or
        in-product notice before they take effect.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        <strong className="text-white">{COMPANY}</strong>
        <br />
        ABN: {ABN}
        <br />
        {ADDRESS_EN}
        <br />
        Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <br />
        <br />
        If you are not satisfied with our response, contact the OAIC:{" "}
        <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">
          www.oaic.gov.au
        </a>{" "}
        · Phone: 1300 363 992
      </p>
    </div>
  );
}

function ChinesePrivacy() {
  return (
    <div className={prose}>
      <p>
        <strong className="text-white">{COMPANY}（ABN {ABN}）</strong>
        致力于依据《1988年隐私法》（联邦）及《澳大利亚隐私原则》（APPs）保护您的个人信息。
        本政策说明我们在您使用 <a href={WEBSITE}>{WEBSITE}</a> 及发票提取器等服务时，
        如何收集、使用、存储和披露您的个人信息。
      </p>

      <h2>1. 我们收集的信息</h2>
      <h3>账户信息</h3>
      <p>
        电子邮件地址、姓名（如提供）及经安全哈希处理的密码。我们从不存储您的明文密码。
      </p>
      <h3>账单信息</h3>
      <p>
        支付由 Stripe, Inc. 处理，我们不存储您的信用卡号码。Stripe 仅向我们提供有限的非敏感数据（订阅状态、账单国家、卡号末四位）。请参阅{" "}
        <a href="https://stripe.com/au/privacy" target="_blank" rel="noopener noreferrer">
          Stripe 隐私政策
        </a>
        。
      </p>
      <h3>使用数据</h3>
      <p>
        IP 地址（用于安全防护和试用防滥用）、浏览器类型、访问页面、访问时间戳及错误日志。
      </p>
      <h3>您处理的文件</h3>
      <p>
        使用发票提取器时，我们临时访问您所连接的云存储中的文件以提取发票数据。文件在处理后 24 小时内从我们的服务器删除，我们不永久存储您的发票文件。
      </p>

      <h2>2. 我们如何使用您的信息</h2>
      <ul>
        <li>提供、运营和改进我们的服务</li>
        <li>处理付款并管理您的订阅</li>
        <li>验证身份并保护账户安全</li>
        <li>检测和预防欺诈及安全事件</li>
        <li>发送交易类邮件（收据、服务通知）</li>
        <li>回复咨询并提供客户支持</li>
        <li>遵守法律义务</li>
      </ul>
      <p>
        我们<strong className="text-white">不会</strong>使用您的文件或发票数据训练或改进任何 AI 或机器学习模型，
        也不会出售您的个人信息。
      </p>

      <h2>3. 云端硬盘访问</h2>
      <p>
        连接云端硬盘（如 Microsoft OneDrive）时，我们仅申请访问您明确选择的文件夹，
        仅用于读取发票文件并将结果写回您指定的输出文件夹。我们不会访问您选定文件夹之外的任何文件。
        您可随时通过云服务商的账户设置或 ArkAgentic 账户设置撤销访问权限。
      </p>

      <h2>4. AI 与第三方服务商</h2>
      <p>
        我们的服务使用第三方 AI 服务商辅助文件处理。您文件中的有限提取文本可能被传输至这些服务商以生成输出结果。
        我们要求 AI 服务商在数据处理协议约束下运营，禁止将您的数据用于模型训练。
        我们可能使用的服务商包括：
      </p>
      <ul>
        <li>
          OpenAI, Inc.（美国）—{" "}
          <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">
            隐私政策
          </a>
        </li>
        <li>
          Anthropic, PBC（美国）—{" "}
          <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">
            隐私政策
          </a>
        </li>
      </ul>

      <h2>5. 信息披露</h2>
      <p>我们可能向以下方披露您的个人信息：</p>
      <ul>
        <li>
          <strong className="text-white">服务提供商</strong>——协助我们运营服务的公司（身份验证、托管、支付、邮件），须签订严格的数据处理协议
        </li>
        <li>
          <strong className="text-white">法律要求</strong>——法律、法院命令或保护我们合法权利所要求时
        </li>
        <li>
          <strong className="text-white">业务转让</strong>——若 ArkAgentic 被收购或合并，须有同等隐私保护措施
        </li>
      </ul>
      <p>我们不会将您的个人信息用于第三方营销目的。</p>

      <h2>6. 数据存储与安全</h2>
      <p>
        账户数据通过 Supabase 存储在 AWS 基础设施上。发票处理在 AWS 亚太地区（悉尼）进行。
        我们采用 TLS/HTTPS 传输加密、静态数据加密存储及严格的访问控制。
        互联网传输无法做到绝对安全，但我们采取合理措施保护您的信息。
      </p>

      <h2>7. 数据保留</h2>
      <ul>
        <li>
          <strong className="text-white">账户数据</strong>——保留至账户有效期结束后 2 年
        </li>
        <li>
          <strong className="text-white">处理中的文件</strong>——处理后 24 小时内删除
        </li>
        <li>
          <strong className="text-white">账单记录</strong>——依据澳大利亚税法保留 7 年
        </li>
        <li>
          <strong className="text-white">使用日志</strong>——保留最多 90 天
        </li>
      </ul>

      <h2>8. Cookies</h2>
      <p>
        我们使用身份验证和服务运营所必需的会话 Cookie，不使用广告 Cookie 或第三方追踪像素。
        禁用 Cookie 可能影响部分服务功能。
      </p>

      <h2>9. 您的隐私权利</h2>
      <p>根据《澳大利亚隐私原则》，您有权：</p>
      <ul>
        <li>
          <strong className="text-white">访问</strong>——请求获取我们持有的您的个人信息副本
        </li>
        <li>
          <strong className="text-white">更正</strong>——请求更正不准确或不完整的信息
        </li>
        <li>
          <strong className="text-white">删除</strong>——请求删除您的个人信息（受法定保留义务约束）
        </li>
        <li>
          <strong className="text-white">投诉</strong>——如认为我们未正确处理您的信息，可向澳大利亚信息专员办公室（OAIC）投诉：{" "}
          <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">
            oaic.gov.au
          </a>
        </li>
      </ul>
      <p>
        如需行使上述权利，请联系 <a href={`mailto:${EMAIL}`}>{EMAIL}</a>，我们将在 30 天内回复。
      </p>

      <h2>10. 未成年人</h2>
      <p>
        我们的服务不面向 18 岁以下人士。我们不会主动收集未成年人的个人信息。
        如您发现有未成年人向我们提供了个人信息，请立即联系我们。
      </p>

      <h2>11. 跨境数据传输</h2>
      <p>
        部分服务提供商位于美国。我们会采取合理措施，确保接收方按照《澳大利亚隐私原则》或同等保护标准处理您的信息。
      </p>

      <h2>12. 政策变更</h2>
      <p>
        我们可能不定期更新本政策。重要变更将在生效前通过邮件或产品内通知告知您。
      </p>

      <h2>13. 联系我们</h2>
      <p>
        <strong className="text-white">{COMPANY}</strong>
        <br />
        ABN：{ABN}
        <br />
        {ADDRESS_ZH}
        <br />
        电子邮件：<a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <br />
        <br />
        如对我们的回复不满意，可联系澳大利亚信息专员办公室（OAIC）：{" "}
        <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">
          www.oaic.gov.au
        </a>{" "}
        · 电话：1300 363 992
      </p>
    </div>
  );
}

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-200/80">
          {zh ? "法律" : "Legal"}
        </p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white">
          {zh ? "隐私政策" : "Privacy Policy"}
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          {zh ? `最后更新：${LAST_UPDATED_ZH}` : `Last updated: ${LAST_UPDATED_EN}`}
        </p>
      </div>

      {zh ? <ChinesePrivacy /> : <EnglishPrivacy />}

      <div className="mt-16 border-t border-white/10 pt-8">
        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
          <Link href="/terms" className="hover:text-white transition-colors">
            {zh ? "使用条款" : "Terms of Service"}
          </Link>
          <Link href="/" className="hover:text-white transition-colors">
            {zh ? "返回首页" : "Back to home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
