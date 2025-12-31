"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/database";
import {
  Menu,
  Search,
  Bell,
  LogOut,
  Settings,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  user: User;
  profile: Profile | null;
  onMenuClick?: () => void;
}

export function Header({ user, profile, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const userName = profile?.full_name || user.email || "Usuario";

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-6 w-6 text-[#6B7280]" />
        </button>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md ml-4 lg:ml-0">
          <Input
            type="search"
            placeholder="Buscar transacciones, cuentas..."
            icon={<Search className="h-4 w-4" />}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile search button */}
          <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <Search className="h-5 w-5 text-[#6B7280]" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-[#6B7280]" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-[#1A1A2E]">Notificaciones</p>
                  </div>
                  <div className="px-4 py-8 text-center">
                    <Bell className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-[#6B7280]">No hay notificaciones nuevas</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Avatar name={userName} size="sm" />
              <span className="hidden lg:block text-sm font-medium text-[#1A1A2E] max-w-[120px] truncate">
                {userName}
              </span>
              <ChevronDown className={cn(
                "hidden lg:block h-4 w-4 text-[#6B7280] transition-transform",
                showMenu && "rotate-180"
              )} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-[#1A1A2E]">
                      {profile?.full_name || "Usuario"}
                    </p>
                    <p className="text-sm text-[#6B7280] truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <a
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A2E] hover:bg-gray-50 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-[#6B7280]" />
                      Mi perfil
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A2E] hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-[#6B7280]" />
                      Configuración
                    </a>
                  </div>
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
