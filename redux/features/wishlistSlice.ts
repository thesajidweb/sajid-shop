// store/features/wishlistSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/utils/utils";

const WISHLIST_KEY = "wishlist";

interface WishlistState {
  items: string[];
}

// ✅ initial state (client-safe check)
const initialState: WishlistState = {
  items:
    typeof window !== "undefined"
      ? (loadFromLocalStorage<string[]>(WISHLIST_KEY) ?? [])
      : [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const exists = state.items.includes(productId);

      if (exists) {
        state.items = state.items.filter((id) => id !== productId);
      } else {
        state.items.push(productId);
      }

      // ✅ persist
      if (typeof window !== "undefined") {
        saveToLocalStorage(WISHLIST_KEY, state.items);
      }
    },

    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload;

      if (typeof window !== "undefined") {
        saveToLocalStorage(WISHLIST_KEY, state.items);
      }
    },

    clearWishlist: (state) => {
      state.items = [];

      if (typeof window !== "undefined") {
        saveToLocalStorage(WISHLIST_KEY, []);
      }
    },
  },
});

export const { toggleWishlist, setWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
