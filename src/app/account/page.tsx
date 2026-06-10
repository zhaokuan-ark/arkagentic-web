import { AccountSummary } from "@/components/account-summary";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">Account</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white">Customer account</h1>
        <p className="mt-4 text-slate-300">
          This area now reads the active auth session and is ready to become the hub for profile, billing, and product access.
        </p>
        <div className="mt-8">
          <AccountSummary />
        </div>
      </div>
    </div>
  );
}
