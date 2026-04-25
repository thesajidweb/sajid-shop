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

export function buildProductFilter(params: {
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
