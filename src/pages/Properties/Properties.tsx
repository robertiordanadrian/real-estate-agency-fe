import { Box, Button, Typography } from "@mui/material";
import { PropertiesList } from "../../components/Properties/PropertiesList/PropertiesList";
// Remove the PropertyProvider import from here
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
          Adauga
        </Button>
      </Typography>
      <PropertiesList></PropertiesList>
    </Box>
  );
}
