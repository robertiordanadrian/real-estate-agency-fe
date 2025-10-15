import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePropertiesQuery } from "../../features/properties/propertiesQueries";
import { IProperty } from "../../common/interfaces/property.interface";

export const PropertiesList = () => {
  const { data: properties, isLoading, error } = usePropertiesQuery();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          height: "100%",
        }}
      >
        <CircularProgress sx={{ color: "#38bdf8" }} />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Eroare la incarcarea proprietatilor.
      </Typography>
    );

  if (!properties || properties.length === 0)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          height: "100%",
        }}
      >
        Nu exista proprietati.
      </Box>
    );

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const paginated = properties.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        boxShadow: "0 0 25px rgba(56,189,248,0.1)",
        height: "100%",
      }}
    >
      <TableContainer
        sx={{
          flex: 1,
          minHeight: 0,
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 1200,
            "& .MuiTableCell-root": {
              whiteSpace: "nowrap",
            },
          }}
        >
          <TableHead>
            <TableRow>
              {[
                "Imagine",
                "Status",
                "Tranzactie",
                "Tip",
                "Pret (€)",
                "Camere",
                "Suprafata (mp)",
                "Etaj",
                "Zona",
                "Strada",
                "Agent",
                "Proprietar",
                "Actiuni",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: "#93c5fd",
                    fontWeight: 600,
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: "#0f172a",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((property: IProperty) => {
              const img = property.images?.[0] ?? "";
              const { generalDetails, characteristics, price } = property;

              return (
                <TableRow
                  key={property._id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(59,130,246,0.08)",
                      cursor: "pointer",
                    },
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={img}
                      alt="property"
                      sx={{ width: 60, height: 60 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={generalDetails?.status ?? "-"}
                      size="small"
                      sx={{
                        backgroundColor: "#0ea5e9",
                        color: "#fff",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    {generalDetails?.transactionType ?? "-"}
                  </TableCell>
                  <TableCell>{generalDetails?.category ?? "-"}</TableCell>
                  <TableCell>{price?.priceDetails?.price ?? "-"}</TableCell>
                  <TableCell>
                    {characteristics?.details?.bedrooms ?? "-"}
                  </TableCell>
                  <TableCell>
                    {characteristics?.areas?.totalUsableArea ?? "-"}
                  </TableCell>
                  <TableCell>
                    {characteristics?.details?.floor ?? "-"}
                  </TableCell>
                  <TableCell>{generalDetails?.location?.zone ?? "-"}</TableCell>
                  <TableCell>
                    {generalDetails?.location?.street ?? "-"}
                  </TableCell>
                  <TableCell>{generalDetails?.agent ?? "-"}</TableCell>
                  <TableCell>{generalDetails?.ownerID ?? "-"}</TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="info"
                        onClick={() => navigate(`/properties/${property._id}`)}
                        sx={{
                          textTransform: "none",
                          borderColor: "#38bdf8",
                          color: "#38bdf8",
                          "&:hover": {
                            borderColor: "#0ea5e9",
                            background: "rgba(14,165,233,0.1)",
                          },
                        }}
                      >
                        Vizualizeaza
                      </Button>

                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/properties/edit/${property._id}`);
                        }}
                        sx={{
                          textTransform: "none",
                          backgroundColor: "#22c55e",
                          "&:hover": { backgroundColor: "#16a34a" },
                        }}
                      >
                        Editeaza
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          flexShrink: 0,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "rgba(15,23,42,0.9)",
        }}
      >
        <TablePagination
          component="div"
          count={properties.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
          sx={{
            color: "#e2e8f0",
            "& .MuiTablePagination-actions button": { color: "#38bdf8" },
          }}
        />
      </Box>
    </Paper>
  );
};
