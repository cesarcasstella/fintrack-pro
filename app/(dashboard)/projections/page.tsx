"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Filter, Target, TrendingUp, Sparkles, X, ChevronRight, Zap, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { theme, Card, Button, Badge } from '@/components/ui/design-system';

const WhatIfSlider = ({ label, value: initialValue, min, max, suffix, format, color }: any) => {
  const [value, setValue] = useState(initialValue);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>
          {format ? format(value) : `${value}${suffix}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #E5E7EB ${((value - min) / (max - min)) * 100}%, #E5E7EB 100%)`
        }}
      />
    </div>
  );
};

export default function ProjectionsPage() {
  const router = useRouter();
  const [scenario, setScenario] = useState('base');
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [showWhatIf, setShowWhatIf] = useState(false);
  
  const scenarios: any = {
    pessimistic: { label: 'Pesimista', color: theme.colors.danger, multiplier: 0.85 },
    base: { label: 'Base', color: theme.colors.primary, multiplier: 1 },
    optimistic: { label: 'Optimista', color: theme.colors.success, multiplier: 1.15 },
  };
  
  // Datos de proyección simulados (12 meses)
  const baseProjection = [
    { month: 'Ene', balance: 4242779, income: 4500000, expenses: 2800000 },
    { month: 'Feb', balance: 5942779, income: 4500000, expenses: 2600000 },
    { month: 'Mar', balance: 7842779, income: 4800000, expenses: 2700000 },
    { month: 'Abr', balance: 9642779, income: 4500000, expenses: 2500000 },
    { month: 'May', balance: 11642779, income: 4500000, expenses: 2400000 },
    { month: 'Jun', balance: 13842779, income: 5000000, expenses: 2800000 },
    { month: 'Jul', balance: 16042779, income: 4500000, expenses: 2300000 },
    { month: 'Ago', balance: 18242779, income: 4500000, expenses: 2300000 },
    { month: 'Sep', balance: 20442779, income: 4500000, expenses: 2300000 },
    { month: 'Oct', balance: 22642779, income: 4500000, expenses: 2300000 },
    { month: 'Nov', balance: 25142779, income: 5000000, expenses: 2500000 },
    { month: 'Dic', balance: 28142779, income: 5500000, expenses: 2500000 },
  ];
  
  const getProjectedData = () => {
    const mult = scenarios[scenario].multiplier;
    return baseProjection.map(m => ({
      ...m,
      balance: Math.round(m.balance * mult),
      income: Math.round(m.income * mult),
    }));
  };
  
  const projectionData = getProjectedData();
  const maxBalance = Math.max(...projectionData.map(d => d.balance));
  const finalBalance = projectionData[projectionData.length - 1].balance;
  const growthPercent = ((finalBalance - projectionData[0].balance) / projectionData[0].balance * 100).toFixed(1);
  
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };
  
  const formatFullCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8 -m-4 md:-m-6">
      {/* Header */}
      <div 
        className="px-5 pt-14 pb-6 rounded-b-[2rem]"
        style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)` }}
      >
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 -ml-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Proyecciones</h1>
            <p className="text-emerald-100 text-sm">Próximos 12 meses</p>
          </div>
          <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Filter className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Scenario selector */}
        <div className="bg-white/10 rounded-2xl p-1 flex mb-4">
          {Object.entries(scenarios).map(([key, val]: [string, any]) => (
            <button
              key={key}
              onClick={() => setScenario(key)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                scenario === key 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
        
        {/* Summary card */}
        <Card padding="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Balance proyectado (Dic 2026)</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(finalBalance)}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="success" size="sm">
                  <TrendingUp className="w-3 h-3" />
                  +{growthPercent}%
                </Badge>
                <span className="text-xs text-gray-500">vs hoy</span>
              </div>
            </div>
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: scenarios[scenario].color + '20' }}
            >
              <Target className="w-6 h-6" style={{ color: scenarios[scenario].color }} />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Chart visualization */}
      <div className="px-5 py-6">
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Evolución del patrimonio</h3>
            <Badge variant="info" size="sm">
              <Sparkles className="w-3 h-3" /> Bandas de confianza
            </Badge>
          </div>
          
          {/* Simple bar chart */}
          <div className="h-48 flex items-end justify-between gap-1 mb-4">
            {projectionData.map((d, idx) => {
              const height = (d.balance / maxBalance) * 100;
              const isExpanded = expandedMonth === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setExpandedMonth(isExpanded ? null : idx)}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isExpanded ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{ 
                      height: `${height}%`,
                      backgroundColor: scenarios[scenario].color,
                      opacity: idx <= new Date().getMonth() ? 1 : 0.6,
                      // @ts-ignore
                      '--tw-ring-color': scenarios[scenario].color,
                    }}
                  />
                  <span className={`text-xs mt-2 ${isExpanded ? 'font-bold' : 'text-gray-500'}`}>
                    {d.month}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Expanded month details */}
          {expandedMonth !== null && (
            <div className="bg-gray-50 rounded-2xl p-4 mt-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">
                  {projectionData[expandedMonth].month} 2026
                </h4>
                <button 
                  onClick={() => setExpandedMonth(null)}
                  className="p-1 hover:bg-gray-200 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Balance</p>
                  <p className="font-bold text-gray-900">
                    {formatCurrency(projectionData[expandedMonth].balance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Ingresos</p>
                  <p className="font-bold text-emerald-600">
                    +{formatCurrency(projectionData[expandedMonth].income)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Gastos</p>
                  <p className="font-bold text-red-600">
                    -{formatCurrency(projectionData[expandedMonth].expenses)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
        
        {/* What-if simulator */}
        <Card className="mb-6">
          <button 
            onClick={() => setShowWhatIf(!showWhatIf)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Simulador What-If</h3>
                <p className="text-sm text-gray-500">¿Qué pasa si...?</p>
              </div>
            </div>
            {showWhatIf ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {showWhatIf && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
              <WhatIfSlider 
                label="Aumento de ingresos"
                value={0}
                min={-50}
                max={100}
                suffix="%"
                color={theme.colors.success}
              />
              <WhatIfSlider 
                label="Reducción de gastos"
                value={0}
                min={-20}
                max={50}
                suffix="%"
                color={theme.colors.danger}
              />
              <WhatIfSlider 
                label="Gasto extra único"
                value={0}
                min={0}
                max={10000000}
                suffix=""
                format={(v: number) => formatCurrency(v)}
                color={theme.colors.warning}
              />
              <Button variant="outline" fullWidth size="sm">
                <RefreshCw className="w-4 h-4" />
                Recalcular proyección
              </Button>
            </div>
          )}
        </Card>
        
        {/* Monthly breakdown */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Desglose mensual</h3>
        </div>
        
        <div className="space-y-3">
          {projectionData.slice(0, 6).map((month, idx) => (
            <Card key={idx} padding="p-4" hoverable onClick={() => setExpandedMonth(idx)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: scenarios[scenario].color }}
                  >
                    {month.month}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formatFullCurrency(month.balance)}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-emerald-600">+{formatCurrency(month.income)}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-red-600">-{formatCurrency(month.expenses)}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </Card>
          ))}
        </div>
        
        <button className="w-full py-3 text-emerald-600 font-medium text-sm mt-4">
          Ver todos los meses
        </button>
      </div>
    </div>
  );
}
