import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
  Box,
  Toolbar,
  Fade,
  useMediaQuery,
} from "@mui/material";

import { alpha, keyframes, useTheme } from "@mui/material/styles";

import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import Sidebar, { drawerWidth } from "../components/Sidebar/Sidebar";

// ============================================================
// Animations
// ============================================================

const ambientFloat = keyframes`
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(14px, -10px, 0) scale(1.04);
  }

  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

const pageEnter = keyframes`
  0% {
    opacity: 0;
    transform: translateY(8px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ============================================================
// Main Layout
// ============================================================

function MainLayout() {
  const theme = useTheme();

  // Desktop sidebar becomes permanent from md breakpoint.
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ==========================================================
  // Layout dimensions
  // ==========================================================

  const currentDrawerWidth = isCollapsed ? 76 : drawerWidth;

  const navbarHeight = {
    xs: 56,
    sm: 60,
    md: 64,
  };

  // ==========================================================
  // Handlers
  // ==========================================================

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleSidebarToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        position: "relative",

        // Light-only application background
        bgcolor: "#F7FBFC",

        color: "text.primary",

        overflowX: "hidden",

        // ======================================================
        // Shared design tokens
        // ======================================================

        "--page-max-width": "1680px",
        "--page-gap": "16px",
        "--card-radius": "16px",
        "--navbar-height": "64px",
        "--navbar-height-mobile": "56px",

        // Sea-blue application tokens
        "--sea-blue": "#168AAD",
        "--sea-blue-light": "#EAF7FA",
        "--sea-blue-soft": "#F3FBFC",
        "--soft-beige": "#FBF9F4",

        // Smooth global transition
        transition: "background-color 240ms ease",
      }}
    >
      {/* ======================================================
          Ambient Background
          ====================================================== */}

      <Box
        aria-hidden="true"
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",

          background: `
            radial-gradient(
              ellipse 70% 45% at 0% 0%,
              rgba(22, 138, 173, 0.075),
              transparent 65%
            ),
            radial-gradient(
              ellipse 60% 40% at 100% 100%,
              rgba(52, 168, 167, 0.055),
              transparent 65%
            ),
            linear-gradient(
              180deg,
              #F9FCFD 0%,
              #F7FBFC 55%,
              #FBFAF6 100%
            )
          `,
        }}
      />

      {/* ======================================================
          Floating Ambient Orb — Top Right
          ====================================================== */}

      <Box
        aria-hidden="true"
        sx={{
          position: "fixed",
          width: { xs: 180, sm: 240, md: 300 },
          height: { xs: 180, sm: 240, md: 300 },

          top: {
            xs: -110,
            md: -150,
          },

          right: {
            xs: -110,
            md: -140,
          },

          borderRadius: "50%",

          background: `
            radial-gradient(
              circle,
              rgba(22, 138, 173, 0.075) 0%,
              rgba(22, 138, 173, 0.025) 45%,
              transparent 72%
            )
          `,

          filter: "blur(1px)",

          animation: `${ambientFloat} 10s ease-in-out infinite`,

          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ======================================================
          Floating Ambient Orb — Bottom Left
          ====================================================== */}

      <Box
        aria-hidden="true"
        sx={{
          position: "fixed",

          width: { xs: 150, sm: 210, md: 270 },
          height: { xs: 150, sm: 210, md: 270 },

          bottom: {
            xs: -100,
            md: -130,
          },

          left: {
            xs: -90,
            md: -120,
          },

          borderRadius: "50%",

          background: `
            radial-gradient(
              circle,
              rgba(42, 157, 143, 0.05) 0%,
              rgba(42, 157, 143, 0.018) 45%,
              transparent 72%
            )
          `,

          animation: `${ambientFloat} 12s ease-in-out infinite reverse`,

          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ======================================================
          NAVBAR
          ====================================================== */}

      <Navbar
        onMenuClick={handleDrawerToggle}
        isDesktop={isDesktop}
      />

      {/* ======================================================
          SIDEBAR
          ====================================================== */}

      <Box
        component="nav"
        aria-label="Main navigation"
        sx={{
          width: {
            xs: 0,
            md: currentDrawerWidth,
          },

          flexShrink: 0,

          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeInOut,
            duration: "280ms",
          }),

          position: "relative",
          zIndex: 1200,
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

      {/* ======================================================
          MAIN APPLICATION COLUMN
          ====================================================== */}

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

          transition: theme.transitions.create(
            ["width", "margin"],
            {
              easing: theme.transitions.easing.easeInOut,
              duration: "280ms",
            }
          ),
        }}
      >
        {/* ====================================================
            NAVBAR OFFSET
            ==================================================== */}

        <Toolbar
          disableGutters
          sx={{
            minHeight: {
              xs: `${navbarHeight.xs}px`,
              sm: `${navbarHeight.sm}px`,
              md: `${navbarHeight.md}px`,
            },

            flexShrink: 0,

            width: "100%",
          }}
        />

        {/* ====================================================
            PAGE CONTENT WRAPPER
            ==================================================== */}

        <Box
          sx={{
            flexGrow: 1,

            width: "100%",

            display: "flex",
            flexDirection: "column",

            minWidth: 0,

            boxSizing: "border-box",

            // Compact responsive spacing.
            // This intentionally keeps pages short.
            px: {
              xs: 1.25,
              sm: 1.75,
              md: 2.25,
              lg: 2.75,
              xl: 3,
            },

            pt: {
              xs: 1,
              sm: 1.25,
              md: 1.75,
              lg: 2,
            },

            pb: {
              xs: 2,
              sm: 2.25,
              md: 2.5,
              lg: 3,
            },
          }}
        >
          {/* ==================================================
              PAGE MAX WIDTH
              ================================================== */}

          <Fade
            in
            timeout={{
              enter: 350,
              exit: 180,
            }}
          >
            <Box
              sx={{
                width: "100%",

                maxWidth: "var(--page-max-width)",

                mx: "auto",

                display: "flex",
                flexDirection: "column",

                flexGrow: 1,

                minWidth: 0,

                // Subtle page entrance.
                animation: `${pageEnter} 420ms ease-out`,

                // Prevent children from accidentally causing
                // horizontal scrolling.
                "& > *": {
                  minWidth: 0,
                  maxWidth: "100%",
                },
              }}
            >
              <Outlet />
            </Box>
          </Fade>
        </Box>

        {/* ====================================================
            FOOTER
            ==================================================== */}

        <Box
          sx={{
            width: "100%",

            borderTop: "1px solid",
            borderColor: alpha("#168AAD", 0.08),

            bgcolor: alpha("#FFFFFF", 0.72),

            backdropFilter: "blur(10px)",

            position: "relative",

            zIndex: 2,
          }}
        >
          <Footer />
        </Box>
      </Box>

      {/* ======================================================
          GLOBAL RESPONSIVE / ACCESSIBILITY STYLES
          ====================================================== */}

      <Box
        component="style"
        sx={{
          display: "none",
        }}
      >
        {`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          html {
            overflow-x: hidden;
            scroll-behavior: smooth;
          }

          body {
            margin: 0;
            overflow-x: hidden;
            background: #F7FBFC;
          }

          ::selection {
            background: rgba(22, 138, 173, 0.18);
          }

          @media (prefers-reduced-motion: reduce) {
            html {
              scroll-behavior: auto;
            }

            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </Box>
    </Box>
  );
}

export default MainLayout;
