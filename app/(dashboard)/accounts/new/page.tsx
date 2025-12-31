"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const accountTypes = [
  { value: "checking", label: "Cuenta Corriente", icon: "🏦" },
  { value: "savings", label: "Ahorros", icon: "🐷" },
  { value: "credit", label: "Tarjeta de Crédito", icon: "💳" },
  { value: "cash", label: "Efectivo", icon: "💵" },
  { value: "investment", label: "Inversiones", icon: "📈" },
];

const colors = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
];

export default function NewAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("checking");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("COP");
  const [color, setColor] = useState(colors[0]);
  const [includeInTotal, setIncludeInTotal] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type,
          balance: parseFloat(balance) || 0,
          currency,
          color,
          icon: accountTypes.find((t) => t.value === type)?.icon || "🏦",
          include_in_total: includeInTotal,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al crear la cuenta");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear la cuenta");
      setLoading(false);
      return;
    }

    toast.success("Cuenta creada exitosamente");
    router.push("/accounts");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/accounts"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a cuentas
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Cuenta</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la cuenta *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ej: Bancolombia Ahorros"
              required
            />
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de cuenta
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {accountTypes.map((accType) => (
                <button
                  key={accType.value}
                  type="button"
                  onClick={() => setType(accType.value)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    type === accType.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl">{accType.icon}</span>
                  <p className="text-sm font-medium mt-1">{accType.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Initial Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saldo inicial
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0"
                />
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="COP">COP</option>
                <option value="USD">USD</option>
                <option value="MXN">MXN</option>
                <option value="ARS">ARS</option>
                <option value="PEN">PEN</option>
                <option value="CLP">CLP</option>
              </select>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Include in total */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeInTotal"
              checked={includeInTotal}
              onChange={(e) => setIncludeInTotal(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="includeInTotal" className="text-sm text-gray-700">
              Incluir en el balance total
            </label>
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
                Creando...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
