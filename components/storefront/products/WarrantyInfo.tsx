"use client";

import { useWarrantyInfo } from "@/lib/hooks/useWarrantyInfo";
import { ProductType } from "@/lib/types/ProductType";
import { cn } from "@/lib/utils/utils";
import { ShieldCheck, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  warranty?: ProductType["warranty"];
  className?: string;
};

const WarrantyInfo = ({ warranty, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { isValid, warrantyText, coverageText } = useWarrantyInfo(warranty);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isValid) return null;

  return (
    <div ref={wrapperRef} className="relative inline-block">
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-full hover:bg-muted/70 transition hover:cursor-pointer p2-text",
          className,
        )}
      >
        <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
        <span>{warrantyText}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition", isOpen && "rotate-180")}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-72 rounded-lg border bg-popover shadow-md z-50">
          <div className="p-4 space-y-3 text-sm">
            {coverageText && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coverage</span>
                <span className="font-medium">{coverageText}</span>
              </div>
            )}

            {warranty?.policy && (
              <div className="text-muted-foreground text-xs">
                {warranty.policy}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyInfo;
