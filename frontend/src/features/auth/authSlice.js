// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Get user from localStorage if exists
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Login thunk
export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    const res = await authService.login(userData);
    return res.user; // ✅ only return actual user object
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Login failed";
    return thunkAPI.rejectWithValue(message);
  }
});

// Register thunk
export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    const res = await authService.register(userData);
    return res.user; // ✅ only return actual user object
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Register failed";
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout thunk
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  localStorage.removeItem("user"); // ✅ clear localStorage on logout
});

const authSlice = createSlice({
  name: "auth",
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
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload)); // ✅ save clean user
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload)); // ✅ save clean user
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
