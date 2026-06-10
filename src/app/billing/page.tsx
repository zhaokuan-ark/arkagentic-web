import Link from "next/link";

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">Billing</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white">Billing and subscription</h1>
        <p className="mt-4 text-slate-300">
          This page is reserved for Stripe checkout state, trial visibility, renewal, and subscription management.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
            <h2 className="text-xl font-semibold text-white">Planned billing flow</h2>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>• 7-day free trial</li>
              <li>• Starter plan at $29/month</li>
              <li>• Stripe checkout and portal</li>
              <li>• Backend entitlement checks before product access</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
            <h2 className="text-xl font-semibold text-white">Current state</h2>
            <p className="mt-4 text-slate-300">
              Auth is now wired far enough to support a future billing handoff. The next implementation step is a subscription record plus a checkout flow.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/#pricing" className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500">
                View pricing
              </Link>
              <Link href="/account" className="rounded-xl border border-white/15 px-4 py-2 font-medium text-white transition hover:bg-white/5">
                Go to account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
