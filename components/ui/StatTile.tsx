"use client";

import { ReactNode } from "react";
import { Card } from "./Card";
import { cn, formatCurrency } from "@/lib/utils";
import { useCountUp } from "@/lib/hooks/useCountUp";

interface StatTileProps {
  label: string;
  value: string;
  sublabel?: string;
  valueClassName?: string;
  icon?: ReactNode;
  /** Animate the numeric value with a count-up effect; requires rawValue + displayCurrency. */
  animateValue?: boolean;
  rawValue?: number;
  displayCurrency?: string;
}

export function StatTile({
  label,
  value,
  sublabel,
  valueClassName,
  icon,
  animateValue = false,
  rawValue,
  displayCurrency,
}: StatTileProps) {
  const shouldAnimate = animateValue && rawValue !== undefined && !!displayCurrency;
  const progress = useCountUp([rawValue], shouldAnimate);
  const displayValue = shouldAnimate
    ? formatCurrency(rawValue! * progress, displayCurrency!)
    : value;

  return (
    <Card className="animate-rise p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        {icon}
      </div>
      <p className={cn("mt-1.5 font-display text-2xl font-bold text-text", valueClassName)}>
        {displayValue}
      </p>
      {sublabel && <p className="mt-1 text-sm text-muted">{sublabel}</p>}
    </Card>
  );
}
