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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAllUsersQuery } from "../../features/users/usersQueries";
import { useAppSelector } from "../../app/hook";
import { selectUser } from "../../features/auth/authSelectors";
import { ERole } from "../../common/enums/role.enums";
import { blue, orange, red, green } from "@mui/material/colors";

const getRoleColor = (role: string) => {
  switch (role) {
    case "CEO":
      return blue[400];
    case "MANAGER":
      return orange[400];
    case "TEAM_LEAD":
      return red[400];
    case "AGENT":
    default:
      return green[400];
  }
};

const getRoleDisplayText = (role: string) => {
  switch (role) {
    case "CEO":
      return "Chief Executive Officer";
    case "MANAGER":
      return "Property Manager";
    case "TEAM_LEAD":
      return "Team Leader";
    case "AGENT":
      return "Real Estate Agent";
    default:
      return "User";
  }
};

export default function Agents() {
  const theme = useTheme();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectUser);
  const { data: users, isLoading, error } = useAllUsersQuery();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!currentUser || currentUser.role !== ERole.CEO) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Eroare la incarcarea agentilor.
      </Typography>
    );

  if (!users || users.length === 0)
    return (
      <Typography color="text.secondary" textAlign="center" mt={4}>
        Nu exista agenti in sistem.
      </Typography>
    );

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const paginated = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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
              flexDirection: { xs: "row", sm: "row" },
              gap: 2,
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight={600}
              sx={{ textAlign: "left" }}
            >
              Agenti
            </Typography>

            <Tooltip title="Adauga agent" arrow>
              <Fab
                color="success"
                onClick={() => navigate("/register")}
                size={isMobile ? "medium" : "large"}
                sx={{
                  boxShadow: `0 0 12px ${theme.palette.success.main}55`,
                  "&:hover": { backgroundColor: theme.palette.success.dark },
                }}
              >
                <Add sx={{ color: "white", fontSize: isMobile ? 22 : 26 }} />
              </Fab>
            </Tooltip>
          </Box>

          <Divider
            sx={{
              mb: 3,
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
            }}
          />

          <TableContainer sx={{ flex: 1, overflowX: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Avatar", "Nume", "Email", "Telefon", "Rol", "Actiuni"].map(
                    (h) => (
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
                    )
                  )}
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
                          onClick={() =>
                            navigate(`/register?editId=${user._id}`)
                          }
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
              borderTop: `1px solid ${
                isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
              }`,
            }}
          >
            <TablePagination
              component="div"
              count={users.length}
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
}
