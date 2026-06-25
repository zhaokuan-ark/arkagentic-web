import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    SUPABASE_URL_SET: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SERVICE_KEY_SET: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SERVICE_KEY_PREFIX: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10) ?? "MISSING",
    STRIPE_KEY_SET: !!process.env.STRIPE_SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });
}
