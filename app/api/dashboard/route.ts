import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

  // Fetch accounts
  const { data: accounts } = await supabase
    .from("accounts")
    .select("id, name, type, balance, currency, color, is_active, include_in_total")
    .eq("is_active", true);

  // Fetch current month transactions
  const { data: currentMonthTxs } = await supabase
    .from("transactions")
    .select("type, amount, category_id")
    .gte("date", startOfMonth)
    .lte("date", endOfMonth);

  // Fetch last month transactions for comparison
  const { data: lastMonthTxs } = await supabase
    .from("transactions")
    .select("type, amount")
    .gte("date", startOfLastMonth)
    .lte("date", endOfLastMonth);

  // Fetch recent transactions
  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select(`
      id, type, amount, description, date,
      account:accounts(id, name, color),
      category:categories(id, name, icon, color)
    `)
    .order("date", { ascending: false })
    .limit(5);

  // Fetch categories with spending
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, icon, color, type, budget_amount")
    .eq("type", "expense");

  // Calculate totals
  const totalBalance = accounts?.reduce((sum, acc) => {
    if (acc.include_in_total) {
      return sum + (acc.type === "credit" ? -Number(acc.balance) : Number(acc.balance));
    }
    return sum;
  }, 0) || 0;

  const currentMonthIncome = currentMonthTxs
    ?.filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const currentMonthExpenses = currentMonthTxs
    ?.filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const lastMonthIncome = lastMonthTxs
    ?.filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const lastMonthExpenses = lastMonthTxs
    ?.filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  // Calculate spending by category
  const spendingByCategory = categories?.map((cat) => {
    const spent = currentMonthTxs
      ?.filter((t) => t.type === "expense" && t.category_id === cat.id)
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    return {
      ...cat,
      spent,
      percentage: cat.budget_amount ? (spent / Number(cat.budget_amount)) * 100 : null,
    };
  }).sort((a, b) => b.spent - a.spent);

  return NextResponse.json({
    summary: {
      totalBalance,
      currentMonth: {
        income: currentMonthIncome,
        expenses: currentMonthExpenses,
        balance: currentMonthIncome - currentMonthExpenses,
      },
      lastMonth: {
        income: lastMonthIncome,
        expenses: lastMonthExpenses,
        balance: lastMonthIncome - lastMonthExpenses,
      },
      trends: {
        incomeChange: lastMonthIncome > 0 
          ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 
          : 0,
        expenseChange: lastMonthExpenses > 0 
          ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
          : 0,
      },
    },
    accounts: accounts || [],
    recentTransactions: recentTransactions || [],
    spendingByCategory: spendingByCategory || [],
  });
}
