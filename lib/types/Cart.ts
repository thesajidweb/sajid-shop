// types/product.ts
export type Warranty = {
  type: "none" | "manufacturer" | "seller";
  period?: number;
  unit?: "day" | "month" | "year";
  policy?: string;
};

export type VariantSize = {
  size: string;
  stock: number;
};

export type VariantType = {
  colorCode: string;
  colorName: string;
  sizes: VariantSize[];
};

export type CartItem = {
  id: string;
  productId: string;
  colorName: string;
  colorCode: string;
  size: string;
  quantity: number;
  priceAtPurchase: number;
  warranty?: Warranty;
  addedAt?: number; // timestamp for sorting
};

export type AddToCartPayload = Omit<CartItem, "id" | "addedAt"> & {
  variants?: VariantType[];
};
