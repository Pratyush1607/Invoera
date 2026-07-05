"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn, formatCompactCurrency, formatCurrency } from "@/lib/utils";

type SpendView = "Monthly" | "Annual";

interface SpendChartProps {
  monthlyData: { key: string; label: string; amount: number }[];
  annualData: { key: string; label: string; amount: number }[];
  displayCurrency: string;
}

interface TooltipPayloadEntry {
  value: number;
}

function SpendTooltip({
  active,
  payload,
  label,
  displayCurrency,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  displayCurrency: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg ring-1 ring-white/10">
      <p className="font-semibold">{formatCurrency(payload[0].value, displayCurrency)}</p>
      <p className="text-gray-300">{label}</p>
    </div>
  );
}

export function SpendChart({ monthlyData, annualData, displayCurrency }: SpendChartProps) {
  const [view, setView] = useState<SpendView>("Monthly");
  const { theme } = useTheme();

  const data = view === "Monthly" ? monthlyData : annualData;
  const total = data.reduce((sum, entry) => sum + entry.amount, 0);

  const gridStroke = theme === "dark" ? "#27272a" : "#e5e7eb";
  const tickColor = theme === "dark" ? "#71717a" : "#9ca3af";
  const cursorFill = theme === "dark" ? "#27272a" : "#f3f4f6";

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">Spending</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {formatCurrency(total, displayCurrency)} over {data.length}{" "}
            {view === "Monthly" ? "months" : "years"}
          </p>
        </div>
        <div className="flex gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800">
          {(["Monthly", "Annual"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                view === option
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              {option}
            </button>
          ))}
        </div>
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
              tickFormatter={(value: number) => formatCompactCurrency(value, displayCurrency)}
            />
            <Tooltip
              content={<SpendTooltip displayCurrency={displayCurrency} />}
              cursor={{ fill: cursorFill }}
            />
            <Bar dataKey="amount" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
