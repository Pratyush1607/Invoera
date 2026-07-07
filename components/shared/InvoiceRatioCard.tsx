import { Card } from "@/components/ui/Card";
import { RatioBar } from "@/components/ui/RatioBar";
import { STATUS_HEX, STATUS_LABEL } from "@/lib/colors";
import { formatCurrency } from "@/lib/utils";
import type { ClientTotals } from "@/lib/types";

export function InvoiceRatioCard({
  totals,
  displayCurrency,
  title = "Invoice Ratio",
}: {
  totals: ClientTotals;
  displayCurrency: string;
  title?: string;
}) {
  const segments = [
    { label: STATUS_LABEL.paid, value: totals.paid, color: STATUS_HEX.paid },
    { label: STATUS_LABEL.pending, value: totals.pending, color: STATUS_HEX.pending },
    { label: STATUS_LABEL.overdue, value: totals.overdue, color: STATUS_HEX.overdue },
  ];

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display font-bold text-text">{title}</h3>
        <p className="text-sm text-muted">
          Total:{" "}
          <span className="font-semibold text-text">
            {formatCurrency(totals.total, displayCurrency)}
          </span>
        </p>
      </div>
      <div className="mt-4">
        <RatioBar segments={segments} />
      </div>
    </Card>
  );
}
