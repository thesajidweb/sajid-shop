// app/orders/components/OrderDetailsModal.tsx
"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { OrderType } from "@/lib/types/order";

interface OrderDetailsModalProps {
  order: OrderType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const timeline = [
    { status: "created", date: order.createdAt, label: "Created" },
    ...(order.orderStatus === "processing" ||
    order.orderStatus === "shipped" ||
    order.orderStatus === "delivered"
      ? [{ status: "processing", date: order.updatedAt, label: "Processing" }]
      : []),
    ...(order.orderStatus === "shipped" || order.orderStatus === "delivered"
      ? [{ status: "shipped", date: order.updatedAt, label: "Shipped" }]
      : []),
    ...(order.orderStatus === "delivered"
      ? [{ status: "delivered", date: order.updatedAt, label: "Delivered" }]
      : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-[95vw] sm:max-w-3xl h-auto max-h-[98vh] p-0 sm:max-h-[85vh] print:max-w-none print:max-h-none print:shadow-none print:border ">
        <div className="flex flex-col h-full">
          {/* Header - Responsive */}
          <DialogHeader className="px-3 pt-1 pb-1 sm:px-4 sm:pt-4 print:px-2 print:pt-2">
            <DialogTitle className="text-sm sm:text-base font-semibold print:text-sm">
              Order #{order._id.slice(-8)}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 px-2 pb-1 sm:px-4 sm:pb-4 print:overflow-visible print:px-2 print:pb-2">
            <div className="space-y-1 sm:space-y-4 print:space-y-2">
              {/* Timeline - Responsive */}
              <div>
                <h4 className="text-[11px] sm:text-xs font-semibold mb-1.5 text-muted-foreground print:text-[10px]">
                  Timeline
                </h4>
                <div className="flex flex-col gap-2">
                  {timeline.map((event) => (
                    <div
                      key={event.status}
                      className="flex items-start gap-2 text-[11px] sm:text-xs print:text-[10px]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1 print:w-1 print:h-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="font-medium">{event.label}:</span>
                          <span className="text-muted-foreground">
                            {format(new Date(event.date), "MMM d, h:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="print:my-1" />

              {/* Items - Responsive Table */}
              <div>
                <h4 className="text-[11px] sm:text-xs font-semibold mb-1.5 text-muted-foreground print:text-[10px]">
                  Items ({order.items.length})
                </h4>
                <div className="border rounded-md overflow-x-auto print:border print:border-gray-200">
                  <table className="w-full text-[11px] sm:text-xs print:text-[10px] min-w-[400px] sm:min-w-full">
                    <thead className="bg-muted print:bg-gray-50">
                      <tr>
                        <th className="text-left py-1.5 px-2 font-medium">
                          Product
                        </th>
                        <th className="text-left py-1.5 px-2 font-medium hidden sm:table-cell">
                          Size/Color
                        </th>
                        <th className="text-center py-1.5 px-2 font-medium w-12">
                          Qty
                        </th>
                        <th className="text-right py-1.5 px-2 font-medium">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr
                          key={index}
                          className="border-t print:border-t print:border-gray-100"
                        >
                          <td className="py-1.5 px-2">
                            <div className="max-w-[100px] sm:max-w-[180px]">
                              <p
                                className="font-medium sm:font-normal wrap-break-word"
                                title={item.name || item.productId}
                              >
                                {item.name || item.productId?.slice(-8)}
                              </p>
                              {/* Show size/color on mobile */}
                              <p className="text-[10px] sm:hidden text-muted-foreground mt-0.5">
                                {item.size}
                                {item.color && ` / ${item.color}`}
                              </p>
                            </div>
                          </td>
                          <td className="py-1.5 px-2 hidden sm:table-cell">
                            {item.size}
                            {item.color && ` / ${item.color}`}
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            {item.quantity}
                          </td>
                          <td className="py-1.5 px-2 text-right whitespace-nowrap">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator className="print:my-1" />

              {/* Address & Price - Responsive Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 print:gap-2">
                {/* Shipping Address */}
                <div className="bg-muted/30 sm:bg-transparent p-2 sm:p-0 rounded-md">
                  <h4 className="text-[11px] sm:text-xs font-semibold mb-1.5 text-muted-foreground print:text-[10px]">
                    Shipping Address
                  </h4>
                  <div className="text-[11px] sm:text-xs print:text-[10px] leading-relaxed sm:leading-tight space-y-0.5 wrap-break-word">
                    <p className="font-medium">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.phone}
                    </p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.province}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div>
                  <h4 className="text-[11px] sm:text-xs font-semibold mb-1.5 text-muted-foreground print:text-[10px]">
                    Price Breakdown
                  </h4>
                  <div className="space-y-0.5 text-[11px] sm:text-xs print:text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatCurrency(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                    <Separator className="my-0.5 print:my-0" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary sm:text-foreground">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="print:my-1" />

              {/* Statuses - Responsive */}
              <div className="flex flex-wrap gap-3 sm:gap-4 text-[11px] sm:text-xs print:text-[10px]">
                <div className="flex-1 min-w-[100px] sm:min-w-0">
                  <p className="text-muted-foreground mb-0.5 text-[10px] sm:text-xs">
                    Order Status
                  </p>
                  <StatusBadge status={order.orderStatus} type="order" />
                </div>
                <div className="flex-1 min-w-[100px] sm:min-w-0">
                  <p className="text-muted-foreground mb-0.5 text-[10px] sm:text-xs">
                    Payment Status
                  </p>
                  <StatusBadge status={order.paymentStatus} type="payment" />
                </div>
                <div className="flex-1 min-w-[100px] sm:min-w-0">
                  <p className="text-muted-foreground mb-0.5 text-[10px] sm:text-xs">
                    Payment Method
                  </p>
                  <p className="capitalize font-medium text-xs sm:text-sm wrap-break-word">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Order Meta - Responsive */}
              <div className="text-[9px] sm:text-[10px] text-muted-foreground pt-1 print:text-[8px] border-t sm:border-t-0 sm:pt-0">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                  <p className="break-all sm:break-normal">
                    Order ID: <span className="font-mono">{order._id}</span>
                  </p>
                  <p className="whitespace-nowrap">
                    Placed: {format(new Date(order.createdAt), "PPP p")}
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
