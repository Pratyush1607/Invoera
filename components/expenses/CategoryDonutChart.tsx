import { Card } from "@/components/ui/Card";
import { RadialRatio } from "@/components/ui/RadialRatio";
import { CATEGORY_RAMP } from "@/lib/colors";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";
import type { ExpenseCategory } from "@/lib/types";

interface CategoryDonutChartProps {
  data: { category: ExpenseCategory; amount: number }[];
  displayCurrency: string;
}

export function CategoryDonutChart({ data, displayCurrency }: CategoryDonutChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.amount, 0);

  const segments = data.map((entry, index) => ({
    label: entry.category,
    value: entry.amount,
    color: CATEGORY_RAMP[index % CATEGORY_RAMP.length],
  }));

  return (
    <Card className="p-5">
      <h3 className="font-display font-bold text-text">Spending by Category</h3>
      <p className="text-sm text-muted">{formatCurrency(total, displayCurrency)} total</p>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        <RadialRatio
          segments={segments}
          centerValue={formatCompactCurrency(total, displayCurrency)}
          centerLabel="Total"
          size={152}
          strokeWidth={20}
        />
        <ul className="grid flex-1 grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {data.map((entry, index) => (
            <li key={entry.category} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_RAMP[index % CATEGORY_RAMP.length] }}
              />
              <span className="flex-1 truncate text-muted">{entry.category}</span>
              <span className="font-semibold text-text">
                {formatCurrency(entry.amount, displayCurrency)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
