"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Wallet, TrendingUp, TrendingDown, ArrowUpDown, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";
import { Account, Transaction, Category } from "@/types/database";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatCard,
  TransactionRow,
  ProgressRing,
  Button,
  Badge,
} from "@/components/ui";

type TransactionWithRelations = Transaction & {
  account: Pick<Account, "name" | "color"> | null;
  category: Pick<Category, "name" | "icon" | "color"> | null;
};

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [transactions, setTransactions] = useState<TransactionWithRelations[] | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch accounts
      const { data: accountsData } = await supabase
        .from("accounts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      setAccounts(accountsData);

      // Fetch recent transactions
      const { data: transactionsData } = await supabase
        .from("transactions")
        .select(`
          *,
          account:accounts(name, color),
          category:categories(name, icon, color)
        `)
        .order("date", { ascending: false })
        .limit(5);

      setTransactions(transactionsData as TransactionWithRelations[]);

      // Get current month transactions for income/expense
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      const { data: monthTransactions } = await supabase
        .from("transactions")
        .select("type, amount")
        .gte("date", startOfMonth)
        .lte("date", endOfMonth);

      const income = monthTransactions
        ?.filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const expenses = monthTransactions
        ?.filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      setMonthlyIncome(income);
      setMonthlyExpenses(expenses);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Calculate totals
  const totalBalance = accounts?.reduce((sum, acc) => {
    if (acc.include_in_total) {
      return sum + (acc.type === "credit" ? -Number(acc.balance) : Number(acc.balance));
    }
    return sum;
  }, 0) || 0;

  const monthlyBalance = monthlyIncome - monthlyExpenses;
  const budgetProgress = monthlyIncome > 0 ? Math.min((monthlyExpenses / monthlyIncome) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Dashboard</h1>
          <p className="text-[#6B7280]">Resumen de tus finanzas personales</p>
        </div>
        <Button asChild>
          <Link href="/transactions">
            <Plus className="h-4 w-4 mr-2" />
            Nueva transacción
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Balance Total"
          value={formatCurrency(totalBalance)}
          icon={<Wallet className="h-5 w-5 text-primary-500" />}
          variant="gradient"
        />
        <StatCard
          title="Ingresos del Mes"
          value={formatCurrency(monthlyIncome)}
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          change={12.5}
        />
        <StatCard
          title="Gastos del Mes"
          value={formatCurrency(monthlyExpenses)}
          icon={<TrendingDown className="h-5 w-5 text-red-500" />}
          change={-8.3}
        />
        <StatCard
          title="Balance del Mes"
          value={formatCurrency(monthlyBalance)}
          icon={<ArrowUpDown className="h-5 w-5 text-secondary-500" />}
          change={monthlyBalance >= 0 ? 5.2 : -5.2}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Area - spans 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resumen Mensual</CardTitle>
              <Badge variant="info">Diciembre 2024</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-[#6B7280]">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Gráfico de tendencias próximamente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Progress Ring */}
        <Card>
          <CardHeader>
            <CardTitle>Presupuesto del Mes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-4">
            <ProgressRing
              progress={budgetProgress}
              size={160}
              strokeWidth={12}
              value={`${budgetProgress.toFixed(0)}%`}
              label="gastado"
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-[#6B7280]">
                Has gastado{" "}
                <span className="font-semibold text-[#1A1A2E]">
                  {formatCurrency(monthlyExpenses)}
                </span>
              </p>
              <p className="text-sm text-[#6B7280]">
                de{" "}
                <span className="font-semibold text-[#1A1A2E]">
                  {formatCurrency(monthlyIncome)}
                </span>{" "}
                ingresados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lower Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Accounts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mis Cuentas</CardTitle>
              <Link
                href="/accounts"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                Ver todas
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {accounts && accounts.length > 0 ? (
              <div className="space-y-3">
                {accounts.slice(0, 5).map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-11 w-11 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: account.color + "20" }}
                      >
                        <Wallet className="h-5 w-5" style={{ color: account.color }} />
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A2E]">{account.name}</p>
                        <p className="text-xs text-[#6B7280] capitalize">{account.type}</p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold ${
                        Number(account.balance) >= 0 ? "text-[#1A1A2E]" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(Number(account.balance), account.currency)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-[#6B7280] mb-3">No tienes cuentas configuradas</p>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/accounts">Agregar cuenta</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transacciones Recientes</CardTitle>
              <Link
                href="/transactions"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                Ver todas
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-1">
                {transactions.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    icon={tx.category?.icon || (tx.type === "income" ? "💰" : "💸")}
                    name={tx.description || tx.category?.name || "Sin descripción"}
                    category={tx.account?.name || "Sin cuenta"}
                    amount={tx.type === "income" ? Number(tx.amount) : -Number(tx.amount)}
                    date={tx.date}
                    currency="COP"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ArrowUpDown className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-[#6B7280] mb-3">No tienes transacciones aún</p>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/transactions">Agregar transacción</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
