import { Delete, Edit } from "@mui/icons-material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
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
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ILead } from "@/common/interfaces/lead/lead.interface";
import { IUser } from "@/common/interfaces/user/user.interface";
import { getCustomChipStyle } from "@/common/utils/get-custom-chip-style.util";
import { useDeleteLead, useLeadsQuery } from "@/features/leads/leadsQueries";
import { useAllUsersQuery } from "@/features/users/usersQueries";

type SortDirection = "asc" | "desc";
interface SortState {
  field: string;
  direction: SortDirection;
}

const LeadsList = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const navigate = useNavigate();
  const rowsPerPage = 10;

  const headers = [
    { label: "Nume", key: "name" },
    { label: "Telefon", key: "phoneNumber" },
    { label: "Tip Proprietate", key: "propertyType" },
    { label: "Zona", key: "zona" },
    { label: "Buget", key: "budget" },
    { label: "Tranzactie", key: "transactionType" },
    { label: "Status", key: "status" },
    { label: "Cod Proprietate", key: "sku" },
    { label: "Data", key: "createdAt" },
    { label: "Agent", key: "agent" },
    { label: "Actiuni", key: null },
  ];

  const { data: users } = useAllUsersQuery();
  const { data: leads, isLoading, error } = useLeadsQuery();
  const deleteLead = useDeleteLead();

  const [page, setPage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);

  // DEFAULT SORT: createdAt DESC
  const [sort, setSort] = useState<SortState>({
    field: "createdAt",
    direction: "desc",
  });

  const handleOpenConfirm = (lead: ILead) => {
    setSelectedLead(lead);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setSelectedLead(null);
    setConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLead?._id) return;
    await deleteLead.mutateAsync(selectedLead._id);
    handleCloseConfirm();
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const getAgentName = (agentId?: string) => {
    if (!agentId || !users) return "-";
    const agent = users.find((u: IUser) => u._id === agentId);
    return agent ? agent.name : "-";
  };

  const toggleSort = (field: string) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { field, direction: "asc" };
    });
    setPage(0);
  };

  const sortedData = useMemo(() => {
    if (!leads) return [];

    const dataCopy = [...leads];

    const compare = (aVal: any, bVal: any, direction: SortDirection) => {
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const aNum =
        typeof aVal === "string" && aVal !== "" && !isNaN(Number(aVal)) ? Number(aVal) : null;
      const bNum =
        typeof bVal === "string" && bVal !== "" && !isNaN(Number(bVal)) ? Number(bVal) : null;

      const aDate = typeof aVal === "string" && !isNaN(Date.parse(aVal)) ? new Date(aVal) : null;
      const bDate = typeof bVal === "string" && !isNaN(Date.parse(bVal)) ? new Date(bVal) : null;

      if (aNum !== null && bNum !== null) {
        return direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      if (aDate && bDate) {
        return direction === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return direction === "asc" ? -1 : 1;
      if (aStr > bStr) return direction === "asc" ? 1 : -1;
      return 0;
    };

    const getter = (lead: ILead, field: string) => {
      switch (field) {
        case "name":
          return lead.name ?? "";
        case "phoneNumber":
          return lead.phoneNumber ?? "";
        case "propertyType":
          return lead.propertyType ?? "";
        case "zona":
          return lead.zona ?? "";
        case "budget":
          return lead.budget ?? "";
        case "transactionType":
          return lead.transactionType ?? "";
        case "status":
          return (lead.status ?? "") as unknown as string;
        case "sku":
          return lead.sku ?? "";
        case "createdAt":
          return lead.createdAt ?? null;
        case "agent":
          return getAgentName(lead.agentId) ?? "";
        default:
          return "";
      }
    };

    dataCopy.sort((a, b) => {
      const aVal = getter(a, sort.field);
      const bVal = getter(b, sort.field);
      return compare(aVal, bVal, sort.direction);
    });

    return dataCopy;
  }, [leads, sort, users]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Eroare la incarcarea lead-urilor.
      </Typography>
    );

  if (!sortedData || sortedData.length === 0)
    return (
      <Typography textAlign="center" mt={4} color="text.secondary">
        Nu exista lead-uri.
      </Typography>
    );

  const paginated = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const renderSortIcon = (columnKey: string | null) => {
    if (!columnKey) return null;
    if (sort.field !== columnKey)
      return <ArrowUpwardIcon sx={{ fontSize: 16, opacity: 0.3, ml: 0.5 }} />;

    return sort.direction === "asc" ? (
      <ArrowUpwardIcon sx={{ fontSize: 16, color: accent, ml: 0.5 }} />
    ) : (
      <ArrowDownwardIcon sx={{ fontSize: 16, color: accent, ml: 0.5 }} />
    );
  };

  return (
    <>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
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
            overflowX: "auto",
            flex: 1,
            minHeight: 0,
            "&::-webkit-scrollbar": {
              height: 8,
              backgroundColor: theme.palette.background.default,
              borderRadius: 8,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: accent,
              borderRadius: 8,
            },
          }}
        >
          <Table
            stickyHeader
            sx={{
              minWidth: 1200,
              "& .MuiTableCell-root": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 180,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1, sm: 1.5 },
              },
            }}
          >
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header.label}
                    onClick={() => header.key && toggleSort(header.key)}
                    sx={{
                      color: accent,
                      fontWeight: 600,
                      borderBottom: `1px solid ${accent}22`,
                      backgroundColor: theme.palette.background.paper,
                      cursor: header.key ? "pointer" : "default",
                      userSelect: "none",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {header.label}
                      {renderSortIcon(header.key)}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((lead: ILead) => (
                <TableRow
                  key={lead._id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: `${accent}11`,
                    },
                  }}
                >
                  <TableCell>{lead.name || "-"}</TableCell>
                  <TableCell>
                    {lead.phoneNumber ? (
                      <Link
                        href={`tel:${lead.phoneNumber}`}
                        underline="hover"
                        sx={{
                          color: theme.palette.info.main,
                          fontWeight: 500,
                        }}
                      >
                        {lead.phoneNumber}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{lead.propertyType || "-"}</TableCell>
                  <TableCell>{lead.zona || "-"}</TableCell>
                  <TableCell>{lead.budget ? `€ ${lead.budget}` : "-"}</TableCell>

                  <TableCell>{lead.transactionType || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        lead.createdAt
                          ? capitalize(String(lead.status))
                          : String(lead.status) || "-"
                      }
                      size="small"
                      sx={{
                        fontWeight: 500,
                        ...getCustomChipStyle(capitalize(String(lead.status).toLowerCase()) || ""),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {lead.sku ? (
                      <Typography
                        onClick={() => navigate(`/properties/${lead.sku}`)}
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                            color: theme.palette.primary.dark,
                          },
                        }}
                      >
                        {lead.sku}
                      </Typography>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleString("ro-RO") : "-"}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.2}>
                      <Typography variant="body2" fontWeight={500}>
                        {getAgentName(lead.agentId) || "-"}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Editează lead">
                      <IconButton
                        color="info"
                        onClick={() => navigate(`/leads/${lead._id}/edit`)}
                        sx={{
                          "&:hover": {
                            backgroundColor: `${theme.palette.info.main}22`,
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Șterge lead">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenConfirm(lead)}
                        sx={{
                          "&:hover": {
                            backgroundColor: `${theme.palette.error.main}22`,
                          },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
          }}
        >
          <TablePagination
            component="div"
            count={sortedData.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
            sx={{
              color: theme.palette.text.primary,
              "& .MuiTablePagination-actions button": { color: accent },
            }}
          />
        </Box>
      </Paper>

      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmare ștergere</DialogTitle>
        <DialogContent>
          <Typography>
            Ești sigur că vrei să ștergi lead-ul <strong>{selectedLead?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="inherit">
            Anulează
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteLead.isPending}
          >
            {deleteLead.isPending ? "Se șterge..." : "Șterge"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeadsList;
