// POST /api/admin/grant-quota
// Admin-only endpoint to grant AI quota credits to any user by email.
// Protected by the ADMIN_GRANT_SECRET environment variable.
//
// Usage:
//   curl -X POST https://www.arkagentic.com/api/admin/grant-quota \
//     -H "Authorization: Bearer <ADMIN_GRANT_SECRET>" \
//     -H "Content-Type: application/json" \
//     -d '{"email": "you@example.com", "credits": 10000}'

import { NextRequest, NextResponse } from "next/server";
import { addTopupQuota } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  // Verify admin secret
  const secret = process.env.ADMIN_GRANT_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Admin grant endpoint is not configured (ADMIN_GRANT_SECRET missing)" }, { status: 503 });
  }
  const authHeader = request.headers.get("authorization") ?? "";
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Parse body
  let body: { email?: unknown; credits?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, credits } = body;
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  if (!credits || typeof credits !== "number" || credits <= 0 || credits > 1_000_000) {
    return NextResponse.json({ error: "credits must be a positive number ≤ 1,000,000" }, { status: 400 });
  }

  // Look up user by email via Supabase Admin REST API (direct fetch — avoids full listUsers scan)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const usersRes = await fetch(
    `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(normalizedEmail)}&page=1&per_page=1`,
    {
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
    }
  );
  if (!usersRes.ok) {
    const msg = await usersRes.text().catch(() => "unknown");
    console.error("[admin/grant-quota] Supabase user lookup failed:", usersRes.status, msg);
    return NextResponse.json({ error: "Failed to look up user" }, { status: 500 });
  }

  const usersData = await usersRes.json();
  const user = (usersData.users ?? []).find(
    (u: { email?: string; id?: string }) => u.email?.toLowerCase() === normalizedEmail
  );
  if (!user?.id) {
    return NextResponse.json({ error: `No user found with email: ${email}` }, { status: 404 });
  }

  // Grant quota — idempotent key includes timestamp so repeated grants are distinct
  const grantId = `admin_grant_${Date.now()}`;
  await addTopupQuota(user.id as string, credits, grantId, 0);

  console.log(`[admin/grant-quota] Granted ${credits} credits to ${normalizedEmail} (userId=${user.id}, grantId=${grantId})`);
  return NextResponse.json({ success: true, userId: user.id, email: normalizedEmail, credits, grantId });
}
