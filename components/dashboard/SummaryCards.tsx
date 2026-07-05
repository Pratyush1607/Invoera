import { StatTile } from "@/components/ui/StatTile";
import { formatCurrency } from "@/lib/utils";
import type { ClientTotals } from "@/lib/types";

export function SummaryCards({
  totals,
  invoiceCount,
  totalSpend,
}: {
  totals: ClientTotals;
  invoiceCount: number;
  totalSpend: number;
}) {
  const profitLoss = totals.total - totalSpend;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      <StatTile
        label="Total Invoiced"
        value={formatCurrency(totals.total)}
        sublabel={`${invoiceCount} invoices`}
      />
      <StatTile
        label="Paid"
        value={formatCurrency(totals.paid)}
        valueClassName="text-teal-600 dark:text-teal-400"
      />
      <StatTile
        label="Pending"
        value={formatCurrency(totals.pending)}
        valueClassName="text-amber-600 dark:text-amber-400"
      />
      <StatTile
        label="Overdue"
        value={formatCurrency(totals.overdue)}
        valueClassName="text-red-600 dark:text-red-400"
      />
      <StatTile label="Total Spend" value={formatCurrency(totalSpend)} />
      <StatTile
        label="Profit / Loss"
        value={formatCurrency(profitLoss)}
        valueClassName={
          profitLoss >= 0 ? "text-teal-600 dark:text-teal-400" : "text-red-600 dark:text-red-400"
        }
      />
    </div>
  );
}
