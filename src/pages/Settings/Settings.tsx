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
        message: "A aparut o eroare la salvare. Incearca din nou.",
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
        display: "grid",
        placeItems: "center",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="md" disableGutters>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            width: "100%",
            maxWidth: 800,
            mx: "auto",
            boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 15px ${accent}11`,
            transition: "all 0.3s ease",
          }}
        >
          <Typography variant="h5" mb={3} fontWeight={600}>
            Setari
          </Typography>

          <Divider
            sx={{
              mb: 3,
              borderColor: theme.palette.divider,
            }}
          />

          <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Avatar
              src={avatarPreview || user?.profilePicture || undefined}
              sx={{
                width: 100,
                height: 100,
                border: `2px solid ${accent}`,
                boxShadow: `0 0 12px ${accent}55`,
                bgcolor: theme.palette.background.default,
                transition: "all 0.3s ease",
              }}
            >
              {!user?.profilePicture && user?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Button
              variant="outlined"
              component="label"
              sx={{
                color: accent,
                borderColor: accent,
                fontWeight: 600,
                "&:hover": {
                  borderColor: accent,
                  backgroundColor: `${accent}11`,
                },
              }}
            >
              Incarca imaginea de profil
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </Stack>

          {/* FORM */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              <TextField
                label="Nume complet"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                fullWidth
              />

              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                fullWidth
              />

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

              <Box />

              <TextField
                label="Parola noua"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">🔒</InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirma parola"
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
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={updateUser.isPending || uploadAvatar.isPending}
              sx={{
                mt: 4,
                py: 1.4,
                backgroundColor: accent,
                color: theme.palette.getContrastText(accent),
                fontWeight: 600,
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
                "Salveaza"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
