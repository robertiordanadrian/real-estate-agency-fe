import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { SidePanel } from "../../components/SidePanel/SidePanel";

const Dashboard = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <SidePanel />
      <Box sx={{ width: "100%", p: 2, overflowY: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
