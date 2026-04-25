// components/analytics/LowStockTableSkeleton.tsx
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const LOW_STOCK_COLUMNS = ["Product", "Color", "Size", "Stock", "Price"];

const LowStockTableSkeleton = () => {
  const skeletonRows = [1, 2, 3, 4, 5];

  return (
    <ScrollArea className="h-80 rounded-md border border-border">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted sticky top-0">
          <tr>
            {LOW_STOCK_COLUMNS.map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {skeletonRows.map((idx) => (
            <tr key={idx} className="hover:bg-muted/50 transition-colors">
              {LOW_STOCK_COLUMNS.map((_, cellIdx) => (
                <td key={cellIdx} className="px-6 py-4">
                  <Skeleton className="h-4 w-full max-w-[150px]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
};

export default LowStockTableSkeleton;
