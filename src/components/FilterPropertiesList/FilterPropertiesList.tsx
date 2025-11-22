import { Edit, Visibility } from "@mui/icons-material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ESignedContract } from "@/common/enums/property/price.enums";
import type { IProperty } from "@/common/interfaces/property/property.interface";
import { getCustomChipStyle } from "@/common/utils/get-custom-chip-style.util";
import { useFilterPropertiesQuery } from "@/features/filterProperties/filterPropertiesQueries";
import { useQuery } from "@tanstack/react-query";
import { UsersApi } from "@/features/users/usersApi";
import { ISortState } from "@/common/interfaces/sorting/sort.interface";
import { formatPrice } from "@/common/utils/format-price.util";
import { useToast } from "@/context/ToastContext";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import { EGeneralDetailsEnumLabels } from "@/common/enums/property/general-details.enums";

export const mapGeneralDetailsLabel = (
  group: keyof typeof EGeneralDetailsEnumLabels,
  value: string | null | undefined,
): string => {
  if (!value) return "N/A";

  const groupMap = EGeneralDetailsEnumLabels[group] as Record<string, string>;

  return groupMap[value] ?? value;
};

interface FilterPropertiesListProps {
  selectedCategory?: string;
  selectedAgentId: string;
  selectedStatus?: string;
  selectedContract?: string;
}

const getFullAddress = (p: IProperty) => {
  const loc = p.generalDetails?.location;
  if (!loc) return "-";

  const street = loc.street || "";
  const number = loc.number || "";
  const zone = loc.zone || "";

  const base = `${street} ${number}`.trim();
  return zone ? `${base} (${zone})` : base || "-";
};

const sortableColumns: Record<string, (_p: IProperty) => any> = {
  status: (p) => p.generalDetails?.status,
  sku: (p) => p.sku,
  transactionType: (p) => p.generalDetails?.transactionType,
  category: (p) => p.generalDetails?.category,
  price: (p) => p.price?.priceDetails?.price,
  bedrooms: (p) => p.characteristics?.details?.bedrooms,
  usableArea: (p) => p.characteristics?.areas?.totalUsableArea,
  address: (p) => getFullAddress(p).toLowerCase(),
  contract: (p) => (p.price?.contact?.signedContract === ESignedContract.NO ? 0 : 1),
};

function FilteredTable({
  properties,
  total,
  page,
  rowsPerPage,
  onPageChange,
  sort,
  onSortChange,
}: {
  properties: IProperty[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (_e: unknown, _newPage: number) => void;
  sort: ISortState;
  onSortChange: (_field: string) => void;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const navigate = useNavigate();
  const toast = useToast();

  const { data: users, error } = useQuery({
    queryKey: ["users-all"],
    queryFn: UsersApi.getAll,
  });

  const headers = [
    { label: "Imagine", key: null },
    { label: "Status", key: "status" },
    { label: "SKU", key: "sku" },
    { label: "Tranzactie", key: "transactionType" },
    { label: "Tip", key: "category" },
    { label: "Pret", key: "price" },
    { label: "Camere", key: "bedrooms" },
    { label: "Suprafata", key: "usableArea" },
    { label: "Adresa", key: "address" },
    { label: "Contract", key: "contract" },
    { label: "Agent", key: "agent" },
    { label: "Actiuni", key: null },
  ];

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

  const usersMap = useMemo(() => {
    if (!users) return {};
    const map: Record<string, any> = {};
    users.forEach((u: any) => (map[u._id] = u));
    return map;
  }, [users]);

  useEffect(() => {
    if (error) {
      const axiosErr = error as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea userilor.", "error");
    }
  }, [error, toast]);

  return (
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
              {headers.map((h) => (
                <TableCell
                  key={h.label}
                  onClick={() => h.key && onSortChange(h.key)}
                  sx={{
                    color: accent,
                    fontWeight: 600,
                    borderBottom: `1px solid ${accent}22`,
                    backgroundColor: theme.palette.background.paper,
                    cursor: h.key ? "pointer" : "default",
                    userSelect: "none",
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
            {properties.map((property) => {
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
                      label={generalDetails.status}
                      sx={{
                        ...getCustomChipStyle(generalDetails.status),
                      }}
                      variant="filled"
                    />
                  </TableCell>

                  <TableCell>{property.sku ?? "-"}</TableCell>
                  <TableCell>{generalDetails?.transactionType ?? "-"}</TableCell>
                  <TableCell>
                    {mapGeneralDetailsLabel("ECategory", generalDetails?.category)}
                  </TableCell>
                  <TableCell>{formatPrice(price?.priceDetails?.price)} €</TableCell>
                  <TableCell>{characteristics?.details?.bedrooms ?? "-"}</TableCell>
                  <TableCell>{characteristics?.areas?.totalUsableArea + " m²"}</TableCell>
                  <TableCell>{getFullAddress(property)}</TableCell>
                  <TableCell>
                    {property.price?.contact?.signedContract !== ESignedContract.NO ? (
                      <Tooltip title="Are contract">
                        <CheckCircleIcon sx={{ color: "rgb(34,197,94)", fontSize: 22 }} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Nu are contract">
                        <CancelIcon sx={{ color: "rgb(239,68,68)", fontSize: 22 }} />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const agentId = generalDetails?.agentId;
                      const agent = agentId ? usersMap[agentId] : null;
                      return agent ? `${agent.name} (${agent.role})` : "-";
                    })()}
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Vezi detalii">
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
                  </TableCell>
                </TableRow>
              );
            })}
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
}

const FilterPropertiesList = ({
  selectedCategory,
  selectedAgentId,
  selectedStatus,
  selectedContract,
}: FilterPropertiesListProps) => {
  const rowsPerPage = 10;

  const { data, isLoading, error } = useFilterPropertiesQuery({
    agentId: selectedAgentId,
    category: selectedCategory,
    status: selectedStatus,
    contract: selectedContract,
  });
  const toast = useToast();

  const [page, setPage] = useState(0);

  const [sort, setSort] = useState<ISortState>({
    field: "sku",
    direction: "desc",
  });

  const handleSortChange = (field: string) => {
    setSort((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { field, direction: "asc" };
    });
    setPage(0);
  };

  const sortedData = useMemo(() => {
    if (!data) return [];

    const getter = sortableColumns[sort.field];
    if (!getter) return data;

    return [...data].sort((a, b) => {
      const av = getter(a);
      const bv = getter(b);

      if (av == null) return 1;
      if (bv == null) return -1;

      if (av < bv) return sort.direction === "asc" ? -1 : 1;
      if (av > bv) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sort]);

  useEffect(() => {
    if (error) {
      const axiosErr = error as AxiosError<{ message?: string }>;
      toast(
        axiosErr.response?.data?.message || "Eroare la încărcarea proprietăților filtrate",
        "error",
      );
    }
  }, [error, toast]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );

  if (!sortedData || sortedData.length === 0)
    return (
      <Typography textAlign="center" color="text.secondary">
        Nicio proprietate gasita pentru categoria selectata.
      </Typography>
    );

  const paginated = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <FilteredTable
      properties={paginated}
      total={sortedData.length}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={(_, newPage) => setPage(newPage)}
      sort={sort}
      onSortChange={handleSortChange}
    />
  );
};

export default FilterPropertiesList;
