"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ProductType } from "@/lib/types/ProductType";
import { Badge } from "../ui/badge";
import Image from "next/image";

import { format } from "date-fns";

import { calculateDiscountPrice } from "@/lib/utils/priceCalculator";
import ProductAction from "./ProductAction";

import ProductsTableSkeleton from "./ProductsTableSkeleton";
import ErrorBox from "../shared/ErrorBox";
import { getImageKitUrl } from "@/lib/imagekit/imagekit";
import { calculateTotalStock } from "@/lib/utils/getStockInfo";
import { CollectionType } from "@/lib/types/collectionType";

const ProductsTable = ({
  products,
  collections,
}: {
  products: ProductType[];
  collections: CollectionType[];
}) => {
  const error = false;
  const loading = false;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "draft":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return error ? (
    <ErrorBox error={error} />
  ) : (
    <>
      {loading ? (
        <ProductsTableSkeleton />
      ) : (
        <div className="rounded-md border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const discountPrice = calculateDiscountPrice(
                    product.price,
                    product.discount,
                  );
                  const hasDiscount = discountPrice !== product.price;
                  const totalStock = calculateTotalStock(product.variants);

                  return (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                          {product.gallery?.[0]?.url ? (
                            <Image
                              src={getImageKitUrl(product.gallery[0].url, {
                                width: 48,
                                height: 48,
                                quality: 80,
                              })}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        <div className="flex flex-col min-w-[200px] max-w-[250px] wrap-break-word">
                          <div
                            className="font-semibold truncate"
                            title={product.name}
                          >
                            {product.name}
                          </div>
                          {product.subcategory && (
                            <div className="text-xs text-muted-foreground capitalize">
                              {product.subcategory}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>{product.brand || "-"}</TableCell>

                      <TableCell className="capitalize">
                        {product.category}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1 items-center">
                          {getStatusBadge(product.status)}
                          {product.isFeatured && (
                            <Badge
                              variant="outline"
                              className="text-xs border-yellow-500 text-yellow-600"
                            >
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span
                            className={`font-semibold ${
                              hasDiscount ? "text-green-600" : ""
                            }`}
                          >
                            {discountPrice != null
                              ? discountPrice.toFixed(2)
                              : "0.00"}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through">
                              {product.price != null
                                ? product.price.toFixed(2)
                                : "0.00"}
                            </span>
                          )}
                          {product.discount && (
                            <span className="text-xs text-red-600 font-medium">
                              {product.discount.type === "percentage"
                                ? `${product.discount.value}% off`
                                : `Save ${product.discount.value}`}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              totalStock === 0 ? "text-red-600 font-medium" : ""
                            }
                          >
                            {totalStock}
                          </span>
                          {totalStock === 0 && (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {product.salesCount || 0}
                          </span>
                          {product.lastSoldAt && (
                            <span className="text-xs text-muted-foreground">
                              Last:{" "}
                              {format(new Date(product.lastSoldAt), "MMM d")}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <ProductAction
                          id={product._id!}
                          collections={collections}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default ProductsTable;
