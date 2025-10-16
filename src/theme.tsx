import React, { useMemo, useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  IconButton,
} from "@mui/material";
import { blue, deepPurple } from "@mui/material/colors";
import { DarkMode, LightMode } from "@mui/icons-material";

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => {
    let baseTheme = createTheme({
      palette: {
        mode,
        ...(mode === "dark"
          ? {
              primary: { main: "#38bdf8" },
              secondary: { main: "#0ea5e9" },
              background: {
                default: "#0f172a",
                paper: "#1e293b",
              },
              text: {
                primary: "#e2e8f0",
                secondary: "rgba(226,232,240,0.7)",
              },
              divider: "rgba(56,189,248,0.2)",
            }
          : {
              primary: { main: blue[600] },
              secondary: { main: deepPurple[400] },
              background: {
                default: "#f8fafc",
                paper: "#ffffff",
              },
              text: {
                primary: "#0f172a",
                secondary: "#475569",
              },
              divider: "rgba(0,0,0,0.1)",
            }),
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 10,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
            },
          },
        },

        MuiCssBaseline: {
          styleOverrides: (themeParam) => ({
            body: {
              scrollbarColor: `${themeParam.palette.primary.main} ${themeParam.palette.background.default}`,
              "&::-webkit-scrollbar": {
                width: "10px",
                height: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: themeParam.palette.background.default,
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor:
                  mode === "dark" ? themeParam.palette.primary.main : blue[500],
                borderRadius: "10px",
                border: `2px solid ${themeParam.palette.background.default}`,
                transition: "background-color 0.3s ease",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor:
                  mode === "dark"
                    ? themeParam.palette.primary.light
                    : blue[700],
              },
            },
          }),
        },
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 640,
          md: 960,
          lg: 1280,
          xl: 1600,
        },
      },
    });

    return responsiveFontSizes(baseTheme);
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      <IconButton
        onClick={toggleColorMode}
        sx={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          border: `1.5px solid ${theme.palette.primary.main}`,
          boxShadow: `0 0 10px ${theme.palette.primary.main}`,
          transition: "all 0.3s ease",
          color: theme.palette.primary.main,
          bgcolor: theme.palette.background.paper,
          "&:hover": {
            boxShadow: `0 0 25px ${theme.palette.primary.main}`,
            bgcolor: theme.palette.background.default,
          },
        }}
      >
        {mode === "dark" ? (
          <LightMode sx={{ fontSize: 22 }} />
        ) : (
          <DarkMode sx={{ fontSize: 22 }} />
        )}
      </IconButton>
    </ThemeProvider>
  );
};
