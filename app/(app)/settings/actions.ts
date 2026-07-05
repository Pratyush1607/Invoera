"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";

export async function updateNotificationPrefsAction(formData: FormData): Promise<void> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({
      notify_invoice_overdue: formData.get("notify_invoice_overdue") === "on",
      notify_expense_processed: formData.get("notify_expense_processed") === "on",
      notify_weekly_summary: formData.get("notify_weekly_summary") === "on",
    })
    .eq("id", user.id);

  revalidatePath("/settings");
}
