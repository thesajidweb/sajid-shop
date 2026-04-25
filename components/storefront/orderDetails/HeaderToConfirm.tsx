"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ShoppingBag, Trash2 } from "lucide-react";

import { OrderType } from "@/lib/types/order";
import { formatTheDate } from "@/lib/utils/formatTheDate";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import ThanksBox from "./ThanksBox";

import { getShippingMethodDisplay } from "@/lib/utils/getShippingMethodDisplay";

interface ConfirmationHeaderProps {
  confirmation: OrderType;
  countdown: number;
  handleDownloadImage: () => void;
}

export default function HeaderToConfirm({
  confirmation,
  countdown,
  handleDownloadImage,
}: ConfirmationHeaderProps) {
  const [loading, setLoading] = useState(false);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getOrderStatusVariant = (status: string) => {
    const map: Record<string, string> = {
      pending: "secondary",
      processing: "default",
      shipped: "info",
      delivered: "success",
      cancelled: "destructive",
    };
    return map[status] || "secondary";
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/orders/${confirmation._id}/cancel`, {
        method: "PATCH",
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success("Order cancelled");
      } else {
        toast.error(data.error);
      }
    } catch {
      setLoading(false);
      toast.error("Cancel failed");
    }
  };

  const handleContinueShopping = () => {
    window.location.href = "/products";
  };

  return (
    <div className="text-center mb-8 px-4">
      {/* Success Box */}
      {countdown > 0 && <ThanksBox />}

      {/* Order Info */}
      <div className="flex flex-wrap justify-center items-center gap-3 mt-5 text-sm">
        <Badge variant="outline">
          Order #{confirmation._id.slice(-8).toUpperCase()}
        </Badge>

        <span className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {formatTheDate(confirmation.createdAt)}
        </span>
        <div className="flex gap-1">
          <p>{getShippingMethodDisplay(confirmation.shippingMethod)}</p>
          <Badge
            variant={getOrderStatusVariant(confirmation.orderStatus) as any}
          >
            {confirmation.orderStatus}
          </Badge>
        </div>
      </div>

      {/* Countdown */}
      {countdown > 0 && (
        <div className="mt-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg inline-flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-yellow-600" />
          <span>Editable for {formatCountdown(countdown)}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3 mt-6 print:hidden">
        {countdown > 0 && (
          <Button
            variant="destructive"
            onClick={handleCancelOrder}
            disabled={loading}
          >
            {loading && <Spinner className="mr-2 h-4 w-4" />}
            <Trash2 className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}

        <Button variant="outline" onClick={handleContinueShopping}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
        <div className="flex justify-center mb-6 print:hidden">
          <Button onClick={handleDownloadImage}>Download Receipt</Button>
        </div>
      </div>
    </div>
  );
}
