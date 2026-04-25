import { requirePermission } from "@/lib/auth/guards";
import { connectToDB } from "@/lib/db/connect";
import {
  dashboardProductFields,
  storefrontProductFields,
} from "@/lib/db/product.projection";

import Product from "@/lib/models/Product";
import { ProductSchema } from "@/lib/types/ProductType";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const allowedSortType = ["createdAt", "updatedAt", "price", "name"] as const;
type SortField = (typeof allowedSortType)[number];

//Types for filter query object. That I would give to mongo-DB to filter the collection
type ProductFilter = {
  $or?: {
    name?: { $regex: string; $options: string };
    brand?: { $regex: string; $options: string };
  }[];
  category?: string;
  subcategory?: string;
  status?: string;
  isFeatured?: boolean;
  price?: {
    $gte?: number;
    $lte?: number;
  };
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
};

function buildProductFilter(params: {
  search: string;
  category: string;
  subcategory: string;
  status: string;
  minPrice: string | null;
  maxPrice: string | null;
  createdFrom: string | null;
  createdTo: string | null;
  isDashboard?: boolean; //  optional flag to differ between admin dashboard and storefront
  isFeatured?: boolean;
}): ProductFilter {
  const filter: ProductFilter = {};

  // Search
  const searchValue = params.search.trim().slice(0, 50);
  if (searchValue) {
    filter.$or = [
      { name: { $regex: searchValue, $options: "i" } },
      { brand: { $regex: searchValue, $options: "i" } },
    ];
  }

  // Category
  if (params.category !== "all") filter.category = params.category;
  if (params.subcategory !== "all") filter.subcategory = params.subcategory;

  if (params.isDashboard) {
    // Dashboard  all statuses
    if (params.status !== "all") filter.status = params.status;
  } else {
    // Storefront only active products
    filter.status = "active";
  }
  // Featured
  if (params.isFeatured !== undefined) {
    filter.isFeatured = params.isFeatured;
  }

  //Price
  if (params.minPrice || params.maxPrice) {
    const price: ProductFilter["price"] = {};

    if (params.minPrice) {
      const min = Number(params.minPrice);
      if (!Number.isNaN(min) && min >= 0) price.$gte = min;
    }

    if (params.maxPrice) {
      const max = Number(params.maxPrice);
      if (!Number.isNaN(max) && max >= 0) price.$lte = max;
    }

    if (Object.keys(price).length) filter.price = price;
  }

  //Dates
  if (params.createdFrom || params.createdTo) {
    const createdAt: ProductFilter["createdAt"] = {};

    if (params.createdFrom) {
      const from = new Date(params.createdFrom);
      if (!Number.isNaN(from.getTime())) createdAt.$gte = from;
    }

    if (params.createdTo) {
      const to = new Date(params.createdTo);
      if (!Number.isNaN(to.getTime())) createdAt.$lte = to;
    }

    if (Object.keys(createdAt).length) filter.createdAt = createdAt;
  }

  return filter;
}

export function safeNumber(
  value: string | null,
  fallback: number,
  min = 0,
  max = Infinity,
): number {
  if (!value) return fallback;
  const n = Number(value);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

// GET /api/products
export const GET = async (req: NextRequest) => {
  const dashboardHeader = req.headers.get("dashboard");
  const authSession = await requirePermission(req, "FULL_PRODUCT_DETAILS");

  //it will  decided by admin in production

  const featuredHeader = req.headers.get("isFeatured");

  const isDashboardView = dashboardHeader && authSession;

  const fields = isDashboardView
    ? dashboardProductFields
    : storefrontProductFields;

  try {
    await connectToDB();

    const searchParams = req.nextUrl.searchParams;
    const featured = searchParams.get("isFeatured") || "false";
    const parsedBooleanOrUndefined =
      featuredHeader === "true" || featured === "true"
        ? true
        : featuredHeader === "false"
          ? false
          : undefined;

    const searchValue = searchParams.get("search")?.trim() || "";
    const isSearchMode = searchValue.length > 0;
    const page = isSearchMode ? 1 : safeNumber(searchParams.get("page"), 1, 1);

    const limit = isSearchMode
      ? 0 // 0 means "no limit" in MongoDB
      : safeNumber(searchParams.get("limit"), 12, 1, 100);

    const skip = isSearchMode ? 0 : (page - 1) * limit;

    //Sorting
    const sortByParam = searchParams.get("sortBy") || "createdAt";
    const sortOrderParam = searchParams.get("sortOrder");

    const sortBy: SortField = allowedSortType.includes(sortByParam as SortField)
      ? (sortByParam as SortField)
      : "createdAt";

    const sortOrder = sortOrderParam === "asc" ? 1 : -1;

    //Filters
    const filter = buildProductFilter({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      subcategory: searchParams.get("subcategory") || "all",
      status: searchParams.get("status") || "all",
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      createdFrom: searchParams.get("createdFrom"),
      createdTo: searchParams.get("createdTo"),
      isFeatured: parsedBooleanOrUndefined,
    });

    const query = Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .select(fields)
      .lean();

    if (!isSearchMode) {
      query.skip(skip).limit(limit);
    }

    const products = await query;
    const total = await Product.countDocuments(filter);

    return NextResponse.json({
      products,
      currentPage: isSearchMode ? 1 : page,
      totalPages: isSearchMode ? 1 : Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: isSearchMode ? total : limit,
      isSearchMode,
    });
  } catch (error) {
    console.error("Products API Error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const authSession = await requirePermission(request, "CREATE_PRODUCT");

    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDB();
    const body = await request.json();
    if (!body)
      return NextResponse.json({ error: "No data provided" }, { status: 400 });

    const validatedData = ProductSchema.parse(body);

    const product = await Product.create(validatedData);
    if (!product) {
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 },
      );
    }
    revalidateTag("products", "default");

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
};
