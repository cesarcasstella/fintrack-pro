"use client";

import { Transaction, Account, Category } from "@/types/database";
import { formatCurrency } from "@/lib/utils/format";
import { ArrowUpDown } from "lucide-react";

interface TransactionWithRelations extends Transaction {
  account: Pick<Account, "id" | "name" | "color"> | null;
  category: Pick<Category, "id" | "name" | "icon" | "color"> | null;
}

interface TransactionListProps {
  transactions: TransactionWithRelations[];
  accounts: Pick<Account, "id" | "name" | "color" | "type">[];
  categories: Pick<Category, "id" | "name" | "icon" | "color" | "type">[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <ArrowUpDown className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay transacciones
        </h3>
        <p className="text-gray-500">
          Agrega tu primera transacción o envía un mensaje por WhatsApp.
        </p>
      </div>
    );
  }

  // Group transactions by date
  const grouped = transactions.reduce((acc, tx) => {
    const dateKey = new Date(tx.date).toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(tx);
    return acc;
  }, {} as Record<string, TransactionWithRelations[]>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, txs]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-gray-500 mb-3 capitalize">
            {date}
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {txs.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionItem({ transaction: tx }: { transaction: TransactionWithRelations }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center text-lg"
          style={{
            backgroundColor: (tx.category?.color || "#6B7280") + "20",
            color: tx.category?.color || "#6B7280",
          }}
        >
          {tx.type === "income" ? "+" : tx.type === "transfer" ? "↔" : "-"}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {tx.description || tx.category?.name || "Sin descripción"}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{tx.category?.name || "Sin categoría"}</span>
            <span>•</span>
            <span>{tx.account?.name}</span>
            {tx.source !== "manual" && (
              <>
                <span>•</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">
                  {tx.source}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <p
        className={`font-semibold text-lg ${
          tx.type === "income"
            ? "text-emerald-600"
            : tx.type === "transfer"
            ? "text-blue-600"
            : "text-red-600"
        }`}
      >
        {tx.type === "income" ? "+" : tx.type === "transfer" ? "" : "-"}
        {formatCurrency(Number(tx.amount))}
      </p>
    </div>
  );
}
