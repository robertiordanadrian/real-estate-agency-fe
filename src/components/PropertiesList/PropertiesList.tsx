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
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePropertiesQuery } from "../../features/properties/propertiesQueries";
import { IProperty } from "../../common/interfaces/property.interface";

export const PropertiesList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: properties, isLoading, error } = usePropertiesQuery();

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.palette.text.secondary,
          height: "100%",
        }}
      >
        <CircularProgress color="primary" />
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
          color: theme.palette.text.secondary,
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
        background: isDark
          ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
          : theme.palette.background.paper,
        boxShadow: isDark ? `0 0 25px ${accent}11` : `0 0 10px ${accent}11`,
        height: "100%",
      }}
    >
      <TableContainer sx={{ flex: 1, minHeight: 0 }}>
        <Table
          stickyHeader
          sx={{
            minWidth: 1200,
            "& .MuiTableCell-root": { whiteSpace: "nowrap" },
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
            {paginated.map((property: IProperty) => {
              const img = property.images?.[0] ?? "";
              const { generalDetails, characteristics, price } = property;

              return (
                <TableRow
                  key={property._id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: `${accent}11`,
                      cursor: "pointer",
                    },
                    borderBottom: `1px solid ${
                      isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                    }`,
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
                        backgroundColor: accent,
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
                        onClick={() => navigate(`/properties/${property._id}`)}
                        sx={{
                          textTransform: "none",
                          borderColor: accent,
                          color: accent,
                          "&:hover": {
                            borderColor: accent,
                            backgroundColor: `${accent}11`,
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
                          boxShadow: `0 0 8px ${theme.palette.success.main}33`,
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
          borderTop: `1px solid ${
            isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
          }`,
          backgroundColor: theme.palette.background.paper,
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
            color: theme.palette.text.primary,
            "& .MuiTablePagination-actions button": { color: accent },
          }}
        />
      </Box>
    </Paper>
  );
};
