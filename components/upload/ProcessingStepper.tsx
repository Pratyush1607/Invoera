import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  label: string;
  description: string;
}

export function ProcessingStepper({
  steps,
  currentIndex,
}: {
  steps: Step[];
  currentIndex: number;
}) {
  return (
    <ol className="flex flex-col gap-5">
      {steps.map((step, index) => {
        const status = index < currentIndex ? "done" : index === currentIndex ? "active" : "pending";
        return (
          <li key={step.label} className="flex items-start gap-3">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                status === "done" && "bg-teal-600 text-white",
                status === "active" && "bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
                status === "pending" && "bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600"
              )}
            >
              {status === "done" && <Check className="h-4 w-4" />}
              {status === "active" && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "pending" && <span className="h-2 w-2 rounded-full bg-current" />}
            </span>
            <div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  status === "pending"
                    ? "text-gray-400 dark:text-gray-500"
                    : "text-gray-900 dark:text-gray-100"
                )}
              >
                {step.label}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
