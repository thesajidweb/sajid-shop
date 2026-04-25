"use client";

import { Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

interface QuantityControlProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  isLoading?: boolean;
  disabled?: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
  incrementProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  decrementProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export function QuantityControl({
  value,
  onChange,
  min = 1,
  max,
  isLoading = false,
  disabled = false,
  size = "default",
  className,
  incrementProps,
  decrementProps,
}: QuantityControlProps) {
  const isMin = value <= min;
  const isMax = typeof max === "number" && value >= max;
  const isBlocked = isLoading || disabled;

  const update = (type: "inc" | "dec") => {
    if (isBlocked) return;
    if (type === "dec" && !isMin) onChange(value - 1);
    if (type === "inc" && !isMax) onChange(value + 1);
  };

  const sizeMap = {
    default: { btn: "h-9 w-9", text: "text-sm", icon: "h-4 w-4" },
    sm: { btn: "h-8 w-8", text: "text-xs", icon: "h-3 w-3" },
    lg: { btn: "h-10 w-10", text: "text-base", icon: "h-5 w-5" },
  };

  const current = sizeMap[size];

  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-lg border",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => update("dec")}
        disabled={isMin || isBlocked}
        className={cn(
          "rounded-none border-r",
          current.btn,
          isMin && "text-muted-foreground",
        )}
        {...decrementProps}
      >
        <Minus className={current.icon} />
      </Button>

      <div className={cn("w-12 text-center font-medium", current.text)}>
        {isLoading ? (
          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
        ) : (
          value
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => update("inc")}
        disabled={isMax || isBlocked}
        className={cn(
          "rounded-none border-l",
          current.btn,
          isMax && "text-muted-foreground",
        )}
        {...incrementProps}
      >
        <Plus className={current.icon} />
      </Button>
    </div>
  );
}
