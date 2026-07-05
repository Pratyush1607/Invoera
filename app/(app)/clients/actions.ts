"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { getInitials, pickAvatarColor } from "@/lib/utils";
import { extractInvoiceAgent, validateInvoiceAgent, toErrorMessage } from "@/lib/gemini/pipeline";
import type { ExtractedInvoiceFields, ValidatedInvoiceFields, StageResult } from "@/lib/gemini/pipeline";
import { getDisplayContext } from "@/lib/currency";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { validateUploadFile } from "@/lib/file-validation";
import type { ClientStatus, InvoiceStatus } from "@/lib/types";

const MAX_NAME_LENGTH = 200;
const MAX_LOCATION_LENGTH = 200;
const MAX_NUMBER_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_AMOUNT = 999_999_999;

export interface ClientFormState {
  error?: string;
}

export async function createClientAction(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };
  if (!(await checkRateLimit(user.id, "createClient", 30, 60))) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const name = String(formData.get("name") ?? "").trim().slice(0, MAX_NAME_LENGTH);
  const location = String(formData.get("location") ?? "").trim().slice(0, MAX_LOCATION_LENGTH);
  const status = String(formData.get("status") ?? "active") as ClientStatus;

  if (!name) return { error: "Client name is required." };
  if (!location) return { error: "Location is required." };
  if (!["active", "pending", "overdue"].includes(status)) {
    return { error: "Select a valid status." };
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({
      user_id: user.id,
      name,
      location,
      initials: getInitials(name),
      color: pickAvatarColor(name),
      status,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Couldn't create client." };

  revalidatePath("/clients");
  redirect(`/clients/${data.id}`);
}

export interface InvoiceFormState {
  error?: string;
}

export async function createInvoiceAction(
  clientId: string,
  _prevState: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };
  if (!(await checkRateLimit(user.id, "createInvoice", 30, 60))) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const number = String(formData.get("number") ?? "").trim().slice(0, MAX_NUMBER_LENGTH);
  const description = String(formData.get("description") ?? "").trim().slice(0, MAX_DESCRIPTION_LENGTH);
  const date = String(formData.get("date") ?? "");
  const dueDate = String(formData.get("dueDate") ?? "");
  const amount = Number(formData.get("amount"));
  const currency = String(formData.get("currency") ?? "USD");
  const status = String(formData.get("status") ?? "pending") as InvoiceStatus;

  if (!number) return { error: "Invoice number is required." };
  if (!description) return { error: "Description is required." };
  if (!date) return { error: "Date is required." };
  if (!dueDate) return { error: "Due date is required." };
  if (dueDate < date) return { error: "Due date can't be before the invoice date." };
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return { error: "Enter a valid amount." };
  }
  if (!(SUPPORTED_CURRENCIES as readonly string[]).includes(currency)) {
    return { error: "Select a valid currency." };
  }
  if (!["pending", "paid"].includes(status)) {
    return { error: "Select a valid status." };
  }

  const { error: insertError } = await supabase.from("invoices").insert({
    user_id: user.id,
    client_id: clientId,
    number,
    description,
    date,
    due_date: dueDate,
    amount,
    currency,
    status,
  });

  if (insertError) return { error: insertError.message };

  await supabase
    .from("clients")
    .update({ last_sent_at: new Date().toISOString() })
    .eq("id", clientId)
    .eq("user_id", user.id);

  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/clients");
  revalidatePath("/dashboard");
  redirect(`/clients/${clientId}`);
}

export async function markInvoicePaidAction(
  invoiceId: string,
  clientId: string,
  _formData: FormData
): Promise<void> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  if (!(await checkRateLimit(user.id, "markInvoicePaid", 60, 60))) return;

  await supabase
    .from("invoices")
    .update({ status: "paid" })
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/clients");
  revalidatePath("/dashboard");
}

export async function deleteInvoiceAction(
  invoiceId: string,
  clientId: string,
  _formData: FormData
): Promise<void> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  if (!(await checkRateLimit(user.id, "deleteInvoice", 30, 60))) return;

  await supabase.from("invoices").delete().eq("id", invoiceId).eq("user_id", user.id);

  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/clients");
  revalidatePath("/dashboard");
}

export async function runExtractInvoiceStage(
  file: File
): Promise<StageResult<ExtractedInvoiceFields>> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You must be signed in." };
  if (!(await checkRateLimit(user.id, "extractInvoice", 15, 300))) {
    return { success: false, error: RATE_LIMIT_MESSAGE };
  }

  const validationError = validateUploadFile(file);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await extractInvoiceAgent(
      buffer.toString("base64"),
      file.type || "application/octet-stream"
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error, "Couldn't read that file.") };
  }
}

export async function runValidateInvoiceStage(
  fields: ExtractedInvoiceFields
): Promise<StageResult<ValidatedInvoiceFields>> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You must be signed in." };
  if (!(await checkRateLimit(user.id, "validateInvoice", 15, 300))) {
    return { success: false, error: RATE_LIMIT_MESSAGE };
  }

  try {
    const { displayCurrency } = await getDisplayContext();
    const data = await validateInvoiceAgent(fields, displayCurrency);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error, "Couldn't validate the extracted data.") };
  }
}
