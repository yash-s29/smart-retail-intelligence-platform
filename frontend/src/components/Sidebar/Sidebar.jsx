import React from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { alpha } from "@mui/material/styles";

// ============================================================
// Icons
// ============================================================

import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// ============================================================
// Auth
// ============================================================

import { useAuth } from "../../hooks/useAuth";

// ============================================================
// Layout Constants
// ============================================================

export const drawerWidth = 260;
export const miniDrawerWidth = 72;

const NAVBAR_HEIGHT = 64;

// ============================================================
// Design Tokens
// ============================================================

const SEA_BLUE = "#168AAD";
const SEA_BLUE_DARK = "#11758F";
const SEA_BLUE_SOFT = "#EAF7FA";

const AQUA = "#2A9D8F";

const TEXT_PRIMARY = "#17313B";
const TEXT_SECONDARY = "#67808A";

const BORDER = "#DCECEF";

const WHITE = "#FFFFFF";

const DANGER = "#C84A4A";

// ============================================================
// Navigation
// ============================================================

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: DashboardOutlinedIcon,
  },
  {
    label: "Products",
    path: "/products",
    icon: StorefrontOutlinedIcon,
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: Inventory2OutlinedIcon,
  },
  {
    label: "Sales",
    path: "/sales",
    icon: ShowChartOutlinedIcon,
  },
  {
    label: "Forecasting",
    path: "/forecasting",
    icon: AutoGraphOutlinedIcon,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: ReceiptLongOutlinedIcon,
  },
  {
    label: "AI Store Manager",
    path: "/ai-manager",
    icon: PsychologyOutlinedIcon,
    special: true,
  },
];

// ============================================================
// Sidebar Content
// ============================================================

