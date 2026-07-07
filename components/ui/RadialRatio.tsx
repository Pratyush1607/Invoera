interface Segment {
  label: string;
  value: number;
  color: string;
  displayValue?: string;
}

interface RadialRatioProps {
  segments: Segment[];
  centerValue: string;
  centerLabel: string;
  size?: number;
  strokeWidth?: number;
  legendPosition?: "below" | "beside" | "none";
}

export function RadialRatio({
  segments,
  centerValue,
  centerLabel,
  size = 180,
  strokeWidth = 18,
  legendPosition = "none",
}: RadialRatioProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, seg) => sum + seg.value, 0) || 1;

  let offsetAccum = 0;

  const ring = (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        {segments.map((seg, i) => {
          const fraction = seg.value / total;
          const dash = fraction * circumference;
          const gap = circumference - dash;
          const dashOffset = -offsetAccum;
          offsetAccum += dash;
          return (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDashoffset={dashOffset}
              className="animate-grow-dash"
              style={
                {
                  "--dash": `${dash} ${gap}`,
                  "--circ": circumference,
                  animationDelay: `${0.4 + i * 0.08}s`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span className="font-display text-2xl font-bold text-text">{centerValue}</span>
        <span className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
          {centerLabel}
        </span>
      </div>
    </div>
  );

  if (legendPosition === "none") return ring;

  if (legendPosition === "beside") {
    return (
      <div className="flex flex-wrap items-center gap-6">
        {ring}
        <div className="flex flex-wrap gap-5">
          {segments.map((seg) => (
            <div key={seg.label}>
              <div className="flex items-center gap-1.5 text-sm text-muted">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
                {seg.label}
              </div>
              {seg.displayValue && (
                <p className="mt-1 ml-3.5 font-display text-[15px] font-bold text-text">
                  {seg.displayValue}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {ring}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-sm text-muted">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
            {seg.label}
          </div>
        ))}
      </div>
    </div>
  );
}
