import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Logout, RealEstateAgent } from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";
import { NavLink, useLocation } from "react-router-dom";

export const SidePanel = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box
      sx={{
        width: "15%",
        minWidth: 250,
        boxShadow: "4px 0 15px rgba(0, 0, 0, 0.5)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        p: 4,
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 6 }}>
        <Avatar sx={{ bgcolor: blue[200], mr: 1.5 }}>{user?.name?.[0]}</Avatar>
        <Box sx={{ fontWeight: 500 }}>{user?.name}</Box>
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/properties"
            sx={{
              bgcolor: isActive("/properties") ? "action.hover" : "inherit",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemIcon>
              <RealEstateAgent />
            </ListItemIcon>
            <ListItemText primary="Properties" />
          </ListItemButton>
        </ListItem>
      </List>

      <Button
        variant="text"
        onClick={logout}
        startIcon={<Logout />}
        sx={{ position: "absolute", bottom: 20, left: 20, right: 20 }}
      >
        Logout
      </Button>
    </Box>
  );
};
