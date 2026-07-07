import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProfileCard } from "@/components/settings/ProfileCard";
import { CurrencyForm } from "@/components/settings/CurrencyForm";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { PageBackground } from "@/components/layout/PageBackground";
import { getCategoryBreakdown } from "@/lib/calculations";
import { getExpenses } from "@/lib/data/expenses";
import { createClient } from "@/lib/supabase/server";
import { updateNotificationPrefsAction } from "./actions";

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
    <PageBackground>
      <div className="flex flex-col gap-5">
        <div className="animate-rise">
          <h1 className="font-display text-2xl font-bold text-text">Settings</h1>
          <p className="text-sm text-muted">Manage your profile and preferences.</p>
        </div>

        <ProfileCard displayName={displayName} email={email} />

        <Card className="animate-rise p-5" style={{ animationDelay: "0.12s" }}>
          <h3 className="font-display font-bold text-text">Currency</h3>
          <p className="text-sm text-muted">
            The currency your Dashboard, Clients, and Expenses totals are converted to and shown in.
          </p>
          <CurrencyForm displayCurrency={profile?.display_currency ?? "USD"} />
        </Card>

        <Card className="animate-rise p-5" style={{ animationDelay: "0.19s" }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-text">Appearance</h3>
              <p className="text-sm text-muted">Switch between light and dark mode.</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display font-bold text-text">Notifications</h3>
          <form action={updateNotificationPrefsAction}>
            <div className="mt-2 flex flex-col divide-y divide-border">
              {NOTIFICATION_PREFS.map((item) => (
                <label
                  key={item.name}
                  className="flex items-center justify-between gap-4 py-3 text-sm text-muted"
                >
                  {item.label}
                  <input
                    type="checkbox"
                    name={item.name}
                    defaultChecked={item.defaultChecked}
                    className="h-4 w-4 rounded border-border accent-accent"
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
          <h3 className="font-display font-bold text-text">Expense categories</h3>
          <p className="text-sm text-muted">Categories the AI pipeline sorts your receipts into.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((entry) => (
              <span
                key={entry.category}
                className="rounded-full bg-surface-inset px-3 py-1.5 text-sm font-medium text-muted ring-1 ring-border"
              >
                {entry.category}
              </span>
            ))}
          </div>
        </Card>

        <p className="text-xs text-muted">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:underline">
            Terms of Use
          </Link>
        </p>
      </div>
    </PageBackground>
  );
}
