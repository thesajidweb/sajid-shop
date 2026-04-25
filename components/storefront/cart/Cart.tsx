"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ArrowRight, Shield, Truck, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { RootState, useAppDispatch } from "@/redux/store";
import {
  clearCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/redux/features/cartSlice";
import { calculateCartTotals } from "@/lib/utils/cartTotalsCalculation";
import { cn } from "@/lib/utils/utils";

import { CartSummary } from "./CartSummary";
import EmptyState from "@/app/cart/EmptyState";
import CartSkeleton from "@/app/cart/CartSkeleton";
import { CartItemCard } from "./CartItemCard";

interface CartPageProps {
  emptyCartMessage?: string;
  className?: string;
}

const Cart = ({ className }: CartPageProps) => {
  const showTrustBadges = true;
  const continueShoppingLink = "/products";

  const dispatch = useAppDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const totals = calculateCartTotals(
    cartItems.map((item) => ({
      price: item.priceAtPurchase,
      quantity: item.quantity,
    })),
  );

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return handleRemoveItem(id);

    setUpdatingId(id);

    setTimeout(() => {
      dispatch(updateCartItemQuantity({ id, quantity }));
      setUpdatingId(null);
    }, 250);
  };

  const handleRemoveItem = (id: string) => {
    setRemovingId(id);

    setTimeout(() => {
      dispatch(removeFromCart({ id }));
      setRemovingId(null);
    }, 250);
  };

  const handleClearCart = () => {
    setIsClearing(true);

    setTimeout(() => {
      dispatch(clearCart());
      setIsClearing(false);
    }, 400);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // cleanup timer is component unmount best practices
  }, []);

  if (loading) {
    return <CartSkeleton />;
  }

  if (!cartItems.length) {
    return (
      <EmptyState
        continueShoppingLink={continueShoppingLink}
        freeShippingThreshold={totals.freeShippingThreshold}
        showTrustBadges={showTrustBadges}
      />
    );
  }

  return (
    <section
      className={cn("max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-5", className)}
    >
      <div className="flex flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totals.totalItems} {totals.totalItems === 1 ? "item" : "items"}
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isClearing}
              className="text-red-500 border-red-200 hover:border-red-400 hover:bg-red-50"
            >
              {isClearing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  Clearing
                </span>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </>
              )}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear cart?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All items will be permanently
                removed.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearCart}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-1 md:space-y-2">
          {cartItems.map((item) => {
            const isRemoving = removingId === item.id;
            const isUpdating = updatingId === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  "transition-all duration-200",
                  isRemoving && "opacity-0 translate-x-4",
                  isUpdating && "scale-[0.995]",
                )}
              >
                <CartItemCard
                  {...item}
                  isLoading={isUpdating || isRemoving}
                  onQuantityChange={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  variant="horizontal"
                />
              </div>
            );
          })}

          <Link
            href={continueShoppingLink}
            className="inline-flex items-center text-xs  hover:text-primary group pt-2 "
          >
            <ArrowRight className="h-4 w-4 rotate-180 mr-1 group-hover:-translate-x-1" />
            Continue Shopping
          </Link>
        </div>

        <div className="lg:sticky lg:top-20 h-fit space-y-2 md:space-y-3">
          <CartSummary {...totals} />

          {showTrustBadges && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 border rounded-xl p-3 bg-card">
                <Shield className="h-4 w-4 text-primary" />
                Secure Payment
              </div>
              <div className="flex items-center gap-2 border rounded-xl p-3 bg-card">
                <Truck className="h-4 w-4 text-primary" />
                Free Standard Shipping ₨{totals.freeShippingThreshold}+
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default Cart;
