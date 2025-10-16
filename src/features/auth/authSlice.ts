import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "CEO" | "MANAGER" | "AGENT" | undefined;
  profilePicture?: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  status: "idle" | "authenticating" | "authenticated" | "error";
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.status = "authenticated";
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.status = "idle";
    },
    rehydrate(state, action: PayloadAction<Partial<AuthState>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setCredentials, logout, rehydrate } = authSlice.actions;
export default authSlice.reducer;
