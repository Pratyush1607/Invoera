import { Card } from "@/components/ui/Card";
import { RadialRatio } from "@/components/ui/RadialRatio";
import { STATUS_HEX, STATUS_LABEL } from "@/lib/colors";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";
import type { ClientTotals } from "@/lib/types";

export function RevenueGauge({
  totals,
  displayCurrency,
}: {
  totals: ClientTotals;
  displayCurrency: string;
}) {
  const segments = [
    {
      label: STATUS_LABEL.paid,
      value: totals.paid,
      color: STATUS_HEX.paid,
      displayValue: formatCurrency(totals.paid, displayCurrency),
    },
    {
      label: STATUS_LABEL.pending,
      value: totals.pending,
      color: STATUS_HEX.pending,
      displayValue: formatCurrency(totals.pending, displayCurrency),
    },
    {
      label: STATUS_LABEL.overdue,
      value: totals.overdue,
      color: STATUS_HEX.overdue,
      displayValue: formatCurrency(totals.overdue, displayCurrency),
    },
  ];

  return (
    <Card className="p-5">
      <RadialRatio
        segments={segments}
        centerValue={formatCompactCurrency(totals.total, displayCurrency)}
        centerLabel="Total Revenue"
        size={128}
        strokeWidth={14}
        legendPosition="beside"
      />
    </Card>
  );
}
