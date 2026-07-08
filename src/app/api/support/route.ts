// POST /api/support
// Saves support request to Supabase AND sends notification email via Resend.

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { Resend } from "resend";

const SUPPORT_TO = "support@arkagentic.com";
const SUPPORT_FROM = "ArkAgentic Support <support@arkagentic.com>";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, topic, message } = body as {
      name?: string;
      email?: string;
      topic?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // ── 1. Save to Supabase ───────────────────────────────────────────────────
    const supabase = getSupabaseAdmin();
    const { error: dbError } = await supabase.from("support_requests").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      topic: topic?.trim() || null,
      message: message.trim(),
    });

    if (dbError) {
      console.error("[support] Supabase insert error:", dbError.message);
      // Don't block email send on DB error
    }

    // ── 2. Send notification email via Resend ─────────────────────────────────
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const topicLine = topic?.trim() ? `<p><strong>Topic:</strong> ${topic.trim()}</p>` : "";
      const { error: emailError } = await resend.emails.send({
        from: SUPPORT_FROM,
        to: SUPPORT_TO,
        replyTo: email.trim(),
        subject: `[Support] ${topic?.trim() || "General enquiry"} — from ${name.trim()}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="margin:0 0 16px">New support request</h2>
            <p><strong>Name:</strong> ${name.trim()}</p>
            <p><strong>Email:</strong> <a href="mailto:${email.trim()}">${email.trim()}</a></p>
            ${topicLine}
            <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb"/>
            <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:8px">${message.trim()}</p>
            <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb"/>
            <p style="color:#6b7280;font-size:12px">Reply directly to this email to respond to ${name.trim()}.</p>
          </div>
        `,
      });
      if (emailError) {
        console.error("[support] Resend error:", emailError);
        // Email failed but request was saved — still return success
      }
    } else {
      console.warn("[support] RESEND_API_KEY not set — email notification skipped");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[support] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
