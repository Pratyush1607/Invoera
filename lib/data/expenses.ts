import { createClient } from "@/lib/supabase/server";
import type { Expense, ExpenseCategory, ExpenseStatus } from "@/lib/types";

interface ExpenseRow {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  status: string;
}

function mapExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    merchant: row.merchant,
    category: row.category as ExpenseCategory,
    date: row.date,
    amount: Number(row.amount),
    status: row.status as ExpenseStatus,
  };
}

export async function getExpenses(): Promise<Expense[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("expenses")
    .select("id, merchant, category, date, amount, status")
    .eq("user_id", user.id)
    .order("date", { ascending: true })
    .returns<ExpenseRow[]>();

  if (error || !data) return [];
  return data.map(mapExpense);
}
