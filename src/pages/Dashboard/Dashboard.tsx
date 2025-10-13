import { Box, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" mb={2}>
        Bine ai venit în Dashboard
      </Typography>
      <Typography variant="body1">
        Aici poți gestiona proprietatile, proprietarii și datele contului.
      </Typography>
    </Box>
  );
};

export default Dashboard;
