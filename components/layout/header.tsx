"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/database";
import { Menu, X, LogOut, Settings, User as UserIcon } from "lucide-react";

interface HeaderProps {
  user: User;
  profile: Profile | null;
}

export function Header({ user, profile }: HeaderProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setShowMobileNav(!showMobileNav)}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
        >
          {showMobileNav ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Page title area - can be enhanced later */}
        <div className="flex-1 lg:ml-0" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 p-2 -mr-2 rounded-lg hover:bg-gray-100"
          >
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-medium text-sm">
                {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {profile?.full_name || user.email}
            </span>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.full_name || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <a
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4" />
                  Configuración
                </a>
                <a
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserIcon className="h-4 w-4" />
                  Mi perfil
                </a>
                <div className="border-t border-gray-200 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
    </header>
  );
}
