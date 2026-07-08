import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ChartCarousel } from "@/components/dashboard/ChartCarousel";
import { InvoicedTrendCard } from "@/components/dashboard/InvoicedTrendCard";
import { UpcomingInvoicesCard } from "@/components/dashboard/UpcomingInvoicesCard";
import { SpendTile, SpendBudgetCard } from "@/components/dashboard/SpendBudgetCard";
import { AccountCard } from "@/components/dashboard/AccountCard";
import { PageBackground } from "@/components/layout/PageBackground";
import { lineFromPct } from "@/lib/chart-math";
import type { LineChartPoint } from "@/components/dashboard/LineChart";
import {
  getCategoryBreakdown,
  getMonthlyProfitLoss,
  getMonthlyRevenue,
  getMonthlySpend,
  getOverallInvoiceTotals,
  getTotalExpenses,
  getUpcomingInvoices,
} from "@/lib/calculations";
import { getClients } from "@/lib/data/clients";
import { getExpenses } from "@/lib/data/expenses";
import { getNotifications } from "@/lib/data/notifications";
import { getDisplayContext } from "@/lib/currency";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ data: authData }, clients, expenses, notifications, { displayCurrency }] = await Promise.all([
    supabase.auth.getUser(),
    getClients(),
    getExpenses(),
    getNotifications(),
    getDisplayContext(),
  ]);

  let profileName = authData.user?.email ?? "";
  if (authData.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", authData.user.id)
      .maybeSingle();
    profileName = profile?.display_name ?? profileName;
  }

  const totals = getOverallInvoiceTotals(clients);
  const totalSpend = getTotalExpenses(expenses);
  const profitLossData = getMonthlyProfitLoss(clients, expenses).slice(-6);
  const revenueData = getMonthlyRevenue(clients).slice(-6);
  const spendData = getMonthlySpend(expenses).slice(-6);
  const categoryData = getCategoryBreakdown(expenses);
  const upcomingInvoices = getUpcomingInvoices(clients, 3);

  const profitLoss = totals.total - totalSpend;
  const trendPct = Math.round((profitLoss / (totals.total || 1)) * 100);
  const budgetUsedPct = Math.min(100, Math.round((totalSpend / (totals.total || 1)) * 100));

  const maxRevenue = Math.max(...revenueData.map((b) => b.amount), 1);
  const heroLine = lineFromPct(revenueData.map((b) => Math.max(6, Math.round((b.amount / maxRevenue) * 100))));
  const heroPoints: LineChartPoint[] = heroLine.pts.map((p, i) => ({
    ...p,
    label: revenueData[i].label,
    valueLabel: formatCurrency(revenueData[i].amount, displayCurrency),
  }));

  return (
    <PageBackground>
      <div className="flex flex-col gap-5">
        <div className="animate-rise">
          <h1 className="font-display text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-sm text-muted">
            Welcome back, {profileName}. Here&apos;s how your business is doing this month.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.3fr_1fr_0.85fr]">
          <div className="flex min-w-0 flex-col gap-3.5">
            <InvoicedTrendCard
              totalInvoiced={totals.total}
              trendPct={trendPct}
              points={heroPoints}
              smoothPath={heroLine.smoothPath}
              areaPath={heroLine.areaPath}
              displayCurrency={displayCurrency}
            />
            <UpcomingInvoicesCard invoices={upcomingInvoices} />
          </div>

          <div className="flex min-w-0 flex-col gap-3.5">
            <SpendTile totalSpend={totalSpend} displayCurrency={displayCurrency} />
            <SpendBudgetCard
              budgetUsedPct={budgetUsedPct}
              topCategories={categoryData.slice(0, 4)}
              displayCurrency={displayCurrency}
            />
          </div>

          <div className="min-w-0">
            <AccountCard notifications={notifications} />
          </div>
        </div>

        <SummaryCards totals={totals} totalSpend={totalSpend} displayCurrency={displayCurrency} />

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
