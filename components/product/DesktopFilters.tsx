"use client";

import { Input } from "../ui/input";
import { Search, SortAsc, SortDesc, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ Type-safe filter definitions
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
  limit: "10",
} as const;

type FilterKey = keyof typeof DEFAULT_FILTERS;
type FilterValue = string;

type Filters = Record<FilterKey, FilterValue>;

// ✅ Sub-component: Desktop Filters
interface DesktopFiltersProps {
  dashboard?: boolean;
  urlFilters: Filters;
  localSearch: string;
  localMinPrice: string;
  localMaxPrice: string;
  showPriceFilter: boolean;
  activeFiltersCount: number;
  availableCategories: string[];
  availableSubcategories: string[];
  onSearchChange: (value: string) => void;
  onPriceChange: (type: "min" | "max", value: string) => void;
  onFilterChange: (key: FilterKey, value: string) => void;
  onResetFilters: () => void;
  onTogglePriceFilter: () => void;
}

const DesktopFilters = ({
  dashboard,
  urlFilters,
  localSearch,
  localMinPrice,
  localMaxPrice,
  showPriceFilter,
  activeFiltersCount,
  availableCategories,
  availableSubcategories,
  onSearchChange,
  onPriceChange,
  onFilterChange,
  onResetFilters,
  onTogglePriceFilter,
}: DesktopFiltersProps) => {
  return (
    <div className="border rounded-lg shadow-sm p-3 space-y-3">
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="desktop-search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="desktop-search"
              placeholder="Search products..."
              className="pl-9 h-9 text-sm"
              value={localSearch}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Category & Subcategory */}
        <div className="flex gap-2">
          <Select
            value={urlFilters.category}
            onValueChange={(value) => onFilterChange("category", value)}
          >
            <SelectTrigger className="h-9 text-sm w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={urlFilters.subcategory}
            onValueChange={(value) => onFilterChange("subcategory", value)}
            disabled={
              urlFilters.category === "all" ||
              availableSubcategories.length === 0
            }
          >
            <SelectTrigger className="h-9 text-sm w-[140px]">
              <SelectValue
                placeholder={
                  urlFilters.category === "all"
                    ? "Subcategory"
                    : availableSubcategories.length === 0
                      ? "No sub"
                      : "All Sub"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {availableSubcategories.map((sub: string) => (
                <SelectItem key={sub} value={sub}>
                  {sub
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status & Sort */}
        <div className="flex gap-2">
          {dashboard && (
            <Select
              value={urlFilters.status}
              onValueChange={(value) => onFilterChange("status", value)}
            >
              <SelectTrigger className="h-9 text-sm w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          )}

          <div className="flex gap-1">
            <Select
              value={urlFilters.sortBy}
              onValueChange={(value) => onFilterChange("sortBy", value)}
            >
              <SelectTrigger className="h-9 text-sm w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created</SelectItem>
                <SelectItem value="updatedAt">Updated</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative group flex items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() =>
                  onFilterChange(
                    "sortOrder",
                    urlFilters.sortOrder === "asc" ? "desc" : "asc",
                  )
                }
              >
                {urlFilters.sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>

              {/* Tooltip */}
              <span
                className="
      pointer-events-none
      absolute
      -top-6
      scale-95
      rounded-md
     bg-background
      px-2
      py-1
      text-[10px]
      font-medium
     border 
      opacity-0
      shadow-sm
      transition-all
      duration-200
      group-hover:scale-100
      group-hover:opacity-100
    "
              >
                {urlFilters.sortOrder === "asc" ? "Ascending" : "Descending"}
              </span>
            </div>
          </div>
        </div>

        {/* Price Filter Toggle & Reset */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePriceFilter}
            className="h-9 text-sm"
          >
            Price {showPriceFilter ? "↑" : "↓"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onResetFilters}
            disabled={activeFiltersCount === 0}
            className="h-9 w-9"
            title="Reset filters"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price Range - Collapsible with Slider */}
      {showPriceFilter && (
        <div className="pt-3 border-t">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium whitespace-nowrap">
                Price Range:
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={onTogglePriceFilter}
                className="h-8 text-xs"
              >
                Hide
              </Button>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                placeholder="Min"
                value={localMinPrice}
                onChange={(e) => onPriceChange("min", e.target.value)}
                className="pl-2 h-8 w-20 text-sm"
              />
              <input
                type="range"
                min={0}
                max={1000} // Adjust max according to your product range
                value={localMinPrice}
                onChange={(e) => onPriceChange("min", e.target.value)}
                className="flex-1 h-2 rounded-lg accent-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                placeholder="Max"
                value={localMaxPrice}
                onChange={(e) => onPriceChange("max", e.target.value)}
                className="pl-2 h-8 w-20 text-sm"
              />
              <input
                type="range"
                min={0}
                max={10000} // Adjust max according to your product range
                value={localMaxPrice}
                onChange={(e) => onPriceChange("max", e.target.value)}
                className="flex-1 h-2 rounded-lg accent-blue-500"
              />
            </div>

            {/* Optional: Show current range */}
            <div className="text-sm text-gray-600">
              ₨{localMinPrice} - ₨{localMaxPrice}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DesktopFilters;
