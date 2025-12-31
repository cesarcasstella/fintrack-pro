"use client";

import { ProjectionPoint } from "@/lib/projections/engine";
import { formatCurrency } from "@/lib/utils/format";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface ProjectionsChartProps {
  points: ProjectionPoint[];
}

export function ProjectionsChart({ points }: ProjectionsChartProps) {
  // Sample every 7 days for cleaner chart
  const sampledPoints = points.filter((_, index) => index % 7 === 0 || index === points.length - 1);

  const chartData = sampledPoints.map((point) => ({
    date: point.date,
    balance: point.balance,
    formattedDate: format(parseISO(point.date), "d MMM", { locale: es }),
  }));

  const minBalance = Math.min(...chartData.map((d) => d.balance));
  const maxBalance = Math.max(...chartData.map((d) => d.balance));
  const yDomain = [
    Math.min(0, minBalance * 1.1),
    maxBalance * 1.1,
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="formattedDate"
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            domain={yDomain}
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
              return `$${value}`;
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <p className="text-sm text-gray-500">
                      {format(parseISO(data.date), "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(data.balance)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#3B82F6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
