"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ArrowUpDown, 
  Check, 
  Edit3, 
  Link2, 
  Banknote, 
  Users, 
  User, 
  AlertTriangle 
} from 'lucide-react';
// Asegúrate de que este archivo exista en components/ui/design-system.tsx
import { theme, Card, Button, Badge, ProgressBar } from '@/components/ui/design-system';

export default function ClarificationPage() {
  const router = useRouter();
  
  // Estado para las reglas de transferencia inteligente
  const [transferRules, setTransferRules] = useState([
    { id: 1, pattern: 'PEXTO COLOMBIA S', suggested: 'DolarApp', confirmed: true, isInternal: true },
    { id: 2, pattern: 'CESAR ANDRES CASTELLA...', suggested: 'Davivienda', confirmed: true, isInternal: true },
    { id: 3, pattern: 'ANA KARINA QUINTERO L...', suggested: null, confirmed: false, isInternal: false },
  ]);
  
  // Estado para manejo de efectivo
  const [cashHandling, setCashHandling] = useState('track'); // 'track' | 'expense'
  
  // Estado para contactos frecuentes detectados
  const [contacts, setContacts] = useState([
    { id: 1, name: 'ANA KARINA QUINTERO', category: 'Familia', note: 'Esposa' },
    { id: 2, name: 'MANUEL ALEJANDRO CH...', category: 'Ingreso', note: 'Cliente' },
  ]);
  
  // Datos simulados (mock data)
  const detectedTransactions = 47;
  const internalTransfers = 12;
  const cashWithdrawals = 1560000;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  const toggleTransferRule = (id: number) => {
    setTransferRules(rules => 
      rules.map(r => r.id === id ? { ...r, confirmed: !r.confirmed } : r)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col -m-4 md:-m-6">
      {/* Header Fijo */}
      <div className="bg-white px-5 pt-14 pb-6 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Paso 3 de 3</p>
            <h1 className="text-xl font-bold text-gray-900">Revisemos los datos</h1>
          </div>
        </div>
        
        {/* Barra de progreso visual usando el componente del Design System */}
        <ProgressBar value={90} color={theme.colors.primary} />
        
        {/* Badge de resumen */}
        <div className="mt-4 flex items-center gap-2">
          <Badge variant="success">
            <CheckCircle2 className="w-3 h-3" />
            {detectedTransactions} movimientos detectados
          </Badge>
        </div>
      </div>
      
      {/* Contenido Scrollable */}
      <div className="flex-1 p-5 space-y-6 overflow-y-auto pb-32">
        
        {/* Sección 1: Transferencias Internas Detectadas */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Transferencias internas</h3>
              <p className="text-sm text-gray-500">¿Son entre tus propias cuentas?</p>
            </div>
            <Badge variant="info" size="sm">{internalTransfers}</Badge>
          </div>
          
          <div className="space-y-3">
            {transferRules.map((rule) => (
              <div 
                key={rule.id}
                className={`p-3 rounded-xl border-2 transition-all ${
                  rule.confirmed && rule.isInternal
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTransferRule(rule.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      rule.confirmed && rule.isInternal
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {rule.confirmed && rule.isInternal && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {rule.pattern}
                    </p>
                    {rule.confirmed && rule.isInternal ? (
                      <p className="text-xs text-emerald-600">
                        → Mi {rule.suggested}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        (es otra persona)
                      </p>
                    )}
                  </div>
                  
                  <button className="p-1.5 hover:bg-white rounded-lg">
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-3 py-2 text-sm text-emerald-600 font-medium flex items-center justify-center gap-2 hover:bg-emerald-50 rounded-lg transition-colors">
            <Link2 className="w-4 h-4" />
            Agregar regla de transferencia
          </button>
        </Card>
        
        {/* Sección 2: Manejo de Efectivo */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Retiros en efectivo</h3>
              <p className="text-sm text-gray-500">{formatCurrency(cashWithdrawals)} detectados</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
              cashHandling === 'track' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100'
            }`}>
              <input
                type="radio"
                name="cash"
                checked={cashHandling === 'track'}
                onChange={() => setCashHandling('track')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                cashHandling === 'track' ? 'border-emerald-500' : 'border-gray-300'
              }`}>
                {cashHandling === 'track' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Crear cuenta "Efectivo"</p>
                <p className="text-xs text-gray-500">Trackear gastos en efectivo</p>
              </div>
            </label>
            
            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
              cashHandling === 'expense' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100'
            }`}>
              <input
                type="radio"
                name="cash"
                checked={cashHandling === 'expense'}
                onChange={() => setCashHandling('expense')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                cashHandling === 'expense' ? 'border-emerald-500' : 'border-gray-300'
              }`}>
                {cashHandling === 'expense' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Considerarlo gasto</p>
                <p className="text-xs text-gray-500">No trackear el efectivo</p>
              </div>
            </label>
          </div>
        </Card>
        
        {/* Sección 3: Contactos Frecuentes */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Contactos frecuentes</h3>
              <p className="text-sm text-gray-500">Categoriza para mejor análisis</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-500">{contact.note}</p>
                </div>
                <select 
                  value={contact.category}
                  onChange={(e) => {
                    const newContacts = contacts.map(c => c.id === contact.id ? {...c, category: e.target.value} : c);
                    setContacts(newContacts);
                  }}
                  className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="Familia">Familia</option>
                  <option value="Ingreso">Ingreso</option>
                  <option value="Amigo">Amigo</option>
                  <option value="Servicio">Servicio</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Info Tip */}
        <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium">Importante</p>
            <p className="text-xs text-amber-700 mt-1">
              Estas reglas se aplicarán automáticamente a futuras importaciones. 
              Puedes editarlas después en Configuración.
            </p>
          </div>
        </div>
      </div>
      
      {/* Botón de acción fijo (CTA) */}
      <div className="p-5 pb-8 bg-white border-t border-gray-100 sticky bottom-0 z-10">
        <Button fullWidth size="lg" onClick={() => router.push('/dashboard')}>
          Finalizar importación
          <CheckCircle2 className="w-5 h-5" />
        </Button>
        <p className="text-xs text-gray-400 text-center mt-3">
          {detectedTransactions} transacciones listas para importar
        </p>
      </div>
    </div>
  );
}
