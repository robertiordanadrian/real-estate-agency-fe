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
  useTheme,
  Badge,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import {
  Logout,
  RealEstateAgent,
  Dashboard,
  Settings,
  PersonAdd,
  ContactPhone,
  Person,
  FilterAlt,
  Notifications,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { useLogout } from "../../features/auth/authMutations";
import { useUserQuery } from "../../features/users/usersQueries";
import { usePendingRequestsQuery } from "../../features/propertyRequests/propertyRequestsQueries";
import { usePendingLeadRequestsQuery } from "../../features/leadRequests/leadRequestsQueries";
import { getRoleColor } from "../../common/utils/get-role-color.util";
import { getRoleDisplayText } from "../../common/utils/get-role-display-text.util";

interface SidePanelProps {
  onNavigate?: () => void;
}

const SidePanel = ({ onNavigate }: SidePanelProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const panelBg = isDark
    ? "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
    : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)";

  const textColor = theme.palette.text.primary;
  const iconActive = theme.palette.primary.main;
  const iconInactive = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
  const cardGlass = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const borderGlass = isDark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(0,0,0,0.08)";
  const location = useLocation();

  const { data: user } = useUserQuery();
  const { mutate: logout, isPending } = useLogout();
  const { data: pendingRequests } = usePendingRequestsQuery();
  const { data: pendingLeadRequests } = usePendingLeadRequestsQuery();

  const pendingLeadCount = pendingLeadRequests?.length ?? 0;
  const pendingCount = pendingRequests?.length ?? 0;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: panelBg,
        color: textColor,
        boxShadow: isDark
          ? "4px 0 15px rgba(0, 0, 0, 0.4)"
          : "4px 0 15px rgba(0, 0, 0, 0.1)",
        p: 3,
      }}
    >
      <Box>
        <Card
          sx={{
            mb: 5,
            borderRadius: 3,
            borderTopLeftRadius: 0,
            background: cardGlass,
            backdropFilter: "blur(10px)",
            border: borderGlass,
            boxShadow: isDark
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.05)",
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
                    boxShadow: `0 0 20px ${getRoleColor(user?.role || "")}44`,
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
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
                    border: `2px solid ${isDark ? "#0f172a" : "#f8fafc"}`,
                    boxShadow: "0 0 8px rgba(34,197,94,0.4)",
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  background: isDark
                    ? "linear-gradient(45deg, #e2e8f0, #38bdf8)"
                    : "linear-gradient(45deg, #0f172a, #2563eb)",
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
                  color: isDark ? "#cbd5e1" : "#475569",
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
            { icon: <ContactPhone />, label: "Leads", path: "/leads" },
            {
              icon: <RealEstateAgent />,
              label: "Proprietati",
              path: "/properties",
            },

            ...(user?.role === "CEO" ||
            user?.role === "MANAGER" ||
            user?.role === "TEAM_LEAD"
              ? [
                  {
                    icon: (
                      <Badge
                        badgeContent={pendingCount}
                        color="error"
                        invisible={pendingCount === 0}
                      >
                        <Notifications />
                      </Badge>
                    ),
                    label: "Cereri Proprietati",
                    path: "/property-requests",
                  },
                ]
              : []),

            ...(user?.role === "CEO" || user?.role === "MANAGER"
              ? [
                  {
                    icon: (
                      <Badge
                        badgeContent={pendingLeadCount}
                        color="error"
                        invisible={pendingLeadCount === 0}
                      >
                        <Notifications />
                      </Badge>
                    ),
                    label: "Cereri Lead-uri",
                    path: "/lead-requests",
                  },
                ]
              : []),

            {
              icon: <FilterAlt />,
              label: "Filtreaza Proprietati",
              path: "/filter-properties",
            },

            ...(user?.role === "CEO"
              ? [
                  {
                    icon: <PersonAdd />,
                    label: "Inregistrare Agent",
                    path: "/register",
                  },
                  {
                    icon: <Person />,
                    label: "Agenti",
                    path: "/agents",
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
                  onClick={() => onNavigate?.()}
                  sx={{
                    borderRadius: 2,
                    color: isActive(item.path) ? iconActive : iconInactive,
                    backgroundColor: isActive(item.path)
                      ? `${iconActive}11`
                      : "transparent",
                    "&:hover": {
                      backgroundColor: `${iconActive}1A`,
                      transform: "translateY(-1px)",
                      boxShadow: isDark
                        ? "0 4px 12px rgba(0,0,0,0.3)"
                        : "0 4px 12px rgba(0,0,0,0.1)",
                    },
                    transition: "all 0.2s ease-in-out",
                    border: isActive(item.path)
                      ? `1px solid ${iconActive}33`
                      : "1px solid transparent",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? iconActive : iconInactive,
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
              color: isDark ? "white" : "#0f172a",
              textTransform: "none",
              borderRadius: 2,
              py: 1.2,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
              "&:hover": {
                backgroundColor: "rgba(255,59,48,0.15)",
                color: "#ff3b30",
              },
              fontWeight: 500,
              border: borderGlass,
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

export default SidePanel;
