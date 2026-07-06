"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { updateDisplayCurrencyAction, type CurrencyFormState } from "@/app/(app)/settings/actions";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";

const initialState: CurrencyFormState = {};

export function CurrencyForm({ displayCurrency }: { displayCurrency: string }) {
  const [state, formAction, pending] = useActionState(updateDisplayCurrencyAction, initialState);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!state.error) {
      // The write succeeds immediately, but router.refresh() alone was
      // observed to still serve a stale RSC payload for this route right
      // after the action — a full reload reliably shows the saved value.
      window.location.reload();
    }
  }, [state]);

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-2">
      <div className="flex items-end gap-3">
        <label className="flex flex-1 max-w-xs flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          Display currency
          <select
            name="display_currency"
            defaultValue={displayCurrency}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-teal-500/20"
          >
            {SUPPORTED_CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
    </form>
  );
}
