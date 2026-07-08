import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { ExpenseCategory } from "@/lib/types";

export function SpendTile({
  totalSpend,
  displayCurrency,
}: {
  totalSpend: number;
  displayCurrency: string;
}) {
  return (
    <Card className="p-4.5">
      <p className="mb-1.5 text-[11px] font-bold tracking-wide text-muted uppercase">Total Spend</p>
      <p className="font-display text-[22px] font-extrabold text-text">
        {formatCurrency(totalSpend, displayCurrency)}
      </p>
    </Card>
  );
}

export function SpendBudgetCard({
  budgetUsedPct,
  topCategories,
  displayCurrency,
}: {
  budgetUsedPct: number;
  topCategories: { category: ExpenseCategory; amount: number }[];
  displayCurrency: string;
}) {
  return (
    <Card className="flex-1 p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-[11px] font-bold tracking-wide text-muted uppercase">Budget Used</p>
        <span className="text-[11px] font-bold text-text">{budgetUsedPct}%</span>
      </div>
      <div className="mb-3.5 h-2 overflow-hidden rounded-full bg-input-bg">
        <div className="h-full rounded-full bg-accent-gradient" style={{ width: `${budgetUsedPct}%` }} />
      </div>
      {topCategories.length === 0 ? (
        <p className="text-xs text-muted">No expenses on file yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {topCategories.map((cat) => (
            <div key={cat.category} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="min-w-0 flex-1 truncate text-xs text-muted">{cat.category}</span>
              <span className="shrink-0 text-xs font-bold text-text">
                {formatCurrency(cat.amount, displayCurrency)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
