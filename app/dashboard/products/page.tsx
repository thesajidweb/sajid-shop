import Filters from "@/components/product/Filters";
import ProductsTable from "@/components/product/ProductTable";

import { getCollections } from "@/lib/actions/collection/getCollections";
import ErrorBox from "@/components/shared/ErrorBox";
import { CollectionType } from "@/lib/types/collectionType";
import { ResultType } from "@/lib/types/resultType";
import {
  getProducts,
  GetProductsResponse,
} from "@/lib/actions/product/getProducts";

interface ProductsGridProps {
  searchParams: {
    dashboard?: string;
    search?: string;
    category?: string;
    subcategory?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: string;
    limit?: string;
  };
}

const ProductList = async ({ searchParams }: ProductsGridProps) => {
  const params = await searchParams;
  delete params.dashboard;
  const collectionsRes: ResultType<CollectionType[]> = await getCollections();
  if (!collectionsRes.success) {
    return (
      <ErrorBox
        title="Failed to fetch [dashboard products page] collections"
        message={collectionsRes.error}
      />
    );
  }

  const collections: CollectionType[] = collectionsRes.data;

  const cleanParams = params;

  // clean params - only keep defined values
  const query = Object.entries(cleanParams || {})
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(([key, value]) => [key, value.toString()]); // safe cast

  const queryString = new URLSearchParams(query).toString();

  const dataRes = await getProducts(queryString, true);
  if (!dataRes.success)
    return (
      <ErrorBox
        title="Error Loading [dashboard products]"
        message={dataRes.error}
      />
    );
  const {
    products,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  }: GetProductsResponse = dataRes.data;

  return (
    <div className="space-y-4 p-1">
      <h2 className="ml-4 text-2xl  md:text-3xl font-bold tracking-tight">
        Products Manager{" "}
      </h2>
      <Filters
        dashboard={true}
        totalPages={totalPages}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
      <ProductsTable products={products} collections={collections} />
    </div>
  );
};

export default ProductList;
