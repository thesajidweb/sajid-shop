"use client";
import React from "react";
import { useFormContext } from "react-hook-form";

import { ProductType } from "@/lib/types/ProductType";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormElements";

export const PricingEngine: React.FC = () => {
  const { register, watch } = useFormContext<ProductType>();
  const price = watch("price");
  const cost = watch("cost");

  const margin =
    price && cost
      ? (((Number(price) - Number(cost)) / Number(price)) * 100).toFixed(0)
      : 0;

  return (
    <section className="bg-card p-6 rounded-lg border border-border shadow-sm">
      <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6">
        Financials
      </h3>
      <div className="space-y-6">
        <FormField label="Sale Price (USD)" name="price" required>
          <Input {...register("price")} type="number" step="0.01" />
        </FormField>
        <FormField label="Cost of Goods (USD)" name="cost">
          <Input {...register("cost")} type="number" step="0.01" />
        </FormField>

        <div className="p-5 bg-foreground text-background rounded-md">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
              Est. Profit Margin
            </span>
            <span className="text-2xl font-black italic">{margin}%</span>
          </div>
          <div className="w-full h-1 bg-background/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${Math.max(0, Math.min(100, Number(margin)))}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
