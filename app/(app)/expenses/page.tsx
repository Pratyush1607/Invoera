import { ExpensesView } from "@/components/expenses/ExpensesView";
import { CategoryDonutChart } from "@/components/expenses/CategoryDonutChart";
import { SpendChart } from "@/components/expenses/SpendChart";
import { getCategoryBreakdown, getMonthlySpend, getAnnualSpend } from "@/lib/calculations";
import { getExpenses } from "@/lib/data/expenses";

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  const categoryData = getCategoryBreakdown(expenses);
  const monthlyData = getMonthlySpend(expenses);
  const annualData = getAnnualSpend(expenses);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SpendChart monthlyData={monthlyData} annualData={annualData} />
        <CategoryDonutChart data={categoryData} />
      </div>

      <ExpensesView expenses={expenses} />
    </div>
  );
}
