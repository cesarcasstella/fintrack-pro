import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils/format";
import { Banknote, Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { QuickWithdrawal } from "@/components/transactions/quick-withdrawal";

export default async function CashPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch all accounts
  const { data: allAccounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("is_active", true);

  // Filter cash accounts
  const cashAccounts = allAccounts?.filter(a => a.type === "cash") || [];

  // Get cash transactions (transfers to/from cash accounts)
  const cashAccountIds = cashAccounts.map(a => a.id);

  let cashTransactions = null;
  if (cashAccountIds.length > 0) {
    const { data } = await supabase
      .from("transactions")
      .select(`
        *,
        account:accounts!left(name, type),
        category:categories!left(name, icon)
      `)
      .or(`account_id.in.(${cashAccountIds.join(',')}),transfer_to_account_id.in.(${cashAccountIds.join(',')})`)
      .order("date", { ascending: false })
      .limit(20);
    cashTransactions = data;
  }

  const totalCash = cashAccounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Efectivo</h1>
          <p className="text-gray-600">Gestiona tu dinero en efectivo</p>
        </div>
        <Link
          href="/accounts/new"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nueva Billetera
        </Link>
      </div>

      {/* Total Cash Card */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Banknote className="h-6 w-6" />
          <p className="text-green-100 font-medium">Efectivo Total</p>
        </div>
        <p className="text-4xl font-bold">{formatCurrency(totalCash)}</p>
        <p className="text-green-100 text-sm mt-2">
          {cashAccounts.length} billetera{cashAccounts.length !== 1 ? 's' : ''} activa{cashAccounts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Withdrawal */}
        <QuickWithdrawal accounts={allAccounts || []} />

        {/* Cash Wallets */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Billeteras</h2>
          {cashAccounts.length > 0 ? (
            <div className="space-y-3">
              {cashAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Banknote className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <p className="text-sm text-gray-500">Efectivo</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(Number(account.balance))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Banknote className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tienes billeteras de efectivo</p>
              <Link
                href="/accounts/new"
                className="text-green-600 hover:underline text-sm mt-2 inline-block"
              >
                Crear billetera
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Cash Movements */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Movimientos Recientes</h2>
        {cashTransactions && cashTransactions.length > 0 ? (
          <div className="space-y-3">
            {cashTransactions.map((tx) => {
              const isInflow = cashAccountIds.includes(tx.transfer_to_account_id) ||
                              (tx.type === "income" && cashAccountIds.includes(tx.account_id));
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      isInflow ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {isInflow ? (
                        <ArrowDownLeft className={`h-5 w-5 text-green-600`} />
                      ) : (
                        <ArrowUpRight className={`h-5 w-5 text-red-600`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {tx.description || (tx.type === "transfer" ? "Retiro/Depósito" : tx.category?.name || "Sin categoría")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.date).toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className={`font-semibold ${isInflow ? "text-green-600" : "text-red-600"}`}>
                    {isInflow ? "+" : "-"}{formatCurrency(Number(tx.amount))}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No hay movimientos de efectivo</p>
        )}
      </div>
    </div>
  );
}
