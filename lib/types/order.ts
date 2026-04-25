// lib/validations.ts
import { z } from "zod";

export const OrderStatusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const PaymentStatusSchema = z.enum([
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string().optional(),
  color: z.string().optional(),
  colorCode: z.string().optional(),
  size: z.string(),
  price: z.number(),
  cost: z.number().optional(), // Added cost field to match model
  quantity: z.number(),
  image: z.string().optional(),
});

export const ShippingAddressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  landmark: z.string().optional(),
  zipCode: z.string(),
  country: z.string(),
});

export const CreateOrderSchema = z.object({
  userId: z.string(),
  items: z.array(OrderItemSchema),
  shippingAddress: ShippingAddressSchema,
  shippingMethod: z.string(),
  paymentMethod: z.string(),
  subtotal: z.number(),
  shipping: z.number(),
  tax: z.number(),
  total: z.number(),
  totalCost: z.number().optional(),
  totalRevenue: z.number().optional(),
  orderStatus: OrderStatusSchema.default("pending"),
  editableUntil: z.coerce.date(),
  cancelledAt: z.coerce.date().optional(),
  isHiddenByUser: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  paymentStatus: PaymentStatusSchema.default("pending"),
});

export const OrderSchema = CreateOrderSchema.extend({
  _id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type OrderItemType = z.infer<typeof OrderItemSchema>;
export type CreateOrderType = z.infer<typeof CreateOrderSchema>;
export type OrderType = z.infer<typeof OrderSchema>;

// API Response Types
export interface OrdersResponse {
  orders: OrderType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
