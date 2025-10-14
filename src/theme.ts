import { createTheme } from "@mui/material/styles";
import { blue, green, grey } from "@mui/material/colors";

const appTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    primary: {
      main: blue[400],
    },
    secondary: {
      main: green[400],
    },
    success: {
      main: "#22c55e",
    },
    text: {
      primary: "#e2e8f0",
      secondary: grey[400],
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: "#e2e8f0",
    },
    body1: {
      color: "#cbd5e1",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1e293b",
          borderRadius: "16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

export default appTheme;
