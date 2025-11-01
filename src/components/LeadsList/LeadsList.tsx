import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Delete, Home, Phone, Euro, LocationOn } from "@mui/icons-material";
import { useState } from "react";
import {
  useLeadsQuery,
  useDeleteLead,
} from "../../features/leads/leadsQueries";
import type { ILead } from "../../common/interfaces/lead.interface";
import { useNavigate } from "react-router-dom";

export const LeadsList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: leads, isLoading, error } = useLeadsQuery();
  const deleteLead = useDeleteLead();

  const [page, setPage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);

  const rowsPerPage = 10;
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

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

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Eroare la incarcarea lead-urilor.
      </Typography>
    );

  if (!leads || leads.length === 0)
    return (
      <Typography textAlign="center" mt={4} color="text.secondary">
        Nu exista lead-uri.
      </Typography>
    );

  const paginated = leads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isMobile) {
    return (
      <>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
            gap: 3,
            width: "100%",
            boxSizing: "border-box",
            px: { xs: 0.5, sm: 0 },
          }}
        >
          {paginated.map((lead: ILead) => (
            <Card
              key={lead._id}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                width: "100%",
                boxShadow: isDark
                  ? `0 0 15px ${accent}22`
                  : `0 0 10px ${accent}11`,
                bgcolor: theme.palette.background.paper,
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 0 25px ${accent}33`,
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* 🔹 Header cu Avatar și nume */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    gap: 1.8,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: accent,
                      color: "#fff",
                      fontWeight: 600,
                      width: 48,
                      height: 48,
                      fontSize: 20,
                    }}
                  >
                    {lead.name?.[0]?.toUpperCase() ?? "L"}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700} color={accent}>
                      {lead.name ?? "Lead"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lead.transactionType ?? "-"}
                    </Typography>
                  </Box>
                </Box>

                {/* 🔹 Informații principale */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.2,
                    mb: 2.2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <Phone fontSize="small" />
                    {lead.phoneNumber ? (
                      <Link
                        href={`tel:${lead.phoneNumber}`}
                        underline="hover"
                        sx={{ color: theme.palette.info.main, fontWeight: 500 }}
                      >
                        {lead.phoneNumber}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Home fontSize="small" />
                    {lead.propertyType ?? "-"}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <LocationOn fontSize="small" />
                    {lead.zona ?? "-"}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Euro fontSize="small" />
                    {lead.budget ? `€ ${lead.budget}` : "-"}
                  </Typography>
                </Box>

                {/* 🔹 Divider subtil */}
                <Box
                  sx={{
                    borderTop: `1px solid ${
                      isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"
                    }`,
                    my: 1.8,
                  }}
                />

                {/* 🔹 Cod Proprietate + Data */}
                {lead.sku && (
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      color: accent,
                      fontWeight: 600,
                      mb: 1.2,
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => navigate(`/properties/${lead.sku}`)}
                  >
                    Cod Proprietate: {lead.sku}
                  </Typography>
                )}

                <Chip
                  label={
                    lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString("ro-RO")
                      : "-"
                  }
                  size="small"
                  sx={{
                    mt: 0.5,
                    backgroundColor: `${accent}22`,
                    color: accent,
                    fontWeight: 500,
                    alignSelf: "flex-start",
                  }}
                />
              </CardContent>

              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop: `1px solid ${
                    isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                  }`,
                  p: 1.8,
                }}
              >
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
              </CardActions>
            </Card>
          ))}
        </Box>

        {/* 🔹 Dialog Confirmare */}
        <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
          <DialogTitle>Confirmare ștergere</DialogTitle>
          <DialogContent>
            <Typography>
              Ești sigur că vrei să ștergi lead-ul{" "}
              <strong>{selectedLead?.name}</strong>?
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
  }

  return (
    <>
      <Paper
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          background: isDark
            ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
            : theme.palette.background.paper,
          boxShadow: isDark ? `0 0 25px ${accent}11` : `0 0 10px ${accent}11`,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
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
                {[
                  "Nume",
                  "Telefon",
                  "Tip Proprietate",
                  "Zona",
                  "Buget",
                  "Tranzactie",
                  "Cod Proprietate",
                  "Data",
                  "Actiuni",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: accent,
                      fontWeight: 600,
                      borderBottom: `1px solid ${accent}22`,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    {header}
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
                  <TableCell>
                    {lead.budget ? `€ ${lead.budget}` : "-"}
                  </TableCell>
                  <TableCell>{lead.transactionType || "-"}</TableCell>
                  <TableCell>
                    {lead.sku ? (
                      <Typography
                        onClick={() => navigate(`/properties/${lead.sku}`)}
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          cursor: "pointer",
                          "&:hover": { color: theme.palette.primary.dark },
                        }}
                      >
                        {lead.sku}
                      </Typography>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleString("ro-RO")
                      : "-"}
                  </TableCell>

                  <TableCell align="center">
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
            borderTop: `1px solid ${
              isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
            }`,
          }}
        >
          <TablePagination
            component="div"
            count={leads.length}
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

      {/* Dialog confirmare ștergere */}
      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmare ștergere</DialogTitle>
        <DialogContent>
          <Typography>
            Ești sigur că vrei să ștergi lead-ul{" "}
            <strong>{selectedLead?.name}</strong>?
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
