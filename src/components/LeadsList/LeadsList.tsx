import {
  Box,
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
  useMediaQuery,
  Link,
} from "@mui/material";
import { useState } from "react";
import { useLeadsQuery } from "../../features/leads/leadsQueries";
import type { ILead } from "../../common/interfaces/lead.interface";
import { useNavigate } from "react-router-dom";

export const LeadsList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: leads, isLoading, error } = useLeadsQuery();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  return (
    <Paper
      sx={{
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
          maxHeight: "70vh",
          overflowX: "auto",
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
            minWidth: isMobile ? 900 : 1100,
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
                    cursor: "pointer",
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
                        cursor: "pointer",
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
                  {lead.sku ? (
                    <Typography
                      onClick={() => navigate(`/properties/${lead.sku}`)}
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        cursor: "pointer",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: theme.palette.primary.dark,
                          transform: "translateY(-1px)",
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
                  {lead.createdAt
                    ? new Date(lead.createdAt).toLocaleString("ro-RO")
                    : "-"}
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
  );
};