function SidebarContent({
  onClose,
  isCollapsed,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useAuth();

  // ==========================================================
  // Navigation
  // ==========================================================

  const handleNavigate = (path) => {
    navigate(path);

    if (onClose) {
      onClose();
    }
  };

  // More reliable than comparing pathname + search.
  // This also keeps a parent route active when needed.
  const isSelected = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  // ==========================================================
  // Logout
  // ==========================================================

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });

    if (onClose) {
      onClose();
    }
  };

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",

        display: "flex",
        flexDirection: "column",

        background: `
          linear-gradient(
            180deg,
            ${WHITE} 0%,
            #FBFEFF 55%,
            #F8FCFD 100%
          )
        `,

        color: TEXT_PRIMARY,

        overflow: "hidden",

        position: "relative",

        // Very subtle decorative background.
        "&::before": {
          content: '""',

          position: "absolute",

          width: 180,
          height: 180,

          top: -90,
          left: -90,

          borderRadius: "50%",

          background: alpha(SEA_BLUE, 0.045),

          pointerEvents: "none",
        },

        "&::after": {
          content: '""',

          position: "absolute",

          width: 160,
          height: 160,

          right: -90,
          bottom: 80,

          borderRadius: "50%",

          background: alpha(AQUA, 0.035),

          pointerEvents: "none",
        },
      }}
    >
      {/* ======================================================
          NAVIGATION
          ====================================================== */}

      <List
        disablePadding
        sx={{
          position: "relative",

          zIndex: 1,

          flex: 1,

          px: isCollapsed ? 1 : 1.5,

          pt: 1.75,

          pb: 1,

          overflowY: "auto",

          overflowX: "hidden",

          "&::-webkit-scrollbar": {
            width: 4,
          },

          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },

          "&::-webkit-scrollbar-thumb": {
            background: alpha(SEA_BLUE, 0.14),

            borderRadius: 999,
          },

          "&::-webkit-scrollbar-thumb:hover": {
            background: alpha(SEA_BLUE, 0.24),
          },
        }}
      >
        {navigation.map((item, index) => {
          const Icon = item.icon;

          const active = isSelected(item.path);

          const itemContent = (
            <ListItemButton
              selected={active}
              onClick={() =>
                handleNavigate(item.path)
              }
              aria-current={
                active ? "page" : undefined
              }
              sx={{
                position: "relative",

                minHeight: 50,

                mb: 0.75,

                px: isCollapsed ? 1 : 1.5,

                borderRadius: "14px",

                overflow: "hidden",

                justifyContent: isCollapsed
                  ? "center"
                  : "flex-start",

                color: active
                  ? SEA_BLUE_DARK
                  : TEXT_SECONDARY,

                backgroundColor: active
                  ? alpha(SEA_BLUE, 0.075)
                  : "transparent",

                border: "1px solid",

                borderColor: active
                  ? alpha(SEA_BLUE, 0.10)
                  : "transparent",

                transform: "translateX(0)",

                transition: `
                  background-color 220ms ease,
                  border-color 220ms ease,
                  color 220ms ease,
                  transform 220ms cubic-bezier(.34,1.56,.64,1),
                  box-shadow 220ms ease
                `,

                // ==================================================
                // Active left indicator
                // ==================================================

                "&::before": {
                  content: '""',

                  position: "absolute",

                  left: 0,

                  top: active ? "18%" : "50%",

                  width: active ? 4 : 0,

                  height: active
                    ? "64%"
                    : 0,

                  borderRadius:
                    "0 6px 6px 0",

                  background: `
                    linear-gradient(
                      180deg,
                      ${SEA_BLUE},
                      ${AQUA}
                    )
                  `,

                  opacity: active ? 1 : 0,

                  transform: active
                    ? "translateY(0)"
                    : "translateY(-50%)",

                  transition: `
                    width 220ms ease,
                    height 220ms ease,
                    top 220ms ease,
                    opacity 220ms ease,
                    transform 220ms ease
                  `,
                },

                // ==================================================
                // Active glow
                // ==================================================

                "&::after": active
                  ? {
                      content: '""',

                      position: "absolute",

                      inset: 0,

                      borderRadius: "14px",

                      background: `
                        linear-gradient(
                          90deg,
                          ${alpha(
                            SEA_BLUE,
                            0.045
                          )},
                          transparent 65%
                        )
                      `,

                      pointerEvents: "none",
                    }
                  : {},

                // ==================================================
                // Selected
                // ==================================================

                "&.Mui-selected": {
                  backgroundColor:
                    alpha(SEA_BLUE, 0.075),

                  color: SEA_BLUE_DARK,

                  "&:hover": {
                    backgroundColor:
                      alpha(SEA_BLUE, 0.105),
                  },
                },

                // ==================================================
                // Hover
                // ==================================================

                "&:hover": {
                  backgroundColor: active
                    ? alpha(SEA_BLUE, 0.105)
                    : alpha(SEA_BLUE, 0.045),

                  borderColor: active
                    ? alpha(SEA_BLUE, 0.14)
                    : alpha(SEA_BLUE, 0.07),

                  transform: isCollapsed
                    ? "translateY(-1px)"
                    : "translateX(4px)",

                  boxShadow: active
                    ? `0 7px 18px ${alpha(
                        SEA_BLUE,
                        0.075
                      )}`
                    : `0 5px 15px ${alpha(
                        SEA_BLUE,
                        0.035
                      )}`,

                  "& .sidebar-nav-icon": {
                    color: active
                      ? SEA_BLUE_DARK
                      : SEA_BLUE,

                    transform:
                      "scale(1.09) translateY(-1px)",
                  },

                  "& .sidebar-nav-text": {
                    color: active
                      ? SEA_BLUE_DARK
                      : TEXT_PRIMARY,
                  },
                },

                // ==================================================
                // Active press
                // ==================================================

                "&:active": {
                  transform:
                    "scale(0.975)",
                },

                // ==================================================
                // Focus
                // ==================================================

                "&:focus-visible": {
                  outline: `3px solid ${alpha(
                    SEA_BLUE,
                    0.18
                  )}`,

                  outlineOffset: 2,
                },

                // ==================================================
                // AI Manager Special
                // ==================================================

                ...(item.special && {
                  backgroundColor: active
                    ? alpha(AQUA, 0.085)
                    : alpha(AQUA, 0.018),

                  borderColor: active
                    ? alpha(AQUA, 0.14)
                    : "transparent",

                  "&:hover": {
                    backgroundColor: active
                      ? alpha(AQUA, 0.12)
                      : alpha(AQUA, 0.055),
                  },

                  "&::before": active
                    ? {
                        background: `
                          linear-gradient(
                            180deg,
                            ${AQUA},
                            ${SEA_BLUE}
                          )
                        `,
                      }
                    : {},
                }),
              }}
            >
              {/* ==================================================
                  ICON
                  ================================================== */}

              <ListItemIcon
                className="sidebar-nav-icon-wrapper"
                sx={{
                  minWidth: isCollapsed
                    ? 0
                    : 40,

                  width: isCollapsed
                    ? 40
                    : "auto",

                  mr: isCollapsed
                    ? 0
                    : 0.75,

                  justifyContent:
                    "center",

                  color: active
                    ? SEA_BLUE_DARK
                    : TEXT_SECONDARY,

                  transition:
                    "color 220ms ease",

                  position: "relative",

                  zIndex: 1,
                }}
              >
                <Icon
                  className="sidebar-nav-icon"
                  sx={{
                    fontSize: 22,

                    transform: "scale(1)",

                    transition: `
                      transform 220ms cubic-bezier(.34,1.56,.64,1),
                      color 220ms ease,
                      filter 220ms ease
                    `,

                    filter: active
                      ? `drop-shadow(0 3px 5px ${alpha(
                          SEA_BLUE,
                          0.18
                        )})`
                      : "none",
                  }}
                />
              </ListItemIcon>

              {/* ==================================================
                  TEXT
                  ================================================== */}

              {!isCollapsed && (
                <ListItemText
                  className="sidebar-nav-text-wrapper"
                  primary={item.label}
                  sx={{
                    minWidth: 0,

                    position: "relative",

                    zIndex: 1,

                    opacity: 1,

                    transform:
                      "translateX(0)",

                    transition: `
                      opacity 180ms ease,
                      transform 220ms ease
                    `,
                  }}
                  primaryTypographyProps={{
                    className:
                      "sidebar-nav-text",

                    sx: {
                      fontSize:
                        "0.89rem",

                      lineHeight: 1.2,

                      fontWeight:
                        active ? 750 : 600,

                      color: active
                        ? SEA_BLUE_DARK
                        : TEXT_PRIMARY,

                      whiteSpace:
                        "nowrap",

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",

                      transition:
                        "color 180ms ease, font-weight 180ms ease",
                    },
                  }}
                />
              )}
            </ListItemButton>
          );

          // ========================================================
          // Collapsed tooltip
          // ========================================================

          return isCollapsed ? (
            <Tooltip
              key={item.path}
              title={item.label}
              placement="right"
              arrow
              enterDelay={250}
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor:
                      TEXT_PRIMARY,

                    fontSize:
                      "0.75rem",

                    fontWeight: 650,

                    borderRadius: 8,

                    px: 1.25,
                    py: 0.7,

                    boxShadow:
                      "0 8px 20px rgba(23,49,59,0.16)",
                  },
                },

                arrow: {
                  sx: {
                    color:
                      TEXT_PRIMARY,
                  },
                },
              }}
            >
              {itemContent}
            </Tooltip>
          ) : (
            <Box
              key={item.path}
              sx={{
                animation: `sidebarItemIn 320ms ${
                  60 + index * 30
                }ms both`,
                "@keyframes sidebarItemIn": {
                  from: {
                    opacity: 0,
                    transform:
                      "translateX(-8px)",
                  },

                  to: {
                    opacity: 1,
                    transform:
                      "translateX(0)",
                  },
                },
              }}
            >
              {itemContent}
            </Box>
          );
        })}
      </List>

      {/* ========================================================
          BOTTOM SECTION
          ======================================================== */}

      <Box
        sx={{
          position: "relative",

          zIndex: 2,

          flexShrink: 0,

          pb: isCollapsed ? 1.25 : 1.5,

          px: isCollapsed ? 1 : 1.5,
        }}
      >
        <Divider
          sx={{
            mb: 1.25,

            borderColor: alpha(
              SEA_BLUE,
              0.10
            ),
          }}
        />

        {/* ======================================================
            Logout
            ====================================================== */}

        {isCollapsed ? (
          <Tooltip
            title="Logout"
            placement="right"
            arrow
            enterDelay={250}
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor:
                    TEXT_PRIMARY,

                  fontSize:
                    "0.75rem",

                  fontWeight: 650,

                  borderRadius: 8,
                },
              },
            }}
          >
            <IconButton
              onClick={handleLogout}
              aria-label="Logout"
              sx={{
                width: "100%",

                height: 48,

                borderRadius: "14px",

                color: TEXT_SECONDARY,

                border: "1px solid transparent",

                transition: `
                  background-color 200ms ease,
                  color 200ms ease,
                  border-color 200ms ease,
                  transform 200ms cubic-bezier(.34,1.56,.64,1),
                  box-shadow 200ms ease
                `,

                "&:hover": {
                  backgroundColor:
                    alpha(DANGER, 0.055),

                  borderColor:
                    alpha(DANGER, 0.10),

                  color: DANGER,

                  transform:
                    "translateY(-2px) scale(1.02)",

                  boxShadow: `0 7px 18px ${alpha(
                    DANGER,
                    0.08
                  )}`,

                  "& .logout-icon": {
                    transform:
                      "translateX(-1px) rotate(-8deg)",
                  },
                },

                "&:active": {
                  transform:
                    "scale(0.95)",
                },

                "&:focus-visible": {
                  outline: `3px solid ${alpha(
                    DANGER,
                    0.15
                  )}`,

                  outlineOffset: 2,
                },
              }}
            >
              <LogoutOutlinedIcon
                className="logout-icon"
                sx={{
                  fontSize: 21,

                  transition:
                    "transform 220ms cubic-bezier(.34,1.56,.64,1)",
                }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            fullWidth
            onClick={handleLogout}
            startIcon={
              <LogoutOutlinedIcon
                className="logout-icon"
              />
            }
            aria-label="Logout"
            sx={{
              justifyContent:
                "flex-start",

              minHeight: 48,

              px: 1.75,

              borderRadius: "14px",

              textTransform: "none",

              fontSize:
                "0.88rem",

              fontWeight: 650,

              color: TEXT_SECONDARY,

              backgroundColor:
                "transparent",

              border: "1px solid transparent",

              transition: `
                background-color 200ms ease,
                color 200ms ease,
                border-color 200ms ease,
                transform 200ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 200ms ease
              `,

              "& .logout-icon": {
                fontSize: 20,

                transition:
                  "transform 220ms cubic-bezier(.34,1.56,.64,1)",
              },

              "&:hover": {
                backgroundColor:
                  alpha(DANGER, 0.055),

                borderColor:
                  alpha(DANGER, 0.10),

                color: DANGER,

                transform:
                  "translateX(4px)",

                boxShadow: `0 7px 18px ${alpha(
                  DANGER,
                  0.06
                )}`,

                "& .logout-icon": {
                  transform:
                    "translateX(-1px) rotate(-8deg)",
                },
              },

              "&:active": {
                transform:
                  "scale(0.975)",
              },

              "&:focus-visible": {
                outline: `3px solid ${alpha(
                  DANGER,
                  0.15
                )}`,

                outlineOffset: 2,
              },
            }}
          >
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );
}

