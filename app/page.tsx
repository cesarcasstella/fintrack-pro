'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Zap,
  ChartBar,
  Star,
  Check,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4F7DF3] to-[#7C5BF5] rounded-lg" />
              <span className="font-bold text-xl text-gray-900">FinTrack Pro</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Características</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">Cómo Funciona</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Precios</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition">Testimonios</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition">Iniciar Sesión</Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5] text-white rounded-full font-medium hover:shadow-lg transition">
                Crear Cuenta
              </Link>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-gray-600">Características</a>
              <a href="#how-it-works" className="text-gray-600">Cómo Funciona</a>
              <a href="#pricing" className="text-gray-600">Precios</a>
              <Link href="/auth/login" className="text-gray-600">Iniciar Sesión</Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5] text-white rounded-full font-medium text-center">
                Crear Cuenta
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F7DF3] via-[#6366F1] to-[#7C5BF5] opacity-5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">+10,000 usuarios activos en LATAM</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Tus Finanzas
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5]">
                  Bajo Control
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Registra gastos por WhatsApp, visualiza proyecciones a 12 meses 
                y simula escenarios financieros. Todo en español, diseñado para LATAM.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/auth/signup" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5] text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all"
                >
                  Empezar Gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="#how-it-works" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
                >
                  Ver Demo
                </a>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F7DF3] to-[#7C5BF5] border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">4.9/5 de 256 reseñas</p>
                </div>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4F7DF3] to-[#7C5BF5] rounded-[3rem] blur-3xl opacity-20 transform rotate-6" />
              
              <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl max-w-sm mx-auto">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="bg-gray-100 px-6 py-3 flex justify-between items-center">
                    <span className="text-sm font-medium">9:41</span>
                    <div className="w-20 h-6 bg-gray-900 rounded-full" />
                    <div className="flex gap-1">
                      <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-sm">¡Buenos días!</p>
                        <p className="font-semibold text-gray-900">María García</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4F7DF3] to-[#7C5BF5] rounded-full flex items-center justify-center text-white font-medium">
                        M
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#4F7DF3] to-[#7C5BF5] rounded-2xl p-5 text-white">
                      <p className="text-white/80 text-sm">Patrimonio Total</p>
                      <p className="text-3xl font-bold mt-1">$8.450.000</p>
                      <p className="text-white/80 text-sm mt-1">COP</p>
                      
                      <div className="flex gap-3 mt-4">
                        <button className="flex-1 bg-white/20 backdrop-blur rounded-xl py-2 text-sm font-medium">
                          Transferir
                        </button>
                        <button className="flex-1 bg-white/20 backdrop-blur rounded-xl py-2 text-sm font-medium">
                          Solicitar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-green-600 text-sm">Ingresos</p>
                        <p className="text-green-700 font-bold text-lg">$3.200.000</p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4">
                        <p className="text-red-600 text-sm">Gastos</p>
                        <p className="text-red-700 font-bold text-lg">$1.850.000</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-semibold text-gray-900">Recientes</p>
                        <span className="text-[#4F7DF3] text-sm">Ver todo</span>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { icon: '🛒', name: 'Éxito', amount: '-$185.000', color: 'red' },
                          { icon: '🚗', name: 'Uber', amount: '-$32.000', color: 'red' },
                        ].map((tx, i) => (
                          <div key={i} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                                {tx.icon}
                              </div>
                              <span className="font-medium text-gray-900">{tx.name}</span>
                            </div>
                            <span className={`font-semibold ${tx.color === 'red' ? 'text-red-600' : 'text-green-600'}`}>
                              {tx.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-4 top-1/4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                    <p className="text-xs text-gray-500">Gasto registrado ✓</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Proyección</p>
                    <p className="text-xs text-gray-500">+15% en 6 meses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-8">Integrado con tus herramientas favoritas</p>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-60">
            {['Nequi', 'Daviplata', 'Bancolombia', 'Rappi', 'WhatsApp'].map((brand) => (
              <div key={brand} className="text-xl font-bold text-gray-400">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Una mejor forma de
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5]">
                manejar tu dinero
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas diseñadas para el día a día de los latinoamericanos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#4F7DF3] to-[#7C5BF5] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Registro por WhatsApp</h3>
                <p className="text-white/80 text-lg mb-6 max-w-md">
                  Envía &quot;Almuerzo 45 mil&quot; y listo. Sin abrir apps, sin menús complicados.
                </p>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 max-w-xs">
                  <p className="text-sm text-white/60 mb-2">Ejemplo de mensaje:</p>
                  <p className="font-medium">&quot;Gasté 50k en mercado&quot;</p>
                  <p className="text-sm text-white/80 mt-2">✓ Registrado en Mercado: $50,000</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-[#4F7DF3]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proyecciones a 12 Meses</h3>
              <p className="text-gray-600">
                Visualiza tu futuro financiero con bandas de confianza basadas en tu historial.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <ChartBar className="w-7 h-7 text-[#7C5BF5]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Simulador &quot;¿Qué Pasaría Si?&quot;</h3>
              <p className="text-gray-600">
                &quot;¿Qué pasa si compro carro?&quot; Simula escenarios y toma mejores decisiones.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Seguro</h3>
              <p className="text-gray-600">
                Encriptación de grado bancario. Tus datos nunca se comparten con terceros.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tiempo Real</h3>
              <p className="text-gray-600">
                Dashboard actualizado al instante. Siempre sabrás dónde estás parado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Empieza en 3 simples pasos
            </h2>
            <p className="text-xl text-gray-600">
              Configuración en menos de 2 minutos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Crea tu cuenta', desc: 'Regístrate gratis con tu email o Google. Sin tarjeta de crédito.' },
              { step: '02', title: 'Conecta WhatsApp', desc: 'Vincula tu número para registrar gastos con un simple mensaje.' },
              { step: '03', title: '¡Listo!', desc: 'Empieza a trackear gastos y ver tus proyecciones financieras.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4F7DF3] to-[#7C5BF5] rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planes simples y transparentes
            </h2>
            <p className="text-xl text-gray-600">
              Empieza gratis, actualiza cuando quieras
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gratis</h3>
              <p className="text-gray-500 mb-6">Para empezar a organizarte</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Transacciones ilimitadas', '2 cuentas', 'Proyecciones 3 meses', '50 mensajes WhatsApp/mes'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="block text-center py-3 px-6 border border-gray-200 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition">
                Empezar Gratis
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-[#4F7DF3] to-[#7C5BF5] rounded-3xl p-8 text-white relative overflow-hidden transform lg:scale-105">
              <div className="absolute top-4 right-4 bg-[#D4A84B] text-xs font-bold px-3 py-1 rounded-full text-gray-900">
                POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Premium</h3>
              <p className="text-white/80 mb-6">Control total de tus finanzas</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$4.99</span>
                <span className="text-white/80">/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Todo lo de Gratis', '10 cuentas', 'Proyecciones 12 meses', 'WhatsApp ilimitado', 'Simulador What-If', 'Soporte prioritario'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-white" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?plan=premium" className="block text-center py-3 px-6 bg-white text-[#4F7DF3] rounded-full font-semibold hover:shadow-lg transition">
                Prueba Gratis 14 Días
              </Link>
            </div>

            {/* Business */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business</h3>
              <p className="text-gray-500 mb-6">Para empresas y equipos</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-500">/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Todo lo de Premium', 'Usuarios ilimitados', 'API access', 'White-label', 'Soporte dedicado'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              <a href="mailto:ventas@fintrack.app" className="block text-center py-3 px-6 border border-gray-200 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition">
                Contactar Ventas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'María González', role: 'Diseñadora', city: 'Bogotá', text: 'Por fin una app que entiende cómo manejamos la plata en Colombia. Lo de WhatsApp es genial.' },
              { name: 'Carlos Rodríguez', role: 'Emprendedor', city: 'Medellín', text: 'El simulador me ayudó a decidir si podía comprar carro. Ahora sé exactamente cuándo puedo hacerlo.' },
              { name: 'Ana Martínez', role: 'Contadora', city: 'México DF', text: 'Recomiendo FinTrack a todos mis clientes. Las proyecciones son increíblemente precisas.' },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4F7DF3] to-[#7C5BF5] rounded-full flex items-center justify-center text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-gray-500 text-sm">{t.role} • {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#4F7DF3] to-[#7C5BF5] rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden">
            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Abre tu cuenta
                <br />
                en <span className="text-[#D4A84B]">10 minutos</span>
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Empodera tus decisiones financieras con herramientas diseñadas para LATAM.
              </p>
              <Link 
                href="/auth/signup" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4A84B] text-gray-900 rounded-full font-semibold text-lg hover:bg-[#E5B95C] transition-all hover:shadow-xl"
              >
                Abrir Cuenta Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#4F7DF3] to-[#7C5BF5] rounded-lg" />
                <span className="font-bold text-xl text-gray-900">FinTrack Pro</span>
              </div>
              <p className="text-gray-500 mb-4">
                Soluciones financieras para LATAM.
              </p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-500 ml-2">4.9</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Producto</h4>
              <ul className="space-y-3">
                {['Características', 'Precios', 'Integraciones'].map((item) => (
                  <li key={item}><a href="#" className="text-gray-500 hover:text-gray-700">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Recursos</h4>
              <ul className="space-y-3">
                {['Blog', 'Guías', 'Soporte'].map((item) => (
                  <li key={item}><a href="#" className="text-gray-500 hover:text-gray-700">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                {['Privacidad', 'Términos', 'Contacto'].map((item) => (
                  <li key={item}><a href="#" className="text-gray-500 hover:text-gray-700">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-500 text-sm">
            © 2025 FinTrack Pro. Hecho con ❤️ para LATAM.
          </div>
        </div>
      </footer>
    </div>
  );
}
