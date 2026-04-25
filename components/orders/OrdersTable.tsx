// app/orders/components/OrdersTable.tsx
"use client";

import { format } from "date-fns";
import { MoreHorizontal, Eye, Archive, XCircle, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatus, OrderType, PaymentStatus } from "@/lib/types/order";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { StatusBadge } from "./StatusBadge";

interface OrdersTableProps {
  orders: OrderType[];
  isLoading: boolean;
  onViewDetails: (order: OrderType) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  onArchive: (orderId: string) => void;
  onCancel: (orderId: string) => void;
}

export function OrdersTable({
  orders,
  isLoading,
  onViewDetails,
  onUpdateStatus,
  onUpdatePaymentStatus,
  onArchive,
  onCancel,
}: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-mono text-sm">
                {order._id.slice(-8)}
              </TableCell>
              <TableCell>{order.shippingAddress.fullName}</TableCell>
              <TableCell>{order.shippingAddress.phone}</TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell className="capitalize">
                {order.paymentMethod}
              </TableCell>
              <TableCell>
                <StatusBadge status={order.paymentStatus} type="payment" />
              </TableCell>
              <TableCell>
                <StatusBadge status={order.orderStatus} type="order" />
              </TableCell>
              <TableCell>
                {format(new Date(order.createdAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewDetails(order)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onUpdateStatus(order._id, "processing")}
                      disabled={order.orderStatus === "processing"}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Mark as Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdateStatus(order._id, "shipped")}
                      disabled={order.orderStatus === "shipped"}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Mark as Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdateStatus(order._id, "delivered")}
                      disabled={order.orderStatus === "delivered"}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Mark as Delivered
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onUpdatePaymentStatus(order._id, "paid")}
                      disabled={order.paymentStatus === "paid"}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Mark Payment as Paid
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdatePaymentStatus(order._id, "refunded")}
                      disabled={order.paymentStatus === "refunded"}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Mark Payment as Refunded
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdatePaymentStatus(order._id, 'pending')}
                      disabled={order.paymentStatus === 'pending'}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Mark Payment as Pending
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onCancel(order._id)}
                      className="text-red-600"
                      disabled={order.orderStatus === "cancelled"}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Order
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onArchive(order._id)}
                      className="text-red-600"
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
