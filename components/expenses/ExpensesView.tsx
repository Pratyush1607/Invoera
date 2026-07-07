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
  const displayCurrency = expenses[0]?.displayCurrency ?? "USD";

  return (
    <div className="flex flex-col gap-5">
      <div className="animate-rise flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-text">Expenses</h1>
          <p className="truncate text-sm text-muted">
            {expenses.length} expenses on file · {formatCurrency(total, displayCurrency)} total
          </p>
        </div>
        <Link href="/expenses/new" className="shrink-0">
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </Link>
      </div>

      <div className="animate-rise relative" style={{ animationDelay: "0.05s" }}>
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search by merchant or category..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-full border border-border bg-surface py-2.5 pr-4 pl-11 text-sm text-text outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <Card className="animate-rise p-5" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col divide-y divide-border">
          {sorted.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-text">{expense.merchant}</p>
                <p className="text-sm text-muted">
                  {expense.category} · {formatDate(expense.date)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <p className="font-semibold text-text">
                  {formatCurrency(expense.amount, expense.currency)}
                </p>
                {expense.currency !== expense.displayCurrency && (
                  <p className="text-xs text-muted">
                    ≈{formatCurrency(expense.displayAmount, expense.displayCurrency)}
                  </p>
                )}
                <StatusBadge status={expense.status} />
                {expense.status === "needs review" && (
                  <form action={markExpenseProcessedAction.bind(null, expense.id)}>
                    <button type="submit" className="text-xs font-semibold text-accent hover:opacity-80">
                      Mark as Processed
                    </button>
                  </form>
                )}
                <form action={deleteExpenseAction.bind(null, expense.id)}>
                  <ConfirmSubmitButton
                    confirmMessage={`Delete this expense from ${expense.merchant}? This can't be undone.`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-danger hover:opacity-80"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <p className="py-12 text-center text-sm text-muted">No expenses match your search.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
