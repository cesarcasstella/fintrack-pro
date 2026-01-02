"use client";

import React from 'react';

// Definición de colores y tema
export const theme = {
  colors: {
    primary: '#0D6B4B',
    primaryLight: '#15956A',
    primaryDark: '#084D35',
    accent: '#D4A84B',
    accentLight: '#E5C97A',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
  }
};

// Componente Tarjeta (Card)
export const Card = ({ children, className = "", padding = "p-5", onClick, hoverable = false }: any) => (
  <div
    onClick={onClick}
    className={`
      bg-white rounded-3xl shadow-sm border border-gray-100
      ${hoverable ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : ''}
      ${padding}
      ${className}
    `}
  >
    {children}
  </div>
);

// Componente Botón (Button)
export const Button = ({ children, variant = "primary", size = "md", fullWidth = false, disabled = false, onClick, className = "" }: any) => {
  const variants: any = {
    primary: { background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`, color: 'white' },
    secondary: { background: 'white', color: theme.colors.gray700, border: '2px solid ' + theme.colors.gray200 },
    outline: { background: 'transparent', color: theme.colors.primary, border: '2px solid ' + theme.colors.primary },
    ghost: { background: 'transparent', color: theme.colors.gray600 },
    success: { background: theme.colors.success, color: 'white' },
    danger: { background: theme.colors.danger, color: 'white' },
  };
  const sizes: any = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-lg" };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}
        rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
        ${className}
      `}
      style={variants[variant]}
    >
      {children}
    </button>
  );
};

// Componente Badge (Etiqueta)
export const Badge = ({ children, variant = "default", size = "md" }: any) => {
  const variants: any = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    primary: "bg-emerald-600 text-white",
  };
  const sizes: any = { sm: "px-2 py-0.5 text-xs", md: "px-3 py-1 text-sm" };
  return (
    <span className={`${variants[variant]} ${sizes[size]} rounded-full font-medium inline-flex items-center gap-1`}>
      {children}
    </span>
  );
};

// Componente Barra de Progreso
export const ProgressBar = ({ value, max = 100, color = theme.colors.primary }: any) => (
  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
    <div 
      className="h-full rounded-full transition-all duration-500 ease-out"
      style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
    />
  </div>
);
