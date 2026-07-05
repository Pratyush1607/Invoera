"use client";

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/components/theme/ThemeProvider";
import { STATUS_HEX } from "@/lib/colors";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";

interface ProfitLossChartProps {
  data: { key: string; label: string; profit: number }[];
}

interface TooltipPayloadEntry {
  value: number;
}

function ProfitLossTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg ring-1 ring-white/10">
      <p className="font-semibold">
        {value >= 0 ? "+" : "-"}
        {formatCurrency(Math.abs(value))}
      </p>
      <p className="text-gray-300">{label}</p>
    </div>
  );
}

export function ProfitLossChart({ data }: ProfitLossChartProps) {
  const { theme } = useTheme();
  const net = data.reduce((sum, entry) => sum + entry.profit, 0);

  const gridStroke = theme === "dark" ? "#27272a" : "#e5e7eb";
  const tickColor = theme === "dark" ? "#71717a" : "#9ca3af";
  const cursorFill = theme === "dark" ? "#27272a" : "#f3f4f6";

  return (
    <Card className="p-5">
      <h3 className="font-bold text-gray-900 dark:text-gray-100">Profit / Loss by Month</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500">
        Net {formatCurrency(net)} over {data.length} months
      </p>
      <div className="mt-2 flex gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: STATUS_HEX.paid }}
          />
          Profit
        </span>
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: STATUS_HEX.overdue }}
          />
          Loss
        </span>
      </div>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke={gridStroke} strokeDasharray="0" />
            <XAxis
              dataKey="label"
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
            <ReferenceLine y={0} stroke={gridStroke} />
            <Tooltip content={<ProfitLossTooltip />} cursor={{ fill: cursorFill }} />
            <Bar dataKey="profit" radius={[6, 6, 6, 6]} maxBarSize={24}>
              {data.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={entry.profit >= 0 ? STATUS_HEX.paid : STATUS_HEX.overdue}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
