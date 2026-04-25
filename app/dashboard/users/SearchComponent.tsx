"use client";

import PaginationControls from "@/components/product/PaginationControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "@/lib/hooks/useDebouncedCallback";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, ChangeEvent } from "react";

export const DEFAULT_FILTERS = {
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: "1",
  limit: "12",
} as const;

type FilterKey = keyof typeof DEFAULT_FILTERS;
type FilterUpdate = Partial<Record<FilterKey, string>>;
type Filters = Record<FilterKey, string>;

interface SearchComponentProps {
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const SearchComponent = ({
  totalPages = 1,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 12,
}: SearchComponentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const basePath = "/dashboard/users";

  const [localSearch, setLocalSearch] = useState(
    searchParams.get("search") || "",
  );

  // Extract filters from URL
  const urlFilters = useMemo((): Filters => {
    const params: Partial<Filters> = {};

    for (const key of Object.keys(DEFAULT_FILTERS) as FilterKey[]) {
      const value = searchParams.get(key);
      params[key] = value || DEFAULT_FILTERS[key];
    }

    return params as Filters;
  }, [searchParams]);

  // Update URL
  const updateUrl = useMemo(() => {
    return (updates: FilterUpdate) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        const filterKey = key as FilterKey;

        if (value === DEFAULT_FILTERS[filterKey]) {
          params.delete(key);
        } else {
          params.set(key, value!);
        }
      });

      router.replace(`${basePath}?${params.toString()}`);
    };
  }, [router, searchParams, basePath]);

  // Debounced search
  const debouncedSearchUpdate = useDebouncedCallback(
    (value: string) => updateUrl({ search: value, page: "1" }),
    800,
  );

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    debouncedSearchUpdate(value);
  };

  // Pagination logic
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxPagesToShow - 1);

      if (end - start + 1 < maxPagesToShow) {
        start = Math.max(1, end - maxPagesToShow + 1);
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  const showingRange = useMemo(() => {
    if (totalItems === 0) return "0 items";

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return `${start}-${end} of ${totalItems} items`;
  }, [currentPage, itemsPerPage, totalItems]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    updateUrl({ page: page.toString() });
  };

  const handleItemsPerPageChange = (value: string) => {
    updateUrl({ limit: value, page: "1" });
  };
  const onFilterChange = (update: FilterKey, value: string) => {
    updateUrl({ [update]: value });
  };
  return (
    <div className="relative w-full space-y-2">
      <div className="flex flex-row items-center justify-between gap-1">
        <div className="relative flex-1 ">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 "
            placeholder="Search the user..."
            value={localSearch}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleSearchChange(e.target.value)
            }
            aria-label="Search users"
          />
        </div>
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

      <PaginationControls
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

export default SearchComponent;
