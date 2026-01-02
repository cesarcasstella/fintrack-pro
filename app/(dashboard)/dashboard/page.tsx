import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  Wallet, TrendingUp, TrendingDown, Plus, ArrowRight, 
  MessageCircle, Search, Bell, ArrowUpRight, ArrowDownLeft,
  Sparkles, Target, ChevronRight
} from "lucide-react";
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

  // Get current month transactions
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

  // Get user profile for greeting
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Usuario";
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const accountIcons: Record<string, string> = {
    checking: "🏦", savings: "🐷", credit: "💳", cash: "💵",
    investment: "📈", bank: "🏦", digital_wallet: "📱",
  };

  return (
    <div className="min-h-screen bg-gray-50 -m-4 md:-m-6 pb-8">
      {/* Header con Gradiente */}
      <div 
        className="px-5 pt-14 pb-12 rounded-b-[2.5rem] relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D6B4B 0%, #084D35 100%)" }}
      >
        {/* Círculos decorativos */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <span className="text-white font-bold">
                {displayName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-emerald-100 text-xs font-medium">{getGreeting()},</p>
              <h1 className="text-white font-bold text-lg leading-tight">{displayName}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
              <Search className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full" />
            </button>
          </div>
        </div>

        {/* Balance Principal */}
        <div className="relative z-10">
          <p className="text-emerald-100/80 text-sm mb-1 font-medium">Patrimonio Total</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-white tracking-tight">
              {formatCurrency(totalBalance)}
            </h2>
          </div>
          <p className="text-emerald-200/60 text-sm mt-1">COP</p>
          
          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <Link 
              href="/transactions?action=new&type=income"
              className="flex-1 bg-white text-emerald-900 py-3.5 px-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              Ingreso
            </Link>
            <Link 
              href="/transactions?action=new&type=expense"
              className="flex-1 bg-emerald-800/50 backdrop-blur-md text-white py-3.5 px-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border border-white/10 hover:bg-emerald-800/70 transition-all active:scale-[0.98]"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
              Gasto
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="px-5 -mt-6 relative z-20 space-y-6">
        
        {/* Quick Stats - Ingresos/Gastos del mes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-emerald-700 text-sm font-medium">Ingresos</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{formatCurrency(monthlyIncome)}</p>
            <p className="text-xs text-emerald-600/70 mt-1">Este mes</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-red-700 text-sm font-medium">Gastos</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{formatCurrency(monthlyExpenses)}</p>
            <p className="text-xs text-red-600/70 mt-1">Este mes</p>
          </div>
        </div>

        {/* Accesos Rápidos - Features */}
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/projections"
            className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Proyecciones</h3>
            <p className="text-xs text-gray-500 mt-0.5">Ver a 12 meses</p>
          </Link>

          <Link 
            href="/simulator"
            className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-3 right-3">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Simulador</h3>
            <p className="text-xs text-gray-500 mt-0.5">¿Qué pasaría si...?</p>
          </Link>
        </div>

        {/* Mis Cuentas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Mis Cuentas</h3>
            <Link href="/accounts" className="text-sm text-emerald-600 font-medium flex items-center gap-1">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Horizontal scroll de cuentas */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
            {accounts && accounts.length > 0 ? (
              <>
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex-shrink-0 w-36 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3"
                      style={{ backgroundColor: `${account.color}15` }}
                    >
                      {accountIcons[account.type] || "💳"}
                    </div>
                    <p className="font-semibold text-gray-900 text-sm truncate">{account.name}</p>
                    <p className="text-xs text-gray-400 mb-2">{account.currency}</p>
                    <p className={`font-bold text-sm ${Number(account.balance) >= 0 ? "text-gray-900" : "text-red-600"}`}>
                      {formatCurrency(Number(account.balance), account.currency)}
                    </p>
                  </div>
                ))}
                <Link
                  href="/accounts/new"
                  className="flex-shrink-0 w-36 rounded-2xl p-4 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                >
                  <Plus className="w-8 h-8 mb-1" />
                  <span className="text-xs font-medium">Agregar</span>
                </Link>
              </>
            ) : (
              <Link
                href="/accounts/new"
                className="flex-1 rounded-2xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
              >
                <Plus className="w-10 h-10 mb-2" />
                <span className="font-medium">Agregar primera cuenta</span>
              </Link>
            )}
          </div>
        </div>

        {/* Transacciones Recientes */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="font-bold text-gray-900">Recientes</h3>
            <Link href="/transactions" className="text-sm text-emerald-600 font-medium flex items-center gap-1">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {transactions && transactions.length > 0 ? (
            <div>
              {transactions.map((tx, idx) => (
                <div 
                  key={tx.id} 
                  className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors ${
                    idx !== transactions.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg"
                    style={{ 
                      backgroundColor: tx.type === "income" ? "#ECFDF5" : "#FEF2F2"
                    }}
                  >
                    {tx.category?.icon || (tx.type === "income" ? "💰" : "💸")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
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
                  <p className={`font-bold ${tx.type === "income" ? "text-emerald-600" : "text-gray-900"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(Number(tx.amount))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-5">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-3">No tienes transacciones aún</p>
              <Link
                href="/transactions?action=new"
                className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:underline"
              >
                <Plus className="w-4 h-4" />
                Agregar primera transacción
              </Link>
            </div>
          )}
        </div>

        {/* WhatsApp CTA */}
        <Link 
          href="/settings/whatsapp" 
          className="block bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-3xl p-5 relative overflow-hidden hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-[0.99]"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-lg">Modo WhatsApp</h4>
              <p className="text-white/80 text-sm">
                Envía "Almuerzo 25k" para registrar
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-white/60" />
          </div>
        </Link>

      </div>
    </div>
  );
}
