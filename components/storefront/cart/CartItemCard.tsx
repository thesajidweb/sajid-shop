"use client";

import Image from "next/image";
import { X, Check } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";
import { QuantityControl } from "./QuantityControl";
import { useWarrantyInfo } from "@/lib/hooks/useWarrantyInfo";

import { warranty } from "@/redux/features/cartSlice";

export interface ProductCardProps {
  id: string;
  name: string;
  image?: string;
  priceAtPurchase: number;
  warranty?: warranty;
  quantity?: number;
  colorName?: string;
  colorCode?: string;
  size?: string;
  stock?: number;

  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onClick?: (id: string) => void;

  isLoading?: boolean;
  actions?: ReactNode;
  className?: string;
  variant?: "default" | "compact" | "horizontal";
}

export function CartItemCard({
  id,
  name,
  image,
  priceAtPurchase,
  warranty,
  quantity = 1,
  colorName,
  colorCode,
  size,
  stock,
  onQuantityChange,
  onRemove,
  onClick,
  isLoading = false,
  actions,
  className,
  variant = "default",
}: ProductCardProps) {
  const isHorizontal = variant === "horizontal";
  const totalPrice = (priceAtPurchase * quantity).toFixed(2);
  const { warrantyText } = useWarrantyInfo(warranty);

  return (
    <Card
      onClick={onClick ? () => onClick(id) : undefined}
      className={cn(
        "transition-opacity duration-200 py-1 sm:py-2",
        onClick && "cursor-pointer hover:shadow-sm",
        isLoading && "opacity-70",
        isHorizontal && "flex",
        className,
      )}
    >
      <CardContent
        className={cn(
          "px-2 sm:px-3",
          isHorizontal ? "flex gap-2 sm:gap-4 w-full" : "space-y-3",
        )}
      >
        {/* Image - Responsive sizing */}
        <div
          className={cn(
            "relative shrink-0 rounded-lg overflow-hidden bg-muted",
            isHorizontal ? "h-20 w-20 sm:h-24 sm:w-24" : "h-40 w-full sm:h-48",
          )}
        >
          {image && (
            <Image
              src={image}
              alt={name}
              fill
              sizes={
                isHorizontal
                  ? "(max-width: 640px) 80px, 96px"
                  : "(max-width: 640px) 160px, 384px"
              }
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

        {/* Content - Mobile-first spacing */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2 sm:gap-3">
          <div className="flex justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  "font-semibold line-clamp-2",
                  isHorizontal
                    ? "text-sm sm:text-base"
                    : "text-base sm:text-lg",
                )}
              >
                {name}
              </h3>

              {warrantyText && (
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 text-green-500 shrink-0" />
                  <span className="truncate">{warrantyText}</span>
                </div>
              )}
            </div>

            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                disabled={isLoading}
                className="h-7 w-7 sm:h-8 sm:w-8 -mt-1 -mr-1 text-muted-foreground hover:text-destructive shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(id);
                }}
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>

          {/* Color & Size - Responsive */}
          {(colorName || size) && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
              {colorName && (
                <div className="flex items-center gap-1">
                  {colorCode && (
                    <span
                      className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: colorCode }}
                    />
                  )}
                  <span>{colorName}</span>
                </div>
              )}

              {size && (
                <div>
                  <span>Size: {size}</span>
                </div>
              )}
            </div>
          )}

          {/* Price and Quantity - Mobile optimized */}
          <div className="flex items-center justify-between gap-3 mt-1">
            <div className="flex-1">
              <div className="text-base sm:text-lg font-bold">
                ₨{totalPrice}
              </div>
              <div className="text-[11px] sm:text-xs text-muted-foreground">
                ₨{priceAtPurchase.toFixed(2)} each
              </div>
            </div>
            <p className="p2-text text-chart-1">In Stock: {stock}</p>

            {onQuantityChange && (
              <QuantityControl
                value={quantity}
                min={1}
                isLoading={isLoading}
                size={isHorizontal ? "sm" : "default"}
                onChange={(q) => onQuantityChange(id, q)}
              />
            )}

            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
