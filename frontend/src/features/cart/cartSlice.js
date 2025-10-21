// src/features/cart/cartSlice.js
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import cartService from "./cartServices";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cart")) || [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Helper to get token
const getToken = (thunkAPI) =>
  thunkAPI.getState().auth?.user?.token || localStorage.getItem("token");

// ➕ Add item
export const addCartItems = createAsyncThunk(
  "cart/add",
  async (cartData, thunkAPI) => {
    try {
      return await cartService.addCartItems(cartData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 📥 Get items
export const getCartItems = createAsyncThunk(
  "cart/get",
  async (_, thunkAPI) => {
    try {
      return await cartService.getCartItems();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✏ Update item
export const updateCart = createAsyncThunk(
  "cart/update",
  async ({id, cartData}, thunkAPI) => {
    try {
      return await cartService.updateCart(id, cartData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 🗑 Delete item
export const deleteCart = createAsyncThunk(
  "cart/delete",
  async ({id}, thunkAPI) => {
    try {
      return await cartService.deleteCart(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
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
      .addCase(addCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload.cart.items;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload.cart.items;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cart.items;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cart.items;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      });
  },
});

export const {reset, clearCart, loadCartFromStorage} = cartSlice.actions;
export default cartSlice.reducer;
