import {
  ContactPhone,
  Dashboard,
  Logout,
  Notifications,
  Person,
  PersonAdd,
  RealEstateAgent,
  Settings,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { getRoleColor } from "@/common/utils/get-role-color.util";
import { getRoleDisplayText } from "@/common/utils/get-role-display-text.util";
import { useToast } from "@/context/ToastContext";
import { useLogout } from "@/features/auth/authMutations";
import { usePendingLeadRequestsQuery } from "@/features/leadRequests/leadRequestsQueries";
import { usePendingPropertyRequestsQuery } from "@/features/propertyRequests/propertyRequestsQueries";
import { useUserQuery } from "@/features/users/usersQueries";
import { useUnseenLeadsCount } from "@/features/leads/leadsQueries";

interface SidePanelProps {
  onNavigate?: () => void;
}

// =========
// ✅ READY
// =========
const SidePanel = ({ onNavigate }: SidePanelProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const toast = useToast();

  const logoSrc = isDark ? "/white-logo.svg" : "/black-logo.svg";

  const panelBg = isDark
    ? "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
    : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)";

  const textColor = theme.palette.text.primary;
  const iconActive = theme.palette.primary.main;
  const iconInactive = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
  const cardGlass = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const borderGlass = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)";

  const location = useLocation();
  const { data: user, error: usersError } = useUserQuery();
  const { mutate: logout, isPending } = useLogout();
  const { data: unseenLeads } = useUnseenLeadsCount(!!user);
  const unseenLeadsCount = unseenLeads?.count ?? 0;
  const isManagerOrCeo = user?.role === "CEO" || user?.role === "MANAGER";

  const { data: pendingRequests, error: pendingPropertyRequestsError } =
    usePendingPropertyRequestsQuery({
      enabled: isManagerOrCeo,
    });

  const { data: pendingLeadRequests, error: pendingLeadRequestsError } =
    usePendingLeadRequestsQuery({
      enabled: isManagerOrCeo,
    });

  const pendingLeadCount = pendingLeadRequests?.length ?? 0;
  const pendingCount = pendingRequests?.length ?? 0;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    if (pendingLeadRequestsError) {
      const axiosErr = pendingLeadRequestsError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea cererilor de leads", "error");
    }
  }, [pendingLeadRequestsError, toast]);

  useEffect(() => {
    if (usersError) {
      const axiosErr = usersError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea utilizatorilor", "error");
    }
  }, [usersError, toast]);

  useEffect(() => {
    if (pendingPropertyRequestsError) {
      const axiosErr = pendingPropertyRequestsError as AxiosError<{ message?: string }>;
      toast(
        axiosErr.response?.data?.message || "Eroare la incarcarea cererilor de proprietate",
        "error",
      );
    }
  }, [pendingPropertyRequestsError, toast]);

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
        p: 3,
        boxShadow: isDark ? "4px 0 15px rgba(0, 0, 0, 0.4)" : "4px 0 15px rgba(0, 0, 0, 0.1)",
        overflowY: "auto",
      }}
    >
      <Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mb: 5,
            mt: 1,
          }}
        >
          <motion.img
            src={logoSrc}
            alt="Company Logo"
            style={{
              width: "130px",
              height: "auto",
              cursor: "pointer",
              opacity: 0.95,
            }}
            whileHover={{ scale: 1.04, opacity: 1 }}
            transition={{ duration: 0.25 }}
          />
        </Box>

        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            background: cardGlass,
            backdropFilter: "blur(10px)",
            border: borderGlass,
            boxShadow: isDark ? "0 6px 24px rgba(0,0,0,0.25)" : "0 6px 18px rgba(0,0,0,0.08)",
            position: "relative",
            overflow: "hidden",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Avatar
                src={user?.profilePicture}
                sx={{
                  width: 64,
                  height: 64,
                  border: `3px solid ${getRoleColor(user?.role || "")}`,
                  bgcolor: blue[400],
                  boxShadow: `0 0 18px ${getRoleColor(user?.role || "")}44`,
                  fontSize: "1.4rem",
                  fontWeight: 700,
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Avatar>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  border: `2px solid ${isDark ? theme.palette.background.default : "#fff"}`,
                  boxShadow: "0 0 6px rgba(34,197,94,0.5)",
                }}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 0.2,
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name ?? "User"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: isDark ? "#cbd5e1" : "#475569",
                  mb: 0.3,
                  lineHeight: 1.1,
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email ?? "user@example.com"}
              </Typography>

              <Box
                sx={{
                  px: 1,
                  py: 0.2,
                  borderRadius: 2,
                  bgcolor: getRoleColor(user?.role || ""),
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.4,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 4,
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
                    fontSize: { xs: "0.55rem", sm: "0.65rem" },
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  {getRoleDisplayText(user?.role || "")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>

        <List>
          {[
            { icon: <Dashboard />, label: "Dashboard", path: "/" },

            {
              icon: (
                <Badge
                  color="error"
                  badgeContent={unseenLeadsCount}
                  invisible={unseenLeadsCount === 0}
                >
                  <ContactPhone />
                </Badge>
              ),
              label: "Leads",
              path: "/leads",
            },

            {
              icon: <RealEstateAgent />,
              label: "Proprietati",
              path: "/properties",
            },

            ...(user?.role !== "AGENT"
              ? [
                  {
                    icon: (
                      <Badge
                        badgeContent={(pendingLeadCount ?? 0) + (pendingCount ?? 0)}
                        color="error"
                        invisible={pendingLeadCount + pendingCount === 0}
                      >
                        <Notifications />
                      </Badge>
                    ),
                    label: "Cereri",
                    path: "/requests",
                  },
                ]
              : []),

            ...(user?.role === "CEO"
              ? [
                  {
                    icon: <PersonAdd />,
                    label: "Inregistrare Agent",
                    path: "/register",
                  },
                  { icon: <Person />, label: "Agenti", path: "/agents" },
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
                    backgroundColor: isActive(item.path) ? `${iconActive}11` : "transparent",
                    "&:hover": {
                      backgroundColor: `${iconActive}1A`,
                      transform: "translateY(-1px)",
                      boxShadow: isDark
                        ? "0 4px 12px rgba(0,0,0,0.3)"
                        : "0 4px 12px rgba(0,0,0,0.1)",
                    },
                    border: isActive(item.path)
                      ? `1px solid ${iconActive}33`
                      : "1px solid transparent",
                    transition: "all 0.2s ease-in-out",
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
              backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
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
