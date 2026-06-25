import type { NextConfig } from "next";

/**
 * Amplify Gen 1 Hosting: environment variables are available in the CodeBuild
 * build container but are NOT automatically injected into the Lambda runtime
 * that serves SSR / API routes. To make server-side secrets available at
 * runtime, we bake them into the server bundle here via next.config `env`.
 *
 * These values are only embedded in the *server-side* bundle (API routes /
 * Server Components). They are never sent to the browser because no client
 * component imports from server-only modules that reference them.
 *
 * For local development, values come from .env.local as usual.
 */
const nextConfig: NextConfig = {
  env: {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    STRIPE_INVOICE_EXTRACTOR_PRICE_ID: process.env.STRIPE_INVOICE_EXTRACTOR_PRICE_ID ?? "",
  },
};

export default nextConfig;
