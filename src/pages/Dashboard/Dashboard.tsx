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
} from "@mui/material";
import { Home } from "@mui/icons-material";
import { usePropertiesQuery } from "../../features/properties/propertiesQueries";

export default function Dashboard() {
  const { data: properties, isLoading, error } = usePropertiesQuery();

  const totalProperties = properties?.length ?? 0;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 32px)",
        height: "100%",
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
          height: "100%",
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
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            color: "#e2e8f0",
            width: "100%",
            height: "100%",
            boxShadow: "0 0 25px rgba(56,189,248,0.15)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" mb={3} fontWeight={600}>
            Dashboard
          </Typography>

          <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box sx={{ flex: 1, overflowY: "auto", mt: 2 }}>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <CircularProgress sx={{ color: "#38bdf8" }} />
              </Box>
            ) : error ? (
              <Typography color="error">
                Eroare la incarcarea datelor
              </Typography>
            ) : (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(14,165,233,0.1))",
                      border: "1px solid rgba(56,189,248,0.2)",
                      borderRadius: 3,
                      color: "#e2e8f0",
                      boxShadow: "0 0 15px rgba(56,189,248,0.1)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: "0 0 20px rgba(56,189,248,0.25)",
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
                            sx={{ opacity: 0.8, mb: 0.5 }}
                          >
                            Total Proprietati
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              color: "#38bdf8",
                            }}
                          >
                            {totalProperties}
                          </Typography>
                        </Box>
                        <Home sx={{ fontSize: 40, color: "#38bdf8" }} />
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
