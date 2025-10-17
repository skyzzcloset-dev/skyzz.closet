// src/features/payment/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "./paymentService";

const initialState = {
  payment: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Helper to get token
const getToken = (thunkAPI) =>
  thunkAPI.getState().auth?.user?.token || localStorage.getItem("token");

// ➕ Create a payment
export const createPayment = createAsyncThunk(
  "payment/create",
  async ({ id, paymentData }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await paymentService.createPayment(paymentData, id, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ Verify a payment
export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (paymentData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await paymentService.verifyPayment(paymentData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
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
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payment = action.payload.payment;
        state.isSuccess = true;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isSuccess = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = paymentSlice.actions;
export default paymentSlice.reducer;
