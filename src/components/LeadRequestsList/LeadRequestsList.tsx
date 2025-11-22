import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Box,
  capitalize,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ILead } from "@/common/interfaces/lead/lead.interface";
import { getCustomChipStyle } from "@/common/utils/get-custom-chip-style.util";
import {
  useApproveLeadRequest,
  usePendingLeadRequestsQuery,
  useRejectLeadRequest,
} from "@/features/leadRequests/leadRequestsQueries";
import { useLeadsQuery } from "@/features/leads/leadsQueries";
import { useAllUsersQuery } from "@/features/users/usersQueries";
import { ISortState } from "@/common/interfaces/sorting/sort.interface";
import { IUserLite } from "@/common/interfaces/user/user-lite.interface";
import { IdRef } from "@/common/interfaces/property/archieved-property-request.interface";
import { ILeadRequest } from "@/common/interfaces/lead/lead-request.interface";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

const LeadRequestsList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const toast = useToast();

  const rowsPerPage = 10;

  const [sort, setSort] = useState<ISortState>({
    field: "createdAt",
    direction: "desc",
  });
  const [page, setPage] = useState(0);

  const { data: requests, isLoading, error: requestsError } = usePendingLeadRequestsQuery();
  const { data: leads, error: leadsError } = useLeadsQuery();
  const { data: users, error: usersError } = useAllUsersQuery();

  const approveMutation = useApproveLeadRequest();
  const rejectMutation = useRejectLeadRequest();

  const leadsMap = useMemo(() => {
    const map: Record<string, ILead> = {};
    (leads ?? []).forEach((l) => (map[l._id!] = l));
    return map;
  }, [leads]);

  const usersMap = useMemo(() => {
    const map: Record<string, IUserLite> = {};
    (users ?? []).forEach((u: IUserLite) => {
      if (u._id) map[u._id] = u;
    });
    return map;
  }, [users]);

  const getId = (val: string | IdRef | undefined): string =>
    typeof val === "string" ? val : (val?._id ?? "");

  const getUserName = (raw: string | IdRef | undefined): string => {
    const id = getId(raw);
    const u = usersMap[id];
    return u?.name ?? "-";
  };

  const getLeadName = (item: ILeadRequest): string => {
    const id = getId(item.leadId);
    return leadsMap[id]?.name || "-";
  };

  const toggleSort = (field: string) => {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "asc" },
    );
    setPage(0);
  };

  const headers = [
    { label: "Lead", key: "lead" },
    { label: "Solicitat de", key: "requestedBy" },
    { label: "Status cerut", key: "requestedStatus" },
    { label: "Creat la", key: "createdAt" },
    { label: "Actiuni", key: null },
  ];

  const renderSortIcon = (k: string | null) => {
    if (!k) return null;
    if (sort.field !== k) return <ArrowUpwardIcon sx={{ fontSize: 12, opacity: 0.3, ml: 0.5 }} />;
    return sort.direction === "asc" ? (
      <ArrowUpwardIcon sx={{ fontSize: 12, color: accent, ml: 0.5 }} />
    ) : (
      <ArrowDownwardIcon sx={{ fontSize: 12, color: accent, ml: 0.5 }} />
    );
  };

  const getComparable = (item: ILeadRequest, key: string) => {
    switch (key) {
      case "lead":
        return getLeadName(item).toLowerCase();
      case "requestedBy":
        return getUserName(item.requestedBy).toLowerCase();
      case "requestedStatus":
        return item.requestedStatus.toLowerCase();
      case "createdAt":
        return item.createdAt ? Date.parse(item.createdAt) : -Infinity;
      default:
        return "";
    }
  };

  const sortedData = useMemo(() => {
    const list = (requests ?? []) as ILeadRequest[];
    return [...list].sort((a, b) => {
      const av = getComparable(a, sort.field);
      const bv = getComparable(b, sort.field);
      if (av === bv) return 0;
      return sort.direction === "asc" ? (av < bv ? -1 : 1) : av > bv ? -1 : 1;
    });
  }, [requests, sort, usersMap, leadsMap]);

  const paginated = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    if (requestsError) {
      const axiosErr = requestsError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea cererilor arhivate", "error");
    }
  }, [requestsError, toast]);

  useEffect(() => {
    if (usersError) {
      const axiosErr = usersError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea utilizatorilor", "error");
    }
  }, [usersError, toast]);

  useEffect(() => {
    if (leadsError) {
      const axiosErr = leadsError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea cererilor", "error");
    }
  }, [leadsError, toast]);

  if (isLoading)
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!sortedData.length)
    return (
      <Typography mt={2} textAlign="center" color="text.secondary">
        Nu exista cereri.
      </Typography>
    );

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <Paper
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "hidden",
          background: isDark
            ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
            : theme.palette.background.paper,
          boxShadow: isDark ? `0 0 25px ${accent}11` : `0 0 10px ${accent}11`,
        }}
      >
        <TableContainer
          sx={{
            flex: 1,
            minHeight: 0,
            overflowX: "auto",
            "&::-webkit-scrollbar": { height: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: accent,
              borderRadius: 8,
            },
            "& *": { whiteSpace: "nowrap" },
          }}
        >
          <Table stickyHeader sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                {headers.map((h) => (
                  <TableCell
                    key={h.label}
                    onClick={() => h.key && toggleSort(h.key)}
                    sx={{
                      fontWeight: 600,
                      cursor: h.key ? "pointer" : "default",
                      color: accent,
                      backgroundColor: theme.palette.background.paper,
                      borderBottom: `1px solid ${accent}22`,
                      userSelect: "none",
                      fontSize: "0.85rem",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {h.label}
                      {renderSortIcon(h.key)}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((row) => {
                const leadId = getId(row.leadId);

                return (
                  <TableRow
                    key={row._id}
                    hover
                    sx={{ "&:hover": { backgroundColor: `${accent}11` } }}
                  >
                    <TableCell
                      sx={{
                        color: accent,
                        fontWeight: 700,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                        fontSize: "0.85rem",
                      }}
                      onClick={() => navigate(`/leads/${leadId}/edit`)}
                    >
                      {getLeadName(row)}
                    </TableCell>

                    <TableCell sx={{ fontSize: "0.85rem" }}>
                      {getUserName(row.requestedBy)}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={capitalize(row.requestedStatus)}
                        size="small"
                        sx={getCustomChipStyle(capitalize(row.requestedStatus))}
                      />
                    </TableCell>

                    <TableCell sx={{ fontSize: "0.85rem" }}>
                      {row.createdAt ? new Date(row.createdAt).toLocaleString("ro-RO") : "-"}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.3 }}>
                        <Tooltip title="Aproba">
                          <span>
                            <IconButton
                              color="success"
                              size="small"
                              onClick={() => approveMutation.mutate(row._id)}
                            >
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Respinge">
                          <span>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => rejectMutation.mutate(row._id)}
                            >
                              <CancelOutlinedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ borderTop: `1px solid ${accent}22` }}>
          <TablePagination
            component="div"
            count={sortedData.length}
            page={page}
            onPageChange={(_, np) => setPage(np)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
            sx={{ "& .MuiTablePagination-actions button": { color: accent } }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default LeadRequestsList;
