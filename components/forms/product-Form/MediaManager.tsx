"use client";
import React, { useRef } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

export const MediaManager: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "gallery",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryError = errors.gallery;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    const remainingSlots = 10 - fields.length;
    if (remainingSlots <= 0) {
      alert("Maximum 10 images reached.");
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    selectedFiles.forEach((file) => {
      append({
        id: crypto.randomUUID(),
        file: file,
        preview: URL.createObjectURL(file),
        type: "new",
        status: "idle",
        progress: 0,
      });
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6" id="field-container-gallery">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/40 p-5 rounded-lg border border-border">
        <div>
          <label className="text-base font-bold text-foreground">
            Media Assets
          </label>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            {fields.length} / 10 Images Selected
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-md hover:opacity-90 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Upload Media
        </button>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {fields.map((field: any, index) => (
          <div
            key={field.id}
            className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              field.type === "new"
                ? "border-dashed border-primary/40 bg-primary/5"
                : "border-border"
            }`}
          >
            <img
              src={field.type === "existing" ? field.url : field.preview}
              alt="Gallery"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Status Overlays */}
            {field.status === "uploading" && (
              <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${field.progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-foreground font-black mt-2 uppercase tracking-tighter">
                  {field.progress}%
                </span>
              </div>
            )}

            {field.status === "success" && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg scale-110 animate-in zoom-in duration-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Labels */}
            <div className="absolute top-2 left-2 flex gap-1">
              {field.type === "new" && (
                <span className="bg-primary text-primary-foreground text-[8px] px-1.5 py-0.5 rounded-sm font-black uppercase shadow-sm">
                  New
                </span>
              )}
              {field.type === "existing" && (
                <span className="bg-secondary text-secondary-foreground text-[8px] px-1.5 py-0.5 rounded-sm font-black uppercase shadow-sm border border-border">
                  Legacy
                </span>
              )}
            </div>

            {/* Remove Action */}
            <button
              type="button"
              disabled={field.status === "uploading"}
              onClick={() => {
                if (field.type === "new" && field.preview)
                  URL.revokeObjectURL(field.preview);
                remove(index);
              }}
              className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:opacity-90 disabled:opacity-0 translate-y-2 group-hover:translate-y-0"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}

        {fields.length === 0 && (
          <div
            className="col-span-full py-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 mb-4 bg-muted rounded-full flex items-center justify-center border border-border">
              <svg
                className="w-6 h-6 opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-bold text-foreground">
              Click to add product images
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest mt-2 opacity-60">
              Max 10 files • Up to 10MB each
            </p>
          </div>
        )}
      </div>

      {galleryError && (
        <p className="text-sm text-destructive font-bold bg-destructive/10 p-4 rounded-md border border-destructive/20 animate-shake">
          {String(galleryError.message)}
        </p>
      )}
    </div>
  );
};
