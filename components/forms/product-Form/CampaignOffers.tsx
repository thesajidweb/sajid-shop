"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Tag } from "lucide-react";

import { ProductType } from "@/lib/types/ProductType";
import { FormField } from "@/components/ui/FormElements";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* =============================================================================
   CampaignOffers
   -----------------------------------------------------------------------------
   - Handles product promotions / discounts
   - Uses React Hook Form context
   - Uses native HTML date inputs (safe & accessible)
   - Stores dates as ISO strings (backend-friendly)
============================================================================= */

type Discount = NonNullable<ProductType["discount"]>;
type DiscountType = Discount["type"];

export const CampaignOffers: React.FC = () => {
  /**
   * Access React Hook Form helpers
   */
  const { watch, setValue } = useFormContext<ProductType>();

  /**
   * Watch discount object
   * RHF will re-render this component when values change
   */
  const discount = watch("discount");

  /**
   * Safe defaults to avoid uncontrolled → controlled warnings
   */
  const discountType = discount?.type ?? "none";
  const discountValue = discount?.value ?? 0;

  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
      {/* ------------------------------------------------------------------
          Section Header
      ------------------------------------------------------------------ */}
      <h3 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
        <Tag className="h-4 w-4" />
        Promotions
      </h3>

      <div className="space-y-6">
        {/* ===============================================================
            Discount Type
            - Controls visibility of discount-related fields
        =============================================================== */}
        <FormField label="Markdown Strategy" name="discount.type">
          <Select
            value={discountType}
            onValueChange={(value) =>
              setValue("discount.type", value as DiscountType, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select pricing strategy" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="none">Standard Pricing</SelectItem>
              <SelectItem value="percentage">Percentage Markdown</SelectItem>
              <SelectItem value="fixed">Fixed Reduction</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {/* ===============================================================
            Discount Value
            - Only shown when discount is active
        =============================================================== */}
        {discountType !== "none" && (
          <FormField label="Reduction Value" name="discount.value">
            <Input
              type="number"
              min={0}
              placeholder={
                discountType === "percentage" ? "e.g. 10 (%)" : "e.g. 500"
              }
              value={discountValue || ""}
              onChange={(e) =>
                setValue("discount.value", Number(e.target.value), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </FormField>
        )}
      </div>
    </section>
  );
};
