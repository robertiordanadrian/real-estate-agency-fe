import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { store } from "../app/store";
import { logout, setCredentials } from "../features/auth/authSlice";
import { selectAuth, selectAccessToken } from "../features/auth/authSelectors";

const baseURL = import.meta.env.VITE_API_URL;

export const http: AxiosInstance = axios.create({
  baseURL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let pendingQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else {
      if (token) {
        if (!p.config.headers) p.config.headers = {};
        p.config.headers["Authorization"] = `Bearer ${token}`;
      }
      p.resolve(http(p.config));
    }
  });
  pendingQueue = [];
};

http.interceptors.request.use((config) => {
  const state = store.getState();
  const token = selectAccessToken(state);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalConfig = error.config!;
    const status = error.response?.status;

    if (status !== 401) {
      return Promise.reject(error);
    }

    if ((originalConfig as any)._retry) {
      store.dispatch(logout());
      return Promise.reject(error);
    }
    (originalConfig as any)._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config: originalConfig });
      });
    }

    isRefreshing = true;
    try {
      const state = store.getState();
      const auth = selectAuth(state);
      if (!auth.user || !auth.refreshToken) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      const refreshRes = await axios.post(`${baseURL}/auth/refresh`, {
        userId: auth.user.id,
        refreshToken: auth.refreshToken,
      });

      const newAccessToken: string = refreshRes.data?.access_token;
      const newRefreshToken: string = refreshRes.data?.refresh_token;

      if (!newAccessToken) {
        store.dispatch(logout());
        processQueue(error, null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      store.dispatch(
        setCredentials({
          user: auth.user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken ?? auth.refreshToken,
        })
      );

      processQueue(null, newAccessToken);
      isRefreshing = false;

      originalConfig.headers = originalConfig.headers ?? {};
      originalConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return http(originalConfig);
    } catch (refreshErr) {
      store.dispatch(logout());
      processQueue(refreshErr, null);
      isRefreshing = false;
      return Promise.reject(refreshErr);
    }
  }
);
