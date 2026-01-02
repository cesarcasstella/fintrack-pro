import Link from "next/link";
import { ArrowRight, MessageCircle, TrendingUp, Zap, Shield, Smartphone, ChevronRight, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0D6B4B] to-[#084D35] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">FinTrack Pro</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#caracteristicas" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Características</a>
              <a href="#como-funciona" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Cómo Funciona</a>
              <a href="#precios" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Precios</a>
              <a href="#testimonios" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Testimonios</a>
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                href="/auth/login" 
                className="hidden sm:block text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-gradient-to-r from-[#0D6B4B] to-[#084D35] text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-[0.98]"
              >
                Crear Cuenta
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                +10,000 usuarios activos en LATAM
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Tus Finanzas
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D6B4B] to-[#15956A]">
                  Bajo Control
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Registra gastos por WhatsApp, visualiza proyecciones a 12 meses 
                y simula escenarios financieros. Todo en español, diseñado para LATAM.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <Link 
                  href="/auth/register"
                  className="bg-gradient-to-r from-[#0D6B4B] to-[#084D35] text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 hover:shadow-xl hover:shadow-emerald-500/30 transition-all active:scale-[0.98]"
                >
                  Empezar Gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                  Ver Demo
                </button>
              </div>
              
              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {["A", "B", "C", "D", "E"].map((letter, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-medium text-sm border-2 border-white"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">4.9/5 de 256 reseñas</p>
                </div>
              </div>
            </div>
            
            {/* Right - Phone mockup */}
            <div className="relative lg:pl-12">
              <div className="relative mx-auto w-[300px] h-[600px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-10" />
                <div className="w-full h-full bg-gray-50 rounded-[2.5rem] overflow-hidden">
                  {/* App content preview */}
                  <div className="p-5 pt-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-gray-500 text-xs">¡Buenos días!</p>
                        <p className="font-bold text-gray-900">María García</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D6B4B] to-[#084D35] flex items-center justify-center text-white font-bold text-sm">
                        M
                      </div>
                    </div>
                    
                    {/* Balance card */}
                    <div className="bg-gradient-to-br from-[#0D6B4B] to-[#084D35] rounded-2xl p-5 mb-5 text-white">
                      <p className="text-emerald-100 text-xs mb-1">Patrimonio Total</p>
                      <p className="text-3xl font-bold mb-3">$8.450.000</p>
                      <p className="text-emerald-200 text-xs">COP</p>
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-white/20 backdrop-blur py-2 rounded-xl text-sm font-medium">
                          Transferir
                        </button>
                        <button className="flex-1 bg-white/20 backdrop-blur py-2 rounded-xl text-sm font-medium">
                          Solicitar
                        </button>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-emerald-50 rounded-xl p-3">
                        <p className="text-emerald-600 text-xs mb-1">Ingresos</p>
                        <p className="font-bold text-emerald-700">$3.200.000</p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-3">
                        <p className="text-red-600 text-xs mb-1">Gastos</p>
                        <p className="font-bold text-red-700">$1.850.000</p>
                      </div>
                    </div>
                    
                    {/* Transactions */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-gray-900 text-sm">Recientes</p>
                        <p className="text-emerald-600 text-xs font-medium">Ver todas</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                          <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-base">🛒</div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">Éxito</p>
                            <p className="text-gray-500 text-xs">Supermercado</p>
                          </div>
                          <p className="font-bold text-red-600 text-sm">-$185.000</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                          <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-base">🚗</div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">Uber</p>
                            <p className="text-gray-500 text-xs">Transporte</p>
                          </div>
                          <p className="font-bold text-red-600 text-sm">-$32.000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute top-20 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-bounce-slow">
                <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">WhatsApp</p>
                  <p className="text-gray-500 text-xs">Gasto registrado ✓</p>
                </div>
              </div>
              
              <div className="absolute bottom-32 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Proyección</p>
                  <p className="text-emerald-600 text-xs font-medium">+15% en 6 meses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas diseñadas específicamente para la realidad financiera de LATAM
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                color: "bg-[#25D366]",
                title: "Integración WhatsApp",
                description: "Registra gastos enviando un mensaje. \"Almuerzo 25k\" y listo."
              },
              {
                icon: TrendingUp,
                color: "bg-blue-500",
                title: "Proyecciones 12 Meses",
                description: "Visualiza tu futuro financiero con 3 escenarios: pesimista, base y optimista."
              },
              {
                icon: Zap,
                color: "bg-amber-500",
                title: "Simulador What-If",
                description: "¿Qué pasa si gano 20% más? ¿Si reduzco gastos 10%? Simúlalo al instante."
              },
              {
                icon: Smartphone,
                color: "bg-purple-500",
                title: "Multi-cuenta",
                description: "DolarApp, UALA, Nequi, Davivienda... Todas tus cuentas en un solo lugar."
              },
              {
                icon: Shield,
                color: "bg-emerald-500",
                title: "100% Privado",
                description: "Sin conexión bancaria. Tus datos seguros con cifrado de nivel bancario."
              },
              {
                icon: ChevronRight,
                color: "bg-gray-700",
                title: "LATAM First",
                description: "Español nativo, soporte multi-moneda (COP, USD, MXN, ARS) y patrones locales."
              },
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#0D6B4B] to-[#084D35] rounded-[2.5rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Empieza a controlar tus finanzas hoy
              </h2>
              <p className="text-xl text-emerald-100 mb-8 max-w-xl mx-auto">
                Gratis para siempre. Sin tarjeta de crédito. Sin trucos.
              </p>
              <Link 
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-white text-emerald-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all active:scale-[0.98]"
              >
                Crear Cuenta Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0D6B4B] to-[#084D35] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-lg font-bold text-gray-900">FinTrack Pro</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 FinTrack Pro. Hecho con 💚 para LATAM.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
