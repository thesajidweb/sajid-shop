"use server";

import { AppError } from "@/lib/app-error";
import { connectToDB } from "@/lib/db/connect";
import { storefrontProductFields } from "@/lib/db/product.projection";
import Product from "@/lib/models/Product";
import { safeAction } from "@/lib/safe-action";
import { cacheLife, cacheTag } from "next/cache";

export const getFeaturedProducts = async () => {
  "use cache";
  cacheLife({
    stale: 60,
    revalidate: 300,
    expire: 3600,
  });
  cacheTag("products");
  return safeAction(
    async () => {
      await connectToDB();

      const data = await Product.find({ isFeatured: true })
        .select(storefrontProductFields)
        .limit(15)
        .lean();
      if (!data || data.length === 0) {
        throw new AppError("No products found", 404);
      }
      const safeData = JSON.parse(JSON.stringify(data));

      return safeData;
    },
    {
      customErrorMessage: "Failed to fetch products",
      logError: process.env.NODE_ENV !== "production",
    },
  );
};
