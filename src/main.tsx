import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./app/store";
import { loadPersistedAuth, persistAuth } from "./features/auth/authPersist";
import { queryClient } from "./services/queryClient";
import ThemeWrapper from "./theme";

loadPersistedAuth();
store.subscribe(persistAuth);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeWrapper>
          <App />
        </ThemeWrapper>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
