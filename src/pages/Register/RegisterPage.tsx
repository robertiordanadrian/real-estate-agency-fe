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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../features/auth/authMutations";
import { useUploadProfilePictureForUser } from "../../features/users/usersQueries";
import { useAppSelector } from "../../app/hook";
import { selectUser } from "../../features/auth/authSelectors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ROLES = ["MANAGER", "AGENT"];

const RegisterPage = () => {
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

      setSuccess(`Utilizator ${name} a fost creat cu succes!`);

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
        "Inregistrarea a esuat. Te rugam sa incerci din nou.";
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
        <Paper sx={{ p: 4, bgcolor: "background.paper", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton
              onClick={handleBack}
              sx={{
                mr: 2,
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              sx={{ flex: 1 }}
            >
              Inregistrare Agent/Manager
            </Typography>
            <Box sx={{ width: 40 }} />
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Doar utilizatorii cu rolul de CEO pot crea conturi noi. Vei ramane
            logat ca CEO dupa crearea utilizatorului.
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

                <Button variant="outlined" component="label" fullWidth>
                  {profileImage ? "Schimba imaginea" : "Incarca imagine profil"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6" gutterBottom align="center">
                      Preview Profil
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 2,
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Avatar
                        src={imagePreview || undefined}
                        sx={{
                          width: 100,
                          height: 100,
                          mb: 2,
                          border: imagePreview
                            ? "3px solid #1976d2"
                            : "2px dashed #ccc",
                        }}
                      >
                        {!imagePreview &&
                          (name ? name.charAt(0).toUpperCase() : "U")}
                      </Avatar>

                      <Typography variant="h6" align="center" gutterBottom>
                        {name || "Nume Utilizator"}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        align="center"
                        gutterBottom
                      >
                        {email || "email@exemplu.com"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          p: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            role === "MANAGER" ? "#ff9800" : "#4caf50",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {role || "ROL"}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      {!imagePreview && "Nu a fost selectata nicio imagine"}
                      {imagePreview && "Imagine de profil selectata"}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Redirectionare automata in 2-3 secunde...
                </Typography>
              </Alert>
            )}

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
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
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
