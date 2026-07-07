import { StatTile } from "@/components/ui/StatTile";
import { formatCurrency } from "@/lib/utils";
import type { ClientTotals } from "@/lib/types";

export function SummaryCards({
  totals,
  invoiceCount,
  totalSpend,
  displayCurrency,
}: {
  totals: ClientTotals;
  invoiceCount: number;
  totalSpend: number;
  displayCurrency: string;
}) {
  const profitLoss = totals.total - totalSpend;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      <StatTile
        label="Total Invoiced"
        value={formatCurrency(totals.total, displayCurrency)}
        sublabel={`${invoiceCount} invoices`}
        animateValue
        rawValue={totals.total}
        displayCurrency={displayCurrency}
      />
      <StatTile
        label="Paid"
        value={formatCurrency(totals.paid, displayCurrency)}
        valueClassName="text-accent"
        animateValue
        rawValue={totals.paid}
        displayCurrency={displayCurrency}
      />
      <StatTile
        label="Pending"
        value={formatCurrency(totals.pending, displayCurrency)}
        valueClassName="text-warning"
        animateValue
        rawValue={totals.pending}
        displayCurrency={displayCurrency}
      />
      <StatTile
        label="Overdue"
        value={formatCurrency(totals.overdue, displayCurrency)}
        valueClassName="text-danger"
        animateValue
        rawValue={totals.overdue}
        displayCurrency={displayCurrency}
      />
      <StatTile
        label="Total Spend"
        value={formatCurrency(totalSpend, displayCurrency)}
        animateValue
        rawValue={totalSpend}
        displayCurrency={displayCurrency}
      />
      <StatTile
        label="Profit / Loss"
        value={formatCurrency(profitLoss, displayCurrency)}
        valueClassName={profitLoss >= 0 ? "text-accent" : "text-danger"}
        animateValue
        rawValue={profitLoss}
        displayCurrency={displayCurrency}
      />
    </div>
  );
}
