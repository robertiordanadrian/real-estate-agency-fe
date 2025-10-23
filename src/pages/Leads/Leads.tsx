import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { LeadsList } from "../../components/LeadsList/LeadsList";

export default function Leads() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 32px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: { xs: 2, md: 3 },
        px: { xs: 2, sm: 3 },
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
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
              alignItems: { xs: "stretch", sm: "center" },
              mb: { xs: 2, md: 3 },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight={600}
              sx={{ textAlign: { xs: "center", sm: "left" } }}
            >
              Leads
            </Typography>

            <Button
              variant="contained"
              startIcon={<Refresh />}
              fullWidth={isMobile}
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["leads"] })
              }
              sx={{
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: theme.palette.info.main,
                color: theme.palette.getContrastText(theme.palette.info.main),
                boxShadow: `0 0 12px ${theme.palette.info.main}44`,
                "&:hover": {
                  backgroundColor: theme.palette.info.dark,
                },
              }}
            >
              Reîncarcă
            </Button>
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

          <Box sx={{ flex: 1, overflow: "hidden", borderRadius: 2 }}>
            <LeadsList />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
