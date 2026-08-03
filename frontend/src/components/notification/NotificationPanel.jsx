import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

// ======================================================
// Context Import (Swapped out Redux for Context)
// ======================================================
import { useNotifications } from "../../context/NotificationContext"; // Adjust path to match your structure

// ======================================================
// Material UI Imports
// ======================================================
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel,
  FormGroup,
  Paper,
  alpha,
  styled,
} from "@mui/material";

// ======================================================
// Icon Imports
// ======================================================
import CloseIcon from "@mui/icons-material/Close";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LaunchIcon from "@mui/icons-material/Launch";

// ======================================================
// Styled Components
// ======================================================
const PanelContainer = styled(motion.div)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[8],
  [theme.breakpoints.down("sm")]: {
    width: "100vw",
    maxHeight: "85vh",
    borderTopLeftRadius: theme.shape.borderRadius * 3,
    borderTopRightRadius: theme.shape.borderRadius * 3,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    position: "relative",
  },
  [theme.breakpoints.up("sm")]: {
    width: 440,
    maxHeight: "80vh",
    borderRadius: theme.shape.borderRadius * 2,
  },
}));

const ScrollableContent = styled(Box)(({ theme }) => ({
  overflowY: "auto",
  overflowX: "hidden",
  flex: 1,
  scrollBehavior: "smooth",
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  "&::-webkit-scrollbar": { width: "6px" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.text.disabled, 0.3),
    borderRadius: "4px",
  },
}));

const NotificationItemRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isRead",
})(({ theme, isRead }) => ({
  padding: theme.spacing(2.5, 2),
  cursor: "pointer",
  transition: theme.transitions.create(["background-color", "border-left-color"], {
    duration: theme.transitions.duration.shortest,
  }),
  borderLeft: isRead ? "4px solid transparent" : `4px solid ${theme.palette.primary.main}`,
  backgroundColor: isRead ? theme.palette.background.paper : alpha(theme.palette.primary.main, 0.04),
  "&:hover": { backgroundColor: theme.palette.action.hover },
}));

const StickHeaderGroup = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 2,
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: "blur(8px)",
}));

// ======================================================
// Configuration Maps & Constants
// ======================================================
const PANEL_TABS = { ALL: 0, UNREAD: 1, ALERTS: 2, SETTINGS: 3 };
const SEVERITY_TYPES = { SUCCESS: "success", WARNING: "warning", ERROR: "error", INFO: "info", CRITICAL: "critical" };
const INVENTORY_CATEGORIES = { LOW_STOCK: "low_stock", OUT_OF_STOCK: "out_of_stock", DISCREPANCY: "discrepancy", INBOUND_SHIPMENT: "inbound_shipment", SYSTEM: "system" };

