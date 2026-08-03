import { useLocation, useNavigate } from "react-router-dom";
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
  useTheme,
  useMediaQuery
} from "@mui/material";
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

import { useAuth } from "../../hooks/useAuth";

export const drawerWidth = 260;
export const miniDrawerWidth = 72;

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: DashboardOutlinedIcon },
  { label: "Products", path: "/products", icon: StorefrontOutlinedIcon },
  { label: "Inventory", path: "/inventory", icon: Inventory2OutlinedIcon },
  { label: "Sales", path: "/sales", icon: ShowChartOutlinedIcon },
  { label: "Forecasting", path: "/forecasting", icon: AutoGraphOutlinedIcon },
  { label: "Reports", path: "/reports", icon: ReceiptLongOutlinedIcon },
  { label: "AI Store Manager", path: "/ai-manager", icon: PsychologyOutlinedIcon }
];

function SidebarContent({ onClose, isCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isSelected = (path) => `${location.pathname}${location.search}` === path;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: 'background.paper' }}>
      {/* Navigation List Nodes */}
      <List sx={{ px: isCollapsed ? 1 : 2, py: 2, flexGrow: 1 }}>
      {navigation.map((item) => {
  const Icon = item.icon;
  const active = isSelected(item.path);

  const itemContent = (
    <ListItemButton
      selected={active}
      onClick={() => handleNavigate(item.path)}
      sx={{
        position: "relative",
        mb: 1,
        minHeight: 50,
        px: isCollapsed ? 1 : 2,
        justifyContent: isCollapsed ? "center" : "flex-start",
        borderRadius: "14px",
        overflow: "hidden",
        transition: "all .25s ease",

        color: active
          ? "primary.main"
          : "text.secondary",

        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: "18%",
          bottom: "18%",
          width: active ? 4 : 0,
          bgcolor: "primary.main",
          borderRadius: "0 4px 4px 0",
          transition: ".25s",
        },

        "&.Mui-selected": {
          bgcolor: "rgba(99,102,241,.08)",

          "&:hover": {
            bgcolor: "rgba(99,102,241,.12)",
          },
        },

        "&:hover": {
          bgcolor: "action.hover",
          transform: "translateX(4px)",

          "& .MuiListItemIcon-root": {
            color: "primary.main",
            transform: "scale(1.12)",
          },
        },

        "&:active": {
          transform: "scale(.98)",
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: isCollapsed ? 0 : 40,
          mr: isCollapsed ? 0 : 1,
          justifyContent: "center",
          color: active
            ? "primary.main"
            : "text.secondary",
          transition: ".25s",
        }}
      >
        <Icon sx={{ fontSize: 22 }} />
      </ListItemIcon>

      {!isCollapsed && (
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontWeight: active ? 700 : 600,
            fontSize: "0.92rem",
          }}
        />
      )}
    </ListItemButton>
  );

  return isCollapsed ? (
    <Tooltip
      key={item.path}
      title={item.label}
      placement="right"
      arrow
    >
      {itemContent}
    </Tooltip>
  ) : (
    <Box key={item.path}>
      {itemContent}
    </Box>
  );
})}
</List>

      <Divider
        sx={{
          mx: 2,
          opacity: 0.6,
        }}
      />

      {/* ======================================
                  Logout Section
      ======================================= */}

      <Box
        sx={{
          p: isCollapsed ? 1 : 2,
        }}
      >
        {isCollapsed ? (
          <Tooltip
            title="Logout"
            placement="right"
            arrow
          >
            <IconButton
              fullWidth
              onClick={handleLogout}
              sx={{
                width: "100%",
                height: 48,
                borderRadius: "14px",

                color: "text.secondary",

                transition: ".25s",

                "&:hover": {
                  bgcolor: "rgba(239,68,68,.08)",
                  color: "error.main",
                  transform: "scale(1.05)",
                },
              }}
            >
              <LogoutOutlinedIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            fullWidth
            startIcon={<LogoutOutlinedIcon />}
            onClick={handleLogout}
            sx={{
              justifyContent: "flex-start",

              borderRadius: "14px",

              py: 1.4,

              px: 2,

              fontWeight: 600,

              textTransform: "none",

              color: "text.secondary",

              transition: ".25s",

              "&:hover": {
                bgcolor: "rgba(239,68,68,.08)",
                color: "error.main",
                transform: "translateX(4px)",
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

  const isPermanent = variant === "permanent";

  const currentWidth = isCollapsed
    ? miniDrawerWidth
    : drawerWidth;

  return (
    <Box
      component="nav"
      sx={{
        width: {
          md: isPermanent
            ? currentWidth
            : 0,
        },

        flexShrink: 0,

        transition:
          "width .30s cubic-bezier(.4,0,.2,1)",

        position: "relative",
      }}
    >
      {/* ===========================
            Desktop Collapse Button
      ============================ */}

      {isPermanent && isDesktop && (
        <IconButton
          onClick={onToggleCollapse}
          sx={{
            position: "fixed",

            left: currentWidth - 15,

            top: `calc(var(--navbar-height, 72px) + 20px)`,

            width: 30,

            height: 30,

            zIndex:
              theme.zIndex.drawer + 5,

            bgcolor: "#fff",

            border: "1px solid",

            borderColor: "divider",

            boxShadow:
              "0 4px 12px rgba(0,0,0,.08)",

            transition:
              "all .30s cubic-bezier(.4,0,.2,1)",

            "&:hover": {
              bgcolor: "primary.main",

              color: "#fff",

              transform: "scale(1.08)",
            },
          }}
        >
          {isCollapsed ? (
            <ChevronRightIcon
              fontSize="small"
            />
          ) : (
            <ChevronLeftIcon
              fontSize="small"
            />
          )}
        </IconButton>
      )}

      {/* ===========================
                Drawer
      ============================ */}

      <Drawer
        variant={variant}
        open={
          isPermanent
            ? true
            : mobileOpen
        }
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: currentWidth,

            overflowX: "hidden",

            boxSizing: "border-box",

            borderRight: "1px solid",

            borderColor: "divider",

            transition:
              "width .30s cubic-bezier(.4,0,.2,1)",

            boxShadow: isPermanent
              ? "none"
              : "0 8px 30px rgba(0,0,0,.10)",

            ...(isPermanent
              ? {
                  top: "var(--navbar-height, 72px)",

                  height:
                    "calc(100vh - var(--navbar-height, 72px))",
                }
              : {
                  top: 0,

                  height: "100vh",
                }),
          },
        }}
      >
        {/* ensure drawer paper matches theme.surface */}
        <SidebarContent
          isCollapsed={
            isPermanent &&
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