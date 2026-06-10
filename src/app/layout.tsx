import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArkAgentic | Autonomous AI Agents for Enterprise",
  description:
    "ArkAgentic is building a secure SaaS platform for autonomous AI workflows, customer accounts, and product access.",
};

const primaryNav = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/apps", label: "Apps" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#111827_45%,_#020617_100%)] text-slate-100 antialiased">
        <AuthSessionProvider>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
              <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="font-heading text-[1.78rem] font-bold tracking-[-0.045em] text-white">
                  <span className="bg-gradient-to-r from-sky-300 via-cyan-100 to-white bg-clip-text text-transparent">Ark</span>
                  <span className="-ml-[0.085em] text-white">Agentic</span>
                </Link>
                <div className="flex items-center justify-end gap-8">
                  <nav className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
                    {primaryNav.map((link) => (
                      <Link key={link.href} href={link.href} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <AuthNav />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-white/10 py-10 text-center text-[10px] tracking-[0.3em] text-slate-500">
              <div className="space-y-3 px-6">
                <p>&copy; 2026 ArkAgentic. ABN: 92 627 301 153</p>
                <p>11 Hassall Street, Parramatta NSW 2150</p>
              </div>
            </footer>
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
