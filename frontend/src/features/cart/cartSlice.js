import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "./cartServices";

const initialState = {
  cartItems: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// ➕ Add item
export const addCartItems = createAsyncThunk("cart/add", async (cartData, thunkAPI) => {
  try {
    const res = await cartService.addCartItems(cartData);
    return res;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 📥 Get items
export const getCartItems = createAsyncThunk("cart/get", async (_, thunkAPI) => {
  try {
    const res = await cartService.getCartItems();
    return res;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// ✏ Update
export const updateCart = createAsyncThunk(
  "cart/update",
  async ({ id, cartData }, thunkAPI) => {
    try {
      const res = await cartService.updateCart(id, cartData);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 🗑 Delete
export const deleteCart = createAsyncThunk("cart/delete", async ({ id }, thunkAPI) => {
  try {
    const res = await cartService.deleteCart(id);
    return res;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

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

export const { reset, clearCart, loadCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer;
