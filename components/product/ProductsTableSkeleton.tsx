"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  rows?: number;
}

const ProductsTableSkeleton = ({ rows = 6 }: Props) => {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell">Brand</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="hidden md:table-cell">Stock</TableHead>
            <TableHead className="hidden lg:table-cell">Sales</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              {/* Image */}
              <TableCell>
                <Skeleton className="h-12 w-12 rounded-md" />
              </TableCell>

              {/* Product */}
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                </div>
              </TableCell>

              {/* Category */}
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>

              {/* Brand */}
              <TableCell className="hidden lg:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>

              {/* Status */}
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>

              {/* Price */}
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </TableCell>

              {/* Stock */}
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-12" />
              </TableCell>

              {/* Sales */}
              <TableCell className="hidden lg:table-cell">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-3 w-20" />
                </div>
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
  );
};

export default ProductsTableSkeleton;
