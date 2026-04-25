import ErrorBox from "@/components/shared/ErrorBox";
import ProductCard from "@/components/storefront/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSingleCollection } from "@/lib/actions/collection/getSingleCollection";
import { getImageKitUrl } from "@/lib/imagekit/imagekit";

import { ProductType } from "@/lib/types/ProductType";
import { ArrowLeft, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CollectionDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const collectionRes = await getSingleCollection(id, true);
  if (!collectionRes.success)
    return (
      <ErrorBox
        title="Fetch SingleCollection error"
        message={collectionRes.error}
      />
    );
  const collectionData = collectionRes.data;
  const safeProducts: ProductType[] = collectionData?.products ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ================= HEADER ================= */}
      <div className="w-full space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl capitalize">
          {collectionData.title}
        </h1>

        <Separator />

        <div className="relative mb-4 h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[75vh] overflow-hidden rounded-xl">
          <Image
            src={getImageKitUrl(collectionData.image?.url, {
              width: 1200,
              height: 600,
              quality: 80,
            })}
            alt={collectionData.title}
            fill
            className="object-cover rounded-xl"
            sizes="(max-width: 1024px) 100vw, 100vw"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="mx-auto mt-5">
        <div className="w-full space-y-3">
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {safeProducts.length
              ? collectionData.description
              : "No products found in this collection"}
          </p>

          <Separator />
        </div>

        {/* ================= CONTENT ================= */}
        {safeProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <ProductGrid products={safeProducts} />
        )}
      </div>
    </div>
  );
};

export default CollectionDetails;

/* ================= PRODUCT GRID COMPONENT ================= */

const ProductGrid = ({ products }: { products: ProductType[] }) => {
  return (
    <div
      className="
      mt-2
  grid 
  gap-1 md:gap-2 
  grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
  md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] 
  lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]
  xl:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]
    
"
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
// ================= EMPTY STATE COMPONENT =================
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center border-2 border-dashed border-border rounded-2xl bg-muted/30 mt-10">
      <div className="bg-background p-6 rounded-full mb-6 shadow-sm">
        <Heart className="h-12 w-12 text-muted-foreground/50" />
      </div>

      <h2 className="text-2xl font-bold mb-2">No products found</h2>

      <p className="text-muted-foreground mb-8 max-w-sm">
        We couldn&apos;t find any products in this collection.
      </p>

      <Link href="/">
        <Button size="lg" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};
