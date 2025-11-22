import { store } from "@/app/store";
import { rehydrate } from "@/features/auth/authSlice";

const KEY = "app.auth";

export const persistAuth = () => {
  try {
    const state = store.getState().auth;
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (err) {
    console.error("❌ Failed to persist auth state:", err);
  }
};

export const loadPersistedAuth = () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    store.dispatch(rehydrate(parsed));
  } catch (err) {
    console.error("❌ Failed to load persisted auth:", err);
  }
};
