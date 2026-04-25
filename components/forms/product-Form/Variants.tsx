// components/Variants.tsx
"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VariantField from "./VariantField";
import { ProductType } from "@/lib/types/ProductType";

const Variants: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProductType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <Card className="w-full px-1">
      <CardHeader className="flex justify-between items-center ">
        <CardTitle>Variants</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              colorName: "",
              colorCode: "#000000",
              sizes: [{ size: "", stock: 0 }],
            })
          }
        >
          + Add Variant
        </Button>
      </CardHeader>

      <CardContent className="space-y-2  md:space-y-4 p-1">
        {fields.map((field, index) => (
          <VariantField
            key={field.id}
            control={control}
            index={index}
            remove={remove}
          />
        ))}

        {errors.variants && !Array.isArray(errors.variants) && (
          <p className="text-sm text-destructive font-bold">
            {errors.variants.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Variants;
