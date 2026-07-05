"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { CATEGORY_HEX } from "@/lib/colors";
import { formatCurrency } from "@/lib/utils";
import type { ExpenseCategory } from "@/lib/types";

interface CategoryDonutChartProps {
  data: { category: ExpenseCategory; amount: number }[];
}

interface TooltipPayloadEntry {
  value: number;
  name: string;
}

function CategoryTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg ring-1 ring-white/10">
      <p className="font-semibold">{formatCurrency(entry.value)}</p>
      <p className="text-gray-300">{entry.name}</p>
    </div>
  );
}

export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <Card className="p-5">
      <h3 className="font-bold text-gray-900 dark:text-gray-100">Spending by Category</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500">{formatCurrency(total)} total</p>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        <div className="h-52 w-52 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                cornerRadius={4}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={entry.category} fill={CATEGORY_HEX[index % CATEGORY_HEX.length]} />
                ))}
              </Pie>
              <Tooltip content={<CategoryTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="grid flex-1 grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {data.map((entry, index) => (
            <li key={entry.category} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_HEX[index % CATEGORY_HEX.length] }}
              />
              <span className="flex-1 truncate text-gray-600 dark:text-gray-300">
                {entry.category}
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(entry.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
