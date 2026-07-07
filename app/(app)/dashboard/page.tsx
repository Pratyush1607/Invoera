import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ChartCarousel } from "@/components/dashboard/ChartCarousel";
import { PageBackground } from "@/components/layout/PageBackground";
import {
  getCategoryBreakdown,
  getMonthlyProfitLoss,
  getMonthlyRevenue,
  getMonthlySpend,
  getOverallInvoiceTotals,
  getTotalExpenses,
} from "@/lib/calculations";
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
  const profitLossData = getMonthlyProfitLoss(clients, expenses).slice(-6);
  const revenueData = getMonthlyRevenue(clients).slice(-6);
  const spendData = getMonthlySpend(expenses).slice(-6);
  const categoryData = getCategoryBreakdown(expenses);

  return (
    <PageBackground image="/images/dashboard-bg-frame.png">
      <div className="flex flex-col gap-5">
        <div className="animate-rise">
          <h1 className="font-display text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-sm text-muted">Here&apos;s how your business is doing this month.</p>
        </div>

        <SummaryCards
          totals={totals}
          invoiceCount={invoiceCount}
          totalSpend={totalSpend}
          displayCurrency={displayCurrency}
        />

        <ChartCarousel
          profitLoss={profitLossData}
          revenue={revenueData}
          spend={spendData}
          categories={categoryData}
          displayCurrency={displayCurrency}
        />
      </div>
    </PageBackground>
  );
}
