"use server";

import { getServerAuth } from "@/lib/auth/getServerAuth";
import { connectToDB } from "@/lib/db/connect";
import { safeAction } from "@/lib/safe-action";
import { fetchSingleProduct } from "@/lib/services/product/fetchSingleProduct";

export async function getSingleProduct(id: string, dashboard: boolean = false) {
  return safeAction(async () => {
    await connectToDB();
    const authSession = dashboard
      ? await getServerAuth("FULL_PRODUCT_DETAILS")
      : null;
    const dashboardView = authSession ? true : false;

    return await fetchSingleProduct(id, dashboardView);
  });
}
