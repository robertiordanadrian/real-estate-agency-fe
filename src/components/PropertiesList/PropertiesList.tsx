import {
  Avatar,
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
import { Visibility, Edit } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePropertiesQuery } from "../../features/properties/propertiesQueries";
import { IProperty } from "../../common/interfaces/property.interface";
import { getCustomChipStyle } from "../../common/utils/get-custom-chip-style.util";

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

  const [sortKey, setSortKey] = useState<keyof IProperty | null>("sku");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedProperties = [...properties].sort((a, b) => {
    const valA = a[sortKey!];
    const valB = b[sortKey!];

    if (valA == null) return 1;
    if (valB == null) return -1;

    if (typeof valA === "number" && typeof valB === "number") {
      return sortDirection === "asc" ? valA - valB : valB - valA;
    }

    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const renderSortIcon = (key: keyof IProperty) => {
    if (sortKey !== key) return "⇅";
    return sortDirection === "asc" ? "▲" : "▼";
  };

  const handleSort = (key: keyof IProperty) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

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
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: accent,
            borderRadius: 8,
          },
        }}
      >
        <Table stickyHeader sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              {[
                { label: "Imagine" },
                { label: "Status" },
                { label: "SKU", key: "sku" as keyof IProperty },
                { label: "Tranzactie", key: "generalDetails" },
                { label: "Tip" },
                { label: "Pret (€)" },
                { label: "Camere" },
                { label: "Suprafata (mp)" },
                { label: "Etaj" },
                { label: "Zona" },
                { label: "Strada" },
                { label: "Agent" },
                { label: "Actiuni" },
              ].map((col) => (
                <TableCell
                  key={col.label}
                  onClick={() =>
                    col.key && handleSort(col.key as keyof IProperty)
                  }
                  sx={{
                    cursor: col.key ? "pointer" : "default",
                    color: accent,
                    fontWeight: 600,
                    borderBottom: `1px solid ${accent}22`,
                    userSelect: "none",
                  }}
                >
                  {col.label}

                  {col.key && (
                    <span style={{ marginLeft: 6, fontSize: "0.75rem" }}>
                      {renderSortIcon(col.key as keyof IProperty)}
                    </span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedProperties.map((property) => {
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
                      sx={{ width: 50, height: 50 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={generalDetails?.status ?? "-"}
                      size="small"
                      sx={{
                        ...getCustomChipStyle(generalDetails?.status ?? "-"),
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

                  <TableCell>
                    <Tooltip title="Detalii">
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

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />
    </Paper>
  );
};

const PropertiesList = () => {
  const theme = useTheme();
  const rowsPerPage = 10;

  const { data: properties, isLoading, error } = usePropertiesQuery();

  const [page, setPage] = useState(0);

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
    <DesktopTable
      properties={paginated}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handleChangePage}
      total={properties.length}
    />
  );
};

export default PropertiesList;
