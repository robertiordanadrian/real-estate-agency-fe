import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
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
  useMediaQuery,
} from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        borderRadius: 2,
        overflow: "hidden",
        background: isDark
          ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
          : theme.palette.background.paper,
        boxShadow: isDark ? `0 0 25px ${accent}11` : `0 0 10px ${accent}11`,
        height: "100%",
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
            minWidth: isMobile ? 800 : 1200,
            "& .MuiTableCell-root": {
              whiteSpace: "nowrap",
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1, sm: 1.5 },
            },
          }}
        >
          <TableHead>
            <TableRow>
              {[
                "Imagine",
                "Status",
                "SKU",
                "Tranzactie",
                "Tip",
                "Pret (€)",
                "Camere",
                "Suprafata (mp)",
                "Etaj",
                "Zona",
                "Strada",
                "Agent",
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
                      sx={{ width: 50, height: 50 }}
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

                  <TableCell>{property.sku ?? "-"}</TableCell>

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

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Tooltip title="Vezi detalii">
                        <IconButton
                          color="info"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/properties/${property.sku}`);
                          }}
                          sx={{
                            "&:hover": {
                              backgroundColor: `${theme.palette.info.main}22`,
                            },
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Editeaza">
                        <IconButton
                          color="warning"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/properties/edit/${property._id}`);
                          }}
                          sx={{
                            "&:hover": {
                              backgroundColor: `${theme.palette.warning.main}22`,
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
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
