"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";

import { ProductType } from "@/lib/types/ProductType";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormElements";

/* ============================================================================
   InventoryVariants
   ----------------------------------------------------------------------------
   Handles product variants (color + sizes) management
   Ensures at least one size per variant with stock >= 1
============================================================================ */

export const InventoryVariants: React.FC = () => {
  const { control, register } = useFormContext<ProductType>();

  // Field array for variants
  const {
    fields: variants,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <section className="rounded-lg border border-border bg-card p-6 md:p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-xl font-bold text-foreground">
          <span className="h-6 w-1.5 rounded-full bg-primary" />
          Configurations
        </h2>

        <button
          type="button"
          onClick={() =>
            append({
              colorName: "",
              colorCode: "#000000",
              sizes: [{ size: "Default", stock: 1 }], // <-- always at least one size with stock 1
            })
          }
          className="flex items-center gap-1 rounded-md border border-border bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground hover:bg-muted transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Variant
        </button>
      </div>

      {/* Variants List */}
      <div className="space-y-6">
        {variants.map((variant, vIndex) => (
          <div
            key={variant.id}
            className="relative rounded-lg border border-border bg-muted/10 p-6"
          >
            {/* Remove Variant */}
            <button
              type="button"
              onClick={() => remove(vIndex)}
              disabled={variants.length === 1} // cannot remove last variant
              className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
            >
              <Trash2 className="h-5 w-5" />
            </button>

            {/* Variant Details */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Color Name */}
              <FormField
                label="Color Name"
                name={`variants.${vIndex}.colorName`}
                required
              >
                <Input
                  {...register(`variants.${vIndex}.colorName`)}
                  placeholder="e.g. Midnight Green"
                />
              </FormField>

              {/* Color Code */}
              <FormField
                label="Color Code"
                name={`variants.${vIndex}.colorCode`}
                required
              >
                <div className="flex gap-2">
                  <input
                    {...register(`variants.${vIndex}.colorCode`)}
                    type="color"
                    className="h-9 w-12 cursor-pointer rounded border border-input bg-background p-1"
                  />
                  <Input
                    {...register(`variants.${vIndex}.colorCode`)}
                    placeholder="#000000"
                  />
                </div>
              </FormField>
            </div>

            {/* Sizes Manager */}
            <SizeSubManager variantIndex={vIndex} />
          </div>
        ))}
      </div>
    </section>
  );
};

/* ============================================================================
   SizeSubManager
   ----------------------------------------------------------------------------
   Handles sizes for a single variant
   Ensures at least one size per variant with stock >= 1
============================================================================ */
const SizeSubManager: React.FC<{ variantIndex: number }> = ({
  variantIndex,
}) => {
  const { control, register } = useFormContext<ProductType>();

  const {
    fields: sizes,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `variants.${variantIndex}.sizes`,
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Size Allocations
        </h4>
        <button
          type="button"
          onClick={() => append({ size: "Default", stock: 1 })} // always at least one size with stock 1
          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Size
        </button>
      </div>

      {/* Sizes List */}
      {sizes.map((size, sIndex) => (
        <div key={size.id} className="grid grid-cols-12 gap-3 items-end">
          {/* Size Name */}
          <div className="col-span-5">
            <Input
              {...register(`variants.${variantIndex}.sizes.${sIndex}.size`)}
              placeholder="Size"
              defaultValue={size.size || "Default"}
            />
          </div>

          {/* Stock */}
          <div className="col-span-5">
            <Input
              {...register(`variants.${variantIndex}.sizes.${sIndex}.stock`)}
              type="number"
              min={1} // cannot be zero
              placeholder="Stock"
              defaultValue={size.stock || 1}
            />
          </div>

          {/* Remove Size */}
          <div className="col-span-2">
            <button
              type="button"
              onClick={() => remove(sIndex)}
              disabled={sizes.length === 1} // cannot remove last size
              className="flex h-9 w-full items-center justify-center rounded bg-destructive/10 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-30"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
