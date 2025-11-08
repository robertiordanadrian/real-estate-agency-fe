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

import { IUser } from "../../common/interfaces/user.interface";
import { getChipColor } from "../../common/utils/get-chip-color.util";
import { getCustomChipStyle } from "../../common/utils/get-custom-chip-style.util";
import { useArchiveLeadRequestsQuery } from "../../features/leadRequests/leadRequestsQueries";
import { useLeadsQuery } from "../../features/leads/leadsQueries";
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

interface ArchivedLeadRequestItem {
  _id: string;
  leadId: string | IdRef;
  requestedBy: string | IdRef;
  requestedStatus: string;
  approvalStatus: string;
  approvedBy?: string;
  rejectedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ArchivedLeadRequestsList = () => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const headers = [
    { label: "Lead", key: "lead" },
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

  const { data: archiveData, isLoading, isError } = useArchiveLeadRequestsQuery();
  const { data: users } = useAllUsersQuery();
  const { data: leads } = useLeadsQuery();

  const leadMap = useMemo(() => {
    if (!leads) return {};
    const map: Record<string, any> = {};
    leads.forEach((l) => {
      if (l._id) map[l._id] = l;
    });
    return map;
  }, [leads]);

  const getId = (val: string | IdRef | undefined) =>
    typeof val === "string" ? val : val?._id || "";

  const getUserName = (val: any) => {
    if (!val || !users) return "-";
    const id = typeof val === "string" ? val : val._id;
    const u = users.find((x: IUser) => x._id === id);
    return u?.name ?? "-";
  };

  const displayLeadName = (item: ArchivedLeadRequestItem) => {
    const id = getId(item.leadId);
    return leadMap[id]?.name || id;
  };

  const getApproverName = (item: ArchivedLeadRequestItem) => {
    if (item.approvalStatus === "APPROVED") return getUserName(item.approvedBy);
    if (item.approvalStatus === "REJECTED") return getUserName(item.rejectedBy);
    return "-";
  };
  const [page, setPage] = useState(0);

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

  const getComparable = (item: ArchivedLeadRequestItem, key: string) => {
    switch (key) {
      case "lead":
        return displayLeadName(item).toLowerCase();
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
        return item[key] ? Date.parse(item[key]!) : -Infinity;
      default:
        return "";
    }
  };

  const sortedData = useMemo(() => {
    if (!archiveData) return [];
    return [...archiveData].sort((a, b) => {
      const av = getComparable(a, sort.field);
      const bv = getComparable(b, sort.field);
      if (av === bv) return 0;
      return sort.direction === "asc" ? (av < bv ? -1 : 1) : av > bv ? -1 : 1;
    });
  }, [archiveData, sort, leadMap, users]);

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
            "&::-webkit-scrollbar": { height: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: accent,
              borderRadius: 8,
            },
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
                const leadId = getId(row.leadId);
                const leadName = displayLeadName(row);
                const approverName = getApproverName(row);

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
                      }}
                      onClick={() => navigate(`/leads/edit/${leadId}`)}
                    >
                      {leadName}
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
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ArchivedLeadRequestsList;
