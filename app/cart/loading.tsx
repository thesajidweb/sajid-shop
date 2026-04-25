"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";

interface CartSkeletonProps {
  className?: string;
  itemCount?: number;
  showTrustBadges?: boolean;
}

const CartSkeleton = ({
  className,
  itemCount = 3,
  showTrustBadges = true,
}: CartSkeletonProps) => {
  return (
    <section
      className={cn(
        "max-w-7xl mx-auto px-1.5 sm:px-3 md:px-4 py-4 sm:py-6",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
        <div className="space-y-1.5">
          <Skeleton className="h-7 sm:h-8 w-40 sm:w-48" />
          <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
        </div>

        <Skeleton className="h-8 sm:h-9 w-20 sm:w-24" />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_360px]">
        {/* Cart Items */}
        <div className="space-y-2 sm:space-y-3">
          {Array.from({ length: itemCount }).map((_, index) => (
            <Card key={index} className="py-1.5 sm:py-2">
              <CardContent className="px-1.5 sm:px-2 flex gap-2 sm:gap-4">
                {/* Image Skeleton */}
                <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg shrink-0" />

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-4 sm:h-5 w-3/4 mb-1.5 sm:mb-2" />
                      <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32" />
                    </div>

                    <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
                  </div>

                  <div className="mt-2 sm:mt-3 flex items-end justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
                      <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16" />
                    </div>

                    <Skeleton className="h-7 sm:h-8 w-20 sm:w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Continue Shopping Link Skeleton */}
          <Skeleton className="h-3 sm:h-4 w-28 sm:w-32 mt-2" />
        </div>

        {/* Cart Summary */}
        <div className="lg:sticky lg:top-20 h-fit space-y-2 sm:space-y-3">
          <Card>
            <CardContent className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 px-2 sm:px-4">
              {/* Free Shipping */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
                  <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>

              {/* Summary */}
              <div className="space-y-1.5 sm:space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                    <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                  </div>
                ))}

                <Skeleton className="h-px w-full my-2" />

                <div className="flex justify-between">
                  <Skeleton className="h-4 sm:h-5 w-14 sm:w-16" />
                  <Skeleton className="h-4 sm:h-5 w-16 sm:w-20" />
                </div>
              </div>

              {/* Button */}
              <Skeleton className="h-9 sm:h-10 w-full" />
            </CardContent>
          </Card>

          {/* Trust Badges */}
          {showTrustBadges && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-14 sm:h-16 w-full rounded-xl" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default CartSkeleton;
