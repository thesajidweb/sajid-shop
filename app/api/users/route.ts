import { connectToDB } from "@/lib/db/connect";
import User from "@/lib/models/User";

import { NextRequest, NextResponse } from "next/server";
import { safeNumber } from "../products/route";
import { requirePermission } from "@/lib/auth/guards";

const allowedSortType = ["createdAt", "updatedAt"] as const;
type SortField = (typeof allowedSortType)[number];
type UsersFilter = {
  $or?: {
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }[];

  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
};
function buildProductFilter(params: {
  search: string;

  createdFrom: string | null;
  createdTo: string | null;
}): UsersFilter {
  const filter: UsersFilter = {};

  // Search
  const searchValue = params.search.trim().slice(0, 50);
  if (searchValue) {
    filter.$or = [
      { name: { $regex: searchValue, $options: "i" } },
      { email: { $regex: searchValue, $options: "i" } },
    ];
  }

  //Dates
  if (params.createdFrom || params.createdTo) {
    const createdAt: UsersFilter["createdAt"] = {};

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
export async function GET(req: NextRequest) {
  const authSession = await requirePermission(req, "VIEW_USERS");

  if (!authSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (authSession.user.role === "demo") {
    throw new Error("Demo mode: action not allowed");
  }

  try {
    await connectToDB();

    // const { searchParams } = req.nextUrl;
    const searchParams = req.nextUrl.searchParams;

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
      createdFrom: searchParams.get("createdFrom"),
      createdTo: searchParams.get("createdTo"),
    });

    const query = User.find(filter)
      .sort({ [sortBy]: sortOrder })
      .lean();

    if (!isSearchMode) {
      query.skip(skip).limit(limit);
    }

    const users = await query;
    const total = await User.countDocuments(filter);

    return NextResponse.json({
      users,
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
}
