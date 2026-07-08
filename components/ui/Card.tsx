import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card shadow-sm shadow-black/5 ring-1 ring-border dark:shadow-none",
        className
      )}
      {...props}
    />
  );
}
