import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";

export const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const WARRANTY_UNITS = [
  { value: "month", label: "Months" },
  { value: "year", label: "Years" },
];

export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "text-purple-600",
    bg: "bg-purple-50",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-rose-600",
    bg: "bg-rose-50",
    icon: XCircle,
  },
} as const;

export const ORDER_STATUSES: string[] = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Highest Total", value: "total" },
];
