import { AppsOverview } from "@/components/apps-overview";

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <h1 className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-200/80">All apps</h1>
      </div>
      <div className="mt-10">
        <AppsOverview />
      </div>
    </div>
  );
}
