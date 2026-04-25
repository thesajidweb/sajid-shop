"use client";

import { ShoppingBag, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import {
  CartCalculationItem,
  ShippingMethod,
  CartTotals,
  defaultConfig,
} from "@/lib/utils/cartTotalsCalculation";
import { SHIPPING_DISPLAY } from "@/lib/constants/shipping";

// Types
interface OrderSummaryCompactProps {
  items?: CartCalculationItem[];
  selectedShipping?: ShippingMethod;
  onShippingChange?: (method: ShippingMethod) => void;
  onCheckout?: () => void; // Add checkout handler prop
  totals: CartTotals; // Receive totals from parent
  className?: string;
  showItems?: boolean;
  productNames?: Record<string, string>;
}

const OrderSummary = ({
  items = [],
  selectedShipping = "standard",
  onShippingChange,
  onCheckout,
  totals,
  className,
  showItems = true,
  productNames = {},
}: OrderSummaryCompactProps) => {
  // Get shipping methods from defaultConfig
  const shippingMethods = defaultConfig.shipping?.methods
    ? Object.entries(defaultConfig.shipping.methods).map(([id, price]) => ({
        id: id as ShippingMethod,
        ...SHIPPING_DISPLAY[id as ShippingMethod],
        price,
      }))
    : [];

  const handleShippingChange = (value: string) => {
    const method = value as ShippingMethod;
    onShippingChange?.(method);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 md:space-y-4">
        {/* Shipping Methods */}
        {shippingMethods.length > 0 && (
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-muted-foreground">
              <Truck className="h-3 w-3 md:h-4 md:w-4" />
              <span>Shipping Method</span>
            </div>

            <RadioGroup
              value={selectedShipping}
              onValueChange={handleShippingChange}
              className="flex flex-col sm:flex-row md:flex-wrap gap-2"
            >
              {shippingMethods.map((method) => {
                const qualifiesForFree =
                  totals.subtotal >= totals.freeShippingThreshold;
                const isStandard = method.id === "standard";
                const showFree = qualifiesForFree && isStandard;

                let displayPrice = method.price;
                if (qualifiesForFree) {
                  if (method.id === "express")
                    displayPrice = method.price * 0.7;
                  if (method.id === "premium")
                    displayPrice = method.price * 0.8;
                }

                return (
                  <div key={method.id} className="flex-1 md:min-w-[200px]">
                    <RadioGroupItem
                      value={method.id}
                      id={`ship-${method.id}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`ship-${method.id}`}
                      className="flex items-center justify-between p-2 md:p-3 text-xs md:text-sm rounded border cursor-pointer peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-50 dark:peer-data-[state=checked]:bg-green-950 transition-colors h-full"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <method.icon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <span className="truncate block text-xs md:text-sm font-medium">
                            {method.name}
                          </span>
                          <span className="text-[10px] md:text-xs text-muted-foreground">
                            {method.description}
                          </span>
                        </div>
                      </div>
                      <span className="font-medium shrink-0 ml-2 text-xs md:text-sm">
                        {showFree ? (
                          <Badge className="bg-green-500 text-[9px] md:text-xs h-4 md:h-5 px-1 md:px-2 whitespace-nowrap">
                            Free
                          </Badge>
                        ) : (
                          `Rs. ${displayPrice.toFixed(2)}`
                        )}
                      </span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        )}

        {/* Order Items */}
        {showItems && items.length > 0 && (
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-muted-foreground">
              <ShoppingBag className="h-3 w-3 md:h-4 md:w-4" />
              <span>Items ({items.length})</span>
            </div>
            {items.map((item, index) => {
              const productName =
                productNames[`item-${index}`] || `Product ${index + 1}`;

              return (
                <div
                  key={index}
                  className="flex justify-between text-xs md:text-sm gap-4"
                >
                  <span className="truncate max-w-[180px] sm:max-w-[220px] md:max-w-[280px]">
                    {productName}{" "}
                    <span className="text-muted-foreground">
                      x{item.quantity}
                    </span>
                  </span>
                  <span className="font-medium tabular-nums whitespace-nowrap">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {showItems && items.length > 0 && (
          <Separator className="my-1 md:my-2" />
        )}

        {/* Price Breakdown */}
        <div className="space-y-1 md:space-y-1.5">
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium tabular-nums">
              Rs. {totals.subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span
              className={cn(
                "font-medium tabular-nums",
                totals.shipping === 0 && "text-green-600",
              )}
            >
              {totals.shipping === 0
                ? "Free"
                : `Rs. ${totals.shipping.toFixed(2)}`}
            </span>
          </div>

          {totals.tax > 0 && (
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium tabular-nums">
                Rs. {totals.tax.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Free Shipping Progress */}
        {totals.remainingForFreeShipping > 0 && (
          <div className="bg-muted/50 p-2 md:p-3 rounded-md">
            <div className="flex justify-between text-[10px] md:text-xs mb-1">
              <span className="text-muted-foreground">
                Free shipping over Rs. {totals.freeShippingThreshold}
              </span>
              <span className="font-medium">
                Rs. {totals.remainingForFreeShipping.toFixed(2)} more
              </span>
            </div>
            <div className="h-1 md:h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${totals.shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center text-base md:text-lg lg:text-xl font-bold pt-1 md:pt-2">
          <span>Total</span>
          <span className="tabular-nums text-primary font-bold">
            Rs. {totals.total.toFixed(2)}
          </span>
        </div>

        <Separator className="my-1 md:my-2" />

        {/* Continue to Payment Button */}
        <Button
          onClick={onCheckout}
          className="w-full h-8 md:h-10 text-xs md:text-sm mt-2 md:mt-3"
        >
          Continue to Payment · Rs. {totals.total.toFixed(2)}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
