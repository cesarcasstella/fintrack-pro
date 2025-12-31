import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Tags, Plus } from "lucide-react";
import { Category } from "@/types/database";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600">Organiza tus transacciones por categoría</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5" />
          Nueva Categoría
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Expense Categories */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Gastos
          </h2>
          {expenseCategories.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: cat.color + "20" }}
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
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Tags className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No hay categorías de gastos</p>
            </div>
          )}
        </div>

        {/* Income Categories */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Ingresos
          </h2>
          {incomeCategories.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {incomeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: cat.color + "20" }}
                    >
                      {cat.icon}
                    </div>
                    <p className="font-medium text-gray-900">{cat.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Tags className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No hay categorías de ingresos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
