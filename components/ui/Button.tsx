import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-accent text-accent-text hover:opacity-90",
        variant === "secondary" &&
          "bg-card text-text ring-1 ring-border hover:bg-input-bg",
        variant === "ghost" && "text-muted hover:bg-input-bg",
        className
      )}
      {...props}
    />
  );
}
