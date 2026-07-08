"use client";

import { useId, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import type { ChartPoint } from "@/lib/chart-math";

export interface LineChartPoint extends ChartPoint {
  label: string;
  valueLabel: string;
}

interface LineChartProps {
  points: LineChartPoint[];
  smoothPath: string;
  areaPath: string;
  color: string;
  showZeroLine?: boolean;
  showAxisLabels?: boolean;
  className?: string;
  /** When part of a carousel, only animate the reveal once this slide is active (not on mount). */
  active?: boolean;
}

export function LineChart({
  points,
  smoothPath,
  areaPath,
  color,
  showZeroLine = false,
  showAxisLabels = false,
  className,
  active = true,
}: LineChartProps) {
  const gradId = useId();
  const glowId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    if (points.length === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const xPct = ((event.clientX - rect.left) / rect.width) * 100;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - xPct);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  const hover = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className={className}>
      <div
        className={cn("relative min-h-0 flex-1 cursor-crosshair", active && "animate-rise")}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="block h-full w-full overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="60%" stopColor={color} stopOpacity="0.12" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          {showZeroLine && (
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="3,3"
              vectorEffect="non-scaling-stroke"
            />
          )}
          <path d={areaPath} fill={`url(#${gradId})`} stroke="none" />
          <path
            d={smoothPath}
            fill="none"
            stroke={color}
            strokeWidth="4"
            opacity="0.35"
            filter={`url(#${glowId})`}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={smoothPath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {hover && (
            <>
              <line
                x1={hover.x}
                y1="0"
                x2={hover.x}
                y2="100"
                stroke={color}
                strokeWidth="1"
                strokeDasharray="2,3"
                opacity="0.5"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={hover.x} cy={hover.y} r="4" fill={color} stroke="#fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </>
          )}
        </svg>
        {hover && (
          <span
            className="pointer-events-none absolute rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-text shadow-[0_6px_16px_rgba(0,0,0,0.3)]"
            style={{ left: `${hover.x}%`, top: `${hover.y}%`, transform: "translate(-50%, -140%)" }}
          >
            {hover.valueLabel}
          </span>
        )}
      </div>
      {showAxisLabels && (
        <div className="mt-2 flex justify-between">
          {points.map((p, i) => (
            <span key={i} className="flex-1 text-center text-xs text-muted">
              {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
