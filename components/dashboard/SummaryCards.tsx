import { StatTile } from "@/components/ui/StatTile";
import { formatCurrency } from "@/lib/utils";
import type { ClientTotals } from "@/lib/types";

export function SummaryCards({
  totals,
  invoiceCount,
}: {
  totals: ClientTotals;
  invoiceCount: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
    </div>
  );
}
