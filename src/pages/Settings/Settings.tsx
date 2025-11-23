import { ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Fab,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useEffect, useState } from "react";

import { ERole } from "@/common/enums/role/role.enums";
import { ISettingsForm } from "@/common/interfaces/forms/settings-form.interface";
import { getRoleColor } from "@/common/utils/get-role-color.util";
import {
  useUpdateUser,
  useUploadProfilePicture,
  useUserQuery,
} from "@/features/users/usersQueries";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";
import { useLogout } from "@/features/auth/authMutations";

// =========
// ✅ READY
// =========
const Settings = () => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const toast = useToast();
  const qc = useQueryClient();

  const { data: user, error: userError } = useUserQuery();
  const updateUser = useUpdateUser();
  const uploadAvatar = useUploadProfilePicture();
  const { mutate: logout } = useLogout();

  const [form, setForm] = useState<ISettingsForm>({
    name: "",
    email: "",
    role: ERole.AGENT,
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const updateForm = <K extends keyof ISettingsForm>(key: K, value: ISettingsForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const passwordChanged = !!form.password || !!form.confirmPassword;
      if (passwordChanged) {
        if (!form.password || !form.confirmPassword) {
          toast("Completeaza ambele campuri pentru parola.", "error");
          return;
        }
        if (form.password !== form.confirmPassword) {
          toast("Parolele nu coincid!", "error");
          return;
        }
      }
      const payload: any = {};
      if (passwordChanged) {
        payload.password = form.password;
        payload.confirmPassword = form.confirmPassword;
      }
      if (passwordChanged) {
        await updateUser.mutateAsync(payload);
      }
      if (avatar) {
        await uploadAvatar.mutateAsync(avatar);
        setAvatar(null);
      }
      qc.invalidateQueries({ queryKey: ["me"] });
      if (passwordChanged) {
        toast("Parola a fost actualizata! Te delogam...", "success");

        setTimeout(() => logout(), 1000);
      } else {
        toast("Datele au fost salvate cu succes!", "success");
      }
    } catch (error: any) {
      toast(error?.response?.data?.message || "A aparut o eroare.", "error");
    }
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

  useEffect(() => {
    if (userError) {
      const axiosErr = userError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea userului", "error");
    }
  }, [userError, toast]);

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
                <ArrowBack sx={{ color: "white", fontSize: isMobile ? 22 : 26 }} />
              </Fab>
            </Tooltip>
          </Box>

          <Divider
            sx={{
              mb: 3,
              borderColor:
                theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
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
                <Grid size={{ xs: 12, sm: 4 }} display="flex" justifyContent="center">
                  <Avatar
                    src={avatarPreview || user?.profilePicture || undefined}
                    sx={{
                      width: 100,
                      height: 100,
                      border: `3px solid ${getRoleColor(user?.role || "")}`,
                      bgcolor: user?.profilePicture ? theme.palette.background.default : blue[400],
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
                    Incarca imagine de profil
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
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
                    slotProps={{ input: { readOnly: true } }}
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Rol"
                    value={form.role}
                    onChange={(e) => updateForm("role", e.target.value as ERole)}
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                    disabled
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
                    label="Parola noua"
                    type="password"
                    value={form.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">🔒</InputAdornment>,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Confirma parola"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => updateForm("confirmPassword", e.target.value)}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">🔒</InputAdornment>,
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
                <CircularProgress size={24} sx={{ color: theme.palette.getContrastText(accent) }} />
              ) : (
                "Salveaza modificarile"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Settings;
