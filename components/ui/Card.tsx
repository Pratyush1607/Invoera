import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-sm shadow-gray-200/60 ring-1 ring-gray-100",
        "dark:bg-gray-900 dark:shadow-none dark:ring-gray-800",
        className
      )}
      {...props}
    />
  );
}
