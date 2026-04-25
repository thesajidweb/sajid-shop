"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Star } from "lucide-react";

import { ProductType } from "@/lib/types/ProductType";
import { STATUS_OPTIONS } from "@/lib/constants/constants";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/FormElements";

/* ============================================================================
   ListingStatus
   ----------------------------------------------------------------------------
   Controls product publishing status and featured flag
============================================================================ */

export const ListingStatus: React.FC = () => {
  const { watch, setValue } = useFormContext<ProductType>();

  const isFeatured = watch("isFeatured");

  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
      {/* Section Title */}
      <h3 className="mb-6 text-xs font-black uppercase tracking-widest text-muted-foreground">
        Listing Control
      </h3>

      <div className="space-y-6">
        {/* =============================
            Publishing Status (Select)
        ============================== */}
        <FormField label="Publishing Status" name="status" required>
          <Select
            value={watch("status")}
            onValueChange={(value) =>
              setValue("status", value as ProductType["status"], {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* =============================
            Featured Toggle
        ============================== */}
        <div
          className="
            flex items-center justify-between
            rounded-md border border-border
            bg-muted/40 p-4
            cursor-pointer
            transition-colors
            hover:bg-muted/60
          "
          onClick={() =>
            setValue("isFeatured", !isFeatured, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        >
          <div className="flex items-center gap-2">
            <Star
              className={`h-4 w-4 ${
                isFeatured ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <label className="cursor-pointer text-xs font-bold text-foreground/80">
              Featured Listing
            </label>
          </div>

          <input
            type="checkbox"
            checked={!!isFeatured}
            onChange={() =>
              setValue("isFeatured", !isFeatured, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            className="h-5 w-5 cursor-pointer accent-primary"
          />
        </div>
      </div>
    </section>
  );
};
