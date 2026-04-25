import { AppError } from "@/lib/app-error";
import { connectToDB } from "@/lib/db/connect";
import Collection from "@/lib/models/Collection";
import { safeAction } from "@/lib/safe-action";
import { cacheLife, cacheTag } from "next/cache";

export const getCollections = async () => {
  "use cache";

  cacheLife({
    stale: 60,
    revalidate: 300,
    expire: 3600,
  });

  cacheTag("collections");

  return safeAction(
    async () => {
      await connectToDB();

      const data = await Collection.find().lean();

      // ❌ Throw error if no collections found
      if (!data || data.length === 0) {
        throw new AppError("No collections found", 404);
      }

      return JSON.parse(JSON.stringify(data));
    },
    {
      logError: process.env.NODE_ENV !== "production",
      customErrorMessage: "Failed to fetch collections",
    },
  );
};
