import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fab,
  Grid,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { http } from "../../services/http";
import {
  useApproveLeadRequest,
  usePendingLeadRequestsQuery,
  useRejectLeadRequest,
} from "../../features/leadRequests/leadRequestsQueries";

export default function LeadRequestsList() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, isLoading, isError, refetch } = usePendingLeadRequestsQuery();
  const approveMutation = useApproveLeadRequest();
  const rejectMutation = useRejectLeadRequest();

  const [leads, setLeads] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchLeads = async () => {
      if (!data) return;
      const uniqueIds = [
        ...new Set(data.map((r: any) => r.leadId?._id || r.leadId)),
      ];
      const resList = await Promise.all(
        uniqueIds.map((id) => http.get(`/leads/${id}`).then((res) => res.data))
      );
      const map: Record<string, any> = {};
      resList.forEach((p) => (map[p._id] = p));
      setLeads(map);
    };
    fetchLeads();
  }, [data]);

  const getChipStyle = (status: string) => {
    switch (status) {
      case "VERDE":
        return { bgcolor: "#22c55e", color: "#fff" };
      case "GALBEN":
        return { bgcolor: "#facc15", color: "#000" };
      case "ALB":
        return { bgcolor: "#fff", color: "#000", border: "1px solid #ccc" };
      case "ROSU":
        return { bgcolor: "#ef4444", color: "#fff" };
      default:
        return { bgcolor: "#94a3b8", color: "#fff" };
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "75vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 15px ${accent}11`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
              Cereri de aprobare Lead-uri
            </Typography>

            <Tooltip title="Reîncarcă cererile" arrow>
              <Fab
                onClick={() => refetch()}
                color="info"
                size={isMobile ? "medium" : "large"}
                sx={{
                  boxShadow: `0 0 12px ${theme.palette.info.main}55`,
                }}
              >
                <Refresh
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

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : isError ? (
            <Typography color="error" textAlign="center">
              Eroare la încărcarea cererilor.
            </Typography>
          ) : !data?.length ? (
            <Typography textAlign="center" mt={5}>
              Nu există cereri de aprobare în așteptare 🎉
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {data.map((req: any) => {
                const lead = leads[req.leadId?._id || req.leadId];
                const currentStatus = lead?.status ?? "N/A";
                const requested = req.requestedStatus;
                const requester = req.requestedBy?.name ?? "Necunoscut";
                const created = req.createdAt
                  ? format(new Date(req.createdAt), "dd.MM.yyyy HH:mm")
                  : "—";

                return (
                  <Grid key={req._id} size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        border: `1px solid ${accent}33`,
                        p: 2,
                        boxShadow: `0 0 15px ${accent}11`,
                      }}
                    >
                      <CardContent>
                        <Stack spacing={1}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Cerere trimisă de
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {requester}
                          </Typography>

                          <Typography variant="body2">
                            Lead: <strong>{lead?.name}</strong>
                          </Typography>

                          <Typography variant="body2">
                            Status actual:{" "}
                            <Chip
                              label={currentStatus}
                              size="small"
                              sx={getChipStyle(currentStatus)}
                            />
                          </Typography>

                          <Typography variant="body2">
                            Status cerut:{" "}
                            <Chip
                              label={requested}
                              size="small"
                              sx={getChipStyle(requested)}
                            />
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            Cerut la: {created}
                          </Typography>
                        </Stack>
                      </CardContent>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mt={2}
                        p={2}
                        pt={0}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => approveMutation.mutate(req._id)}
                          disabled={
                            approveMutation.isPending ||
                            rejectMutation.isPending
                          }
                        >
                          Aproba
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => rejectMutation.mutate(req._id)}
                          disabled={
                            approveMutation.isPending ||
                            rejectMutation.isPending
                          }
                        >
                          Respinge
                        </Button>
                      </Stack>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
