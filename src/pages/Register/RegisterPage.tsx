import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AxiosError } from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ERole } from "@/common/enums/role/role.enums";
import { IRegisterForm } from "@/common/interfaces/forms/register-form.interface";
import { getRoleColor } from "@/common/utils/get-role-color.util";
import { getRoleDisplayText } from "@/common/utils/get-role-display-text.util";
import { useToast } from "@/context/ToastContext";
import { useRegister } from "@/features/auth/authMutations";
import { selectUser } from "@/features/auth/authSelectors";
import {
  useUpdateUserById,
  useUploadProfilePictureForUser,
  useUserByIdQuery,
} from "@/features/users/usersQueries";

import { useAppSelector } from "../../app/hook";

type RegisterErrors = {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
  role?: boolean;
  password?: boolean;
};

// =========
// ✅ READY
// =========
const RegisterPage = () => {
  const theme = useTheme();
  const currentUser = useAppSelector(selectUser);
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [formErrors, setFormErrors] = useState<RegisterErrors>({});
  const [formTouched, setFormTouched] = useState(false);

  const ROLES = Object.values(ERole).filter((r) => r !== ERole.CEO);

  const editId = new URLSearchParams(location.search).get("editId");

  const {
    data: userToEdit,
    isLoading: isFetchingUser,
    error: userError,
  } = useUserByIdQuery(editId || "");

  const { mutateAsync: register, isPending: isRegistering } = useRegister();
  const { mutateAsync: updateUserById, isPending: isUpdating } = useUpdateUserById();
  const { mutateAsync: uploadAvatarForUser, isPending: isUploading } =
    useUploadProfilePictureForUser();

  const [form, setForm] = useState<IRegisterForm>({
    name: "",
    email: "",
    phone: "",
    role: ERole.AGENT,
    password: "",
    profileImage: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    const newErrors: RegisterErrors = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.email.trim()) newErrors.email = true;
    if (!form.phone.trim()) newErrors.phone = true;
    if (!form.role) newErrors.role = true;
    if (!editId && !(form.password ?? "").trim()) newErrors.password = true;
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    setError("");
    setSuccess("");
    if (!validateForm()) {
      toast("Completeaza toate campurile obligatorii!", "error");
      return;
    }
    if (!form.name || !form.email || !form.phone || !form.role) {
      setError("Toate campurile sunt obligatorii.");
      return;
    }
    try {
      if (editId) {
        await updateUserById({
          userId: editId,
          payload: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            role: form.role,
          },
        });
        if (form.profileImage) {
          await uploadAvatarForUser({
            userId: editId,
            file: form.profileImage,
          });
        }
        setSuccess(`Agentul ${form.name} a fost actualizat cu succes!`);
      } else {
        if (!form.password) {
          setError("Parola este obligatorie pentru un agent nou.");
          return;
        }
        const newUser = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: form.role,
        });
        if (form.profileImage && newUser?.user?._id) {
          await uploadAvatarForUser({
            userId: newUser.user._id,
            file: form.profileImage,
          });
        }
        setSuccess(`Agentul ${form.name} a fost creat cu succes!`);
      }
      updateForm("profileImage", null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Operatiunea a esuat. Incearca din nou.";
      setError(message);
    }
  };

  const updateForm = <K extends keyof IRegisterForm>(key: K, value: IRegisterForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (currentUser && currentUser.role !== "CEO") {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);
  useEffect(() => {
    if (userToEdit) {
      setForm((prev) => ({
        ...prev,
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        role: userToEdit.role,
        password: "",
        profileImage: null,
      }));
      setImagePreview(userToEdit.profilePicture || null);
    }
  }, [userToEdit]);
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/agents"), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);
  useEffect(() => {
    if (userError) {
      const axiosErr = userError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea proprietatilor", "error");
    }
  }, [userError, toast]);

  if (!currentUser || currentUser.role !== "CEO" || isFetchingUser) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight={600}
              sx={{ textAlign: "left" }}
            >
              {editId ? "Editare Agent" : "Creare Agent Nou"}
            </Typography>

            <Tooltip title="Înapoi" arrow>
              <Fab
                color="info"
                onClick={() => navigate(-1)}
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
            <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
              <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    borderRadius: 3,
                    p: { xs: 2, sm: 3 },
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    boxShadow: isDark ? `0 0 20px ${accent}22` : `0 0 10px ${accent}11`,
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      label="Nume complet"
                      fullWidth
                      value={form.name}
                      error={formTouched && !!formErrors.name}
                      onChange={(e) => {
                        if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: false }));
                        updateForm("name", e.target.value);
                      }}
                      InputLabelProps={{ required: true }}
                    />
                    <TextField
                      label="Email"
                      fullWidth
                      value={form.email}
                      error={formTouched && !!formErrors.email}
                      onChange={(e) => {
                        if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: false }));
                        updateForm("email", e.target.value);
                      }}
                      InputLabelProps={{ required: true }}
                    />

                    {!editId && (
                      <TextField
                        label="Parola"
                        fullWidth
                        value={form.password}
                        error={formTouched && !!formErrors.password}
                        onChange={(e) => {
                          if (formErrors.password)
                            setFormErrors((prev) => ({ ...prev, password: false }));
                          updateForm("password", e.target.value);
                        }}
                        InputLabelProps={{ required: true }}
                      />
                    )}

                    <TextField
                      label="Numar de telefon"
                      fullWidth
                      value={form.phone}
                      error={formTouched && !!formErrors.phone}
                      onChange={(e) => {
                        if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: false }));
                        updateForm("phone", e.target.value);
                      }}
                      InputLabelProps={{ required: true }}
                    />

                    <FormControl fullWidth error={formTouched && !!formErrors.role}>
                      <InputLabel id="role-select-label">Rol</InputLabel>
                      <Select
                        labelId="role-select-label"
                        value={form.role}
                        label="Rol"
                        onChange={(e) => {
                          if (formErrors.role) setFormErrors((prev) => ({ ...prev, role: false }));
                          updateForm("role", e.target.value as ERole);
                        }}
                      >
                        {ROLES.map((r) => (
                          <MenuItem key={r} value={r}>
                            {getRoleDisplayText(r)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{
                        mt: 1,
                        py: 1.2,
                        fontWeight: 600,
                        borderColor: accent,
                        color: accent,
                        "&:hover": {
                          backgroundColor: `${accent}11`,
                          borderColor: accent,
                        },
                      }}
                    >
                      {form.profileImage ? "Schimba imaginea" : "Incarca imagine profil"}

                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          updateForm("profileImage", file);

                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setImagePreview(reader.result as string);
                            reader.readAsDataURL(file);
                          } else {
                            setImagePreview(null);
                          }
                        }}
                      />
                    </Button>
                  </Box>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 3,
                    p: { xs: 2, sm: 3 },
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    boxShadow: isDark ? `0 0 20px ${accent}22` : `0 0 10px ${accent}11`,
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      width: "100%",
                      textAlign: "center",
                      flexGrow: 1,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Preview profil
                    </Typography>

                    <Avatar
                      src={imagePreview || undefined}
                      sx={{
                        width: 100,
                        height: 100,
                        border: `3px solid ${imagePreview ? accent : theme.palette.divider}`,
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.getContrastText(theme.palette.primary.light),
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {!imagePreview && (form.name ? form.name.charAt(0).toUpperCase() : "U")}
                    </Avatar>

                    <Typography variant="h6">{form.name || "Nume utilizator"}</Typography>
                    <Typography color="text.secondary">
                      {form.email || "email@exemplu.com"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {form.phone || "Numar de telefon"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: getRoleColor(form.role),
                        color: theme.palette.getContrastText(getRoleColor(form.role)),
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      {getRoleDisplayText(form.role)}
                    </Typography>

                    <Divider sx={{ width: "100%", my: 2 }} />

                    <Typography variant="body2" color="text.secondary">
                      {!imagePreview
                        ? "Nu a fost selectata nicio imagine"
                        : "Imagine de profil selectata"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 3 }}>
                {success}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Redirectionare automata in 2 secunde...
                </Typography>
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: "auto",
                py: 1.4,
                fontWeight: 700,
                fontSize: "1rem",
                backgroundColor: accent,
                color: theme.palette.getContrastText(accent),
                borderRadius: 2,
                "&:hover": { backgroundColor: theme.palette.primary.dark },
                my: { xs: 3, md: 0 },
              }}
              disabled={isRegistering || isUploading || isUpdating}
            >
              {isRegistering || isUploading || isUpdating ? (
                <CircularProgress size={24} sx={{ color: theme.palette.getContrastText(accent) }} />
              ) : editId ? (
                "Actualizeaza agent"
              ) : (
                "Creeaza agent"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
