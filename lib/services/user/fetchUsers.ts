import { AppError } from "@/lib/app-error";
import User from "@/lib/models/User";
import { safeNumber } from "@/lib/utils/buildProductFilter";

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
export async function fetchUsers(queryString: string) {
  try {
    const searchParams = new URLSearchParams(queryString);

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

    return JSON.parse(
      JSON.stringify({
        users,
        currentPage: isSearchMode ? 1 : page,
        totalPages: isSearchMode ? 1 : Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: isSearchMode ? total : limit,
        isSearchMode,
      }),
    );
  } catch (error) {
    console.error("Products API Error:", error);

    throw new AppError("[fetchUsers services] Something went wrong", 500);
  }
}
