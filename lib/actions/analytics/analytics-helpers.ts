// lib/actions/analytics/analytics-helpers.ts

import { Order } from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import {
  DailyAnalytics,
  MonthlyAnalytics,
  ProductStats,
} from "@/lib/models/Analytics";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  cost?: number;
}

interface Order {
  _id: string;
  createdAt: Date | string;
  total: number;
  items: OrderItem[];
  paymentStatus: string;
  orderStatus: string;
  userId?: string;
}


export function calculateOrderProfit(order: Order): number {
  let totalProfit = 0;
  for (const item of order.items) {
    const itemCost = (item.cost || 0) * item.quantity;
    const itemRevenue = item.price * item.quantity;
    totalProfit += itemRevenue - itemCost;
  }
  return totalProfit;
}


export async function updateAnalyticsOnPaid(order: Order): Promise<void> {
  const date = new Date(order.createdAt);
  const today = date.toISOString().split("T")[0];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthId = `${year}-${month.toString().padStart(2, "0")}`;

  const totalProfit = calculateOrderProfit(order);
  const totalProductsSold = order.items.reduce(
    (sum: number, i: OrderItem) => sum + i.quantity,
    0,
  );

  // Update Daily Analytics
  await DailyAnalytics.updateOne(
    { date: today },
    {
      $inc: {
        revenue: order.total,
        orders: 1,
        profit: totalProfit,
        productsSold: totalProductsSold,
      },
    },
    { upsert: true },
  );

  // Update Monthly Analytics
  await MonthlyAnalytics.updateOne(
    { _id: monthId },
    {
      $inc: {
        revenue: order.total,
        orders: 1,
        profit: totalProfit,
        productsSold: totalProductsSold,
      },
      $set: { year, month },
    },
    { upsert: true },
  );

  // Recalculate average order value for month
  const monthData = await MonthlyAnalytics.findById(monthId);
  if (monthData && monthData.orders > 0) {
    monthData.avgOrderValue = monthData.revenue / monthData.orders;
    await monthData.save();
  }

  // Update Product Stats with profit
  for (const item of order.items) {
    const itemRevenue = item.price * item.quantity;
    const itemCost = (item.cost || 0) * item.quantity;
    const itemProfit = itemRevenue - itemCost;

    // Update ProductStats collection
    await ProductStats.updateOne(
      { productId: item.productId },
      {
        $inc: {
          totalSold: item.quantity,
          totalRevenue: itemRevenue,
          totalProfit: itemProfit,
        },
      },
      { upsert: true },
    );

    // Update Product model directly
    await Product.updateOne(
      { _id: item.productId },
      {
        $inc: {
          salesCount: item.quantity,
          totalRevenue: itemRevenue,
          totalProfit: itemProfit,
        },
        $set: { lastSoldAt: order.createdAt },
      },
    );
  }
}

// Reverse analytics when order is cancelled/refunded
export async function reverseAnalyticsOnCancellation(
  order: Order,
): Promise<void> {
  const date = new Date(order.createdAt);
  const today = date.toISOString().split("T")[0];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthId = `${year}-${month.toString().padStart(2, "0")}`;

  const totalProfit = calculateOrderProfit(order);
  const totalProductsSold = order.items.reduce(
    (sum: number, i: OrderItem) => sum + i.quantity,
    0,
  );

  // Reverse daily analytics
  await DailyAnalytics.updateOne(
    { date: today },
    {
      $inc: {
        revenue: -order.total,
        orders: -1,
        profit: -totalProfit,
        productsSold: -totalProductsSold,
      },
    },
  );

  // Reverse monthly analytics
  await MonthlyAnalytics.updateOne(
    { _id: monthId },
    {
      $inc: {
        revenue: -order.total,
        orders: -1,
        profit: -totalProfit,
        productsSold: -totalProductsSold,
        cancelledOrders: 1,
      },
    },
  );

  // Recalculate monthly avg
  const monthData = await MonthlyAnalytics.findById(monthId);
  if (monthData && monthData.orders > 0) {
    monthData.avgOrderValue = monthData.revenue / monthData.orders;
    await monthData.save();
  }

  // Reverse product stats
  for (const item of order.items) {
    const itemRevenue = item.price * item.quantity;
    const itemCost = (item.cost || 0) * item.quantity;
    const itemProfit = itemRevenue - itemCost;

    await ProductStats.updateOne(
      { productId: item.productId },
      {
        $inc: {
          totalSold: -item.quantity,
          totalRevenue: -itemRevenue,
          totalProfit: -itemProfit,
        },
      },
    );

    await Product.updateOne(
      { _id: item.productId },
      {
        $inc: {
          salesCount: -item.quantity,
          totalRevenue: -itemRevenue,
          totalProfit: -itemProfit,
        },
      },
    );
  }
}
