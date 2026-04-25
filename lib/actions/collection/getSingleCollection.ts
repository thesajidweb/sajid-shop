import { connectToDB } from "../../db/connect";

import { safeAction } from "@/lib/safe-action";
import { getServerAuth } from "@/lib/auth/getServerAuth";
import { fetchSingleCollection } from "@/lib/services/collection/fetchSingleCollection";

export const getSingleCollection = async (
  id: string,
  populate: boolean = false,
  dashboard: boolean = false,
) => {
  return safeAction(
    async () => {
      await connectToDB();

      const authSession = dashboard
        ? await getServerAuth("FULL_PRODUCT_DETAILS")
        : null;
      const dashboardView = authSession ? true : false;
      return await fetchSingleCollection(id, populate, dashboardView);
    },
    {
      logError: process.env.NODE_ENV !== "production",
      customErrorMessage: "Failed to fetch collections",
    },
  );
};
