"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const CollectionDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-2 pt-8 md:py-6 sm:px-4 md:px-5 space-y-3 md:space-y-5">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 sm:h-12 md:h-14 w-72" />
          </div>

          <Skeleton className="h-10 w-64 rounded-lg" />
        </div>

        {/* ================= HERO IMAGE ================= */}
        <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden border border-border/50">
          <div className="aspect-21/9 md:aspect-16/6 w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="space-y-8">
          {/* ---------- DESCRIPTION ---------- */}
          <div className="rounded-2xl border border-border/50 bg-card/80 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-1 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>
          </div>

          {/* ---------- STATS ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-6 md:contents">
              {/* Created At */}
              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-40" />
              </Card>

              {/* Updated At */}
              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-6 w-40" />
              </Card>
            </div>
          </div>

          {/* ---------- PRODUCTS TABLE ---------- */}
          <div className="rounded-2xl border border-border/50 bg-card shadow-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 md:px-8 py-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Table rows */}
            <div className="p-2 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg border"
                >
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailSkeleton;
