interface Segment {
  label: string;
  value: number;
  color: string;
}

interface RadialRatioProps {
  segments: Segment[];
  centerValue: string;
  centerLabel: string;
  size?: number;
  strokeWidth?: number;
}

export function RadialRatio({
  segments,
  centerValue,
  centerLabel,
  size = 180,
  strokeWidth = 18,
}: RadialRatioProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, seg) => sum + seg.value, 0) || 1;

  let offsetAccum = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-800"
        />
        {segments.map((seg) => {
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
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={dashOffset}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{centerValue}</span>
        <span className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {centerLabel}
        </span>
      </div>
    </div>
  );
}
