"use client";

import { Loader2 } from "lucide-react";

interface AnalyticsHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export function AnalyticsHeader({
  onRefresh,
  refreshing,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold ">
          📊 Analytics Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track your business performance in real-time
        </p>
      </div>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="px-2 py-1 bg-linear-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-sm sm:text-base"
      >
        <span className="text-lg">
          {refreshing && <Loader2 className="w-4 h-4 animate-spin " />}
        </span>
        <span>{refreshing ? "Refreshing..." : "Refresh Analytics"}</span>
      </button>
    </div>
  );
}
