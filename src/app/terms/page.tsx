import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ArkAgentic",
  description: "Terms and conditions for using ArkAgentic products and services.",
};

const LAST_UPDATED = "22 June 2026";
const COMPANY = "ArkAgentic";
const ABN = "92 627 301 153";
const ADDRESS = "11 Hassall Street, Parramatta NSW 2150, Australia";
const EMAIL = "support@arkagentic.com";
const WEBSITE = "https://www.arkagentic.com";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-200/80">Legal</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white">Terms of Service</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none text-slate-300 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-white [&_p]:mb-4 [&_p]:leading-7 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul>li]:mb-2 [&_a]:text-blue-300 [&_a:hover]:text-blue-200">

        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the services, software, and websites operated by <strong className="text-white">{COMPANY} (ABN {ABN})</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), including Invoice Extractor and any other products available at <a href={WEBSITE}>{WEBSITE}</a>.
        </p>
        <p>
          By creating an account or using our services, you agree to these Terms. If you do not agree, you must not use our services.
        </p>

        <h2>1. Services</h2>
        <p>
          ArkAgentic provides AI-assisted business automation software delivered as a subscription service (&ldquo;Software as a Service&rdquo; or &ldquo;SaaS&rdquo;). Our current products include:
        </p>
        <ul>
          <li><strong>Invoice Extractor</strong> — cloud-connected document processing that extracts structured invoice data from files stored in your connected cloud drive and produces Excel and CSV outputs suitable for accounting software such as Xero.</li>
        </ul>
        <p>We may update, add, or discontinue features at any time with reasonable notice to users.</p>

        <h2>2. Accounts and Eligibility</h2>
        <p>
          To use our services you must create an account using a valid email address. You must be at least 18 years of age and have the legal authority to enter into this agreement on behalf of yourself or your organisation.
        </p>
        <p>
          You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. Notify us immediately at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> if you suspect unauthorised access.
        </p>
        <p>
          Each account and free trial is for individual use by one person or one business entity. Creating multiple accounts to obtain additional free trial periods is not permitted.
        </p>

        <h2>3. Free Trial</h2>
        <p>
          We offer a 7-day free trial for new accounts. No payment is required to start the trial. At the end of the trial period, your subscription will automatically convert to a paid plan unless you cancel before the trial expires.
        </p>
        <p>
          The free trial is available once per person and once per business. We reserve the right to determine trial eligibility and to decline trial access where we have reason to believe the eligibility criteria have not been met.
        </p>

        <h2>4. Subscription and Fees</h2>
        <h3>4.1 Pricing</h3>
        <p>
          Subscription fees are stated in Australian Dollars (AUD) and are <strong className="text-white">inclusive of GST</strong> where GST applies. Current pricing is displayed at <a href={`${WEBSITE}/pricing`}>{WEBSITE}/pricing</a>.
        </p>
        <h3>4.2 Billing</h3>
        <p>
          Fees are billed monthly in advance on a recurring basis through our payment processor (Stripe). You authorise us to charge your nominated payment method for each billing period.
        </p>
        <h3>4.3 Price changes</h3>
        <p>
          We may change our prices with at least 30 days&rsquo; written notice. Continued use of the service after the effective date of a price change constitutes acceptance of the new pricing.
        </p>
        <h3>4.4 Late payment</h3>
        <p>
          If a payment fails, we will notify you and may suspend access to your account until payment is resolved. We will make reasonable attempts to collect payment before suspending access.
        </p>

        <h2>5. Cancellation and Refunds</h2>
        <p>
          You may cancel your subscription at any time through your account settings or by contacting <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Cancellation takes effect at the end of the current billing period, and you will retain access to the service until that date.
        </p>
        <p>
          We do not provide refunds for partial months or unused subscription periods, except where required by the Australian Consumer Law or other applicable legislation. If you believe you are entitled to a refund under consumer protection law, please contact us.
        </p>

        <h2>6. Acceptable Use</h2>
        <p>You must not use our services to:</p>
        <ul>
          <li>Process documents or data you do not have the legal right to process</li>
          <li>Violate any applicable laws or regulations, including privacy laws</li>
          <li>Attempt to reverse-engineer, copy, or resell the service without authorisation</li>
          <li>Introduce malicious code, viruses, or other harmful software</li>
          <li>Overload or interfere with the service infrastructure</li>
          <li>Use automated tools to create accounts or bypass access controls</li>
        </ul>

        <h2>7. Your Data and Privacy</h2>
        <p>
          When you connect a cloud drive (such as Microsoft OneDrive), we access only the specific folders you select. We process your documents solely to provide the service you have requested. We do not use your documents to train AI models. Please review our <Link href="/privacy">Privacy Policy</Link> for full details of how we handle your personal information.
        </p>
        <p>
          You retain ownership of all data you upload or connect to our service. By using the service, you grant us a limited, non-exclusive licence to process that data for the purpose of providing the service.
        </p>

        <h2>8. AI Processing</h2>
        <p>
          Our service uses artificial intelligence and machine learning to assist with document processing. AI outputs are provided as a starting point for human review and are not a substitute for professional accounting, financial, or legal advice.
        </p>
        <p>
          We make no warranty that AI extraction results are free from errors. You are responsible for reviewing all outputs before use in any accounting or financial workflow.
        </p>

        <h2>9. Intellectual Property</h2>
        <p>
          All intellectual property in our software, platform, and content (excluding your data) remains the exclusive property of ArkAgentic or its licensors. Nothing in these Terms transfers any intellectual property rights to you.
        </p>

        <h2>10. Availability and Service Levels</h2>
        <p>
          We aim to provide reliable service but do not guarantee uninterrupted availability. We may perform scheduled maintenance with reasonable advance notice. In the event of a service outage, we will work to restore service as quickly as practicable.
        </p>
        <p>
          We are not liable for any loss or damage caused by downtime, errors, or interruptions to the service except where required by law.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, our total liability to you for any claim arising from your use of the service is limited to the total fees you paid to us in the 12 months preceding the event giving rise to the claim.
        </p>
        <p>
          We are not liable for any indirect, incidental, consequential, or special damages, including loss of profits, data, or business opportunity. Nothing in these Terms limits or excludes rights you may have under the Australian Consumer Law that cannot lawfully be excluded.
        </p>

        <h2>12. Australian Consumer Law</h2>
        <p>
          Our services come with guarantees under the Australian Consumer Law that cannot be excluded. For major failures, you are entitled to a refund or replacement. For minor failures, we will repair or replace the service, or provide a refund. Nothing in these Terms limits your statutory consumer rights.
        </p>

        <h2>13. Termination</h2>
        <p>
          We may suspend or terminate your account if you breach these Terms, fail to pay fees, or if we reasonably believe your use poses a risk to other users or the service. We will generally provide notice before termination except where immediate action is required for security or legal reasons.
        </p>

        <h2>14. Changes to These Terms</h2>
        <p>
          We may update these Terms at any time. We will notify you of material changes by email or through a notice in the product with at least 14 days&rsquo; advance notice. Continued use of the service after the effective date constitutes acceptance of the updated Terms.
        </p>

        <h2>15. Governing Law</h2>
        <p>
          These Terms are governed by the laws of New South Wales, Australia. Any disputes will be subject to the exclusive jurisdiction of the courts of New South Wales, Australia.
        </p>

        <h2>16. Contact</h2>
        <p>
          For questions about these Terms, please contact us at:
        </p>
        <p>
          <strong className="text-white">{COMPANY}</strong><br />
          ABN: {ABN}<br />
          {ADDRESS}<br />
          Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </div>

      <div className="mt-16 border-t border-white/10 pt-8">
        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/" className="hover:text-white transition-colors">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
