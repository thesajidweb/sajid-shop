"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { DateRange } from "react-day-picker";
import { OrderStatus, OrderType, PaymentStatus } from "@/lib/types/order";
import { useOrders } from "@/lib/hooks/useOrders";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";
import { DeleteConfirmDialog } from "@/components/orders/DeleteConfirmDialog";

type ConfirmDialogState =
  | { open: false }
  | { open: true; orderId: string; type: "cancel" | "archive" };

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pagination state
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Selected order for modal
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Confirm dialog state using discriminated union
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
  });

  // Filters state
  const [filters, setFilters] = useState<{
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    search?: string;
    dateRange?: DateRange;
  }>({
    orderStatus: (searchParams.get("orderStatus") as OrderStatus) || undefined,
    paymentStatus:
      (searchParams.get("paymentStatus") as PaymentStatus) || undefined,
    search: searchParams.get("search") || undefined,
  });

  // Query params for fetching orders
  const queryParams = useMemo(
    () => ({
      page,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc" as const, // exact type
      ...filters,
    }),
    [page, filters],
  );

  const {
    orders,
    totalPages,
    isLoading,
    updateOrderStatus,
    updatePaymentStatus,
    archiveOrder,
  } = useOrders(queryParams);

  // Filters change handler
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);

    const params = new URLSearchParams();
    if (newFilters.orderStatus)
      params.set("orderStatus", newFilters.orderStatus);
    if (newFilters.paymentStatus)
      params.set("paymentStatus", newFilters.paymentStatus);
    if (newFilters.search) params.set("search", newFilters.search);

    router.push(`/dashboard/orders?${params.toString()}`);
  };

  // Order status update
  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus({ orderId, status });
  };

  // Payment status update
  const handleUpdatePaymentStatus = (
    orderId: string,
    status: PaymentStatus,
  ) => {
    updatePaymentStatus({ orderId, status });
  };

  // Cancel order
  const handleCancelOrder = (orderId: string) => {
    updateOrderStatus({ orderId, status: "cancelled" });
    setConfirmDialog({ open: false });
  };

  // Archive order
  const handleArchiveOrder = (orderId: string) => {
    archiveOrder({ orderId }); // Ensure ArchivePayload type
    setConfirmDialog({ open: false });
  };

  // View order details
  const handleViewDetails = (order: OrderType) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  return (
    <div className=" mx-auto py-8 px-2 md:px:4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Orders Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-2">
          {/* Filters */}
          <OrdersFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
          />

          {/* Orders table */}
          <OrdersTable
            orders={orders}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            onArchive={(orderId) =>
              setConfirmDialog({ open: true, orderId, type: "archive" })
            }
            onCancel={(orderId) =>
              setConfirmDialog({ open: true, orderId, type: "cancel" })
            }
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                  />
                </PaginationItem>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={page === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && <PaginationEllipsis />}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* Order details modal */}
      <OrderDetailsModal
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {/* Confirm dialog for cancel/archive */}
      <DeleteConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) =>
            prev.open ? { ...prev, open } : { open: false },
          )
        }
        onConfirm={() => {
          if (confirmDialog.open && confirmDialog.orderId) {
            if (confirmDialog.type === "cancel") {
              handleCancelOrder(confirmDialog.orderId);
            } else {
              handleArchiveOrder(confirmDialog.orderId);
            }
          }
        }}
        title={
          confirmDialog.open && confirmDialog.type === "cancel"
            ? "Cancel Order"
            : "Archive Order"
        }
        description={
          confirmDialog.open && confirmDialog.type === "cancel"
            ? "Are you sure you want to cancel this order."
            : "Are you sure you want to archive this order? You can still access it from archived orders."
        }
      />
    </div>
  );
}
