"use client";

import { type PointerEvent, useState } from "react";
import { Card } from "@/components/ui/Card";
import { STATUS_HEX, CATEGORY_RAMP } from "@/lib/colors";
import { cn, formatCurrency } from "@/lib/utils";
import type { ExpenseCategory } from "@/lib/types";

interface MonthBar {
  key: string;
  label: string;
  amount: number;
}

interface ProfitLossBar {
  key: string;
  label: string;
  profit: number;
}

interface CategoryEntry {
  category: ExpenseCategory;
  amount: number;
}

interface ChartCarouselProps {
  profitLoss: ProfitLossBar[];
  revenue: MonthBar[];
  spend: MonthBar[];
  categories: CategoryEntry[];
  displayCurrency: string;
}

interface Bar {
  label: string;
  heightPct: number;
  color: string;
  ariaLabel: string;
  tooltip: string;
}

function VerticalBars({ bars, slideKey, active }: { bars: Bar[]; slideKey: string; active: boolean }) {
  return (
    <div className="flex h-44 items-end gap-3 border-t border-border pt-3">
      {bars.map((bar, i) => (
        <div key={`${slideKey}-${bar.label}-${i}`} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
          <div className="relative w-full max-w-[34px] flex-1 flex items-end justify-center">
            <div className="pointer-events-none absolute -top-7 z-10 whitespace-nowrap rounded-md bg-text px-2 py-1 text-[11px] font-semibold text-bg opacity-0 transition-opacity group-hover:opacity-100">
              {bar.tooltip}
            </div>
            <div
              role="img"
              aria-label={bar.ariaLabel}
              title={bar.tooltip}
              style={
                {
                  "--fh": `${bar.heightPct}%`,
                  height: `${bar.heightPct}%`,
                  backgroundColor: bar.color,
                  animationDelay: active ? `${0.4 + i * 0.06}s` : undefined,
                } as React.CSSProperties
              }
              className={cn("w-full max-w-[34px] rounded-md", active && "animate-grow-h")}
            />
          </div>
          <span className="text-xs text-muted">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

function CategoryBars({
  entries,
  displayCurrency,
  slideKey,
  active,
}: {
  entries: CategoryEntry[];
  displayCurrency: string;
  slideKey: string;
  active: boolean;
}) {
  const max = Math.max(...entries.map((e) => e.amount), 1);
  return (
    <div className="flex min-h-44 flex-col justify-center gap-3">
      {entries.map((entry, i) => {
        const pct = Math.round((entry.amount / max) * 100);
        const color = CATEGORY_RAMP[i % CATEGORY_RAMP.length];
        const displayValue = formatCurrency(entry.amount, displayCurrency);
        return (
          <div key={`${slideKey}-${entry.category}`} className="flex items-center gap-3">
            <span className="w-20 shrink-0 truncate text-xs text-muted">{entry.category}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-inset">
              <div
                role="img"
                aria-label={`${entry.category}: ${displayValue}`}
                title={displayValue}
                style={
                  {
                    "--fw": `${pct}%`,
                    width: `${pct}%`,
                    backgroundColor: color,
                    animationDelay: active ? `${0.4 + i * 0.06}s` : undefined,
                  } as React.CSSProperties
                }
                className={cn("h-full rounded-full", active && "animate-grow-w")}
              />
            </div>
            <span className="w-16 shrink-0 text-right text-[13px] font-semibold text-text">
              {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ChartCarousel({
  profitLoss,
  revenue,
  spend,
  categories,
  displayCurrency,
}: ChartCarouselProps) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);

  const netProfitLoss = profitLoss.reduce((sum, b) => sum + b.profit, 0);
  const totalRevenue = revenue.reduce((sum, b) => sum + b.amount, 0);
  const totalSpend = spend.reduce((sum, b) => sum + b.amount, 0);

  const maxPL = Math.max(...profitLoss.map((b) => Math.abs(b.profit)), 1);
  const maxRevenue = Math.max(...revenue.map((b) => b.amount), 1);
  const maxSpend = Math.max(...spend.map((b) => b.amount), 1);

  const slides = [
    {
      key: "pl",
      title: "Profit / Loss by Month",
      subtitle:
        profitLoss.length > 0
          ? `Net ${formatCurrency(netProfitLoss, displayCurrency)} over ${profitLoss.length} months`
          : "No invoice or expense history yet",
      render: (active: boolean) => (
        <VerticalBars
          slideKey="pl"
          active={active}
          bars={profitLoss.map((b) => ({
            label: b.label,
            heightPct: Math.max(10, Math.round((Math.abs(b.profit) / maxPL) * 100)),
            color: b.profit >= 0 ? STATUS_HEX.paid : STATUS_HEX.overdue,
            ariaLabel: `${b.label}: ${b.profit >= 0 ? "profit of" : "loss of"} ${formatCurrency(Math.abs(b.profit), displayCurrency)}`,
            tooltip: `${b.profit >= 0 ? "+" : "-"}${formatCurrency(Math.abs(b.profit), displayCurrency)}`,
          }))}
        />
      ),
    },
    {
      key: "revenue",
      title: "Total Revenue by Month",
      subtitle:
        revenue.length > 0
          ? `${formatCurrency(totalRevenue, displayCurrency)} invoiced total`
          : "No invoices yet",
      render: (active: boolean) => (
        <VerticalBars
          slideKey="revenue"
          active={active}
          bars={revenue.map((b) => ({
            label: b.label,
            heightPct: Math.max(10, Math.round((b.amount / maxRevenue) * 100)),
            color: STATUS_HEX.paid,
            ariaLabel: `${b.label}: ${formatCurrency(b.amount, displayCurrency)} invoiced`,
            tooltip: formatCurrency(b.amount, displayCurrency),
          }))}
        />
      ),
    },
    {
      key: "spend",
      title: "Spending by Month",
      subtitle:
        spend.length > 0 ? `${formatCurrency(totalSpend, displayCurrency)} spent total` : "No expenses yet",
      render: (active: boolean) => (
        <VerticalBars
          slideKey="spend"
          active={active}
          bars={spend.map((b) => ({
            label: b.label,
            heightPct: Math.max(10, Math.round((b.amount / maxSpend) * 100)),
            color: STATUS_HEX.pending,
            ariaLabel: `${b.label}: ${formatCurrency(b.amount, displayCurrency)} spent`,
            tooltip: formatCurrency(b.amount, displayCurrency),
          }))}
        />
      ),
    },
    {
      key: "category",
      title: "Spend by Category",
      subtitle:
        categories.length > 0
          ? `${formatCurrency(totalSpend, displayCurrency)} total`
          : "No expenses yet",
      render: (active: boolean) => (
        <CategoryBars
          slideKey="category"
          entries={categories}
          displayCurrency={displayCurrency}
          active={active}
        />
      ),
    },
  ];

  function goTo(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    setDragging(true);
    setDragStartX(event.clientX);
    setDragCurrentX(event.clientX);
  }
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragCurrentX(event.clientX);
  }
  function handlePointerUp() {
    if (!dragging) return;
    const delta = dragCurrentX - dragStartX;
    if (delta < -50) goTo(index + 1);
    else if (delta > 50) goTo(index - 1);
    setDragging(false);
    setDragStartX(0);
    setDragCurrentX(0);
  }

  const dragDelta = dragging ? dragCurrentX - dragStartX : 0;

  return (
    <Card className="animate-rise p-5" style={{ animationDelay: "0.35s" }}>
      <div
        className="overflow-hidden"
        style={{ touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        role="group"
        aria-roledescription="carousel"
        aria-label="Financial charts"
      >
        <div
          className="flex items-start"
          style={{
            width: "400%",
            transform: `translateX(calc(-${index * 25}% + ${dragDelta}px))`,
            transition: dragging ? "none" : "transform .32s cubic-bezier(.2,.8,.2,1)",
            cursor: "grab",
          }}
        >
          {slides.map((slide, i) => (
            <div key={slide.key} className="w-1/4 shrink-0 pr-1" aria-hidden={i !== index}>
              <h3 className="font-display text-base font-bold text-text">{slide.title}</h3>
              <p className="mb-4 text-sm text-muted">{slide.subtitle}</p>
              {slide.render(i === index)}
            </div>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {slides[index].title}, {slides[index].subtitle}
      </p>

      <div className="mt-3.5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous chart"
          className="flex h-7.5 w-7.5 items-center justify-center rounded-full border border-border bg-surface-inset text-text"
        >
          ‹
        </button>
        <div className="flex gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${slide.title}`}
              aria-current={i === index}
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: i === index ? "var(--accent)" : "var(--border)" }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next chart"
          className="flex h-7.5 w-7.5 items-center justify-center rounded-full border border-border bg-surface-inset text-text"
        >
          ›
        </button>
      </div>
    </Card>
  );
}
