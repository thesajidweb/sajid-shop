"use server";

import { ProductType } from "@/lib/types/ProductType";

import { fetchProducts } from "@/lib/services/product/fetchProducts";
import { getServerAuth } from "@/lib/auth/getServerAuth";
import { safeAction } from "@/lib/safe-action";
import { connectToDB } from "@/lib/db/connect";

export type GetProductsResponse = {
  products: ProductType[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isSearchMode: boolean;
};

export const getProducts = async (
  queryString?: string,
  dashboard: boolean = false,
) => {
  return safeAction(async () => {
    await connectToDB();

    const authSession = dashboard
      ? await getServerAuth("FULL_PRODUCT_DETAILS")
      : null;
    const dashboardView = authSession ? true : false;
    return await fetchProducts(queryString, dashboardView);
  });
};
