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
        <label className="flex flex-1 max-w-xs flex-col gap-1.5 text-sm font-medium text-text">
          Display currency
          <select
            name="display_currency"
            defaultValue={displayCurrency}
            className="rounded-[var(--radius-input)] border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
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
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
    </form>
  );
}
