import { formatTheDate } from "@/lib/utils/formatTheDate";
import "@/lib/models/Product";

import Image from "next/image";
import ProductsTable from "@/components/product/ProductTable";
import { getImageKitUrl } from "@/lib/imagekit/imagekit";
import { CalendarDays, Package, RefreshCw, Clock } from "lucide-react";
import CollectionDetailSkeleton from "./loading";
import { getCollections } from "@/lib/actions/collection/getCollections";
import ErrorBox from "@/components/shared/ErrorBox";
import { getSingleCollection } from "@/lib/actions/collection/getSingleCollection";

const CollectionDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const allCollectionRes = await getCollections();
  if (!allCollectionRes.success) {
    return (
      <ErrorBox
        title="Failed to fetch all collections"
        message={allCollectionRes.error}
      />
    );
  }
  const allCollection = allCollectionRes?.data;

  const collectionRes = await getSingleCollection(id, true, true);
  if (!collectionRes.success) {
    return (
      <ErrorBox
        title="Failed to fetch collection"
        message={collectionRes.error}
      />
    );
  }
  const collection = collectionRes?.data;

  const productCount = collection?.products?.length || 0;
  const products = collection?.products;
  return !collection ? (
    <CollectionDetailSkeleton />
  ) : (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-1 pt-8 md:py-4 sm:px-1 md:px-2  space-y-2 md:space-y-3 lg:space-y-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3">
          <div>
            <p className="text-sm font-semibold text-primary/70 mb-2 tracking-wide uppercase">
              Collection Detail
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
              {collection.title}
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-secondary/20 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>
              Last updated: {formatTheDate(collection.updatedAt, "date")}
            </span>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/5">
          <div className="aspect-21/9 md:aspect-16/6 relative w-full">
            <Image
              src={getImageKitUrl(collection.image.url, { quality: 95 })}
              alt={collection.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 70vw"
              className="object-cover transition-all duration-700 hover:scale-105"
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/10 to-transparent" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-2  md:space-y-4 lg:space-y-5">
          {/* Description Card */}
          <div className="rounded-2xl border border-border/50 bg-card/80 p-6 md:p-8 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-primary rounded-full" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">
                Description
              </h2>
            </div>
            <p className=" text-sm md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {collection.description}
            </p>
          </div>

          {/* Collection Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
            {/* Wrapper for the two date cards */}
            <div className="grid  grid-cols-2 gap-4  md:gap-4  md:contents">
              {/* Created At Card */}
              <div className="rounded-xl border border-border/50 bg-card p-4 md:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <CalendarDays className="w-5 h-5 text-chart-1" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Created At
                  </span>
                </div>
                <p className="text-md md:text-lg font-semibold text-foreground">
                  {formatTheDate(collection.createdAt, "date-time")}
                </p>
              </div>

              {/* Last Updated Card */}
              <div className="rounded-xl border border-border/50 bg-card p-4 md:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <RefreshCw className="w-5 h-5 text-chart-2" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </span>
                </div>
                <p className="text-md md:text-lg font-semibold text-foreground">
                  {formatTheDate(collection.updatedAt, "date-time")}
                </p>
              </div>
            </div>
          </div>

          {/* Products Section - Moved Below */}
          {productCount > 0 ? (
            <div className="rounded-2xl border border-border/50 bg-card shadow-lg overflow-hidden">
              <div className="px-4 md:px-6 py-3 bg-linear-to-r from-primary/5 to-transparent border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">
                      Products
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    {productCount} {productCount === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
              <div className="p-1 md:p-2">
                <div className="overflow-hidden rounded-lg">
                  <ProductsTable
                    products={products}
                    collections={allCollection}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-secondary/30">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Products Yet
              </h3>
              <p className="text-muted-foreground">
                This collection does not contain any products yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
