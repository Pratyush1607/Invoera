import { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string;
  sublabel?: string;
  valueClassName?: string;
  icon?: ReactNode;
}

export function StatTile({ label, value, sublabel, valueClassName, icon }: StatTileProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {label}
        </p>
        {icon}
      </div>
      <p
        className={cn(
          "mt-1.5 text-2xl font-bold text-gray-900 dark:text-gray-100",
          valueClassName
        )}
      >
        {value}
      </p>
      {sublabel && (
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{sublabel}</p>
      )}
    </Card>
  );
}
