import { cacheLife, cacheTag } from "next/cache";

import Collection from "../../models/Collection";

import { AppError } from "@/lib/app-error";
import {
  dashboardProductFields,
  projectionToSelect,
  storefrontProductFields,
} from "@/lib/db/product.projection";

export const fetchSingleCollection = async (
  id: string,
  populate: boolean = false,
  dashboard: boolean = false,
) => {
  "use cache";

  cacheLife({
    stale: 60,
    revalidate: 300,
    expire: 3600,
  });

  cacheTag("collections");

  const collection = populate
    ? await Collection.findById(id)
        .populate({
          path: "products",
          select: dashboard
            ? projectionToSelect(dashboardProductFields)
            : projectionToSelect(storefrontProductFields),
        })
        .lean()
    : await Collection.findById(id).lean();

  if (!collection) {
    throw new AppError("No collections found", 404);
  }
  const data = {
    ...collection,
    _id: collection._id.toString(),
  };
  return JSON.parse(JSON.stringify(data));
};
