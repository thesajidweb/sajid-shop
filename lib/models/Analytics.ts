import { Schema, model, models, Types } from "mongoose";

// Don't extend Document - let Mongoose infer the type
export interface IDailyAnalytics {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
   productsSold: number;
    avgOrderValue: number;
    cancelledOrders: number;
    refundedAmount: number;
}

export interface IProductStats {
  productId: Types.ObjectId;
  totalSold: number;
  totalRevenue: number;
  totalProfit: number; // Added this field
}

export interface IMonthlyAnalytics {
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

// Schemas
const DailyAnalyticsSchema = new Schema<IDailyAnalytics>(
  {
    date: { type: String, required: true, unique: true },
    revenue: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    productsSold: { type: Number, default: 0 },
 
    avgOrderValue: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
    refundedAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const ProductStatsSchema = new Schema<IProductStats>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      unique: true,
      required: true,
    },
    totalSold: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 }, // Added this field
  },
  { timestamps: true },
);

const MonthlyAnalyticsSchema = new Schema<IMonthlyAnalytics>(
  {
    _id: { type: String, required: true },
    year: { type: Number, required: true, index: true },
    month: { type: Number, required: true },
    revenue: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    productsSold: { type: Number, default: 0 },
    avgOrderValue: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
    refundedAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Models
export const DailyAnalytics =
  models.DailyAnalytics || model("DailyAnalytics", DailyAnalyticsSchema);
export const ProductStats =
  models.ProductStats || model("ProductStats", ProductStatsSchema);
export const MonthlyAnalytics =
  models.MonthlyAnalytics || model("MonthlyAnalytics", MonthlyAnalyticsSchema);