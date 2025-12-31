import Link from "next/link";
import { ArrowRight, MessageSquare, TrendingUp, Calculator, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FinTrack Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Empezar Gratis
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Controla tus finanzas desde{" "}
            <span className="text-blue-600">WhatsApp</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Registra gastos con un mensaje, visualiza proyecciones a 12 meses y 
            simula escenarios financieros. Todo en español, diseñado para LATAM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Empezar Gratis <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-medium text-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              Ver Funciones
            </Link>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="mt-32">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Todo lo que necesitas para tus finanzas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
              title="WhatsApp Nativo"
              description="Registra gastos enviando un mensaje: 'Almuerzo 25000'. Así de fácil."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-emerald-600" />}
              title="Proyecciones 12m"
              description="Visualiza tu futuro financiero con bandas de confianza y escenarios."
            />
            <FeatureCard
              icon={<Calculator className="h-8 w-8 text-purple-600" />}
              title="Simulador What-If"
              description="¿Qué pasa si ahorro $500K más? Simula y descubre el impacto."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-orange-600" />}
              title="100% Seguro"
              description="Tus datos encriptados, aislados por usuario. Cumplimiento total."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-32 bg-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para tomar control de tus finanzas?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Únete a miles de usuarios en LATAM que ya gestionan su dinero con FinTrack Pro.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-blue-50 transition-colors"
          >
            Crear Cuenta Gratis
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <span className="font-semibold text-gray-900">FinTrack Pro</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 FinTrack Pro. Hecho con ❤️ para LATAM.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
