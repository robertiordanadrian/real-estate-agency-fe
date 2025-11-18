import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { store } from "@/app/store";
import { selectAccessToken, selectAuth } from "@/features/auth/authSelectors";
import { logout, setCredentials } from "@/features/auth/authSlice";

const baseURL = import.meta.env.VITE_API_URL;

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

interface RefreshTokenRequest {
  userId: string;
  refreshToken: string;
}

interface PendingRequest {
  resolve: (_value: unknown) => void;
  reject: (_error: unknown) => void;
  config: InternalAxiosRequestConfig;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const http: AxiosInstance = axios.create({
  baseURL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let pendingQueue: PendingRequest[] = [];

const processQueue = (error: unknown | null, token: string | null = null): void => {
  pendingQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      resolve(http(config));
    }
  });
  pendingQueue = [];
};

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const state = store.getState();
    const token = selectAccessToken(state);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError) => {
    const originalConfig = error.config as ExtendedAxiosRequestConfig;

    if (!originalConfig || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalConfig._retry || originalConfig.url?.includes("/auth/refresh")) {
      store.dispatch(logout());
      return Promise.reject(error);
    }

    originalConfig._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config: originalConfig });
      });
    }

    isRefreshing = true;

    try {
      const state = store.getState();
      const auth = selectAuth(state);

      if (!auth.user?._id || !auth.refreshToken) {
        throw new Error("No user ID or refresh token available");
      }

      const refreshRes = await axios.post<RefreshTokenResponse>(`${baseURL}/auth/refresh`, {
        userId: auth.user._id,
        refreshToken: auth.refreshToken,
      } as RefreshTokenRequest);

      const newAccessToken = refreshRes.data.access_token;
      const newRefreshToken = refreshRes.data.refresh_token;

      if (!newAccessToken) {
        throw new Error("No access token received from refresh endpoint");
      }

      store.dispatch(
        setCredentials({
          user: auth.user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || auth.refreshToken,
        }),
      );

      processQueue(null, newAccessToken);

      if (originalConfig.headers) {
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return http(originalConfig);
    } catch (refreshError) {
      processQueue(refreshError as Error);
      store.dispatch(logout());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
