const plans = [
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

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-white font-heading md:text-5xl">Pricing</h1>
        <p className="mt-4 text-lg text-slate-300">
          Pricing is being formalized as part of the ArkAgentic SaaS rollout. These tiers are the working structure for the new platform.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.name} className={`rounded-3xl border p-8 ${plan.cardClassName}`}>
            <p className={`text-sm uppercase tracking-[0.3em] ${plan.eyebrowClassName}`}>{plan.name}</p>
            <h2 className="mt-4 text-4xl font-bold text-white">{plan.price}</h2>
            <p className="mt-4 text-slate-300">{plan.description}</p>
            <ul className="mt-6 space-y-3 text-slate-200">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