// ============================================================
// Sidebar
// ============================================================

function Sidebar({
  mobileOpen,
  onClose,
  variant,
  isCollapsed,
  onToggleCollapse,
}) {
  const theme = useTheme();

  const isDesktop = useMediaQuery(
    theme.breakpoints.up("md")
  );

  const isPermanent =
    variant === "permanent";

  // ==========================================================
  // Important:
  //
  // On desktop:
  // expanded = 260
  // collapsed = 72
  //
  // On mobile:
  // always = 260
  //
  // This prevents the mobile drawer accidentally becoming
  // 72px wide when isCollapsed is true.
  // ==========================================================

  const currentWidth =
    isPermanent && isDesktop
      ? isCollapsed
        ? miniDrawerWidth
        : drawerWidth
      : drawerWidth;

  return (
    <Box
      component="nav"
      aria-label="Main navigation"
      sx={{
        width: {
          md: isPermanent
            ? currentWidth
            : 0,
        },

        flexShrink: 0,

        position: "relative",

        transition:
          "width 320ms cubic-bezier(.4,0,.2,1)",

        // Keep navbar/sidebar sizing synchronized.
        "--navbar-height": `${NAVBAR_HEIGHT}px`,
      }}
    >
      {/* ======================================================
          DESKTOP COLLAPSE BUTTON
          ====================================================== */}

      {isPermanent && isDesktop && (
        <Tooltip
          title={
            isCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          placement="right"
          arrow
        >
          <IconButton
            onClick={onToggleCollapse}
            aria-label={
              isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            sx={{
              position: "fixed",

              left:
                currentWidth - 15,

              top:
                NAVBAR_HEIGHT + 18,

              width: 30,

              height: 30,

              zIndex:
                theme.zIndex.drawer + 5,

              backgroundColor:
                WHITE,

              color: TEXT_SECONDARY,

              border: `1px solid ${BORDER}`,

              boxShadow:
                "0 5px 16px rgba(23,49,59,0.10)",

              transition: `
                left 320ms cubic-bezier(.4,0,.2,1),
                background-color 200ms ease,
                color 200ms ease,
                border-color 200ms ease,
                transform 220ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 200ms ease
              `,

              "&:hover": {
                backgroundColor:
                  SEA_BLUE,

                color: WHITE,

                borderColor:
                  SEA_BLUE,

                transform:
                  "scale(1.08)",

                boxShadow: `0 8px 20px ${alpha(
                  SEA_BLUE,
                  0.20
                )}`,
              },

              "&:active": {
                transform:
                  "scale(0.94)",
              },

              "&:focus-visible": {
                outline: `3px solid ${alpha(
                  SEA_BLUE,
                  0.16
                )}`,

                outlineOffset: 2,
              },

              "& .sidebar-toggle-icon": {
                transition:
                  "transform 300ms cubic-bezier(.34,1.56,.64,1)",
              },

              "&:hover .sidebar-toggle-icon": {
                transform:
                  isCollapsed
                    ? "translateX(1px)"
                    : "translateX(-1px)",
              },
            }}
          >
            {isCollapsed ? (
              <ChevronRightIcon
                className="sidebar-toggle-icon"
                sx={{
                  fontSize: 19,
                }}
              />
            ) : (
              <ChevronLeftIcon
                className="sidebar-toggle-icon"
                sx={{
                  fontSize: 19,
                }}
              />
            )}
          </IconButton>
        </Tooltip>
      )}

      {/* ======================================================
          DRAWER
          ====================================================== */}

      <Drawer
        variant={variant}
        open={
          isPermanent
            ? true
            : Boolean(mobileOpen)
        }
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: currentWidth,

            boxSizing: "border-box",

            overflowX: "hidden",

            borderRight: `1px solid ${BORDER}`,

            backgroundColor:
              WHITE,

            transition: `
              width 320ms cubic-bezier(.4,0,.2,1),
              box-shadow 250ms ease
            `,

            // ==================================================
            // Desktop
            // ==================================================

            ...(isPermanent
              ? {
                  top: `${NAVBAR_HEIGHT}px`,

                  height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,

                  boxShadow:
                    "4px 0 20px rgba(23,49,59,0.025)",
                }
              : {
                  // ==================================================
                  // Mobile drawer
                  // ==================================================

                  top: 0,

                  height: "100vh",

                  boxShadow:
                    "8px 0 35px rgba(23,49,59,0.14)",

                  borderRight: `1px solid ${alpha(
                    SEA_BLUE,
                    0.12
                  )}`,
                }),
          },

          // ======================================================
          // Mobile backdrop
          // ======================================================

          "& .MuiBackdrop-root": {
            backgroundColor:
              "rgba(23,49,59,0.24)",

            backdropFilter:
              "blur(3px)",
          },
        }}
      >
        <SidebarContent
          isCollapsed={
            isPermanent &&
            isDesktop &&
            isCollapsed
          }
          onClose={
            !isPermanent
              ? onClose
              : undefined
          }
        />
      </Drawer>
    </Box>
  );
}

export default Sidebar;
