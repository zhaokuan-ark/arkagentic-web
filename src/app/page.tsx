import Link from "next/link";

const partnerLogos = [
  {
    name: "Claude",
    src: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/claude.svg",
    className: "h-6",
    withLabel: true,
  },
  {
    name: "Microsoft",
    src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    className: "h-6",
  },
  {
    name: "OpenAI",
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
    className: "h-7",
  },
  {
    name: "AWS",
    src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    className: "h-8",
  },
  {
    name: "Google Cloud",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
    className: "h-5",
  },
];

const features = [
  {
    title: "Autonomous Execution",
    description:
      "Agents that don\'t just suggest, but execute complex tasks across your existing software stack.",
    accent: "from-blue-500/30 to-cyan-400/10",
  },
  {
    title: "Enterprise Grade",
    description:
      "Built with security and reliability at the core, ensuring safe integration with corporate data.",
    accent: "from-emerald-500/30 to-teal-400/10",
  },
  {
    title: "Scalable Workforce",
    description:
      "Instantly deploy dozens of specialized agents to handle peak workloads without overhead.",
    accent: "from-purple-500/30 to-fuchsia-400/10",
  },
];

const proofPoints = [
  "Invoice Extractor is live as our first customer product",
  "More AI workflow tools are already being shaped behind it",
  "Custom AI systems and private workflow design are also part of the offer",
];

const roadmapProducts = [
  {
    name: "Invoice Extractor",
    status: "Live now",
    description: "Extract invoices from cloud folders into structured outputs with human-review-friendly workflows.",
  },
  {
    name: "Inbox & Document Triage",
    status: "In design",
    description: "Automatically classify, route, and summarize incoming business documents and shared inbox traffic.",
  },
  {
    name: "Quote & Proposal Assistant",
    status: "Planned",
    description: "Generate draft proposals, pull source details, and help small teams move faster on sales admin work.",
  },
];

const serviceTracks = [
  {
    title: "Use ArkAgentic products",
    description:
      "Start with ready-to-use AI tools like Invoice Extractor, then launch future products from one ArkAgentic account.",
  },
  {
    title: "Build a private AI workflow with us",
    description:
      "Work with us on a custom AI system designed around your exact internal process, integrations, and review rules.",
  },
];

const pricingPlans = [
  {
    name: "Invoice Extractor",
    price: "$19/mo",
    description: "A simple starting point for individual operators and small teams.",
    features: ["7-day free trial", "Email-based account login", "AI extraction usage billed separately"],
    cardClassName: "border-white/10 bg-white/5",
    eyebrowClassName: "text-blue-200/80",
  },
  {
    name: "Custom Build",
    price: "Custom quote",
    description: "For teams that want a tailored AI workflow, internal tool, or private system built around how they actually work.",
    features: [
      "Built around your workflow and business requirements",
      "Can combine AI with the tools, steps, and approvals you already use",
      "Can be delivered as a private tool, internal system, or client-facing workflow",
    ],
    cardClassName: "border-cyan-400/20 bg-cyan-500/10",
    eyebrowClassName: "text-cyan-200/85",
  },
];

const faqs = [
  {
    question: 'What exactly is a "Digital Workforce"?',
    answer:
      "Unlike traditional chatbots, our Digital Workforce consists of Autonomous AI Agents that can plan and execute multi-step business processes across your software tools.",
  },
  {
    question: "Are you only offering one product?",
    answer:
      "No. Invoice Extractor is the first live product, but the broader direction is a growing suite of focused AI tools plus custom-built workflow systems for clients with unique needs.",
  },
  {
    question: "Can you build something custom for my business?",
    answer:
      "Yes. Alongside our SaaS tools, we also design and implement tailored AI workflows and internal systems for businesses that need something specific.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use enterprise-grade encryption and ensure that your data is never used to train public models.",
  },
  {
    question: "Can it integrate with my existing CRM/ERP?",
    answer:
      "Absolutely. Our agents are designed to work with standard APIs and web interfaces that your team already uses.",
  },
  {
    question: "How long does deployment take?",
    answer:
      "For ready-made products you can start immediately. For custom workflow projects, timelines depend on complexity, but we aim to move fast with clear implementation stages.",
  },
];

