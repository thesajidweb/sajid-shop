"use client";

import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { useState } from "react";
import { AnalyticsHeader } from "./analytics/AnalyticsHeader";
import { AnalyticsTabs } from "./analytics/AnalyticsTabs";
import { CustomSelectors } from "./analytics/CustomSelectors";
import { DataDisplay } from "./analytics/DataDisplay";

export default function AnalyticsDashboard() {
  const {
    activeTab,
    analytics,
    refreshing,
    fetchAnalytics,
    handleRefresh,
    handleTabChange,
  } = useAnalytics();
  const [customYear, setCustomYear] = useState(new Date().getFullYear());
  const [customMonth, setCustomMonth] = useState(new Date().getMonth() + 1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num || 0);
  };

  const handleCustomFetch = (type: "month" | "year") => {
    if (type === "month") {
      fetchAnalytics("customMonth", customYear, customMonth);
    } else {
      fetchAnalytics("customYear", customYear);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-2 md: sm:p-4 md:p-6 max-w-7xl mx-auto ">
        <AnalyticsHeader onRefresh={handleRefresh} refreshing={refreshing} />
        <AnalyticsTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <CustomSelectors
          activeTab={activeTab}
          customYear={customYear}
          customMonth={customMonth}
          onYearChange={setCustomYear}
          onMonthChange={setCustomMonth}
          onFetchCustom={handleCustomFetch}
        />

        {analytics.loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">
                Loading analytics data...
              </p>
            </div>
          </div>
        )}

        {analytics.error && !analytics.loading && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-600 dark:text-red-400">
              ❌ Error: {analytics.error}
            </p>
          </div>
        )}

        {!analytics.loading && !analytics.error && analytics.data && (
          <DataDisplay
            data={analytics.data}
            type={activeTab}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        )}

        {!analytics.loading && !analytics.error && !analytics.data && (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              Click on any tab to fetch analytics data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
