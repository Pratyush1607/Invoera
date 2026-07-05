"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function markNotificationReadAction(notificationId: string): Promise<void> {
  if (!UUID_PATTERN.test(notificationId)) return;

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  if (!(await checkRateLimit(user.id, "markNotificationRead", 120, 60))) return;

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", user.id)
    .is("read_at", null);

  revalidatePath("/", "layout");
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  if (!(await checkRateLimit(user.id, "markAllNotificationsRead", 30, 60))) return;

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null);

  revalidatePath("/", "layout");
}
