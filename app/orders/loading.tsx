"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-2 md:px-4 py-2">
      {/* Header Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-3 gap-1 md:gap-4 mb-4">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="hover:shadow-md transition-shadow px-1 md:px-4 py-1 border-0"
          >
            <CardContent className="p-1">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Section Skeleton */}
      <div className="bg-card rounded-lg p-2 md:mb-2">
        <div className="flex gap-4 items-start sm:items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {/* Status Filter Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-9 w-20  md:w-32 rounded-md" />
            </div>

            {/* Sort Filter Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-9 w-36 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Header Skeleton */}
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Orders List Skeleton */}
      <div className="space-y-2 lg:space-y-4">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="hover:shadow-lg transition-all duration-200  py-1 md:py-2 border-0"
          >
            <CardContent className="p-2 lg:p-4">
              {/* Header */}
              <div className="flex flex-row sm:items-center justify-between gap-3 mb-2 pb-2 ">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-28 rounded-2xl" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="text-left sm:text-right">
                  <Skeleton className="h-7 w-24 mb-1" />
                  <div className="flex items-center gap-1 mt-0.5">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-2">
                {[1, 2].map((j) => (
                  <div
                    key={j}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Skeleton className="w-10 h-10 rounded-md shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16 ml-2" />
                  </div>
                ))}
              </div>

              {/* Shipping Info Skeleton */}
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-1 mb-1">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-3 w-48 ml-5" />
              </div>

              {/* Actions Skeleton */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md ml-auto" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button Skeleton */}
      <div className="text-center mt-8">
        <Skeleton className="h-10 w-36 mx-auto rounded-md" />
      </div>
    </div>
  );
}
