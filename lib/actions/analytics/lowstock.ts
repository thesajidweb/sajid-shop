"use server";

import { AppError } from "@/lib/app-error";
import { connectToDB } from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import { safeAction } from "@/lib/safe-action";

export async function getLowStockProducts() {
  return safeAction(async () => {
    try {
      await connectToDB();

      const data = await Product.aggregate([
        {
          $match: {
            "variants.sizes.stock": { $lte: 5 },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            finalPrice: 1,
            variants: 1,
          },
        },
        { $unwind: "$variants" },
        { $unwind: "$variants.sizes" },
        {
          $match: {
            "variants.sizes.stock": { $lte: 5 },
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            color: "$variants.colorName",
            size: "$variants.sizes.size",
            stock: "$variants.sizes.stock",
            finalPrice: 1,
          },
        },
        { $sort: { stock: 1 } },
        { $limit: 200 },
      ]);

      // 🟢 Empty state handling (optional but useful)
      if (!data || data.length === 0) {
        return [];
      }

      return JSON.parse(JSON.stringify(data));
    } catch (error: unknown) {
      console.error("LowStockProducts Error:", error);

      // 🔴 Known AppError → forward as is
      if (error instanceof AppError) {
        throw error;
      }

      // 🔴 Mongo / unknown errors
      throw new AppError("Failed to fetch low stock products", 500);
    }
  });
}
