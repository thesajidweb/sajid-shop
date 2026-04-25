import { ProductType } from "../types/ProductType";

/**
 * Calculate final price after discount
 * ✅ Supports percentage & fixed discount
 * ❌ No date validation
 */
export const calculateDiscountPrice = (
  price: number,
  discount?: ProductType["discount"],
): number => {
  if (!price) return 0;

  let finalPrice = price;

  if (discount && discount.type !== "none") {
    // Percentage discount
    if (discount.type === "percentage") {
      finalPrice -= (price * discount.value) / 100;
    }

    // Fixed amount discount
    if (discount.type === "fixed") {
      finalPrice -= discount.value;
    }

    // Prevent negative price
    if (finalPrice < 0) finalPrice = 0;
  }

  return Number(finalPrice.toFixed(2));
};
