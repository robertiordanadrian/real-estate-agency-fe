import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Chip,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Fab,
  CircularProgress,
  useMediaQuery,
  Button,
  Drawer,
} from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ECategory, EStatus } from "../../common/enums/general-details.enums";
import FilterPropertiesList from "../../components/FilterPropertiesList/FilterPropertiesList";
import { useFilterPropertiesQuery } from "../../features/filterProperties/filterPropertiesQueries";
import {
  useUserQuery,
  useAllUsersQuery,
} from "../../features/users/usersQueries";
import type { IUser } from "../../common/interfaces/user.interface";
import { useNavigate } from "react-router-dom";
import { Add, FilterList } from "@mui/icons-material";

type ContractFilter = "CONTRACT" | "NO_CONTRACT";

const Properties = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const qc = useQueryClient();
  const navigate = useNavigate();

  const contractFilterOptions: { key: ContractFilter; label: string }[] = [
    { key: "CONTRACT", label: "Contract" },
    { key: "NO_CONTRACT", label: "Fără contract" },
  ];

  const { data: currentUser } = useUserQuery();
  const { data: allUsers, isLoading: loadingUsers } = useAllUsersQuery();

  const isAgentReadonly = currentUser?.role === "AGENT";

  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [selectedContract, setSelectedContract] = useState<
    ContractFilter | undefined
  >();
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState<string | undefined>();
  const [tempStatus, setTempStatus] = useState<string | undefined>();
  const [tempContract, setTempContract] = useState<
    ContractFilter | undefined
  >();
  const [tempAgentId, setTempAgentId] = useState<string | undefined>();

  const {
    data: allProperties,
    isLoading,
    error,
  } = useFilterPropertiesQuery(selectedCategory, selectedAgentId);

  const agentOptions = useMemo((): {
    id: string;
    name: string;
    role: string;
  }[] => {
    if (!currentUser || !allUsers) return [];

    const me = {
      id: currentUser._id,
      name: currentUser.name,
      role: currentUser.role,
    };

    if (currentUser.role === "CEO") {
      return allUsers.map((u: IUser) => ({
        id: u._id,
        name: u.name,
        role: u.role,
      }));
    }

    if (currentUser.role === "MANAGER") {
      return allUsers
        .filter((u: IUser) =>
          ["MANAGER", "TEAM_LEAD", "AGENT"].includes(u.role)
        )
        .map((u: IUser) => ({
          id: u._id,
          name: u.name,
          role: u.role,
        }));
    }

    if (currentUser.role === "TEAM_LEAD") {
      return allUsers
        .filter((u: IUser) => ["TEAM_LEAD", "AGENT"].includes(u.role))
        .map((u: IUser) => ({
          id: u._id,
          name: u.name,
          role: u.role,
        }));
    }

    if (currentUser.role === "AGENT") {
      return [me];
    }

    return [me];
  }, [currentUser, allUsers]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    allProperties?.forEach((p) => {
      const cat = p.generalDetails?.category || "Necunoscut";
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, [allProperties]);

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    allProperties?.forEach((p) => {
      const st = p.generalDetails?.status || "Necunoscut";
      map[st] = (map[st] || 0) + 1;
    });
    return map;
  }, [allProperties]);

  const contractCounts = useMemo(() => {
    const map = { CONTRACT: 0, NO_CONTRACT: 0 };

    allProperties?.forEach((p) => {
      const hasContract =
        !!p.price?.contact?.contractFile && p.price.contact.contractFile !== "";

      if (hasContract) map.CONTRACT++;
      else map.NO_CONTRACT++;
    });

    return map;
  }, [allProperties]);

  const applyFilters = () => {
    setSelectedCategory(tempCategory);
    setSelectedStatus(tempStatus);
    setSelectedContract(tempContract);
    setSelectedAgentId(tempAgentId);

    setFilterOpen(false);
  };

  useEffect(() => {
    if (filterOpen) {
      setTempCategory(selectedCategory);
      setTempStatus(selectedStatus);
      setTempContract(selectedContract);
      setTempAgentId(selectedAgentId);
    }
  }, [filterOpen]);

  useEffect(() => {
    if (currentUser) {
      setSelectedAgentId(currentUser._id);
    }
  }, [currentUser]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
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
          boxSizing: "border-box",
          minHeight: 0,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            background: isDark
              ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
              : `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            color: theme.palette.text.primary,
            width: "100%",
            minHeight: "75vh",
            boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 15px ${accent}11`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: { xs: 2, md: 3 },
              flexDirection: { xs: "row", sm: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight={600}
                sx={{ textAlign: "left" }}
              >
                Proprietati
              </Typography>
            </Box>

            <Tooltip title="Adauga proprietate" arrow>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Fab
                  color="success"
                  onClick={() => navigate("/properties/add")}
                  size={isMobile ? "medium" : "large"}
                >
                  <Add sx={{ color: "white", fontSize: isMobile ? 24 : 28 }} />
                </Fab>

                <Fab
                  color="info"
                  onClick={() => setFilterOpen(true)}
                  size={isMobile ? "medium" : "large"}
                >
                  <FilterList
                    sx={{ color: "white", fontSize: isMobile ? 24 : 28 }}
                  />
                </Fab>
              </Box>
            </Tooltip>
          </Box>

          <Divider
            sx={{
              mb: 3,
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
            }}
          />

          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          ) : error ? (
            <Typography color="error" textAlign="center">
              Eroare la incarcare.
            </Typography>
          ) : (
            <FilterPropertiesList
              selectedCategory={selectedCategory}
              selectedAgentId={selectedAgentId}
              selectedStatus={selectedStatus}
              selectedContract={selectedContract}
            />
          )}
        </Paper>
        <Drawer
          anchor="right"
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          slotProps={{
            paper: {
              sx: {
                width: { xs: "100%", sm: 420 },
                display: "flex",
                flexDirection: "column",
              },
            },
          }}
        >
          {/* HEADER */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Filtre Proprietăți
            </Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              pb: 12,
            }}
          >
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="agent-filter-label">Agent</InputLabel>
              <Select
                labelId="agent-filter-label"
                value={tempAgentId ?? ""}
                label="Agent"
                onChange={(e) => setTempAgentId(e.target.value)}
                disabled={isAgentReadonly}
              >
                {agentOptions.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography>{agent.name}</Typography>
                      <Chip
                        label={agent.role}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={accent}
              mb={1}
            >
              Tip Proprietate
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
              {Object.values(ECategory).map((cat) => (
                <Chip
                  key={cat}
                  label={`${cat} - ${counts[cat] ?? 0}`}
                  color={tempCategory === cat ? "primary" : "default"}
                  onClick={() =>
                    setTempCategory((prev) => (prev === cat ? undefined : cat))
                  }
                />
              ))}
            </Box>

            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={accent}
              mb={1}
            >
              Status Proprietate
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
              {Object.values(EStatus).map((status) => (
                <Chip
                  key={status}
                  label={`${status} - ${statusCounts[status] ?? 0}`}
                  color={tempStatus === status ? "primary" : "default"}
                  onClick={() =>
                    setTempStatus((prev) =>
                      prev === status ? undefined : status
                    )
                  }
                />
              ))}
            </Box>

            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={accent}
              mb={1}
            >
              Contract
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
              {contractFilterOptions.map((item) => (
                <Chip
                  key={item.key}
                  label={`${item.label} - ${contractCounts[item.key]}`}
                  color={tempContract === item.key ? "primary" : "default"}
                  onClick={() =>
                    setTempContract((prev) =>
                      prev === item.key ? undefined : item.key
                    )
                  }
                />
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              p: 3,
              borderTop: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)"
              }`,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              position: "sticky",
              bottom: 0,
              backgroundColor: theme.palette.background.paper,
              zIndex: 10,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setFilterOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={applyFilters}
            >
              Aplica filtre
            </Button>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};

export default Properties;
