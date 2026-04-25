"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  CheckCircle,
  Filter,
  ShoppingBag,
  ArrowDownUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import StatCard from "./StatCard";
import OrderCard from "./OrderCard";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "../../../app/orders/loading";
import ErrorState from "../../../app/orders/error";
import { OrderStatus, OrderType } from "@/lib/types/order";
import {
  ORDER_STATUSES,
  SORT_OPTIONS,
  STATUS_CONFIG,
} from "@/lib/constants/constants";
import { useRouter, useSearchParams } from "next/navigation";

// -------------------- Types --------------------

type OrdersResponse = {
  orders: OrderType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasMore: boolean;
  };
};

// -------------------- Helpers --------------------

const getOrderId = (order: OrderType) =>
  order._id ? (typeof order._id === "string" ? order._id : "") : "";

const getStatusLabel = (status: OrderStatus | "all") => {
  if (status === "all") return "All Orders";
  return STATUS_CONFIG[status]?.label || "Orders";
};

// -------------------- Component --------------------

export default function AllOrders() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL = single source of truth
  const status = (searchParams.get("status") || "all") as OrderStatus | "all";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || "1");

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasMore: false,
  });

  // -------------------- Update URL --------------------

  const updateParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.replace(`?${params.toString()}`);
  };

  const handleStatusChange = (value: OrderStatus | "all") => {
    updateParams({
      status: value,
      page: "1",
    });
  };

  const handleSortChange = (value: string) => {
    updateParams({
      sort: value,
      page: "1",
    });
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      updateParams({
        page: (page + 1).toString(),
      });
    }
  };

  const handlePrevious = () => {
    if (page > 1 && !loading) {
      updateParams({
        page: (page - 1).toString(),
      });
    }
  };

  // -------------------- Fetch Orders --------------------

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "5", // Added limit for pagination
        ...(status !== "all" && { status }),
        sort,
      });

      const res = await fetch(`/api/orders?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load orders");
      }

      const data: OrdersResponse = await res.json();

      // Only show current page orders, not append
      setOrders(data.orders);
      setPagination(data.pagination);

      if (data.orders.length === 0) setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, status, sort]);

  // Reset when filters change
  useEffect(() => {
    setOrders([]);
  }, [status, sort]);

  // Fetch when params change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // -------------------- Stats --------------------
  // Note: This only shows stats for current page, not all orders
  const activeOrdersCount = orders.filter(
    (order) =>
      order.orderStatus !== "delivered" && order.orderStatus !== "cancelled",
  ).length;

  const completedOrdersCount = orders.filter(
    (order) => order.orderStatus === "delivered",
  ).length;

  // -------------------- Render --------------------
  if (loading && page === 1) return <LoadingSkeleton />;

  if (error && !orders.length) return <ErrorState error={error} />;

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-4 py-2">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track and manage your orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-1 md:gap-4 mb-4">
        <StatCard
          label="Total Orders"
          value={pagination.totalOrders}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          label="Active Orders"
          value={activeOrdersCount}
          icon={Package}
          color="amber"
        />
        <StatCard
          label="Completed"
          value={completedOrdersCount}
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      {/* Filters Section */}
      <div className="bg-card rounded-lg p-2 md:mb-2">
        <div className="flex gap-2 items-start sm:items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Status:
              </span>
              <Select
                value={status}
                onValueChange={(v) =>
                  handleStatusChange(v as OrderStatus | "all")
                }
              >
                <SelectTrigger className="w-20  md:w-32 h-9 text-xs md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_CONFIG[s as OrderStatus]?.label || "All"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Sort by:
              </span>
              <Select value={sort} onValueChange={(v) => handleSortChange(v)}>
                <SelectTrigger className="h-9 text-xs md:text-sm">
                  <ArrowDownUp className="h-3.5 w-3.5 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{getStatusLabel(status)}</h2>
        {pagination.totalOrders > 0 && (
          <p className="text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages} • Showing {orders.length}{" "}
            orders
          </p>
        )}
      </div>

      {/* Orders List */}
      {loading ? (
        <LoadingSkeleton />
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-2 lg:space-y-4">
            {orders.map((order) => (
              <OrderCard key={getOrderId(order)} order={order} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={loading || page === 1}
              className="min-w-[100px]"
            >
              ← Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loading || !pagination.hasMore}
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Next →"
              )}
            </Button>
          </div>

          {/* End Message */}
          {!pagination.hasMore && pagination.totalPages > 0 && (
            <div className="text-center mt-4 pt-4 border-t">
              <p className="text-sm text-gray-400">You have reached the end</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
