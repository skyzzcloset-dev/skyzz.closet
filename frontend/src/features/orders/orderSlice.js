// src/features/order/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "./orderService";

const initialState = {
  orders: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Helper to get token
const getToken = (thunkAPI) =>
  thunkAPI.getState().auth?.user?.token || localStorage.getItem("token");

// ➕ Create a new order
export const createOrder = createAsyncThunk(
  "order/create",
  async (data, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await orderService.createOrder(data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 📥 Get all orders
export const getOrders = createAsyncThunk(
  "order/getAll",
  async (params, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await orderService.getOrders(params, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
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
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders.push(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
      });
  },
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;
