// lib/actions/analytics/analytics.action.ts
"use server";

import { connectToDB } from "@/lib/db/connect";
import {
  DailyAnalytics,
  MonthlyAnalytics,
  ProductStats,
} from "@/lib/models/Analytics";
import { Order } from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { revalidatePath } from "next/cache";
import { calculateOrderProfit } from "./analytics-helpers";
import { getServerAuth } from "@/lib/auth/getServerAuth";
import { OrderType } from "@/lib/types/order";

// ============================================================================
// Type Definitions
// ============================================================================

// Base response type
interface AnalyticsResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Core data types
interface DailyAnalyticsData {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
  productsSold: number;
  avgOrderValue: number;
  cancelledOrders: number;
  refundedAmount: number;
}

interface MonthlyAnalyticsData {
  _id: string;
  year: number;
  month: number;
  revenue: number;
  orders: number;
  profit: number;
  productsSold: number;
  avgOrderValue: number;
  cancelledOrders: number;
  refundedAmount: number;
}

interface YearlyAnalyticsData {
  year: number;
  revenue: number;
  orders: number;
  profit: number;
  productsSold: number;
  cancelledOrders: number;
  refundedAmount: number;
  avgOrderValue: number;
  monthsData?: MonthlyAnalyticsData[];
}

interface LifetimeAnalyticsData {
  totalRevenue: number;
  totalProfit: number;
  totalProductsSold: number;
  totalOrders: number;
  totalCancelledOrders: number;
  totalRefundedAmount: number;
  avgOrderValue: number;
}

interface UserStatsData {
  totalSpent: number;
  totalOrders: number;
  totalItems: number;
  averageOrderValue: number;
}

interface CancelledOrdersAnalyticsData {
  totalCancelled: number;
  totalRefunded: number;
  cancelledByMonth: Array<{ month: string; count: number; amount: number }>;
  recentCancellations: unknown[];
}

interface TopProductStat {
  _id: string;
  productId: string | ProductInfo;
  totalSold: number;
  totalRevenue: number;
  totalProfit: number;
  totalProfitMargin?: number;
  productInfo?: {
    name: string;
    price: number;
    cost: number;
    finalPrice: number;
    images: string[];
  };
}

interface ProductInfo {
  _id: string;
  name: string;
  price: number;
  finalPrice: number;
  cost: number;
  images: string[];
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  cost?: number;
}

interface OrderDocument {
  _id: string;
  userId: string;
  total: number;
  orderStatus: 'cancelled' | 'delivered' | 'pending' | 'processing' | 'shipped';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  createdAt: Date;
  items?: OrderItem[];
}

interface AggregatedStats {
  revenue: number;
  orders: number;
  profit: number;
  productsSold: number;
  cancelledOrders: number;
  refundedAmount: number;
}

interface MonthlyAggregationItem {
  _id: {
    year: number;
    month: number;
  };
  count: number;
  amount: number;
}

interface RefreshAnalyticsResult {
  message: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function toPlainObject<T>(data: T): T | null {
  if (!data) return null;
  return JSON.parse(JSON.stringify(data));
}

function calculateProductsSold(orders: OrderDocument[]): number {
  return orders.reduce((sum, order) => 
    sum + (order.items?.reduce((s, item) => s + (item.quantity || 0), 0) || 0), 0
  );
}

function calculateRevenue(orders: OrderDocument[]): number {
  return orders
    .filter(order => order.orderStatus !== 'cancelled' && order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + (order.total || 0), 0);
}

function calculateCompletedOrders(orders: OrderDocument[]): OrderDocument[] {
  return orders.filter(order => order.orderStatus !== 'cancelled' && order.paymentStatus === 'paid');
}

function calculateCancelledOrders(orders: OrderDocument[]): number {
  return orders.filter(order => order.orderStatus === 'cancelled').length;
}

function calculateRefundedAmount(orders: OrderDocument[]): number {
  return orders
    .filter(order => order.paymentStatus === 'refunded')
    .reduce((sum, order) => sum + (order.total || 0), 0);
}

function calculateAvgOrderValue(revenue: number, orderCount: number): number {
  return orderCount > 0 ? revenue / orderCount : 0;
}

// ============================================================================
// Server Actions
// ============================================================================

export async function getTodayAnalytics(): Promise<AnalyticsResponse<DailyAnalyticsData>> {
  try {
    await connectToDB();
    const today = new Date().toISOString().split("T")[0];
    const data = await DailyAnalytics.findOne({ date: today });

    if (!data) {
      const startOfDay = new Date(today);
      const endOfDay = new Date(new Date(today).setDate(new Date(today).getDate() + 1));
      
      const orders = await Order.find({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }) as OrderDocument[];

      const completedOrders = calculateCompletedOrders(orders);
      const revenue = calculateRevenue(orders);
      const cancelledOrders = calculateCancelledOrders(orders);
      const refundedAmount = calculateRefundedAmount(orders);

      return {
        success: true,
        data: {
          date: today,
          revenue,
          orders: completedOrders.length,
          profit: 0,
          productsSold: calculateProductsSold(completedOrders),
          avgOrderValue: calculateAvgOrderValue(revenue, completedOrders.length),
          cancelledOrders,
          refundedAmount,
        },
      };
    }

    const plainData = toPlainObject(data);
    return {
      success: true,
      data: {
        date: plainData!.date,
        revenue: plainData!.revenue,
        orders: plainData!.orders,
        profit: plainData!.profit,
        productsSold: plainData!.productsSold,
        avgOrderValue: calculateAvgOrderValue(plainData!.revenue, plainData!.orders),
        cancelledOrders: plainData!.cancelledOrders,
        refundedAmount: plainData!.refundedAmount,
      },
    };
  } catch (error) {
    console.error("getTodayAnalytics error:", error);
    return { success: false, error: String(error) };
  }
}

export async function getThisMonthAnalytics(): Promise<AnalyticsResponse<MonthlyAnalyticsData>> {
  try {
    await connectToDB();
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const monthId = `${year}-${month.toString().padStart(2, "0")}`;

    const data = await MonthlyAnalytics.findById(monthId);

    if (!data) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const orders = await Order.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }) as OrderDocument[];

