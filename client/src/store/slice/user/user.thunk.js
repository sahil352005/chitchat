import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utitlities/axiosInstance";

export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", {
        username,
        password,
      });
      toast.success("Login successful!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.message || "Login failed";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  "user/signup",
  async ({ fullName, username, password, gender }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/register", {
        fullName,
        username,
        password,
        gender,
      });
      toast.success("Account created successfully!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.message || "Registration failed";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      sessionStorage.removeItem("token");
      toast.success("Logout successful!");
      return { success: true };
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.message || "Logout failed";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getUserProfileThunk = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/profile");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.message || "Failed to get profile";
      return rejectWithValue(errorOutput);
    }
  }
);

export const getOtherUsersThunk = createAsyncThunk(
  "user/getOtherUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/users");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.message || "Failed to get users";
      return rejectWithValue(errorOutput);
    }
  }
);
