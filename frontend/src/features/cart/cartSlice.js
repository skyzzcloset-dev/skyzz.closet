import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import cartService from "./cartServices";

const initialState = {
  cartItems: [],
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
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
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
  },
  extraReducers: (builder) => {
    builder

      .addCase(addCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems.push(action.payload.cart);
      })

      .addCase(addCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {reset} = cartSlice.actions;
export default cartSlice.reducer;
