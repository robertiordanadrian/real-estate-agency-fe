import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePropertiesQuery } from "../../features/properties/propertiesQueries";
import { IProperty } from "../../common/interfaces/property.interface";

interface PropertiesListProps {
  properties: IProperty[];
}

export const PropertiesList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: properties, isLoading, error } = usePropertiesQuery();

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

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

  if (isMobile) {
    return <MobileCardList properties={paginated} />;
  }

  return (
    <DesktopTable
      properties={paginated}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handleChangePage}
      total={properties.length}
    />
  );
};

const DesktopTable = ({
  properties,
  page,
  rowsPerPage,
  onPageChange,
  total,
}: {
  properties: IProperty[];
  page: number;
  rowsPerPage: number;
  onPageChange: (e: unknown, page: number) => void;
  total: number;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;

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
            minWidth: 1200,
            "& .MuiTableCell-root": {
              whiteSpace: "nowrap",
              fontSize: "0.9rem",
              px: 2,
              py: 1.5,
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
            {properties.map((property: IProperty) => {
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
                    <Tooltip title="Vezi detalii">
                      <IconButton
                        color="info"
                        onClick={() => navigate(`/properties/${property.sku}`)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editeaza">
                      <IconButton
                        color="warning"
                        onClick={() =>
                          navigate(`/properties/edit/${property._id}`)
                        }
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
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
          count={total}
          page={page}
          onPageChange={onPageChange}
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

const MobileCardList = ({ properties }: PropertiesListProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
        },
        gap: 2,
      }}
    >
      {properties.map((property: IProperty) => {
        const img = property.images?.[0];
        const { generalDetails, price, description } = property;

        return (
          <Card
            key={property._id}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
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
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                overflow: "hidden",
                borderBottom: `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.08)"
                }`,
              }}
            >
              <Box
                component="img"
                src={img || "/placeholder.jpg"}
                alt={generalDetails?.category || "property"}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: img ? "cover" : "contain",
                  backgroundColor: img
                    ? "transparent"
                    : theme.palette.action.hover,
                }}
              />
            </Box>
            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: accent,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {description?.title ?? "-"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {`${generalDetails?.location?.zone ?? "-"}, ${
                  generalDetails.location.city ?? "-"
                }, ${generalDetails.location.street ?? "-"}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SKU: {property.sku ?? "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Agent: {property.generalDetails.agent ?? "-"}
              </Typography>

              <Typography variant="body1" fontWeight={600}>
                {price?.priceDetails?.price
                  ? `${price.priceDetails.price} €`
                  : "-"}
              </Typography>

              <Chip
                label={generalDetails?.status ?? "-"}
                size="small"
                sx={{
                  backgroundColor: accent,
                  color: "#fff",
                  fontWeight: 500,
                  mt: 1,
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
                p: 1.5,
              }}
            >
              <Tooltip title="Detalii">
                <IconButton
                  color="info"
                  onClick={() => navigate(`/properties/${property.sku}`)}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editează">
                <IconButton
                  color="warning"
                  onClick={() => navigate(`/properties/edit/${property._id}`)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
};
