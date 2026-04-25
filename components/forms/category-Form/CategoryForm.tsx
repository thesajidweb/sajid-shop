"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { categorySchema, CategoryType } from "@/lib/types/categoryType";
import { z } from "zod";

const formSchema = categorySchema.omit({ _id: true });

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData?: CategoryType | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

const CategoryForm = ({
  initialData,
  onSuccess,
  onCancel,
}: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subcategories: [],
    },
  });

  const subcategories = watch("subcategories");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        subcategories: initialData.subcategories,
      });
    } else {
      reset({ name: "", subcategories: [] });
    }
  }, [initialData, reset]);

  const addSubcategory = (value: string) => {
    const cleaned = value
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s && !subcategories.includes(s));

    if (!cleaned.length) {
      toast.warning("Invalid or duplicate subcategory");
      return;
    }

    setValue("subcategories", [...subcategories, ...cleaned]);
  };

  const removeSubcategory = (sub: string) => {
    setValue(
      "subcategories",
      subcategories.filter((s) => s !== sub),
    );
  };
  const handleCancel = () => {
    reset({ name: "", subcategories: [] });
    onCancel?.(); // ✅ exit edit mode
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch(
        initialData ? `/api/categories/${initialData._id}` : "/api/categories",
        {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Request failed");
      }

      toast.success(
        initialData
          ? "Category updated successfully"
          : "Category created successfully",
      );

      reset({ name: "", subcategories: [] });
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 border rounded-lg shadow-sm"
    >
      <h2 className="text-xl font-semibold">
        {initialData ? "Edit Category" : "Create Category"}
      </h2>

      <Input
        placeholder="Category name"
        {...register("name")}
        disabled={isSubmitting}
      />
      {errors.name && (
        <p className="text-sm text-red-500">{errors.name.message}</p>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Add subcategory (comma or Enter)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSubcategory((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = "";
            }
          }}
          disabled={isSubmitting}
        />
        <Button
          type="button"
          className=" cursor-pointer hover:bg-primary/30"
          onClick={(e) => {
            const input = e.currentTarget.previousSibling as HTMLInputElement;
            addSubcategory(input.value);
            input.value = "";
          }}
        >
          Add
        </Button>
      </div>

      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <div
              key={sub}
              className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
            >
              {sub}
              <button
                type="button"
                onClick={() => removeSubcategory(sub)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 cursor-pointer hover:bg-primary/30"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Category"
              : "Save Category"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className=" cursor-pointer  flex-1 "
          onClick={() =>
            reset(
              initialData
                ? {
                    name: initialData.name,
                    subcategories: initialData.subcategories,
                  }
                : { name: "", subcategories: [] },
            )
          }
          disabled={isSubmitting}
        >
          Reset
        </Button>
        {initialData && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 cursor-pointer"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
