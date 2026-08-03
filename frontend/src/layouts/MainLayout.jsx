import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar, Fade, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import Sidebar, { drawerWidth } from "../components/Sidebar/Sidebar";

function MainLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentDrawerWidth = isCollapsed ? 72 : drawerWidth;

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleSidebarToggle = () => setIsCollapsed((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        bgcolor: "background.default",
        overflowX: "hidden",
        // Shared layout tokens for child pages
        "--page-max-width": "1680px",
        "--page-gap": "16px",
        "--card-radius": "14px",
        "--navbar-height": "64px",
        "--navbar-height-mobile": "56px",
      }}
    >
      {/* Soft ambient background */}
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 80% 50% at 0% 0%, rgba(99, 102, 241, 0.06), transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 100%, rgba(16, 185, 129, 0.05), transparent 50%)
          `,
        }}
      />

      <Navbar onMenuClick={handleDrawerToggle} isDesktop={isDesktop} />

      {/* Sidebar column — reserves real width on desktop */}
      <Box
        component="nav"
        aria-label="Main navigation"
        sx={{
          width: { md: currentDrawerWidth },
          flexShrink: 0,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeInOut,
            duration: 280,
          }),
        }}
      >
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={handleDrawerToggle}
          variant={isDesktop ? "permanent" : "temporary"}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleSidebarToggle}
        />
      </Box>

      {/* Main column */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          width: "100%",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
          overflowX: "hidden",
          transition: theme.transitions.create(["width"], {
            easing: theme.transitions.easing.easeInOut,
            duration: 280,
          }),
        }}
      >
        {/* Offset under fixed navbar */}
        <Toolbar
          sx={{
            minHeight: {
              xs: "var(--navbar-height-mobile)",
              sm: "var(--navbar-height)",
            },
            flexShrink: 0,
          }}
        />

        {/* Page content */}
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            // Tighter padding = less empty scroll on laptop
            px: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
            pt: { xs: 1.25, sm: 1.5, md: 2 },
            pb: { xs: 2.5, md: 3 },
            boxSizing: "border-box",
          }}
        >
          <Fade in timeout={280}>
            <Box
              sx={{
                width: "100%",
                maxWidth: "var(--page-max-width)",
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                minWidth: 0,
              }}
            >
              <Outlet />
            </Box>
          </Fade>
        </Box>

        <Footer />
      </Box>
    </Box>
  );
}

export default MainLayout;