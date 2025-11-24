import { Alert, Snackbar } from "@mui/material";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

export type ToastSeverity = "success" | "error" | "warning" | "info";

interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
}

interface ToastContextType {
  toast: (_message: string, _severity?: ToastSeverity) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  const toast = useCallback((message: string, severity: ToastSeverity = "success") => {
    setState({ open: true, message, severity });
  }, []);

  const handleClose = () => {
    setState((prev) => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={state.severity} variant="filled" onClose={handleClose}>
          {state.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.toast;
};
