"use client";

import { useState, useCallback } from "react";
import {
  getTodayAnalytics,
  getThisMonthAnalytics,
  getThisYearAnalytics,
  getLifetimeAnalytics,
  getTopProducts,
  getCustomMonthAnalytics,
  getCustomYearAnalytics,
  refreshAllAnalytics,
  getUserStats,
} from "@/lib/actions/analytics/analytics.action";
import { toast } from "sonner";

type AnalyticsData = {
  loading: boolean;
  data: any;
  error?: string;
};

export type TabType =
  | "today"
  | "month"
  | "year"
  | "lifetime"
  | "products"
  | "user";

export function useAnalytics() {
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    loading: false,
    data: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(
    async (type: string, year?: number, month?: number) => {
      setAnalytics({ loading: true, data: null });

      let result;
      switch (type) {
        case "today":
          result = await getTodayAnalytics();
          break;
        case "thisMonth":
          result = await getThisMonthAnalytics();
          break;
        case "thisYear":
          result = await getThisYearAnalytics();
          break;
        case "lifetime":
          result = await getLifetimeAnalytics();
          break;
        case "topProducts":
          result = await getTopProducts(10);
          break;
        case "userStats":
          result = await getUserStats();
          break;
        case "customMonth":
          if (year && month)
            result = await getCustomMonthAnalytics(year, month);
          break;
        case "customYear":
          if (year) result = await getCustomYearAnalytics(year);
          break;
        default:
          return;
      }

      setAnalytics({
        loading: false,
        data: result?.data,
        error: result?.error,
      });
    },
    [],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const result = await refreshAllAnalytics();
    toast.success(result.success ? result.message : result.error);
    setRefreshing(false);

    // Refresh current tab
    if (activeTab === "today") fetchAnalytics("today");
    else if (activeTab === "month") fetchAnalytics("thisMonth");
    else if (activeTab === "year") fetchAnalytics("thisYear");
    else if (activeTab === "lifetime") fetchAnalytics("lifetime");
    else if (activeTab === "products") fetchAnalytics("topProducts");
    else if (activeTab === "user") fetchAnalytics("userStats");
  }, [activeTab, fetchAnalytics]);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      setActiveTab(tab);
      if (tab === "products") fetchAnalytics("topProducts");
      else if (tab === "user") fetchAnalytics("userStats");
      else if (tab === "today") fetchAnalytics("today");
      else if (tab === "month") fetchAnalytics("thisMonth");
      else if (tab === "year") fetchAnalytics("thisYear");
      else if (tab === "lifetime") fetchAnalytics("lifetime");
    },
    [fetchAnalytics],
  );

  return {
    activeTab,
    analytics,
    refreshing,
    fetchAnalytics,
    handleRefresh,
    handleTabChange,
  };
}