      const completedOrders = calculateCompletedOrders(orders);
      const revenue = calculateRevenue(orders);
      const cancelledOrders = calculateCancelledOrders(orders);
      const refundedAmount = calculateRefundedAmount(orders);

      return {
        success: true,
        data: {
          _id: monthId,
          year,
          month,
          revenue,
          orders: completedOrders.length,
          profit: 0,
          productsSold: calculateProductsSold(completedOrders),
          avgOrderValue: calculateAvgOrderValue(revenue, completedOrders.length),
          cancelledOrders,
          refundedAmount,
        },
      };
    }

    const plainData = toPlainObject(data);
    return { 
      success: true, 
      data: {
        _id: plainData!._id,
        year: plainData!.year,
        month: plainData!.month,
        revenue: plainData!.revenue,
        orders: plainData!.orders,
        profit: plainData!.profit,
        productsSold: plainData!.productsSold,
        avgOrderValue: calculateAvgOrderValue(plainData!.revenue, plainData!.orders),
        cancelledOrders: plainData!.cancelledOrders,
        refundedAmount: plainData!.refundedAmount,
      }
    };
  } catch (error) {
    console.error("getThisMonthAnalytics error:", error);
    return { success: false, error: String(error) };
  }
}

export async function getThisYearAnalytics(): Promise<AnalyticsResponse<YearlyAnalyticsData>> {
  try {
    await connectToDB();
    const year = new Date().getFullYear();
    const monthlyData = await MonthlyAnalytics.find({ year });

    if (monthlyData.length === 0) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      
      const orders = await Order.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }) as OrderDocument[];

      const completedOrders = calculateCompletedOrders(orders);
      const revenue = calculateRevenue(orders);
      const cancelledOrders = calculateCancelledOrders(orders);
      const refundedAmount = calculateRefundedAmount(orders);

      return {
        success: true,
        data: {
          year,
          revenue,
          orders: completedOrders.length,
          profit: 0,
          productsSold: calculateProductsSold(completedOrders),
          cancelledOrders,
          refundedAmount,
          avgOrderValue: calculateAvgOrderValue(revenue, completedOrders.length),
          monthsData: [],
        },
      };
    }

    const aggregated = monthlyData.reduce<AggregatedStats>(
      (acc, curr) => {
        acc.revenue += curr.revenue || 0;
        acc.orders += curr.orders || 0;
        acc.profit += curr.profit || 0;
        acc.productsSold += curr.productsSold || 0;
        acc.cancelledOrders += curr.cancelledOrders || 0;
        acc.refundedAmount += curr.refundedAmount || 0;
        return acc;
      },
      {
        revenue: 0,
        orders: 0,
        profit: 0,
        productsSold: 0,
        cancelledOrders: 0,
        refundedAmount: 0,
      },
    );

    return {
      success: true,
      data: {
        year,
        ...aggregated,
        avgOrderValue: calculateAvgOrderValue(aggregated.revenue, aggregated.orders),
        monthsData: toPlainObject(monthlyData) ?? undefined,
      },
    };
  } catch (error) {
    console.error("getThisYearAnalytics error:", error);
    return { success: false, error: String(error) };
  }
}

