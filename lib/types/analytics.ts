export type PeriodType = "day" | "week" | "month" | "year";

export type AnalyticsType =
  | "revenue"
  | "products"
  | "status"
  | "lowstock"
  | "category";

export interface RevenueDetail {
  _id: string; // date (YYYY-MM-DD)
  revenue: number;
  orders: number;
}

export interface ProductDetail {
  _id: string;
  name: string;
  salesCount: number;
}

export interface StatusDetail {
  _id: {
    status: string;
    payment: string;
  };
  count: number;
  total: number;
}

export interface LowStockDetail {
  _id?: string;
  name: string;
  color: string;
  size: string;
  stock: number;
  finalPrice: number;
}

export interface CategoryDetail {
  _id: string; // category name
  totalSales: number;
  totalRevenue: number;
}

export type DetailResponse =
  | RevenueDetail[]
  | ProductDetail[]
  | StatusDetail[]
  | LowStockDetail[]
  | CategoryDetail[];

export interface RevenueTrend {
  _id: string;
  revenue: number;
  orders: number;
}

export interface OrderStatus {
  _id: string;
  count: number;
}

export type TopProduct = {
  _id: string;
  name: string;
  salesCount: number;
};

export interface CategorySales {
  _id: string;
  totalSales: number;
}

export interface OverviewResponse {
  revenueTrend: RevenueTrend[];
  orderStatus: OrderStatus[];
  topProducts: TopProduct[];
  categorySales: CategorySales[];
}

export interface SummaryResponse {
  revenue: number;
  orders: number;
  products: number;
  lowStock: number;
  avgOrderValue: number;
}

export interface AnalyticsQuery {
  type: AnalyticsType;
  period?: PeriodType;
}
export type AnalyticsSummaryApiResponse = {
  success: boolean;
  data: SummaryResponse;
};
export type AnalyticsOverviewApiResponse = {
  success: boolean;
  data: OverviewResponse;
};
