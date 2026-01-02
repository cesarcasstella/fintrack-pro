// =============================================
// FINTRACK PRO - SISTEMA DE DISEÑO BILLZA
// =============================================

export const colors = {
  // Primary - Verde Esmeralda
  primary: {
    DEFAULT: '#0D6B4B',
    light: '#15956A',
    dark: '#084D35',
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#0D6B4B',
    600: '#084D35',
  },
  // Accent - Dorado
  accent: {
    DEFAULT: '#D4A84B',
    light: '#E5C97A',
    dark: '#B8922F',
  },
  // Semantic
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

// Tailwind class helpers for Billza style
export const tw = {
  // Buttons
  btnPrimary: 'bg-[#0D6B4B] hover:bg-[#084D35] text-white font-medium rounded-2xl px-6 py-3 transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg',
  btnSecondary: 'bg-white hover:bg-gray-50 text-[#0D6B4B] font-medium rounded-2xl px-6 py-3 border-2 border-[#0D6B4B] transition-all duration-200 active:scale-[0.98]',
  btnAccent: 'bg-[#D4A84B] hover:bg-[#B8922F] text-white font-medium rounded-2xl px-6 py-3 transition-all duration-200 active:scale-[0.98] shadow-md',
  btnGhost: 'bg-transparent hover:bg-[#0D6B4B]/10 text-[#0D6B4B] font-medium rounded-2xl px-6 py-3 transition-all duration-200',
  
  // Cards
  card: 'bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300',
  cardElevated: 'bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1',
  cardGradient: 'bg-gradient-to-br from-[#0D6B4B] to-[#15956A] rounded-3xl text-white',
  
  // Inputs
  input: 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0D6B4B]/20 focus:border-[#0D6B4B] outline-none transition-all duration-200',
} as const;

// Account type icons (emoji)
export const accountIcons: Record<string, string> = {
  bank: '🏦',
  digital_wallet: '📱',
  cash: '💵',
  crypto: '₿',
  investment: '📈',
  checking: '🏦',
  savings: '🐷',
  credit: '💳',
};

// Category icons
export const categoryIcons: Record<string, string> = {
  salary: '💼',
  freelance: '💻',
  investments: '📈',
  food: '🍽️',
  transport: '🚗',
  housing: '🏠',
  utilities: '💡',
  entertainment: '🎬',
  shopping: '🛍️',
  health: '🏥',
  subscriptions: '📺',
  transfer: '🔄',
};
