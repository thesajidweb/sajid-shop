// app/orders/components/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { OrderStatus, PaymentStatus } from "@/lib/types/order";

const orderStatusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  shipped: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  delivered: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
} as const;

const paymentStatusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  paid: "bg-green-100 text-green-800 hover:bg-green-100",
  failed: "bg-red-100 text-red-800 hover:bg-red-100",
} as const;

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus;
  type: "order" | "payment";
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const colors = type === "order" ? orderStatusColors : paymentStatusColors;
  const color = colors[status as keyof typeof colors] || colors.pending;

  return <Badge className={`${color} font-medium capitalize`}>{status}</Badge>;
}
