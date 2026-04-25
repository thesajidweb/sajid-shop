import { AppError } from "@/lib/app-error";

import {
  dashboardProductFields,
  storefrontProductFields,
} from "@/lib/db/product.projection";
import Product from "@/lib/models/Product";

import { ProductType } from "@/lib/types/ProductType";
import { calculateDiscountPrice } from "@/lib/utils/priceCalculator";
import { cacheLife, cacheTag } from "next/cache";

export async function fetchSingleProduct(
  id: string,
  dashboard: boolean = false,
) {
  "use cache";
  cacheLife("hours");
  cacheTag(`product-${id}`);

  const product = await Product.findById(id)
    .select(dashboard ? dashboardProductFields : storefrontProductFields)
    .lean<ProductType | null>();
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  const finalPrice =
    product?.finalPrice ||
    calculateDiscountPrice(product.price, product.discount);
  const productData = {
    ...product,
    finalPrice,
  };
  return JSON.parse(JSON.stringify(productData));
}
