"use client";

import { useState, useMemo } from "react";
import { RecurringRule, Category } from "@/types/database";
import { generateProjections, ProjectionResult } from "@/lib/projections/engine";
import { formatCurrency } from "@/lib/utils/format";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Trash2, TrendingUp, TrendingDown, Calculator } from "lucide-react";

interface SimulatorClientProps {
  currentBalance: number;
  recurringRules: RecurringRule[];
  categories: Pick<Category, "id" | "name" | "type" | "color">[];
}

interface Scenario {
  id: string;
  name: string;
  type: "add_expense" | "add_income" | "modify_balance";
  amount: number;
  frequency: "once" | "monthly" | "weekly";
  description: string;
}

export function SimulatorClient({
  currentBalance,
  recurringRules,
  categories,
}: SimulatorClientProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [projectionDays, setProjectionDays] = useState(90);

  // Calculate base projection
  const baseProjection = useMemo(() => {
    return generateProjections({
      startBalance: currentBalance,
      recurringRules,
      historicalTransactions: [],
      projectionDays,
    });
  }, [currentBalance, recurringRules, projectionDays]);

  // Calculate scenario projection
  const scenarioProjection = useMemo(() => {
    // Modify recurring rules based on scenarios
    const modifiedRules = [...recurringRules];
    let modifiedBalance = currentBalance;

    for (const scenario of scenarios) {
      if (scenario.type === "modify_balance") {
        modifiedBalance += scenario.amount;
      } else if (scenario.frequency === "monthly") {
        const newRule: RecurringRule = {
          id: scenario.id,
          user_id: "",
          account_id: "",
          category_id: null,
          type: scenario.type === "add_income" ? "income" : "expense",
          amount: scenario.amount,
          description: scenario.description,
          frequency: "monthly",
          interval_count: 1,
          day_of_month: new Date().getDate(),
          day_of_week: null,
          start_date: new Date().toISOString(),
          end_date: null,
          next_occurrence: new Date().toISOString(),
          last_generated: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        modifiedRules.push(newRule);
      } else if (scenario.frequency === "weekly") {
        const newRule: RecurringRule = {
          id: scenario.id,
          user_id: "",
          account_id: "",
          category_id: null,
          type: scenario.type === "add_income" ? "income" : "expense",
          amount: scenario.amount,
          description: scenario.description,
          frequency: "weekly",
          interval_count: 1,
          day_of_month: null,
          day_of_week: new Date().getDay(),
          start_date: new Date().toISOString(),
          end_date: null,
          next_occurrence: new Date().toISOString(),
          last_generated: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        modifiedRules.push(newRule);
      } else {
        // One-time adjustment
        if (scenario.type === "add_income") {
          modifiedBalance += scenario.amount;
        } else {
          modifiedBalance -= scenario.amount;
        }
      }
    }

    return generateProjections({
      startBalance: modifiedBalance,
      recurringRules: modifiedRules,
      historicalTransactions: [],
      projectionDays,
    });
  }, [currentBalance, recurringRules, projectionDays, scenarios]);

  const addScenario = () => {
    setScenarios([
      ...scenarios,
      {
        id: crypto.randomUUID(),
        name: "",
        type: "add_expense",
        amount: 0,
        frequency: "monthly",
        description: "",
      },
    ]);
  };

  const updateScenario = (id: string, updates: Partial<Scenario>) => {
    setScenarios(scenarios.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    const basePoints = baseProjection.points.filter((_, i) => i % 7 === 0);
    const scenarioPoints = scenarioProjection.points.filter((_, i) => i % 7 === 0);

    return basePoints.map((point, index) => ({
      date: point.date,
      formattedDate: format(parseISO(point.date), "d MMM", { locale: es }),
      base: point.balance,
      scenario: scenarioPoints[index]?.balance || point.balance,
    }));
  }, [baseProjection, scenarioProjection]);

  const difference = scenarioProjection.summary.endBalance - baseProjection.summary.endBalance;

  return (
    <div className="space-y-6">
      {/* Comparison Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Balance Actual</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(currentBalance)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Proyección Base (90 días)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(baseProjection.summary.endBalance)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Con Escenarios</p>
          <p className={`text-2xl font-bold mt-1 ${difference >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {formatCurrency(scenarioProjection.summary.endBalance)}
          </p>
          {scenarios.length > 0 && (
            <p className={`text-sm mt-1 ${difference >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {difference >= 0 ? "+" : ""}{formatCurrency(difference)}
            </p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Comparación de Proyecciones</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="formattedDate" stroke="#9CA3AF" fontSize={12} tickLine={false} />
              <YAxis
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
                        <p className="text-sm text-gray-500 mb-2">
                          {format(parseISO(data.date), "d 'de' MMMM", { locale: es })}
                        </p>
                        <p className="text-sm">
                          <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mr-2" />
                          Base: {formatCurrency(data.base)}
                        </p>
                        <p className="text-sm">
                          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2" />
                          Escenario: {formatCurrency(data.scenario)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="base"
                name="Base"
                stroke="#9CA3AF"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="scenario"
                name="Con Escenarios"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenarios Builder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Escenarios</h2>
          <button
            onClick={addScenario}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar Escenario
          </button>
        </div>

        {scenarios.length === 0 ? (
          <div className="text-center py-12">
            <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sin escenarios
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Agrega escenarios para simular diferentes situaciones financieras.
              Por ejemplo: un nuevo trabajo, cancelar una suscripción, o un gasto inesperado.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Tipo
                      </label>
                      <select
                        value={scenario.type}
                        onChange={(e) => updateScenario(scenario.id, { type: e.target.value as Scenario["type"] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="add_expense">Nuevo Gasto</option>
                        <option value="add_income">Nuevo Ingreso</option>
                        <option value="modify_balance">Ajuste de Balance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Monto
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          value={scenario.amount || ""}
                          onChange={(e) => updateScenario(scenario.id, { amount: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Frecuencia
                      </label>
                      <select
                        value={scenario.frequency}
                        onChange={(e) => updateScenario(scenario.id, { frequency: e.target.value as Scenario["frequency"] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        disabled={scenario.type === "modify_balance"}
                      >
                        <option value="once">Una vez</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Descripción
                      </label>
                      <input
                        type="text"
                        value={scenario.description}
                        onChange={(e) => updateScenario(scenario.id, { description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Ej: Nuevo trabajo"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeScenario(scenario.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Scenarios */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Escenarios Rápidos</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickScenarioButton
            icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
            label="Aumento de salario 10%"
            onClick={() => {
              const salaryRule = recurringRules.find(r => r.type === "income" && r.frequency === "monthly");
              if (salaryRule) {
                setScenarios([...scenarios, {
                  id: crypto.randomUUID(),
                  name: "Aumento de salario",
                  type: "add_income",
                  amount: Number(salaryRule.amount) * 0.1,
                  frequency: "monthly",
                  description: "Aumento 10%",
                }]);
              }
            }}
          />
          <QuickScenarioButton
            icon={<TrendingDown className="h-5 w-5 text-red-600" />}
            label="Gasto emergencia $500K"
            onClick={() => {
              setScenarios([...scenarios, {
                id: crypto.randomUUID(),
                name: "Emergencia",
                type: "add_expense",
                amount: 500000,
                frequency: "once",
                description: "Gasto de emergencia",
              }]);
            }}
          />
          <QuickScenarioButton
            icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
            label="Ingreso extra freelance"
            onClick={() => {
              setScenarios([...scenarios, {
                id: crypto.randomUUID(),
                name: "Freelance",
                type: "add_income",
                amount: 1000000,
                frequency: "monthly",
                description: "Ingreso freelance",
              }]);
            }}
          />
          <QuickScenarioButton
            icon={<TrendingDown className="h-5 w-5 text-red-600" />}
            label="Nueva suscripción $50K"
            onClick={() => {
              setScenarios([...scenarios, {
                id: crypto.randomUUID(),
                name: "Suscripción",
                type: "add_expense",
                amount: 50000,
                frequency: "monthly",
                description: "Nueva suscripción",
              }]);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function QuickScenarioButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
    >
      {icon}
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
