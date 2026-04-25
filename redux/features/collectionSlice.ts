// @/redux/features/collectionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CollectionType } from "@/lib/types/collectionType";

interface CollectionState {
  collections: CollectionType[];
  loading: boolean;
  error: string | null;
}

const initialState: CollectionState = {
  collections: [],
  loading: false,
  error: null,
};

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async () => {
    const res = await fetch("/api/collections", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch collections");
    }
    return await res.json();
  },
);

export const addProductToCollection = createAsyncThunk(
  "collections/addProduct",
  async ({
    collectionId,
    productId,
  }: {
    collectionId: string;
    productId: string;
  }) => {
    const res = await fetch(`/api/collections/add-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collectionId,
        productId,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to add product to collection");
    }

    return { collectionId, productId };
  },
);

export const removeProductFromCollection = createAsyncThunk(
  "collections/removeProduct",
  async ({
    collectionId,
    productId,
  }: {
    collectionId: string;
    productId: string;
  }) => {
    const res = await fetch("/api/collections/remove-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collectionId,
        productId,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to remove product from collection");
    }

    return { collectionId, productId };
  },
);

const collectionSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch collections
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCollections.fulfilled,
        (state, action: PayloadAction<CollectionType[]>) => {
          state.loading = false;
          state.collections = action.payload;
        },
      )
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch collections";
      })
      // Add product to collection
      .addCase(addProductToCollection.fulfilled, (state, action) => {
        const { collectionId, productId } = action.payload;
        state.collections = state.collections.map((collection) =>
          collection._id === collectionId
            ? {
                ...collection,
                products: [...(collection.products || []), productId],
              }
            : collection,
        );
      })
      // Remove product from collection
      .addCase(removeProductFromCollection.fulfilled, (state, action) => {
        const { collectionId, productId } = action.payload;
        state.collections = state.collections.map((collection) =>
          collection._id === collectionId
            ? {
                ...collection,
                products:
                  collection.products?.filter((id) => id !== productId) || [],
              }
            : collection,
        );
      });
  },
});

export const selectCollections = (state: { collections: CollectionState }) =>
  state.collections.collections;
export const selectCollectionsLoading = (state: {
  collections: CollectionState;
}) => state.collections.loading;
export const selectCollectionsError = (state: {
  collections: CollectionState;
}) => state.collections.error;

export default collectionSlice.reducer;
