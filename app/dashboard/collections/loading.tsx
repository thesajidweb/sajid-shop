"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CollectionsListSkeleton = () => {
  return (
    <div className="container mx-auto space-y-6">
      {/* ================= STATS SKELETON ================= */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-card border-border shadow-sm">
            <CardContent className="pt-4 md:pt-5 space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-18 md:w-24" />
                  <Skeleton className="h-6 md:h-8 w-12" />
                </div>

                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>

              {/* Progress bar */}
              <Skeleton className="h-2 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ================= TABLE SKELETON ================= */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Collection</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {/* Collection */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </TableCell>

                {/* Products */}
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>

                {/* Dates */}
                <TableCell>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CollectionsListSkeleton;
