import { AppsOverview } from "@/components/apps-overview";

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <h1 className="font-heading text-4xl font-bold uppercase tracking-[0.18em] text-white">All apps</h1>
      </div>
      <div className="mt-10">
        <AppsOverview />
      </div>
    </div>
  );
}
