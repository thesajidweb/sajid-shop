import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
  total: number;
  shipping: number;
  tax?: number;
  totalItems: number;
  freeShippingThreshold: number;
  shippingProgress: number;
  remainingForFreeShipping: number;
}

export function CartSummary({
  subtotal,
  total,
  shipping,
  tax,
  totalItems,
  freeShippingThreshold,
  shippingProgress,
  remainingForFreeShipping,
}: CartSummaryProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order Summary ({totalItems})</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 md:space-y-3">
        {remainingForFreeShipping > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Free standard shipping over ₨ {freeShippingThreshold}
              </span>
              <span className="font-medium">
                ₨{remainingForFreeShipping.toFixed(2)} more
              </span>
            </div>

            <Progress value={shippingProgress} className="h-2" />
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₨{subtotal.toFixed(2)}</span>
          </div>

          {tax !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>₨{tax.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Standard Shipping</span>
            <span>{shipping === 0 ? "Free" : `₨${shipping.toFixed(2)}`}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>₨{total.toFixed(2)}</span>
          </div>
        </div>

        <Link
          href={"/checkout"}
          className="w-full p-2 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/70 rounded"
        >
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
