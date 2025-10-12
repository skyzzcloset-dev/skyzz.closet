import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import deliveryService from "./deliveryService";

const initialState = {
  delivery: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const getToken = (thunkAPI) =>
  thunkAPI.getState().auth?.user?.token || localStorage.getItem("token");

// ✅ Check pincode
export const checkServiceability = createAsyncThunk(
  "delivery/pincode",
  async (pincode, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await deliveryService.checkServiceability(pincode, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ Create shipping order
export const createShippingOrder = createAsyncThunk(
  "delivery/create",
  async ({ id, deliveryData }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await deliveryService.createShippingOrder(id, deliveryData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const deliverySlice = createSlice({
  name: "delivery",
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
      // ✅ createShippingOrder
      .addCase(createShippingOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createShippingOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.delivery = action.payload;
        state.isSuccess = true;
      })
      .addCase(createShippingOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ✅ checkServiceability
      .addCase(checkServiceability.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkServiceability.fulfilled, (state, action) => {
        state.isLoading = false;
        state.delivery = action.payload;
        state.isSuccess = true;
      })
      .addCase(checkServiceability.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = deliverySlice.actions;
export default deliverySlice.reducer;
