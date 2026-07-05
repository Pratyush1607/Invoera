"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmSubmitButton } from "@/components/shared/ConfirmSubmitButton";
import { deleteExpenseAction, markExpenseProcessedAction } from "@/app/(app)/expenses/actions";
import { getTotalExpenses } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense } from "@/lib/types";

export function ExpensesView({ expenses }: { expenses: Expense[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return expenses;
    return expenses.filter(
      (expense) =>
        expense.merchant.toLowerCase().includes(normalizedQuery) ||
        expense.category.toLowerCase().includes(normalizedQuery)
    );
  }, [expenses, query]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [filtered]
  );

  const total = getTotalExpenses(expenses);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Expenses</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {expenses.length} expenses on file · {formatCurrency(total)} total
          </p>
        </div>
        <Link href="/expenses/new">
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search by merchant or category..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-full border border-gray-200 bg-white py-2.5 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-teal-500/20"
        />
      </div>

      <Card className="p-5">
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {sorted.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900 dark:text-gray-100">
                  {expense.merchant}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {expense.category} · {formatDate(expense.date)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(expense.amount)}
                </p>
                <StatusBadge status={expense.status} />
                {expense.status === "needs review" && (
                  <form action={markExpenseProcessedAction.bind(null, expense.id)}>
                    <button
                      type="submit"
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                      Mark as Processed
                    </button>
                  </form>
                )}
                <form action={deleteExpenseAction.bind(null, expense.id)}>
                  <ConfirmSubmitButton
                    confirmMessage={`Delete this expense from ${expense.merchant}? This can't be undone.`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <p className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
              No expenses match your search.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
