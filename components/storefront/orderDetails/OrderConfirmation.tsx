"use client";

import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";

import { Truck, MapPin, CreditCard, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { OrderType } from "@/lib/types/order";
import HeaderToConfirm from "./HeaderToConfirm";
import Image from "next/image";
import { estimatedDeliveryDate } from "@/lib/utils/estimatedDeliveryDate";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { getShippingMethodDisplay } from "@/lib/utils/getShippingMethodDisplay";
import { getPaymentMethodDisplay } from "@/lib/utils/getPaymentMethodDisplay";
import { formatTheDate } from "@/lib/utils/formatTheDate";

// Props interface for the component
interface OrderConfirmationPageProps {
  orderData?: OrderType;
  header?: boolean;
}

export default function OrderConfirmationPage({
  orderData,
  header = false,
}: OrderConfirmationPageProps) {
  const [emailForTracking, setEmailForTracking] = useState("");
  const captureRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    if (!orderData?.editableUntil) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const expiry = new Date(orderData.editableUntil).getTime();
      const diff = Math.max(Math.floor((expiry - now) / 1000), 0);
      setCountdown(diff);
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [orderData?.editableUntil]);

  const handleEmailTracking = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Tracking information sent to ${emailForTracking}`);
    setEmailForTracking("");
  };

  const handleDownloadImage = async () => {
    if (!captureRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(captureRef.current, {
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `order-${orderData?._id || "receipt"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Image download failed:", error);
    }
  };

  // Loading state
  if (!orderData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-muted animate-pulse mb-6" />
          <div className="h-8 w-64 bg-muted animate-pulse mx-auto mb-3" />
          <div className="h-4 w-96 bg-muted animate-pulse mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background">
      <section
        ref={captureRef}
        className="w-full px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8"
      >
        {/* Success Header - Using HeaderToConfirm component */}
        {!header && (
          <HeaderToConfirm
            confirmation={orderData}
            countdown={countdown}
            handleDownloadImage={handleDownloadImage}
          />
        )}

        {/* Main Content */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-2xl space-y-3 sm:space-y-4 px-0 sm:px-2">
            {/* Order Summary Card */}
            <Card className="flex flex-col gap-1 overflow-hidden">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                {/* Items */}
                <div className="space-y-3 sm:space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex gap-3 sm:gap-4">
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        <div className="w-full h-full flex items-center justify-center text-xs">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name || "Product Image"}
                              width={100}
                              height={100}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base wrap-break-word">
                          {item.name}
                        </div>
                        <div className="text-muted-foreground text-xs sm:text-sm mt-1 wrap-break-word">
                          {item.color && `${item.color} • `}
                          {item.size && `${item.size} • `}
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(orderData.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {getShippingMethodDisplay(orderData.shippingMethod)}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(orderData.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">{orderData.tax}</span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold text-sm sm:text-base">
                    Total
                  </span>
                  <span className="text-xl sm:text-2xl font-bold">
                    {formatCurrency(orderData.total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card className="flex flex-col gap-0.5 overflow-hidden">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 pt-0">
                {/* Estimated Delivery */}
                <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Estimated Delivery
                  </p>
                  <p className="text-base sm:text-lg font-semibold wrap-break-word">
                    {formatTheDate(
                      estimatedDeliveryDate(
                        orderData.createdAt.toLocaleString(),
                        orderData.shippingMethod,
                      ),
                    )}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    Shipping Method:{" "}
                    <span className="font-medium border rounded-2xl text-chart-2 px-2 py-0.5 inline-block mt-1 sm:mt-0">
                      {getShippingMethodDisplay(orderData.shippingMethod)}
                    </span>
                  </p>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-sm sm:text-base font-medium mb-2 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    Shipping Address
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed wrap-break-word">
                    {orderData.shippingAddress.fullName}
                    <br />
                    {orderData.shippingAddress.phone && (
                      <>
                        {orderData.shippingAddress.phone}
                        <br />
                      </>
                    )}
                    {orderData.shippingAddress.address}
                    <br />
                    {orderData.shippingAddress.city},{" "}
                    {orderData.shippingAddress.province}
                    {orderData.shippingAddress.zipCode &&
                      ` ${orderData.shippingAddress.zipCode}`}
                    <br />
                    {orderData.shippingAddress.country}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="flex flex-col gap-0.5 overflow-hidden">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="text-sm sm:text-base">
                    <p className="font-medium">
                      {getPaymentMethodDisplay(orderData.paymentMethod)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                      Payment Status:
                      <span className="font-medium text-chart-2 border rounded-2xl px-2 py-0.5 ml-2 inline-block">
                        {orderData.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Confirmation */}
            <Card className="print:hidden overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base mb-1">
                      Confirmation Email Sent
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                      We&apos;ve sent a confirmation email to your registered
                      email
                    </p>
                    <form
                      onSubmit={handleEmailTracking}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <Input
                        type="email"
                        placeholder="Enter email to track order"
                        value={emailForTracking}
                        onChange={(e) => setEmailForTracking(e.target.value)}
                        className="flex-1 w-full sm:max-w-xs"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Send
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground print:mt-4 px-4">
          <p className="wrap-break-word">
            A confirmation email has been sent to your registered email. Please
            keep this information for your records.
          </p>
        </div>
      </section>
    </div>
  );
}
