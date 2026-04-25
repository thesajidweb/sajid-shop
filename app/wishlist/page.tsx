// components/storefront/wishlist/Wishlist.tsx
"use client";

import ProductCard from "@/components/storefront/products/ProductCard";
import { ProductType } from "@/lib/types/ProductType";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useState, useEffect, useCallback } from "react";
import WishlistSkeleton from "./loading";
import WishlistEmptyState from "./WishlistEmptyState";
import HeaderStyle from "@/components/shared/HeaderStyle";
import { clearWishlist } from "@/redux/features/wishlistSlice";
import { getWishlistProducts } from "@/lib/actions/wishlist/getWishlist";

const Wishlist = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // Handle clear all wishlist items
  const handleClearAll = async () => {
    setIsClearing(true);
    dispatch(clearWishlist());
    setShowConfirm(false);
    setIsClearing(false);
  };

  const loadProducts = useCallback(async () => {
    if (!wishlist.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getWishlistProducts(wishlist);

      if (data.success) {
        setProducts(data.data);
      } else {
        console.error("Error fetching wishlist:", data.error);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [wishlist]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return <WishlistSkeleton />;
  }

  if (products.length === 0) {
    return <WishlistEmptyState />;
  }

  return (
    <div className="mx-auto max-w-[1600px] relative">
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Clear Wishlist?</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to remove all {products.length} items from
              your wishlist? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                disabled={isClearing}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isClearing}
              >
                {isClearing ? "Clearing..." : "Yes, Clear All"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 px-4">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div className="flex-1">
            <HeaderStyle
              label="Wishlist"
              title={`You have ${products.length || 0} item${products.length === 1 ? "" : "s"} in your wishlist`}
              subtitle="Keep track of the products you love. Review, manage, and move items to your cart whenever you're ready to purchase."
            />
          </div>

          {/* Clear All Button */}
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            disabled={isClearing}
          >
            Clear All
          </button>
        </div>
      </div>

      <div
        className="
          grid 
          gap-1 md:gap-2 
          grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
          md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] 
          lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]
          xl:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]
        "
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Bulk Actions Footer */}
      {products.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Total items: {products.length}
            </p>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              disabled={isClearing}
            >
              Clear All Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
