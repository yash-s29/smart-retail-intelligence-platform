import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productApi";

/* ==========================================================
   Initial State
========================================================== */

const initialState = {
  products: [],
  loading: false,
  error: null,
};

/* ==========================================================
   Fetch Products
========================================================== */

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await getProducts();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to fetch products."
      );
    }
  }
);

/* ==========================================================
   Create Product
========================================================== */

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, thunkAPI) => {
    try {
      const response = await createProduct(productData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to create product."
      );
    }
  }
);

/* ==========================================================
   Update Product
========================================================== */

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await updateProduct(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to update product."
      );
    }
  }
);

/* ==========================================================
   Delete Product
========================================================== */

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id, thunkAPI) => {
    try {
      await deleteProduct(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  }
);

/* ==========================================================
   Slice
========================================================== */

const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* =========================
         Fetch Products
      ========================= */

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =========================
         Create Product
      ========================= */

      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })

      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =========================
         Update Product
      ========================= */

      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );

        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =========================
         Delete Product
      ========================= */

      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })

      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;