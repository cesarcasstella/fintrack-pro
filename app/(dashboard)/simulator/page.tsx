import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sparkles, Zap } from "lucide-react";
import { SimulatorClient } from "./simulator-client";
import { Account, RecurringRule, Category } from "@/types/database";
import { theme } from "@/components/ui/design-system";

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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Simulador What-If</h1>
              <p className="text-white/70 text-sm">Experimenta con diferentes escenarios</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mt-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <p className="text-white/90 text-sm">
                Modifica variables y observa cómo impactan tu futuro financiero
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6">
        <SimulatorClient
          currentBalance={currentBalance}
          recurringRules={recurringRules || []}
          categories={categories || []}
        />
      </div>
    </div>
  );
}
