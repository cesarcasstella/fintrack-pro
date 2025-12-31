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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl lg:hidden transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <span className="text-lg font-bold text-[#1A1A2E]">FinTrack</span>
              <span className="text-lg font-bold gradient-primary-text ml-1">Pro</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
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
                  onClick={onClose}
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-center text-[#6B7280]">
            FinTrack Pro v0.1.0
          </p>
        </div>
      </aside>
    </>
  );
}
