"use client";

import { Input } from "../ui/input";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_FILTERS } from "./DesktopFilters";

type FilterKey = keyof typeof DEFAULT_FILTERS;
type FilterValue = string;
type Filters = Record<FilterKey, FilterValue>;

interface MobileFiltersProps {
  dashboard?: boolean;
  urlFilters: Filters;
  localSearch: string;
  localMinPrice: string;
  localMaxPrice: string;
  availableCategories: string[];
  availableSubcategories: string[];
  onSearchChange: (value: string) => void;
  onPriceChange: (type: "min" | "max", value: string) => void;
  onFilterChange: (key: FilterKey, value: string) => void;
}

const MAX_PRICE = 10000; // Set your max price here

const MobileFilters = ({
  dashboard,
  urlFilters,
  localSearch,
  localMinPrice,
  localMaxPrice,
  availableCategories,
  availableSubcategories,
  onSearchChange,
  onPriceChange,
  onFilterChange,
}: MobileFiltersProps) => {
  // Convert prices to numbers for slider calculation
  const minPriceNum = Number(localMinPrice) || 0;
  const maxPriceNum = Number(localMaxPrice) || MAX_PRICE;

  return (
    <div className="lg:hidden">
      <div className="border rounded-lg shadow-sm p-4 space-y-3">
        {/* Search */}
        <div className="space-y-1">
          <label htmlFor="mobile-search" className="p-text font-medium">
            Search Products
          </label>
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 p2-text" />
            <Input
              id="mobile-search"
              placeholder="Search by name or brand..."
              className="pl-9 h-10 text-xs"
              value={localSearch}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-2 w-full">
            <label
              htmlFor="mobile-category"
              className="p-text font-medium mb-1"
            >
              Category
            </label>
            <Select
              value={urlFilters.category}
              onValueChange={(value) => onFilterChange("category", value)}
            >
              <SelectTrigger id="mobile-category" className="h-10  text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className=" text-xs" value="all">
                  All Categories
                </SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <label htmlFor="mobile-subcategory" className=" p-text font-medium">
              Subcategory
            </label>
            <Select
              value={urlFilters.subcategory}
              onValueChange={(value) => onFilterChange("subcategory", value)}
              disabled={
                urlFilters.category === "all" ||
                availableSubcategories.length === 0
              }
            >
              <SelectTrigger id="mobile-subcategory" className="h-10  text-xs">
                <SelectValue
                  placeholder={
                    urlFilters.category === "all"
                      ? "Select category"
                      : availableSubcategories.length === 0
                        ? "No subcategories"
                        : "All Subcategories"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className=" text-xs" value="all">
                  All Subcategories
                </SelectItem>
                {availableSubcategories.map((sub: string) => (
                  <SelectItem key={sub} value={sub}>
                    {sub
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status & Sort */}
        <div className="grid grid-cols-2 gap-4">
          {dashboard && (
            <div className="flex items-center text-xs gap-2 space-y-2">
              <label htmlFor="mobile-status" className="p-text font-medium">
                Status
              </label>
              <Select
                value={urlFilters.status}
                onValueChange={(value) => onFilterChange("status", value)}
              >
                <SelectTrigger id="mobile-status" className="h-10 text-xs ">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {dashboard ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select
                  value={urlFilters.sortBy}
                  onValueChange={(value) => onFilterChange("sortBy", value)}
                >
                  <SelectTrigger className="h-10 flex-1">
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
                    className="h-fit w-fit flex hover:cursor-pointer"
                    onClick={() =>
                      onFilterChange(
                        "sortOrder",
                        urlFilters.sortOrder === "asc" ? "desc" : "asc",
                      )
                    }
                  >
                    {urlFilters.sortOrder === "asc" ? (
                      <div className="flex items-center justify-center gap-1">
                        <span>Ascending</span>
                        <SortAsc className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <span>Descending</span>
                        <SortDesc className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select
                  value={urlFilters.sortBy}
                  onValueChange={(value) => onFilterChange("sortBy", value)}
                >
                  <SelectTrigger className="h-10 flex-1">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Sorted by date</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative group flex items-center justify-center">
                  <Button
                    variant="outline"
                    className="h-fit w-fit flex hover:cursor-pointer"
                    onClick={() =>
                      onFilterChange(
                        "sortOrder",
                        urlFilters.sortOrder === "asc" ? "desc" : "asc",
                      )
                    }
                  >
                    {urlFilters.sortOrder === "asc" ? (
                      <div className="flex items-center justify-center gap-1">
                        <span>Ascending</span>
                        <SortAsc className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <span>Descending</span>
                        <SortDesc className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="mobile-min-price" className="p-text font-medium">
              Min Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                ₨
              </span>
              <Input
                id="mobile-min-price"
                type="number"
                min="0"
                placeholder="0"
                value={localMinPrice}
                onChange={(e) => onPriceChange("min", e.target.value)}
                className="pl-8 h-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="mobile-max-price" className="p-text font-medium">
              Max Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                ₨
              </span>
              <Input
                id="mobile-max-price"
                type="number"
                min="0"
                placeholder="∞"
                value={localMaxPrice}
                onChange={(e) => onPriceChange("max", e.target.value)}
                className="pl-8 h-10"
              />
            </div>
          </div>
        </div>

        {/* Dual Range Slider - Price Speaker */}
        <div className="relative h-8 flex items-center gap-2 mt-2">
          {/* Track */}
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300 rounded z-0"></div>
          {/* Active Range */}
          <div
            className="absolute top-1/2 h-1 bg-blue-500 rounded z-10"
            style={{
              left: `${(minPriceNum / MAX_PRICE) * 100}%`,
              right: `${100 - (maxPriceNum / MAX_PRICE) * 100}%`,
            }}
          ></div>
          {/* Min Thumb */}
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            value={minPriceNum}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), maxPriceNum);
              onPriceChange("min", val.toString());
            }}
            className="appearance-none w-full h-8 bg-transparent z-20 pointer-events-auto text-xs"
          />
          {/* Max Thumb */}
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            value={maxPriceNum}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), minPriceNum);
              onPriceChange("max", val.toString());
            }}
            className="appearance-none w-full h-8 bg-transparent z-20 pointer-events-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;
