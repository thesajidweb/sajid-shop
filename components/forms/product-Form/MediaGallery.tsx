"use client";

import { ProductType } from "@/lib/types/ProductType";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { DeleteServerImages } from "@/lib/imagekit/deleteImage";

type LocalPreviewMap = Record<string, string>;

export const MediaGallery: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProductType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "gallery",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔹 UI only: local previews
  const [localPreviews, setLocalPreviews] = useState<LocalPreviewMap>({});

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 10 - fields.length;

    files.slice(0, remaining).forEach((file) => {
      const tempId = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);

      // UI preview save
      setLocalPreviews((prev) => ({
        ...prev,
        [tempId]: previewUrl,
      }));

      //  form state → ONLY what schema expects
      append({
        fileId: tempId, // temporary id, backend replace
        url: undefined,
        file: file,
      });
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = async (index: number) => {
    const image = fields[index];

    // existing image → server delete
    if (image.fileId && image.url) {
      await DeleteServerImages([image.fileId]);
    }

    // cleanup local preview
    if (image.fileId) {
      setLocalPreviews((prev) => {
        const copy = { ...prev };
        delete copy[image.fileId!];
        return copy;
      });
    }

    remove(index);
  };

  return (
    <section className="bg-card p-2 md:p-6 rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          Media Assets
        </h2>

        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={fields.length >= 10}
          className="gap-2 font-bold"
        >
          <Plus className="w-4 h-4" />
          Select Images ({fields.length}/10)
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Gallery Grid */}
      <div
        className="grid gap-4 
             grid-cols-2 
             sm:grid-cols-3 
             md:grid-cols-3 
             lg:grid-cols-3
             xl:grid-cols-3"
      >
        {fields.map((field, index) => {
          const preview =
            field.url || (field.fileId && localPreviews[field.fileId]);

          return (
            <div
              key={field.id}
              className="group relative w-full aspect-square overflow-hidden rounded-xl border border-gray-200 bg-muted/10 shadow-sm"
            >
              {/* Image */}
              {preview && (
                <Image
                  src={preview}
                  alt="Product image"
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              )}

              {/* Badge */}
              <div className="absolute top-2 left-2">
                <Badge
                  variant={field.url ? "secondary" : "default"}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded"
                >
                  {field.url ? "SAVED" : "LOCAL"}
                </Badge>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-destructive p-1 opacity-0 group-hover:opacity-100 transition duration-200  hover:bg-destructive/50"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          );
        })}

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="col-span-full py-16 border-2 border-dashed rounded-xl text-center text-muted-foreground bg-muted/5">
            <p className="font-bold text-sm text-gray-700">
              No images selected
            </p>
            <p className="text-xs mt-2 text-gray-500">Upload up to 10 images</p>
          </div>
        )}
      </div>

      {errors.gallery && (
        <p className="mt-4 text-xs font-bold text-destructive">
          {String(errors.gallery.message)}
        </p>
      )}
    </section>
  );
};
