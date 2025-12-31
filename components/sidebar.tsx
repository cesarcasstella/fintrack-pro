"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  PieChart,
  TrendingUp,
  Target,
  MessageCircle,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transacciones", href: "/transactions", icon: ArrowLeftRight },
  { name: "Cuentas", href: "/accounts", icon: CreditCard },
  { name: "Categorías", href: "/categories", icon: PieChart },
  { name: "Proyecciones", href: "/projections", icon: TrendingUp },
  { name: "Simulador", href: "/simulator", icon: Target },
];

const secondaryNavigation = [
  { name: "WhatsApp", href: "/settings/whatsapp", icon: MessageCircle },
  { name: "Ajustes", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 hidden lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5] flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">F</span>
        </div>
        <div>
          <span className="text-lg font-bold text-[#1A1A2E]">FinTrack</span>
          <span className="text-lg font-bold gradient-primary-text ml-1">Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5] text-white shadow-lg"
                  : "text-[#6B7280] hover:bg-gray-50 hover:text-[#1A1A2E]"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-white")} />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-6 mt-6 border-t border-gray-100">
          <p className="px-4 text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-3">
            Configuración
          </p>
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5] text-white shadow-lg"
                    : "text-[#6B7280] hover:bg-gray-50 hover:text-[#1A1A2E]"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-white")} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Upgrade Card */}
      <div className="p-4">
        <div className="rounded-2xl bg-gradient-to-r from-[#4F7DF3]/10 to-[#7C5BF5]/10 p-4 border border-primary-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-[#7C5BF5]" />
            <span className="text-sm font-semibold text-[#1A1A2E]">Actualizar a Pro</span>
          </div>
          <p className="text-xs text-[#6B7280] mb-3">
            Accede a todas las funciones premium y mejora tu experiencia.
          </p>
          <Button size="sm" variant="primary" className="w-full">
            Actualizar ahora
          </Button>
        </div>
      </div>
    </aside>
  );
}
