"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-2xl bg-gray-100 p-1",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-white text-[#1A1A2E] shadow-sm"
                : "text-[#6B7280] hover:text-[#1A1A2E]"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps {
  children: React.ReactNode;
  value: string;
  activeTab: string;
  className?: string;
}

function TabPanel({ children, value, activeTab, className }: TabPanelProps) {
  if (value !== activeTab) return null;

  return <div className={cn("", className)}>{children}</div>;
}

export { Tabs, TabPanel };
