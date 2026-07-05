import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProfileCard } from "@/components/settings/ProfileCard";
import { getCategoryBreakdown } from "@/lib/calculations";
import { getExpenses } from "@/lib/data/expenses";
import { createClient } from "@/lib/supabase/server";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import { updateNotificationPrefsAction, updateDisplayCurrencyAction } from "./actions";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: profile } = authUser
    ? await supabase
        .from("profiles")
        .select(
          "display_name, display_currency, notify_invoice_overdue, notify_expense_processed, notify_weekly_summary"
        )
        .eq("id", authUser.id)
        .maybeSingle()
    : { data: null };

  const displayName = profile?.display_name ?? authUser?.email ?? "";
  const email = authUser?.email ?? "";

  const NOTIFICATION_PREFS = [
    {
      name: "notify_invoice_overdue",
      label: "Email me when an invoice becomes overdue",
      defaultChecked: profile?.notify_invoice_overdue ?? true,
    },
    {
      name: "notify_expense_processed",
      label: "Email me when a receipt finishes processing",
      defaultChecked: profile?.notify_expense_processed ?? true,
    },
    {
      name: "notify_weekly_summary",
      label: "Weekly spending summary",
      defaultChecked: profile?.notify_weekly_summary ?? false,
    },
  ];

  const expenses = await getExpenses();
  const categories = getCategoryBreakdown(expenses);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Manage your profile and preferences.
        </p>
      </div>

      <ProfileCard displayName={displayName} email={email} />

      <Card className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">Currency</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          The currency your Dashboard, Clients, and Expenses totals are converted to and shown in.
        </p>
        <form action={updateDisplayCurrencyAction} className="mt-4 flex items-end gap-3">
          <label className="flex flex-1 max-w-xs flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
            Display currency
            <select
              name="display_currency"
              defaultValue={profile?.display_currency ?? "USD"}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-teal-500/20"
            >
              {SUPPORTED_CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" variant="secondary">
            Save
          </Button>
        </form>
      </Card>

      <Card className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
        <form action={updateNotificationPrefsAction}>
          <div className="mt-2 flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            {NOTIFICATION_PREFS.map((item) => (
              <label
                key={item.name}
                className="flex items-center justify-between gap-4 py-3 text-sm text-gray-600 dark:text-gray-300"
              >
                {item.label}
                <input
                  type="checkbox"
                  name={item.name}
                  defaultChecked={item.defaultChecked}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800"
                />
              </label>
            ))}
          </div>
          <Button type="submit" variant="secondary" className="mt-4">
            Save preferences
          </Button>
        </form>
      </Card>

      <Card className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">Expense categories</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Categories the AI pipeline sorts your receipts into.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((entry) => (
            <span
              key={entry.category}
              className="rounded-full bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
            >
              {entry.category}
            </span>
          ))}
        </div>
      </Card>

      <p className="text-xs text-gray-400 dark:text-gray-500">
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>{" "}
        ·{" "}
        <Link href="/terms" className="hover:underline">
          Terms of Use
        </Link>
      </p>
    </div>
  );
}
