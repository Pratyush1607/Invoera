import { RadialRatio } from "@/components/ui/RadialRatio";
import { STATUS_HEX, STATUS_LABEL } from "@/lib/colors";
import { formatCompactCurrency } from "@/lib/utils";
import type { ClientTotals } from "@/lib/types";

export function RevenueGauge({ totals }: { totals: ClientTotals }) {
  const segments = [
    { label: STATUS_LABEL.paid, value: totals.paid, color: STATUS_HEX.paid },
    { label: STATUS_LABEL.pending, value: totals.pending, color: STATUS_HEX.pending },
    { label: STATUS_LABEL.overdue, value: totals.overdue, color: STATUS_HEX.overdue },
  ];

  return (
    <div className="flex flex-col items-center">
      <RadialRatio
        segments={segments}
        centerValue={formatCompactCurrency(totals.total)}
        centerLabel="Total Revenue"
      />
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
            {seg.label}
          </div>
        ))}
      </div>
    </div>
  );
}
