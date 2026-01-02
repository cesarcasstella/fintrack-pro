"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wallet, 
  TrendingUp, 
  ArrowRight, 
  MessageCircle, 
  Plus, 
  Search, 
  Bell,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { theme, Card, Button, Badge } from '@/components/ui/design-system';

export default function DashboardPage() {
  const router = useRouter();

  const accounts = [
    { name: 'Nequi', balance: '$450.000', type: 'Digital' },
    { name: 'Bancolombia', balance: '$2.500.000', type: 'Ahorros' },
    { name: 'Efectivo', balance: '$120.000', type: 'Físico' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 -m-4 md:-m-6">
      {/* Header con Gradiente */}
      <div 
        className="px-5 pt-14 pb-12 rounded-b-[2.5rem] relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)` }}
      >
        {/* Círculos decorativos de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <span className="text-white font-bold">CC</span>
            </div>
            <div>
              <p className="text-emerald-100 text-xs font-medium">Buenos días,</p>
              <h1 className="text-white font-bold text-lg leading-tight">César</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
              <Search className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0D6B4B]"></span>
            </button>
          </div>
        </div>

        {/* Balance Principal */}
        <div className="relative z-10">
          <p className="text-emerald-100/80 text-sm mb-1 font-medium">Balance Total</p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-bold text-white tracking-tight">$3.070.000</h2>
            <span className="text-emerald-200 font-medium">COP</span>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => router.push('/transactions')}
              className="flex-1 bg-white text-emerald-900 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-900/20"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ArrowUpRight className="w-3 h-3" />
              </div>
              Ingreso
            </button>
            <button 
              onClick={() => router.push('/transactions')}
              className="flex-1 bg-emerald-800/50 backdrop-blur-md text-white py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-white/10 hover:bg-emerald-800/70 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowDownLeft className="w-3 h-3" />
              </div>
              Gasto
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="px-5 -mt-6 relative z-20 space-y-6">
        
        {/* Accesos Rápidos (Features Nuevos) */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            hoverable 
            padding="p-4" 
            onClick={() => router.push('/projections')}
            className="flex flex-col items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Proyecciones</h3>
              <p className="text-xs text-gray-500 mt-0.5">Ver a 12 meses</p>
            </div>
          </Card>

          <Card 
            hoverable 
            padding="p-4" 
            onClick={() => router.push('/clarification')}
            className="flex flex-col items-start gap-3 relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Clarificar</h3>
              <p className="text-xs text-gray-500 mt-0.5">3 pendientes</p>
            </div>
          </Card>
        </div>

        {/* Sección de Cuentas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Mis Cuentas</h3>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-3">
            {accounts.map((acc, i) => (
              <Card key={i} padding="p-4" hoverable className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    i === 0 ? 'bg-purple-100 text-purple-600' :
                    i === 1 ? 'bg-yellow-100 text-yellow-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{acc.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{acc.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{acc.balance}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* WhatsApp Banner */}
        <div 
          onClick={() => router.push('/settings/whatsapp')}
          className="bg-[#25D366] rounded-3xl p-5 text-white relative overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-[0.98]"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/20 rounded-full" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">Modo WhatsApp</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                Envía "Almuerzo 20k" para registrar gastos al instante.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/80" />
          </div>
        </div>

      </div>
    </div>
  );
}
