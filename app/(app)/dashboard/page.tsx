import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
import { MonthlyBarChart } from "@/components/dashboard/MonthlyBarChart";
import { InvoiceRatioCard } from "@/components/shared/InvoiceRatioCard";
import { getCategoryBreakdown, getMonthlyBreakdown, getOverallInvoiceTotals } from "@/lib/calculations";
import { getClients } from "@/lib/data/clients";
import { getExpenses } from "@/lib/data/expenses";

export default async function DashboardPage() {
  const [clients, expenses] = await Promise.all([getClients(), getExpenses()]);

  const totals = getOverallInvoiceTotals(clients);
  const invoiceCount = clients.reduce((sum, client) => sum + client.invoices.length, 0);
  const categoryData = getCategoryBreakdown(expenses);
  const monthlyData = getMonthlyBreakdown(expenses);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Here&apos;s how your business is doing this month.
        </p>
      </div>

      <SummaryCards totals={totals} invoiceCount={invoiceCount} />

      <InvoiceRatioCard totals={totals} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CategoryDonutChart data={categoryData} />
        <MonthlyBarChart data={monthlyData} />
      </div>
    </div>
  );
}
