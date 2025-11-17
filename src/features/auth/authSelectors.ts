import type { RootState } from "@/app/store";

export const selectAuth = (s: RootState) => s.auth;
export const selectAccessToken = (s: RootState) => s.auth.accessToken;
export const selectUser = (s: RootState) => s.auth.user;
export const selectIsAuthenticated = (s: RootState) => !!s.auth.accessToken && !!s.auth.user;
