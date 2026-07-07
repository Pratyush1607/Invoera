"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn, formatCurrency } from "@/lib/utils";

type SpendView = "Monthly" | "Annual";

interface SpendChartProps {
  monthlyData: { key: string; label: string; amount: number }[];
  annualData: { key: string; label: string; amount: number }[];
  displayCurrency: string;
}

export function SpendChart({ monthlyData, annualData, displayCurrency }: SpendChartProps) {
  const [view, setView] = useState<SpendView>("Monthly");

  const data = view === "Monthly" ? monthlyData : annualData;
  const total = data.reduce((sum, entry) => sum + entry.amount, 0);
  const max = Math.max(...data.map((entry) => entry.amount), 1);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-text">Spending</h3>
          <p className="truncate text-sm text-muted">
            {formatCurrency(total, displayCurrency)} over {data.length}{" "}
            {view === "Monthly" ? "months" : "years"}
          </p>
        </div>
        <div className="flex shrink-0 gap-1 rounded-full bg-surface-inset p-1">
          {(["Monthly", "Annual"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                view === option ? "bg-surface text-text shadow-sm" : "text-muted"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex h-44 items-end gap-3 border-t border-border pt-3">
        {data.map((entry, i) => {
          const heightPct = Math.max(10, Math.round((entry.amount / max) * 100));
          const displayValue = formatCurrency(entry.amount, displayCurrency);
          return (
            <div
              key={`${view}-${entry.key}`}
              className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="relative flex w-full max-w-[34px] flex-1 items-end justify-center">
                <div className="pointer-events-none absolute -top-7 z-10 whitespace-nowrap rounded-md bg-text px-2 py-1 text-[11px] font-semibold text-bg opacity-0 transition-opacity group-hover:opacity-100">
                  {displayValue}
                </div>
                <div
                  role="img"
                  aria-label={`${entry.label}: ${displayValue}`}
                  title={displayValue}
                  style={
                    {
                      "--fh": `${heightPct}%`,
                      height: `${heightPct}%`,
                      backgroundColor: "var(--warning)",
                      animationDelay: `${0.4 + i * 0.06}s`,
                    } as React.CSSProperties
                  }
                  className="animate-grow-h w-full max-w-[34px] rounded-md"
                />
              </div>
              <span className="text-xs text-muted">{entry.label}</span>
            </div>
          );
        })}
        {data.length === 0 && (
          <p className="w-full pb-8 text-center text-sm text-muted">No expenses yet.</p>
        )}
      </div>
    </Card>
  );
}
