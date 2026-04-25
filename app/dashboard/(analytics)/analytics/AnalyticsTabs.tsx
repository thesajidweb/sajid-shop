"use client";

import { TabType } from "@/lib/hooks/useAnalytics";

interface AnalyticsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "today", label: "📅 Today" },
  { id: "month", label: "📆 This Month" },
  { id: "year", label: "📊 This Year" },
  { id: "lifetime", label: "🏆 Lifetime" },
  { id: "products", label: "⭐ Top Products" },
  { id: "user", label: "👤 My Stats" },
];

export function AnalyticsTabs({ activeTab, onTabChange }: AnalyticsTabsProps) {
  return (
    <div className="overflow-x-auto pb-2 mb-4">
      <div className="flex gap-2 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-2 py-1.5 p-text rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
