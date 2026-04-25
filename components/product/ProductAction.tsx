"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  X,
  Layers,
} from "lucide-react";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/redux/store";
import { deleteProduct } from "@/redux/features/productSlice";
import { debounce } from "@/lib/utils/debounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CollectionType } from "@/lib/types/collectionType";
import { toast } from "sonner";
import {
  addProductToCollection,
  removeProductFromCollection,
} from "@/redux/features/collectionSlice";

const ProductAction = ({
  id,
  collections,
}: {
  id: string;
  collections: CollectionType[];
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingCollectionId, setUpdatingCollectionId] = useState<
    string | null
  >(null);

  // Local state for optimistic updates
  const [localCollections, setLocalCollections] =
    useState<CollectionType[]>(collections);

  // Update local collections when props change
  useEffect(() => {
    setLocalCollections(collections);
  }, [collections]);

  const handleEdit = () => {
    router.push(`/dashboard/products/${id}/edit`);
  };

  const handleDelete = debounce(async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteProduct(id)).unwrap();
      router.refresh();
      toast.success("Product deleted successfully");
    } catch (error: unknown) {
      if (error instanceof Error)
        toast.error("Failed to delete product " + error.message);
    } finally {
      setIsDeleting(false);
      setOpenConfirm(false);
    }
  }, 500);

  // Add product to collection (optimistic local update)
  const handleAddToCollection = async (collectionId: string) => {
    setUpdatingCollectionId(collectionId);

    // Optimistic update
    setLocalCollections((prev) =>
      prev.map((c) =>
        c._id === collectionId
          ? { ...c, products: [...(c.products || []), id] }
          : c,
      ),
    );

    try {
      await dispatch(
        addProductToCollection({ collectionId, productId: id }),
      ).unwrap();
      toast.success("Added to collection");
    } catch (error) {
      // Rollback on error
      setLocalCollections((prev) =>
        prev.map((c) =>
          c._id === collectionId
            ? { ...c, products: (c.products || []).filter((p) => p !== id) }
            : c,
        ),
      );
      if (error instanceof Error)
        toast.error("Failed to add product to collection");
    } finally {
      setUpdatingCollectionId(null);
    }
  };

  // Remove product from collection (optimistic local update)
  const handleRemoveFromCollection = async (collectionId: string) => {
    setUpdatingCollectionId(collectionId);

    // Optimistic update
    setLocalCollections((prev) =>
      prev.map((c) =>
        c._id === collectionId
          ? { ...c, products: (c.products || []).filter((p) => p !== id) }
          : c,
      ),
    );

    try {
      await dispatch(
        removeProductFromCollection({ collectionId, productId: id }),
      ).unwrap();
      toast.success("Removed from collection");
    } catch (error) {
      // Rollback on error
      setLocalCollections((prev) =>
        prev.map((c) =>
          c._id === collectionId
            ? { ...c, products: [...(c.products || []), id] }
            : c,
        ),
      );
      if (error instanceof Error)
        toast.error("Failed to remove product from collection");
    } finally {
      setUpdatingCollectionId(null);
    }
  };

  // Check if product is in collection
  const isProductInCollection = (collection: CollectionType) => {
    return collection.products?.includes(id) || false;
  };

  // Get selected collections count
  const selectedCount = localCollections.filter((c) =>
    isProductInCollection(c),
  ).length;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer hover:bg-muted"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-foreground">
            Product Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Layers className="mr-2 h-4 w-4" />
              <span className="flex-1">Collections</span>
              <span className="text-muted-foreground text-xs">
                {selectedCount} selected
              </span>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-64">
                <DropdownMenuLabel className="text-muted-foreground">
                  Manage Product Collections
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {localCollections.length === 0 ? (
                  <div className="text-muted-foreground px-2 py-2 text-sm">
                    No collections found
                  </div>
                ) : (
                  localCollections.map((collection) => {
                    const isInCollection = isProductInCollection(collection);
                    const isUpdating = updatingCollectionId === collection._id;

                    return (
                      <DropdownMenuItem
                        key={collection._id}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2 flex-1">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                isInCollection
                                  ? "bg-primary"
                                  : "bg-muted-foreground/30"
                              }`}
                            />
                            <span className="truncate">{collection.title}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {isInCollection ? (
                              <>
                                <Check className="h-4 w-4 text-primary" />
                                <Button
                                  size="icon"
                                  className="h-6 w-6 cursor-pointer bg-muted hover:bg-destructive/75"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFromCollection(collection._id!);
                                  }}
                                  disabled={isUpdating}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="icon"
                                className="h-6 w-6 cursor-pointer bg-muted hover:bg-primary/75"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCollection(collection._id!);
                                }}
                                disabled={isUpdating}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Product
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setOpenConfirm(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              product from your store.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductAction;
