"use client";

import { User } from "@supabase/supabase-js";
import { Bell, Search, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  user: User;
  profile: {
    full_name?: string;
    avatar_url?: string;
  } | null;
}

export function Header({ user, profile }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  
  const displayName = profile?.full_name || user.email?.split("@")[0] || "Usuario";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Greeting */}
        <div className="lg:ml-0 ml-12">
          <p className="text-sm text-gray-500">{getGreeting()}</p>
          <h1 className="font-semibold text-gray-900">{displayName}</h1>
        </div>

        {/* Center: Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar transacciones..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Quick Add */}
          <Link
            href="/transactions?action=new"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all active:scale-[0.98] shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Agregar</span>
          </Link>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>

          {/* Profile */}
          <Link
            href="/settings/profile"
            className="flex items-center gap-3 p-1 pr-3 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {initials}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3 animate-slide-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar transacciones..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
}
