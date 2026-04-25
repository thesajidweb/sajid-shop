"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ShieldCheck } from "lucide-react";

import {
  ProductType,
  WarrantTypes,
  WarrantyUnits,
} from "@/lib/types/ProductType";

import { FormField } from "@/components/ui/FormElements";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* ============================================================================
   ServiceWarranty
   ----------------------------------------------------------------------------
   Handles product warranty / service-level configuration
============================================================================ */

export const ServiceWarranty: React.FC = () => {
  const { control, watch, setValue } = useFormContext<ProductType>();

  // Watch warranty type and unit to conditionally render fields
  const warranty = watch("warranty");
  const { type: warrantyType, unit: warrantyUnit } = warranty || {};

  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
      {/* Section Title */}
      <h3 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
        <ShieldCheck className="h-4 w-4" />
        Service Level
      </h3>

      <div className="space-y-6">
        {/* =============================
            Warranty Type Select
        ============================== */}
        <FormField label="Warranty Type" name="warranty.type">
          <Controller
            name="warranty.type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset other warranty fields when type changes to "none"
                  if (value === "none") {
                    setValue("warranty.period", undefined);
                    setValue("warranty.unit", undefined);
                    setValue("warranty.policy", undefined);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select warranty type" />
                </SelectTrigger>

                <SelectContent>
                  {WarrantTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* =============================
            Conditional Warranty Details
        ============================== */}
        {warrantyType !== "none" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Warranty Period & Unit */}
            <div className="flex gap-4">
              {/* Warranty Unit */}
              <FormField label="Unit" name="warranty.unit">
                <Controller
                  name="warranty.unit"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>

                      <SelectContent>
                        {WarrantyUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              {/* Warranty Period - only show if unit is not "lifetime" */}
              {warrantyUnit && (
                <FormField label="Period" name="warranty.period">
                  <Controller
                    name="warranty.period"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        min={1}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="e.g. 12"
                      />
                    )}
                  />
                </FormField>
              )}
            </div>

            {/* Warranty Policy */}
            <FormField label="Service Policy" name="warranty.policy">
              <Controller
                name="warranty.policy"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Outline coverage details, exclusions, and claim process..."
                    className="min-h-[90px]"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
            </FormField>
          </div>
        )}
      </div>
    </section>
  );
};
