"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// revenue
export const LineChartSkeleton = () => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="relative" style={{ height: "250px" }}>
        {/* Simulated line chart with multiple lines */}
        <svg className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          <g className="animate-pulse">
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`grid-${i}`}
                x1="0"
                y1={i * 50}
                x2="100%"
                y2={i * 50}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="4"
              />
            ))}
          </g>

          {/* Simulated line 1 */}
          <path
            d="M0,200 Q50,180 100,150 T200,100 T300,120 T400,80"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            className="animate-pulse"
          />

          {/* Simulated line 2 */}
          <path
            d="M0,220 Q50,200 100,180 T200,150 T300,160 T400,130"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            className="animate-pulse"
          />

          {/* Points */}
          {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x, i) => (
            <circle
              key={`point-${i}`}
              cx={`${(x / 400) * 100}%`}
              cy={150 + Math.sin(i) * 30}
              r="3"
              fill="#94a3b8"
              className="animate-pulse"
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={`x-${i}`} className="h-3 w-8" />
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-2">
          {[100, 200, 300, 400].map((i) => (
            <Skeleton key={`y-${i}`} className="h-3 w-8" />
          ))}
        </div>
      </div>
    </Card>
  );
};

// status
export const PieChartSkeleton = () => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div
        className="flex justify-center items-center"
        style={{ height: "250px" }}
      >
        <div className="relative">
          {/* Simulated pie chart */}
          <div className="w-48 h-48 rounded-full animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-background to-background/50" />
            {/* Pie slices simulation */}
            <div
              className="absolute inset-0"
              style={{
                background: `conic-gradient(
                #e2e8f0 0deg 120deg,
                #cbd5e1 120deg 240deg,
                #94a3b8 240deg 360deg
              )`,
              }}
            />
          </div>

          {/* Legend */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-2 ml-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-8 h-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
