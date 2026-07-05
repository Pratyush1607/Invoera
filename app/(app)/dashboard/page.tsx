import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { getMonthlyProfitLoss, getOverallInvoiceTotals, getTotalExpenses } from "@/lib/calculations";
import { getClients } from "@/lib/data/clients";
import { getExpenses } from "@/lib/data/expenses";
import { getDisplayContext } from "@/lib/currency";

export default async function DashboardPage() {
  const [clients, expenses, { displayCurrency }] = await Promise.all([
    getClients(),
    getExpenses(),
    getDisplayContext(),
  ]);

  const totals = getOverallInvoiceTotals(clients);
  const invoiceCount = clients.reduce((sum, client) => sum + client.invoices.length, 0);
  const totalSpend = getTotalExpenses(expenses);
  const profitLossData = getMonthlyProfitLoss(clients, expenses);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Here&apos;s how your business is doing this month.
        </p>
      </div>

      <SummaryCards
        totals={totals}
        invoiceCount={invoiceCount}
        totalSpend={totalSpend}
        displayCurrency={displayCurrency}
      />

      <ProfitLossChart data={profitLossData} displayCurrency={displayCurrency} />
    </div>
  );
}
