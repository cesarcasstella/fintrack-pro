import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  variant?: "default" | "gradient";
  className?: string;
}

function StatCard({
  title,
  value,
  change,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const isGradient = variant === "gradient";

  return (
    <div
      className={cn(
        "rounded-3xl p-6 transition-all duration-300 hover:shadow-xl",
        isGradient
          ? "bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5] text-white shadow-lg"
          : "bg-white border border-gray-100 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-sm font-medium",
            isGradient ? "text-white/80" : "text-[#6B7280]"
          )}
        >
          {title}
        </p>
        {icon && (
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center",
              isGradient ? "bg-white/20" : "bg-gray-50"
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <p
        className={cn(
          "text-2xl font-bold mt-3",
          isGradient ? "text-white" : "text-[#1A1A2E]"
        )}
      >
        {value}
      </p>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {isPositive ? (
            <TrendingUp
              className={cn(
                "h-4 w-4",
                isGradient ? "text-white" : "text-emerald-500"
              )}
            />
          ) : (
            <TrendingDown
              className={cn(
                "h-4 w-4",
                isGradient ? "text-white" : "text-red-500"
              )}
            />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              isGradient
                ? "text-white"
                : isPositive
                ? "text-emerald-600"
                : "text-red-600"
            )}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(1)}%
          </span>
          <span
            className={cn(
              "text-sm",
              isGradient ? "text-white/70" : "text-[#6B7280]"
            )}
          >
            vs mes anterior
          </span>
        </div>
      )}
    </div>
  );
}

export { StatCard };
