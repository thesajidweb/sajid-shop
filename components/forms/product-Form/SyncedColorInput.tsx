"use client";

import React from "react";
import { Control, useController, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ProductType } from "@/lib/types/ProductType";

interface SyncedColorInputProps {
  control: Control<ProductType>;
  name: Path<ProductType>;
}

const SyncedColorInput: React.FC<SyncedColorInputProps> = ({
  control,
  name,
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "#000000",
  });

  const safeValue = typeof field.value === "string" ? field.value : "#000000";

  return (
    <div className="flex gap-2 items-center">
      {/* Color Picker */}
      <input
        type="color"
        value={safeValue}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={() => field.onBlur()} // ✅ FIX
        className="w-12 h-10 rounded-md border border-input cursor-pointer"
      />

      {/* Color Input */}
      <Input
        value={safeValue}
        onChange={(e) => {
          const val = e.target.value;

          if (val === "" || /^#[0-9A-Fa-f]{0,6}$/i.test(val)) {
            field.onChange(val);
          }
        }}
        onBlur={() => field.onBlur()} // ✅ FIX
        placeholder="#000000"
        className="flex-1 font-mono uppercase"
      />
    </div>
  );
};

export default SyncedColorInput;
