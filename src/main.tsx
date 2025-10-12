import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "./theme";

import { Provider } from "react-redux";
import { store } from "./app/store";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";

import { loadPersistedAuth, persistAuth } from "./features/auth/authPersist";

loadPersistedAuth();

store.subscribe(persistAuth);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
