"use client";

import { ProductForm } from "@/components/forms/product-Form/ProductForm";
import ProductFormSkeleton from "@/components/product/Skeleton";
import { getSingleProduct } from "@/lib/actions/product/getSingleProduct";
import { ProductType } from "@/lib/types/ProductType";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditProduct = () => {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<ProductType | null>(null);
  const id = useParams().id;
  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const productRes = await getSingleProduct(id as string, true);
        if (!productRes.success) {
          return null;
        }

        const product: ProductType = productRes.data;

        setInitialData(product);
      } catch (err) {
        console.error("[collectionId_GET]", err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  return (
    <div className="container mx-auto ">
      {loading ? (
        <ProductFormSkeleton />
      ) : (
        <ProductForm initialData={initialData ? initialData : {}} />
      )}
    </div>
  );
};

export default EditProduct;
