import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface NotificationEmailPayload {
  notificationId: string;
  to: string;
  subject: string;
  body: string;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 500;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidPayload(value: unknown): value is NotificationEmailPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;
  return (
    typeof payload.notificationId === "string" &&
    UUID_PATTERN.test(payload.notificationId) &&
    typeof payload.to === "string" &&
    payload.to.length <= MAX_FIELD_LENGTH &&
    EMAIL_PATTERN.test(payload.to) &&
    typeof payload.subject === "string" &&
    payload.subject.length > 0 &&
    payload.subject.length <= MAX_FIELD_LENGTH &&
    typeof payload.body === "string" &&
    payload.body.length > 0 &&
    payload.body.length <= MAX_FIELD_LENGTH
  );
}

Deno.serve(async (req: Request) => {
  const expectedSecret = Deno.env.get("NOTIFICATION_WEBHOOK_SECRET");
  const providedSecret = req.headers.get("x-webhook-secret");

  if (!expectedSecret || !providedSecret || !timingSafeEqual(providedSecret, expectedSecret)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isValidPayload(payload)) {
    return new Response(JSON.stringify({ error: "Malformed or oversized payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY is not configured yet." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Invoera <onboarding@resend.dev>",
      to: [payload.to],
      subject: payload.subject,
      html: `<p>${escapeHtml(payload.body)}</p>`,
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    return new Response(JSON.stringify({ error: `Resend error: ${errorText}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  await supabase
    .from("notifications")
    .update({ emailed_at: new Date().toISOString() })
    .eq("id", payload.notificationId);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
