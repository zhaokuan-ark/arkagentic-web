import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { NavBar } from "@/components/nav-bar";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { LanguageProvider } from "@/components/language-provider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#111827_45%,_#020617_100%)] text-slate-100 antialiased">
        <AuthSessionProvider>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <NavBar />
              <main className="flex-1">{children}</main>
              <FooterWithLang />
            </div>
          </LanguageProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

// Server-compatible footer placeholder — actual translated footer lives in page.tsx
function FooterWithLang() {
  return (
    <footer className="border-t border-white/10 py-10 text-center text-[10px] tracking-[0.3em] text-slate-500">
      <div className="space-y-3 px-6">
        <p>&copy; 2026 ArkAgentic. ABN: 92 627 301 153</p>
        <p>11 Hassall Street, Parramatta NSW 2150</p>
      </div>
    </footer>
  );
}
