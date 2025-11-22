import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { QueryClientProvider } from "@tanstack/react-query";
import { ro } from "date-fns/locale";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { APIProvider } from "@vis.gl/react-google-maps";

import App from "@/App";
import { store } from "@/app/store";
import { loadPersistedAuth, persistAuth } from "@/features/auth/authPersist";
import { queryClient } from "@/services/queryClient";
import ThemeWrapper from "@/theme";
import { ImobiliareInitializer } from "@/features/imobiliare/ImobiliareInitializer";
import { ToastProvider } from "@/context/ToastContext"; // 👈 import nou

loadPersistedAuth();
store.subscribe(persistAuth);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeWrapper>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ro}>
            <APIProvider
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              libraries={["places"]}
              version="weekly"
              onLoad={() => console.log("Google Maps API loaded")}
              onError={() => console.log("Error loading Google Maps API")}
            >
              <ToastProvider>
                <ImobiliareInitializer />
                <App />
              </ToastProvider>
            </APIProvider>
          </LocalizationProvider>
        </ThemeWrapper>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
