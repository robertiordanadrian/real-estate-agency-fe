import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useLogin } from "@/features/auth/authMutations";

const LoginPage = () => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await mutateAsync({ email, password });
      setTimeout(() => navigate("/", { replace: true }), 100);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Autentificarea a esuat. Incearca din nou.";
      setError(message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: theme.palette.background.default,
          py: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            width: "100%",
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 15px ${accent}11`,
            transition: "all 0.3s ease",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontWeight={700}
            gutterBottom
            sx={{
              background: isDark
                ? "linear-gradient(45deg, #38bdf8, #818cf8)"
                : "linear-gradient(45deg, #0f172a, #2563eb)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Autentificare in cont
          </Typography>

          <Typography variant="body2" align="center" color="text.secondary" mb={3}>
            Introdu datele tale de acces pentru a continua.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Parolă"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isPending}
              sx={{
                mt: 4,
                py: 1.4,
                fontWeight: 700,
                fontSize: "1rem",
                backgroundColor: accent,
                color: theme.palette.getContrastText(accent),
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {isPending ? (
                <CircularProgress size={24} sx={{ color: theme.palette.getContrastText(accent) }} />
              ) : (
                "Logheaza-te"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
