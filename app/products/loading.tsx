// components/product/ProductGridSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

const ProductGridSkeleton = () => {
  return (
    <div className="space-y-4 p-1 animate-pulse">
      {/* Filters Skeleton */}
      <div className="space-y-1 sm:space-y-2 md:space-y-3">
        {/* Mobile Filter Toggle Skeleton */}
        <div className="lg:hidden border p-1 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>

        {/* Desktop Filters Skeleton - Hidden on mobile */}
        <div className="hidden lg:block border rounded-lg shadow-sm p-3 space-y-3">
          <div className="flex items-center gap-3">
            {/* Search */}
            <Skeleton className="flex-1 h-9 rounded-md" />

            {/* Category & Subcategory */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-[140px] rounded-md" />
              <Skeleton className="h-9 w-[140px] rounded-md" />
            </div>

            {/* Status & Sort */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-[120px] rounded-md" />
              <div className="flex gap-1">
                <Skeleton className="h-9 w-[120px] rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>

            {/* Price Filter & Reset */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-16 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </div>

        {/* Pagination Controls Skeleton */}
        <div className="border rounded-lg p-1 lg:px-3">
          <div className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="hidden md:block h-4 w-10" />
                <Skeleton className="h-8 w-[70px] rounded-md" />
                <Skeleton className="hidden sm:block h-4 w-12" />
              </div>
              <Skeleton className="hidden sm:block h-4 w-32" />
            </div>
            <Skeleton className="hidden sm:block h-4 w-24" />
            <div className="flex items-center gap-1">
              <Skeleton className="hidden md:block h-8 w-12 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="hidden md:block h-8 w-12 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-1 md:gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Product Card Skeleton Component
const ProductCardSkeleton = () => {
  return (
    <article className="group relative flex flex-col bg-card rounded-xl overflow-hidden border border-border w-full max-w-[260px] mx-auto">
      {/* Image Skeleton */}
      <div className="relative aspect-4/5 bg-muted overflow-hidden">
        <Skeleton className="w-full h-full" />

        {/* Badge skeletons */}
        <div className="absolute top-1 left-1 flex flex-col gap-1 z-10">
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>

        {/* Wishlist button skeleton */}
        <div className="absolute top-1 right-1 z-10">
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-2 flex flex-col gap-1 flex-1">
        {/* Brand/Category */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-7 w-7 rounded-xl" />
        </div>

        {/* Name */}
        <Skeleton className="h-4 w-32 rounded" />

        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-3 rounded-full" />
          ))}
          <Skeleton className="h-3 w-12 ml-1 rounded" />
        </div>

        {/* Variant Colors */}
        <div className="flex items-center gap-1.5 pt-1">
          <Skeleton className="h-3 w-10 rounded" />
          <div className="flex gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-3 rounded-full" />
          </div>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-baseline gap-1">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
          <Skeleton className="h-3 w-12 rounded" />
        </div>
      </div>
    </article>
  );
};

export default ProductGridSkeleton;
