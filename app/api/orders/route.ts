import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { DailyAnalytics, ProductStats } from "@/lib/models/Analytics";
import { OrderItemType } from "@/lib/types/order";
import { VariantType } from "@/lib/types/ProductType";
import {
  calculateCartTotals,
  CartTotals,
} from "@/lib/utils/cartTotalsCalculation";
import { calculateDiscountPrice } from "@/lib/utils/priceCalculator";
import mongoose from "mongoose";
import { requirePermission } from "@/lib/auth/guards";

export async function POST(req: NextRequest) {
  await connectToDB();

  const dbSession = await mongoose.startSession();

  try {
    await dbSession.startTransaction();

    // 1. AUTH CHECK
    const authSession = await requirePermission(req, "CREATE_ORDER");
    if (!authSession) {
      throw new Error("Unauthorized");
    }

    // 2. CHECK NON-DELIVERED ORDERS COUNT
    const nonDeliveredOrdersCount = await Order.countDocuments({
      userId: authSession.user.id,
      orderStatus: { $in: ["pending", "processing", "shipped"] },
    });

    if (nonDeliveredOrdersCount >= 3) {
      throw new Error(
        "You cannot place more than 3 orders at a time. Please wait for your existing orders to be delivered.",
      );
    }

    // 3. PARSE BODY
    const body = await req.json();
    const { items, shippingAddress, shippingMethod, paymentMethod } = body;

    // 4. VALIDATION
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items in order");
    }

    // 5. VALIDATE PRODUCT IDS & FETCH PRODUCTS
    const productIds = items.map(
      (item: OrderItemType) => new mongoose.Types.ObjectId(item.productId),
    );

    const products = await Product.find(
      { _id: { $in: productIds } },
      { price: 1, discount: 1, variants: 1, cost: 1, name: 1 }, // Include cost for profit
    ).lean();

    if (!products.length) {
      throw new Error("No products found");
    }

    // 6. STOCK VALIDATION & CALCULATE COSTS
    let totalCost = 0;
    let totalRevenue = 0;

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);

      const variant = product.variants.find(
        (v: VariantType) => v.colorCode === item.colorCode,
      );
      if (!variant) throw new Error("Variant not found");

      const sizeObj = variant.sizes.find(
        (s: { size: string; stock: number }) => s.size === item.size,
      );
      if (!sizeObj) throw new Error("Size not found");

      if (item.quantity <= 0 || item.quantity > sizeObj.stock) {
        throw new Error(`Out of stock: ${item.name} (${item.size})`);
      }

      // Calculate costs for profit tracking
      const itemPrice = calculateDiscountPrice(product.price, product.discount);
      const itemCost = (product.cost || 0) * item.quantity;

      totalCost += itemCost;
      totalRevenue += itemPrice * item.quantity;
    }

    // 7. ATOMIC STOCK UPDATE
    for (const item of items) {
      const result = await Product.updateOne(
        {
          _id: new mongoose.Types.ObjectId(item.productId),
          "variants.colorCode": item.colorCode,
          "variants.sizes.size": item.size,
          "variants.sizes.stock": { $gte: item.quantity },
        },
        {
          $inc: {
            "variants.$[v].sizes.$[s].stock": -item.quantity,
          },
        },
        {
          arrayFilters: [
            { "v.colorCode": item.colorCode },
            { "s.size": item.size },
          ],
          session: dbSession,
        },
      );

      if (result.modifiedCount === 0) {
        throw new Error(`Stock update failed for ${item.name}`);
      }
    }

    // 8. PRICE MAP & TOTALS
    const priceMap = new Map<string, number>();
    products.forEach((p) => {
      priceMap.set(
        p._id.toString(),
        calculateDiscountPrice(p.price, p.discount),
      );
    });

    const calculationItems = items.map((item: OrderItemType) => ({
      price: priceMap.get(item.productId)!,
      quantity: item.quantity,
    }));

    const totals: CartTotals = calculateCartTotals(
      calculationItems,
      shippingMethod,
    );

    // 9. CREATE ORDER WITH COST DATA
    const finalItems = items.map((item: OrderItemType) => ({
      ...item,
      price: priceMap.get(item.productId)!,
      cost:
        products.find((p) => p._id.toString() === item.productId)?.cost || 0, // Store cost in order
    }));

    const newOrder = await Order.create(
      [
        {
          userId: authSession.user.id,
          items: finalItems,
          shippingAddress,
          shippingMethod,
          paymentMethod,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total,
          totalCost: totalCost,
          totalRevenue: totalRevenue,
          orderStatus: "pending",
          paymentStatus: "pending",
          editableUntil: new Date(Date.now() + 10 * 60 * 1000),
        },
      ],
      { session: dbSession },
    );

    // 10. UPDATE ANALYTICS (SIMPLE & FAST)
    const today = new Date().toISOString().split("T")[0];
    const profit = totalRevenue - totalCost;

    // Update daily analytics
    await DailyAnalytics.updateOne(
      { date: today },
      {
        $inc: {
          revenue: totals.total,
          orders: 1,
          profit: profit,
          productsSold: items.reduce((sum, item) => sum + item.quantity, 0),
        },
      },
      { upsert: true, session: dbSession },
    );

    // Update product stats (for top products)
    const productSalesMap = new Map();
    for (const item of finalItems) {
      const existing = productSalesMap.get(item.productId) || {
        quantity: 0,
        revenue: 0,
      };
      existing.quantity += item.quantity;
      existing.revenue += item.price * item.quantity;
      productSalesMap.set(item.productId, existing);
    }

    const bulkProductOps = Array.from(productSalesMap.entries()).map(
      ([productId, data]) => ({
        updateOne: {
          filter: { productId: new mongoose.Types.ObjectId(productId) },
          update: {
            $inc: {
              totalSold: data.quantity,
              totalRevenue: data.revenue,
            },
          },
          upsert: true,
        },
      }),
    );

    if (bulkProductOps.length > 0) {
      await ProductStats.bulkWrite(bulkProductOps, { session: dbSession });
    }

    // Update product salesCount (keep for compatibility)
    const salesMap = new Map<string, number>();
    for (const item of finalItems) {
      salesMap.set(
        item.productId,
        (salesMap.get(item.productId) || 0) + item.quantity,
      );
    }

    const bulkOps = Array.from(salesMap.entries()).map(
      ([productId, quantity]) => ({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(productId) },
          update: {
            $inc: { salesCount: quantity },
            $set: { lastSoldAt: new Date() },
          },
        },
      }),
    );

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps, { session: dbSession });
    }

    // 11. COMMIT
    await dbSession.commitTransaction();
    dbSession.endSession();

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        orderId: newOrder[0]._id,
      },
      { status: 201 },
    );
  } catch (error) {
    await dbSession.abortTransaction();
    dbSession.endSession();

    console.error("❌ ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate
    const authSession = await requirePermission(req, "VIEW_ORDER");
    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }
    const role = authSession?.user.role;
    const userId = authSession?.user.id;

    await connectToDB();

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    // Filters
    const orderStatus = searchParams.get("orderStatus");
    const paymentStatus = searchParams.get("paymentStatus");
    const search = searchParams.get("search");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Legacy filters (for customer view)
    const status = searchParams.get("status");
    const payment = searchParams.get("payment");
    const archived = searchParams.get("archived");

    // Build where clause
    const where: any = {};

    // Role-based filtering
    if (role === "customer") {
      // Customers can only see their own non-archived orders
      where.userId = userId;
      where.isHiddenByUser = false;
      where.isArchived = false; // Customers cannot see archived orders at all

      // If customer tries to request archived orders, return empty result
      if (archived === "true") {
        return NextResponse.json({
          orders: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalOrders: 0,
            limit,
            hasMore: false,
          },
          message: "Archived orders are not accessible to customers",
        });
      }
    } else if (role !== "customer") {
      // Admin and Manager can access archived orders
      if (archived === "true") {
        where.isArchived = true;
      } else if (archived === "false") {
        where.isArchived = false;
      } else {
        // By default, show non-archived orders for admin/manager
        where.isArchived = false;
      }
    } else {
      // Any other role - deny access to archived orders
      return NextResponse.json({
        error: "Unauthorized to access archived orders",
        status: 403,
      });
    }

    // Status filters (supports both naming conventions)
    const finalOrderStatus = orderStatus || status;
    if (finalOrderStatus && finalOrderStatus !== "all") {
      where.orderStatus = finalOrderStatus;
    }

    const finalPaymentStatus = paymentStatus || payment;
    if (finalPaymentStatus && finalPaymentStatus !== "all") {
      where.paymentStatus = finalPaymentStatus;
    }

    // Search functionality
    if (search) {
      const isNumeric = /^\d+$/.test(search);

      const orFilters: any[] = [];

      // Partial ID search
      orFilters.push({
        $expr: {
          $regexMatch: {
            input: { $toString: "$_id" },
            regex: search,
            options: "i",
          },
        },
      });

      orFilters.push(
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
        { "shippingAddress.city": { $regex: search, $options: "i" } },
        { "shippingAddress.email": { $regex: search, $options: "i" } },
        { "items.name": { $regex: search, $options: "i" } },
      );

      if (isNumeric) {
        orFilters.push({
          "shippingAddress.phone": { $regex: search, $options: "i" },
        });
      }

      where.$or = orFilters;
    }

    // Date range filter
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) {
        where.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        // Set to end of day
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt.$lte = endDate;
      }
    }

    // Build sort object
    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute queries in parallel
    const [orders, total] = await Promise.all([
      Order.find(where).sort(sortObject).skip(skip).limit(limit).lean(),
      Order.countDocuments(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Return response with role info
    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: total,
        limit,
        hasMore: page < totalPages,
      },
      role, // Include role in response for debugging/frontend use
      canAccessArchived: role === "admin" || role === "manager",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders", status: 500 });
  }
}
