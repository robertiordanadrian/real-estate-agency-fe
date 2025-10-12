import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { store } from "../app/store";
import { logout, setCredentials } from "../features/auth/authSlice";
import { selectAuth, selectAccessToken } from "../features/auth/authSelectors";

const baseURL = "http://localhost:3000";

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
      p.resolve(http(p.config)); // retrimite requestul
    }
  });
  pendingQueue = [];
};

// --- Request: atașează Bearer dacă există ---
http.interceptors.request.use((config) => {
  const state = store.getState();
  const token = selectAccessToken(state);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// --- Response: 401 => refresh flow ---
http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalConfig = error.config!;
    const status = error.response?.status;

    if (status !== 401) {
      return Promise.reject(error);
    }

    // dacă deja s-a încercat refresh pentru acest request, nu intrăm în loop
    if ((originalConfig as any)._retry) {
      store.dispatch(logout());
      return Promise.reject(error);
    }
    (originalConfig as any)._retry = true;

    // dacă deja e în curs un refresh, adaugă în coadă
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config: originalConfig });
      });
    }

    isRefreshing = true;
    try {
      const state = store.getState();
      const auth = selectAuth(state);
      if (!auth.user || !auth.accessToken || !auth.refreshToken) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      const refreshRes = await axios.post(`${baseURL}/auth/refresh`, {
        access_token: auth.accessToken,
        userId: auth.user.id,
      });

      // noul set de tokenuri
      const newAccessToken: string = refreshRes.data?.access_token;
      const newRefreshToken: string = refreshRes.data?.refresh_token;

      if (!newAccessToken) {
        store.dispatch(logout());
        processQueue(error, null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      // actualizează ambele tokenuri în store
      store.dispatch(
        setCredentials({
          user: auth.user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken ?? auth.refreshToken, // fallback la vechiul refresh
        })
      );

      processQueue(null, newAccessToken);
      isRefreshing = false;

      // reface headerul pentru original
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
