import { ExpensesView } from "@/components/expenses/ExpensesView";
import { CategoryDonutChart } from "@/components/expenses/CategoryDonutChart";
import { PageBackground } from "@/components/layout/PageBackground";
import { getCategoryBreakdown } from "@/lib/calculations";
import { getExpenses } from "@/lib/data/expenses";
import { getDisplayContext } from "@/lib/currency";

export default async function ExpensesPage() {
  const [expenses, { displayCurrency }] = await Promise.all([getExpenses(), getDisplayContext()]);

  const categoryData = getCategoryBreakdown(expenses);

  return (
    <PageBackground>
      <div className="flex flex-col gap-6">
        <CategoryDonutChart data={categoryData} displayCurrency={displayCurrency} />

        <ExpensesView expenses={expenses} />
      </div>
    </PageBackground>
  );
}
