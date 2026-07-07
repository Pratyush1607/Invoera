"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";

const SIZES = {
  sm: { track: "h-7 w-12", thumb: "h-5 w-5", offset: 20 },
  lg: { track: "h-[30px] w-[52px]", thumb: "h-[22px] w-[22px]", offset: 22 },
};

export function ThemeToggle({ size = "sm" }: { size?: "sm" | "lg" }) {
  const { theme, toggleTheme } = useTheme();
  const s = SIZES[size];

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={cn(
        "flex items-center rounded-full border border-border bg-surface-inset p-0.5",
        s.track
      )}
    >
      <span
        className={cn("rounded-full bg-accent transition-transform duration-150 ease-out", s.thumb)}
        style={{ transform: theme === "dark" ? `translateX(${s.offset}px)` : "translateX(0px)" }}
      />
    </button>
  );
}
