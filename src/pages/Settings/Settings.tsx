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
  TextField,
  Typography,
  useTheme,
  Grid,
  Tooltip,
  Fab,
  useMediaQuery,
} from "@mui/material";
import { ERole } from "../../common/enums/role.enums";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowBack } from "@mui/icons-material";
import { ISettingsForm } from "../../common/interfaces/settings-form.interface";
import { getRoleColor } from "../../common/utils/get-role-color.util";
import { blue } from "@mui/material/colors";

const Settings = () => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: user } = useUserQuery();
  const qc = useQueryClient();
  const updateUser = useUpdateUser();
  const uploadAvatar = useUploadProfilePicture();

  const [form, setForm] = useState<ISettingsForm>({
    name: "",
    email: "",
    role: ERole.AGENT,
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

  const updateForm = <K extends keyof ISettingsForm>(
    key: K,
    value: ISettingsForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
        confirmPassword: "",
      });

      setAvatar(null);
      setAvatarPreview(user.profilePicture || null);
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
    setToast({ open: false, message: "", severity: "success" });

    try {
      if (form.password || form.confirmPassword) {
        if (form.password !== form.confirmPassword) {
          setToast({
            open: true,
            message: "Parolele nu coincid!",
            severity: "error",
          });
          return;
        }
      }

      const payload: Partial<ISettingsForm> = {
        name: form.name,
        email: form.email,
        role: form.role,
      };

      if (form.password) {
        payload.password = form.password;
      }

      await updateUser.mutateAsync(payload);

      if (avatar) {
        await uploadAvatar.mutateAsync(avatar);
        setAvatar(null);
      }

      qc.invalidateQueries({ queryKey: ["me"] });

      setToast({
        open: true,
        message: "Datele au fost salvate cu succes!",
        severity: "success",
      });
    } catch (error: any) {
      setToast({
        open: true,
        message: error?.response?.data?.message || "A aparut o eroare.",
        severity: "error",
      });
    }
  };

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
              Setari utilizator
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
                      border: `3px solid ${getRoleColor(user?.role || "")}`,
                      bgcolor: user?.profilePicture
                        ? theme.palette.background.default
                        : blue[400],
                      boxShadow: `0 0 20px ${getRoleColor(user?.role || "")}44`,
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {!avatarPreview &&
                      !user?.profilePicture &&
                      (user?.name?.charAt(0).toUpperCase() || "U")}
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
                    onChange={(e) => updateForm("name", e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Rol"
                    value={form.role}
                    onChange={(e) =>
                      updateForm("role", e.target.value as ERole)
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
                    onChange={(e) => updateForm("password", e.target.value)}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">🔒</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Confirmă parola"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      updateForm("confirmPassword", e.target.value)
                    }
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">🔒</InputAdornment>
                        ),
                      },
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
                "Salveaza modificarile"
              )}
            </Button>
          </Box>
        </Paper>

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
};

export default Settings;
