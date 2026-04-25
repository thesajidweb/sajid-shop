import { ProductType } from "@/lib/types/ProductType";

// Calculate total stock
export const calculateTotalStock = (
  variants?: ProductType["variants"],
): number => {
  if (!variants || variants.length === 0) return 0;

  return variants.reduce((total, variant) => {
    // return total
    return (
      total +
      variant.sizes.reduce(
        (sizeTotal, size) => sizeTotal + (size.stock ?? 0),
        0,
      )
    );
  }, 0);
};

export const getStockInfo = (variants?: ProductType["variants"]) => {
  const totalStock = calculateTotalStock(variants);

  return {
    totalStock,
    isOutOfStock: totalStock === 0,
    isLowStock: totalStock > 0 && totalStock <= 10,
  };
};
