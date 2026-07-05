"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { getInitials, pickAvatarColor } from "@/lib/utils";
import { extractInvoiceAgent, validateInvoiceAgent, toErrorMessage } from "@/lib/gemini/pipeline";
import type { ExtractedInvoiceFields, ValidatedInvoiceFields, StageResult } from "@/lib/gemini/pipeline";
import type { ClientStatus, InvoiceStatus } from "@/lib/types";

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

  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const status = String(formData.get("status") ?? "active") as ClientStatus;

  if (!name) return { error: "Client name is required." };
  if (!location) return { error: "Location is required." };

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

  const number = String(formData.get("number") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const dueDate = String(formData.get("dueDate") ?? "");
  const amount = Number(formData.get("amount"));
  const status = String(formData.get("status") ?? "pending") as InvoiceStatus;

  if (!number) return { error: "Invoice number is required." };
  if (!description) return { error: "Description is required." };
  if (!date) return { error: "Date is required." };
  if (!dueDate) return { error: "Due date is required." };
  if (dueDate < date) return { error: "Due date can't be before the invoice date." };
  if (!Number.isFinite(amount) || amount <= 0) return { error: "Enter a valid amount." };

  const { error: insertError } = await supabase.from("invoices").insert({
    user_id: user.id,
    client_id: clientId,
    number,
    description,
    date,
    due_date: dueDate,
    amount,
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

  await supabase.from("invoices").delete().eq("id", invoiceId).eq("user_id", user.id);

  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/clients");
  revalidatePath("/dashboard");
}

export async function runExtractInvoiceStage(
  file: File
): Promise<StageResult<ExtractedInvoiceFields>> {
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
  try {
    const data = await validateInvoiceAgent(fields);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error, "Couldn't validate the extracted data.") };
  }
}
