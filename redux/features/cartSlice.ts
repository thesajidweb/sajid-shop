import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/utils/utils";
import { toast } from "sonner";

/* ================= TYPES ================= */

export type warranty = {
  type: "none" | "manufacturer" | "seller";
  period?: number | undefined;
  unit?: "day" | "month" | "year" | undefined;
};

export type CartItem = {
  id: string; // productId_color_size
  productId: string;
  name: string;
  colorName: string;
  colorCode: string;
  size: string;
  quantity: number;
  priceAtPurchase: number;
  image?: string;
  warranty?: warranty;
  stock?: number;
};

export type VariantType = {
  colorCode: string;
  colorName: string;
  sizes: {
    size: string;
    stock: number;
  }[];
};

// Product variant selection state (managed inside slice)
export type ProductVariantState = {
  [productId: string]: {
    selectedColor: VariantType | null;
    selectedSize: string;
    quantity: number;
  };
};

export type CartState = {
  items: CartItem[];
  variantSelections: ProductVariantState; // Store variant selection per product
};

/* ================= HELPERS ================= */

// Generate stable unique ID
const generateCartItemId = (
  productId: string,
  colorName: string,
  size: string,
): string => `${productId}_${colorName}_${size}`;

// Check if color has any available sizes
const hasAvailableSizes = (color: VariantType): boolean =>
  color.sizes.some((size) => size.stock > 0);

// Get first available color from variants
const getFirstAvailableColor = (variants: VariantType[]): VariantType | null =>
  variants.find((color) => hasAvailableSizes(color)) ?? variants[0] ?? null;

// Get first available size from a color
const getFirstAvailableSize = (color: VariantType | null): string =>
  color?.sizes.find((s) => s.stock > 0)?.size ?? "";

// Get available stock (product stock - cart quantity)
const getAvailableStock = (
  variants: VariantType[],
  cartItems: CartItem[],
  productId: string,
  colorName: string,
  size: string,
): number => {
  // Find the variant
  const color = variants.find((c) => c.colorName === colorName);
  const sizeObj = color?.sizes.find((s) => s.size === size);
  const productStock = sizeObj?.stock ?? 0;

  // Find how many already in cart
  const cartItemId = generateCartItemId(productId, colorName, size);
  const cartItem = cartItems.find((item) => item.id === cartItemId);
  const cartQuantity = cartItem?.quantity ?? 0;

  return productStock - cartQuantity;
};

/* ================= INITIAL STATE ================= */

