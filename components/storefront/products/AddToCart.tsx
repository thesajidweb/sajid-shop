"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/redux/store"; // Import RootState
import {
  initializeProductVariant,
  changeColor,
  changeSize,
  increaseQuantity,
  decreaseQuantity,
  addSelectedToCart,
  selectAvailableStock,
  selectIsOutOfStock,
  selectMaxQuantity,
  selectSelectedColor,
  selectSelectedSize,
  selectProductQuantity,
} from "@/redux/features/cartSlice";
import { ProductType } from "@/lib/types/ProductType";

type WarrantyType = {
  type: "none" | "manufacturer" | "seller";
  period?: number;
  unit?: "day" | "month" | "year";
  policy?: string;
};

type Props = {
  id: string;
  priceAtPurchase: number;
  name: string;
  variant: ProductType["variants"];
  warranty?: WarrantyType;
  image?: string;
};

const AddToCart = ({
  id,
  name,
  priceAtPurchase,
  variant,
  warranty,
  image,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  // Initialize product variant when component mounts or variant changes
  useEffect(() => {
    dispatch(initializeProductVariant({ productId: id, variants: variant }));
  }, [dispatch, id, variant]);

  // Get all state from Redux with proper typing
  // const variantState = useSelector((state: RootState) =>
  //   selectProductVariant(state, id),
  // );
  const selectedColor = useSelector((state: RootState) =>
    selectSelectedColor(state, id),
  );
  const selectedSize = useSelector((state: RootState) =>
    selectSelectedSize(state, id),
  );
  const quantity = useSelector((state: RootState) =>
    selectProductQuantity(state, id),
  );
  const availableStock = useSelector((state: RootState) =>
    selectAvailableStock(state, id, variant),
  );
  const isOutOfStock = useSelector((state: RootState) =>
    selectIsOutOfStock(state, id, variant),
  );
  const maxQuantity = useSelector((state: RootState) =>
    selectMaxQuantity(state, id, variant),
  );

  // Check if any stock exists in all variants
  const hasAnyStock = variant.some((color) =>
    color.sizes.some((size) => size.stock > 0),
  );

  const handleAddToCart = () => {
    if (isOutOfStock || !selectedColor || !selectedSize) return;

    dispatch(
      addSelectedToCart({
        productId: id,
        name,
        priceAtPurchase,
        image,
        warranty: {
          type: warranty?.type ?? "none",
          period: warranty?.period,
          unit: warranty?.unit,
        },
        variants: variant,
      }),
    );
  };

  // If no stock at all, show simplified out of stock UI
  if (!hasAnyStock) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
        <p className="text-destructive font-medium">Out of Stock</p>
        <p className="text-sm text-muted-foreground mt-1">
          This product is currently unavailable
        </p>
      </div>
    );
  }

  // If no color is selected (shouldn't happen, but just in case)
  if (!selectedColor) {
    return null;
  }

  return (
    <div>
      <div className="space-y-3">
        {/* ================= COLOR ================= */}
        <div>
          <label className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
            Color:
            <span className="text-muted-foreground font-normal">
              {selectedColor.colorName}
            </span>
            {/* Selected color preview */}
            <span
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: selectedColor.colorCode }}
            />
          </label>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {variant.map((color) => {
              const hasStock = color.sizes.some((s) => s.stock > 0);
              const isSelected = selectedColor.colorName === color.colorName;

              return (
                <button
                  key={color.colorName}
                  onClick={() =>
                    dispatch(
                      changeColor({ productId: id, color, variants: variant }),
                    )
                  }
                  disabled={!hasStock}
                  title={color.colorName}
                  className={`
            relative w-5 h-5 rounded-full border-2 transition-all
            flex items-center justify-center
            ${
              isSelected
                ? "border-primary scale-110 ring-2 ring-primary/30"
                : "border-border hover:scale-105"
            }
            ${!hasStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
          `}
                  style={{
                    backgroundColor: color.colorCode,
                  }}
                >
                  {/* ❌ cross if out of stock */}
                  {!hasStock && (
                    <span className="absolute text-xs text-black">✕</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= SIZE ================= */}
        {selectedColor.sizes.length > 0 && (
          <div>
            <label className="text-sm font-semibold mb-3 block text-foreground">
              Size:{" "}
              <span className="text-muted-foreground font-normal">
                {selectedSize}
              </span>
            </label>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {selectedColor.sizes.map((sizeObj) => (
                <button
                  key={sizeObj.size}
                  onClick={() =>
                    dispatch(changeSize({ productId: id, size: sizeObj.size }))
                  }
                  disabled={sizeObj.stock === 0}
                  className={`
                    min-w-[50px] px-1.5 py-0.5 p2-text border rounded-lg transition-all
                    ${
                      selectedSize === sizeObj.size
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:bg-accent/50"
                    }
                    ${
                      sizeObj.stock === 0
                        ? "opacity-40 cursor-not-allowed line-through"
                        : "cursor-pointer"
                    }
                  `}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= STOCK INFO ================= */}
        <div className="p-text">
          {availableStock > 0 ? (
            <span className="p-text text-green-600 dark:text-green-400">
              ✓ {availableStock} available in {selectedSize}
            </span>
          ) : (
            <span className="text-destructive">Out of Stock</span>
          )}
        </div>
      </div>

      {/* ================= QUANTITY & ADD TO CART ================= */}
      <div className="flex gap-2 mt-2">
        {!isOutOfStock && (
          <div className="flex items-center border-2 border-input rounded-lg justify-between bg-background">
            <button
              onClick={() => dispatch(decreaseQuantity({ productId: id }))}
              disabled={quantity === 1}
              className="cursor-pointer p-2 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="font-bold text-base w-8 text-center">
              {quantity}
            </span>

            <button
              onClick={() =>
                dispatch(increaseQuantity({ productId: id, variants: variant }))
              }
              disabled={quantity >= maxQuantity}
              className="cursor-pointer p-2 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={` hover:cursor-pointer
            flex-1 h-10 font-bold shadow-lg hover:shadow-xl 
            hover:-translate-y-0.5 transition-all rounded-lg px-2 
            flex items-center justify-center gap-2
            ${
              isOutOfStock
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
          `}
          aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
