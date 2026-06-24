import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { NavBar } from "@/components/nav-bar";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";
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
              <SiteFooter />
            </div>
          </LanguageProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}


