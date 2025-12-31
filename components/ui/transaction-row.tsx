import * as React from "react";
import { cn } from "@/lib/utils";

export interface TransactionRowProps {
  icon?: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  currency?: string;
  className?: string;
}

function TransactionRow({
  icon = "💰",
  name,
  category,
  amount,
  date,
  currency = "COP",
  className,
}: TransactionRowProps) {
  const isPositive = amount >= 0;

  const formatAmount = (value: number, curr: string) => {
    const absValue = Math.abs(value);
    return absValue.toLocaleString("es-CO", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 px-2 rounded-xl transition-all duration-200 hover:bg-gray-50 group",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gray-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
        <div>
          <p className="font-medium text-[#1A1A2E]">{name}</p>
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <span>{category}</span>
            <span className="text-gray-300">•</span>
            <span>{formatDate(date)}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p
          className={cn(
            "font-semibold",
            isPositive ? "text-emerald-600" : "text-red-600"
          )}
        >
          {isPositive ? "+" : "-"}
          {formatAmount(amount, currency)}
        </p>
      </div>
    </div>
  );
}

export { TransactionRow };
