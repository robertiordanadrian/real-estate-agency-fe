import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { IProperty } from "../../common/interfaces/property.interface";
import { getChipColor } from "../../common/utils/get-chip-color.util";
import { getCustomChipStyle } from "../../common/utils/get-custom-chip-style.util";
import { usePropertiesQuery } from "../../features/properties/propertiesQueries";
import { useArchivePropertyRequestsQuery } from "../../features/propertyRequests/propertyRequestsQueries";
import { useAllUsersQuery } from "../../features/users/usersQueries";

type SortDirection = "asc" | "desc";

interface SortState {
  field: string;
  direction: SortDirection;
}

interface IdRef {
  _id: string;
  name?: string;
}

interface ArchivedPropertyRequestItem {
  _id: string;
  propertyId: string | IdRef;
  requestedBy: string | IdRef;
  requestedStatus: string;
  approvalStatus: string;
  approvedBy?: string;
  rejectedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IUserLite {
  _id: string;
  name?: string;
}

const ArchivedPropertyRequestsList = () => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const headers: Array<{ label: string; key: string | null }> = [
    { label: "Proprietate (SKU)", key: "property" },
    { label: "Solicitat de", key: "requestedBy" },
    { label: "Status cerut", key: "requestedStatus" },
    { label: "Status aprobare", key: "approvalStatus" },
    { label: "Aprobat de", key: "approvedBy" },
    { label: "Creat la", key: "createdAt" },
    { label: "Procesat la", key: "updatedAt" },
  ];
  const rowsPerPage = 10;

  const [sort, setSort] = useState<SortState>({
    field: "updatedAt",
    direction: "desc",
  });
  const [page, setPage] = useState(0);

  const { data: requests, isLoading, isError } = useArchivePropertyRequestsQuery();
  const { data: users } = useAllUsersQuery();
  const { data: properties } = usePropertiesQuery();

  const usersMap = useMemo(() => {
    const map: Record<string, IUserLite> = {};
    (users as IUserLite[] | undefined)?.forEach((u) => {
      if (u?._id) map[u._id] = u;
    });
    return map;
  }, [users]);

  const propertiesMap = useMemo(() => {
    const map: Record<string, Pick<IProperty, "_id" | "sku" | "generalDetails">> = {};
    (properties as IProperty[] | undefined)?.forEach((p) => {
      if (p?._id)
        map[p._id] = {
          _id: p._id,
          sku: p.sku,
          generalDetails: p.generalDetails,
        };
    });
    return map;
  }, [properties]);

  const getId = (val: string | IdRef | undefined): string =>
    typeof val === "string" ? val : (val?._id ?? "");

  const getUserName = (val: string | IdRef | undefined): string => {
    const id = getId(val);
    if (!id) return "-";
    const u = usersMap[id];
    return u?.name ?? "-";
  };

  const getApproverName = (item: ArchivedPropertyRequestItem): string => {
    if (item.approvalStatus === "APPROVED") return getUserName(item.approvedBy);
    if (item.approvalStatus === "REJECTED") return getUserName(item.rejectedBy);
    return "-";
  };

  const displayPropertySKU = (item: ArchivedPropertyRequestItem): string => {
    const id = getId(item.propertyId);
    return propertiesMap[id]?.sku || id || "-";
  };

  const toggleSort = (field: string) => {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "asc" },
    );
    setPage(0);
  };

  const renderSortIcon = (key: string | null) => {
    if (!key) return null;
    if (sort.field !== key) return <ArrowUpwardIcon sx={{ fontSize: 12, opacity: 0.3, ml: 0.5 }} />;
    return sort.direction === "asc" ? (
      <ArrowUpwardIcon sx={{ fontSize: 12, color: accent, ml: 0.5 }} />
    ) : (
      <ArrowDownwardIcon sx={{ fontSize: 12, color: accent, ml: 0.5 }} />
    );
  };

  const getComparable = (item: ArchivedPropertyRequestItem, key: string) => {
    switch (key) {
      case "property":
        return displayPropertySKU(item).toLowerCase();
      case "requestedBy":
        return getUserName(item.requestedBy).toLowerCase();
      case "requestedStatus":
        return item.requestedStatus.toLowerCase();
      case "approvalStatus":
        return item.approvalStatus.toLowerCase();
      case "approvedBy":
        return getApproverName(item).toLowerCase();
      case "createdAt":
      case "updatedAt":
        return item[key as "createdAt" | "updatedAt"]
          ? Date.parse(item[key as "createdAt" | "updatedAt"] as string)
          : -Infinity;
      default:
        return "";
    }
  };

  const list = (requests ?? []) as ArchivedPropertyRequestItem[];

  const sortedData = useMemo(() => {
    return [...list].sort((a, b) => {
      const av = getComparable(a, sort.field);
      const bv = getComparable(b, sort.field);
      if (av === bv) return 0;
      return sort.direction === "asc" ? (av < bv ? -1 : 1) : av > bv ? -1 : 1;
    });
  }, [list, sort, usersMap, propertiesMap]);

  const paginated = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

  if (isError)
    return (
      <Typography color="error" mt={2} textAlign="center">
        Eroare la incarcare.
      </Typography>
    );

  if (!sortedData.length)
    return (
      <Typography mt={2} textAlign="center" color="text.secondary">
        Nu exista cereri arhivate.
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
            "&::-webkit-scrollbar": {
              height: 8,
              backgroundColor: theme.palette.background.default,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: accent,
              borderRadius: 8,
            },
            "& *": { whiteSpace: "nowrap" },
          }}
        >
          <Table stickyHeader sx={{ minWidth: 1250 }}>
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
                const sku = displayPropertySKU(row);
                const approverName = getApproverName(row);

                return (
                  <TableRow
                    key={row._id}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: `${accent}11` },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: accent,
                        fontWeight: 700,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => navigate(`/properties/${sku}`)}
                    >
                      {sku}
                    </TableCell>

                    <TableCell>{getUserName(row.requestedBy)}</TableCell>

                    <TableCell>
                      <Chip
                        label={row.requestedStatus}
                        size="small"
                        color={getChipColor(row.requestedStatus)}
                        sx={getCustomChipStyle(row.requestedStatus)}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={row.approvalStatus === "APPROVED" ? "Aprobata" : "Respinsa"}
                        size="small"
                        color={row.approvalStatus === "APPROVED" ? "success" : "error"}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell>{approverName}</TableCell>

                    <TableCell>
                      {row.createdAt ? new Date(row.createdAt).toLocaleString("ro-RO") : "-"}
                    </TableCell>

                    <TableCell>
                      {row.updatedAt ? new Date(row.updatedAt).toLocaleString("ro-RO") : "-"}
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

export default ArchivedPropertyRequestsList;
