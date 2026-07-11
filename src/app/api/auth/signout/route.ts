// GET /api/auth/signout
// Called by app.arkagentic.com after clearing its own session cookie.
// Clears the Supabase browser auth cookie and redirects to /signin.

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.arkagentic.com";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  // Derive project ref from supabase URL: https://<ref>.supabase.co
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? "";

  const response = NextResponse.redirect(`${appUrl}/signin`, { status: 302 });

  // Clear all Supabase auth cookies for this project
  const cookieNames = projectRef
    ? [
        `sb-${projectRef}-auth-token`,
        `sb-${projectRef}-auth-token-code-verifier`,
      ]
    : [];

  for (const name of cookieNames) {
    response.cookies.set(name, "", {
      maxAge: 0,
      path: "/",
      domain: ".arkagentic.com",
      sameSite: "lax",
      secure: true,
    });
    response.cookies.set(name, "", {
      maxAge: 0,
      path: "/",
      sameSite: "lax",
      secure: true,
    });
  }

  return response;
}

// Also support POST (called from fetch before redirect)
export async function POST(request: NextRequest) {
  return GET(request);
}
