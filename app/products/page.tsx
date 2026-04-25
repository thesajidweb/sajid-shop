// app/products/page.tsx or wherever you use ProductGrid
import ProductGrid from "@/components/storefront/products/ProductGrid";
import { Suspense } from "react";
import ProductGridSkeleton from "./loading";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // 🔹 unwrap searchParams promise
  const params = await searchParams;
  delete params.dashboard;
  delete params.status;
  // Remove dashboard param if it exists
  const cleanParams = params;
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductGrid searchParams={cleanParams} />
    </Suspense>
  );
};

export default ProductsPage;
