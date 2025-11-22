import { Notifications, Refresh } from "@mui/icons-material";
import {
  Badge,
  Box,
  Container,
  Divider,
  Fab,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

import ArchivedLeadRequestsList from "@/components/ArchivedLeadRequestsList/ArchivedLeadRequestsList";
import ArchivedPropertyRequestsList from "@/components/ArchivedPropertyRequestsList/ArchivedPropertyRequestsList";
import LeadRequestsList from "@/components/LeadRequestsList/LeadRequestsList";
import PropertyRequestsList from "@/components/PropertyRequestsList/PropertyRequestsList";
import { usePendingLeadRequestsQuery } from "@/features/leadRequests/leadRequestsQueries";
import { usePendingPropertyRequestsQuery } from "@/features/propertyRequests/propertyRequestsQueries";
import { useUserQuery } from "@/features/users/usersQueries";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

const Requests = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const toast = useToast();
  const [tab, setTab] = useState(0);

  const { data: user, error: userError } = useUserQuery();
  const role = user?.role;

  const { data: propertyRequests, refetch: refetchProps } = usePendingPropertyRequestsQuery();
  const { data: leadRequests, refetch: refetchLeads } = usePendingLeadRequestsQuery();

  const totalLeadRequests = leadRequests?.length ?? 0;
  const totalPropertyRequests = propertyRequests?.length ?? 0;
  const totalAll = totalLeadRequests + totalPropertyRequests;

  const handleRefresh = () => {
    refetchProps();
    refetchLeads();
  };

  useEffect(() => {
    if (userError) {
      const axiosErr = userError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea proprietatilor", "error");
    }
  }, [userError, toast]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flex: 1,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            minHeight: "75vh",

            backgroundColor: theme.palette.mode === "dark" ? "#0f1a2e" : "#f4f7fb",

            border:
              theme.palette.mode === "dark"
                ? "1px solid rgba(255,255,255,0.05)"
                : "1px solid rgba(0,0,0,0.08)",

            boxShadow:
              theme.palette.mode === "dark"
                ? `0 0 25px ${theme.palette.primary.main}22`
                : `0 3px 12px rgba(0,0,0,0.06)`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Badge badgeContent={totalAll} color="error" invisible={totalAll === 0}>
                <Notifications color="primary" />
              </Badge>

              <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
                Cereri in asteptare
              </Typography>
            </Box>

            <Tooltip title="Reîncarcă cererile" arrow>
              <Fab onClick={handleRefresh} color="info" size={isMobile ? "medium" : "large"}>
                <Refresh sx={{ color: "white" }} />
              </Fab>
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
              mb: 3,
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, newValue) => setTab(newValue)}
              variant="scrollable"
              scrollButtons={false}
            >
              {role !== "TEAM_LEAD" && (
                <Tab
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                        Lead-uri
                      </Typography>
                      <Badge
                        badgeContent={totalLeadRequests}
                        color="error"
                        invisible={totalLeadRequests === 0}
                        sx={{ "& .MuiBadge-badge": { right: -6 } }}
                      />
                    </Box>
                  }
                />
              )}

              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                      Proprietati
                    </Typography>
                    <Badge
                      badgeContent={totalPropertyRequests}
                      color="error"
                      invisible={totalPropertyRequests === 0}
                      sx={{ "& .MuiBadge-badge": { right: -6 } }}
                    />
                  </Box>
                }
              />

              {role !== "TEAM_LEAD" && <Tab label="Arhive Lead-uri" />}

              <Tab label="Arhive Proprietati" />
            </Tabs>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {tab === 0 && <LeadRequestsList />}
            {tab === 1 && <PropertyRequestsList />}
            {tab === 2 && <ArchivedLeadRequestsList />}
            {tab === 3 && <ArchivedPropertyRequestsList />}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Requests;
