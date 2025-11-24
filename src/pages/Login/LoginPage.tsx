import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import type { AxiosError } from "axios";
import { useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/context/ToastContext";
import { useLogin } from "@/features/auth/authMutations";

// =========
// ✅ READY
// =========
const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";

  const { mutateAsync, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });

  const validate = (fieldEmail = email, fieldPassword = password) => {
    const newErrors = { email: "", password: "" };
    let ok = true;

    if (!fieldEmail.trim()) {
      newErrors.email = "Email is required";
      ok = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fieldEmail.trim())) {
        newErrors.email = "Invalid email format";
        ok = false;
      }
    }

    if (!fieldPassword.trim()) {
      newErrors.password = "Password is required";
      ok = false;
    }

    setErrors(newErrors);
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validate()) {
      toast("Please fill in all required fields", "error");
      return;
    }
    try {
      await mutateAsync({ email, password });
      toast("Successfully logged in", "success");
      navigate("/", { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      toast(axiosErr.response?.data?.message || "Authentication error", "error");
    }
  };

  const hasValidationErrors =
    !!errors.email || !!errors.password || !email.trim() || !password.trim();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: theme.palette.background.default,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            width: "100%",
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 15px ${accent}11`,
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
              color: "transparent",
            }}
          >
            Autentificare în cont
          </Typography>

          <Typography variant="body2" align="center" color="text.secondary" mb={3}>
            Introdu datele tale de acces pentru a continua.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              label="Email"
              fullWidth
              required
              margin="normal"
              value={email}
              error={touched.email && !!errors.email}
              helperText={touched.email ? errors.email : ""}
              onBlur={() => {
                setTouched((t) => ({ ...t, email: true }));
                validate();
              }}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                setTouched((t) => ({ ...t, email: true }));
                validate(value, password);
              }}
            />

            <TextField
              label="Parola"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              error={touched.password && !!errors.password}
              helperText={touched.password ? errors.password : ""}
              onBlur={() => {
                setTouched((t) => ({ ...t, password: true }));
                validate(email, password);
              }}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setTouched((t) => ({ ...t, password: true }));
                validate(email, value);
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isPending || hasValidationErrors}
              sx={{
                mt: 4,
                py: 1.4,
                fontWeight: 700,
                fontSize: "1rem",
                backgroundColor: accent,
                color: theme.palette.getContrastText(accent),
                borderRadius: 2,
                opacity: isPending || hasValidationErrors ? 0.6 : 1,
                cursor: isPending || hasValidationErrors ? "not-allowed" : "pointer",
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
