import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton,
  Grid,
  useTheme,
} from "@mui/material";
import { blue, orange, red, green } from "@mui/material/colors";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRegister } from "../../features/auth/authMutations";
import {
  useUserByIdQuery,
  useUpdateUserById,
  useUploadProfilePictureForUser,
} from "../../features/users/usersQueries";
import { useAppSelector } from "../../app/hook";
import { selectUser } from "../../features/auth/authSelectors";

const ROLES = ["MANAGER", "TEAM_LEAD", "AGENT"];

const getRoleDisplayText = (role: string): string => {
  switch (role) {
    case "CEO":
      return "Chief Executive Officer";
    case "MANAGER":
      return "Property Manager";
    case "TEAM_LEAD":
      return "Team Leader";
    case "AGENT":
      return "Real Estate Agent";
    default:
      return "User";
  }
};

const getRoleColor = (role: string): string => {
  switch (role) {
    case "CEO":
      return blue[400];
    case "MANAGER":
      return orange[400];
    case "TEAM_LEAD":
      return red[400];
    case "AGENT":
    default:
      return green[400];
  }
};

export default function RegisterPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector(selectUser);

  const editId = new URLSearchParams(location.search).get("editId");

  const { data: userToEdit, isLoading: isFetchingUser } = useUserByIdQuery(
    editId || undefined
  );
  const { mutateAsync: register, isPending: isRegistering } = useRegister();
  const { mutateAsync: updateUserById, isPending: isUpdating } =
    useUpdateUserById();
  const { mutateAsync: uploadAvatarForUser, isPending: isUploading } =
    useUploadProfilePictureForUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("AGENT");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;

  useEffect(() => {
    if (currentUser && currentUser.role !== "CEO") {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || "");
      setEmail(userToEdit.email || "");
      setPhone(userToEdit.phone || "");
      setRole(userToEdit.role || "AGENT");
      setImagePreview(userToEdit.profilePicture || null);
    }
  }, [userToEdit]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/agents"), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !phone || !role) {
      setError("Toate campurile sunt obligatorii");
      return;
    }

    try {
      if (editId) {
        await updateUserById({
          userId: editId,
          payload: { name, email, phone, role },
        });

        if (profileImage) {
          await uploadAvatarForUser({ userId: editId, file: profileImage });
        }

        setSuccess(`Agentul ${name} a fost actualizat cu succes!`);
      } else {
        if (!password) {
          setError("Parola este obligatorie pentru un agent nou");
          return;
        }

        const newUser = await register({
          name,
          email,
          password,
          phone,
          role,
        } as any);

        if (profileImage && newUser?.user?.id) {
          await uploadAvatarForUser({
            userId: newUser.user.id,
            file: profileImage,
          });
        }

        setSuccess(`Agentul ${name} a fost creat cu succes!`);
      }

      setProfileImage(null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Operatiunea a esuat. Incearca din nou.";
      setError(message);
    }
  };

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
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Paper
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 15px ${accent}11`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              mr: 2,
              color: accent,
              "&:hover": { backgroundColor: `${accent}11` },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              flex: 1,
              background: isDark
                ? "linear-gradient(45deg, #38bdf8, #818cf8)"
                : "linear-gradient(45deg, #0f172a, #2563eb)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textAlign: "center",
            }}
          >
            {editId ? "Editare Agent" : "Inregistrare Utilizator"}
          </Typography>

          <Box sx={{ width: 40 }} />
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          Doar utilizatorii cu rolul de <b>CEO</b> pot crea sau edita agenti.
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
            {/* CARD STANGA - FORMULAR */}
            <Grid size={{ xs: 12, md: 6 }}>
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
                  boxShadow: isDark
                    ? `0 0 20px ${accent}22`
                    : `0 0 10px ${accent}11`,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Nume complet"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {!editId && (
                    <TextField
                      label="Parola"
                      type="password"
                      fullWidth
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  )}
                  <TextField
                    label="Numar de telefon"
                    fullWidth
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <FormControl fullWidth>
                    <InputLabel id="role-select-label">Rol</InputLabel>
                    <Select
                      labelId="role-select-label"
                      value={role}
                      label="Rol"
                      onChange={(e) => setRole(e.target.value as string)}
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
                    {profileImage
                      ? "Schimba imaginea"
                      : "Incarca imagine profil"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
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
                  boxShadow: isDark
                    ? `0 0 20px ${accent}22`
                    : `0 0 10px ${accent}11`,
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
                      border: `3px solid ${
                        imagePreview ? accent : theme.palette.divider
                      }`,
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.getContrastText(
                        theme.palette.primary.light
                      ),
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {!imagePreview &&
                      (name ? name.charAt(0).toUpperCase() : "U")}
                  </Avatar>

                  <Typography variant="h6">
                    {name || "Nume utilizator"}
                  </Typography>
                  <Typography color="text.secondary">
                    {email || "email@exemplu.com"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {phone || "Numar de telefon"}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: getRoleColor(role),
                      color: theme.palette.getContrastText(getRoleColor(role)),
                      fontWeight: 600,
                      display: "inline-block",
                    }}
                  >
                    {getRoleDisplayText(role)}
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
              mt: 4,
              py: 1.4,
              fontWeight: 700,
              fontSize: "1rem",
              backgroundColor: accent,
              color: theme.palette.getContrastText(accent),
              borderRadius: 2,
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
            disabled={isRegistering || isUploading || isUpdating}
          >
            {isRegistering || isUploading || isUpdating ? (
              <CircularProgress
                size={24}
                sx={{ color: theme.palette.getContrastText(accent) }}
              />
            ) : editId ? (
              "Actualizeaza agent"
            ) : (
              "Creeaza agent"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