export async function getLifetimeAnalytics(): Promise<AnalyticsResponse<LifetimeAnalyticsData>> {
  try {
    await connectToDB();
    const allOrders = await Order.find({}) as OrderDocument[];
    
    const completedOrders = calculateCompletedOrders(allOrders);
    const cancelledOrders = calculateCancelledOrders(allOrders);
    const refundedAmount = calculateRefundedAmount(allOrders);
    
    let totalRevenue = 0;
    let totalProfit = 0;
    let totalProductsSold = 0;

    for (const order of completedOrders) {
      totalRevenue += order.total || 0;
      totalProfit += calculateOrderProfit(order as OrderType);
      totalProductsSold += order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
    }

    return {
      success: true,
      data: {
        totalRevenue,
        totalProfit,
        totalProductsSold,
        totalOrders: completedOrders.length,
        totalCancelledOrders: cancelledOrders,
        totalRefundedAmount: refundedAmount,
        avgOrderValue: calculateAvgOrderValue(totalRevenue, completedOrders.length),
      },
    };
  } catch (error) {
    console.error("getLifetimeAnalytics error:", error);
    return { success: false, error: String(error) };
  }
}

export async function getCancelledOrdersAnalytics(): Promise<AnalyticsResponse<CancelledOrdersAnalyticsData>> {
  try {
    await connectToDB();
    
    const cancelledOrders = await Order.find({
      orderStatus: "cancelled"
    }).sort({ createdAt: -1 }).limit(50) as OrderDocument[];

    const refundedOrders = await Order.find({
      paymentStatus: "refunded"
    }) as OrderDocument[];

    const cancelledByMonth = await Order.aggregate([
      {
        $match: {
          orderStatus: "cancelled"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 },
          amount: { $sum: "$total" }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      },
      {
        $limit: 12
      }
    ]) as MonthlyAggregationItem[];

    const formattedByMonth = cancelledByMonth.map(item => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, "0")}`,
      count: item.count,
      amount: item.amount
    }));

    return {
      success: true,
      data: {
        totalCancelled: cancelledOrders.length,
        totalRefunded: refundedOrders.length,
        cancelledByMonth: formattedByMonth,
        recentCancellations: toPlainObject(cancelledOrders) ?? []
      }
    };
  } catch (error) {
    console.error("getCancelledOrdersAnalytics error:", error);
    return { success: false, error: String(error) };
  }
}

export async function getTopProducts(
  limit: number = 10,
): Promise<AnalyticsResponse<TopProductStat[]>> {
  try {
    await connectToDB();
    const productStats = await ProductStats.find()
      .sort({ totalSold: -1 })
      .limit(limit)
      .populate("productId", "name price finalPrice cost images") as unknown as TopProductStat[];

    const transformedData = (toPlainObject(productStats) || []).map((stat) => {
      const product = stat.productId as unknown as ProductInfo;
      const revenue = stat.totalRevenue || 0;
      const profit = stat.totalProfit || 0;
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

      return {
        ...stat,
        totalProfitMargin: Number(profitMargin.toFixed(2)),
        productInfo: product ? {
          name: product.name || "Unknown Product",
          price: product.price || 0,
          cost: product.cost || 0,
          finalPrice: product.finalPrice || product.price || 0,
          images: product.images || [],
        } : {
          name: "Product Not Found",
          price: 0,
          cost: 0,
          finalPrice: 0,
          images: [],
        },
      };
    });

    return {
      success: true,
      data: transformedData,
    };
  } catch (error) {
    console.error("getTopProducts error:", error);
    return { success: false, error: String(error) };
  }
}

export async function getCustomMonthAnalytics(
  year: number,
  month: number,
): Promise<AnalyticsResponse<MonthlyAnalyticsData>> {
  try {
    await connectToDB();
    const monthId = `${year}-${month.toString().padStart(2, "0")}`;
    const data = await MonthlyAnalytics.findById(monthId);

    if (!data) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const orders = await Order.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }) as OrderDocument[];

      const completedOrders = calculateCompletedOrders(orders);
      const revenue = calculateRevenue(orders);
      const cancelledOrders = calculateCancelledOrders(orders);
      const refundedAmount = calculateRefundedAmount(orders);

      return {
        success: true,
        data: {
          _id: monthId,
          year,
          month,
          revenue,
          orders: completedOrders.length,
          profit: 0,
          productsSold: calculateProductsSold(completedOrders),
          avgOrderValue: calculateAvgOrderValue(revenue, completedOrders.length),
          cancelledOrders,
          refundedAmount,
        },
      };
    }

    const plainData = toPlainObject(data);
    return {
      success: true,
      data: {
        _id: plainData!._id,
        year: plainData!.year,
        month: plainData!.month,
        revenue: plainData!.revenue,
        orders: plainData!.orders,
        profit: plainData!.profit,
        productsSold: plainData!.productsSold,
        avgOrderValue: calculateAvgOrderValue(plainData!.revenue, plainData!.orders),
        cancelledOrders: plainData!.cancelledOrders,
        refundedAmount: plainData!.refundedAmount,
      },
    };
  } catch (error) {
    console.error("getCustomMonthAnalytics error:", error);
    return { success: false, error: String(error) };
  }
}

export async function getCustomYearAnalytics(
  year: number,
): Promise<AnalyticsResponse<YearlyAnalyticsData>> {
  try {
    await connectToDB();
    const monthlyData = await MonthlyAnalytics.find({ year });

    const aggregated = monthlyData.reduce<AggregatedStats>(
      (acc, curr) => {
        acc.revenue += curr.revenue || 0;
        acc.orders += curr.orders || 0;
        acc.profit += curr.profit || 0;
        acc.productsSold += curr.productsSold || 0;
        acc.cancelledOrders += curr.cancelledOrders || 0;
        acc.refundedAmount += curr.refundedAmount || 0;
        return acc;
      },
      { revenue: 0, orders: 0, profit: 0, productsSold: 0, cancelledOrders: 0, refundedAmount: 0 },
    );

    return {
      success: true,
      data: {
        year,
        ...aggregated,
        avgOrderValue: calculateAvgOrderValue(aggregated.revenue, aggregated.orders),
        monthsData: toPlainObject(monthlyData) ?? undefined,
      },
    };
  } catch (error) {
    console.error("getCustomYearAnalytics error:", error);
    return { success: false, error: String(error) };
  }
}

export async function getUserStats(): Promise<AnalyticsResponse<UserStatsData>> {
  try {
    const authSession = await getServerAuth("VIEW_USERS");
    if (!authSession?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = authSession.user;
    await connectToDB();

    const orders = await Order.find({
      userId: user.id,
      orderStatus: "delivered",
      paymentStatus: "paid",
    }) as OrderDocument[];

    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const totalItems = orders.reduce(
      (sum, order) =>
        sum + (order.items?.reduce((s, item) => s + (item.quantity || 0), 0) || 0),
      0,
    );

    return {
      success: true,
      data: {
        totalSpent,
        totalOrders,
        totalItems,
        averageOrderValue: calculateAvgOrderValue(totalSpent, totalOrders),
      },
    };
  } catch (error) {
    console.error("getUserStats error:", error);
    return { success: false, error: String(error) };
  }
}

export async function refreshAllAnalytics(): Promise<AnalyticsResponse<RefreshAnalyticsResult>> {
  try {
    await connectToDB();

    await DailyAnalytics.deleteMany({});
    await MonthlyAnalytics.deleteMany({});
    await ProductStats.deleteMany({});

    await Product.updateMany(
      {},
      { $set: { salesCount: 0, totalRevenue: 0, totalProfit: 0, lastSoldAt: null } },
    );

    const allOrders = await Order.find({}).sort({ createdAt: 1 }) as OrderDocument[];

    for (const order of allOrders) {
      const date = new Date(order.createdAt);
      const today = date.toISOString().split("T")[0];
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthId = `${year}-${month.toString().padStart(2, "0")}`;

      const isCancelled = order.orderStatus === "cancelled";
      const isRefunded = order.paymentStatus === "refunded";
      const isCompleted = !isCancelled && order.paymentStatus === "paid";

      const totalProfit = isCompleted ? calculateOrderProfit(order as OrderType) : 0;
      const totalProductsSold = isCompleted ? (order.items?.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
      ) || 0) : 0;

      if (isCancelled) {
        await DailyAnalytics.updateOne(
          { date: today },
          {
            $inc: {
              cancelledOrders: 1,
              refundedAmount: isRefunded ? order.total : 0,
            },
          },
          { upsert: true },
        );
        await MonthlyAnalytics.updateOne(
          { _id: monthId },
          {
            $inc: {
              cancelledOrders: 1,
              refundedAmount: isRefunded ? order.total : 0,
            },
            $set: { year, month },
          },
          { upsert: true },
        );
      } else if (isCompleted) {
        await DailyAnalytics.updateOne(
          { date: today },
          {
            $inc: {
              revenue: order.total || 0,
              orders: 1,
              profit: totalProfit,
              productsSold: totalProductsSold,
            },
          },
          { upsert: true },
        );
        await MonthlyAnalytics.updateOne(
          { _id: monthId },
          {
            $inc: {
              revenue: order.total || 0,
              orders: 1,
              profit: totalProfit,
              productsSold: totalProductsSold,
            },
            $set: { year, month },
          },
          { upsert: true },
        );
      } else if (isRefunded) {
        await DailyAnalytics.updateOne(
          { date: today },
          {
            $inc: {
              refundedAmount: order.total || 0,
            },
          },
          { upsert: true },
        );
        await MonthlyAnalytics.updateOne(
          { _id: monthId },
          {
            $inc: {
              refundedAmount: order.total || 0,
            },
            $set: { year, month },
          },
          { upsert: true },
        );
      }

      if (isCompleted && order.items) {
        for (const item of order.items) {
          await ProductStats.updateOne(
            { productId: item.productId },
            {
              $inc: {
                totalSold: item.quantity || 0,
                totalRevenue: (item.price || 0) * (item.quantity || 0),
                totalProfit: ((item.price || 0) - (item.cost || 0)) * (item.quantity || 0),
              },
            },
            { upsert: true },
          );

          const itemRevenue = (item.price || 0) * (item.quantity || 0);
          const itemCost = (item.cost || 0) * (item.quantity || 0);
          const itemProfit = itemRevenue - itemCost;

          await Product.updateOne(
            { _id: item.productId },
            {
              $inc: {
                salesCount: item.quantity || 0,
                totalRevenue: itemRevenue,
                totalProfit: itemProfit,
              },
              $set: { lastSoldAt: order.createdAt },
            },
          );
        }
      }
    }

    const allMonths = await MonthlyAnalytics.find({});
    for (const month of allMonths) {
      if (month.orders > 0) {
        month.avgOrderValue = month.revenue / month.orders;
        await month.save();
      } else if (month.orders === 0 && month.cancelledOrders > 0) {
        month.avgOrderValue = 0;
        await month.save();
      }
    }

    const allDays = await DailyAnalytics.find({});
    for (const day of allDays) {
      if (day.orders > 0) {
        day.avgOrderValue = day.revenue / day.orders;
        await day.save();
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/analytics");

    const totalOrders = allOrders.length;
    const cancelledOrders = allOrders.filter(o => o.orderStatus === "cancelled").length;
    const refundedOrders = allOrders.filter(o => o.paymentStatus === "refunded").length;

    return { 
      success: true, 
      message: `Recalculated ${totalOrders} orders. Cancelled: ${cancelledOrders}, Refunded: ${refundedOrders}` 
    };
  } catch (error) {
    console.error("refreshAllAnalytics error:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateOrderInAnalytics(orderId: string): Promise<AnalyticsResponse<RefreshAnalyticsResult>> {
  try {
    await connectToDB();
    
    const order = await Order.findById(orderId) as OrderDocument | null;
    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const date = new Date(order.createdAt);
    const today = date.toISOString().split("T")[0];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthId = `${year}-${month.toString().padStart(2, "0")}`;

    const isCancelled = order.orderStatus === "cancelled";
    const isRefunded = order.paymentStatus === "refunded";
    const isCompleted = !isCancelled && order.paymentStatus === "paid";

    const totalProfit = isCompleted ? calculateOrderProfit(order as OrderType) : 0;
    const totalProductsSold = isCompleted ? (order.items?.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0,
    ) || 0) : 0;

    await DailyAnalytics.updateOne(
      { date: today },
      {
        $inc: {
          revenue: isCompleted ? order.total : 0,
          orders: isCompleted ? 1 : 0,
          profit: totalProfit,
          productsSold: totalProductsSold,
          cancelledOrders: isCancelled ? 1 : 0,
          refundedAmount: isRefunded ? order.total : 0,
        },
      },
      { upsert: true },
    );

    await MonthlyAnalytics.updateOne(
      { _id: monthId },
      {
        $inc: {
          revenue: isCompleted ? order.total : 0,
          orders: isCompleted ? 1 : 0,
          profit: totalProfit,
          productsSold: totalProductsSold,
          cancelledOrders: isCancelled ? 1 : 0,
          refundedAmount: isRefunded ? order.total : 0,
        },
        $set: { year, month },
      },
      { upsert: true },
    );

    return { 
      success: true, 
      message: `Order ${orderId} updated in analytics. Status: ${order.orderStatus}` 
    };
  } catch (error) {
    console.error("updateOrderInAnalytics error:", error);
    return { success: false, error: String(error) };
  }
}