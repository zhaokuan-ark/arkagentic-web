"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthSession } from "@/components/auth-session-provider";

export function AuthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isConfigured, user, signOut } = useAuthSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    router.push("/");
    router.refresh();
  }

  if (isAuthPage && !user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/5"
        >
          Back
        </Link>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="hidden items-center gap-3 lg:flex">
        <Link
          href="/signin"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/5"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/signin"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/5"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/account"
        className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/5 lg:inline-flex"
      >
        {user.email || "Account"}
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:opacity-60"
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}
