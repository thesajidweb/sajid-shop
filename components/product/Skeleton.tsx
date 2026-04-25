// components/ProductFormSkeleton.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />
);

const ProductFormSkeleton = () => {
  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <SkeletonBlock className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <SkeletonBlock className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <SkeletonBlock className="h-10 w-full" />
                <SkeletonBlock className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <SkeletonBlock className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <SkeletonBlock className="h-40 w-full rounded-lg" />
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <SkeletonBlock className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
              <SkeletonBlock className="h-16 w-full" />
              <SkeletonBlock className="h-8 w-32" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Organization */}
          <Card>
            <CardHeader>
              <SkeletonBlock className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
              <SkeletonBlock className="h-10 w-full" />
              <SkeletonBlock className="h-10 w-full" />
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <SkeletonBlock className="h-5 w-20" />
            </CardHeader>
            <CardContent>
              <SkeletonBlock className="h-10 w-full" />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <SkeletonBlock className="h-5 w-20" />
            </CardHeader>
            <CardContent className="space-y-3">
              <SkeletonBlock className="h-10 w-full" />
              <SkeletonBlock className="h-10 w-full" />
              <SkeletonBlock className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductFormSkeleton;
