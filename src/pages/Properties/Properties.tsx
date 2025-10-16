import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PropertiesList } from "../../components/PropertiesList/PropertiesList";

export default function Properties() {
  const navigate = useNavigate();
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 32px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 1,
        height: "100%",
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
            background: isDark
              ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
              : `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            color: theme.palette.text.primary,
            width: "100%",
            minHeight: "80vh",
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
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
              flexShrink: 0,
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              Proprietati
            </Typography>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/properties/add")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: theme.palette.success.main,
                color: theme.palette.getContrastText(
                  theme.palette.success.main
                ),
                boxShadow: `0 0 12px ${theme.palette.success.main}44`,
                "&:hover": {
                  backgroundColor: theme.palette.success.dark,
                },
              }}
            >
              Adauga Proprietate
            </Button>
          </Box>

          <Divider
            sx={{
              mb: 3,
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              flexShrink: 0,
            }}
          />

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <PropertiesList />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
