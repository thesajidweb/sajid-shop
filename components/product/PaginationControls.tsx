"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type DefaultFilters = {
  limit: "12";
};

type FilterValue = string;

type Filters = Record<keyof DefaultFilters, FilterValue>;
// ✅ Sub-component: Pagination Controls
interface PaginationControlsProps {
  dashboard?: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  urlFilters: Filters;
  pageNumbers: number[];
  showingRange: string;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string) => void;
}

const PaginationControls = ({
  dashboard,
  currentPage,
  totalPages,
  totalItems,
  urlFilters,
  pageNumbers,
  showingRange,
  onPageChange,
  onItemsPerPageChange,
}: PaginationControlsProps) => {
  const [singlePageItems, setSinglePageItems] = useState([10, 12, 14, 20]);
  useEffect(() => {
    const settingItemsPerPage = () => {
      if (dashboard) setSinglePageItems([12, 20, 30, 40, 50, 60, 80, 100]);
    };
    settingItemsPerPage();
  }, [dashboard]);
  return (
    <div className="border rounded-lg p-1 lg:px-3">
      <div className="flex flex-row items-center justify-between gap-3">
        {/* Items Per Page and Showing Range */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="hidden md:block text-sm text-gray-600 whitespace-nowrap">
              Show
            </span>
            <Select
              value={urlFilters.limit}
              onValueChange={onItemsPerPageChange}
            >
              <SelectTrigger className="h-8 w-[70px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {singlePageItems.map((n) => (
                  <SelectItem
                    key={n}
                    value={n.toString()}
                    className="text-xs hover:cursor-pointer"
                  >
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="hidden sm:block text-sm text-gray-600">
              per page
            </span>
          </div>

          {totalItems > 0 && (
            <div className="text-sm text-gray-600 hidden sm:block">
              {showingRange}
            </div>
          )}
        </div>

        {/* Page Info */}
        <div className="text-sm hidden sm:block">
          <span className="text-gray-400">Page </span>
          <span className="font-medium">{currentPage}</span>
          <span className="text-gray-600"> of </span>
          <span className="font-medium">{totalPages}</span>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            className="hidden md:block h-8 px-2 text-xs"
            title="First page"
          >
            First
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-8 w-8 cursor-pointer"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="h-8 w-8 text-sm cursor-pointer"
            >
              {pageNum}
            </Button>
          ))}

          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 cursor-pointer"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="hidden md:block h-8 px-2 text-xs"
            title="Last page"
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
