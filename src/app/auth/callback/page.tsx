import { Suspense } from "react";
import { AuthCallbackClient } from "@/components/auth-callback-client";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-3xl flex-col px-6 py-24">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">Auth callback</p>
            <h1 className="mt-4 font-heading text-4xl font-bold text-white">Finishing your ArkAgentic sign-in</h1>
            <p className="mt-4 text-slate-300">Finishing secure sign-in...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
