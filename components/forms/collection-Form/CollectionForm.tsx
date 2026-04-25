"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, X, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

// Types & Schemas
import { CollectionSchema, CollectionType } from "@/lib/types/collectionType";

// Services
import { uploadToImageKit } from "@/lib/imagekit/imagekit";
import { DeleteServerImages } from "@/lib/imagekit/deleteImage";

// Components
import DragAndDrop from "../DragAndDrop";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Constants
const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;
type ValidImageType = (typeof VALID_IMAGE_TYPES)[number];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const RECOMMENDED_DIMENSIONS = "1200×675 (16:9)";

interface CollectionFormProps {
  initialData?: CollectionType;
}

/**
 * Form component for creating or editing a collection.
 * Supports image upload via drag-and-drop with validation.
 */
export default function CollectionForm({ initialData }: CollectionFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.image?.url || null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isEditMode = !!initialData;
  const isLoading = isSubmitting || isUploading;

  // Form initialization
  const form = useForm<CollectionType>({
    resolver: zodResolver(CollectionSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      image: { url: "", fileId: "" },
    },
    mode: "onChange",
  });

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // ==================== FILE HANDLERS ====================

  /**
   * Validates and sets a file for upload
   */
  const validateAndSetFile = useCallback(
    (file: File) => {
      // Type validation
      if (!VALID_IMAGE_TYPES.includes(file.type as ValidImageType)) {
        form.setError("image.url", {
          type: "manual",
          message: "Invalid file type. JPG, PNG, WebP, GIF, or SVG only.",
        });
        return false;
      }

      // Size validation
      if (file.size > MAX_FILE_SIZE) {
        form.setError("image.url", {
          type: "manual",
          message: "File too large. Maximum size is 10MB.",
        });
        return false;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setSelectedFile(file);

      // Update form state
      form.clearErrors("image.url");
      form.setValue("image.url", previewUrl, { shouldValidate: true });

      // Clear fileId for new uploads in edit mode
      if (isEditMode) {
        form.setValue("image.fileId", "");
      }

      return true;
    },
    [form, isEditMode],
  );

  /**
   * Handles files selected via drag-and-drop
   */
  const handleFilesSelected = useCallback(
    (files: FileList) => {
      if (files.length > 0) {
        validateAndSetFile(files[0]);
      }
    },
    [validateAndSetFile],
  );

  /**
   * Handles file selection via file input
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndSetFile(file);
  };

  // ==================== IMAGE MANAGEMENT ====================

  /**
   * Removes the selected/uploaded image
   */
  const handleRemoveImage = async () => {
    try {
      // Delete from server if in edit mode and has fileId
      if (initialData?.image?.fileId) {
        await DeleteServerImages([initialData.image.fileId]);

        // Optional: API call to update backend
        await fetch(`/api/image/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileIds: [initialData.image.fileId] }),
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to remove image");
    } finally {
      // Reset UI state
      setPreviewImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Reset form values
      form.setValue("image.url", "", { shouldValidate: true });
      form.setValue("image.fileId", "");
    }
  };

  // ==================== FORM SUBMISSION ====================

  /**
   * Handles form submission
   */
  const handleSubmit = async (formData: CollectionType) => {
    setIsUploading(true);
    setProgress(0);

    try {
      let imageData = formData.image;

      // Upload new image if selected
      if (selectedFile) {
        const uploadResult = await uploadToImageKit(
          selectedFile,
          {
            folder: "/collections",
            tags: ["collection"],
            transformation: {
              width: 1200,
              quality: 85,
              format: "webp",
            },
          },
          setProgress,
        );

        imageData = {
          url: uploadResult.url,
          fileId: uploadResult.fileId,
        };
      }

      // Prepare payload
      const payload: CollectionType = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        image: imageData,
      };

      setIsSubmitting(true);

      // API call
      const endpoint = initialData
        ? `/api/collections/${initialData._id}`
        : "/api/collections";

      const method = initialData ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(
          `Failed to ${initialData ? "update" : "create"} collection`,
        );
      }

      // Success feedback
      toast.success(
        `Collection ${initialData ? "updated" : "created"} successfully!`,
        {
          description: `"${payload.title}" has been saved.`,
        },
      );

      // Redirect and refresh
      router.push("/dashboard/collections");
      router.refresh();

      // Reset form for create mode
      if (!initialData) {
        form.reset();
        setPreviewImage(null);
        setSelectedFile(null);
        setProgress(0);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : `Failed to ${initialData ? "update" : "create"} collection`;

      console.error("Collection submit error:", error);

      form.setError("root", {
        type: "manual",
        message,
      });

      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  /**
   * Handles cancel action
   */
  const handleCancel = () => {
    if (form.formState.isDirty) {
      if (
        !confirm("You have unsaved changes. Are you sure you want to cancel?")
      ) {
        return;
      }
    }
    router.back();
  };

  // ==================== RENDER HELPERS ====================

  /**
   * Get CSS classes for drag-and-drop zone
   */
  const getDropZoneClasses = () => {
    if (isLoading) return "opacity-50 cursor-not-allowed";
    return "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/20 cursor-pointer";
  };

  /**
   * Check if form can be submitted
   */
  const canSubmit =
    !isLoading &&
    form.formState.isValid &&
    (selectedFile || form.getValues("image.url"));

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl md:text-2xl font-bold">
            {isEditMode ? "Edit Collection" : "Create New Collection"}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditMode
              ? "Update your collection details"
              : "Add a new collection to your catalog"}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="ml-2 border"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2 md:space-y-4"
            noValidate
          >
            {/* Root Error Display */}
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter collection title"
                      disabled={isLoading}
                      aria-describedby="title-error"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your collection"
                      className="min-h-[100px] resize-y"
                      disabled={isLoading}
                      aria-describedby="description-error"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Section */}
            <FormField
              control={form.control}
              name="image.url"
              render={() => (
                <FormItem>
                  <FormLabel>Collection Image {!isEditMode && "*"}</FormLabel>
                  <FormControl>
                    {!previewImage ? (
                      <div className="space-y-4">
                        <DragAndDrop
                          multiple={false}
                          accept="image/*"
                          disabled={isLoading}
                          onFilesSelected={handleFilesSelected}
                          className={`h-[200px] ${getDropZoneClasses()}`}
                          aria-label="Drag and drop image upload area"
                        >
                          <div className="flex flex-col items-center justify-center gap-3 text-center p-6">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            <div className="space-y-1">
                              <p className="font-medium text-base">
                                Click or drag & drop to upload
                              </p>
                              <p className="text-sm text-muted-foreground">
                                JPG, PNG, WebP • Max 10MB
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Recommended: {RECOMMENDED_DIMENSIONS}
                              </p>
                            </div>
                            {isEditMode && initialData?.image?.url && (
                              <p className="text-xs text-primary mt-2 font-medium">
                                Leave empty to keep existing image
                              </p>
                            )}
                          </div>
                        </DragAndDrop>

                        {/* Hidden file input as backup */}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          ref={fileInputRef}
                          className="hidden"
                          disabled={isLoading}
                          aria-label="Select image file"
                        />
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="aspect-video rounded-lg overflow-hidden border bg-muted relative">
                          <Image
                            src={previewImage}
                            alt="Collection preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority={false}
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                        </div>

                        {/* Remove image button */}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-3 right-3 opacity-90 hover:opacity-100 shadow-lg"
                          onClick={handleRemoveImage}
                          disabled={isLoading}
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </Button>

                        {/* Upload progress indicator */}
                        {isUploading && (
                          <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium">
                                Uploading image...
                              </p>
                              <span className="text-sm font-medium">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-primary h-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                                role="progressbar"
                                aria-valuenow={progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="sm:w-1/3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit}
                className="sm:flex-1"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading
                      ? "Uploading..."
                      : isEditMode
                        ? "Updating..."
                        : "Creating..."}
                  </>
                ) : isEditMode ? (
                  "Update Collection"
                ) : (
                  "Create Collection"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
