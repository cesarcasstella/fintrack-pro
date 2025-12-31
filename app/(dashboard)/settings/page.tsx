import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, MessageSquare, Bell, Shield, CreditCard } from "lucide-react";
import { Profile } from "@/types/database";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null };

  const settingsGroups = [
    {
      title: "Cuenta",
      items: [
        {
          href: "/settings/profile",
          icon: User,
          label: "Perfil",
          description: "Nombre, correo y preferencias",
        },
        {
          href: "/settings/whatsapp",
          icon: MessageSquare,
          label: "WhatsApp",
          description: profile?.whatsapp_enabled ? "Conectado" : "No conectado",
          badge: profile?.whatsapp_enabled ? "Activo" : null,
        },
      ],
    },
    {
      title: "Preferencias",
      items: [
        {
          href: "/settings/notifications",
          icon: Bell,
          label: "Notificaciones",
          description: "Alertas y recordatorios",
        },
        {
          href: "/settings/security",
          icon: Shield,
          label: "Seguridad",
          description: "Contraseña y autenticación",
        },
      ],
    },
    {
      title: "Suscripción",
      items: [
        {
          href: "/settings/billing",
          icon: CreditCard,
          label: "Plan y Facturación",
          description: "Plan Gratuito",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Administra tu cuenta y preferencias</p>
      </div>

      <div className="space-y-8">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {group.title}
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
