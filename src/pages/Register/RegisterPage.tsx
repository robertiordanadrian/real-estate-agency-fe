import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Link as MuiLink,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../../features/auth/authMutations";
import { useUploadProfilePicture } from "../../features/users/usersQueries";

const ROLES = ["CEO", "MANAGER", "AGENT"];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: register, isPending: isRegistering } = useRegister();
  const { mutateAsync: uploadAvatar, isPending: isUploading } =
    useUploadProfilePicture();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("AGENT");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register({ name, email, password, role } as any);
      await new Promise((resolve) => setTimeout(resolve, 150));
      if (profileImage) {
        await uploadAvatar(profileImage);
      }
      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      setError(message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper sx={{ p: 4, bgcolor: "background.paper", width: "100%" }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Inregistreaza-te
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Nume"
              fullWidth
              required
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Parola"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControl fullWidth margin="normal">
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

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              {profileImage ? "Imagine selectata" : "Incarca imagine profil"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)}
              />
            </Button>

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={isRegistering || isUploading}
            >
              {isRegistering || isUploading ? (
                <CircularProgress size={24} />
              ) : (
                "Inregistreaza-te"
              )}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                Ai deja un cont?{" "}
                <MuiLink
                  component={Link}
                  to="/login"
                  underline="hover"
                  sx={{ fontWeight: 500 }}
                >
                  Logheaza-te
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
