import { AppsOverview } from "@/components/apps-overview";

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">Apps</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white">Your ArkAgentic products</h1>
        <p className="mt-4 text-lg text-slate-300">
          This hub is becoming the signed-in launch surface for all customer-facing ArkAgentic applications.
        </p>
      </div>
      <div className="mt-10">
        <AppsOverview />
      </div>
    </div>
  );
}
