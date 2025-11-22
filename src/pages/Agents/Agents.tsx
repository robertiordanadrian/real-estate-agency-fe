import { Add, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fab,
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../app/hook";
import { ERole } from "@/common/enums/role/role.enums";
import { getRoleColor } from "@/common/utils/get-role-color.util";
import { getRoleDisplayText } from "@/common/utils/get-role-display-text.util";
import { selectUser } from "@/features/auth/authSelectors";
import { useAllUsersQuery } from "@/features/users/usersQueries";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

const Agents = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const navigate = useNavigate();
  const toast = useToast();

  const rowsPerPage = 10;

  const currentUser = useAppSelector(selectUser);

  const { data: users, isLoading, error } = useAllUsersQuery();

  const safeUsers = users ?? [];

  const [page, setPage] = useState(0);

  const paginated = safeUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const total = safeUsers.length;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (error) {
      const axiosErr = error as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea utilizatorilor", "error");
    }
  }, [error, toast]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== ERole.CEO) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );

  if (!users || users.length === 0)
    return (
      <Typography color="text.secondary" textAlign="center" mt={4}>
        Nu exista agenti in sistem.
      </Typography>
    );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flex: 1,
          boxSizing: "border-box",
          minHeight: 0,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            background: isDark
              ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
              : `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            color: theme.palette.text.primary,
            width: "100%",
            minHeight: "75vh",
            boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 15px ${accent}11`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: { xs: 2, md: 3 },
              gap: 2,
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              Agenti
            </Typography>

            <Tooltip title="Adauga agent" arrow>
              <Fab
                color="success"
                onClick={() => navigate("/register")}
                sx={{
                  boxShadow: `0 0 12px ${theme.palette.success.main}55`,
                  "&:hover": { backgroundColor: theme.palette.success.dark },
                }}
              >
                <Add sx={{ color: "white" }} />
              </Fab>
            </Tooltip>
          </Box>

          <Divider
            sx={{
              mb: 3,
              borderColor:
                theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          />

          <TableContainer sx={{ flex: 1, overflowX: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Avatar", "Nume", "Email", "Telefon", "Rol", "Actiuni"].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        color: accent,
                        fontWeight: 600,
                        borderBottom: `1px solid ${accent}22`,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginated.map((user: any) => (
                  <TableRow
                    key={user._id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: `${accent}11`,
                      },
                    }}
                  >
                    <TableCell>
                      <Avatar src={user.profilePicture} alt={user.name} />
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleDisplayText(user.role)}
                        sx={{
                          backgroundColor: getRoleColor(user.role),
                          color: "#fff",
                          fontWeight: 500,
                        }}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Editeaza">
                        <IconButton
                          color="warning"
                          onClick={() => navigate(`/register?editId=${user._id}`)}
                          sx={{
                            "&:hover": {
                              backgroundColor: `${theme.palette.warning.main}22`,
                            },
                          }}
                        >
                          <Edit />
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
              count={total}
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
      </Container>
    </Box>
  );
};

export default Agents;
