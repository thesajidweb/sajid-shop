import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, ImageIcon, Package } from "lucide-react";
import TableDropdown from "./TableDropdown";

import { formatTheDate } from "@/lib/utils/formatTheDate";
import { Card, CardContent } from "../ui/card";
import { CollectionType } from "@/lib/types/collectionType";
import { getCollections } from "@/lib/actions/collection/getCollections";
import ErrorBox from "../shared/ErrorBox";

/* ================= PROGRESS HELPERS ================= */

// Color based on percentage
const getProgressColor = (percent: number) => {
  if (percent < 40) return "bg-chart-5"; // red
  if (percent < 70) return "bg-chart-2"; // yellow
  return "bg-chart-1"; // green
};

// Generic progress calculator
// current vs (expected × multiplier)
const calculateProgressPercent = (
  currentValue: number,
  expectedValue: number,
  multiplier: number = 2,
) => {
  const maxValue = expectedValue > 0 ? expectedValue * multiplier : 1;
  return Math.min((currentValue / maxValue) * 100, 100);
};

/* ================= MAIN COMPONENT ================= */

const CollectionsList = async () => {
  const collectionsRes = await getCollections();
  if (!collectionsRes.success) {
    return (
      <ErrorBox
        title="Failed to fetch dashboard collections"
        message={collectionsRes.error}
      />
    );
  }

  const collections: CollectionType[] = collectionsRes.data;
  /* ---------- BASIC COUNTS ---------- */

  const totalCollections = collections.length;

  const totalProducts = collections.reduce(
    (sum, collection) => sum + (collection.products?.length || 0),
    0,
  );

  const averageProductsPerCollection =
    totalCollections > 0 ? Math.round(totalProducts / totalCollections) : 0;

  /* ---------- EXPECTED (NORMAL) VALUES ---------- */

  // What is a "normal" total products count
  const expectedTotalProducts = averageProductsPerCollection * totalCollections;

  /* ---------- PROGRESS VALUES ---------- */

  const totalCollectionsProgressPercent = calculateProgressPercent(
    totalCollections, // current
    totalCollections, // expected baseline (itself)
    2, // healthy = 2×
  );

  const totalProductsProgressPercent = calculateProgressPercent(
    totalProducts, // current
    expectedTotalProducts, // expected baseline
    2,
  );

  const averageProductsProgressPercent = calculateProgressPercent(
    averageProductsPerCollection, // current
    averageProductsPerCollection, // expected baseline
    1.5,
  );

  /* ---------- STATS CONFIG ---------- */

  const statsData = [
    {
      label: "Total Collections",
      value: totalCollections,
      icon: Package,
      progress: totalCollectionsProgressPercent,
    },
    {
      label: "Total Products",
      value: totalProducts,
      icon: BarChart3,
      progress: totalProductsProgressPercent,
    },
    {
      label: "Avg. Prod/Coll",
      value: averageProductsPerCollection,
      icon: BarChart3,
      progress: averageProductsProgressPercent,
    },
  ];

  return (
    <div className="container mx-auto space-y-6">
      {/* ================= STATS ================= */}
      {totalCollections > 0 && (
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {statsData.map(({ label, value, icon: Icon, progress }) => (
            <Card key={label} className="p-2 bg-card border-border shadow-sm">
              <CardContent className="pt-1 md:pt-2  space-y-1 px-4 md:px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">
                      {label}
                    </p>
                    <h3 className="font-bold text-sm md:text-2xl lg:text-3xl">
                      {value}
                    </h3>
                  </div>

                  <div className="hidden md:block p-2 rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getProgressColor(
                      progress,
                    )}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ================= TABLE ================= */}
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
            {totalCollections === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-72">
                  <div className="flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                    <div className="rounded-xl border p-4">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                    <p className="text-lg font-semibold">No collections yet</p>
                    <p className="text-sm max-w-sm">
                      Create a collection to organize and manage your products
                      efficiently.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              collections.map((collection) => (
                <TableRow
                  key={collection._id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  {/* Collection */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border shrink-0">
                        {collection.image?.url ? (
                          <Image
                            src={collection.image.url}
                            alt={collection.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-sm">
                          {collection.title}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1 text-wrap">
                          {collection.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Products */}
                  <TableCell>
                    <span className="font-medium">
                      {collection.products?.length || 0}
                    </span>{" "}
                    <span className="text-sm text-muted-foreground">items</span>
                  </TableCell>

                  {/* Dates */}
                  <TableCell>
                    <p className="font-medium">
                      {formatTheDate(collection.createdAt, "date")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatTheDate(collection.updatedAt, "date")}
                    </p>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <TableDropdown
                      collectionId={collection._id?.toString() as string}
                      imageId={collection.image?.fileId}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CollectionsList;
