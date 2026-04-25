import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
// Empty State Component
const WishlistEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
        <div className="relative bg-linear-to-br from-primary/5 to-primary/10 p-6 rounded-full">
          <Heart className="w-16 h-16 text-primary/60" strokeWidth={1.5} />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
        Your wishlist is empty
      </h2>

      <p className="text-muted-foreground mb-8 max-w-md">
        Looks like you haven&apos;t added any items to your wishlist yet. Start
        exploring our collection and save your favorite items!
      </p>

      <Link
        href="/products"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded"
      >
        <ShoppingBag className="h-5 w-5" />
        Continue Shopping
      </Link>
    </div>
  );
};

export default WishlistEmptyState;
