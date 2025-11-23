import { ContactPhone, Home, Person, Refresh } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Fab,
  Grid,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useLeadsQuery } from "@/features/leads/leadsQueries";
import { useAllUsersQuery } from "@/features/users/usersQueries";
import { useToast } from "@/context/ToastContext";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { useFilterPropertiesQuery } from "@/features/properties/propertiesQueries";

// =========
// ✅ READY
// =========
const Dashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const toast = useToast();

  const {
    data: properties,
    isLoading: isLoadingProperties,
    error: propertiesError,
  } = useFilterPropertiesQuery({ agentId: "ALL" });

  const { data: leads, isLoading: isLoadingLeads, error: leadsError } = useLeadsQuery();
  const { data: users, isLoading: isLoadingUseres, error: usersError } = useAllUsersQuery();

  const totalProperties = properties?.length ?? 0;
  const totalLeads = leads?.length ?? 0;
  const totalUsers = users?.length ?? 0;
  const accentColor = theme.palette.primary.main;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;

  useEffect(() => {
    if (leadsError) {
      const axiosErr = leadsError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea leads-urilor", "error");
    }
  }, [leadsError, toast]);

  useEffect(() => {
    if (usersError) {
      const axiosErr = usersError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea utilizatorilor", "error");
    }
  }, [usersError, toast]);

  useEffect(() => {
    if (propertiesError) {
      const axiosErr = propertiesError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea proprietatilor", "error");
    }
  }, [propertiesError, toast]);

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
              Dashboard
            </Typography>

            <Tooltip title="Reîncarcă lista" arrow>
              <Fab
                color="info"
                size={isMobile ? "medium" : "large"}
                sx={{
                  boxShadow: `0 0 12px ${theme.palette.info.main}55`,
                  "&:hover": {
                    backgroundColor: theme.palette.info.dark,
                  },
                }}
              >
                <Refresh sx={{ color: "white", fontSize: isMobile ? 22 : 26 }} />
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

          <Box sx={{ flex: 1, overflowY: "auto", mt: 2 }}>
            {isLoadingProperties || isLoadingLeads || isLoadingUseres ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }}>
                  <Card
                    sx={{
                      background:
                        theme.palette.mode === "dark"
                          ? `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`
                          : `linear-gradient(135deg, ${accentColor}11, ${accentColor}05)`,
                      border: `1px solid ${accentColor}33`,
                      borderRadius: 3,
                      color: textPrimary,
                      boxShadow: `0 0 15px ${accentColor}11`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: `0 0 25px ${accentColor}33`,
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ opacity: 0.8, mb: 0.5, color: textSecondary }}
                          >
                            Total Proprietati
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              color: accentColor,
                            }}
                          >
                            {totalProperties}
                          </Typography>
                        </Box>
                        <Home sx={{ fontSize: 40, color: accentColor }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }}>
                  <Card
                    sx={{
                      background:
                        theme.palette.mode === "dark"
                          ? `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`
                          : `linear-gradient(135deg, ${accentColor}11, ${accentColor}05)`,
                      border: `1px solid ${accentColor}33`,
                      borderRadius: 3,
                      color: textPrimary,
                      boxShadow: `0 0 15px ${accentColor}11`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: `0 0 25px ${accentColor}33`,
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ opacity: 0.8, mb: 0.5, color: textSecondary }}
                          >
                            Total Lead-uri
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              color: accentColor,
                            }}
                          >
                            {totalLeads}
                          </Typography>
                        </Box>
                        <ContactPhone sx={{ fontSize: 40, color: accentColor }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }}>
                  <Card
                    sx={{
                      background:
                        theme.palette.mode === "dark"
                          ? `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`
                          : `linear-gradient(135deg, ${accentColor}11, ${accentColor}05)`,
                      border: `1px solid ${accentColor}33`,
                      borderRadius: 3,
                      color: textPrimary,
                      boxShadow: `0 0 15px ${accentColor}11`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: `0 0 25px ${accentColor}33`,
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ opacity: 0.8, mb: 0.5, color: textSecondary }}
                          >
                            Total Useri
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              color: accentColor,
                            }}
                          >
                            {totalUsers}
                          </Typography>
                        </Box>
                        <Person sx={{ fontSize: 40, color: accentColor }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
function usePropertiesQuery(): { data: any; error: any } {
  throw new Error("Function not implemented.");
}
