import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Wallet, TrendingUp, TrendingDown, ArrowUpDown, Plus, ArrowRight, MessageCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";
import { Account, Transaction, Category } from "@/types/database";

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
      account:accounts(name, color),
      category:categories(name, icon, color)
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

  const accountIcons: Record<string, string> = {
    checking: "🏦",
    savings: "🐷",
    credit: "💳",
    cash: "💵",
    investment: "📈",
    bank: "🏦",
    digital_wallet: "📱",
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Balance Card */}
      <div className="balance-card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm font-medium">Patrimonio Total</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
            <p className="text-white/60 text-sm mt-1">COP</p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Link
            href="/transactions?action=new&type=expense"
            className="flex-1 bg-white/20 backdrop-blur hover:bg-white/30 rounded-xl py-3 text-center font-medium transition-colors"
          >
            Agregar Gasto
          </Link>
          <Link
            href="/transactions?action=new&type=income"
            className="flex-1 bg-white/20 backdrop-blur hover:bg-white/30 rounded-xl py-3 text-center font-medium transition-colors"
          >
            Agregar Ingreso
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-success/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-success text-sm font-medium">Ingresos</span>
          </div>
          <p className="text-2xl font-bold text-success">{formatCurrency(monthlyIncome)}</p>
          <p className="text-xs text-gray-500 mt-1">Este mes</p>
        </div>
        <div className="bg-danger/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-danger" />
            <span className="text-danger text-sm font-medium">Gastos</span>
          </div>
          <p className="text-2xl font-bold text-danger">{formatCurrency(monthlyExpenses)}</p>
          <p className="text-xs text-gray-500 mt-1">Este mes</p>
        </div>
      </div>

      {/* Accounts Horizontal Scroll */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Mis Cuentas</h2>
          <Link href="/accounts" className="text-sm text-primary font-medium flex items-center gap-1">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {accounts && accounts.length > 0 ? (
            <>
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="account-card"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    {accountIcons[account.type] || "💳"}
                  </div>
                  <p className="font-medium text-gray-900 truncate">{account.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{account.currency}</p>
                  <p className={`font-bold ${Number(account.balance) >= 0 ? "text-gray-900" : "text-danger"}`}>
                    {formatCurrency(Number(account.balance), account.currency)}
                  </p>
                </div>
              ))}
              <Link
                href="/accounts/new"
                className="flex-shrink-0 w-40 rounded-2xl p-4 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Agregar</span>
              </Link>
            </>
          ) : (
            <Link
              href="/accounts/new"
              className="flex-1 rounded-2xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="h-10 w-10 mb-2" />
              <span className="font-medium">Agregar primera cuenta</span>
            </Link>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card-billza p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recientes</h2>
          <Link href="/transactions" className="text-sm text-primary font-medium flex items-center gap-1">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {transactions && transactions.length > 0 ? (
          <div className="space-y-1">
            {transactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                    style={{ 
                      backgroundColor: tx.type === "income" ? "#D1FAE5" : "#FEE2E2"
                    }}
                  >
                    {tx.category?.icon || (tx.type === "income" ? "💰" : "💸")}
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
                <p className={`font-semibold ${tx.type === "income" ? "text-success" : "text-danger"}`}>
                  {tx.type === "income" ? "+" : "-"}{formatCurrency(Number(tx.amount))}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ArrowUpDown className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 mb-3">No tienes transacciones aún</p>
            <Link
              href="/transactions?action=new"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <Plus className="h-4 w-4" />
              Agregar primera transacción
            </Link>
          </div>
        )}
      </div>

      {/* WhatsApp CTA */}
      <Link href="/settings/whatsapp" className="block whatsapp-cta">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">Registra por WhatsApp</p>
            <p className="text-white/80 text-sm">Envía "Almuerzo 25000" y listo</p>
          </div>
          <ArrowRight className="h-5 w-5 text-white/80" />
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/projections" className="card-billza p-4 flex items-center gap-3 hover:shadow-md">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Proyecciones</p>
            <p className="text-xs text-gray-500">Ver a 12 meses</p>
          </div>
        </Link>
        <Link href="/simulator" className="card-billza p-4 flex items-center gap-3 hover:shadow-md">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <ArrowUpDown className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Simulador</p>
            <p className="text-xs text-gray-500">¿Qué pasaría si...?</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