export default function HomePage() {
  return (
    <div className="pb-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/ai-grid-bg.svg')] bg-cover bg-center opacity-[0.16]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(2,6,23,0.12),_rgba(2,6,23,0.58)_58%,_rgba(2,6,23,0.88)_100%)]" />
          <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute right-10 top-40 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-16 md:grid-cols-[1.08fr_0.92fr] md:items-center md:py-22">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              AI agents for real business operations
            </div>

            <h1 className="mt-6 font-heading text-5xl font-bold leading-[1.02] tracking-tight text-white md:text-7xl">
              Building your
              <span className="mt-3 block bg-gradient-to-r from-blue-300 via-cyan-200 to-fuchsia-300 bg-clip-text text-transparent">
                digital workforce
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              ArkAgentic is growing in two directions at once: focused SaaS products your team can launch immediately, and custom AI systems designed around the exact workflows your business needs.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-[0_18px_80px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Explore products
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
              >
                Custom build enquiry
              </a>
              <a
                href="https://www.youtube.com/@ArkAgentic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-4 text-base font-medium text-slate-300 transition hover:text-white"
              >
                <span className="mr-3 text-red-400">▶</span>
                Watch demo
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-400">
              {proofPoints.map((item) => (
                <div key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-500/15 via-transparent to-fuchsia-500/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_30px_120px_rgba(2,6,23,0.8)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Product spotlight</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-white">Invoice Extractor</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                    Our first live ArkAgentic product, built for finance teams that need to turn messy invoice folders into structured business data.
                  </p>
                </div>
                <div className="sm:mt-1">
                  <div className="w-fit whitespace-nowrap rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.18)]">
                    Live now
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="rounded-[1.4rem] border border-blue-400/10 bg-gradient-to-r from-blue-500/10 via-white/[0.03] to-transparent p-5">
                      <div className="flex min-h-[7.5rem] items-start gap-4 sm:gap-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-blue-400/15 bg-blue-500/10 text-blue-200">
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4 18.5V8.6a2 2 0 0 1 2-2h4.2l1.6 1.8H18a2 2 0 0 1 2 2v7.1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                          </svg>
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-slate-500">Input</p>
                          <p className="mt-2 text-lg font-semibold text-white">Cloud folders</p>
                          <p className="mt-2 min-h-[3rem] max-w-lg text-sm leading-6 text-slate-400">Connects to cloud folders while keeping customer invoice data private and secure.</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[1.4rem] border border-emerald-400/10 bg-gradient-to-r from-emerald-500/10 via-white/[0.03] to-transparent p-5">
                      <div className="flex min-h-[7.5rem] items-start gap-4 sm:gap-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-emerald-400/15 bg-emerald-500/10 text-emerald-200">
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M6.5 7.5h11" />
                            <path d="M9 11.5h6" />
                            <path d="M11 15.5h2" />
                            <path d="M6 19.5h12a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 18 4.5H6A1.5 1.5 0 0 0 4.5 6V18A1.5 1.5 0 0 0 6 19.5Z" />
                          </svg>
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-slate-500">Processing</p>
                          <p className="mt-2 text-lg font-semibold text-white">Invoice extraction</p>
                          <p className="mt-2 min-h-[3rem] max-w-xl text-sm leading-6 text-slate-400">Identifies invoice files in bulk and extracts key fields into a reviewable structured format.</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[1.4rem] border border-fuchsia-400/10 bg-gradient-to-r from-fuchsia-500/10 via-white/[0.03] to-transparent p-5">
                      <div className="flex min-h-[7.5rem] items-start gap-4 sm:gap-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-fuchsia-400/15 bg-fuchsia-500/10 text-fuchsia-200">
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M8 7.5h8" />
                            <path d="M8 11.5h8" />
                            <path d="M8 15.5h5" />
                            <path d="M6 19.5h12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5Z" />
                          </svg>
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-slate-500">Output</p>
                          <p className="mt-2 text-lg font-semibold text-white">Structured invoice data</p>
                          <p className="mt-2 min-h-[3rem] max-w-xl text-sm leading-6 text-slate-400">Produces review-ready outputs for export, finance checks, and downstream workflows.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <Link
                    href="/apps/invoice-extractor"
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    Start free 7-day trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="mx-auto max-w-6xl px-6 py-10 text-center">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-10 backdrop-blur-sm">
          <p className="mb-10 text-[11px] font-bold uppercase tracking-[0.5em] text-slate-500 opacity-80">
            Orchestrating the best models
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {partnerLogos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center justify-center opacity-70 transition duration-300 hover:-translate-y-1 hover:opacity-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.name} className={`${logo.className} object-contain brightness-0 invert`} />
                {logo.withLabel ? (
                  <span className="ml-3 font-heading text-xl font-semibold text-white">Claude</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">Capabilities</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white">A sharper front door for products and bespoke AI systems</h2>
          <p className="mt-4 text-lg text-slate-300">
            ArkAgentic is not just one tool. The homepage now needs to show both the product suite we are building and the custom workflow capability we bring to clients with unique needs.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${feature.accent} opacity-80 blur-2xl transition group-hover:opacity-100`} />
              <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                  ✦
                </div>
                <h2 className="font-heading text-xl font-bold text-white">{feature.title}</h2>
                <p className="mt-4 leading-relaxed text-slate-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-6 md:grid-cols-2">
          {serviceTracks.map((track) => (
            <div key={track.title} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">How to work with us</p>
              <h2 className="mt-4 font-heading text-3xl font-bold text-white">{track.title}</h2>
              <p className="mt-4 text-slate-300">{track.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-28">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">Pricing</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white">Simple product pricing, plus custom build pathways when you need something more tailored.</h2>
          <p className="mt-4 text-lg text-slate-300">
            Start with Invoice Extractor if you want a live SaaS product today, or talk to us about a custom build if your workflow needs something more specific.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className={`rounded-[2rem] border p-8 ${plan.cardClassName}`}>
              <p className={`text-sm uppercase tracking-[0.3em] ${plan.eyebrowClassName}`}>{plan.name}</p>
              <h3 className="mt-4 font-heading text-4xl font-bold text-white">{plan.price}</h3>
              <p className="mt-4 text-slate-300">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-slate-200">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-28">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">Product roadmap</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white">The first product is live. More focused tools can follow.</h2>
          <p className="mt-4 text-lg text-slate-300">
            We can use the homepage to build anticipation, show what is already available, and signal that ArkAgentic is becoming a broader toolkit for small businesses, teams, and operators.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {roadmapProducts.map((product) => (
            <div key={product.name} className="rounded-[2rem] border border-white/10 bg-slate-950/50 p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading text-2xl font-bold text-white">{product.name}</h3>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {product.status}
                </span>
              </div>
              <p className="mt-4 text-slate-300">{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">FAQ</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white">Answers for buyers and operators</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 transition-all open:border-blue-400/30 open:bg-blue-500/[0.06]"
            >
              <summary className="cursor-pointer list-none text-lg font-semibold text-white">{faq.question}</summary>
              <p className="pt-4 text-base leading-7 text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 shadow-[0_30px_100px_rgba(59,130,246,0.12)] backdrop-blur-xl">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">Request a demo</p>
              <h2 className="mt-4 font-heading text-4xl font-bold text-white">Need software you can use now — or a private AI workflow built for you?</h2>
              <p className="mt-4 text-slate-300">
                We can help in both directions: launch a product like Invoice Extractor today, or work with you on a custom AI system tailored to your business process.
              </p>
              <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-300">
                Good fit for teams exploring:
                <ul className="mt-3 space-y-2">
                  <li>• Finance and invoice operations</li>
                  <li>• Inbox, documents, and internal ops workflows</li>
                  <li>• Private AI tools with human review and approvals</li>
                </ul>
              </div>
            </div>

            <form action="https://api.web3forms.com/submit" method="POST" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <input type="hidden" name="access_key" value="d2eef3e2-c7df-4f6d-9807-923b5928d0f3" />
              <input type="hidden" name="redirect" value="https://www.arkagentic.com/" />
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">Full name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-xl border border-white/15 bg-slate-950/50 p-4 text-white outline-none transition focus:border-blue-500 focus:bg-white/10"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">Business email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-xl border border-white/15 bg-slate-950/50 p-4 text-white outline-none transition focus:border-blue-500 focus:bg-white/10"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full rounded-xl border border-white/15 bg-slate-950/50 p-4 text-white outline-none transition focus:border-blue-500 focus:bg-white/10"
                  placeholder="+61 400 000 000"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">Company name</label>
                <input
                  type="text"
                  name="company"
                  required
                  className="w-full rounded-xl border border-white/15 bg-slate-950/50 p-4 text-white outline-none transition focus:border-blue-500 focus:bg-white/10"
                  placeholder="Your business"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-400">What do you want help with?</label>
                <textarea
                  name="message"
                  rows={5}
                  className="w-full rounded-xl border border-white/15 bg-slate-950/50 p-4 text-white outline-none transition focus:border-blue-500 focus:bg-white/10"
                  placeholder="Tell us whether you want to use an ArkAgentic product, explore a private custom workflow, or both."
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-[0_0_24px_rgba(59,130,246,0.25)] transition hover:bg-blue-500"
                >
                  Submit request
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
