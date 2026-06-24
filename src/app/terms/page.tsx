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

function EnglishTerms() {
  return (
    <div className={prose}>
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of services operated by{" "}
        <strong className="text-white">{COMPANY} (ABN {ABN})</strong>, including Invoice Extractor
        and other products at <a href={WEBSITE}>{WEBSITE}</a>. By creating an account or using our
        services, you agree to these Terms.
      </p>

      <h2>1. Services</h2>
      <p>
        ArkAgentic provides AI-assisted business automation software as a subscription service (SaaS).
        Our current product, <strong className="text-white">Invoice Extractor</strong>, connects to your
        cloud drive and extracts structured invoice data into Excel/CSV outputs. We may update or
        discontinue features with reasonable notice.
      </p>

      <h2>2. Accounts and Eligibility</h2>
      <p>
        You must be at least 18 years old and have authority to enter this agreement. You are
        responsible for your account security and all activity under your account. Each account and free
        trial is for one person or business entity — creating multiple accounts to obtain additional
        trials is not permitted. Notify us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> if you suspect
        unauthorised access.
      </p>

      <h2>3. Free Trial</h2>
      <p>
        New accounts receive a 7-day free trial. No payment is required to start. After the trial,
        your subscription converts to a paid plan unless cancelled beforehand. The trial is available
        once per person and once per business. We reserve the right to determine trial eligibility.
      </p>

      <h2>4. Subscription, Fees and Billing</h2>
      <p>
        Fees are stated in Australian Dollars (AUD) inclusive of GST. Subscriptions are billed
        monthly in advance via Stripe. We may change pricing with at least 30 days&rsquo; written
        notice; continued use after the effective date constitutes acceptance of the new price. If a
        payment fails, we will notify you and may suspend access until payment is resolved.
      </p>

      <h2>5. Cancellation and Refunds</h2>
      <p>
        You may cancel at any time via your account settings or by emailing{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Cancellation takes effect at the end of the current
        billing period. We do not provide refunds for partial months or unused periods, except where
        required by the Australian Consumer Law.
      </p>

      <h2>6. Acceptable Use</h2>
      <p>You must not use our services to:</p>
      <ul>
        <li>Process documents you do not have the legal right to process</li>
        <li>Violate any applicable laws, including privacy laws</li>
        <li>Reverse-engineer, copy, or resell the service without authorisation</li>
        <li>Introduce malicious code or interfere with the service infrastructure</li>
        <li>Create multiple accounts to circumvent access controls or trial limits</li>
      </ul>

      <h2>7. Your Data and Privacy</h2>
      <p>
        You retain ownership of all data you upload or connect. We access only the specific folders
        you select and process your documents solely to provide the requested service. We do not use
        your documents to train AI models. See our <Link href="/privacy">Privacy Policy</Link> for
        full details.
      </p>

      <h2>8. AI Processing — Important Disclaimer</h2>
      <p>
        Our services use AI to assist with document processing.{" "}
        <strong className="text-white">
          AI outputs are a starting point for human review only and are not a substitute for
          professional accounting, financial, or legal advice.
        </strong>{" "}
        We make no warranty that AI extraction results are accurate or complete. You are solely
        responsible for reviewing all outputs before using them in any accounting or financial
        workflow. Any losses arising from reliance on unreviewed AI outputs are your responsibility.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        <strong className="text-white">
          To the maximum extent permitted by law, our total liability to you for any claim is limited
          to the total fees you paid to us in the 12 months preceding the event giving rise to the
          claim.
        </strong>
      </p>
      <p>
        We are not liable for any indirect, incidental, consequential, or special damages, including
        loss of profits, data, or business opportunity, arising from your use of or inability to use
        the service, errors in AI outputs, data loss, or service interruptions — even if we have been
        advised of the possibility of such damages.
      </p>
      <p>
        Nothing in these Terms limits or excludes rights you may have under the{" "}
        <em>Australian Consumer Law</em> (<em>Competition and Consumer Act 2010</em> Cth, Schedule 2)
        that cannot lawfully be excluded.
      </p>

      <h2>10. Australian Consumer Law Guarantees</h2>
      <p>
        Our services come with statutory guarantees under the Australian Consumer Law that cannot be
        excluded. For major failures, you are entitled to a refund or replacement. For minor failures,
        we will repair or replace the service, or provide a refund at our discretion. Nothing in
        these Terms limits your statutory consumer rights.
      </p>

      <h2>11. Service Availability</h2>
      <p>
        We aim for reliable service but do not guarantee uninterrupted availability. Scheduled
        maintenance will be communicated in advance where practicable. We are not liable for losses
        caused by downtime or service interruptions except where required by law.
      </p>

      <h2>12. Intellectual Property</h2>
      <p>
        All intellectual property in our software, platform, and content (excluding your data)
        remains the exclusive property of ArkAgentic or its licensors. Nothing in these Terms
        transfers any intellectual property rights to you.
      </p>

      <h2>13. Termination</h2>
      <p>
        We may suspend or terminate your account if you breach these Terms, fail to pay fees, or if
        your use poses a risk to other users or the service. We will generally provide notice before
        termination except where immediate action is required for security or legal reasons.
      </p>

      <h2>14. Changes to These Terms</h2>
      <p>
        We may update these Terms at any time. We will notify you of material changes by email or
        in-product notice with at least 14 days&rsquo; advance notice. Continued use after the
        effective date constitutes acceptance.
      </p>

      <h2>15. Governing Law</h2>
      <p>
        These Terms are governed by the laws of <strong className="text-white">New South Wales, Australia</strong>.
        Any disputes are subject to the exclusive jurisdiction of the courts of New South Wales,
        Australia.
      </p>

      <h2>16. Contact</h2>
      <p>
        <strong className="text-white">{COMPANY}</strong>
        <br />
        ABN: {ABN}
        <br />
        {ADDRESS_EN}
        <br />
        Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </p>
    </div>
  );
}

function ChineseTerms() {
  return (
    <div className={prose}>
      <p>
        本使用条款（"条款"）规范您对{" "}
        <strong className="text-white">{COMPANY}（ABN {ABN}）</strong>
        旗下服务的访问与使用，包括发票提取器及{" "}
        <a href={WEBSITE}>{WEBSITE}</a> 上的其他产品。注册账户或使用我们的服务，即表示您同意本条款。
      </p>

      <h2>1. 服务说明</h2>
      <p>
        ArkAgentic 以订阅制方式（SaaS）提供 AI 辅助商业自动化软件。当前主要产品{" "}
        <strong className="text-white">发票提取器</strong>
        可连接您的云端硬盘，将发票文件提取为 Excel/CSV 结构化数据，适用于 Xero 等会计软件。
        我们保留在合理通知后更新或终止功能的权利。
      </p>

      <h2>2. 账户与使用资格</h2>
      <p>
        您须年满 18 周岁，且有权代表本人或所在机构签订本协议。您负责保管账户凭据及账户下发生的全部行为。
        每位用户或每家企业仅限使用一个账户和一次免费试用——通过创建多个账户获取额外试用属于违规行为。
        如发现账户被未经授权使用，请立即通知我们：
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>。
      </p>

      <h2>3. 免费试用</h2>
      <p>
        新账户享有 7 天免费试用期，无需提供付款信息即可开始。试用期结束后，除非您在到期前取消，
        订阅将自动转为付费计划。免费试用每人、每家企业限享一次，我们保留最终判断试用资格的权利。
      </p>

      <h2>4. 订阅、费用与账单</h2>
      <p>
        所有费用以澳元（AUD）计价，含 GST（如适用）。订阅费用通过 Stripe 按月预付。
        如需调整价格，我们将提前至少 30 天书面通知；生效日期后继续使用即视为接受新价格。
        付款失败时，我们将通知您，并可能在问题解决前暂停账户访问权限。
      </p>

      <h2>5. 取消与退款</h2>
      <p>
        您可随时通过账户设置或发送邮件至{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> 取消订阅。取消在当前计费周期结束时生效，期间您可继续使用服务。
        除《澳大利亚消费者法》另有规定外，我们不对未使用的订阅期或部分月份提供退款。
      </p>

      <h2>6. 合规使用</h2>
      <p>您不得使用我们的服务：</p>
      <ul>
        <li>处理您无合法权利处理的文件或数据</li>
        <li>违反任何适用法律法规（包括隐私法律）</li>
        <li>未经授权进行逆向工程、复制或转售服务</li>
        <li>引入恶意代码或干扰服务基础设施</li>
        <li>通过创建多个账户规避访问控制或试用限制</li>
      </ul>

      <h2>7. 您的数据与隐私</h2>
      <p>
        您对上传或连接至本服务的所有数据保留所有权。我们仅访问您明确选择的文件夹，并仅为提供所请求的服务而处理您的文件。
        我们不使用您的文件训练 AI 模型。详情请参阅{" "}
        <Link href="/privacy">隐私政策</Link>。
      </p>

      <h2>8. AI 处理 — 重要免责声明</h2>
      <p>
        我们的服务通过 AI 辅助处理文件。
        <strong className="text-white">
          AI 输出结果仅供人工审核参考，不构成专业会计、财务或法律建议。
        </strong>
        我们不保证 AI 提取结果的准确性或完整性。您须自行负责在将输出用于任何会计或财务工作流程之前进行审核。
        因依赖未经审核的 AI 输出而产生的任何损失，由您自行承担。
      </p>

      <h2>9. 责任限制</h2>
      <p>
        <strong className="text-white">
          在法律允许的最大范围内，我们对您任何索赔的总责任，以索赔事件发生前 12 个月内您向我们支付的总费用为上限。
        </strong>
      </p>
      <p>
        对于因使用或无法使用本服务、AI 输出错误、数据丢失或服务中断而产生的任何间接、附带、继发或特殊损失
        （包括利润损失、数据损失或商业机会损失），我们概不承担责任——即使已被告知此类损失的可能性。
      </p>
      <p>
        本条款中的任何内容均不限制或排除您在《澳大利亚消费者法》
        （《2010年竞争与消费者法》附表二）下依法不可被排除的权利。
      </p>

      <h2>10. 澳大利亚消费者法保障</h2>
      <p>
        依据《澳大利亚消费者法》，我们的服务附带法定保障，不可被排除。对于重大缺陷，您有权获得退款或更换服务；
        对于轻微缺陷，我们将视情况修复、更换服务或提供退款。本条款不限制您的法定消费者权益。
      </p>

      <h2>11. 服务可用性</h2>
      <p>
        我们致力于提供稳定可靠的服务，但不保证服务不间断。计划维护将在可行的情况下提前通知。
        除法律另有规定外，我们不对因服务中断或故障造成的损失承担责任。
      </p>

      <h2>12. 知识产权</h2>
      <p>
        我们软件、平台及内容（您的数据除外）中的全部知识产权归 ArkAgentic 或其许可方所有。
        本条款不向您转让任何知识产权。
      </p>

      <h2>13. 账户终止</h2>
      <p>
        如您违反本条款、拖欠费用，或您的使用行为对其他用户或服务构成风险，我们可暂停或终止您的账户。
        除因安全或法律原因需立即采取行动外，我们通常会在终止前发出通知。
      </p>

      <h2>14. 条款变更</h2>
      <p>
        我们可随时更新本条款。对于重要变更，我们将通过邮件或产品内通知提前至少 14 天告知。
        在生效日期后继续使用即视为接受更新后的条款。
      </p>

      <h2>15. 适用法律</h2>
      <p>
        本条款受{" "}
        <strong className="text-white">澳大利亚新南威尔士州法律</strong>管辖。
        任何争议须提交新南威尔士州法院专属管辖。
      </p>

      <h2>16. 联系方式</h2>
      <p>
        <strong className="text-white">{COMPANY}</strong>
        <br />
        ABN：{ABN}
        <br />
        {ADDRESS_ZH}
        <br />
        电子邮件：<a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </p>
    </div>
  );
}

export default function TermsPage() {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-200/80">
          {zh ? "法律" : "Legal"}
        </p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white">
          {zh ? "使用条款" : "Terms of Service"}
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          {zh ? `最后更新：${LAST_UPDATED_ZH}` : `Last updated: ${LAST_UPDATED_EN}`}
        </p>
      </div>

      {zh ? <ChineseTerms /> : <EnglishTerms />}

      <div className="mt-16 border-t border-white/10 pt-8">
        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
          <Link href="/privacy" className="hover:text-white transition-colors">
            {zh ? "隐私政策" : "Privacy Policy"}
          </Link>
          <Link href="/" className="hover:text-white transition-colors">
            {zh ? "返回首页" : "Back to home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
