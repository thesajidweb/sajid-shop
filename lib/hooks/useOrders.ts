"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PaymentStatus, OrdersResponse, OrderStatus } from "../types/order";
import { DateRange } from "react-day-picker";

/* ================= TYPES ================= */

interface UseOrdersParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  dateRange?: DateRange;
}

interface UpdateStatusPayload {
  orderId: string;
  status: OrderStatus;
}

interface UpdatePaymentPayload {
  orderId: string;
  status: PaymentStatus;
}

interface ArchivePayload {
  orderId: string;
}

/* ================= API ================= */

async function fetchOrders(params: UseOrdersParams): Promise<OrdersResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;

    if (key === "dateRange" && value.from) {
      searchParams.append("fromDate", value.from.toISOString());
      if (value.to) searchParams.append("toDate", value.to.toISOString());
    } else {
      searchParams.append(key, String(value));
    }
  });

  const res = await fetch(`/api/orders?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch orders");

  return res.json();
}

async function patchOrder(orderId: string, body: any) {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

async function deleteOrder(orderId: string) {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}

/* ================= HOOK ================= */

export function useOrders(params: UseOrdersParams) {
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  /* ================= FETCH ================= */

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchOrders(params);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /* ================= OPTIMISTIC UPDATE ================= */

  const updateLocalOrder = (orderId: string, updates: any) => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        orders: prev.orders.map((order) =>
          order._id === orderId ? { ...order, ...updates } : order,
        ),
      };
    });
  };

  /* ================= MUTATIONS ================= */

  const updateOrderStatus = useCallback(
    async ({ orderId, status }: UpdateStatusPayload) => {
      setLoadingAction(orderId);

      // Optimistic UI
      updateLocalOrder(orderId, { orderStatus: status });

      try {
        await patchOrder(orderId, { orderStatus: status });
        toast.success("Order status updated");
      } catch (err) {
        toast.error("Failed to update order status");
        loadOrders(); // rollback
      } finally {
        setLoadingAction(null);
      }
    },
    [loadOrders],
  );

  const updatePaymentStatus = useCallback(
    async ({ orderId, status }: UpdatePaymentPayload) => {
      setLoadingAction(orderId);

      updateLocalOrder(orderId, { paymentStatus: status });

      try {
        await patchOrder(orderId, { paymentStatus: status });
        toast.success("Payment status updated");
      } catch (err) {
        toast.error("Failed to update payment status");
        loadOrders();
      } finally {
        setLoadingAction(null);
      }
    },
    [loadOrders],
  );

  const archiveOrder = useCallback(
    async ({ orderId }: ArchivePayload) => {
      setLoadingAction(orderId);

      // Optimistic remove
      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          orders: prev.orders.filter((o) => o._id !== orderId),
        };
      });

      try {
        await deleteOrder(orderId);
        toast.success("Order archived");
      } catch (err) {
        toast.error("Failed to archive order");
        loadOrders();
      } finally {
        setLoadingAction(null);
      }
    },
    [loadOrders],
  );

  /* ================= RETURN ================= */

  return {
    orders: data?.orders ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,

    isLoading,
    error,

    loadingAction, // 🔥 per-row loading (important)

    updateOrderStatus,
    updatePaymentStatus,
    archiveOrder,

    refetch: loadOrders,
  };
}
