import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import productService from "./productService";

const initialState = {
  items: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Add product
export const addProduct = createAsyncThunk(
  "products/add",
  async ({productData, token}, thunkAPI) => {
    try {
      return await productService.addProduct(productData, token);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all products
export const getAllProduct = createAsyncThunk(
  "products/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token; // get token from auth slice
      return await productService.getAllProduct(token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Add product
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get all products
      .addCase(getAllProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload.products || action.payload; // flexible
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.items = []; // never null
      });
  },
});

export const {reset} = productsSlice.actions;
export default productsSlice.reducer;
