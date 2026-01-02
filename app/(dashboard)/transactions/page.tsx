"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Filter, ChevronDown, ArrowUpDown } from 'lucide-react';
import { theme, Card, Badge } from '@/components/ui/design-system';

export default function TransactionsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [selectedMonth, setSelectedMonth] = useState('Ene 2026');
  
  // This data would ideally come from your API
  const transactions = [
    { id: 1, description: 'Almuerzo', category: 'Alimentación', amount: -45000, date: '2 Ene', icon: '🍽️', account: 'UALA' },
    { id: 2, description: 'Uber', category: 'Transporte', amount: -18500, date: '2 Ene', icon: '🚗', account: 'UALA' },
    { id: 3, description: 'Pago cliente', category: 'Freelance', amount: 1500000, date: '1 Ene', icon: '💼', account: 'DolarApp' },
    { id: 4, description: 'Netflix', category: 'Suscripciones', amount: -38900, date: '1 Ene', icon: '📺', account: 'UALA' },
    { id: 5, description: 'Supermercado', category: 'Alimentación', amount: -185000, date: '31 Dic', icon: '🛒', account: 'Davivienda' },
    { id: 6, description: 'Transferencia USD', category: 'Transferencia', amount: -400000, date: '31 Dic', icon: '💵', account: 'DolarApp', isTransfer: true },
    { id: 7, description: 'Salario diciembre', category: 'Salario', amount: 4500000, date: '30 Dic', icon: '💰', account: 'Davivienda' },
  ];
  
  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'income') return tx.amount > 0;
    if (filter === 'expense') return tx.amount < 0;
    return true;
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };
  
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

  return (
    <div className="min-h-screen bg-gray-50 pb-24 -m-4 md:-m-6">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex-1">Movimientos</h1>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Month selector */}
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">{selectedMonth}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      {/* Summary cards */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          <Card padding="p-3" className="bg-emerald-50 border-emerald-100">
            <p className="text-xs text-emerald-600 mb-1">Ingresos</p>
            <p className="text-lg font-bold text-emerald-700">{formatCurrency(totalIncome)}</p>
          </Card>
          <Card padding="p-3" className="bg-red-50 border-red-100">
            <p className="text-xs text-red-600 mb-1">Gastos</p>
            <p className="text-lg font-bold text-red-700">{formatCurrency(totalExpense)}</p>
          </Card>
        </div>
      </div>
      
      {/* Filter tabs */}
      <div className="px-5 mb-4">
        <div className="bg-gray-100 rounded-xl p-1 flex">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'income', label: 'Ingresos' },
            { id: 'expense', label: 'Gastos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.id 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Transactions list */}
      <div className="px-5">
        <Card padding="p-0">
          {filteredTransactions.map((tx, idx) => (
            <div 
              key={tx.id}
              className={`flex items-center gap-4 p-4 ${
                idx !== filteredTransactions.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: tx.amount > 0 ? '#ECFDF5' : '#FEF2F2' }}
              >
                {tx.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{tx.description}</p>
                  {/* @ts-ignore */}
                  {tx.isTransfer && (
                    <Badge variant="info" size="sm">
                      <ArrowUpDown className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{tx.category} • {tx.account} • {tx.date}</p>
              </div>
              <p className={`font-bold ${tx.amount >= 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                {tx.amount >= 0 ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
        </Card>
      </div>
      
      {/* FAB */}
      <button 
        onClick={() => router.push('/transactions?action=new')}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center z-50 transition-transform active:scale-95"
        style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)` }}
      >
        <span className="text-2xl text-white">+</span>
      </button>
    </div>
  );
}
