"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { theme } from "@/components/ui/design-system";

const accountTypes = [
  { value: "checking", label: "Cuenta Corriente", icon: "🏦" },
  { value: "savings", label: "Ahorros", icon: "🐷" },
  { value: "credit", label: "Tarjeta de Crédito", icon: "💳" },
  { value: "cash", label: "Efectivo", icon: "💵" },
  { value: "investment", label: "Inversiones", icon: "📈" },
  { value: "digital_wallet", label: "Billetera Digital", icon: "📱" },
];

const colors = [
  "#0D6B4B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899",
  "#F59E0B", "#EF4444", "#06B6D4", "#84CC16", "#6366F1",
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
    <div className="min-h-screen bg-gray-50 -m-4 md:-m-6">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Link
            href="/accounts"
            className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Nueva Cuenta</h1>
            <p className="text-sm text-gray-500">Agrega una cuenta financiera</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Name */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Nombre de la cuenta *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Ej: Bancolombia Ahorros"
              required
            />
          </div>

          {/* Account Type */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de cuenta
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {accountTypes.map((accType) => (
                <button
                  key={accType.value}
                  type="button"
                  onClick={() => setType(accType.value)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    type === accType.value
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <span className="text-2xl block mb-2">{accType.icon}</span>
                  <p className={`text-sm font-medium ${type === accType.value ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {accType.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Initial Balance */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Saldo inicial
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  $
                </span>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="0"
                />
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color de identificación
            </label>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-10 w-10 rounded-xl transition-all ${
                    color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && (
                    <Check className="w-5 h-5 text-white mx-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Include in total */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Incluir en balance total</p>
                <p className="text-sm text-gray-500">Suma esta cuenta al balance general</p>
              </div>
              <button
                type="button"
                onClick={() => setIncludeInTotal(!includeInTotal)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  includeInTotal ? "bg-emerald-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    includeInTotal ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] hover:shadow-lg hover:shadow-emerald-500/25"
            style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)` }}
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
