import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Category } from "@/types/database";
import { theme } from "@/components/ui/design-system";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("type")
    .order("sort_order") as { data: Category[] | null };

  const expenseCategories = categories?.filter((c) => c.type === "expense") || [];
  const incomeCategories = categories?.filter((c) => c.type === "income") || [];

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Categorías</h1>
              <p className="text-white/70 text-sm">Organiza tus transacciones</p>
            </div>
            <button
              className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl font-medium hover:bg-white/30 transition-all border border-white/10"
            >
              <Plus className="h-5 w-5" />
              Nueva
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-white/70" />
                <span className="text-white/70 text-sm">Gastos</span>
              </div>
              <p className="text-2xl font-bold text-white">{expenseCategories.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-white/70" />
                <span className="text-white/70 text-sm">Ingresos</span>
              </div>
              <p className="text-2xl font-bold text-white">{incomeCategories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-6">
        {/* Expense Categories */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Gastos</h2>
            <span className="text-sm text-gray-400 ml-auto">{expenseCategories.length} categorías</span>
          </div>

          {expenseCategories.length > 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y divide-gray-50">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: (cat.color || '#EF4444') + "15" }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{cat.name}</p>
                      {cat.budget_amount && (
                        <p className="text-sm text-gray-500">
                          Presupuesto: ${Number(cat.budget_amount).toLocaleString("es-CO")}
                        </p>
                      )}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📦</span>
              </div>
              <p className="text-gray-500 text-sm">No hay categorías de gastos</p>
              <button className="mt-3 text-emerald-600 font-medium text-sm hover:underline">
                + Agregar categoría
              </button>
            </div>
          )}
        </div>

        {/* Income Categories */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Ingresos</h2>
            <span className="text-sm text-gray-400 ml-auto">{incomeCategories.length} categorías</span>
          </div>

          {incomeCategories.length > 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y divide-gray-50">
              {incomeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: (cat.color || '#10B981') + "15" }}
                    >
                      {cat.icon}
                    </div>
                    <p className="font-medium text-gray-900">{cat.name}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">💰</span>
              </div>
              <p className="text-gray-500 text-sm">No hay categorías de ingresos</p>
              <button className="mt-3 text-emerald-600 font-medium text-sm hover:underline">
                + Agregar categoría
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
