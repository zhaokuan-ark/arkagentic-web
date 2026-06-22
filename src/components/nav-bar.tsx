"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthSession } from "@/components/auth-session-provider";
import { useLanguage } from "@/components/language-provider";

/* ── Language Switcher ── */
function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-sm text-slate-300 transition hover:border-white/30 hover:text-white"
        aria-expanded={open}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.25 2.45 3.38 5.45 3.38 9S14.25 18.55 12 21" />
          <path d="M12 3C9.75 5.45 8.62 8.45 8.62 12S9.75 18.55 12 21" />
        </svg>
        <span className="font-medium">{lang === "en" ? "EN" : "中文"}</span>
        <svg className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[100px] overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-xl backdrop-blur-xl">
          {(["en", "zh"] as const).map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-white/5 ${
                lang === l ? "text-blue-300 font-medium" : "text-slate-300"
              }`}
            >
              {t.lang[l]}
              {lang === l && (
                <svg className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 8 4 4 6-6" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── User Menu ── */
function UserMenu() {
  const { user, signOut } = useAuthSession();
  const { t } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    setOpen(false);
    await signOut();
    setIsSigningOut(false);
    router.push("/");
    router.refresh();
  }

  // Get initials for avatar
  const initials = user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={t.nav.account}
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/80 text-sm font-semibold text-white ring-2 ring-white/0 transition hover:bg-blue-500 hover:ring-white/20 ${open ? "ring-white/20" : ""}`}
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-xl backdrop-blur-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-[11px] text-slate-500">{t.nav.signedInAs}</p>
            <p className="mt-0.5 truncate text-sm font-medium text-slate-200">{user?.email}</p>
          </div>
          <div className="p-1">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 12.2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M5.4 20a6.8 6.8 0 0 1 13.2 0" />
              </svg>
              {t.nav.account}
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {isSigningOut ? t.nav.signingOut : t.nav.signOut}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main NavBar ── */
export function NavBar() {
  const pathname = usePathname();
  const { isConfigured, user } = useAuthSession();
  const { t } = useLanguage();

  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  const navLinks = [
    { href: "/#features", label: t.nav.features },
    { href: "/#pricing", label: t.nav.pricing },
    { href: "/#faq", label: t.nav.faq },
    { href: "/apps", label: t.nav.apps },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="font-heading text-[1.78rem] font-bold tracking-[-0.045em] text-white">
          <span className="bg-gradient-to-r from-sky-300 via-cyan-100 to-white bg-clip-text text-transparent">Ark</span>
          <span className="-ml-[0.085em] text-white">Agentic</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Nav links — hidden on auth pages */}
          {!isAuthPage && (
            <nav className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Auth: back button on auth pages */}
          {isAuthPage && !user && (
            <Link
              href="/"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/5"
            >
              {t.nav.back}
            </Link>
          )}

          {/* Auth: sign in button when not logged in and not on auth page */}
          {!isAuthPage && !user && isConfigured && (
            <Link
              href="/signin"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/5"
            >
              {t.nav.signIn}
            </Link>
          )}

          {/* Auth: avatar dropdown when logged in */}
          {user && <UserMenu />}
        </div>
      </div>
    </header>
  );
}