const initialState: CartState = {
  items: (loadFromLocalStorage("cart") as CartItem[]) || [],
  variantSelections: {},
};

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ========== INITIALIZE PRODUCT VARIANT ========== */
    // Call this when product page loads
    initializeProductVariant: (
      state,
      action: PayloadAction<{
        productId: string;
        variants: VariantType[];
      }>,
    ) => {
      const { productId, variants } = action.payload;

      // Check if already initialized
      if (state.variantSelections[productId]) {
        return;
      }

      const initialColor = getFirstAvailableColor(variants);
      const initialSize = getFirstAvailableSize(initialColor);

      state.variantSelections[productId] = {
        selectedColor: initialColor,
        selectedSize: initialSize,
        quantity: 1,
      };
    },

    /* ========== CHANGE COLOR ========== */
    changeColor: (
      state,
      action: PayloadAction<{
        productId: string;
        color: VariantType;
        variants: VariantType[];
      }>,
    ) => {
      const { productId, color } = action.payload;
      const productVariant = state.variantSelections[productId];

      if (!productVariant) return;

      // Don't allow if color has no available sizes
      if (!hasAvailableSizes(color)) {
        toast.error("This color has no available sizes!");
        return;
      }

      const firstAvailableSize = getFirstAvailableSize(color);

      productVariant.selectedColor = color;
      productVariant.selectedSize = firstAvailableSize;
      productVariant.quantity = 1;
    },

    /* ========== CHANGE SIZE ========== */
    changeSize: (
      state,
      action: PayloadAction<{
        productId: string;
        size: string;
      }>,
    ) => {
      const { productId, size } = action.payload;
      const productVariant = state.variantSelections[productId];

      if (!productVariant || !productVariant.selectedColor) return;

      const sizeObj = productVariant.selectedColor.sizes.find(
        (s) => s.size === size,
      );

      if (!sizeObj || sizeObj.stock === 0) {
        toast.error("This size is out of stock!");
        return;
      }

      productVariant.selectedSize = size;
      productVariant.quantity = 1;
    },

    /* ========== UPDATE QUANTITY (on product page) ========== */
    updateProductQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        quantity: number;
        variants: VariantType[];
      }>,
    ) => {
      const { productId, quantity, variants } = action.payload;
      const productVariant = state.variantSelections[productId];

      if (!productVariant || !productVariant.selectedColor) return;

      const { selectedColor, selectedSize } = productVariant;

      // Calculate max available stock
      const availableStock = getAvailableStock(
        variants,
        state.items,
        productId,
        selectedColor.colorName,
        selectedSize,
      );

      if (quantity > availableStock) {
        toast.error(`Only ${availableStock} items available in stock!`);
        return;
      }

      if (quantity < 1) {
        productVariant.quantity = 1;
      } else {
        productVariant.quantity = quantity;
      }
    },

    /* ========== INCREASE QUANTITY ========== */
    increaseQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        variants: VariantType[];
      }>,
    ) => {
      const { productId, variants } = action.payload;
      const productVariant = state.variantSelections[productId];

      if (!productVariant || !productVariant.selectedColor) return;

      const { selectedColor, selectedSize, quantity } = productVariant;

      const availableStock = getAvailableStock(
        variants,
        state.items,
        productId,
        selectedColor.colorName,
        selectedSize,
      );

      if (quantity < availableStock) {
        productVariant.quantity = quantity + 1;
      } else {
        toast.error(`Cannot add more than ${availableStock} items!`);
      }
    },

    /* ========== DECREASE QUANTITY ========== */
    decreaseQuantity: (state, action: PayloadAction<{ productId: string }>) => {
      const { productId } = action.payload;
      const productVariant = state.variantSelections[productId];

      if (!productVariant) return;

      if (productVariant.quantity > 1) {
        productVariant.quantity = productVariant.quantity - 1;
      }
    },

    /* ========== ADD TO CART FROM SELECTION ========== */
    addSelectedToCart: (
      state,
      action: PayloadAction<{
        productId: string;
        name: string;
        priceAtPurchase: number;
        image?: string;
        warranty?: warranty;
        variants: VariantType[];
      }>,
    ) => {
      const { productId, name, priceAtPurchase, image, warranty, variants } =
        action.payload;
      const productVariant = state.variantSelections[productId];

      if (!productVariant || !productVariant.selectedColor) {
        toast.error("Please select color and size first!");
        return;
      }

      const { selectedColor, selectedSize, quantity } = productVariant;

      // Get stock info
      const sizeObj = selectedColor.sizes.find((s) => s.size === selectedSize);
      const productStock = sizeObj?.stock ?? 0;

      // Calculate available stock
      const availableStock = getAvailableStock(
        variants,
        state.items,
        productId,
        selectedColor.colorName,
        selectedSize,
      );

      if (quantity > availableStock) {
        toast.error(`Only ${availableStock} items available!`);
        return;
      }

      const id = generateCartItemId(
        productId,
        selectedColor.colorName,
        selectedSize,
      );
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > productStock) {
          toast.error(`Cannot add more than ${productStock} items!`);
          return;
        }
        existingItem.quantity = newQuantity;
        toast.success(`Product quantity updated in cart!`);
      } else {
        const newItem: CartItem = {
          id,
          productId,
          name,
          colorName: selectedColor.colorName,
          colorCode: selectedColor.colorCode,
          size: selectedSize,
          quantity,
          priceAtPurchase,
          image,
          warranty,
          stock: productStock,
        };
        state.items.push(newItem);
        toast.success(`Product added to cart!`);
      }

      // Reset quantity to 1 after adding to cart
      productVariant.quantity = 1;

      saveToLocalStorage("cart", state.items);
    },

    /* ========== REMOVE FROM CART ========== */
    removeFromCart: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      saveToLocalStorage("cart", state.items);
      toast.success(`Product removed from cart!`);
    },

    /* ========== UPDATE CART ITEM QUANTITY ========== */
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);

      if (!item) return;

      const maxStock = item.stock ?? Infinity;

      if (action.payload.quantity > maxStock) {
        toast.error(`Only ${maxStock} items available in stock!`);
        return;
      }

      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== item.id);
        toast.success(`Product removed from cart!`);
      } else {
        item.quantity = action.payload.quantity;
        toast.success(`Quantity updated!`);
      }

      saveToLocalStorage("cart", state.items);
    },

    /* ========== INCREASE CART ITEM QUANTITY ========== */
    increaseCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);

      if (!item) return;

      const maxStock = item.stock ?? Infinity;

      if (item.quantity < maxStock) {
        item.quantity = item.quantity + 1;
        saveToLocalStorage("cart", state.items);
        toast.success(`Quantity increased!`);
      } else {
        toast.error(`Cannot add more than ${maxStock} items!`);
      }
    },

    /* ========== DECREASE CART ITEM QUANTITY ========== */
    decreaseCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity = item.quantity - 1;
        saveToLocalStorage("cart", state.items);
        toast.success(`Quantity decreased!`);
      } else if (item.quantity === 1) {
        state.items = state.items.filter((i) => i.id !== item.id);
        saveToLocalStorage("cart", state.items);
        toast.success(`Product removed from cart!`);
      }
    },

    /* ========== CLEAR CART ========== */
    clearCart: (state) => {
      state.items = [];
      saveToLocalStorage("cart", state.items);
      toast.success(`Cart cleared!`);
    },

    /* ========== CLEAR PRODUCT VARIANT STATE ========== */
    clearProductVariant: (
      state,
      action: PayloadAction<{ productId: string }>,
    ) => {
      delete state.variantSelections[action.payload.productId];
    },
  },
});

