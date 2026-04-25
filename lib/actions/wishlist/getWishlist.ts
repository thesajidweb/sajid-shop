"use server";

import { AppError } from "@/lib/app-error";
import { connectToDB } from "@/lib/db/connect";
import { storefrontProductFields } from "@/lib/db/product.projection";
import Product from "@/lib/models/Product";
import { safeAction } from "@/lib/safe-action";
import { cacheLife, cacheTag } from "next/cache";
import { revalidatePath } from "next/cache";

export async function getWishlistProducts(wishlistIds: string[]) {
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

      if (!wishlistIds.length) {
        return {
          success: true,
          wishlistItems: [],
        };
      }

      const products = await Product.find({
        _id: { $in: wishlistIds },
      }).select(storefrontProductFields);

      if (!products.length) {
        throw new AppError("No products found", 404);
      }
      return JSON.parse(JSON.stringify(products)); // Convert MongoDB documents to plain objects
    },
    {
      customErrorMessage: "Failed to fetch products",
      logError: process.env.NODE_ENV !== "production",
    },
  );
}

export async function clearWishlistAction() {
  // This is just a server action wrapper
  // The actual clearing happens on the client with Redux
  // But you can add server-side logic here if needed
  revalidatePath("/wishlist");
  return { success: true };
}
