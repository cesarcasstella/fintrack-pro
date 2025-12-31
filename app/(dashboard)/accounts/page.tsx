import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils/format";
import { Wallet, Plus, CreditCard, PiggyBank, Banknote, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Account } from "@/types/database";

const accountIcons: Record<string, React.ReactNode> = {
  checking: <Wallet className="h-5 w-5" />,
  savings: <PiggyBank className="h-5 w-5" />,
  credit: <CreditCard className="h-5 w-5" />,
  cash: <Banknote className="h-5 w-5" />,
  investment: <TrendingUp className="h-5 w-5" />,
};

const accountLabels: Record<string, string> = {
  checking: "Cuenta Corriente",
  savings: "Ahorros",
  credit: "Tarjeta de Crédito",
  cash: "Efectivo",
  investment: "Inversiones",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cuentas</h1>
          <p className="text-gray-600">Administra tus cuentas financieras</p>
        </div>
        <Link
          href="/accounts/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nueva Cuenta
        </Link>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <p className="text-blue-100 text-sm font-medium">Balance Total</p>
        <p className="text-3xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
        <p className="text-blue-100 text-sm mt-2">
          {accounts?.filter((a) => a.is_active).length || 0} cuentas activas
        </p>
      </div>

      {/* Accounts Grid */}
      {accounts && accounts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`bg-white rounded-xl border border-gray-200 p-6 ${
                !account.is_active ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: account.color + "20" }}
                >
                  <span style={{ color: account.color }}>
                    {accountIcons[account.type]}
                  </span>
                </div>
                {!account.is_active && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Inactiva
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mt-4">{account.name}</h3>
              <p className="text-sm text-gray-500">{accountLabels[account.type]}</p>
              <p
                className={`text-2xl font-bold mt-3 ${
                  Number(account.balance) >= 0 ? "text-gray-900" : "text-red-600"
                }`}
              >
                {formatCurrency(Number(account.balance), account.currency)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes cuentas
          </h3>
          <p className="text-gray-500 mb-4">
            Agrega tu primera cuenta para empezar a rastrear tus finanzas.
          </p>
          <Link
            href="/accounts/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Crear Cuenta
          </Link>
        </div>
      )}
    </div>
  );
}
