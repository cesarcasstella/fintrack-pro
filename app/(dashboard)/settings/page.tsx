import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, MessageSquare, Bell, Shield, CreditCard, ChevronRight, Settings } from "lucide-react";
import { Profile } from "@/types/database";
import { theme } from "@/components/ui/design-system";

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
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          label: "Perfil",
          description: "Nombre, correo y preferencias",
        },
        {
          href: "/settings/whatsapp",
          icon: MessageSquare,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
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
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          label: "Notificaciones",
          description: "Alertas y recordatorios",
        },
        {
          href: "/settings/security",
          icon: Shield,
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
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
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          label: "Plan y Facturación",
          description: "Plan Gratuito",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 -m-4 md:-m-6">
      {/* Gradient Header */}
      <div
        className="px-5 pt-14 pb-8 rounded-b-[2rem] relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)` }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Configuración</h1>
              <p className="text-white/70 text-sm">Administra tu cuenta y preferencias</p>
            </div>
          </div>

          {/* User Info Card */}
          {profile && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mt-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                  {profile.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-medium text-white">{profile.full_name || "Usuario"}</p>
                  <p className="text-sm text-white/60">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
              {group.title}
            </h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y divide-gray-50">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors first:rounded-t-3xl last:rounded-b-3xl"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-11 w-11 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-300" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="pt-4">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full py-3 text-center text-red-600 font-medium bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
