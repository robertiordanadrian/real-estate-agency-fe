import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Box,
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

import { getChipColor } from "@/common/utils/get-chip-color.util";
import { getCustomChipStyle } from "@/common/utils/get-custom-chip-style.util";
import {
  useApproveRequest,
  usePendingPropertyRequestsQuery,
  useRejectRequest,
} from "@/features/propertyRequests/propertyRequestsQueries";
import { IdRef } from "@/common/interfaces/property/archieved-property-request.interface";
import { ISortState } from "@/common/interfaces/sorting/sort.interface";
import { useToast } from "@/context/ToastContext";
import { useAllUsersQuery } from "@/features/users/usersQueries";
import { AxiosError } from "axios";
import { useFilterPropertiesQuery } from "@/features/properties/propertiesQueries";

interface PropertyReqItem {
  _id: string;
  propertyId: string | IdRef;
  requestedBy: string | IdRef;
  requestedStatus: string;
  createdAt?: string;
}

const PropertyRequestsList = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const navigate = useNavigate();
  const toast = useToast();

  const rowsPerPage = 10;

  const [sort, setSort] = useState<ISortState>({
    field: "createdAt",
    direction: "desc",
  });

  const [page, setPage] = useState(0);

  const {
    data: pendingReuqests,
    isLoading,
    error: pendingRequestsError,
  } = usePendingPropertyRequestsQuery();
  const { data: allProperties, error: propertiesError } = useFilterPropertiesQuery({
    agentId: "ALL",
  });
  const { data: allUsers, error: usersError } = useAllUsersQuery();

  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();

  const propMap = useMemo(() => {
    const map: Record<string, any> = {};

    allProperties?.forEach((p) => {
      if (p._id) map[p._id] = p;
    });

    return map;
  }, [allProperties]);

  const userMap = useMemo(() => {
    const map: Record<string, any> = {};
    allUsers?.forEach((u) => (map[u._id] = u));
    return map;
  }, [allUsers]);

  const toggleSort = (field: string) => {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "asc" },
    );
    setPage(0);
  };

  const getId = (val: string | IdRef | undefined): string => {
    if (!val) return "";
    return typeof val === "string" ? val : (val._id ?? "");
  };

  const displayUser = (val: string | IdRef | undefined) => userMap[getId(val)]?.name ?? "-";

  const displaySKU = (item: PropertyReqItem) => propMap[getId(item.propertyId)]?.sku ?? "-";

  const getCurrentStatus = (item: PropertyReqItem) =>
    propMap[getId(item.propertyId)]?.generalDetails?.status ?? "-";

  const getComparable = (item: PropertyReqItem, key: string) => {
    switch (key) {
      case "sku":
        return displaySKU(item).toLowerCase();
      case "requestedBy":
        return displayUser(item.requestedBy).toLowerCase();
      case "currentStatus":
        return getCurrentStatus(item).toLowerCase();
      case "requestedStatus":
        return item.requestedStatus.toLowerCase();
      case "createdAt":
        return item.createdAt ? Date.parse(item.createdAt) : -Infinity;
      default:
        return "";
    }
  };

  const sortedData = useMemo(() => {
    if (!pendingReuqests) return [];
    return [...pendingReuqests].sort((a, b) => {
      const av = getComparable(a, sort.field);
      const bv = getComparable(b, sort.field);
      return sort.direction === "asc" ? (av < bv ? -1 : 1) : av > bv ? -1 : 1;
    });
  }, [pendingReuqests, sort, propMap, userMap]);

  const paginated = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    if (usersError) {
      const axiosErr = usersError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea utilizatorilor", "error");
    }
  }, [usersError, toast]);

  useEffect(() => {
    if (propertiesError) {
      const axiosErr = propertiesError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea proprietatilor", "error");
    }
  }, [propertiesError, toast]);

  useEffect(() => {
    if (pendingRequestsError) {
      const axiosErr = pendingRequestsError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea cererilor", "error");
    }
  }, [pendingRequestsError, toast]);

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
      <Typography textAlign="center" mt={2} color="text.secondary">
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
        <TableContainer sx={{ flex: 1, minHeight: 0, overflowX: "auto" }}>
          <Table stickyHeader sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                {[
                  { label: "Proprietate", key: "sku" },
                  { label: "Solicitat de", key: "requestedBy" },
                  { label: "Status actual", key: "currentStatus" },
                  { label: "Status cerut", key: "requestedStatus" },
                  { label: "Creat la", key: "createdAt" },
                  { label: "Actiuni", key: null },
                ].map((h) => (
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
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {h.label}

                      {h.key === sort.field &&
                        (sort.direction === "asc" ? (
                          <ArrowUpwardIcon sx={{ fontSize: 12, ml: 0.5, color: accent }} />
                        ) : (
                          <ArrowDownwardIcon sx={{ fontSize: 12, ml: 0.5, color: accent }} />
                        ))}

                      {h.key && h.key !== sort.field && (
                        <ArrowUpwardIcon sx={{ fontSize: 12, ml: 0.5, opacity: 0.25 }} />
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((row) => (
                <TableRow key={row._id} hover sx={{ "&:hover": { background: `${accent}11` } }}>
                  <TableCell
                    sx={{
                      color: accent,
                      fontWeight: 700,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => navigate(`/properties/${displaySKU(row)}`)}
                  >
                    {displaySKU(row)}
                  </TableCell>

                  <TableCell>{displayUser(row.requestedBy)}</TableCell>

                  <TableCell>
                    <Chip
                      label={getCurrentStatus(row)}
                      size="small"
                      color={getChipColor(getCurrentStatus(row))}
                      sx={getCustomChipStyle(getCurrentStatus(row))}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.requestedStatus}
                      size="small"
                      color={getChipColor(row.requestedStatus)}
                      sx={getCustomChipStyle(row.requestedStatus)}
                    />
                  </TableCell>

                  <TableCell>
                    {row.createdAt ? new Date(row.createdAt).toLocaleString("ro-RO") : "-"}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.3 }}>
                      <Tooltip title="Aproba">
                        <IconButton
                          color="success"
                          size="small"
                          onClick={() => approveMutation.mutate(row._id)}
                        >
                          <CheckCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Respinge">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => rejectMutation.mutate(row._id)}
                        >
                          <CancelOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </Paper>
    </Box>
  );
};

export default PropertyRequestsList;
