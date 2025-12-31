/**
 * WhatsApp Message Parser
 * Parses natural language messages to extract transaction intent
 */

export interface ParsedMessage {
  intent: "add_expense" | "add_income" | "get_balance" | "get_summary" | "unknown";
  data: {
    amount?: number;
    description?: string;
    category?: string;
  };
  confidence: number;
}

// Common expense keywords in Spanish
const expenseKeywords = [
  "gaste", "gasté", "pague", "pagué", "compre", "compré",
  "almuerzo", "cena", "desayuno", "comida", "taxi", "uber",
  "mercado", "supermercado", "gasolina", "luz", "agua", "gas",
  "arriendo", "alquiler", "netflix", "spotify", "internet",
];

// Common income keywords
const incomeKeywords = [
  "ingreso", "recibí", "recibi", "gane", "gané", "salario",
  "sueldo", "pago", "transferencia", "freelance", "bono",
];

// Balance/summary keywords
const balanceKeywords = ["balance", "saldo", "cuanto tengo", "cuánto tengo"];
const summaryKeywords = ["resumen", "como voy", "cómo voy", "reporte", "mes"];

export async function parseWhatsAppMessage(message: string): Promise<ParsedMessage> {
  const normalized = message.toLowerCase().trim();

  // Check for balance request
  if (balanceKeywords.some((kw) => normalized.includes(kw))) {
    return {
      intent: "get_balance",
      data: {},
      confidence: 0.95,
    };
  }

  // Check for summary request
  if (summaryKeywords.some((kw) => normalized.includes(kw))) {
    return {
      intent: "get_summary",
      data: {},
      confidence: 0.95,
    };
  }

  // Try to extract amount
  const amount = extractAmount(normalized);

  if (amount) {
    // Check if it's income
    const isIncome = incomeKeywords.some((kw) => normalized.includes(kw));
    
    // Extract description (everything except the amount)
    const description = extractDescription(normalized, amount);
    
    // Try to match category
    const category = matchCategory(normalized);

    if (isIncome) {
      return {
        intent: "add_income",
        data: { amount, description, category },
        confidence: 0.85,
      };
    }

    // Default to expense
    return {
      intent: "add_expense",
      data: { amount, description, category },
      confidence: 0.8,
    };
  }

  // Unknown intent
  return {
    intent: "unknown",
    data: {},
    confidence: 0,
  };
}

function extractAmount(text: string): number | null {
  // Match various number formats:
  // - 25000
  // - 25.000
  // - 25,000
  // - $25000
  // - 25k
  // - 25mil

  // Remove currency symbols
  const cleaned = text.replace(/[$]/g, "");

  // Match "Xk" pattern (e.g., "25k" = 25000)
  const kMatch = cleaned.match(/(\d+(?:[.,]\d+)?)\s*k\b/i);
  if (kMatch) {
    return parseFloat(kMatch[1].replace(",", ".")) * 1000;
  }

  // Match "Xmil" pattern (e.g., "25mil" = 25000)
  const milMatch = cleaned.match(/(\d+(?:[.,]\d+)?)\s*mil\b/i);
  if (milMatch) {
    return parseFloat(milMatch[1].replace(",", ".")) * 1000;
  }

  // Match regular numbers (with thousand separators)
  const numMatch = cleaned.match(/(\d{1,3}(?:[.,]\d{3})*|\d+)/);
  if (numMatch) {
    // Remove thousand separators and parse
    const numStr = numMatch[1].replace(/[.,](?=\d{3})/g, "");
    const num = parseFloat(numStr);
    if (!isNaN(num) && num > 0) {
      return num;
    }
  }

  return null;
}

function extractDescription(text: string, amount: number): string {
  // Remove the amount and common patterns
  let description = text
    .replace(new RegExp(amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "[.,]?"), "g"), "")
    .replace(/[$kK]|mil\b/gi, "")
    .replace(/^\s*(gaste|gasté|pague|pagué|compre|compré|en|de|por)\s*/gi, "")
    .trim();

  // Capitalize first letter
  if (description) {
    description = description.charAt(0).toUpperCase() + description.slice(1);
  }

  return description || "";
}

function matchCategory(text: string): string | undefined {
  const categoryMap: Record<string, string[]> = {
    "Alimentación": ["almuerzo", "cena", "desayuno", "comida", "restaurante", "mercado", "supermercado"],
    "Transporte": ["taxi", "uber", "gasolina", "bus", "metro", "transporte", "parqueadero"],
    "Vivienda": ["arriendo", "alquiler", "administración"],
    "Servicios": ["luz", "agua", "gas", "internet", "telefono", "celular"],
    "Entretenimiento": ["netflix", "spotify", "cine", "bar", "fiesta"],
    "Salud": ["medicina", "medico", "farmacia", "doctor", "hospital"],
    "Compras": ["ropa", "zapatos", "tienda"],
  };

  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }

  return undefined;
}
