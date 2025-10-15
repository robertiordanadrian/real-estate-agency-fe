import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import {
  Logout,
  RealEstateAgent,
  Dashboard,
  Settings,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { useLogout } from "../../features/auth/authMutations";
import { useUserQuery } from "../../features/users/usersQueries";

export const SidePanel = () => {
  const { data: user } = useUserQuery();
  const { mutate: logout, isPending } = useLogout();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };
  return (
    <Box
      sx={{
        width: 400,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        boxShadow: "4px 0 15px rgba(0, 0, 0, 0.4)",
        p: 3,
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 5,
            p: 2,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={user?.profilePicture}
              sx={{
                width: 56,
                height: 56,
                border: "2px solid #60a5fa",
                bgcolor: blue[400],
              }}
            >
              <Typography>{user?.name ?? "User"}</Typography>
            </Avatar>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#22c55e",
                border: "2px solid #0f172a",
              }}
            />
          </Box>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.name ?? "User"}
            </Typography>
            {user?.role && (
              <Typography
                variant="body2"
                sx={{
                  color: grey[400],
                  textTransform: "capitalize",
                  fontSize: 13,
                }}
              >
                {user.role.toUpperCase()}
              </Typography>
            )}
          </Box>
        </Box>

        <List>
          {[
            { icon: <Dashboard />, label: "Dashboard", path: "/" },
            {
              icon: <RealEstateAgent />,
              label: "Proprietati",
              path: "/properties",
            },
            { icon: <Settings />, label: "Setari", path: "/settings" },
          ].map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: "100%" }}
              >
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    color: isActive(item.path)
                      ? blue[200]
                      : "rgba(255,255,255,0.85)",
                    backgroundColor: isActive(item.path)
                      ? "rgba(96,165,250,0.1)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(96,165,250,0.15)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path)
                        ? blue[300]
                        : "rgba(255,255,255,0.7)",
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </motion.div>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: "auto", pt: 3 }}>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={() => logout()}
            startIcon={<Logout />}
            disabled={isPending}
            fullWidth
            sx={{
              color: "white",
              textTransform: "none",
              borderRadius: 2,
              py: 1.2,
              backgroundColor: "rgba(255,255,255,0.08)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
              fontWeight: 500,
            }}
          >
            {isPending ? "Logging out..." : "Logout"}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};
