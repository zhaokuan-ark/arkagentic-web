// Temporary debug endpoint — remove after diagnosis
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "set(" + process.env.STRIPE_SECRET_KEY.substring(0,8) + "...)" : "MISSING",
    STRIPE_AI_TOPUP_PRICE_ID: process.env.STRIPE_AI_TOPUP_PRICE_ID || "MISSING",
    STRIPE_INVOICE_EXTRACTOR_PRICE_ID: process.env.STRIPE_INVOICE_EXTRACTOR_PRICE_ID || "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  });
}
