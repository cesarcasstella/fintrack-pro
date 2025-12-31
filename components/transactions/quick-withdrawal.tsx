"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QuickWithdrawalProps {
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    balance: number;
  }>;
}

export function QuickWithdrawal({ accounts }: QuickWithdrawalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");

  // Filter accounts
  const bankAccounts = accounts.filter(a => ["checking", "savings"].includes(a.type));
  const cashAccounts = accounts.filter(a => a.type === "cash");

  const handleWithdrawal = async () => {
    if (!amount || !fromAccountId || !toAccountId) {
      toast.error("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_id: fromAccountId,
          transfer_to_account_id: toAccountId,
          type: "transfer",
          amount: parseFloat(amount),
          description: "Retiro de cajero",
          source: "manual",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al registrar retiro");
      }

      toast.success(`Retiro de $${parseInt(amount).toLocaleString()} registrado`);
      setAmount("");
      router.refresh();
    } catch (error) {
      toast.error("Error al registrar el retiro");
    } finally {
      setLoading(false);
    }
  };

  if (cashAccounts.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-yellow-800 text-sm">
          Para usar retiros de cajero, primero crea una cuenta de tipo &quot;Efectivo&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
          <Banknote className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Retiro de Cajero</h3>
          <p className="text-sm text-gray-500">Transfiere de banco a efectivo</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Desde (Banco)
          </label>
          <select
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Selecciona cuenta</option>
            {bankAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} (${Number(acc.balance).toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hacia (Efectivo)
          </label>
          <select
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Selecciona billetera</option>
            {cashAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} (${Number(acc.balance).toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100000"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2">
          {[50000, 100000, 200000, 500000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val.toString())}
              className="flex-1 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              ${(val / 1000)}K
            </button>
          ))}
        </div>

        <button
          onClick={handleWithdrawal}
          disabled={loading || !amount || !fromAccountId || !toAccountId}
          className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <Banknote className="h-5 w-5" />
              Registrar Retiro
            </>
          )}
        </button>
      </div>
    </div>
  );
}
