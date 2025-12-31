import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TransactionList } from "@/components/transactions/transaction-list";
import { AddTransactionButton } from "@/components/transactions/add-transaction-button";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch transactions with related data
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      account:accounts(id, name, color),
      category:categories(id, name, icon, color)
    `)
    .order("date", { ascending: false })
    .limit(50);

  // Fetch accounts and categories for the form
  const { data: accounts } = await supabase
    .from("accounts")
    .select("id, name, color, type")
    .eq("is_active", true)
    .order("name");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, icon, color, type")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transacciones</h1>
          <p className="text-gray-600">Historial de ingresos y gastos</p>
        </div>
        <AddTransactionButton accounts={accounts || []} categories={categories || []} />
      </div>

      <TransactionList 
        transactions={transactions || []} 
        accounts={accounts || []}
        categories={categories || []}
      />
    </div>
  );
}
