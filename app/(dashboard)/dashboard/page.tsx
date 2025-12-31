import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Wallet, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";
import { Account, Transaction, Category } from "@/types/database";
import { QuickWithdrawal } from "@/components/transactions/quick-withdrawal";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch accounts
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true }) as { data: Account[] | null };

  // Fetch recent transactions
  type TransactionWithRelations = Transaction & {
    account: Pick<Account, "name" | "color"> | null;
    category: Pick<Category, "name" | "icon" | "color"> | null;
  };
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      account:accounts!left(name, color),
      category:categories!left(name, icon, color)
    `)
    .order("date", { ascending: false })
    .limit(5) as { data: TransactionWithRelations[] | null };

  // Calculate totals
  const totalBalance = accounts?.reduce((sum, acc) => {
    if (acc.include_in_total) {
      return sum + (acc.type === "credit" ? -Number(acc.balance) : Number(acc.balance));
    }
    return sum;
  }, 0) || 0;

  // Get current month transactions for income/expense
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const { data: monthTransactions } = await supabase
    .from("transactions")
    .select("type, amount")
    .gte("date", startOfMonth)
    .lte("date", endOfMonth) as { data: Pick<Transaction, "type" | "amount">[] | null };

  const monthlyIncome = monthTransactions
    ?.filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const monthlyExpenses = monthTransactions
    ?.filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de tus finanzas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Balance Total"
          value={formatCurrency(totalBalance)}
          icon={<Wallet className="h-5 w-5 text-blue-600" />}
          trend={null}
        />
        <StatCard
          title="Ingresos del Mes"
          value={formatCurrency(monthlyIncome)}
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          trend={null}
          valueClassName="text-emerald-600"
        />
        <StatCard
          title="Gastos del Mes"
          value={formatCurrency(monthlyExpenses)}
          icon={<TrendingDown className="h-5 w-5 text-red-600" />}
          trend={null}
          valueClassName="text-red-600"
        />
        <StatCard
          title="Balance del Mes"
          value={formatCurrency(monthlyIncome - monthlyExpenses)}
          icon={<ArrowUpDown className="h-5 w-5 text-purple-600" />}
          trend={null}
          valueClassName={monthlyIncome - monthlyExpenses >= 0 ? "text-emerald-600" : "text-red-600"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Accounts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Cuentas</h2>
            <Link href="/accounts" className="text-sm text-blue-600 hover:underline">
              Ver todas
            </Link>
          </div>
          {accounts && accounts.length > 0 ? (
            <div className="space-y-3">
              {accounts.slice(0, 5).map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: account.color + "20" }}
                    >
                      <Wallet className="h-5 w-5" style={{ color: account.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{account.type}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${Number(account.balance) >= 0 ? "text-gray-900" : "text-red-600"}`}>
                    {formatCurrency(Number(account.balance), account.currency)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tienes cuentas configuradas</p>
              <Link
                href="/accounts"
                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
              >
                Agregar cuenta
              </Link>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Transacciones Recientes</h2>
            <Link href="/transactions" className="text-sm text-blue-600 hover:underline">
              Ver todas
            </Link>
          </div>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: (tx.category?.color || "#6B7280") + "20" }}
                    >
                      <span style={{ color: tx.category?.color || "#6B7280" }}>
                        {tx.type === "income" ? "+" : "-"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {tx.description || tx.category?.name || "Sin categoría"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.date).toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                        })}
                        {" • "}
                        {tx.account?.name}
                      </p>
                    </div>
                  </div>
                  <p className={`font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(Number(tx.amount))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ArrowUpDown className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tienes transacciones aún</p>
              <Link
                href="/transactions"
                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
              >
                Agregar transacción
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Withdrawal */}
      <div className="grid gap-6 lg:grid-cols-3">
        <QuickWithdrawal accounts={accounts || []} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  valueClassName = "",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string | null;
  valueClassName?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon}
      </div>
      <p className={`text-2xl font-bold mt-2 ${valueClassName}`}>{value}</p>
      {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
    </div>
  );
}
