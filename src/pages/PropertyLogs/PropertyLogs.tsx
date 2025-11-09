import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Box,
  Container,
  Divider,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import PropertyLogs from "../../components/PropertyLogs/PropertyLogs";
import { usePropertyQuery } from "../../features/properties/propertiesQueries";

const PropertyLogsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams<{ id: string }>();

  const { data: property, isLoading } = usePropertyQuery(id || "");

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
            background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            color: theme.palette.text.primary,
            width: "100%",
            minHeight: "75vh",
            boxShadow: `0 0 25px ${theme.palette.primary.main}22`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: { xs: 2, md: 3 },
              gap: 2,
            }}
          >
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: theme.palette.primary.main,
                "&:hover": { color: theme.palette.primary.dark },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
              Istoric Modificari
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {isLoading ? (
              <Typography>Se incarca log-urile...</Typography>
            ) : !property?.modificationLogs?.length ? (
              <Typography>Nu exista modificari pentru aceasta proprietate.</Typography>
            ) : (
              <PropertyLogs logs={property.modificationLogs} />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PropertyLogsPage;