// ======================================================
// Helper Utilities
// ======================================================
function getRelativeTime(dateString) {
  if (!dateString) return "Unknown time";
  const now = new Date();
  const created = new Date(dateString);
  if (isNaN(created.getTime())) return "Invalid date";
  const diff = Math.floor((now - created) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} day ago`;
  return created.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getNotificationConfig(item) {
  if (!item) return { icon: <InfoOutlinedIcon color="info" fontSize="small" />, color: "info", label: "System Log" };
  const severity = item.severity || item.type || "info";
  const mappedCategory = item.category || "system";
  if (mappedCategory === INVENTORY_CATEGORIES.INBOUND_SHIPMENT) return { icon: <LocalShippingOutlinedIcon color="primary" fontSize="small" />, color: "primary", label: "Shipment" };
  switch (severity.toLowerCase()) {
    case SEVERITY_TYPES.SUCCESS: return { icon: <CheckCircleOutlineRoundedIcon color="success" fontSize="small" />, color: "success", label: "Success" };
    case SEVERITY_TYPES.WARNING: return { icon: <WarningAmberRoundedIcon color="warning" fontSize="small" />, color: "warning", label: "Warning" };
    case SEVERITY_TYPES.ERROR: return { icon: <ErrorOutlineRoundedIcon color="error" fontSize="small" />, color: "error", label: "Error" };
    case SEVERITY_TYPES.CRITICAL: return { icon: <PriorityHighIcon sx={{ color: "#d32f2f" }} fontSize="small" />, color: "error", label: "Critical" };
    case SEVERITY_TYPES.INFO: default: return { icon: <InfoOutlinedIcon color="info" fontSize="small" />, color: "info", label: "Info" };
  }
}

function groupNotificationsByDate(list) {
  const groups = { today: [], yesterday: [], older: [] };
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const yesterdayMidnight = new Date(todayMidnight);
  yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);
  list.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    if (isNaN(itemDate.getTime())) groups.older.push(item);
    else if (itemDate >= todayMidnight) groups.today.push(item);
    else if (itemDate >= yesterdayMidnight) groups.yesterday.push(item);
    else groups.older.push(item);
  });
  return groups;
}

// ======================================================
// Subcomponent: SettingsPanel
// ======================================================
function NotificationSettingsView({ onBack }) {
  const [preferences, setPreferences] = useState({ lowStock: true, outOfStock: true, systemLogs: false });
  const handleToggle = (key) => setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <IconButton size="small" onClick={onBack} aria-label="return to notifications"><ArrowBackIcon fontSize="small" /></IconButton>
          <Typography variant="subtitle1" fontWeight={700}>Notification Preferences</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>Configure how your active inventory instance reports updates.</Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <FormGroup>
            <FormControlLabel
              control={<Switch size="small" checked={preferences.outOfStock} onChange={() => handleToggle("outOfStock")} />}
              label={<Box><Typography variant="body2" fontWeight={600}>Out of Stock</Typography><Typography variant="caption" color="text.secondary">Triggers when a SKU drops to zero.</Typography></Box>}
              sx={{ mb: 2, alignItems: "flex-start", "& .MuiFormControlLabel-label": { mt: -0.2 } }}
            />
            <FormControlLabel
              control={<Switch size="small" checked={preferences.lowStock} onChange={() => handleToggle("lowStock")} />}
              label={<Box><Typography variant="body2" fontWeight={600}>Low Stock Safety</Typography><Typography variant="caption" color="text.secondary">Warnings when breaching reorder levels.</Typography></Box>}
              sx={{ alignItems: "flex-start", "& .MuiFormControlLabel-label": { mt: -0.2 } }}
            />
          </FormGroup>
        </Paper>
      </Box>
    </motion.div>
  );
}

// ======================================================
// Subcomponent: EmptyState
// ======================================================
function NotificationEmptyState({ activeFilter }) {
  const getEmptyMessage = () => {
    switch (activeFilter) {
      case PANEL_TABS.UNREAD: return { title: "You're all caught up", desc: "You have reviewed all outstanding updates from this cycle." };
      case PANEL_TABS.ALERTS: return { title: "No operational hazards", desc: "Excellent! No critical structural shortfalls found." };
      default: return { title: "All quiet here", desc: "No active logs or system updates are stored right now." };
    }
  };
  const message = getEmptyMessage();

  return (
    <Box sx={{ py: 10, px: 4, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "center" }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
        <Box sx={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: (theme) => alpha(theme.palette.text.disabled, 0.08), display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
          <NotificationsOffOutlinedIcon sx={{ fontSize: 40, color: "text.disabled" }} />
        </Box>
      </motion.div>
      <Typography variant="h6" fontWeight={700} gutterBottom>{message.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>{message.desc}</Typography>
    </Box>
  );
}

// ======================================================
// Subcomponent: NotificationCardItem
// ======================================================
function NotificationCardItem({ notification, onClick, onDelete }) {
  const theme = useTheme();
  const config = getNotificationConfig(notification);

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
      <NotificationItemRow onClick={() => onClick(notification)} isRead={notification.read} role="button" tabIndex={0}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ mt: 0.5, display: "flex", p: 0.8, borderRadius: "50%", backgroundColor: alpha(theme.palette[config.color]?.main || theme.palette.text.disabled, 0.1) }}>
            {config.icon}
          </Box>
          <Box flex={1} minWidth={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Typography variant="body2" fontWeight={notification.read ? 500 : 700} color="text.primary" sx={{ lineHeight: 1.4, wordBreak: "break-word", pr: 1 }}>
                {notification.title}
              </Typography>
              <Chip size="small" label={notification.type?.replace(/_/g, " ") || config.label} color={config.color} variant={notification.read ? "outlined" : "filled"} sx={{ fontSize: "10px", fontWeight: 700, height: 20, textTransform: "uppercase", flexShrink: 0 }} />
            </Stack>
            <Typography variant="body2" color="text.secondary" mt={0.5} sx={{ lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
              {notification.message}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.5}>
              <Typography variant="caption" color="text.disabled" fontWeight={500}>{getRelativeTime(notification.createdAt)}</Typography>
              <Tooltip title="Dismiss Alert">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }} sx={{ opacity: 0.6, padding: "4px", "&:hover": { opacity: 1, color: theme.palette.error.main, backgroundColor: alpha(theme.palette.error.main, 0.1) } }}>
                  <CloseIcon fontSize="inherit" style={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Stack>
      </NotificationItemRow>
      <Divider />
    </motion.div>
  );
}

// ======================================================
// Main Panel Component Execution
// ======================================================
export default function NotificationPanel({ onClose }) {
  const navigate = useNavigate();
  const theme = useTheme();

  // Pull data and functions directly from Context instead of Redux
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState(PANEL_TABS.ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab === PANEL_TABS.UNREAD && item.read) return false;
      if (activeTab === PANEL_TABS.ALERTS) {
        const severity = (item.severity || item.type || "").toLowerCase();
        if (![SEVERITY_TYPES.ERROR, SEVERITY_TYPES.WARNING, SEVERITY_TYPES.CRITICAL].includes(severity)) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return item.title?.toLowerCase().includes(query) || item.message?.toLowerCase().includes(query);
      }
      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  const groupedNotifications = useMemo(() => groupNotificationsByDate(filteredNotifications), [filteredNotifications]);

  const handleNotificationClick = useCallback((notification) => {
    if (!notification.read) markAsRead(notification.id);
    if (notification.link) navigate(notification.link);
    if (isMobile && onClose) onClose();
  }, [markAsRead, navigate, isMobile, onClose]);

  const renderGroupSection = (title, list) => {
    if (!list || list.length === 0) return null;
    return (
      <Box key={title}>
        <Box sx={{ px: 2, py: 1.2, backgroundColor: alpha(theme.palette.background.default, 0.8), borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</Typography>
        </Box>
        <AnimatePresence>
          {list.map((notification) => (
            <NotificationCardItem key={notification.id} notification={notification} onClick={handleNotificationClick} onDelete={removeNotification} />
          ))}
        </AnimatePresence>
      </Box>
    );
  };

  if (activeTab === PANEL_TABS.SETTINGS) {
    return (
      <PanelContainer initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
        <NotificationSettingsView onBack={() => setActiveTab(PANEL_TABS.ALL)} />
      </PanelContainer>
    );
  }

  return (
    <PanelContainer initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <StickHeaderGroup>
        <Box sx={{ p: 2, pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
                <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.5px", lineHeight: 1 }}>
                  Alert Center
                </Typography>
                {/* 
                  The `showZero` prop ensures 0 is visible when unreadCount is 0,
                  fulfilling the requirement to show 0 notifications.
                */}
                <Badge badgeContent={unreadCount} showZero color={unreadCount > 0 ? "error" : "default"} max={99} sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }} />
              </Stack>
              <Typography variant="caption" color="text.secondary">Live monitoring instance diagnostics</Typography>
            </Box>

            {/* HCI Improvement: Perfectly aligned icon stack on the right */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: -0.5 }}>
              <Tooltip title="Search alerts">
                <IconButton size="small" onClick={() => setShowSearch(!showSearch)} color={showSearch ? "primary" : "default"} sx={{ width: 36, height: 36 }}>
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Preferences">
                <IconButton size="small" onClick={() => setActiveTab(PANEL_TABS.SETTINGS)} sx={{ width: 36, height: 36 }}>
                  <SettingsOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {onClose && (
                <IconButton size="small" onClick={onClose} aria-label="Close panel" sx={{ width: 36, height: 36 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Stack>

          <AnimatePresence>
            {showSearch && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                <Box sx={{ pt: 2, pb: 0.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Search titles, keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><FilterListIcon fontSize="inherit" color="action" /></InputAdornment>,
                      endAdornment: searchQuery && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchQuery("")}><CloseIcon style={{ fontSize: "14px" }} /></IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: alpha(theme.palette.action.hover, 0.3) } }}
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="fullWidth" textColor="primary" indicatorColor="primary" sx={{ minHeight: 44, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Tab label="All" value={PANEL_TABS.ALL} sx={{ textTransform: "none", fontWeight: 600, minHeight: 44 }} />
          <Tab label="Unread" value={PANEL_TABS.UNREAD} sx={{ textTransform: "none", fontWeight: 600, minHeight: 44 }} />
          <Tab label="Alerts" value={PANEL_TABS.ALERTS} sx={{ textTransform: "none", fontWeight: 600, minHeight: 44 }} />
        </Tabs>
      </StickHeaderGroup>

      <ScrollableContent>
        {filteredNotifications.length === 0 ? (
          <NotificationEmptyState activeFilter={activeTab} />
        ) : (
          <Box pb={2}>
            {renderGroupSection("Today", groupedNotifications.today)}
            {renderGroupSection("Yesterday", groupedNotifications.yesterday)}
            {renderGroupSection("Older", groupedNotifications.older)}
          </Box>
        )}
      </ScrollableContent>

      {notifications.length > 0 && (
        <Box sx={{ p: 1.5, borderTop: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button size="small" color="primary" onClick={markAllAsRead} startIcon={<DoneAllIcon />} sx={{ textTransform: "none", fontWeight: 600 }} disabled={unreadCount === 0}>
              Mark all read
            </Button>
            <Button size="small" color="error" onClick={() => window.confirm("Clear all historical logs?") && clearAllNotifications()} startIcon={<DeleteSweepOutlinedIcon />} sx={{ textTransform: "none", fontWeight: 600 }}>
              Clear all
            </Button>
          </Stack>
        </Box>
      )}
    </PanelContainer>
  );
}

NotificationPanel.propTypes = { onClose: PropTypes.func };