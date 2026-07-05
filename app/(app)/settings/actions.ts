"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_DISPLAY_NAME_LENGTH = 100;

export async function updateNotificationPrefsAction(formData: FormData): Promise<void> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  if (!(await checkRateLimit(user.id, "updateNotificationPrefs", 30, 60))) return;

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

export interface ProfileFormState {
  error?: string;
  message?: string;
}

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };
  if (!(await checkRateLimit(user.id, "updateProfile", 10, 60))) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const displayName = String(formData.get("displayName") ?? "").trim().slice(0, MAX_DISPLAY_NAME_LENGTH);
  const email = String(formData.get("email") ?? "").trim();

  if (!displayName) return { error: "Display name is required." };
  if (!email) return { error: "Email is required." };
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  let message = "Profile updated.";
  if (email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email });
    if (emailError) return { error: emailError.message };
    message = "Display name updated. Check your new email address to confirm the change.";
  }

  revalidatePath("/", "layout");
  return { message };
}

export async function updateDisplayCurrencyAction(formData: FormData): Promise<void> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  if (!(await checkRateLimit(user.id, "updateDisplayCurrency", 30, 60))) return;

  const displayCurrency = String(formData.get("display_currency") ?? "USD");
  if (!(SUPPORTED_CURRENCIES as readonly string[]).includes(displayCurrency)) return;

  await supabase.from("profiles").update({ display_currency: displayCurrency }).eq("id", user.id);

  revalidatePath("/", "layout");
}
