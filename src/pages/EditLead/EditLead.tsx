// src/pages/Leads/EditLead.tsx
import React, { useEffect, useState } from "react";
import {
  Alert,
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
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AttachFile, ArrowBack } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import {
  useLeadQuery,
  useUpdateLead,
  useUploadContract,
} from "../../features/leads/leadsQueries";
import { ELeadStatus } from "../../common/enums/lead-status.enum";
import { ERole } from "../../common/enums/role.enums";
import { IUser } from "../../common/interfaces/user.interface";
import {
  useAllUsersQuery,
  useUserQuery,
} from "../../features/users/usersQueries";
export default function EditLead() {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { data: allUsers } = useAllUsersQuery();
  const { data: me } = useUserQuery();

  const { id } = useParams();
  const { data: lead, isLoading } = useLeadQuery(id || "");
  const updateLead = useUpdateLead();
  const uploadContract = useUploadContract();

  const [form, setForm] = useState<Record<string, any>>({});
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name ?? "",
        phoneNumber: lead.phoneNumber ?? "",
        propertyType: lead.propertyType ?? "",
        zona: lead.zona ?? "",
        budget: lead.budget ?? "",
        transactionType: lead.transactionType ?? "",
      });
    }
  }, [lead]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      if (!id) return;
      await updateLead.mutateAsync({ id, data: form });
      setToast({
        open: true,
        message: "Lead-ul a fost actualizat cu succes!",
        severity: "success",
      });
    } catch {
      setToast({
        open: true,
        message: "Eroare la actualizarea lead-ului.",
        severity: "error",
      });
    }
  };

  const handleUpload = async () => {
    try {
      if (!id || !file) return;
      await uploadContract.mutateAsync({ id, file });
      setToast({
        open: true,
        message: "Contract încărcat cu succes!",
        severity: "success",
      });
      setFile(null);
      setFileName("");
    } catch {
      setToast({
        open: true,
        message: "Eroare la încărcarea contractului.",
        severity: "error",
      });
    }
  };

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!lead)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Lead inexistent sau inaccesibil.
      </Typography>
    );

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
          {/* Header */}
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
              Editare Lead
            </Typography>

            <Tooltip title="Înapoi la listă" arrow>
              <Fab
                color="info"
                onClick={() => navigate("/leads")}
                size={isMobile ? "medium" : "large"}
                sx={{
                  boxShadow: `0 0 12px ${theme.palette.info.main}55`,
                  "&:hover": {
                    backgroundColor: theme.palette.info.dark,
                  },
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

          {/* Form */}
          <Box
            component="form"
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nume complet"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Telefon"
                  value={form.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Tip proprietate"
                  value={form.propertyType}
                  onChange={(e) => handleChange("propertyType", e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Zonă"
                  value={form.zona}
                  onChange={(e) => handleChange("zona", e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Buget"
                  value={form.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Tranzacție"
                  value={form.transactionType}
                  onChange={(e) =>
                    handleChange("transactionType", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Status"
                  value={form.status ?? lead.status ?? ELeadStatus.GREEN}
                  onChange={(e) => handleChange("status", e.target.value)}
                  fullWidth
                >
                  {Object.values(ELeadStatus).map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* Dropdown vizibil doar pentru CEO și Manager */}
              {(me?.role === ERole.CEO || me?.role === ERole.MANAGER) && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Agent Asignat"
                    value={form.agentId ?? lead.agentId ?? ""}
                    onChange={(e) => handleChange("agentId", e.target.value)}
                    fullWidth
                  >
                    {allUsers
                      ?.filter(
                        (u: IUser) =>
                          u.role === ERole.MANAGER ||
                          u.role === ERole.TEAM_LEAD ||
                          u.role === ERole.AGENT
                      )
                      .map((user: IUser) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.name} ({user.role})
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              )}

              {me && me.role !== ERole.CEO && me.role !== ERole.MANAGER && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Agent Asignat"
                    value={
                      allUsers?.find(
                        (u: IUser) => u._id === (form.agentId ?? lead.agentId)
                      )?.name ?? "Nespecificat"
                    }
                    fullWidth
                    disabled
                  />
                </Grid>
              )}
            </Grid>

            {/* Upload Contract */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Contract
              </Typography>

              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<AttachFile />}
                sx={{
                  height: 56,
                  borderColor: accent,
                  color: theme.palette.text.primary,
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    borderColor: theme.palette.primary.light,
                    backgroundColor: `${theme.palette.primary.main}11`,
                  },
                }}
              >
                <Box
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    display: "block",
                  }}
                >
                  {fileName ||
                    lead.contractUrl?.split("/").pop() ||
                    "Incarca fisier contract"}
                </Box>

                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) {
                      setFile(selected);
                      setFileName(selected.name);
                    }
                  }}
                />
              </Button>

              {lead.contractUrl && (
                <Typography mt={2}>
                  Contract existent:{" "}
                  <a
                    href={lead.contractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: accent,
                      textDecoration: "underline",
                      fontWeight: 600,
                    }}
                  >
                    Deschide fișier
                  </a>
                </Typography>
              )}

              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpload}
                sx={{ mt: 2, fontWeight: 600 }}
                disabled={!file || uploadContract.isPending}
              >
                {uploadContract.isPending
                  ? "Se încarcă..."
                  : "Încarcă contract"}
              </Button>
            </Box>

            {/* Save button */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleSave}
              disabled={updateLead.isPending}
              sx={{
                mt: 5,
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
              {updateLead.isPending ? (
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

        {/* Snackbar Feedback */}
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
