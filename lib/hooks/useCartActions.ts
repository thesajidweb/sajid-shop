"use client";

import { useDispatch } from "react-redux";
import {
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "@/redux/features/cartSlice";

export function useCartActions() {
  const dispatch = useDispatch();

  const changeQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      dispatch(removeFromCart({ id }));
    } else {
      dispatch(updateCartItemQuantity({ id, quantity }));
    }
  };

  const removeItem = (id: string) => {
    dispatch(removeFromCart({ id }));
  };

  const clearAll = () => {
    dispatch(clearCart());
  };

  return {
    changeQuantity,
    removeItem,
    clearAll,
  };
}
