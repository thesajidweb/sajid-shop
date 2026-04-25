"use client";

import { useFormContext, Controller } from "react-hook-form";
import { ProductType } from "@/lib/types/ProductType";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/FormElements";
import { Input } from "@/components/ui/input";
import { CategoryType } from "@/lib/types/categoryType";
import { useEffect, useMemo, useState } from "react";
import { getCategories } from "@/lib/actions/category/getCategories";
import { toast } from "sonner";

const EMPTY = "__none__";

const formatLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export const BasicInfo: React.FC = () => {
  const { control, watch, setValue, register } = useFormContext<ProductType>();

  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      if (!res.success) toast.error(res.error);
      if (res.success) {
        setCategories(res.data);
      }
    };

    fetchCategories();
  }, []);

  const selectedCategoryName = watch("category") as string | undefined;

  const selectedCategory = useMemo(
    () => categories.find((c) => c.name === selectedCategoryName),
    [categories, selectedCategoryName],
  );

  const subcategories = selectedCategory?.subcategories ?? [];

  return (
    <section className="bg-card p-2 md:p-6 rounded-lg border border-border shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-primary rounded-full" />
        General Information
      </h2>

      <div className="space-y-2">
        <FormField label="Product Name" name="name" required>
          <Input {...register("name")} />
        </FormField>

        <FormField label="Teaser Description" name="shortDescription" required>
          <Input {...register("shortDescription")} />
        </FormField>

        <FormField label="Detailed Description" name="description">
          <Textarea {...register("description")} />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          {/* CATEGORY */}
          <FormField label="Main Category" name="category">
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? EMPTY}
                  onValueChange={(value) => {
                    if (value === EMPTY) return;
                    field.onChange(value);
                    setValue("subcategory", EMPTY);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={EMPTY} disabled>
                      Select Category
                    </SelectItem>

                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat.name}>
                        {formatLabel(cat.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          {/* SUBCATEGORY */}
          <FormField label="Subcategory" name="subcategory">
            <Controller
              name="subcategory"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? EMPTY}
                  onValueChange={(value) => {
                    if (value === EMPTY) return;
                    field.onChange(value);
                  }}
                  disabled={!selectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subcategory" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={EMPTY} disabled>
                      Select Subcategory
                    </SelectItem>

                    {subcategories.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {formatLabel(sub)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
          <FormField label="Brand" name="brand">
            <Input {...register("brand")} />
          </FormField>
          <FormField label="Shipping Weight (kg)" name="shippingWeight">
            <Input type="number" step="0.01" {...register("shippingWeight")} />
          </FormField>
        </div>
      </div>
    </section>
  );
};
