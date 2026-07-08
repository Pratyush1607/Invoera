import { Card } from "@/components/ui/Card";
import { LineChart, type LineChartPoint } from "@/components/dashboard/LineChart";
import { formatCurrency } from "@/lib/utils";

export function InvoicedTrendCard({
  totalInvoiced,
  trendPct,
  points,
  smoothPath,
  areaPath,
  displayCurrency,
}: {
  totalInvoiced: number;
  trendPct: number;
  points: LineChartPoint[];
  smoothPath: string;
  areaPath: string;
  displayCurrency: string;
}) {
  const sign = trendPct >= 0 ? "+" : "";

  return (
    <Card className="p-4.5">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-[11px] font-bold tracking-wide text-muted uppercase">Total Invoiced</p>
        <span className="text-[11px] font-bold text-accent">
          {sign}
          {trendPct}%
        </span>
      </div>
      <p className="mb-3.5 font-display text-2xl font-extrabold text-text">
        {formatCurrency(totalInvoiced, displayCurrency)}
      </p>
      <LineChart
        className="flex h-17 flex-col"
        points={points}
        smoothPath={smoothPath}
        areaPath={areaPath}
        color="var(--accent)"
      />
    </Card>
  );
}
