import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import {
  AlertCircle,
  ArrowRight,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Link from "next/link";

type props = {
  continueShoppingLink: string;
  showTrustBadges?: boolean;
  freeShippingThreshold: number;
};
const EmptyState = ({
  continueShoppingLink = "/products",
  showTrustBadges = true,
  freeShippingThreshold,
}: props) => {
  const emptyCartMessage = "Your cart is empty";
  return (
    <section className={cn("max-w-3xl mx-auto px-4 py-20 text-center")}>
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <ShoppingCart className="h-9 w-9 text-primary" />
        </div>
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        {emptyCartMessage}
      </h1>

      <p className="mt-3 text-muted-foreground text-sm max-w-md mx-auto">
        Add products to your cart and they will appear here.
      </p>

      <Link href={continueShoppingLink} className="mt-6 inline-block">
        <Button size="lg">
          Continue Shopping
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>

      {showTrustBadges && (
        <div className="mt-16 border-t pt-8 grid sm:grid-cols-3 gap-6 text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Truck className="h-4 w-4" />
            Free shipping over ₨{freeShippingThreshold}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4" />
            Secure checkout
          </div>
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            30-day returns
          </div>
        </div>
      )}
    </section>
  );
};

export default EmptyState;
