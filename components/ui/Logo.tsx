const SIZES = {
  sm: { box: 32, radius: 9, mark: 24, markH: 18, bar: 16, barH: 10, dot: 4 },
  md: { box: 34, radius: 10, mark: 26, markH: 19, bar: 17, barH: 11, dot: 4.5 },
  lg: { box: 36, radius: 10, mark: 27, markH: 20, bar: 18, barH: 11, dot: 5 },
};

export function Logo({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const s = SIZES[size];
  return (
    <span
      className="flex shrink-0 flex-col items-center justify-center gap-[3px] bg-accent-gradient"
      style={{ width: s.box, height: s.box, borderRadius: s.radius }}
    >
      <span className="relative" style={{ width: s.mark, height: s.markH }}>
        <span
          className="absolute rounded-[2.5px] bg-white opacity-35"
          style={{ left: 0, top: s.barH / 2, width: s.bar, height: s.barH, transform: "rotate(-14deg)" }}
        />
        <span
          className="absolute rounded-[2.5px] bg-white opacity-65"
          style={{ left: s.bar * 0.19, top: s.barH * 0.2, width: s.bar, height: s.barH, transform: "rotate(-3deg)" }}
        />
        <span
          className="absolute flex items-center justify-center rounded-[2.5px] bg-white"
          style={{ left: s.bar * 0.38, top: 0, width: s.bar, height: s.barH, transform: "rotate(9deg)" }}
        >
          <span className="rounded-full bg-accent" style={{ width: s.dot, height: s.dot }} />
        </span>
      </span>
    </span>
  );
}
