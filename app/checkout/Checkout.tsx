"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentForm } from "./PaymentForm";
import { AddressForm } from "./AddressForm";
import OrderSummary from "./OrderSummary";
import { ShippingAddress } from "@/lib/types/shippingAddressType";
import {
  ShippingMethod,
  CartTotals,
  calculateCartTotals,
} from "@/lib/utils/cartTotalsCalculation";
import CheckoutHeader from "./CheckoutHeader";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { clearCart } from "@/redux/features/cartSlice";

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>();
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");
  const [saveAddress, setSaveAddress] = useState(true);
  const [isAddressValid, setIsAddressValid] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useAppDispatch();

  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();
  // Convert cart items to CartCalculationItem format
  const calculationItems = cartItems.map((item) => ({
    price: item.priceAtPurchase,
    quantity: item.quantity,
  }));

  // Map product names for display
  const productNames = cartItems.reduce(
    (acc, item, index) => {
      acc[`item-${index}`] = item.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  // Calculate totals whenever items or shipping method changes
  const totals: CartTotals = calculateCartTotals(
    calculationItems,
    shippingMethod,
  );
  const orderItems = cartItems.map((item) => {
    return {
      productId: item.productId,
      name: item.name,
      color: item.colorName,
      colorCode: item.colorCode,
      size: item.size,
      quantity: item.quantity,
      price: item.priceAtPurchase,
      image: item.image,
    };
  });
  const handleCheckout = () => {
    setCurrentStep(3);
  };

  const handlePlaceOrder = async (paymentMethod: string) => {
    try {
      setIsLoading(true);
      // Handle order placement
      const orderSummary = {
        items: orderItems,
        shippingAddress,
        saveAddress,
        shippingMethod: shippingMethod,
        paymentMethod,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
      };

      const res = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        credentials: "include",
        body: JSON.stringify(orderSummary),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderId(data.orderId);
        setIsLoading(false);
        dispatch(clearCart());
      }
      if (!res.ok) {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      if (error) toast.error("Making orderSummary fail");

      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (currentStep === 1 && isAddressValid) {
      setCurrentStep(2);
    }
  };

  const isContinueDisabled = () => {
    if (currentStep === 1) {
      return !isAddressValid;
    }
    return false;
  };
  if (orderId) {
    router.push(`/orders/${orderId}`);
  }
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <CheckoutHeader
          isAddressValid={isAddressValid}
          currentStep={currentStep}
          handleStep={setCurrentStep}
        />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1">
            <div className="space-y-6">
              {/* Address Step */}
              {currentStep === 1 && (
                <AddressForm
                  initialAddress={shippingAddress}
                  onAddressChange={setShippingAddress}
                  onSaveAddressChange={setSaveAddress}
                  onValidityChange={setIsAddressValid}
                />
              )}

              {/* Shipping Step */}
              {currentStep === 2 && (
                <OrderSummary
                  items={calculationItems}
                  selectedShipping={shippingMethod}
                  onShippingChange={setShippingMethod}
                  productNames={productNames}
                  onCheckout={handleCheckout}
                  totals={totals} // Pass pre-calculated totals
                />
              )}

              {/* Payment Step */}
              {currentStep === 3 && (
                <PaymentForm
                  loading={isLoading}
                  handlePlaceOrder={handlePlaceOrder}
                />
              )}
            </div>

            {/* Navigation Buttons - Only show for steps 1 and 2, not for payment step */}
            {currentStep < 3 && (
              <div className="flex justify-between mt-6 sm:mt-8">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}

                {currentStep === 1 && (
                  <Button
                    className={`ml-auto not-last-of-type:px-6 sm:px-8 py-2 sm:py-2.5 text-sm sm:text-base`}
                    onClick={handleContinue}
                    disabled={isContinueDisabled()}
                  >
                    Continue to Shipping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
