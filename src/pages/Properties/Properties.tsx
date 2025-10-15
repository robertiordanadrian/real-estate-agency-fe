import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PropertiesList } from "../../components/PropertiesList/PropertiesList";

export default function Properties() {
  const navigate = useNavigate();

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
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            color: "#e2e8f0",
            width: "100%",
            minHeight: "80vh",
            boxShadow: "0 0 25px rgba(56,189,248,0.15)",
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
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              Proprietati
            </Typography>

            <Button
              variant="contained"
              color="success"
              startIcon={<Add />}
              onClick={() => navigate("/properties/add")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 0 12px rgba(34,197,94,0.3)",
                color: "#ffffff",
              }}
            >
              Adauga Proprietate
            </Button>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box sx={{ mt: 3 }}>
            <PropertiesList />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
