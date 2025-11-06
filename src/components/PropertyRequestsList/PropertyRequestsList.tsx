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
import { format } from "date-fns";
import { Refresh } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  useApproveRequest,
  usePendingRequestsQuery,
  useRejectRequest,
} from "../../features/propertyRequests/propertyRequestsQueries";
import { http } from "../../services/http";
import { getChipColor } from "../../common/utils/get-chip-color.util";
import { getCustomChipStyle } from "../../common/utils/get-custom-chip-style.util";

const PropertyRequestsList = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const accentColor = theme.palette.primary.main;
  const gradientBg = `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`;

  const [properties, setProperties] = useState<Record<string, any>>({});

  const { data, isLoading, isError, refetch } = usePendingRequestsQuery();
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();

  useEffect(() => {
    const fetchProperties = async () => {
      if (!data) return;
      const uniqueIds = [
        ...new Set(data.map((r: any) => r.propertyId?._id || r.propertyId)),
      ];
      const resList = await Promise.all(
        uniqueIds.map((id) =>
          http.get(`/properties/${id}`).then((res) => res.data)
        )
      );
      const map: Record<string, any> = {};
      resList.forEach((p) => (map[p._id] = p));
      setProperties(map);
    };
    fetchProperties();
  }, [data]);

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
            background: gradientBg,
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
              Cereri de aprobare Proprietati
            </Typography>

            <Tooltip title="Reîncarcă cererile" arrow>
              <Fab
                onClick={() => refetch()}
                color="info"
                size={isMobile ? "medium" : "large"}
                sx={{
                  boxShadow: `0 0 12px ${theme.palette.info.main}55`,
                  "&:hover": {
                    backgroundColor: theme.palette.info.dark,
                  },
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
                <CircularProgress color="primary" />
              </Box>
            ) : isError ? (
              <Typography color="error" textAlign="center" mt={5}>
                Eroare la încărcarea cererilor.
              </Typography>
            ) : !data?.length ? (
              <Typography textAlign="center" mt={5}>
                Nu exista cereri de aprobare in asteptare 🎉
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {data.map((req: any) => {
                  const property =
                    properties[req.propertyId?._id || req.propertyId];
                  const currentStatus =
                    property?.generalDetails?.status ?? "N/A";
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
                          background:
                            theme.palette.mode === "dark"
                              ? `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`
                              : `linear-gradient(135deg, ${accentColor}11, ${accentColor}05)`,
                          border: `1px solid ${accentColor}33`,
                          color: theme.palette.text.primary,
                          boxShadow: `0 0 15px ${accentColor}11`,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            boxShadow: `0 0 25px ${accentColor}33`,
                          },
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: 220,
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
                              Proprietate: <strong>{property?.sku}</strong>
                            </Typography>

                            <Typography variant="body2">
                              Status actual:{" "}
                              <Chip
                                label={currentStatus}
                                color={getChipColor(currentStatus)}
                                size="small"
                                sx={getCustomChipStyle(currentStatus)}
                              />
                            </Typography>

                            <Typography variant="body2">
                              Status cerut:{" "}
                              <Chip
                                label={requested}
                                color={getChipColor(requested)}
                                size="small"
                                sx={getCustomChipStyle(requested)}
                              />
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
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
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PropertyRequestsList;
