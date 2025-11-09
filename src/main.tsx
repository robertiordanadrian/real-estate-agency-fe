import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { QueryClientProvider } from "@tanstack/react-query";
import { ro } from "date-fns/locale";
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
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ro}>
            <App />
          </LocalizationProvider>
        </ThemeWrapper>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
