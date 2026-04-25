"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function HeroProductScrollerSkeleton() {
  return (
    <div className="relative w-full">
      {/* Left Button Skeleton */}
      <Button
        size="icon"
        variant="outline"
        disabled
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-50"
      >
        <ArrowLeft />
      </Button>

      {/* Right Button Skeleton */}
      <Button
        size="icon"
        variant="outline"
        disabled
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-50"
      >
        <ArrowRight />
      </Button>

      {/* Scrollable Skeleton Cards */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 py-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="shrink-0 w-1/3 md:w-1/5 lg:w-1/6 xl:w-1/7 2xl:w-1/8"
          >
            <div className="space-y-3">
              {/* Image Skeleton */}
              <Skeleton className="h-40 w-full rounded-lg" />

              {/* Title */}
              <Skeleton className="h-4 w-3/4" />

              {/* Price */}
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
