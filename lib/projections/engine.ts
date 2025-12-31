import { RecurringRule, Transaction } from "@/types/database";
import { addDays, addWeeks, addMonths, addYears, isBefore, isAfter, startOfDay } from "date-fns";

export interface ProjectionPoint {
  date: string;
  balance: number;
  income: number;
  expenses: number;
  transactions: {
    description: string;
    amount: number;
    type: "income" | "expense";
    isRecurring: boolean;
  }[];
}

export interface ProjectionResult {
  points: ProjectionPoint[];
  summary: {
    startBalance: number;
    endBalance: number;
    totalIncome: number;
    totalExpenses: number;
    netChange: number;
    lowestBalance: number;
    lowestBalanceDate: string;
  };
}

interface ProjectionInput {
  startBalance: number;
  recurringRules: RecurringRule[];
  historicalTransactions: Transaction[];
  projectionDays: number;
}

export function generateProjections(input: ProjectionInput): ProjectionResult {
  const { startBalance, recurringRules, projectionDays } = input;

  const startDate = startOfDay(new Date());
  const endDate = addDays(startDate, projectionDays);

  const points: ProjectionPoint[] = [];
  let currentBalance = startBalance;
  let totalIncome = 0;
  let totalExpenses = 0;
  let lowestBalance = startBalance;
  let lowestBalanceDate = startDate.toISOString();

  // Generate all recurring transactions for the projection period
  const projectedTransactions: Map<string, ProjectionPoint["transactions"]> = new Map();

  for (const rule of recurringRules) {
    if (!rule.is_active) continue;

    let nextDate = new Date(rule.next_occurrence);

    while (isBefore(nextDate, endDate)) {
      if (!isBefore(nextDate, startDate)) {
        const dateKey = startOfDay(nextDate).toISOString().split("T")[0];

        if (!projectedTransactions.has(dateKey)) {
          projectedTransactions.set(dateKey, []);
        }

        projectedTransactions.get(dateKey)!.push({
          description: rule.description,
          amount: Number(rule.amount),
          type: rule.type,
          isRecurring: true,
        });
      }

      nextDate = getNextOccurrence(nextDate, rule);
    }
  }

  // Generate daily projection points
  let currentDate = startDate;
  while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
    const dateKey = currentDate.toISOString().split("T")[0];
    const dayTransactions = projectedTransactions.get(dateKey) || [];

    let dayIncome = 0;
    let dayExpenses = 0;

    for (const tx of dayTransactions) {
      if (tx.type === "income") {
        dayIncome += tx.amount;
        totalIncome += tx.amount;
      } else {
        dayExpenses += tx.amount;
        totalExpenses += tx.amount;
      }
    }

    currentBalance = currentBalance + dayIncome - dayExpenses;

    if (currentBalance < lowestBalance) {
      lowestBalance = currentBalance;
      lowestBalanceDate = currentDate.toISOString();
    }

    points.push({
      date: dateKey,
      balance: currentBalance,
      income: dayIncome,
      expenses: dayExpenses,
      transactions: dayTransactions,
    });

    currentDate = addDays(currentDate, 1);
  }

  return {
    points,
    summary: {
      startBalance,
      endBalance: currentBalance,
      totalIncome,
      totalExpenses,
      netChange: totalIncome - totalExpenses,
      lowestBalance,
      lowestBalanceDate,
    },
  };
}

function getNextOccurrence(currentDate: Date, rule: RecurringRule): Date {
  const intervalCount = rule.interval_count || 1;

  switch (rule.frequency) {
    case "daily":
      return addDays(currentDate, intervalCount);
    case "weekly":
      return addWeeks(currentDate, intervalCount);
    case "biweekly":
      return addWeeks(currentDate, 2 * intervalCount);
    case "monthly":
      return addMonths(currentDate, intervalCount);
    case "yearly":
      return addYears(currentDate, intervalCount);
    default:
      return addMonths(currentDate, 1);
  }
}

export function calculateWhatIf(
  baseProjection: ProjectionResult,
  changes: {
    type: "add_expense" | "add_income" | "modify_recurring" | "remove_recurring";
    amount?: number;
    description?: string;
    frequency?: RecurringRule["frequency"];
    startDate?: string;
  }[]
): ProjectionResult {
  // This is a simplified what-if calculation
  // In production, you'd re-run the full projection with modified rules

  const modifiedPoints = [...baseProjection.points];
  let additionalIncome = 0;
  let additionalExpenses = 0;

  for (const change of changes) {
    if (change.type === "add_expense" && change.amount) {
      additionalExpenses += change.amount;
    } else if (change.type === "add_income" && change.amount) {
      additionalIncome += change.amount;
    }
  }

  // Apply changes to each point
  const netChange = additionalIncome - additionalExpenses;

  return {
    ...baseProjection,
    points: modifiedPoints.map((point, index) => ({
      ...point,
      balance: point.balance + netChange * (index / modifiedPoints.length),
    })),
    summary: {
      ...baseProjection.summary,
      totalIncome: baseProjection.summary.totalIncome + additionalIncome,
      totalExpenses: baseProjection.summary.totalExpenses + additionalExpenses,
      netChange: baseProjection.summary.netChange + netChange,
      endBalance: baseProjection.summary.endBalance + netChange,
    },
  };
}
