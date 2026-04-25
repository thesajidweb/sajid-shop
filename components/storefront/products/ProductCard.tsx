"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";
import { ProductType } from "@/lib/types/ProductType";
import { calculateDiscountPrice } from "@/lib/utils/priceCalculator";
import { getStockInfo } from "@/lib/utils/getStockInfo";
import { getImageKitUrl } from "@/lib/imagekit/imagekit";
import WishlistButton from "../profile/WishlistButton";
import ProductModal from "./ProductModal";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface ProductCardProps {
  product: ProductType;
  className?: string;
  showBadges?: boolean;
  showActions?: boolean;
  showRating?: boolean;
  showStock?: boolean;
  onAddToCart?: (product: ProductType) => void;
  onWishlist?: (product: ProductType) => void;
}

const ProductCard = ({
  product,
  className,
  showBadges = true,
  showActions = true,
  showRating = true,
  showStock = true,
}: ProductCardProps) => {
  const discountedPrice = calculateDiscountPrice(
    product.price,
    product.discount,
  );
  const hasDiscount = discountedPrice < product.price;
  const { totalStock, isOutOfStock, isLowStock } = getStockInfo(
    product.variants,
  );
  const primaryImage = product.gallery?.[0]?.url || "/placeholder.png";
  const discountedPercentage = Math.round(
    ((product.price - discountedPrice) / product.price) * 100,
  );
  const productUrl = `/products/${product._id}`;

  return (
    <article
      itemType="https://schema.org/ItemList"
      title={`View ${product.name} product`}
      aria-label={`Open ${product.name} product`}
      className={cn(
        "group relative flex flex-col bg-card rounded-xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 w-full max-w-[260px] mx-auto",
        isOutOfStock && "opacity-70 cursor-not-allowed",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-4/5 bg-muted overflow-hidden">
        <Link href={productUrl} className="block h-full">
          <Image
            src={getImageKitUrl(primaryImage, {
              width: 800,
              height: 800,
              quality: 80,
            })}
            alt={product.name}
            fill
            className="object-cover rounded-lg transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 
         (max-width: 1024px) 50vw, 
         33vw"
            priority={false}
          />
          {/* Badges  */}
          {showBadges && (
            <div className="absolute top-1 left-1 flex flex-col gap-1 z-10">
              {hasDiscount && (
                <Badge className="bg-destructive text-white shadow-sm text-[10px]">
                  -{discountedPercentage}%
                </Badge>
              )}

              {isLowStock && (
                <Badge className="bg-amber-500 text-white shadow-sm text-[10px]">
                  Low Stock
                </Badge>
              )}
              {isOutOfStock && (
                <Badge className="bg-destructive/80 text-white shadow-sm text-[10px]">
                  Sold Out
                </Badge>
              )}
            </div>
          )}
        </Link>
        {showActions && !isOutOfStock && product?._id && (
          <div className="absolute top-1 right-1 z-10">
            <WishlistButton productId={product._id} />
          </div>
        )}
        {/* Action Buttons */}
      </div>

      {/* Content */}
      <div className="p-2 flex flex-col gap-1 flex-1">
        {/* Brand/Category */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[10px] uppercase tracking-wide">
            {product.brand || product.category}
          </span>

          <div className="w-7 h-7 flex items-center justify-center p-1 border rounded-xl shadow-lg font-semibold cursor-pointer hover:bg-primary  text-primary hover:text-white">
            <ProductModal
              product={product}
              trigger={
                <button>
                  <ShoppingBag className="h-4 w-4" />
                </button>
              }
            />
          </div>
        </div>
        {/* Name */}
        <Link href={productUrl} className="block ">
          <h3 className="font-semibold text-[10px] md:text-[13px] line-clamp-1 w-40 md:w-full">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {showRating && (
          <div className="flex items-center gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-3 w-3",
                  star <= Math.floor(product.averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-none text-muted-foreground/40",
                )}
              />
            ))}
            <span className="text-[9px] text-muted-foreground ml-1">
              {product.averageRating?.toFixed(1) || "N/A"} (
              {product.ratingsCount || 0})
            </span>
          </div>
        )}

        {/* Variant Colors */}
        {product.variants.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[9px] text-muted-foreground">Colors:</span>
            <div className="flex gap-1">
              {product.variants.slice(0, 3).map((variant, index) => (
                <div
                  key={index}
                  className="h-3 w-3 rounded-full border border-border"
                  style={{ backgroundColor: variant.colorCode }}
                />
              ))}
              {product.variants.length > 3 && (
                <span className="text-[9px] text-muted-foreground">
                  +{product.variants.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-baseline gap-1">
            <span className="font-semibold text-[10px] sm:text-[12px] md:text-sm text-chart-1">
              {formatCurrency(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-[9px] sm:text-[11px] text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          {showStock && (
            <span
              className={cn(
                "text-[8px] sm:text-[11px] font-medium",
                isOutOfStock
                  ? "text-destructive"
                  : isLowStock
                    ? "text-amber-500"
                    : "text-success",
              )}
            >
              {isOutOfStock
                ? "Out"
                : isLowStock
                  ? `Only ${totalStock}`
                  : "InStock"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
