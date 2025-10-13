import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PropertiesList } from "../../components/PropertiesList/PropertiesList";

export default function Properties() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h4" mb={3}>
        Proprietati{" "}
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          sx={{ marginLeft: "1rem" }}
          onClick={() => navigate("/properties/add")}
        >
          Adaugă
        </Button>
      </Typography>

      <PropertiesList />
    </Box>
  );
}
