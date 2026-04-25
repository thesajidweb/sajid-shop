"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Package,
  ChevronRight,
  Calendar,
  RotateCcw,
  Star,
  MapPin,
  CreditCard,
  AlertCircle,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import Image from "next/image";
import { OrderType } from "@/lib/types/order";
import { STATUS_CONFIG } from "@/lib/constants/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// -------------------- Constants --------------------

const PAYMENT_CONFIG = {
  pending: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50" },
  paid: { label: "Paid", color: "text-emerald-600", bg: "bg-emerald-50" },
  failed: { label: "Failed", color: "text-rose-600", bg: "bg-rose-50" },
  refunded: { label: "Refunded", color: "text-gray-600", bg: "bg-gray-50" },
} as const;

// -------------------- Helpers --------------------

const formatDate = (date: OrderType["createdAt"]) => {
  if (!date) return "";

  try {
    const parsed = typeof date === "string" ? new Date(date) : date;
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const getItemTotal = (price?: number, qty?: number) => {
  return ((price || 0) * (qty || 0)).toFixed(2);
};

// -------------------- Component --------------------

const OrderCard = ({ order }: { order: OrderType }) => {
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderError, setReorderError] = useState<string | null>(null);

  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const router = useRouter();
  const status = order.orderStatus || "pending";
  const config =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ||
    STATUS_CONFIG["pending"];

  const StatusIcon = config.icon;

  const canArchive = () => {
    const status = order.orderStatus;
    return status === "delivered" || status === "cancelled";
  };

  const payment = order.paymentStatus || "pending";
  const paymentConfig =
    PAYMENT_CONFIG[payment as keyof typeof PAYMENT_CONFIG] ||
    PAYMENT_CONFIG.pending;

  const orderId = order._id;
  const items = order.items || [];

  const handleReorder = async () => {
    setIsReordering(true);
    setReorderError(null);

    try {
      // Create a new order object without the original order's _id and timestamps
      const reorderData = {
        items: order.items,
        shippingAddress: order.shippingAddress,
        shippingMethod: order.shippingMethod,
        paymentMethod: order.paymentMethod,
      };

      const response = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reorderData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Special handling for pending orders limit
        if (
          result.message?.includes("cannot place more than 3 orders at a time")
        ) {
          toast.error(
            "You already have 3 active orders. Please wait for them to be delivered before placing a new order.",
          );
        }
        throw new Error(result.message || "Failed to reorder");
      }

      if (result.success) {
        toast.success(result.message || "Order placed successfully!");
        setIsReorderDialogOpen(false);
        router.push(`/orders/${result.orderId}`);
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Reorder error:", error);
      setReorderError(
        error instanceof Error
          ? error.message
          : "An error occurred while reordering",
      );
    } finally {
      setIsReordering(false);
    }
  };

  const handleArchiveOrder = async () => {
    setIsArchiving(true);
    setArchiveError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        // Display the specific error message from the backend
        const errorMessage = result.error || "Failed to archive order";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      toast.success(result.message || "Order archived successfully!");
      setIsArchiveDialogOpen(false);

      // Refresh the page to show updated orders list
      router.refresh();
    } catch (error) {
      console.error("Archive error:", error);
      setArchiveError(
        error instanceof Error
          ? error.message
          : "An error occurred while archiving the order",
      );
    } finally {
      setIsArchiving(false);
    }
  };

  const getReorderSummary = () => {
    const totalItems = items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0,
    );
    const uniqueProducts = items.length;
    return {
      totalItems,
      uniqueProducts,
      total: (order.total ?? 0).toFixed(2),
    };
  };

  const reorderSummary = getReorderSummary();

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 border-border py-1 md:py-2">
        <CardContent className="p-2 lg:p-4">
          {/* Header */}
          <div className="flex flex-row sm:items-center justify-between gap-3 mb-2 pb-2 border-b">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/orders/${orderId}`}
                className="text-[12px] font-mono font-semibold hover:text-blue-600 transition-colors border border-border rounded-2xl p-0.5"
              >
                #{orderId.slice(-8) || "------"}
              </Link>

              <Badge
                className={`${config.bg} ${config.color} text-xs px-2 py-0.5 border-0`}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>

              <Badge
                className={`${paymentConfig.bg} ${paymentConfig.color} text-xs px-2 py-0.5 border-0`}
              >
                <CreditCard className="h-3 w-3 mr-1" />
                {paymentConfig.label}
              </Badge>
            </div>

            <div className="text-left sm:text-right">
              <div className="flex items-center gap-1 text-xs mt-0.5">
                <Calendar className="h-3 w-3" />
                {formatDate(order.createdAt)}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-2">
            {items.slice(0, 2).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name || "Product"}
                        width={40}
                        height={40}
                        className="w-8 h-8 object-cover rounded"
                      />
                    ) : (
                      <Package className="h-4 w-4 text-gray-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {item.name || "Product"}
                    </p>
                    <div className="flex items-center gap-1 text-xs ">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>• {item.color}</span>}
                      <span>• Qty: {item.quantity || 0}</span>
                    </div>
                  </div>
                </div>

                <span className="text-sm font-medium ml-2">
                  ₨ {getItemTotal(item.price, item.quantity)}
                </span>
              </div>
            ))}

            {items.length > 2 && (
              <p className="text-xs pl-12">
                +{items.length - 2} more item{items.length - 2 > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Shipping Info */}
          {order.shippingAddress?.fullName && (
            <div className="mb-4 p-3 bg-muted rounded-lg text-xs">
              <div className="flex items-center gap-1 mb-1">
                <MapPin className="h-3 w-3" />
                <span className="font-medium">Shipping Address</span>
              </div>
              <p className="text-muted-foreground pl-5">
                {order.shippingAddress.fullName}
                {order.shippingAddress.address &&
                  `, ${order.shippingAddress.address}`}
                {order.shippingAddress.city &&
                  `, ${order.shippingAddress.city}`}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Badge
              variant={"outline"}
              className="text-xs font-bold text-chart-2"
            >
              <span> Total: </span>₨ {(order.total ?? 0).toFixed(2)}
            </Badge>

            {order.orderStatus === "delivered" && (
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <Star className="h-3 w-3 mr-1" />
                Write Review
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => setIsReorderDialogOpen(true)}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reorder
            </Button>

            {/* Archive/Delete Button - Only show for delivered or cancelled orders */}
            {canArchive() && (
              <Button
                size="sm"
                variant="destructive"
                className="h-8 text-xs"
                onClick={() => setIsArchiveDialogOpen(true)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete Order
              </Button>
            )}

            <Link href={`/orders/${orderId}`}>
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                View Details
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Reorder Confirmation Dialog */}
      <AlertDialog
        open={isReorderDialogOpen}
        onOpenChange={setIsReorderDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Reorder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reorder these items?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4 p-4 bg-muted rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Order #{orderId.slice(-8)}
                </span>
                <span className="font-medium">₨ {reorderSummary.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items:</span>
                <span>
                  {reorderSummary.uniqueProducts} products (
                  {reorderSummary.totalItems} total)
                </span>
              </div>
              {order.shippingAddress?.fullName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping to:</span>
                  <span className="text-right">
                    {order.shippingAddress.fullName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {reorderError && (
            <div className="mb-4 p-3  border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{reorderError}</p>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReordering}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleReorder} disabled={isReordering}>
              {isReordering ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Confirm Reorder
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Order Confirmation Dialog - Only shown when canArchive is true */}
      {canArchive() && (
        <AlertDialog
          open={isArchiveDialogOpen}
          onOpenChange={setIsArchiveDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archive Order</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this order?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="my-4 p-4  rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800">
                    This action cannot be undone immediately.
                  </p>
                </div>
              </div>
            </div>

            {archiveError && (
              <div className="mb-4 p-3  border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-700">{archiveError}</p>
                </div>
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isArchiving}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleArchiveOrder}
                disabled={isArchiving}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isArchiving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Archiving...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Archive Order
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default OrderCard;
