import Filters from "@/components/product/Filters";

import ProductCard from "@/components/storefront/products/ProductCard";
import {
  getProducts,
  GetProductsResponse,
} from "@/lib/actions/product/getProducts";
import ErrorBox from "@/components/shared/ErrorBox";

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

const ProductGrid = async ({ searchParams }: ProductsGridProps) => {
  //dashboard will not be used in it will be removed
  // 🔹 clean params - only keep defined values
  const query = Object.entries(searchParams || {})
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(([key, value]) => [key, value.toString()]); // safe cast

  const queryString = new URLSearchParams(query).toString();

  const dataRes = await getProducts(queryString);
  if (!dataRes.success)
    return <ErrorBox title="Error Loading Products" message={dataRes.error} />;
  const {
    products,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  }: GetProductsResponse = dataRes.data;

  return (
    <div className="space-y-4 p-1">
      <Filters
        totalPages={totalPages}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
      <div className="mx-auto max-w-[1600px]">
        <div
          className="
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
      </div>
    </div>
  );
};

export default ProductGrid;
