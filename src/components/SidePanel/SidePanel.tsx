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
  Card,
  CardContent,
} from "@mui/material";
import { blue, grey, green, orange } from "@mui/material/colors";
import {
  Logout,
  RealEstateAgent,
  Dashboard,
  Settings,
  PersonAdd,
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "CEO":
        return blue[500];
      case "MANAGER":
        return orange[500];
      case "AGENT":
        return green[500];
      default:
        return green[500];
    }
  };

  const getRoleDisplayText = (role: string) => {
    switch (role) {
      case "CEO":
        return "Chief Executive Officer";
      case "MANAGER":
        return "Property Manager";
      case "AGENT":
        return "Real Estate Agent";
      default:
        return "User";
    }
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
        <Card
          sx={{
            mb: 5,
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            overflow: "visible",
            position: "relative",
          }}
        >
          <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Box sx={{ position: "relative", mb: 2 }}>
                <Avatar
                  src={user?.profilePicture}
                  sx={{
                    width: 80,
                    height: 80,
                    border: `3px solid ${getRoleColor(user?.role || "")}`,
                    bgcolor: blue[400],
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Typography>
                </Avatar>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: "#22c55e",
                    border: "2px solid #0f172a",
                    boxShadow: "0 2px 8px rgba(34, 197, 94, 0.4)",
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  background: "linear-gradient(45deg, #e2e8f0, #f8fafc)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                {user?.name ?? "User"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: grey[300],
                  mb: 1,
                  fontSize: "0.9rem",
                }}
              >
                {user?.email ?? "user@example.com"}
              </Typography>

              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 4,
                  bgcolor: getRoleColor(user?.role || ""),
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "white",
                    opacity: 0.8,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {getRoleDisplayText(user?.role || "")}
                </Typography>
              </Box>
            </Box>
          </CardContent>

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${getRoleColor(
                user?.role || ""
              )}, transparent)`,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />
        </Card>

        <List>
          {[
            { icon: <Dashboard />, label: "Dashboard", path: "/" },
            {
              icon: <RealEstateAgent />,
              label: "Proprietati",
              path: "/properties",
            },
            ...(user?.role === "CEO"
              ? [
                  {
                    icon: <PersonAdd />,
                    label: "Inregistrare Agent",
                    path: "/register",
                  },
                ]
              : []),
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
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    },
                    transition: "all 0.2s ease-in-out",
                    border: isActive(item.path)
                      ? "1px solid rgba(96,165,250,0.3)"
                      : "1px solid transparent",
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
                      fontSize: "0.95rem",
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
              "&:hover": {
                backgroundColor: "rgba(255,59,48,0.2)",
                color: "#ff3b30",
              },
              fontWeight: 500,
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.2s ease-in-out",
            }}
          >
            {isPending ? "Deconectare..." : "Deconectare"}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};
