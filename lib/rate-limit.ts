import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = headersList.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export async function checkRateLimit(
  identifier: string,
  actionKey: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_identifier: identifier,
    p_action_key: actionKey,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error(`Rate limit check failed for ${actionKey}:`, error.message);
    return true; // fail open: an infra hiccup in the rate limiter shouldn't block real users
  }

  return data === true;
}

export const RATE_LIMIT_MESSAGE = "Too many requests. Please slow down and try again shortly.";
