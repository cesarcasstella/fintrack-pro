import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils/format";
import { Plus, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Account } from "@/types/database";
import { theme } from "@/components/ui/design-system";

const accountEmojis: Record<string, string> = {
  checking: "🏦",
  savings: "🐷",
  credit: "💳",
  cash: "💵",
  investment: "📈",
  digital_wallet: "📱",
};

const accountLabels: Record<string, string> = {
  checking: "Cuenta Corriente",
  savings: "Ahorros",
  credit: "Tarjeta de Crédito",
  cash: "Efectivo",
  investment: "Inversiones",
  digital_wallet: "Billetera Digital",
};

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: true }) as { data: Account[] | null };

  const totalBalance = accounts?.reduce((sum, acc) => {
    if (acc.include_in_total && acc.is_active) {
      return sum + (acc.type === "credit" ? -Number(acc.balance) : Number(acc.balance));
    }
    return sum;
  }, 0) || 0;

  const activeAccounts = accounts?.filter((a) => a.is_active) || [];
  const positiveBalance = totalBalance >= 0;

  return (
    <div className="min-h-screen bg-gray-50 -m-4 md:-m-6">
      {/* Gradient Header */}
      <div
        className="px-5 pt-14 pb-8 rounded-b-[2rem] relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)` }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Mis Cuentas</h1>
              <p className="text-white/70 text-sm">Administra tus cuentas financieras</p>
            </div>
            <Link
              href="/accounts/new"
              className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl font-medium hover:bg-white/30 transition-all border border-white/10"
            >
              <Plus className="h-5 w-5" />
              Nueva
            </Link>
          </div>

          {/* Balance Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <p className="text-white/70 text-sm font-medium">Balance Total</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-3xl font-bold text-white">{formatCurrency(totalBalance)}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${positiveBalance ? 'bg-emerald-400/20' : 'bg-red-400/20'}`}>
                {positiveBalance ? (
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-300" />
                )}
              </div>
            </div>
            <p className="text-white/60 text-sm mt-2">
              {activeAccounts.length} cuenta{activeAccounts.length !== 1 ? 's' : ''} activa{activeAccounts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-4">
        {accounts && accounts.length > 0 ? (
          <>
            {accounts.map((account) => (
              <Link
                key={account.id}
                href={`/accounts/${account.id}`}
                className={`block bg-white rounded-3xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                  !account.is_active ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: (account.color || '#0D6B4B') + "15" }}
                  >
                    {accountEmojis[account.type] || account.icon || "🏦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{account.name}</h3>
                      {!account.is_active && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          Inactiva
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{accountLabels[account.type] || account.type}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        Number(account.balance) >= 0 ? "text-gray-900" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(Number(account.balance), account.currency)}
                    </p>
                    <ChevronRight className="w-5 h-5 text-gray-300 ml-auto mt-1" />
                  </div>
                </div>
              </Link>
            ))}
          </>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes cuentas
            </h3>
            <p className="text-gray-500 mb-6">
              Agrega tu primera cuenta para empezar a rastrear tus finanzas.
            </p>
            <Link
              href="/accounts/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition-all active:scale-[0.98] hover:shadow-lg hover:shadow-emerald-500/25"
              style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)` }}
            >
              <Plus className="h-5 w-5" />
              Crear Cuenta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
