interface Segment {
  label: string;
  value: number;
  color: string;
}

export function RatioBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0) || 1;

  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-input-bg">
        {segments.map((seg, i) => {
          const pct = (seg.value / total) * 100;
          return (
            <div
              key={seg.label}
              style={
                {
                  "--fw": `${pct}%`,
                  width: `${pct}%`,
                  backgroundColor: seg.color,
                  animationDelay: `${0.4 + i * 0.08}s`,
                } as React.CSSProperties
              }
              className="animate-grow-w h-full first:rounded-l-full last:rounded-r-full"
            />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-4">
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
