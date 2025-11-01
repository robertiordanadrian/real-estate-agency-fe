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
  Tooltip,
  Fab,
  useMediaQuery,
} from "@mui/material";
import { normalizeRole } from "../../common/utils/normalize-role.util";
import { ERole } from "../../common/enums/role.enums";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowBack } from "@mui/icons-material";

export default function Settings() {
  const theme = useTheme();
  const qc = useQueryClient();
  const { data: user } = useUserQuery();
  const updateUser = useUpdateUser();
  const uploadAvatar = useUploadProfilePicture();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flex: 1,
          boxSizing: "border-box",
          minHeight: 0,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            background: isDark
              ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
              : `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            color: theme.palette.text.primary,
            width: "100%",
            minHeight: "75vh",
            boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 15px ${accent}11`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: { xs: 2, md: 3 },
              flexDirection: { xs: "row", sm: "row" },
              gap: 2,
            }}
          >
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700}>
              Setări utilizator
            </Typography>

            <Tooltip title="Înapoi" arrow>
              <Fab
                color="info"
                onClick={() => window.history.back()}
                size={isMobile ? "medium" : "large"}
                sx={{
                  boxShadow: `0 0 12px ${theme.palette.info.main}55`,
                  "&:hover": { backgroundColor: theme.palette.info.dark },
                }}
              >
                <ArrowBack
                  sx={{ color: "white", fontSize: isMobile ? 22 : 26 }}
                />
              </Fab>
            </Tooltip>
          </Box>

          <Divider
            sx={{
              mb: 3,
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
            }}
          />

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="flex-start"
                sx={{ mb: 4 }}
                flexDirection="column"
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
                    {!user?.profilePicture &&
                      user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Grid>

                <Grid
                  size={{ xs: 12, sm: 8 }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
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
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
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
                    label="Confirmă parola"
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
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={updateUser.isPending || uploadAvatar.isPending}
              sx={{
                mt: "auto",
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

        {/* === TOAST === */}
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
      </Container>
    </Box>
  );
}
