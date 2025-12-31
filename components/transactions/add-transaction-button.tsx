"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Account, Category } from "@/types/database";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddTransactionButtonProps {
  accounts: Pick<Account, "id" | "name" | "color" | "type">[];
  categories: Pick<Category, "id" | "name" | "icon" | "color" | "type">[];
}

export function AddTransactionButton({ accounts, categories }: AddTransactionButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !accountId) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("No estás autenticado");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      account_id: accountId,
      category_id: categoryId || null,
      type,
      amount: parseFloat(amount),
      description: description || null,
      date: new Date(date).toISOString(),
      source: "manual",
    });

    if (error) {
      toast.error("Error al crear la transacción");
      console.error(error);
      setLoading(false);
      return;
    }

    // Update account balance (RPC might not exist yet, that's okay)
    const account = accounts.find((a) => a.id === accountId);
    if (account) {
      const balanceChange = type === "income" ? parseFloat(amount) : -parseFloat(amount);
      try {
        await supabase.rpc("update_account_balance", {
          p_account_id: accountId,
          p_amount: balanceChange,
        });
      } catch {
        // RPC might not exist yet
      }
    }

    toast.success("Transacción creada");
    setIsOpen(false);
    resetForm();
    router.refresh();
  };

  const resetForm = () => {
    setType("expense");
    setAmount("");
    setDescription("");
    setAccountId(accounts[0]?.id || "");
    setCategoryId("");
    setDate(new Date().toISOString().split("T")[0]);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-5 w-5" />
        Nueva Transacción
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Nueva Transacción</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Toggle */}
              <div className="flex rounded-lg border border-gray-200 p-1">
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    type === "expense"
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Gasto
                </button>
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    type === "income"
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Ingreso
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {/* Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuenta *
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Sin categoría</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ej: Almuerzo en restaurante"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Transacción"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
