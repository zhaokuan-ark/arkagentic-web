import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ArkAgentic",
  description: "How ArkAgentic collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "22 June 2026";
const COMPANY = "ArkAgentic";
const ABN = "92 627 301 153";
const ADDRESS = "11 Hassall Street, Parramatta NSW 2150, Australia";
const EMAIL = "privacy@arkagentic.com";
const WEBSITE = "https://www.arkagentic.com";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-200/80">Legal</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none text-slate-300 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-white [&_p]:mb-4 [&_p]:leading-7 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul>li]:mb-2 [&_a]:text-blue-300 [&_a:hover]:text-blue-200">

        <p>
          <strong className="text-white">{COMPANY} (ABN {ABN})</strong> is committed to protecting your privacy and handling your personal information in accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
        </p>
        <p>
          This Privacy Policy explains how we collect, use, store, and disclose personal information when you use our website at <a href={WEBSITE}>{WEBSITE}</a> and our services, including Invoice Extractor.
        </p>

        <h2>1. What Information We Collect</h2>
        <h3>1.1 Account information</h3>
        <p>When you create an account, we collect:</p>
        <ul>
          <li>Email address</li>
          <li>Name (if provided)</li>
          <li>Password (stored as a secure hash; we never store your plain-text password)</li>
        </ul>

        <h3>1.2 Billing information</h3>
        <p>
          Payment processing is handled by Stripe, Inc. We do not store your credit card number or full payment details. Stripe provides us with limited non-sensitive billing data including your subscription status, billing country, and last four card digits for display purposes. Stripe&rsquo;s privacy practices are governed by the <a href="https://stripe.com/au/privacy" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a>.
        </p>

        <h3>1.3 Usage data</h3>
        <p>When you use our services, we may collect:</p>
        <ul>
          <li>IP address (used for security purposes including trial fraud prevention)</li>
          <li>Browser type and version</li>
          <li>Pages visited and features used</li>
          <li>Date and time of access</li>
          <li>Error and diagnostic logs</li>
        </ul>

        <h3>1.4 Documents you process</h3>
        <p>
          When you use Invoice Extractor, we temporarily access files from your connected cloud storage (e.g. OneDrive) to extract invoice data. Documents are processed and then removed from our servers within 24 hours. We do not permanently store your invoice documents.
        </p>

        <h3>1.5 Contact form submissions</h3>
        <p>
          If you submit a contact or enquiry form on our website, we collect your name, email address, phone number, company name, and message content.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, operate, and improve our services</li>
          <li>Process payments and manage your subscription</li>
          <li>Authenticate your identity and secure your account</li>
          <li>Detect and prevent fraud, abuse, and security incidents</li>
          <li>Respond to your enquiries and provide customer support</li>
          <li>Send transactional emails (account confirmation, payment receipts, service notices)</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          We do not use your documents or invoice data to train, fine-tune, or otherwise improve any AI or machine learning models, whether our own or operated by third parties.
        </p>
        <p>
          We do not sell your personal information to third parties.
        </p>

        <h2>3. Cloud Drive Access</h2>
        <p>
          When you connect a cloud drive such as Microsoft OneDrive, we request access only to the specific folders you select. We use this access solely to read invoice files for processing and to write result files back to your chosen output folder.
        </p>
        <p>
          We do not access, read, or store any files outside the folders you have explicitly selected. You can revoke this access at any time through your cloud provider&rsquo;s account settings or through your ArkAgentic account settings.
        </p>

        <h2>4. AI and Third-Party Model Processing</h2>
        <p>
          Our services use AI models provided by third-party providers (such as OpenAI or Anthropic) to assist with document processing. When AI assistance is used, limited portions of your document content (extracted text fields) may be transmitted to these providers solely to generate the requested output.
        </p>
        <p>
          We configure our third-party AI providers with data processing terms that prohibit use of your data for model training. Your documents are not retained by these providers after the response is generated.
        </p>
        <p>
          Third-party providers we may use include:
        </p>
        <ul>
          <li>OpenAI, Inc. (United States) — <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
          <li>Anthropic, PBC (United States) — <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
        </ul>

        <h2>5. Disclosure of Your Information</h2>
        <p>We may disclose your personal information to:</p>
        <ul>
          <li><strong className="text-white">Service providers</strong> — companies that help us operate our services (authentication, hosting, payment processing, email delivery), under strict data processing agreements</li>
          <li><strong className="text-white">Legal requirements</strong> — when required by law, court order, or to protect our legal rights</li>
          <li><strong className="text-white">Business transfers</strong> — if ArkAgentic is acquired or merges with another entity, your information may be transferred as part of that transaction, subject to equivalent privacy protections</li>
        </ul>
        <p>We do not share your personal information with third parties for their own marketing purposes.</p>

        <h2>6. Data Storage and Security</h2>
        <p>
          Your account data is stored in Supabase (operated by Supabase Inc.) on AWS infrastructure in Australia or the United States. Invoice processing occurs on AWS infrastructure in the Asia-Pacific (Sydney) region.
        </p>
        <p>
          We implement industry-standard security measures including:
        </p>
        <ul>
          <li>TLS/HTTPS encryption for all data in transit</li>
          <li>Encrypted storage for sensitive data at rest</li>
          <li>Access controls limiting staff access to personal data</li>
          <li>Regular security reviews</li>
        </ul>
        <p>
          No method of transmission over the internet is 100% secure. While we take reasonable measures to protect your information, we cannot guarantee absolute security.
        </p>

        <h2>7. Data Retention</h2>
        <ul>
          <li><strong className="text-white">Account data</strong> — retained for the duration of your account and for up to 2 years after account closure for compliance purposes</li>
          <li><strong className="text-white">Processed invoice documents</strong> — deleted from our servers within 24 hours of processing</li>
          <li><strong className="text-white">Extraction result files</strong> — written to your chosen OneDrive folder and not retained on our servers</li>
          <li><strong className="text-white">Billing records</strong> — retained for 7 years as required by Australian taxation law</li>
          <li><strong className="text-white">Usage logs</strong> — retained for up to 90 days for security and debugging purposes</li>
        </ul>

        <h2>8. Cookies and Tracking</h2>
        <p>
          Our website uses session cookies necessary for authentication and service operation. We do not use advertising cookies or third-party tracking pixels. You can configure your browser to refuse cookies, but this may limit certain features of the service.
        </p>

        <h2>9. Your Privacy Rights</h2>
        <p>Under the Australian Privacy Principles, you have the right to:</p>
        <ul>
          <li><strong className="text-white">Access</strong> — request a copy of the personal information we hold about you</li>
          <li><strong className="text-white">Correction</strong> — request correction of inaccurate or incomplete information</li>
          <li><strong className="text-white">Deletion</strong> — request deletion of your personal information (subject to legal retention obligations)</li>
          <li><strong className="text-white">Complaint</strong> — lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">oaic.gov.au</a> if you believe we have not handled your personal information correctly</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We will respond within 30 days.
        </p>

        <h2>10. Children&rsquo;s Privacy</h2>
        <p>
          Our services are not directed at or intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us and we will take steps to delete it.
        </p>

        <h2>11. International Data Transfers</h2>
        <p>
          Some of our service providers are located in the United States. When we transfer your personal information overseas, we take reasonable steps to ensure that the recipient handles it in accordance with the Australian Privacy Principles or equivalent protections.
        </p>

        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a notice in the product. The updated policy will be effective from the date it is posted on this page.
        </p>

        <h2>13. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please contact our Privacy Officer at:
        </p>
        <p>
          <strong className="text-white">{COMPANY}</strong><br />
          ABN: {ABN}<br />
          {ADDRESS}<br />
          Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
        <p>
          If you are not satisfied with our response, you may contact the Office of the Australian Information Commissioner (OAIC):
        </p>
        <ul>
          <li>Website: <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">www.oaic.gov.au</a></li>
          <li>Phone: 1300 363 992</li>
        </ul>
      </div>

      <div className="mt-16 border-t border-white/10 pt-8">
        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/" className="hover:text-white transition-colors">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
