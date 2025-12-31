/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "COP",
  locale: string = "es-CO"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date relative to now
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Hoy";
  if (diffInDays === 1) return "Ayer";
  if (diffInDays < 7) return `Hace ${diffInDays} días`;

  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(
  num: number,
  locale: string = "es-CO"
): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format a percentage
 */
export function formatPercent(
  value: number,
  decimals: number = 1
): string {
  return `${value.toFixed(decimals)}%`;
}
