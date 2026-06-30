// src/lib/stripe.ts
// Stripe server-side client — only import in server components / API routes

import Stripe from "stripe";

// Lazy initialization so build doesn't fail without env vars
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

// Convenience alias
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string, unknown>)[prop as string];
  },
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
export const STRIPE_PRICE_ID = process.env.STRIPE_INVOICE_EXTRACTOR_PRICE_ID ?? "";
export const STRIPE_TOPUP_PRICE_ID = process.env.STRIPE_AI_TOPUP_PRICE_ID ?? "";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.arkagentic.com";
