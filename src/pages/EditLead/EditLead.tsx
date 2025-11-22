import { ArrowBack, AttachFile } from "@mui/icons-material";
import {
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
import { DatePicker } from "@mui/x-date-pickers";
import { IEditLeadForm } from "@/common/interfaces/forms/edit-lead-form.interface";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ELeadStatus } from "@/common/enums/lead/lead-status.enum";
import { ERole } from "@/common/enums/role/role.enums";
import { IUser } from "@/common/interfaces/user/user.interface";
import { useLeadQuery, useUpdateLead, useUploadContract } from "@/features/leads/leadsQueries";
import { useAllUsersQuery, useUserQuery } from "@/features/users/usersQueries";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

const EditLead = () => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const toast = useToast();

  const { id } = useParams();
  const updateLead = useUpdateLead();
  const uploadContract = useUploadContract();

  const { data: allUsers, error: usersError } = useAllUsersQuery();
  const { data: me, error: meError } = useUserQuery();
  const { data: lead, isLoading, error: leadError } = useLeadQuery(id || "");

  const [form, setForm] = useState<IEditLeadForm>({
    name: "",
    phoneNumber: "",
    propertyType: "",
    zona: "",
    budget: "",
    transactionType: "",
    status: undefined,
    agentId: undefined,
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleChange = <K extends keyof IEditLeadForm>(key: K, value: IEditLeadForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const handleSave = async () => {
    if (!id) return;

    try {
      await updateLead.mutateAsync({ id, data: form });

      toast("Lead-ul a fost actualizat cu succes!", "success");

      setTimeout(() => {
        navigate("/leads");
      }, 800);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Eroare la actualizarea lead-ului.";

      toast(errorMessage, "error");

      setTimeout(() => navigate("/leads"), 2000);
    }
  };

  const handleUpload = async () => {
    if (!id || !file) return;

    try {
      await uploadContract.mutateAsync({ id, file });

      toast("Contractul a fost incarcat cu succes!", "success");

      setFile(null);
      setFileName("");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Eroare la incarcarea contractului.";

      toast(errorMessage, "error");
    }
  };

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name ?? "",
        phoneNumber: lead.phoneNumber ?? "",
        propertyType: lead.propertyType ?? "",
        zona: lead.zona ?? "",
        budget: lead.budget ?? "",
        transactionType: lead.transactionType ?? "",

        idSeries: lead.idSeries ?? "",
        idNumber: lead.idNumber ?? "",
        cnp: lead.cnp ?? "",
        idExpirationDate: lead.idExpirationDate
          ? new Date(lead.idExpirationDate).toISOString()
          : "",
        address: lead.address ?? "",

        status: lead.status ?? undefined,
        agentId: lead.agentId ?? undefined,
      });
    }
  }, [lead]);

  useEffect(() => {
    if (usersError) {
      const axiosErr = usersError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea utilizatorilor", "error");
    }
  }, [usersError, toast]);

  useEffect(() => {
    if (meError) {
      const axiosErr = meError as AxiosError<{ message?: string }>;
      toast(
        axiosErr.response?.data?.message ||
          "Eroare la incarcarea datelor despre utilizatorul curent",
        "error",
      );
    }
  }, [meError, toast]);

  useEffect(() => {
    if (leadError) {
      const axiosErr = leadError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea lead-ului", "error");
    }
  }, [leadError, toast]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );

  if (!lead)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Lead-ul nu exista.
      </Typography>
    );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
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
                    endAdornment: <InputAdornment position="end">€</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Tranzacție"
                  value={form.transactionType}
                  onChange={(e) => handleChange("transactionType", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Status"
                  value={form.status ?? lead.status ?? ELeadStatus.GREEN}
                  onChange={(e) => handleChange("status", e.target.value as ELeadStatus)}
                  fullWidth
                >
                  {Object.values(ELeadStatus).map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
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
                          u.role === ERole.AGENT,
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
                      allUsers?.find((u: IUser) => u._id === (form.agentId ?? lead.agentId))
                        ?.name ?? "Nespecificat"
                    }
                    fullWidth
                    disabled
                  />
                </Grid>
              )}
            </Grid>

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
                  {fileName || lead.contractUrl?.split("/").pop() || "Incarca fisier contract"}
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
                    Deschide fisier
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
                {uploadContract.isPending ? "Se incarca..." : "Incarca contract"}
              </Button>
            </Box>

            {lead.contractUrl && (
              <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    Date Act de Identitate
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Serie buletin"
                    value={form.idSeries ?? ""}
                    onChange={(e) => handleChange("idSeries", e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Numar buletin"
                    value={form.idNumber ?? ""}
                    onChange={(e) => handleChange("idNumber", e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="CNP"
                    value={form.cnp ?? ""}
                    onChange={(e) => handleChange("cnp", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="Data expirarii"
                    value={form.idExpirationDate ? new Date(form.idExpirationDate) : null}
                    onChange={(newValue) =>
                      handleChange("idExpirationDate", newValue ? newValue.toISOString() : "")
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Adresa"
                    value={form.address ?? ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                  />
                </Grid>
              </Grid>
            )}

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

export default EditLead;
