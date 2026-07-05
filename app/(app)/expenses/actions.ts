"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { extractAgent, validateAgent, categorizeAgent, toErrorMessage } from "@/lib/gemini/pipeline";
import type { ExtractedFields, ValidatedFields, StageResult } from "@/lib/gemini/pipeline";
import { getDisplayContext } from "@/lib/currency";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { validateUploadFile } from "@/lib/file-validation";
import type { ExpenseCategory, ExpenseStatus } from "@/lib/types";

const MAX_MERCHANT_LENGTH = 200;
const MAX_AMOUNT = 999_999_999;
const CATEGORIES: ExpenseCategory[] = [
  "Software",
  "Travel",
  "Office Supplies",
  "Meals & Entertainment",
  "Marketing",
  "Professional Services",
  "Utilities",
  "Equipment",
];

function sanitizeFilename(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
  return base || "receipt";
}

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
  if (!(await checkRateLimit(user.id, "createExpense", 30, 60))) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const merchant = String(formData.get("merchant") ?? "").trim().slice(0, MAX_MERCHANT_LENGTH);
  const category = String(formData.get("category") ?? "") as ExpenseCategory;
  const date = String(formData.get("date") ?? "");
  const amount = Number(formData.get("amount"));
  const currency = String(formData.get("currency") ?? "USD");
  const status = String(formData.get("status") ?? "processed") as ExpenseStatus;

  if (!merchant) return { error: "Merchant is required." };
  if (!date) return { error: "Date is required." };
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return { error: "Enter a valid amount." };
  }
  if (!(SUPPORTED_CURRENCIES as readonly string[]).includes(currency)) {
    return { error: "Select a valid currency." };
  }
  if (!CATEGORIES.includes(category)) {
    return { error: "Select a valid category." };
  }
  if (!["processed", "needs review"].includes(status)) {
    return { error: "Select a valid status." };
  }

  const { error: insertError } = await supabase.from("expenses").insert({
    user_id: user.id,
    merchant,
    category,
    date,
    amount,
    currency,
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
  currency: string;
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
  if (!(await checkRateLimit(user.id, "saveExpense", 30, 60))) {
    return { success: false, error: RATE_LIMIT_MESSAGE };
  }

  const validationError = validateUploadFile(input.file);
  if (validationError) {
    return { success: false, error: validationError };
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0 || input.amount > MAX_AMOUNT) {
    return { success: false, error: "Enter a valid amount." };
  }
  if (!(SUPPORTED_CURRENCIES as readonly string[]).includes(input.currency)) {
    return { success: false, error: "Select a valid currency." };
  }

  const path = `${user.id}/${crypto.randomUUID()}-${sanitizeFilename(input.file.name)}`;
  const { error: uploadError } = await supabase.storage.from("receipts").upload(path, input.file);

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { error: insertError } = await supabase.from("expenses").insert({
    user_id: user.id,
    merchant: input.merchant.slice(0, MAX_MERCHANT_LENGTH),
    category: input.category,
    date: input.date,
    amount: input.amount,
    currency: input.currency,
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
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You must be signed in." };
  if (!(await checkRateLimit(user.id, "extractExpense", 15, 300))) {
    return { success: false, error: RATE_LIMIT_MESSAGE };
  }

  const validationError = validateUploadFile(file);
  if (validationError) {
    return { success: false, error: validationError };
  }

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
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You must be signed in." };
  if (!(await checkRateLimit(user.id, "validateExpense", 15, 300))) {
    return { success: false, error: RATE_LIMIT_MESSAGE };
  }

  try {
    const { displayCurrency } = await getDisplayContext();
    const data = await validateAgent(fields, displayCurrency);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error, "Couldn't validate the extracted data.") };
  }
}

export async function runCategorizeStage(
  fields: ValidatedFields
): Promise<StageResult<{ category: ExpenseCategory }>> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You must be signed in." };
  if (!(await checkRateLimit(user.id, "categorizeExpense", 15, 300))) {
    return { success: false, error: RATE_LIMIT_MESSAGE };
  }

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
  if (!(await checkRateLimit(user.id, "markExpenseProcessed", 60, 60))) return;

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
  if (!(await checkRateLimit(user.id, "deleteExpense", 30, 60))) return;

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
