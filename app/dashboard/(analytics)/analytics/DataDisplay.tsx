"use client";

import { StatsGrid } from "./StatsGrid";

interface DataDisplayProps {
  data: any;
  type: "today" | "month" | "year" | "lifetime" | "products" | "user";
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
}

// function JsonPreview({ data }: { data: any }) {
//   return (
//     <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 mt-4">
//       <pre className="text-emerald-400 text-xs sm:text-sm overflow-x-auto">
//         {JSON.stringify(data, null, 2)}
//       </pre>
//     </div>
//   );
// }

function CancelledOrdersSection({
  orders,
  amount,
  formatNumber,
  formatCurrency,
}: any) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4">
      <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-2 sm:p-4 md:p-5 border border-red-200 dark:border-red-800">
        <p className="text-sm text-red-700 dark:text-red-300">
          ❌ Cancelled Orders
        </p>
        <p className="h2-text font-bold text-red-900 dark:text-red-100">
          {formatNumber(orders)}
        </p>
      </div>
      <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
        <p className="text-sm text-orange-700 dark:text-orange-300">
          💰 Refunded Amount
        </p>
        <p className="h2-text  font-bold text-orange-900 dark:text-orange-100">
          {formatCurrency(amount)}
        </p>
      </div>
    </div>
  );
}

export function DataDisplay({
  data,
  type,
  formatCurrency,
  formatNumber,
}: DataDisplayProps) {
  if (!data) return null;

  // Today/Month/Year Analytics
  if (type === "today" || type === "month" || type === "year") {
    const stats = [
      {
        title: "Revenue",
        value: formatCurrency(data?.revenue),
        icon: "💰",
        gradient: "emerald",
      },
      {
        title: "Orders",
        value: formatNumber(data?.orders),
        icon: "📦",
        gradient: "blue",
      },
      {
        title: "Profit",
        value: formatCurrency(data?.profit),
        icon: "📈",
        gradient: "violet",
      },
      {
        title: "Avg Order Value",
        value: formatCurrency(data?.avgOrderValue),
        icon: "⭐",
        gradient: "amber",
      },
    ];

    return (
      <div className="space-y-6">
        <StatsGrid stats={stats} />
        {data?.cancelledOrders !== undefined && (
          <CancelledOrdersSection
            orders={data.cancelledOrders}
            amount={data.refundedAmount}
            formatNumber={formatNumber}
            formatCurrency={formatCurrency}
          />
        )}
        {/* <JsonPreview data={data} /> */}
      </div>
    );
  }

  // Lifetime Analytics
  if (type === "lifetime") {
    const stats = [
      {
        title: "Lifetime Revenue",
        value: formatCurrency(data?.totalRevenue),
        icon: "🏆",
        gradient: "purple",
      },
      {
        title: "Lifetime Profit",
        value: formatCurrency(data?.totalProfit),
        icon: "📈",
        gradient: "pink",
      },
      {
        title: "Avg Order Value",
        value: formatCurrency(data?.avgOrderValue),
        icon: "⭐",
        gradient: "indigo",
      },
      {
        title: "Orders",
        value: formatNumber(data?.totalOrders),
        icon: "📦",
        gradient: "cyan",
      },
      {
        title: "Total Cancelled",
        value: formatNumber(data?.totalCancelledOrders),
        icon: "🏷️",
        gradient: "teal",
      },
      {
        title: "Products Sold",
        value: formatNumber(data?.totalProductsSold),
        icon: "🏷️",
        gradient: "teal",
      },
    ];

    return (
      <div className="space-y-6">
        <StatsGrid stats={stats} />
        {/* <JsonPreview data={data} /> */}
      </div>
    );
  }

  // User Stats
  if (type === "user") {
    const stats = [
      {
        title: "Total Spent",
        value: formatCurrency(data?.totalSpent),
        icon: "👤",
        gradient: "blue",
      },
      {
        title: " Orders",
        value: formatNumber(data?.totalOrders),
        icon: "📦",
        gradient: "green",
      },
      {
        title: "Total Items",
        value: formatNumber(data?.totalItems),
        icon: "🏷️",
        gradient: "purple",
      },
      {
        title: "Avg Order Value",
        value: formatCurrency(data?.averageOrderValue),
        icon: "⭐",
        gradient: "orange",
      },
    ];

    return (
      <div className="space-y-6">
        <StatsGrid stats={stats} />
        {/* <JsonPreview data={data} /> */}
      </div>
    );
  }

  // Top Products
  if (type === "products" && Array.isArray(data)) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4">
          {data.map((product: any, index: number) => (
            <div
              key={product._id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                      {product.productId?.name || product.productInfo?.name}
                    </h3>
                  </div>
                  {product.profitMargin && (
                    <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
                      Margin: {product.profitMargin}%
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Total Sold
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {formatNumber(product.totalSold)}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Revenue
                    </p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(product.totalRevenue)}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Profit
                    </p>
                    <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                      {formatCurrency(product.totalProfit)}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Unit Price
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {formatCurrency(
                        product.productId?.price || product.productInfo?.price,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <JsonPreview data={data} /> */}
      </div>
    );
  }

  return null;
}
