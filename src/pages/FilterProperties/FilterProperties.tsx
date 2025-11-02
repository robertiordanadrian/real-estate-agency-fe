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
} from "@mui/material";
import { Home, Refresh } from "@mui/icons-material";
import { useMemo, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ECategory } from "../../common/enums/general-details.enums";
import { FilterPropertiesList } from "../../components/FilterPropertiesList/FilterPropertiesList";
import { useFilterPropertiesQuery } from "../../features/filterProperties/filterPropertiesQueries";
import {
  useUserQuery,
  useAllUsersQuery,
} from "../../features/users/usersQueries";
import type { IUser } from "../../common/interfaces/user.interface";

export default function FilterProperties() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const qc = useQueryClient();

  const { data: currentUser } = useUserQuery();
  const { data: allUsers, isLoading: loadingUsers } = useAllUsersQuery();

  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>();

  const agentOptions = useMemo((): {
    id: string;
    name: string;
    role: string;
  }[] => {
    if (!currentUser) return [];

    if (currentUser.role === "CEO") {
      return (
        allUsers?.map((u: IUser) => ({
          id: u._id,
          name: u.name,
          role: u.role,
        })) ?? []
      );
    }

    if (currentUser.role === "MANAGER") {
      return (
        allUsers
          ?.filter(
            (u: IUser) => u.role === "AGENT" || u._id === currentUser._id
          )
          .map((u: IUser) => ({
            id: u._id,
            name: u.name,
            role: u.role,
          })) ?? []
      );
    }

    return [
      { id: currentUser._id, name: currentUser.name, role: currentUser.role },
    ];
  }, [currentUser, allUsers]);

  useEffect(() => {
    if (currentUser) {
      setSelectedAgentId(currentUser._id);
    }
  }, [currentUser]);

  const {
    data: allProperties,
    isLoading,
    error,
  } = useFilterPropertiesQuery(selectedCategory, selectedAgentId);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    allProperties?.forEach((p) => {
      const cat = p.generalDetails?.category || "Necunoscut";
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, [allProperties]);

  const isAgentReadonly = currentUser?.role === "AGENT";

  const handleRefresh = () => {
    qc.invalidateQueries({ queryKey: ["filterProperties"] });
  };

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
                Filtru Proprietati
              </Typography>
            </Box>

            <Tooltip title="Reîncarcă lista" arrow>
              <Fab
                color="info"
                size={isMobile ? "medium" : "large"}
                onClick={handleRefresh}
                sx={{
                  boxShadow: `0 0 12px ${theme.palette.info.main}55`,
                  "&:hover": {
                    backgroundColor: theme.palette.info.dark,
                  },
                }}
              >
                <Refresh
                  sx={{ color: "white", fontSize: isMobile ? 22 : 26 }}
                />
              </Fab>
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

          {loadingUsers ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={3}
            >
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="agent-select-label">Selecteaza agent</InputLabel>
              <Select
                labelId="agent-select-label"
                value={selectedAgentId ?? ""}
                label="Selectează agent"
                onChange={(e) => setSelectedAgentId(e.target.value)}
                disabled={isAgentReadonly}
              >
                {agentOptions.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {agent.name}
                      </Typography>
                      <Chip
                        label={agent.role}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              mb: 3,
            }}
          >
            {Object.values(ECategory).map((cat) => (
              <Chip
                key={cat}
                label={`${cat} - ${counts[cat] ?? 0}`}
                color={selectedCategory === cat ? "primary" : "default"}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === cat ? undefined : cat
                  )
                }
                sx={{
                  fontWeight: 500,
                  cursor: "pointer",
                  px: 1,
                }}
              />
            ))}
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
            />
          )}
        </Paper>
      </Container>
    </Box>
  );
}
