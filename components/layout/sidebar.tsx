"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowUpDown,
  Wallet,
  Tags,
  TrendingUp,
  Calculator,
  Settings,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transacciones", href: "/transactions", icon: ArrowUpDown },
  { name: "Cuentas", href: "/accounts", icon: Wallet },
  { name: "Categorías", href: "/categories", icon: Tags },
  { name: "Proyecciones", href: "/projections", icon: TrendingUp },
  { name: "Simulador", href: "/simulator", icon: Calculator },
];

const secondaryNavigation = [
  { name: "WhatsApp", href: "/settings/whatsapp", icon: MessageSquare },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-xl font-bold text-gray-900">FinTrack Pro</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-200">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-200">
          <div className="px-3 py-2 text-xs text-gray-500">
            FinTrack Pro v0.1.0
          </div>
        </div>
      </div>
    </aside>
  );
}
