import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calculator } from "lucide-react";
import { SimulatorClient } from "./simulator-client";
import { Account, RecurringRule, Category } from "@/types/database";

export default async function SimulatorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch accounts for current balance
  const { data: accounts } = await supabase
    .from("accounts")
    .select("id, name, balance, type, include_in_total, currency")
    .eq("is_active", true) as { data: Pick<Account, "id" | "name" | "balance" | "type" | "include_in_total" | "currency">[] | null };

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

  // Fetch categories for the form
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, type, color")
    .order("sort_order") as { data: Pick<Category, "id" | "name" | "type" | "color">[] | null };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Simulador What-If</h1>
        <p className="text-gray-600">
          Experimenta con diferentes escenarios financieros
        </p>
      </div>

      <SimulatorClient
        currentBalance={currentBalance}
        recurringRules={recurringRules || []}
        categories={categories || []}
      />
    </div>
  );
}
