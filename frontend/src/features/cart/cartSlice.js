import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "./cartServices";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cart")) || [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const getToken = (thunkAPI) =>
  thunkAPI.getState().auth?.user?.token || localStorage.getItem("token");

export const addCartItems = createAsyncThunk(
  "cart/items",
  async (cartData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await cartService.addCartItems(cartData, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCartItems = createAsyncThunk(
  "cart/getItems",
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await cartService.getCartItems(token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
    loadCartFromStorage: (state) => {
      state.cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = action.payload.cart.items;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      })
      .addCase(addCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = action.payload.cart.items;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCart, loadCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer;
