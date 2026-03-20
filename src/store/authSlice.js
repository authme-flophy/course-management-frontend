import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "../features/auth/authAPI";
import { extractErrorMessage } from "../utils/errorHandler";

export const login = createAsyncThunk(
  "login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await loginApi({ username, password });
      localStorage.setItem("token", data.access);
      return data;
    } catch (error) {
      const message = extractErrorMessage(error.response?.data, "Login failed");
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  "register",
  async ({ username, email, password, user_type }, { rejectWithValue }) => {
    try {
      const data = await registerApi({ username, email, password, user_type });
      localStorage.setItem("token", data.access);
      return data;
    } catch (error) {
      const message = extractErrorMessage(error.response?.data, "Registration failed");
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    userType: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.userType = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access;
        state.userType = action.payload.user_type;
        state.user = { user_type: action.payload.user_type };
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access;
        state.user = action.payload.user;
        state.userType = action.payload.user_type;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export const selectAuthIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthUserType = (state) => state.auth.userType;

export default authSlice.reducer;
