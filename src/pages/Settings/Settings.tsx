import { useEffect, useState } from "react";
import {
  useUserQuery,
  useUpdateUser,
  useUploadProfilePicture,
} from "../../features/users/usersQueries";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { normalizeRole } from "../../common/utils/normalize-role.util";
import { ERole } from "../../common/enums/role.enums";
import { useQueryClient } from "@tanstack/react-query";

export default function Settings() {
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

    await updateUser.mutateAsync(form);
    if (avatar) await uploadAvatar.mutateAsync(avatar);

    
    qc.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 32px)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Container maxWidth="md" disableGutters>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            color: "#e2e8f0",
            width: "100%",
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <Typography variant="h5" mb={3} fontWeight={600}>
            Setari
          </Typography>

          <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.1)" }} />

          <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Avatar
              src={avatarPreview || user?.profilePicture || undefined}
              sx={{
                width: 100,
                height: 100,
                border: "2px solid #38bdf8",
                boxShadow: "0 0 12px rgba(56,189,248,0.5)",
                bgcolor: "#1e293b",
                transition: "all 0.3s ease",
              }}
            >
              {!user?.profilePicture && user?.name?.charAt(0)}
            </Avatar>

            <Button
              variant="outlined"
              component="label"
              sx={{
                color: "#38bdf8",
                borderColor: "#38bdf8",
                "&:hover": {
                  borderColor: "#0ea5e9",
                  background: "rgba(14,165,233,0.1)",
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
                slotProps={{ input: { style: { color: "#e2e8f0" } } }}
              />

              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                fullWidth
                slotProps={{ input: { style: { color: "#e2e8f0" } } }}
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
                slotProps={{ input: { style: { color: "#e2e8f0" } } }}
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
                slotProps={{
                  input: {
                    style: { color: "#e2e8f0" },
                    endAdornment: (
                      <InputAdornment position="end">🔒</InputAdornment>
                    ),
                  },
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
                slotProps={{
                  input: {
                    style: { color: "#e2e8f0" },
                    endAdornment: (
                      <InputAdornment position="end">🔒</InputAdornment>
                    ),
                  },
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
                backgroundColor: "#0ea5e9",
                "&:hover": { backgroundColor: "#0284c7" },
                fontWeight: 600,
              }}
            >
              {updateUser.isPending || uploadAvatar.isPending ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Salveaza"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
