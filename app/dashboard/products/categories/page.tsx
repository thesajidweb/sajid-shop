"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import CategoryForm from "@/components/forms/category-Form/CategoryForm";
import { CategoryType } from "@/lib/types/categoryType";
import { toast } from "sonner";
import { getCategories } from "@/lib/actions/category/getCategories";

import LoadingSkeleton from "./loading";
import { Pen, Trash } from "lucide-react";

const CategoryList = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingData, setEditingData] = useState<CategoryType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const res = await getCategories();
    if (!res.success) toast.error(res.error);
    if (res.success) {
      setCategories(res.data);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshKey]);

  const handleEdit = (id?: string) => {
    const category = categories.find((c) => c._id === id);
    if (category) {
      setEditingData(category);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Category deleted");
      setEditingData(null);
      setRefreshKey((p) => p + 1);
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!categories.length) {
    return <p className="text-muted-foreground">No categories found.</p>;
  }

  return (
    <div className="space-y-6 px-2 mt-4">
      <CategoryForm
        initialData={editingData}
        onSuccess={() => {
          setEditingData(null);
          setRefreshKey((p) => p + 1);
        }}
        onCancel={() => setEditingData(null)}
      />

      <h3 className="text-xl font-semibold ml-2">Existing Categories</h3>

      {categories.map((cat) => (
        <div key={cat._id} className="rounded-lg border p-4 space-y-2">
          <div className="flex gap-2 justify-between">
            <p className="font-medium capitalize">{cat.name}</p>
            <div className="flex gap-2">
              <Button
                className=" cursor-pointer hover:bg-primary/30 "
                size="sm"
                onClick={() => handleEdit(cat._id)}
              >
                <Pen />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="bg-red-500 hover:bg-red-700">
                    <Trash />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete category?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the category
                      <span className="font-semibold"> {cat.name} </span>
                      and all its subcategories.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {cat.subcategories.map((sub) => (
              <span
                key={sub}
                className="rounded bg-muted px-2 py-1 text-xs capitalize"
              >
                {sub.replaceAll("_", " ")}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
