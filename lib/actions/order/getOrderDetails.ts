"use server";

import { getServerAuth } from "@/lib/auth/getServerAuth";
import { connectToDB } from "../../db/connect";
import { Order } from "../../models/Order";
import { OrderType } from "../../types/order";
import { safeAction } from "@/lib/safe-action";
import { AppError } from "@/lib/app-error";
import { ResultType } from "@/lib/types/resultType";
import { removeSensitiveOrderData } from "./removeSensitiveOrderData";

export const getOrderDetail = async (
  id: string,
  dashboard: boolean = false,
): Promise<ResultType<OrderType>> => {
  // "use cache"; <OrderType | Partial<OrderType>>

  return safeAction(async () => {
    await connectToDB();
    const authSession = dashboard ? await getServerAuth("UPDATE_ORDER") : null;
    const authSessionForCustomer = !dashboard
      ? await getServerAuth("VIEW_ORDER")
      : null;
    const dashboardView = authSession ? true : false;

    if (!id) throw new AppError("Order ID is required", 400);

    if (!authSessionForCustomer) throw new AppError("Unauthorized", 401);

    const userId = authSessionForCustomer.user.id;

    const data = await Order.findOne({ _id: id, userId }).lean();
    if (!data) throw new AppError("Order not found", 404);

    let order = JSON.parse(JSON.stringify(data));

    // Only return full data for admin/bot requests
    // Check if this is a server-side/bot request or admin user

    if (!dashboardView) {
      // Strip sensitive data for regular users
      order = removeSensitiveOrderData(order);
    }

    return order;
  });
};
