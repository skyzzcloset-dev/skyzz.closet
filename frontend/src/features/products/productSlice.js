import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";

const initialState = {
  items: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// ✅ Get token helper
const getToken = (thunkAPI) => {
  return thunkAPI.getState().auth?.user?.token || localStorage.getItem("token");
};

// Add product
export const addProduct = createAsyncThunk(
  "product/add",
  async (productData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
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
  "product/getAll",
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
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
      // addProduct
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items.push(action.payload.product); // ensure .product
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // getAllProduct
      .addCase(getAllProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload.products || [];
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.items = [];
      })

  
  },
});

export const { reset } = productsSlice.actions;
export default productsSlice.reducer;
