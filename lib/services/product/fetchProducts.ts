"use server";

import Product from "@/lib/models/Product";
import { AppError } from "@/lib/app-error";
import { buildProductFilter, safeNumber } from "@/lib/utils/buildProductFilter";
import { ProductType } from "@/lib/types/ProductType";
import {
  dashboardProductFields,
  storefrontProductFields,
} from "@/lib/db/product.projection";

import { cacheLife, cacheTag } from "next/cache";

export type GetProductsResponse = {
  products: ProductType[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isSearchMode: boolean;
};

export const fetchProducts = async (
  queryString?: string,
  dashboard: boolean = false,
) => {
  "use cache";
  cacheLife({
    stale: 60,
    revalidate: 300,
    expire: 3600,
  });
  cacheTag("products");

  const fields = dashboard ? dashboardProductFields : storefrontProductFields;

  const searchParams = new URLSearchParams(queryString);

  // 🔹 Search
  const searchValue = searchParams.get("search")?.trim() || "";
  const isSearchMode = searchValue.length > 0;

  // 🔹 Pagination
  const page = isSearchMode ? 1 : safeNumber(searchParams.get("page"), 1, 1);

  const limit = isSearchMode
    ? 0
    : safeNumber(searchParams.get("limit"), 12, 1, 100);

  const skip = isSearchMode ? 0 : (page - 1) * limit;

  // 🔹 Sorting
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

  // 🔹 Filters
  const filter = buildProductFilter({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    subcategory: searchParams.get("subcategory") || "all",
    status: searchParams.get("status") || "all",
    minPrice: searchParams.get("minPrice"),
    maxPrice: searchParams.get("maxPrice"),
    createdFrom: searchParams.get("createdFrom"),
    createdTo: searchParams.get("createdTo"),
    isFeatured:
      searchParams.get("isFeatured") === "true"
        ? true
        : searchParams.get("isFeatured") === "false"
          ? false
          : undefined,
  });

  // 🔹 Query

  const query = Product.find(filter)
    .sort({ [sortBy]: sortOrder })
    .select(fields)
    .lean();

  if (!isSearchMode) {
    query.skip(skip).limit(limit);
  }

  const products: ProductType[] = JSON.parse(JSON.stringify(await query));
  const total = await Product.countDocuments(filter);

  if (!products) {
    throw new AppError("Products not found", 404);
  }
  return {
    products: products,
    currentPage: isSearchMode ? 1 : page,
    totalPages: isSearchMode ? 1 : Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: isSearchMode ? total : limit,
    isSearchMode,
  };
};
