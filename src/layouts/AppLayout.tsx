import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Drawer, IconButton, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import SidePanel from "../components/SidePanel/SidePanel";

const AppLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            width: 400,
            height: "100%",
            flexShrink: 0,
          }}
        >
          <SidePanel />
        </Box>
      )}

      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: `0 2px 8px ${theme.palette.primary.main}22`,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: { xs: 64, sm: 64 },
              px: 2,
            }}
          >
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.default,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.getContrastText(theme.palette.primary.main),
                },
              }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Box sx={{ width: 40 }} />
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 320,
            background: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            boxShadow: `4px 0 15px ${theme.palette.primary.main}22`,
          },
        }}
      >
        <SidePanel onNavigate={handleDrawerToggle} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          height: "100%",
          overflowY: "auto",
          transition: "padding 0.3s ease",
          scrollBehavior: "smooth",
          pt: {
            xs: `calc(64px + 24px)`,
            sm: 3,
            md: 3,
          },
          pb: { xs: 2, sm: 3, md: 3 },
          pr: { xs: 2, sm: 3, md: 3 },
          pl: { xs: 2, sm: 3, md: 3 },

          "&::-webkit-scrollbar": {
            width: 10,
            backgroundColor: theme.palette.background.default,
            borderRadius: 10,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 10,
          },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
