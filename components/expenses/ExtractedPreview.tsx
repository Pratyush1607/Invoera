"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import { inputClassNameSm as inputClassName } from "@/lib/ui-classes";
import type { ExpenseCategory } from "@/lib/types";

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

export interface ExtractedData {
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  category: ExpenseCategory;
}

export interface SaveResult {
  success: boolean;
  error?: string;
}

export function ExtractedPreview({
  data,
  fileName,
  issues = [],
  onConfirm,
  onDiscard,
}: {
  data: ExtractedData;
  fileName: string;
  issues?: string[];
  onConfirm: (data: ExtractedData) => Promise<SaveResult>;
  onDiscard: () => void;
}) {
  const [form, setForm] = useState(data);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await onConfirm(form);
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error ?? "Something went wrong. Try again.");
      }
    });
  }

  if (saved) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <p className="font-semibold text-text">Expense saved</p>
          <p className="mt-1 text-sm text-muted">
            {form.merchant} · {formatCurrency(form.amount, form.currency)} was added to{" "}
            {form.category}.
          </p>
        </div>
        <Button variant="secondary" onClick={onDiscard}>
          Upload another
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="font-display font-bold text-text">Review extracted details</h3>
      <p className="text-sm text-muted">From {fileName} — confirm before saving.</p>

      {issues.length > 0 && (
        <div className="mt-4 flex gap-2 rounded-xl bg-warning/15 p-3 text-sm text-warning">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">The AI pipeline flagged this for review</p>
            <ul className="mt-1 list-disc pl-4">
              {issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
          Merchant
          <input
            value={form.merchant}
            onChange={(event) => setForm({ ...form, merchant: event.target.value })}
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
          Amount
          <input
            type="number"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })}
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
          Currency
          <select
            value={form.currency}
            onChange={(event) => setForm({ ...form, currency: event.target.value })}
            className={inputClassName}
          >
            {SUPPORTED_CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
          Date
          <input
            type="date"
            value={form.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
          Category
          <select
            value={form.category}
            onChange={(event) =>
              setForm({ ...form, category: event.target.value as ExpenseCategory })
            }
            className={inputClassName}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onDiscard} disabled={isPending}>
          Discard
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : "Save expense"}
        </Button>
      </div>
    </Card>
  );
}
