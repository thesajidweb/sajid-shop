// productSlice.ts
import { ProductType } from "@/lib/types/ProductType";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

// productSlice.ts - Update the FetchProductsArgs interface
interface FetchProductsArgs {
  page?: number;
  limit?: number; // Add this line
  search?: string;
  category?: string;
  subcategory?: string;
  status?: "all" | "active" | "inactive" | "draft";
  minPrice?: number;
  maxPrice?: number;
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
  sortBy?: "createdAt" | "updatedAt" | "price" | "name";
  sortOrder?: "asc" | "desc";
}

export interface ProductsApiResponse {
  products: ProductType[];
  totalPages: number;
  currentPage: number;
  itemsPerPage: number; // Add this for API response
  totalItems?: number; // Add this for API response
}
export interface ProductState {
  products: ProductType[];
  loading: boolean;
  error: string | null;

  searchTerm: string;
  statusFilter: "all" | "active" | "inactive" | "draft";
  categoryFilter: string;
  subcategoryFilter: string;

  minPrice?: number;
  maxPrice?: number;

  createdFrom?: string;
  createdTo?: string;

  sortBy: "createdAt" | "updatedAt" | "price" | "name";
  sortOrder: "asc" | "desc";

  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,

  searchTerm: "",
  statusFilter: "all",
  categoryFilter: "all",
  subcategoryFilter: "all",

  minPrice: undefined,
  maxPrice: undefined,

  createdFrom: undefined,
  createdTo: undefined,

  sortBy: "createdAt",
  sortOrder: "desc",

  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
};

interface CreateProductArgs {
  product: ProductType;
  isEditing: boolean;
}

// ------------------------
// Async thunks
// ------------------------
// productSlice.ts (update the fetchProducts thunk)

export const fetchProducts = createAsyncThunk<
  ProductsApiResponse,
  FetchProductsArgs | void,
  { rejectValue: string }
>(
  "products/fetchProducts",
  async (args, { getState, signal, rejectWithValue }) => {
    try {
      const state = getState() as { products: ProductState };

      const params = new URLSearchParams();
      params.set("page", String(args?.page ?? state.products.currentPage));
      // Add limit parameter - use args.limit if provided, otherwise use state
      params.set("limit", String(args?.limit ?? state.products.itemsPerPage));

      const filters = {
        search: args?.search ?? state.products.searchTerm,
        category: args?.category ?? state.products.categoryFilter,
        subcategory: args?.subcategory ?? state.products.subcategoryFilter,
        status: args?.status ?? state.products.statusFilter,
        minPrice: args?.minPrice ?? state.products.minPrice,
        maxPrice: args?.maxPrice ?? state.products.maxPrice,
        createdFrom: args?.createdFrom ?? state.products.createdFrom,
        createdTo: args?.createdTo ?? state.products.createdTo,
        sortBy: args?.sortBy ?? state.products.sortBy,
        sortOrder: args?.sortOrder ?? state.products.sortOrder,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "all" && value !== "") {
          params.set(key, String(value));
        }
      });

      const res = await fetch(`/api/products?${params.toString()}`, { signal });

      if (!res.ok)
        throw new Error(`Products fetch failed with status ${res.status}`);

      const response = await res.json();

      return {
        products: response.products,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        itemsPerPage: response.itemsPerPage || state.products.itemsPerPage,
        totalItems: response.totalItems,
      };
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError")
        return rejectWithValue("Request cancelled");
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Unknown error");
    }
  },
);
export const createProductThunk = createAsyncThunk<
  ProductType,
  CreateProductArgs,
  { rejectValue: string }
>("products/create", async ({ product, isEditing }, { rejectWithValue }) => {
  try {
    const payload = {
      ...product,
      name: product.name.trim(),
      price: Number(product.price),
      cost: Number(product.cost),
      shippingWeight: product.shippingWeight ?? 0,
    };

    const res = await fetch(
      isEditing ? `/api/products/${product._id}` : "/api/products",
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) throw new Error("Failed to save product");

    return (await res.json()) as ProductType;
  } catch (err) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue("Unknown error");
  }
});

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: { products: ProductState } }
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (!res.ok) {
      throw new Error(`Product delete failed with status ${res.status}`);
    } else {
      toast.success("Product deleted successfully!");
    }

    return id;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue("Unknown error");
  }
});

// ------------------------
// Slice
// ------------------------
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter(
      state,
      action: PayloadAction<ProductState["statusFilter"]>,
    ) {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setCategoryFilter(state, action: PayloadAction<string>) {
      state.categoryFilter = action.payload;
      state.currentPage = 1;
    },
    setSubcategoryFilter(state, action: PayloadAction<string>) {
      state.subcategoryFilter = action.payload;
      state.currentPage = 1;
    },
    setPriceRange(
      state,
      action: PayloadAction<{ min?: number; max?: number }>,
    ) {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
      state.currentPage = 1;
    },
    setDateRange(state, action: PayloadAction<{ from?: string; to?: string }>) {
      state.createdFrom = action.payload.from;
      state.createdTo = action.payload.to;
      state.currentPage = 1;
    },
    setSort(
      state,
      action: PayloadAction<{
        sortBy: ProductState["sortBy"];
        sortOrder: ProductState["sortOrder"];
      }>,
    ) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setItemsPerPage(state, action: PayloadAction<number>) {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // reset to first page
    },

    resetFilters(state) {
      state.searchTerm = "";
      state.statusFilter = "all";
      state.categoryFilter = "all";
      state.subcategoryFilter = "all";
      state.minPrice = undefined;
      state.maxPrice = undefined;
      state.createdFrom = undefined;
      state.createdTo = undefined;
      state.currentPage = 1;
      state.itemsPerPage = 10; // Reset to default
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.itemsPerPage = action.payload.itemsPerPage ?? state.itemsPerPage;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      .addCase(createProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add new product
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id,
        );
        if (index !== -1) state.products[index] = action.payload;
        else state.products.unshift(action.payload);
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Create failed";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Delete failed";
      });
  },
});

// ------------------------
// Exports
// ------------------------
export const {
  setSearchTerm,
  setStatusFilter,
  setCategoryFilter,
  setSubcategoryFilter,
  setPriceRange,
  setDateRange,
  setSort,
  setCurrentPage,
  setItemsPerPage,
  resetFilters,
} = productSlice.actions;

export default productSlice.reducer;
