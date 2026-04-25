// components/VariantField.tsx
"use client";

import React from "react";
import { useFieldArray, Control, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { ProductType } from "@/lib/types/ProductType";
import SyncedColorInput from "./SyncedColorInput";

interface VariantFieldProps {
  control: Control<ProductType>;
  index: number;
  remove: (index: number) => void;
}

const VariantField: React.FC<VariantFieldProps> = ({
  control,
  index,
  remove,
}) => {
  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: `variants.${index}.sizes`,
  });

  const {
    formState: { errors },
  } = useFormContext<ProductType>();

  const variantErrors = errors.variants?.[index];

  return (
    <div className="border rounded-lg py-2 px-1 md:p-6 mb-4 shadow-sm relative bg-card text-card-foreground">
      {/* Header with Remove Button */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <span className="font-semibold text-sm">Variant {index + 1}</span>
        <Button
          size="sm"
          className="bg-background text-foreground border hover:bg-destructive"
          onClick={() => remove(index)}
        >
          <X size={16} />
        </Button>
      </div>

      {/* Color Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Color Name *</label>
          <Input
            {...control.register(`variants.${index}.colorName` as const, {
              required: true,
            })}
            placeholder="e.g. Space Gray"
          />
          {variantErrors?.colorName && (
            <p className="text-xs text-destructive mt-1">
              {variantErrors.colorName.message || "Color name is required"}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Color Code *</label>
          <SyncedColorInput
            control={control}
            name={`variants.${index}.colorCode`}
          />
          {variantErrors?.colorCode && (
            <p className="text-xs text-destructive mt-1">
              {variantErrors.colorCode.message || "Color code is required"}
            </p>
          )}
        </div>
      </div>

      {/* Sizes & Stock */}
      <div className="rounded-md p-3 border bg-muted/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            Sizes & Inventory
          </span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => appendSize({ size: "", stock: 0 })}
          >
            + Add Size
          </Button>
        </div>

        <div className="space-y-2">
          {sizeFields.map((size, sIndex) => {
            const sizeErrors = variantErrors?.sizes?.[sIndex];
            return (
              <div
                key={size.id}
                className="grid grid-cols-12 gap-2 items-center"
              >
                {/* Size Input */}
                <div className="col-span-6 flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">
                    Size
                  </label>
                  <Input
                    {...control.register(
                      `variants.${index}.sizes.${sIndex}.size` as const,
                      { required: true },
                    )}
                    placeholder="S, M, XL..."
                    className="h-8"
                  />
                  {sizeErrors?.size && (
                    <p className="text-[10px] text-destructive">
                      {sizeErrors.size.message}
                    </p>
                  )}
                </div>

                {/* Stock Input */}
                <div className="col-span-5 flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">
                    Stock
                  </label>
                  <Input
                    type="number"
                    {...control.register(
                      `variants.${index}.sizes.${sIndex}.stock` as const,
                      { valueAsNumber: true, min: 0 },
                    )}
                    placeholder="0"
                    className="h-8"
                  />
                  {sizeErrors?.stock && (
                    <p className="text-[10px] text-destructive">
                      {sizeErrors.stock.message}
                    </p>
                  )}
                </div>

                {/* Remove Size Button */}
                <div className="col-span-1 flex justify-center mt-5 ">
                  <button
                    className="bg-background not-first:border p-1.5 rounded hover:bg-destructive"
                    onClick={() => removeSize(sIndex)}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {sizeFields.length === 0 && (
            <p className="text-xs text-destructive mt-1 text-center">
              Add at least one size.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantField;
