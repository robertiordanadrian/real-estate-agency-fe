import { store } from "../../app/store";
import { rehydrate } from "./authSlice";

const KEY = "app.auth";

export const persistAuth = () => {
  const state = store.getState().auth;
  localStorage.setItem(KEY, JSON.stringify(state));
};

export const loadPersistedAuth = () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    store.dispatch(rehydrate(parsed));
  } catch {}
};
