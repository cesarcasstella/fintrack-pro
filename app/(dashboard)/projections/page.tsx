import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { generateProjections } from "@/lib/projections/engine";
import { formatCurrency } from "@/lib/utils/format";
import { TrendingUp, TrendingDown, AlertTriangle, Calendar } from "lucide-react";
import { ProjectionsChart } from "./projections-chart";
import { Account, RecurringRule, Transaction } from "@/types/database";

export default async function ProjectionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch accounts for current balance
  const { data: accounts } = await supabase
    .from("accounts")
    .select("balance, type, include_in_total")
    .eq("is_active", true) as { data: Pick<Account, "balance" | "type" | "include_in_total">[] | null };

  const currentBalance = accounts?.reduce((sum, acc) => {
    if (acc.include_in_total) {
      return sum + (acc.type === "credit" ? -Number(acc.balance) : Number(acc.balance));
    }
    return sum;
  }, 0) || 0;

  // Fetch recurring rules
  const { data: recurringRules } = await supabase
    .from("recurring_rules")
    .select("*")
    .eq("is_active", true) as { data: RecurringRule[] | null };

  // Fetch historical transactions (last 90 days for analysis)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .gte("date", ninetyDaysAgo.toISOString()) as { data: Transaction[] | null };

  // Generate 90-day projection
  const projection = generateProjections({
    startBalance: currentBalance,
    recurringRules: recurringRules || [],
    historicalTransactions: transactions || [],
    projectionDays: 90,
  });

  const hasRecurringRules = (recurringRules?.length || 0) > 0;
  const isBalanceCritical = projection.summary.lowestBalance < 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Proyecciones</h1>
        <p className="text-gray-600">Visualiza tu futuro financiero a 90 días</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Balance Actual"
          value={formatCurrency(projection.summary.startBalance)}
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
        />
        <SummaryCard
          title="Balance Proyectado (90 días)"
          value={formatCurrency(projection.summary.endBalance)}
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          valueClassName={projection.summary.netChange >= 0 ? "text-emerald-600" : "text-red-600"}
        />
        <SummaryCard
          title="Ingresos Proyectados"
          value={formatCurrency(projection.summary.totalIncome)}
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          valueClassName="text-emerald-600"
        />
        <SummaryCard
          title="Gastos Proyectados"
          value={formatCurrency(projection.summary.totalExpenses)}
          icon={<TrendingDown className="h-5 w-5 text-red-600" />}
          valueClassName="text-red-600"
        />
      </div>

      {/* Alert if balance goes negative */}
      {isBalanceCritical && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Alerta de Balance</h3>
            <p className="text-sm text-red-700 mt-1">
              Tu balance proyectado caerá a{" "}
              <strong>{formatCurrency(projection.summary.lowestBalance)}</strong> el{" "}
              {new Date(projection.summary.lowestBalanceDate).toLocaleDateString("es-CO", {
                day: "numeric",
                month: "long",
              })}
              . Considera revisar tus gastos o agregar ingresos.
            </p>
          </div>
        </div>
      )}

      {/* Projection Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Proyección de Balance</h2>
        {hasRecurringRules ? (
          <ProjectionsChart points={projection.points} />
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sin reglas recurrentes
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Agrega gastos e ingresos recurrentes (como arriendo, salario, servicios)
              para ver proyecciones más precisas de tu futuro financiero.
            </p>
          </div>
        )}
      </div>

      {/* Recurring Rules Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Transacciones Recurrentes</h2>
        {hasRecurringRules ? (
          <div className="divide-y divide-gray-100">
            {recurringRules?.map((rule) => (
              <div key={rule.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{rule.description}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {rule.frequency === "monthly" ? "Mensual" :
                     rule.frequency === "weekly" ? "Semanal" :
                     rule.frequency === "biweekly" ? "Quincenal" :
                     rule.frequency === "yearly" ? "Anual" : rule.frequency}
                  </p>
                </div>
                <p className={`font-semibold ${rule.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                  {rule.type === "income" ? "+" : "-"}{formatCurrency(Number(rule.amount))}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No tienes transacciones recurrentes configuradas.
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  valueClassName = "",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon}
      </div>
      <p className={`text-2xl font-bold mt-2 ${valueClassName}`}>{value}</p>
    </div>
  );
}
