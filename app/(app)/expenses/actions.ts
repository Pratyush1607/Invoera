"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { extractAgent, validateAgent, categorizeAgent, toErrorMessage } from "@/lib/gemini/pipeline";
import type { ExtractedFields, ValidatedFields, StageResult } from "@/lib/gemini/pipeline";
import type { ExpenseCategory, ExpenseStatus } from "@/lib/types";

export interface ExpenseFormState {
  error?: string;
}

export async function createExpenseAction(
  _prevState: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const merchant = String(formData.get("merchant") ?? "").trim();
  const category = String(formData.get("category") ?? "") as ExpenseCategory;
  const date = String(formData.get("date") ?? "");
  const amount = Number(formData.get("amount"));
  const status = String(formData.get("status") ?? "processed") as ExpenseStatus;

  if (!merchant) return { error: "Merchant is required." };
  if (!date) return { error: "Date is required." };
  if (!Number.isFinite(amount) || amount <= 0) return { error: "Enter a valid amount." };

  const { error: insertError } = await supabase.from("expenses").insert({
    user_id: user.id,
    merchant,
    category,
    date,
    amount,
    status,
  });

  if (insertError) return { error: insertError.message };

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  revalidatePath("/expenses");
  redirect("/expenses");
}

export interface SaveExpenseInput {
  file: File;
  merchant: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  status?: ExpenseStatus;
}

export interface SaveExpenseResult {
  success: boolean;
  error?: string;
}

export async function saveExpense(input: SaveExpenseInput): Promise<SaveExpenseResult> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in to save an expense." };
  }

  const path = `${user.id}/${crypto.randomUUID()}-${input.file.name}`;
  const { error: uploadError } = await supabase.storage.from("receipts").upload(path, input.file);

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { error: insertError } = await supabase.from("expenses").insert({
    user_id: user.id,
    merchant: input.merchant,
    category: input.category,
    date: input.date,
    amount: input.amount,
    status: input.status ?? "processed",
    receipt_path: path,
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  revalidatePath("/expenses");

  return { success: true };
}

export async function runExtractStage(file: File): Promise<StageResult<ExtractedFields>> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await extractAgent(buffer.toString("base64"), file.type || "application/octet-stream");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error, "Couldn't read that file.") };
  }
}

export async function runValidateStage(
  fields: ExtractedFields
): Promise<StageResult<ValidatedFields>> {
  try {
    const data = await validateAgent(fields);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error, "Couldn't validate the extracted data.") };
  }
}

export async function runCategorizeStage(
  fields: ValidatedFields
): Promise<StageResult<{ category: ExpenseCategory }>> {
  try {
    const category = await categorizeAgent(fields);
    return { success: true, data: { category } };
  } catch (error) {
    return { success: false, error: toErrorMessage(error, "Couldn't categorize the expense.") };
  }
}

export async function markExpenseProcessedAction(
  expenseId: string,
  _formData: FormData
): Promise<void> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("expenses")
    .update({ status: "processed" })
    .eq("id", expenseId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  revalidatePath("/settings");
}

export async function deleteExpenseAction(expenseId: string, _formData: FormData): Promise<void> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: expense } = await supabase
    .from("expenses")
    .select("receipt_path")
    .eq("id", expenseId)
    .eq("user_id", user.id)
    .maybeSingle();

  await supabase.from("expenses").delete().eq("id", expenseId).eq("user_id", user.id);

  if (expense?.receipt_path) {
    await supabase.storage.from("receipts").remove([expense.receipt_path]);
  }

  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  revalidatePath("/settings");
}
