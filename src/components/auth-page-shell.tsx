import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

type AuthPageShellProps = {
  mode: "signin" | "signup";
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function AuthPageShell({ mode, searchParams }: AuthPageShellProps) {
  const resolved = (await searchParams) ?? {};
  const nextParam = resolved.next;
  const errorParam = resolved.error;
  const messageParam = resolved.message;

  const nextPath = typeof nextParam === "string" ? nextParam : "/apps";
  const initialError = typeof errorParam === "string" ? errorParam : undefined;
  const initialMessage = typeof messageParam === "string" ? messageParam : undefined;

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-6 py-16 md:py-20">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-6 text-slate-300 md:p-8">
            Loading sign-in form...
          </div>
        }
      >
        <AuthForm mode={mode} nextPath={nextPath} initialError={initialError} initialMessage={initialMessage} />
      </Suspense>
    </div>
  );
}
