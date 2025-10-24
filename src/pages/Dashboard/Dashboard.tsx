import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { ContactPhone, Home, Person } from "@mui/icons-material";
import { usePropertiesQuery } from "../../features/properties/propertiesQueries";
import { useLeadsQuery } from "../../features/leads/leadsQueries";
import { useAllUsersQuery } from "../../features/users/usersQueries";

export default function Dashboard() {
  const theme = useTheme();
  const {
    data: properties,
    isLoading: isLoadingProperties,
    error: errorProperties,
  } = usePropertiesQuery();
  const {
    data: leads,
    isLoading: isLoadingLeads,
    error: errorLeads,
  } = useLeadsQuery();
  const {
    data: users,
    isLoading: isLoadingUseres,
    error: errorsUsers,
  } = useAllUsersQuery();

  const totalProperties = properties?.length ?? 0;
  const totalLeads = leads?.length ?? 0;
  const totalUsers = users?.length ?? 0;

  const gradientBg =
    theme.palette.mode === "dark"
      ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
      : `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`;

  const accentColor = theme.palette.primary.main;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 32px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 1,
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: 4,
            borderRadius: 3,
            background: gradientBg,
            color: textPrimary,
            width: "100%",
            height: "100%",
            boxShadow: theme.shadows[6],
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" mb={3} fontWeight={600}>
            Dashboard
          </Typography>

          <Divider
            sx={{
              mb: 3,
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
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
            ) : errorProperties || errorLeads || errorsUsers ? (
              <Typography color="error">
                Eroare la incarcarea datelor
              </Typography>
            ) : (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
                        <ContactPhone
                          sx={{ fontSize: 40, color: accentColor }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
}
