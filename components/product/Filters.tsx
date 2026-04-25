"use client";

import { Filter, RefreshCw, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { getCategories } from "@/lib/actions/category/getCategories";
import { CategoryType } from "@/lib/types/categoryType";
import DesktopFilters from "./DesktopFilters";
import PaginationControls from "./PaginationControls";
import MobileFilters from "./MobileFilters";
import { useDebouncedCallback } from "@/lib/hooks/useDebouncedCallback";
import getClientAuth from "@/lib/auth/getClientAuth";
import ErrorBox from "../shared/ErrorBox";

//  Type-safe filter definitions
export const DEFAULT_FILTERS = {
  search: "",
  category: "all",
  subcategory: "all",
  status: "all",
  minPrice: "",
  maxPrice: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: "1",
  limit: "12",
  isFeatured: "false", //  Added isFeatured filter
} as const;

type FilterKey = keyof typeof DEFAULT_FILTERS;
type FilterValue = string;
type FilterUpdate = Partial<Record<FilterKey, FilterValue>>;
type Filters = Record<FilterKey, FilterValue>;

interface FiltersProps {
  dashboard?: boolean;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const Filters = ({
  dashboard = false,
  totalPages = 1,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 12,
}: FiltersProps) => {
  // client auth
  const { role } = getClientAuth();
  const showFeatured = (dashboard && role === "admin") || role === "manager";

  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isResetting, setIsResetting] = useState(false); //  Spinner state for reset button
  const [error, setError] = useState<string | null>(null); //  Spinner state for reset button

  const basePath = dashboard ? "/dashboard/products" : "/products";

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      if (!res.success) setError(res.error);
      if (res.success) {
        setCategories(res.data);
      }
    };

    fetchCategories();
  }, []);

  //  Create a map from categories array for easy lookup
  const categoryMap = useMemo(() => {
    const map: Record<string, string[]> = {};

    categories.forEach((category) => {
      map[category.name] = category.subcategories;
    });

    return map;
  }, [categories]);

  //  Memoized URL filters extraction
  const urlFilters = useMemo((): Filters => {
    const params: Partial<Filters> = {};

    for (const key of Object.keys(DEFAULT_FILTERS) as FilterKey[]) {
      const value = searchParams.get(key);
      params[key] = value || DEFAULT_FILTERS[key];
    }

    return params as Filters;
  }, [searchParams]);

  // Local UI states for debouncing
  const [localSearch, setLocalSearch] = useState(urlFilters.search);
  const [localMinPrice, setLocalMinPrice] = useState(urlFilters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(urlFilters.maxPrice);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  //  Type-safe URL update function
  const updateUrl = useMemo(() => {
    return (updates: FilterUpdate) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        const filterKey = key as FilterKey;
        const defaultValue = DEFAULT_FILTERS[filterKey];

        if (value === defaultValue) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.replace(`${basePath}?${params.toString()}`);
    };
  }, [router, searchParams, basePath]);

  //  Safe price validation
  const validatePriceRange = (min: string, max: string): boolean => {
    const minNum = min ? Number(min) : null;
    const maxNum = max ? Number(max) : null;

    if (minNum !== null && minNum < 0) return false;
    if (maxNum !== null && maxNum < 0) return false;
    if (minNum !== null && maxNum !== null && minNum > maxNum) return false;

    return true;
  };

  //  Immediate filter changes
  const handleFilterChange = (key: FilterKey, value: string) => {
    const updates: FilterUpdate = { [key]: value };

    // Reset subcategory when category changes
    if (key === "category") {
      updates.subcategory = "all";
    }

    // Reset to page 1 for most filter changes
    if (key !== "page" && key !== "limit") {
      updates.page = "1";
    }

    updateUrl(updates);
  };

  //  Handle featured filter toggle
  const handleFeaturedToggle = () => {
    const currentValue = urlFilters.isFeatured;
    const newValue = currentValue === "true" ? "false" : "true";
    handleFilterChange("isFeatured", newValue);
  };

  // Debounced search with custom hook
  const debouncedSearchUpdate = useDebouncedCallback(
    (value: string) => updateUrl({ search: value, page: "1" }),
    800,
  );

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    debouncedSearchUpdate(value);
  };

  // Debounced price with validation
  const debouncedPriceUpdate = useDebouncedCallback(
    (priceState: { min: string; max: string }) => {
      if (!validatePriceRange(priceState.min, priceState.max)) {
        return;
      }

      updateUrl({
        minPrice: priceState.min,
        maxPrice: priceState.max,
        page: "1",
      });
    },
    800,
  );

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const nextMin = type === "min" ? value : localMinPrice;
    const nextMax = type === "max" ? value : localMaxPrice;

    setLocalMinPrice(nextMin);
    setLocalMaxPrice(nextMax);

    debouncedPriceUpdate({
      min: nextMin,
      max: nextMax,
    });
  };

  //  Safer reset implementation with spinner
  const handleResetFilters = async () => {
    setIsResetting(true); // Start spinner

    // Simulate a small delay for better UX (optional)
    await new Promise((resolve) => setTimeout(resolve, 300));

    router.push(basePath);
    setLocalSearch("");
    setLocalMinPrice("");
    setLocalMaxPrice("");

    setIsResetting(false); // Stop spinner
  };

  // Type-safe pagination handlers
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    updateUrl({ page: page.toString() });
  };

  const handleItemsPerPageChange = (value: string) => {
    updateUrl({ limit: value, page: "1" });
  };

  // Memoized derived values
  const activeFiltersCount = useMemo(() => {
    let count = 0;

    (Object.keys(urlFilters) as FilterKey[]).forEach((key) => {
      if (
        key !== "page" &&
        key !== "limit" &&
        urlFilters[key] !== DEFAULT_FILTERS[key]
      ) {
        count++;
      }
    });

    return count;
  }, [urlFilters]);

  const availableSubcategories = useMemo(() => {
    if (urlFilters.category === "all") return [];

    return categoryMap[urlFilters.category] ?? [];
  }, [urlFilters.category, categoryMap]);

  const availableCategories = categories.map((cat) => cat.name);
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  const showingRange = useMemo(() => {
    if (totalItems === 0) return "0 items";

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return `${start}-${end} of ${totalItems} items`;
  }, [currentPage, itemsPerPage, totalItems]);

  //  Check if featured filter is active
  const isFeaturedActive = urlFilters.isFeatured === "true";

  if (error)
    return (
      <ErrorBox title="filter products categories error" message={error} />
    );
  return (
    <div className="space-y-1 sm:space-y-2 md:space-y-3 relative">
      {/*  Featured Button for Mobile */}
      {showFeatured && (
        <Button
          variant={isFeaturedActive ? "default" : "outline"}
          size="sm"
          onClick={handleFeaturedToggle}
          className="h-8 px-2 text-xs cursor-pointer absolute -top-12 md:-top-12.5 right-2  mx-1"
        >
          <Star
            className={`h-3 w-3 mr-1 ${isFeaturedActive ? "fill-current" : ""}`}
          />
          Featured
        </Button>
      )}

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden border p-1 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-fit justify-between"
            >
              <span className="p-text">Show Filter Options</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showMobileFilters ? "rotate-180" : ""
                }`}
              />
            </Button>
            {activeFiltersCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs">
                {activeFiltersCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/*  Reset Button with Spinner for Mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              disabled={activeFiltersCount === 0 || isResetting}
              className="h-8 px-2 text-xs cursor-pointer border"
            >
              <RefreshCw
                className={`h-3 w-3 mr-1 ${isResetting ? "animate-spin" : ""}`}
              />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Filters Content */}
      {showMobileFilters && (
        <MobileFilters
          dashboard={dashboard}
          urlFilters={urlFilters}
          localSearch={localSearch}
          localMinPrice={localMinPrice}
          localMaxPrice={localMaxPrice}
          availableCategories={availableCategories}
          availableSubcategories={availableSubcategories}
          onSearchChange={handleSearchChange}
          onPriceChange={handlePriceChange}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Desktop Filters Section */}
      <div className="hidden lg:block">
        <DesktopFilters
          dashboard={dashboard}
          urlFilters={urlFilters}
          localSearch={localSearch}
          localMinPrice={localMinPrice}
          localMaxPrice={localMaxPrice}
          showPriceFilter={showPriceFilter}
          activeFiltersCount={activeFiltersCount}
          availableCategories={availableCategories}
          availableSubcategories={availableSubcategories}
          onSearchChange={handleSearchChange}
          onPriceChange={handlePriceChange}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onTogglePriceFilter={() => setShowPriceFilter(!showPriceFilter)}
        />
      </div>

      {/* Pagination Section */}
      <PaginationControls
        dashboard={dashboard}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        urlFilters={urlFilters}
        pageNumbers={pageNumbers}
        showingRange={showingRange}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default Filters;
