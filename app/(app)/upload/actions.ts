"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ExpenseCategory } from "@/lib/types";

export interface SaveExpenseInput {
  file: File;
  merchant: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
}

export interface SaveExpenseResult {
  success: boolean;
  error?: string;
}

export async function saveExpense(input: SaveExpenseInput): Promise<SaveExpenseResult> {
  const supabase = await createClient();
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
    status: "processed",
    receipt_path: path,
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");

  return { success: true };
}
