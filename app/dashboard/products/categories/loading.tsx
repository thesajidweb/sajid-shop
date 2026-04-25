"use client";

import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 px-2 animate-pulse">
      {/* Form Skeleton */}
      <div className="space-y-4 p-4 border rounded-lg shadow-sm">
        <Skeleton className="h-6 w-40" /> {/* Form title */}
        <Skeleton className="h-10 w-full" /> {/* Input field */}
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" /> {/* Input 1 */}
          <Skeleton className="h-10 w-20" /> {/* Input 2 */}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" /> {/* Input 3 */}
          <Skeleton className="h-10 flex-1" /> {/* Input 4 */}
        </div>
      </div>

      {/* List title */}
      <Skeleton className="h-5 w-48" />

      {/* Category cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32" /> {/* Card title */}
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" /> {/* Action 1 */}
              <Skeleton className="h-8 w-8" /> {/* Action 2 */}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-6 w-20" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
