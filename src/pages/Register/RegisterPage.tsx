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
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../features/auth/authMutations";
import { useUploadProfilePictureForUser } from "../../features/users/usersQueries";
import { useAppSelector } from "../../app/hook";
import { selectUser } from "../../features/auth/authSelectors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ROLES = ["MANAGER", "AGENT"];

const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectUser);
  const { mutateAsync: register, isPending: isRegistering } = useRegister();
  const { mutateAsync: uploadAvatarForUser, isPending: isUploading } =
    useUploadProfilePictureForUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (success) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Toate campurile sunt obligatorii");
      return;
    }

    try {
      const newUser = await register({ name, email, password, role } as any);

      if (profileImage && newUser?.user?.id) {
        await uploadAvatarForUser({
          userId: newUser.user.id,
          file: profileImage,
        });
      }

      setSuccess(`Utilizatorul ${name} a fost creat cu succes!`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("AGENT");
      setProfileImage(null);
      setImagePreview(null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Inregistrarea a esuat. Incearca din nou.";
      setError(message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!currentUser || currentUser.role !== "CEO") {
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
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Paper
          sx={{
            p: 4,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            width: "100%",
            boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 12px ${accent}11`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton
              onClick={handleBack}
              sx={{
                mr: 2,
                color: accent,
                "&:hover": {
                  backgroundColor: `${accent}11`,
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" align="center" sx={{ flex: 1 }}>
              Inregistrare Agent / Manager
            </Typography>
            <Box sx={{ width: 40 }} />
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Doar utilizatorii cu rolul de <b>CEO</b> pot crea conturi noi. Vei
            ramane logat ca CEO dupa crearea utilizatorului.
          </Alert>

          <Box component="form" onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
                alignItems: "stretch",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  gap: 2,
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
                  <TextField
                    label="Parola"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <FormControl fullWidth>
                    <InputLabel id="role-select-label">Rol</InputLabel>
                    <Select
                      labelId="role-select-label"
                      value={role}
                      label="Rol"
                      onChange={(e) => setRole(e.target.value)}
                    >
                      {ROLES.map((r) => (
                        <MenuItem key={r} value={r}>
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    mt: "auto",
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
                  {profileImage ? "Schimba imaginea" : "Incarca imagine profil"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>

              <Card
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  height: "100%",
                  boxShadow: isDark
                    ? `0 0 20px ${accent}22`
                    : `0 0 10px ${accent}11`,
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: 2,
                  }}
                >
                  <Typography variant="h6">Preview Profil</Typography>

                  <Avatar
                    src={imagePreview || undefined}
                    sx={{
                      width: 100,
                      height: 100,
                      mb: 1,
                      border: `3px solid ${
                        imagePreview ? accent : theme.palette.divider
                      }`,
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.getContrastText(
                        theme.palette.primary.light
                      ),
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

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor:
                        role === "MANAGER"
                          ? theme.palette.warning.main
                          : theme.palette.success.main,
                      color: theme.palette.getContrastText(
                        role === "MANAGER"
                          ? theme.palette.warning.main
                          : theme.palette.success.main
                      ),
                      fontWeight: 600,
                      display: "inline-block",
                    }}
                  >
                    {role || "ROL"}
                  </Typography>

                  <Divider sx={{ width: "100%", my: 2 }} />

                  <Typography variant="body2" color="text.secondary">
                    {!imagePreview
                      ? "Nu a fost selectata nicio imagine"
                      : "Imagine de profil selectata"}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 3 }}>
                {success}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Redirectionare automata in 2-3 secunde...
                </Typography>
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 4, py: 1.5, fontWeight: 600 }}
              disabled={isRegistering || isUploading}
              size="large"
            >
              {isRegistering || isUploading ? (
                <CircularProgress size={24} />
              ) : (
                "Trimite"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
