"use server";
// todo this is not in use right now but will be used in the future

import { getServerAuth } from "@/lib/auth/getServerAuth";
import { Order } from "@/lib/models/Order";
import { AppError } from "@/lib/app-error";
import { ResultType } from "@/lib/types/resultType";
import { OrderType } from "@/lib/types/order";
import { safeAction } from "@/lib/safe-action";
import { connectToDB } from "@/lib/db/connect";
import { removeSensitiveOrderData } from "./removeSensitiveOrderData";

export type GetOrdersParams = {
  page?: number;
  limit?: number;
  orderStatus?: string;
  paymentStatus?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string; // Legacy
  payment?: string; // Legacy
  archived?: string;
  userId?: string; // Added for admin filtering
};

export type GetOrdersResponse = {
  orders: OrderType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    limit: number;
    hasMore: boolean;
  };
  role?: string | null;
  canAccessArchived?: boolean;
};

export const getOrders = async (
  params: GetOrdersParams,
  dashboard: boolean = false,
): Promise<ResultType<GetOrdersResponse>> => {
  return safeAction(async () => {
    await connectToDB();

    // Authenticate based on dashboard flag
    let authSession;
    let isAdmin = false;

    if (dashboard) {
      // Dashboard access - requires admin or manager role
      authSession = await getServerAuth("UPDATE_ORDER");
      if (!authSession) {
        throw new AppError("Unauthorized - Access required", 401);
      }
      isAdmin = true;
    } else {
      // Customer access - regular user
      authSession = await getServerAuth("VIEW_ORDER");
      if (!authSession) {
        throw new AppError("Unauthorized", 401);
      }
    }

    const role = authSession.user.role;
    const userId = authSession.user.id;

    // Validate and extract parameters
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const orderStatus = params.orderStatus || params.status;
    const paymentStatus = params.paymentStatus || params.payment;
    const search = params.search?.trim();
    const fromDate = params.fromDate;
    const toDate = params.toDate;
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder === "asc" ? 1 : -1;
    const archived = params.archived;

    // Validate search term length
    if (search && search.length < 2) {
      throw new AppError("Search term must be at least 2 characters", 400);
    }

    // Build where clause
    const where: any = {};

    // Role-based filtering
    if (role === "customer") {
      // Customers can only see their own non-archived orders
      where.userId = userId;
      where.isHiddenByUser = false;
      where.isArchived = false;

      // If customer tries to request archived orders, return empty result
      if (archived === "true") {
        return {
          orders: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalOrders: 0,
            limit,
            hasMore: false,
          },
          role,
          canAccessArchived: false,
        };
      }
    } else if (isAdmin) {
      // Admin and Manager can access archived orders
      if (archived === "true") {
        where.isArchived = true;
      } else if (archived === "false") {
        where.isArchived = false;
      } else {
        // By default, show non-archived orders
        where.isArchived = false;
      }

      // If dashboard view, allow filtering by userId
      if (dashboard && params.userId) {
        where.userId = params.userId;
      }
    } else {
      // Any other role - deny access
      throw new AppError("Unauthorized to access orders", 403);
    }

    // Status filters
    if (orderStatus && orderStatus !== "all") {
      where.orderStatus = orderStatus;
    }

    if (paymentStatus && paymentStatus !== "all") {
      where.paymentStatus = paymentStatus;
    }

    // Search functionality with security restrictions
    if (search) {
      const isNumeric = /^\d+$/.test(search);
      const orFilters: any[] = [];

      // Partial ID search (safe for all users)
      orFilters.push({
        $expr: {
          $regexMatch: {
            input: { $toString: "$_id" },
            regex: search,
            options: "i",
          },
        },
      });

      // Name and city search (safe for all users)
      orFilters.push(
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
        { "shippingAddress.city": { $regex: search, $options: "i" } },
      );

      // Email search - only for admins (privacy concern)
      if (isAdmin && search.includes("@")) {
        orFilters.push({
          "shippingAddress.email": { $regex: search, $options: "i" },
        });
      }

      // Phone search - only for numeric searches or admins
      if (isNumeric && (isAdmin || search.length >= 10)) {
        orFilters.push({
          "shippingAddress.phone": { $regex: search, $options: "i" },
        });
      }

      // Product name search (safe for all users)
      orFilters.push({
        "items.name": { $regex: search, $options: "i" },
      });

      where.$or = orFilters;
    }

    // Date range filter with UTC handling
    if (fromDate || toDate) {
      where.createdAt = {};

      if (fromDate) {
        const startDate = new Date(fromDate);
        startDate.setUTCHours(0, 0, 0, 0);
        where.createdAt.$gte = startDate;
      }

      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setUTCHours(23, 59, 59, 999);
        where.createdAt.$lte = endDate;
      }
    }

    // Build sort object
    const sortObject: Record<string, 1 | -1> = {};
    sortObject[sortBy] = sortOrder;

    // Execute queries without projection fields (fetch all fields)
    const [orders, total] = await Promise.all([
      Order.find(where)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean<OrderType[]>(),
      Order.countDocuments(where),
    ]);

    // Process orders to remove sensitive fields using stripSensitiveOrderData
    let processedOrders = orders;

    if (!isAdmin || !dashboard) {
      processedOrders = orders.map((order: any) =>
        removeSensitiveOrderData(order),
      ) as OrderType[];
    }

    const totalPages = Math.ceil(total / limit);

    // Return the data directly (safeAction will wrap it in ResultType)
    return {
      orders: processedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: total,
        limit,
        hasMore: page < totalPages,
      },
      role,
      canAccessArchived: isAdmin,
    };
  });
};
