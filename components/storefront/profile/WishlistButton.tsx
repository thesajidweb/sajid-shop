"use client";

import { toggleWishlist } from "@/redux/features/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useCallback } from "react";
import { toast } from "sonner";

export default function WishlistButton({ productId }: { productId: string }) {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.items);

  const isWishlisted = wishlist.includes(productId);
  const isMaxLimit = wishlist.length == 15 && !isWishlisted;

  const handleToggle = useCallback(() => {
    // Check limit before dispatching
    if (isMaxLimit) {
      toast.error("You can't add more than 15 products to wishlist!");
      return;
    }

    // Dispatch the action
    dispatch(toggleWishlist(productId));

    // Show feedback
    if (isWishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  }, [dispatch, productId, isWishlisted, isMaxLimit]);

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center h-8 w-8 rounded-full shadow-md border border-transparent hover:border-primary/20 transition-colors"
      aria-label="Toggle Wishlist"
      title={isMaxLimit ? "Wishlist limit reached (max 15 items)" : ""}
    >
      {isWishlisted ? "❤️" : "🤍"}
    </button>
  );
}
