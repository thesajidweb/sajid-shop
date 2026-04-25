"use server";

import { connectToDB } from "@/lib/db/connect";

import { safeAction } from "@/lib/safe-action";
import { Category } from "@/lib/models/Category";
import { AppError } from "@/lib/app-error";

import { cacheLife, cacheTag } from "next/cache";

export async function getCategories() {
  "use cache";
  cacheLife("minutes");
  cacheTag("categories");
  return safeAction(
    async () => {
      await connectToDB();

      const categories = await Category.find({}).lean();
      if (!categories || categories.length === 0) {
        throw new AppError("No categories found", 404);
      }
      return JSON.parse(JSON.stringify(categories));
    },
    {
      logError: process.env.NODE_ENV !== "production",
      customErrorMessage: "Failed to fetch categories",
    },
  );
}
