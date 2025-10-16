import { useEffect, useState } from "react";
import {
  useUserQuery,
  useUpdateUser,
  useUploadProfilePicture,
} from "../../features/users/usersQueries";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
  Grid,
} from "@mui/material";
import { normalizeRole } from "../../common/utils/normalize-role.util";
import { ERole } from "../../common/enums/role.enums";
import { useQueryClient } from "@tanstack/react-query";

export default function Settings() {
  const theme = useTheme();
  const qc = useQueryClient();
  const { data: user } = useUserQuery();
  const updateUser = useUpdateUser();
  const uploadAvatar = useUploadProfilePicture();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "AGENT",
    password: "",
    confirmPassword: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        role: user.role ?? "AGENT",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser.mutateAsync(form);
      if (avatar) await uploadAvatar.mutateAsync(avatar);

      qc.invalidateQueries({ queryKey: ["user"] });
      setToast({
        open: true,
        message: "Datele au fost salvate cu succes!",
        severity: "success",
      });
    } catch {
      setToast({
        open: true,
        message: "A apărut o eroare la salvare. Încearcă din nou.",
        severity: "error",
      });
    }
  };

  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 32px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        bgcolor: theme.palette.background.default,
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 15px ${accent}11`,
            transition: "all 0.3s ease",
          }}
        >
          <Typography
            variant="h5"
            mb={3}
            fontWeight={700}
            sx={{
              background: isDark
                ? "linear-gradient(45deg, #38bdf8, #818cf8)"
                : "linear-gradient(45deg, #0f172a, #2563eb)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Setări utilizator
          </Typography>

          <Divider sx={{ mb: 4, borderColor: theme.palette.divider }} />

          {/* === Avatar Section === */}
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Grid
              size={{ xs: 12, sm: 4 }}
              display="flex"
              justifyContent="center"
            >
              <Avatar
                src={avatarPreview || user?.profilePicture || undefined}
                sx={{
                  width: 100,
                  height: 100,
                  border: `2px solid ${accent}`,
                  boxShadow: `0 0 15px ${accent}55`,
                  bgcolor: theme.palette.background.default,
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {!user?.profilePicture && user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>

            <Grid
              size={{ xs: 12, sm: 8 }}
              display="flex"
              justifyContent={{ xs: "center", sm: "flex-start" }}
              alignItems="flex-end"
            >
              <Button
                variant="outlined"
                component="label"
                sx={{
                  color: accent,
                  borderColor: accent,
                  fontWeight: 600,
                  height: 45,
                  "&:hover": {
                    borderColor: accent,
                    backgroundColor: `${accent}11`,
                  },
                }}
              >
                Încarcă imagine de profil
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
          </Grid>

          {/* === Form === */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nume complet"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Rol"
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: normalizeRole(e.target.value),
                    })
                  }
                  fullWidth
                >
                  {Object.values(ERole).map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Parolă nouă"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">🔒</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Confirmă parolă"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">🔒</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={updateUser.isPending || uploadAvatar.isPending}
              sx={{
                mt: 2,
                py: 1.3,
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
              {updateUser.isPending || uploadAvatar.isPending ? (
                <CircularProgress
                  size={24}
                  sx={{ color: theme.palette.getContrastText(accent) }}
                />
              ) : (
                "Salvează modificările"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* === Snackbar === */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{
            width: "100%",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
