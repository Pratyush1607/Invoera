"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/components/theme/ThemeProvider";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";

interface MonthlyBarChartProps {
  data: { month: string; amount: number }[];
}

interface TooltipPayloadEntry {
  value: number;
}

function MonthlyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg ring-1 ring-white/10">
      <p className="font-semibold">{formatCurrency(payload[0].value)}</p>
      <p className="text-gray-300">{label}</p>
    </div>
  );
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const { theme } = useTheme();
  const total = data.reduce((sum, entry) => sum + entry.amount, 0);

  const gridStroke = theme === "dark" ? "#27272a" : "#e5e7eb";
  const tickColor = theme === "dark" ? "#71717a" : "#9ca3af";
  const cursorFill = theme === "dark" ? "#27272a" : "#f3f4f6";

  return (
    <Card className="p-5">
      <h3 className="font-bold text-gray-900 dark:text-gray-100">Monthly Spending</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500">
        {formatCurrency(total)} over {data.length} months
      </p>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke={gridStroke} strokeDasharray="0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
              width={40}
              tickFormatter={(value: number) => formatCompactCurrency(value)}
            />
            <Tooltip content={<MonthlyTooltip />} cursor={{ fill: cursorFill }} />
            <Bar dataKey="amount" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