/* ================= EXPORTS ================= */

export const {
  initializeProductVariant,
  changeColor,
  changeSize,
  updateProductQuantity,
  increaseQuantity,
  decreaseQuantity,
  addSelectedToCart,
  removeFromCart,
  updateCartItemQuantity,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  clearCart,
  clearProductVariant,
} = cartSlice.actions;

export default cartSlice.reducer;

/* ================= SELECTORS ================= */

// Get all cart items
export const selectCartItems = (state: RootState) => state.cart.items;

// Get cart total quantity
export const selectCartTotalQuantity = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0),
);

// Get cart subtotal
export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce(
    (total, item) => total + item.priceAtPurchase * item.quantity,
    0,
  ),
);

// Get product variant selection state
export const selectProductVariant = (state: RootState, productId: string) =>
  state.cart.variantSelections[productId];

// Get selected color with full details
export const selectSelectedColor = (state: RootState, productId: string) =>
  state.cart.variantSelections[productId]?.selectedColor;

// Get selected size
export const selectSelectedSize = (state: RootState, productId: string) =>
  state.cart.variantSelections[productId]?.selectedSize;

// Get current quantity for product
export const selectProductQuantity = (state: RootState, productId: string) =>
  state.cart.variantSelections[productId]?.quantity ?? 1;

// Get available stock for current selection
export const selectAvailableStock = (
  state: RootState,
  productId: string,
  variants: VariantType[],
): number => {
  const variantState = state.cart.variantSelections[productId];
  if (!variantState || !variantState.selectedColor) return 0;

  return getAvailableStock(
    variants,
    state.cart.items,
    productId,
    variantState.selectedColor.colorName,
    variantState.selectedSize,
  );
};

// Check if current selection is out of stock
export const selectIsOutOfStock = (
  state: RootState,
  productId: string,
  variants: VariantType[],
): boolean => {
  const availableStock = selectAvailableStock(state, productId, variants);
  return availableStock === 0;
};

// Get max selectable quantity
export const selectMaxQuantity = (
  state: RootState,
  productId: string,
  variants: VariantType[],
): number => {
  return selectAvailableStock(state, productId, variants);
};

// Get cart item by ID
export const selectCartItemById = (state: RootState, id: string) =>
  state.cart.items.find((item) => item.id === id);

// Get remaining stock for cart item
export const selectCartItemRemainingStock = (state: RootState, id: string) => {
  const item = state.cart.items.find((i) => i.id === id);
  if (!item || !item.stock) return Infinity;
  return item.stock - item.quantity;
};
