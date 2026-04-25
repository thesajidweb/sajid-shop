"use client";
import { useAppDispatch } from "@/redux/store";

import React, { useState } from "react";
import { useForm, FormProvider, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, ProductType } from "@/lib/types/ProductType";

import { ProgressOverlay } from "./ProgressOverlay";
import { BasicInfo } from "./BasicInfo";
import { MediaGallery } from "./MediaGallery";

import { PricingEngine } from "./PricingEngine";
import { ListingStatus } from "./ListingStatus";
import { ServiceWarranty } from "./ServiceWarranty";
import { uploadToImageKit } from "@/lib/imagekit/imagekit";
import { CampaignOffers } from "./CampaignOffers";
import { createProductThunk } from "@/redux/features/productSlice";

// Import Lucide icons
import {
  Package,
  AlertCircle,
  Check,
  ArrowLeft,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import Variants from "./Variants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: Partial<ProductType>;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMeta, setUploadMeta] = useState({
    current: 0,
    total: 0,
    percentage: 0,
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const isEditMode = !!initialData;

  // console.log(initialData);

  const prepareInitialValues = (): Partial<ProductType> => {
    if (!initialData)
      return {
        status: "draft",
        isFeatured: false,
        gallery: [],
        variants: [
          {
            colorName: "",
            colorCode: "#000000",
            sizes: [{ size: "", stock: 0 }],
          },
        ],
        warranty: { type: "none" },
        discount: {
          type: "none",
          value: 0,
        },
      };

    return {
      ...initialData,
      gallery: (initialData.gallery || []).map(
        (img) =>
          ({
            ...img,
            // Make sure existing images don't have file property
            file: undefined,
          }) as ProductType["gallery"][0],
      ),
    };
  };

  const methods = useForm<ProductType>({
    resolver: zodResolver(ProductSchema) as any,
    defaultValues: prepareInitialValues() as ProductType,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitted, isValid },
  } = methods;

  const getErrorMessages = (
    errs: FieldErrors<ProductType>,
    prefix = "",
  ): string[] => {
    let messages: string[] = [];
    for (const key in errs) {
      const error = (errs as any)[key];
      const fieldPath = prefix ? `${prefix}.${key}` : key;

      if (error?.message) {
        messages.push(`${fieldPath}: ${error.message}`);
      } else if (typeof error === "object" && error !== null) {
        if (Array.isArray(error)) {
          error.forEach((item, index) => {
            if (item) {
              messages = messages.concat(
                getErrorMessages(item, `${fieldPath}[${index}]`),
              );
            }
          });
        } else {
          messages = messages.concat(getErrorMessages(error, fieldPath));
        }
      }
    }
    return Array.from(new Set(messages));
  };

  const scrollToFirstError = () => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstKey = errorKeys[0];
      const targetId = `field-container-${firstKey.replace(/\./g, "-")}`;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const onSubmit = async (data: ProductType) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setUploadMeta({ current: 0, total: 0, percentage: 0 });

    try {
      // todo : upload images to imagekit if have
      const gallery = [...data.gallery];
      const newImages = gallery.filter((i) => i.file);
      const finalGallery: { url: string; fileId: string }[] = [];

      setUploadMeta({
        current: 0,
        total: newImages.length,
        percentage: 0,
      });

      // First, add all existing images to final gallery
      for (const item of gallery) {
        if (item.url && item.fileId) {
          finalGallery.push({
            url: item.url,
            fileId: item.fileId,
          });
        }
      }

      // Then, upload new images
      for (let i = 0; i < newImages.length; i++) {
        const item = newImages[i];
        if (item.file) {
          try {
            setUploadMeta((prev) => ({
              ...prev,
              current: i + 1,
            }));

            // Calculate progress for this file
            const result = await uploadToImageKit(
              item.file,
              {
                folder: "/products",
                fileName: item.file.name,
                tags: ["admin", isEditMode ? "edit" : "create"],
              },
              (progress) => {
                const fileProgress = Math.round(progress);
                const totalUploaded = i; // already uploaded files count
                const totalPercentage = Math.round(
                  ((totalUploaded + fileProgress / 100) / newImages.length) *
                    100,
                );
                setUploadMeta((prev) => ({
                  ...prev,
                  percentage: totalPercentage,
                }));
              },
            );

            finalGallery.push({
              url: result.url,
              fileId: result.fileId,
            });
          } catch (uploadErr) {
            throw new Error(
              `Upload failed for "${item.file.name}". Please check your connection. ${uploadErr}`,
            );
          }
        }
      }

      const validGallery: { url?: string; fileId?: string; file?: File }[] =
        finalGallery.length > 0 ? finalGallery : (initialData?.gallery ?? []);
      // Prepare final payload
      const payload = {
        ...data,
        gallery: validGallery,
        price: Number(data.price),
        cost: Number(data.cost),
        shippingWeight: data.shippingWeight
          ? Number(data.shippingWeight)
          : undefined,
        // Convert variants if needed
        variants: data.variants?.map((variant) => ({
          ...variant,
          sizes: variant.sizes?.map((size) => ({
            ...size,
            stock: Number(size.stock) || 0,
          })),
        })),
      };

      // console.log("[ADMIN] Submitting product:", payload);

      // Dispatch to Redux thunk
      const result = await dispatch(
        createProductThunk({
          product: payload,
          isEditing: isEditMode,
        }),
      ).unwrap();
      if (!result) {
        toast.error("Failed to create product");
      }
      if (result) {
        toast.success(
          `Product ${isEditMode ? "updated" : "created"} successfully.`,
        );
        router.push("/dashboard/products");
      }
      // Show success message
      setSubmitStatus({
        type: "success",
        message: `Product ${isEditMode ? "updated" : "created"} successfully.`,
      });
    } catch (err: unknown) {
      console.error("[ADMIN] Submission error:", err);
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setSubmitStatus({
        type: "error",
        message: `Submission failed: ${message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorMessages = getErrorMessages(errors);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, scrollToFirstError)}
        className="max-w-6xl mx-auto px-1 md:px-4 lg:px-8 py-10 pb-32"
        noValidate
      >
        <ProgressOverlay
          isVisible={isSubmitting && uploadMeta.total > 0}
          total={uploadMeta.total}
          current={uploadMeta.current}
          percentage={uploadMeta.percentage}
        />

        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT CONTENT */}
          <div className="space-y-2 md:space-y-3 px-2">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-primary font-extrabold uppercase text-xs tracking-widest">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                <Package className="h-3.5 w-3.5" />
              </div>
              <span>Inventory Registry</span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-base sm:text-lg font-medium text-muted-foreground">
              {isEditMode
                ? "Update product details, pricing, and media assets."
                : "Add a new product to your catalog and make it live."}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div
            className="
    fixed inset-x-0 bottom-0 z-50 p-4
    flex gap-3 justify-between

    md:justify-end
  "
          >
            {/* Inner wrapper for responsive layout */}
            <div
              className="
    w-full grid grid-cols-2 gap-3
    md:w-auto md:flex md:gap-3
  "
            >
              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => window.history.back()}
                disabled={isSubmitting}
                className="
        inline-flex items-center justify-center gap-2
        rounded-md border border-border
        bg-background px-5 py-2.5
        text-sm font-semibold text-foreground
        shadow-sm transition-all
        hover:bg-muted
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
      "
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
        inline-flex items-center justify-center gap-2
        rounded-md bg-primary px-6 py-2.5
        text-sm font-black uppercase tracking-widest
        text-primary-foreground
        shadow-lg shadow-primary/20
        transition-all hover:opacity-90
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
      "
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : isEditMode ? (
                  "Update"
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {isSubmitted && !isValid && errorMessages.length > 0 && (
          <div
            className="mb-10 p-5 bg-destructive/10 border border-destructive/20 rounded-lg animate-in slide-in-from-top-4 duration-500 shadow-sm"
            role="alert"
          >
            <div className="flex items-center gap-3 text-destructive font-black mb-3 uppercase text-xs tracking-widest">
              <div className="bg-destructive text-destructive-foreground p-1 rounded-full">
                <AlertCircle className="w-4 h-4" />
              </div>
              <span>Validation Errors</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
              {errorMessages.map((msg, i) => (
                <li
                  key={i}
                  className="text-sm text-destructive font-semibold flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive/40 shrink-0" />
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {submitStatus && (
          <div
            className={`mb-10 p-5 rounded-lg font-bold flex items-center gap-4 border animate-in slide-in-from-top-2 ${
              submitStatus.type === "success"
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                submitStatus.type === "success"
                  ? "bg-primary text-primary-foreground"
                  : "bg-destructive text-destructive-foreground"
              }`}
            >
              {submitStatus.type === "success" ? (
                <Check className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest font-black">
                {submitStatus.type === "success" ? "Success" : "Error"}
              </p>
              <p className="text-base font-medium opacity-90">
                {submitStatus.message}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            <BasicInfo />
            <MediaGallery />
            <Variants />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <ListingStatus />
            <PricingEngine />
            <CampaignOffers />
            <ServiceWarranty />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
