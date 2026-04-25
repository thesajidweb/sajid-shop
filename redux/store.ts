// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
// lib/store.ts
import { debounce } from "@/lib/utils/debounce";
import { saveToLocalStorage } from "@/lib/utils/utils";
// Reducers
import productReducer from "@/redux/features/productSlice";
import collectionReducer from "@/redux/features/collectionSlice";
import cartReducer from "@/redux/features/cartSlice";
import wishlistReducer from "./features/wishlistSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      products: productReducer,
      collections: collectionReducer,
      cart: cartReducer,

      wishlist: wishlistReducer,
      // Add other reducers here
    },
  });
};

const store = makeStore();
const debouncedSave = debounce(() => {
  const state = store.getState();
  saveToLocalStorage("cart", state.cart.items);
  // saveToLocalStorage("wishlist", state.wishlist.items);
  // saveToLocalStorage("orders", state.orders.history);
  // saveToLocalStorage("auth_user", state.auth.user);
  // saveToLocalStorage("products", state.products.items); // Saving products specifically to persist Reviews
}, 1000);

store.subscribe(() => {
  debouncedSave();
});

// Get the types for TypeScript
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Pre-typed hooks for easy use
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
