import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { getCategoryBreakdown } from "@/lib/calculations";
import { getExpenses } from "@/lib/data/expenses";
import { createClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/utils";

const NOTIFICATION_PREFS = [
  { label: "Email me when an invoice becomes overdue", defaultChecked: true },
  { label: "Email me when a receipt finishes processing", defaultChecked: true },
  { label: "Weekly spending summary", defaultChecked: false },
];

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: profile } = authUser
    ? await supabase
        .from("profiles")
        .select("display_name, email")
        .eq("id", authUser.id)
        .maybeSingle()
    : { data: null };

  const displayName = profile?.display_name ?? authUser?.email ?? "";
  const email = profile?.email ?? authUser?.email ?? "";

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

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar initials={getInitials(displayName)} color="#0d9488" size={56} />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{displayName}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{email}</p>
          </div>
        </div>
        <Button variant="secondary">Edit profile</Button>
      </Card>

      <Card className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
        <div className="mt-2 flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {NOTIFICATION_PREFS.map((item) => (
            <label
              key={item.label}
              className="flex items-center justify-between gap-4 py-3 text-sm text-gray-600 dark:text-gray-300"
            >
              {item.label}
              <input
                type="checkbox"
                defaultChecked={item.defaultChecked}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800"
              />
            </label>
          ))}
        </div>
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
    </div>
  );
}
