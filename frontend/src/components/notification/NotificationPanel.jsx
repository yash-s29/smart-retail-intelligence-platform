import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import PropTypes from "prop-types";

import { useNotifications } from "../../context/NotificationContext";

import {
  alpha,
  Box,
  Badge,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";

/* ============================================================
   ICONS
   ============================================================ */

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

/* ============================================================
   OPTIONAL SHARED COLORS
   ------------------------------------------------------------
   If your project already has shared.js, you can replace these
   values with your COLORS object.
   ============================================================ */

const UI = {
  primary: "#167c9e",
  primaryDark: "#0f667f",
  primaryDeep: "#0b5165",

  aqua: "#83d8e8",
  aquaPale: "#eef9fb",

  ink: "#17313b",
  slate: "#526a73",
  muted: "#81939a",

  border: "#dcecef",

  success: "#438b62",
  warning: "#d9962f",
  error: "#d95b56",
  info: "#4d8fc4",

  white: "#ffffff",
  page: "#f7fbfc",
};

/* ============================================================
   CONSTANTS
   ============================================================ */

const PANEL_TABS = {
  ALL: 0,
  UNREAD: 1,
  ALERTS: 2,
};

const SEVERITY_TYPES = {
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  CRITICAL: "critical",
  INFO: "info",
};

const INVENTORY_CATEGORIES = {
  LOW_STOCK: "low_stock",
  OUT_OF_STOCK: "out_of_stock",
  DISCREPANCY: "discrepancy",
  INBOUND_SHIPMENT: "inbound_shipment",
  SYSTEM: "system",
  SALES: "sales",
  FORECAST: "forecast",
  REPORT: "report",
};

const PREFERENCE_STORAGE_KEY =
  "smartRetailNotificationPreferences";

const DEFAULT_PREFERENCES = {
  lowStock: true,
  outOfStock: true,
  systemLogs: true,
  salesUpdates: true,
  forecastUpdates: true,
  desktopNotifications: false,
};

/* ============================================================
   STYLED COMPONENTS
   ============================================================ */

const PanelContainer = styled(motion.div)(
  ({ theme }) => ({
    width: 460,
    maxWidth: "min(460px, calc(100vw - 24px))",

    display: "flex",
    flexDirection: "column",

    maxHeight: "min(760px, calc(100vh - 32px))",

    overflow: "hidden",

    background:
      theme.palette.background.paper,

    border:
      `1px solid ${alpha(
        UI.primary,
        0.12
      )}`,

    borderRadius: 24,

    boxShadow:
      "0 24px 70px rgba(16,77,96,.18)",

    backdropFilter:
      "blur(18px)",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      maxWidth: "100vw",

      maxHeight:
        "calc(100vh - 12px)",

      minHeight: "82vh",

      borderRadius:
        "22px 22px 0 0",

      borderBottom:
        "none",

      position:
        "relative",
    },
  })
);

const PanelHeader = styled(Box)(() => ({
  background:
    "linear-gradient(180deg,#ffffff 0%,#f9fdfe 100%)",

  borderBottom:
    `1px solid ${UI.border}`,

  flexShrink: 0,
}));

const ScrollableContent = styled(Box)(
  ({ theme }) => ({
    flex: 1,

    overflowY: "auto",
    overflowX: "hidden",

    background:
      UI.page,

    scrollbarWidth: "thin",

    "&::-webkit-scrollbar": {
      width: 6,
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor:
        alpha(
          theme.palette.text.disabled,
          0.25
        ),

      borderRadius: 10,
    },
  })
);

const GroupHeader = styled(Box)(
  ({ theme }) => ({
    position: "sticky",
    top: 0,

    zIndex: 3,

    padding:
      theme.spacing(
        1,
        2
      ),

    background:
      alpha(
        "#f7fbfc",
        0.96
      ),

    backdropFilter:
      "blur(12px)",

    borderBottom:
      `1px solid ${alpha(
        theme.palette.divider,
        0.6
      )}`,
  })
);

const NotificationCard = styled(motion.div, {
  shouldForwardProp: (
    prop
  ) =>
    prop !== "unread" &&
    prop !== "tone",
})(({ unread, tone }) => ({
  position: "relative",

  margin:
    "10px 12px",

  borderRadius: 17,

  border:
    `1px solid ${
      unread
        ? alpha(
            tone,
            0.18
          )
        : UI.border
    }`,

  background:
    unread
      ? `linear-gradient(
          135deg,
          ${alpha(tone, 0.065)},
          #ffffff
        )`
      : "#ffffff",

  boxShadow:
    unread
      ? `0 7px 22px ${alpha(
          tone,
          0.08
        )}`
      : "0 3px 12px rgba(16,77,96,.035)",

  cursor: "pointer",

  transition:
    "all .2s ease",

  overflow: "hidden",

  "&:hover": {
    transform:
      "translateY(-1px)",

    boxShadow:
      unread
        ? `0 12px 28px ${alpha(
            tone,
            0.12
          )}`
        : "0 8px 20px rgba(16,77,96,.075)",
  },

  "&:focus-visible": {
    outline:
      `3px solid ${alpha(
        UI.primary,
        0.22
      )}`,

    outlineOffset: 2,
  },
}));

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

function getRelativeTime(
  dateString
) {
  if (!dateString) {
    return "Unknown time";
  }

  const created =
    new Date(dateString);

  if (
    Number.isNaN(
      created.getTime()
    )
  ) {
    return "Unknown time";
  }

  const now =
    new Date();

  const diffSeconds =
    Math.floor(
      (now.getTime() -
        created.getTime()) /
        1000
    );

  if (diffSeconds < 0) {
    return "Just now";
  }

  if (diffSeconds < 60) {
    return "Just now";
  }

  if (diffSeconds < 3600) {
    const minutes =
      Math.floor(
        diffSeconds /
          60
      );

    return `${minutes} min ago`;
  }

  if (diffSeconds < 86400) {
    const hours =
      Math.floor(
        diffSeconds /
          3600
      );

    return `${hours} hr ago`;
  }

  if (diffSeconds < 604800) {
    const days =
      Math.floor(
        diffSeconds /
          86400
      );

    return `${days} day${
      days === 1 ? "" : "s"
    } ago`;
  }

  return created.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function getNotificationDateLabel(
  dateString
) {
  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Earlier";
  }

  const now =
    new Date();

  const today =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

  const yesterday =
    new Date(today);

  yesterday.setDate(
    yesterday.getDate() -
      1
  );

  if (date >= today) {
    return "Today";
  }

  if (date >= yesterday) {
    return "Yesterday";
  }

  return "Earlier";
}

function getSeverity(
  notification
) {
  return (
    notification?.severity ||
    notification?.type ||
    "info"
  ).toLowerCase();
}

function getCategory(
  notification
) {
  return (
    notification?.category ||
    "system"
  ).toLowerCase();
}

/* ============================================================
   NOTIFICATION CONFIG
   ============================================================ */

function getNotificationConfig(
  notification
) {
  const severity =
    getSeverity(
      notification
    );

  const category =
    getCategory(
      notification
    );

  if (
    category ===
    INVENTORY_CATEGORIES.OUT_OF_STOCK
  ) {
    return {
      icon: Inventory2OutlinedIcon,
      tone: UI.error,
      label: "Out of stock",
      bg: alpha(
        UI.error,
        0.09
      ),
    };
  }

  if (
    category ===
    INVENTORY_CATEGORIES.LOW_STOCK
  ) {
    return {
      icon: Inventory2OutlinedIcon,
      tone: UI.warning,
      label: "Low stock",
      bg: alpha(
        UI.warning,
        0.09
      ),
    };
  }

  if (
    category ===
    INVENTORY_CATEGORIES.INBOUND_SHIPMENT
  ) {
    return {
      icon:
        LocalShippingOutlinedIcon,
      tone: UI.primary,
      label: "Shipment",
      bg: alpha(
        UI.primary,
        0.09
      ),
    };
  }

  if (
    category ===
    INVENTORY_CATEGORIES.SALES
  ) {
    return {
      icon: SellOutlinedIcon,
      tone: UI.success,
      label: "Sales",
      bg: alpha(
        UI.success,
        0.09
      ),
    };
  }

  if (
    category ===
    INVENTORY_CATEGORIES.FORECAST
  ) {
    return {
      icon:
        TrendingUpRoundedIcon,
      tone: UI.info,
      label: "Forecast",
      bg: alpha(
        UI.info,
        0.09
      ),
    };
  }

  if (
    category ===
    INVENTORY_CATEGORIES.REPORT
  ) {
    return {
      icon:
        AssessmentOutlinedIcon,
      tone: UI.info,
      label: "Report",
      bg: alpha(
        UI.info,
        0.09
      ),
    };
  }

  switch (severity) {
    case SEVERITY_TYPES.SUCCESS:
      return {
        icon:
          CheckCircleOutlineRoundedIcon,
        tone: UI.success,
        label: "Success",
        bg: alpha(
          UI.success,
          0.09
        ),
      };

    case SEVERITY_TYPES.WARNING:
      return {
        icon:
          WarningAmberRoundedIcon,
        tone: UI.warning,
        label: "Warning",
        bg: alpha(
          UI.warning,
          0.09
        ),
      };

    case SEVERITY_TYPES.ERROR:
      return {
        icon:
          ErrorOutlineRoundedIcon,
        tone: UI.error,
        label: "Error",
        bg: alpha(
          UI.error,
          0.09
        ),
      };

    case SEVERITY_TYPES.CRITICAL:
      return {
        icon:
          PriorityHighRoundedIcon,
        tone: "#c62828",
        label: "Critical",
        bg: alpha(
          "#c62828",
          0.09
        ),
      };

    default:
      return {
        icon:
          InfoOutlinedIcon,
        tone: UI.info,
        label: "Info",
        bg: alpha(
          UI.info,
          0.09
        ),
      };
  }
}

/* ============================================================
   STORAGE HELPERS
   ============================================================ */

function loadPreferences() {
  try {
    const raw =
      localStorage.getItem(
        PREFERENCE_STORAGE_KEY
      );

    if (!raw) {
      return DEFAULT_PREFERENCES;
    }

    return {
      ...DEFAULT_PREFERENCES,
      ...JSON.parse(raw),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(
  preferences
) {
  try {
    localStorage.setItem(
      PREFERENCE_STORAGE_KEY,
      JSON.stringify(
        preferences
      )
    );
  } catch {
    // Ignore localStorage failures.
  }
}

/* ============================================================
   GROUPING
   ============================================================ */

function groupNotifications(
  notifications
) {
  const groups = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  notifications.forEach(
    (notification) => {
      const group =
        getNotificationDateLabel(
          notification.createdAt
        );

      groups[group].push(
        notification
      );
    }
  );

  return groups;
}

/* ============================================================
   EMPTY STATE
   ============================================================ */

function NotificationEmptyState({
  activeTab,
  hasSearch,
}) {
  const config = hasSearch
    ? {
        title:
          "No matching notifications",
        description:
          "Try another keyword or clear your search.",
        icon:
          <SearchRoundedIcon />,
      }
    : activeTab ===
      PANEL_TABS.UNREAD
    ? {
        title:
          "You're all caught up",
        description:
          "There are no unread updates requiring your attention.",
        icon:
          <DoneAllRoundedIcon />,
      }
    : activeTab ===
      PANEL_TABS.ALERTS
    ? {
        title:
          "No active alerts",
        description:
          "Your inventory looks healthy. Critical and warning events will appear here.",
        icon:
          <NotificationsNoneRoundedIcon />,
      }
    : {
        title:
          "All quiet here",
        description:
          "New inventory, sales, shipment and system events will appear here.",
        icon:
          <NotificationsNoneRoundedIcon />,
      };

  return (
    <Box
      sx={{
        minHeight: 380,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 8,
      }}
    >
      <Stack
        alignItems="center"
        textAlign="center"
        spacing={1.2}
        maxWidth={310}
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.82,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <Box
            sx={{
              width: 78,
              height: 78,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#eef9fb,#e3f4f8)",
              border:
                `1px solid ${alpha(
                  UI.primary,
                  0.12
                )}`,
              color: UI.primary,
            }}
          >
            {React.cloneElement(
              config.icon,
              {
                sx: {
                  fontSize: 34,
                },
              }
            )}
          </Box>
        </motion.div>

        <Typography
          sx={{
            mt: 1,
            fontWeight: 850,
            color: UI.ink,
            fontSize: "1rem",
          }}
        >
          {config.title}
        </Typography>

        <Typography
          sx={{
            color: UI.muted,
            fontSize: ".74rem",
            lineHeight: 1.6,
          }}
        >
          {
            config.description
          }
        </Typography>
      </Stack>
    </Box>
  );
}

/* ============================================================
   NOTIFICATION CARD
   ============================================================ */

function NotificationCardItem({
  notification,
  onClick,
  onDelete,
}) {
  const prefersReducedMotion =
    useReducedMotion();

  const config =
    getNotificationConfig(
      notification
    );

  const Icon =
    config.icon;

  const isUnread =
    !notification.read;

  const typeLabel =
    notification.category
      ?.replace(
        /_/g,
        " "
      )
      ?.trim() ||
    config.label;

  const handleKeyDown =
    (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        onClick(
          notification
        );
      }
    };

  return (
    <NotificationCard
      layout
      unread={isUnread}
      tone={config.tone}
      initial={
        prefersReducedMotion
          ? {
              opacity: 0,
            }
          : {
              opacity: 0,
              y: 8,
            }
      }
      animate={
        prefersReducedMotion
          ? {
              opacity: 1,
            }
          : {
              opacity: 1,
              y: 0,
            }
      }
      exit={
        prefersReducedMotion
          ? {
              opacity: 0,
            }
          : {
              opacity: 0,
              scale: 0.97,
              y: -4,
            }
      }
      transition={{
        duration:
          0.2,
      }}
      onClick={() =>
        onClick(
          notification
        )
      }
      onKeyDown={
        handleKeyDown
      }
      role="button"
      tabIndex={0}
    >
      <Box
        sx={{
          position:
            "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background:
            isUnread
              ? config.tone
              : "transparent",
        }}
      />

      <Box
        sx={{
          px: 1.65,
          py: 1.5,
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="flex-start"
        >
          {/* ICON */}

          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius:
                "12px",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              color: config.tone,
              background:
                config.bg,
            }}
          >
            <Icon
              sx={{
                fontSize: 20,
              }}
            />
          </Box>

          {/* CONTENT */}

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={1}
            >
              <Box
                sx={{
                  minWidth: 0,
                  pr: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize:
                      ".77rem",
                    fontWeight:
                      isUnread
                        ? 850
                        : 700,
                    color:
                      UI.ink,
                    lineHeight:
                      1.35,
                    overflowWrap:
                      "anywhere",
                  }}
                >
                  {
                    notification.title ||
                    "Notification"
                  }
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize:
                      ".57rem",
                    color:
                      UI.muted,
                    fontWeight:
                      700,
                    textTransform:
                      "capitalize",
                  }}
                >
                  {typeLabel}
                </Typography>
              </Box>

              {/* UNREAD INDICATOR */}

              {isUnread && (
                <Tooltip title="Unread">
                  <CircleRoundedIcon
                    sx={{
                      fontSize: 8,
                      color:
                        config.tone,
                      mt: 0.7,
                      flexShrink: 0,
                    }}
                  />
                </Tooltip>
              )}
            </Stack>

            <Typography
              sx={{
                mt: 0.65,
                fontSize:
                  ".68rem",
                lineHeight:
                  1.55,
                color:
                  UI.slate,
                display:
                  "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient:
                  "vertical",
                overflow:
                  "hidden",
              }}
            >
              {
                notification.message ||
                "No details available."
              }
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{
                mt: 1.2,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.8}
              >
                <Typography
                  sx={{
                    fontSize:
                      ".57rem",
                    color:
                      UI.muted,
                    fontWeight:
                      650,
                  }}
                >
                  {getRelativeTime(
                    notification.createdAt
                  )}
                </Typography>

                {notification.link && (
                  <OpenInNewRoundedIcon
                    sx={{
                      fontSize: 12,
                      color:
                        UI.muted,
                    }}
                  />
                )}
              </Stack>

              <Tooltip title="Dismiss">
                <IconButton
                  size="small"
                  onClick={(
                    event
                  ) => {
                    event.stopPropagation();
                    onDelete?.(
                      notification.id
                    );
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    color:
                      UI.muted,

                    "&:hover": {
                      color:
                        UI.error,
                      background:
                        alpha(
                          UI.error,
                          0.08
                        ),
                    },
                  }}
                >
                  <CloseRoundedIcon
                    sx={{
                      fontSize:
                        16,
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </NotificationCard>
  );
}

/* ============================================================
   PREFERENCES VIEW
   ============================================================ */

function NotificationSettingsView({
  onBack,
  preferences,
  setPreferences,
}) {
  const [permissionStatus, setPermissionStatus] =
    useState(() =>
      typeof window !==
        "undefined" &&
      "Notification" in window
        ? Notification.permission
        : "unsupported"
    );

  const updatePreference =
    useCallback(
      (key) => {
        setPreferences(
          (previous) => {
            const next = {
              ...previous,
              [key]:
                !previous[key],
            };

            savePreferences(
              next
            );

            return next;
          }
        );
      },
      [setPreferences]
    );

  const requestDesktopPermission =
    async () => {
      if (
        typeof window ===
          "undefined" ||
        !("Notification" in window)
      ) {
        setPermissionStatus(
          "unsupported"
        );
        return;
      }

      try {
        const permission =
          await Notification.requestPermission();

        setPermissionStatus(
          permission
        );

        if (
          permission ===
          "granted"
        ) {
          setPreferences(
            (previous) => {
              const next = {
                ...previous,
                desktopNotifications:
                  true,
              };

              savePreferences(
                next
              );

              return next;
            }
          );
        }
      } catch {
        setPermissionStatus(
          "denied"
        );
      }
    };

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 18,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -18,
      }}
      transition={{
        duration: 0.2,
      }}
      style={{
        height: "100%",
        display: "flex",
        flexDirection:
          "column",
      }}
    >
      <PanelHeader>
        <Box
          sx={{
            px: 2,
            py: 1.4,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <IconButton
              onClick={onBack}
              aria-label="Back to notifications"
              sx={{
                width: 34,
                height: 34,
                color:
                  UI.slate,
              }}
            >
              <ArrowBackRoundedIcon
                sx={{
                  fontSize: 19,
                }}
              />
            </IconButton>

            <Box
              sx={{
                flex: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize:
                    ".88rem",
                  fontWeight:
                    850,
                  color:
                    UI.ink,
                }}
              >
                Notification preferences
              </Typography>

              <Typography
                sx={{
                  fontSize:
                    ".62rem",
                  color:
                    UI.muted,
                  mt: 0.2,
                }}
              >
                Choose what should require your attention
              </Typography>
            </Box>
          </Stack>
        </Box>
      </PanelHeader>

      <ScrollableContent>
        <Box
          sx={{
            p: 1.5,
          }}
        >
          {/* ==================================================
              OPERATIONAL EVENTS
              ================================================== */}

          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius:
                "16px",
              border:
                `1px solid ${UI.border}`,
              background:
                "#ffffff",
            }}
          >
            <Typography
              sx={{
                fontSize:
                  ".68rem",
                fontWeight:
                  850,
                color:
                  UI.ink,
                mb: 1.3,
              }}
            >
              Operational alerts
            </Typography>

            <PreferenceRow
              title="Out of stock"
              description="Notify me when an item reaches zero quantity."
              checked={
                preferences.outOfStock
              }
              onChange={() =>
                updatePreference(
                  "outOfStock"
                )
              }
            />

            <PreferenceRow
              title="Low stock"
              description="Notify me when inventory crosses its reorder threshold."
              checked={
                preferences.lowStock
              }
              onChange={() =>
                updatePreference(
                  "lowStock"
                )
              }
            />

            <PreferenceRow
              title="Sales updates"
              description="Show important sales and transaction events."
              checked={
                preferences.salesUpdates
              }
              onChange={() =>
                updatePreference(
                  "salesUpdates"
                )
              }
            />

            <PreferenceRow
              title="Forecast updates"
              description="Show demand forecast and intelligence updates."
              checked={
                preferences.forecastUpdates
              }
              onChange={() =>
                updatePreference(
                  "forecastUpdates"
                )
              }
            />

            <PreferenceRow
              title="System activity"
              description="Show technical and system-level events."
              checked={
                preferences.systemLogs
              }
              onChange={() =>
                updatePreference(
                  "systemLogs"
                )
              }
              last
            />
          </Paper>

          {/* ==================================================
              DESKTOP NOTIFICATIONS
              ================================================== */}

          <Paper
            elevation={0}
            sx={{
              mt: 1.2,
              p: 1.5,
              borderRadius:
                "16px",
              border:
                `1px solid ${UI.border}`,
              background:
                "#ffffff",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              mb={1.2}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius:
                    "10px",
                  display: "grid",
                  placeItems:
                    "center",
                  color:
                    UI.primary,
                  background:
                    UI.aquaPale,
                }}
              >
                <NotificationsActiveRoundedIcon
                  sx={{
                    fontSize:
                      18,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize:
                      ".68rem",
                    fontWeight:
                      850,
                    color:
                      UI.ink,
                  }}
                >
                  Desktop notifications
                </Typography>

                <Typography
                  sx={{
                    fontSize:
                      ".58rem",
                    color:
                      UI.muted,
                  }}
                >
                  Receive important alerts outside the panel
                </Typography>
              </Box>
            </Stack>

            {permissionStatus ===
              "granted" ? (
              <FormControlLabel
                sx={{
                  ml: 0,
                  width: "100%",
                  justifyContent:
                    "space-between",
                }}
                label={
                  <Typography
                    sx={{
                      fontSize:
                        ".66rem",
                      fontWeight:
                        700,
                      color:
                        UI.slate,
                    }}
                  >
                    Browser alerts enabled
                  </Typography>
                }
                labelPlacement="start"
                control={
                  <Switch
                    size="small"
                    checked={
                      preferences.desktopNotifications
                    }
                    onChange={() =>
                      updatePreference(
                        "desktopNotifications"
                      )
                    }
                  />
                }
              />
            ) : (
              <Button
                fullWidth
                onClick={
                  requestDesktopPermission
                }
                variant="outlined"
                startIcon={
                  <NotificationsActiveRoundedIcon />
                }
                sx={{
                  minHeight: 40,
                  borderRadius:
                    "11px",
                  textTransform:
                    "none",
                  fontWeight:
                    750,
                  borderColor:
                    UI.border,
                  color:
                    UI.primary,
                  background:
                    "#fbfeff",
                }}
              >
                Enable browser notifications
              </Button>
            )}

            {permissionStatus ===
              "denied" && (
              <Typography
                sx={{
                  mt: 1,
                  fontSize:
                    ".58rem",
                  lineHeight:
                    1.5,
                  color:
                    UI.warning,
                }}
              >
                Browser permission was denied. Enable notifications from your browser settings.
              </Typography>
            )}

            {permissionStatus ===
              "unsupported" && (
              <Typography
                sx={{
                  mt: 1,
                  fontSize:
                    ".58rem",
                  color:
                    UI.muted,
                }}
              >
                Desktop notifications are not supported in this browser.
              </Typography>
            )}
          </Paper>
        </Box>
      </ScrollableContent>
    </motion.div>
  );
}

/* ============================================================
   PREFERENCE ROW
   ============================================================ */

function PreferenceRow({
  title,
  description,
  checked,
  onChange,
  last = false,
}) {
  return (
    <Box
      sx={{
        py: 1.1,

        borderBottom:
          last
            ? "none"
            : `1px solid ${UI.border}`,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={1.5}
        alignItems="flex-start"
      >
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Typography
            sx={{
              fontSize:
                ".65rem",
              fontWeight:
                750,
              color:
                UI.ink,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize:
                ".56rem",
              color:
                UI.muted,
              lineHeight:
                1.5,
            }}
          >
            {description}
          </Typography>
        </Box>

        <Switch
          size="small"
          checked={checked}
          onChange={onChange}
        />
      </Stack>
    </Box>
  );
}

/* ============================================================
   FILTER CONTROL
   ============================================================ */

function NotificationFilterBar({
  activeTab,
  unreadCount,
  alertCount,
  onTabChange,
}) {
  return (
    <Box
      sx={{
        px: 1.5,
        pb: 1.2,
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(
          event,
          value
        ) =>
          onTabChange(
            value
          )
        }
        variant="fullWidth"
        sx={{
          minHeight:
            38,

          background:
            "#f3f8fa",

          borderRadius:
            "11px",

          p: 0.35,

          "& .MuiTabs-indicator":
            {
              display:
                "none",
            },

          "& .MuiTab-root":
            {
              minHeight:
                32,

              py: 0,

              px: 1,

              minWidth: 0,

              borderRadius:
                "8px",

              textTransform:
                "none",

              fontSize:
                ".65rem",

              fontWeight:
                750,

              color:
                UI.muted,
            },

          "& .Mui-selected":
            {
              color:
                UI.primary,

              background:
                "#ffffff",

              boxShadow:
                "0 2px 8px rgba(16,77,96,.08)",
            },
        }}
      >
        <Tab
          value={
            PANEL_TABS.ALL
          }
          label={
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.6}
            >
              <span>
                All
              </span>

              <Typography
                component="span"
                sx={{
                  fontSize:
                    ".54rem",
                  fontWeight:
                    800,
                  color:
                    UI.muted,
                }}
              >
                •
              </Typography>

              <span>
                {unreadCount}
              </span>
            </Stack>
          }
        />

        <Tab
          value={
            PANEL_TABS.UNREAD
          }
          label={
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
            >
              <span>
                Unread
              </span>

              {unreadCount >
                0 && (
                <Badge
                  badgeContent={
                    unreadCount
                  }
                  color="error"
                  max={99}
                  sx={{
                    "& .MuiBadge-badge":
                      {
                        position:
                          "relative",
                        transform:
                          "none",
                        right:
                          "auto",
                        top:
                          "auto",
                        fontSize:
                          "9px",
                        minWidth:
                          17,
                        height:
                          17,
                      },
                  }}
                />
              )}
            </Stack>
          }
        />

        <Tab
          value={
            PANEL_TABS.ALERTS
          }
          label={
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.6}
            >
              <span>
                Alerts
              </span>

              {alertCount >
                0 && (
                <Badge
                  badgeContent={
                    alertCount
                  }
                  color="warning"
                  max={99}
                  sx={{
                    "& .MuiBadge-badge":
                      {
                        position:
                          "relative",
                        transform:
                          "none",
                        right:
                          "auto",
                        top:
                          "auto",
                        fontSize:
                          "9px",
                        minWidth:
                          17,
                        height:
                          17,
                      },
                  }}
                />
              )}
            </Stack>
          }
        />
      </Tabs>
    </Box>
  );
}

/* ============================================================
   MAIN PANEL
   ============================================================ */

export default function NotificationPanel({
  onClose,
}) {
  const navigate =
    useNavigate();

  const theme =
    useTheme();

  const prefersReducedMotion =
    useReducedMotion();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down(
        "sm"
      )
    );

  const {
    notifications = [],
    unreadCount = 0,

    markAsRead,
    markAllAsRead,

    removeNotification,
    clearAllNotifications,
  } =
    useNotifications();

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    PANEL_TABS.ALL
  );

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    showSearch,
    setShowSearch,
  ] = useState(false);

  const [
    showSettings,
    setShowSettings,
  ] = useState(false);

  const [
    preferences,
    setPreferences,
  ] = useState(
    loadPreferences
  );

  const previousIdsRef =
    useRef(
      new Set(
        notifications.map(
          (item) =>
            item.id
        )
      )
    );

  /* ==========================================================
     PERSIST PREFERENCES
     ========================================================== */

  useEffect(() => {
    savePreferences(
      preferences
    );
  }, [preferences]);

  /* ==========================================================
     OPTIONAL BROWSER NOTIFICATION SUPPORT
     ----------------------------------------------------------
     This is only the presentation layer.

     Real-time data must be supplied by NotificationContext.
     ========================================================== */

  useEffect(() => {
    if (
      !preferences.desktopNotifications
    ) {
      previousIdsRef.current =
        new Set(
          notifications.map(
            (item) =>
              item.id
          )
        );

      return;
    }

    if (
      typeof window ===
        "undefined" ||
      !("Notification" in window) ||
      Notification.permission !==
        "granted"
    ) {
      return;
    }

    const currentIds =
      new Set(
        notifications.map(
          (item) =>
            item.id
        )
      );

    const newlyAdded =
      notifications.filter(
        (item) =>
          !previousIdsRef.current.has(
            item.id
          )
      );

    newlyAdded
      .filter(
        (item) =>
          !item.read
      )
      .slice(0, 3)
      .forEach(
        (item) => {
          try {
            new Notification(
              item.title ||
                "Smart Retail Alert",
              {
                body:
                  item.message ||
                  "You have a new notification.",
                tag: String(
                  item.id
                ),
              }
            );
          } catch {
            // Browser may block notification construction.
          }
        }
      );

    previousIdsRef.current =
      currentIds;
  }, [
    notifications,
    preferences.desktopNotifications,
  ]);

  /* ==========================================================
     ALERT COUNT
     ========================================================== */

  const alertCount =
    useMemo(() => {
      return notifications.filter(
        (item) => {
          const severity =
            getSeverity(
              item
            );

          return [
            SEVERITY_TYPES.WARNING,
            SEVERITY_TYPES.ERROR,
            SEVERITY_TYPES.CRITICAL,
          ].includes(
            severity
          );
        }
      ).length;
    }, [notifications]);

  /* ==========================================================
     FILTER NOTIFICATIONS
     ========================================================== */

  const filteredNotifications =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return notifications
        .filter(
          (item) => {
            if (
              activeTab ===
                PANEL_TABS.UNREAD &&
              item.read
            ) {
              return false;
            }

            if (
              activeTab ===
              PANEL_TABS.ALERTS
            ) {
              const severity =
                getSeverity(
                  item
                );

              if (
                ![
                  SEVERITY_TYPES.WARNING,
                  SEVERITY_TYPES.ERROR,
                  SEVERITY_TYPES.CRITICAL,
                ].includes(
                  severity
                )
              ) {
                return false;
              }
            }

            if (!query) {
              return true;
            }

            const searchable =
              [
                item.title,
                item.message,
                item.category,
                item.type,
                item.severity,
                item.productName,
                item.productSku,
              ]
                .filter(
                  Boolean
                )
                .join(" ")
                .toLowerCase();

            return searchable.includes(
              query
            );
          }
        )
        .sort(
          (
            a,
            b
          ) => {
            const aTime =
              new Date(
                a.createdAt
              ).getTime() ||
              0;

            const bTime =
              new Date(
                b.createdAt
              ).getTime() ||
              0;

            return (
              bTime -
              aTime
            );
          }
        );
    }, [
      notifications,
      activeTab,
      searchQuery,
    ]);

  /* ==========================================================
     GROUPS
     ========================================================== */

  const groupedNotifications =
    useMemo(
      () =>
        groupNotifications(
          filteredNotifications
        ),
      [filteredNotifications]
    );

  /* ==========================================================
     NOTIFICATION CLICK
     ========================================================== */

  const handleNotificationClick =
    useCallback(
      (notification) => {
        if (
          !notification.read
        ) {
          markAsRead?.(
            notification.id
          );
        }

        if (
          notification.link
        ) {
          navigate(
            notification.link
          );

          if (
            isMobile &&
            onClose
          ) {
            onClose();
          }

          return;
        }

        if (
          notification.action?.route
        ) {
          navigate(
            notification.action.route
          );

          if (
            isMobile &&
            onClose
          ) {
            onClose();
          }
        }
      },
      [
        markAsRead,
        navigate,
        isMobile,
        onClose,
      ]
    );

  /* ==========================================================
     CLEAR ALL
     ========================================================== */

  const handleClearAll =
    useCallback(() => {
      if (
        notifications.length ===
        0
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Clear all notification history?"
        );

      if (
        confirmed
      ) {
        clearAllNotifications?.();
      }
    }, [
      notifications.length,
      clearAllNotifications,
    ]);

  /* ==========================================================
     GROUP RENDERER
     ========================================================== */

  const renderGroup =
    (
      title,
      items
    ) => {
      if (
        !items ||
        items.length ===
          0
      ) {
        return null;
      }

      return (
        <Box
          key={title}
        >
          <GroupHeader>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                sx={{
                  fontSize:
                    ".57rem",
                  fontWeight:
                    850,
                  color:
                    UI.slate,
                  textTransform:
                    "uppercase",
                  letterSpacing:
                    ".7px",
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  fontSize:
                    ".54rem",
                  color:
                    UI.muted,
                  fontWeight:
                    700,
                }}
              >
                {
                  items.length
                }{" "}
                {items.length ===
                1
                  ? "update"
                  : "updates"}
              </Typography>
            </Stack>
          </GroupHeader>

          <AnimatePresence
            mode="popLayout"
            initial={false}
          >
            {items.map(
              (
                notification
              ) => (
                <NotificationCardItem
                  key={
                    notification.id
                  }
                  notification={
                    notification
                  }
                  onClick={
                    handleNotificationClick
                  }
                  onDelete={
                    removeNotification
                  }
                />
              )
            )}
          </AnimatePresence>
        </Box>
      );
    };

  /* ==========================================================
     SETTINGS VIEW
     ========================================================== */

  if (showSettings) {
    return (
      <PanelContainer
        initial={
          prefersReducedMotion
            ? {
                opacity: 0,
              }
            : {
                opacity: 0,
                scale: 0.98,
              }
        }
        animate={
          prefersReducedMotion
            ? {
                opacity: 1,
              }
            : {
                opacity: 1,
                scale: 1,
              }
        }
      >
        <NotificationSettingsView
          onBack={() =>
            setShowSettings(
              false
            )
          }
          preferences={
            preferences
          }
          setPreferences={
            setPreferences
          }
        />
      </PanelContainer>
    );
  }

  /* ==========================================================
     MAIN UI
     ========================================================== */

  return (
    <PanelContainer
      initial={
        prefersReducedMotion
          ? {
              opacity: 0,
            }
          : {
              opacity: 0,
              y: 8,
              scale: 0.98,
            }
      }
      animate={
        prefersReducedMotion
          ? {
              opacity: 1,
            }
          : {
              opacity: 1,
              y: 0,
              scale: 1,
            }
      }
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      {/* ======================================================
          HEADER
          ====================================================== */}

      <PanelHeader>
        <Box
          sx={{
            px: 1.7,
            pt: 1.6,
            pb: 0.8,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            {/* TITLE */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              minWidth={0}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  borderRadius:
                    "12px",
                  display: "grid",
                  placeItems:
                    "center",

                  color:
                    unreadCount >
                    0
                      ? UI.primary
                      : UI.muted,

                  background:
                    unreadCount >
                    0
                      ? UI.aquaPale
                      : "#f2f6f7",

                  border:
                    `1px solid ${
                      unreadCount >
                      0
                        ? alpha(
                            UI.primary,
                            0.12
                          )
                        : UI.border
                    }`,
                }}
              >
                {unreadCount >
                0 ? (
                  <NotificationsActiveRoundedIcon
                    sx={{
                      fontSize:
                        20,
                    }}
                  />
                ) : (
                  <NotificationsNoneRoundedIcon
                    sx={{
                      fontSize:
                        20,
                    }}
                  />
                )}
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.8}
                >
                  <Typography
                    sx={{
                      fontSize:
                        ".93rem",
                      fontWeight:
                        900,
                      color:
                        UI.ink,
                      lineHeight:
                        1.1,
                    }}
                  >
                    Notifications
                  </Typography>

                  <Badge
                    badgeContent={
                      unreadCount
                    }
                    showZero
                    color={
                      unreadCount >
                      0
                        ? "error"
                        : "default"
                    }
                    max={99}
                    sx={{
                      "& .MuiBadge-badge":
                        {
                          fontSize:
                            "9px",
                          fontWeight:
                            800,
                          minWidth:
                            17,
                          height:
                            17,
                          position:
                            "relative",
                          transform:
                            "none",
                          right:
                            "auto",
                          top:
                            "auto",
                        },
                    }}
                  />
                </Stack>

                <Typography
                  sx={{
                    mt: 0.3,
                    fontSize:
                      ".57rem",
                    fontWeight:
                      650,
                    color:
                      UI.muted,
                  }}
                >
                  Inventory intelligence & system activity
                </Typography>
              </Box>
            </Stack>

            {/* ACTIONS */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.3}
            >
              <Tooltip
                title={
                  showSearch
                    ? "Hide search"
                    : "Search"
                }
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    setShowSearch(
                      (current) =>
                        !current
                    );

                    if (
                      showSearch
                    ) {
                      setSearchQuery(
                        ""
                      );
                    }
                  }}
                  sx={{
                    width: 34,
                    height: 34,
                    color:
                      showSearch
                        ? UI.primary
                        : UI.slate,

                    background:
                      showSearch
                        ? UI.aquaPale
                        : "transparent",

                    "&:hover": {
                      background:
                        UI.aquaPale,
                    },
                  }}
                  aria-label="Search notifications"
                >
                  <SearchRoundedIcon
                    sx={{
                      fontSize:
                        19,
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Notification preferences">
                <IconButton
                  size="small"
                  onClick={() =>
                    setShowSettings(
                      true
                    )
                  }
                  sx={{
                    width: 34,
                    height: 34,
                    color:
                      UI.slate,

                    "&:hover": {
                      background:
                        UI.aquaPale,
                      color:
                        UI.primary,
                    },
                  }}
                  aria-label="Notification preferences"
                >
                  <SettingsOutlinedIcon
                    sx={{
                      fontSize:
                        19,
                    }}
                  />
                </IconButton>
              </Tooltip>

              {onClose && (
                <Tooltip title="Close">
                  <IconButton
                    size="small"
                    onClick={
                      onClose
                    }
                    sx={{
                      width: 34,
                      height: 34,
                      color:
                        UI.slate,

                      "&:hover": {
                        background:
                          alpha(
                            UI.error,
                            0.07
                          ),
                        color:
                          UI.error,
                      },
                    }}
                    aria-label="Close notifications"
                  >
                    <CloseRoundedIcon
                      sx={{
                        fontSize:
                          19,
                      }}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>

          {/* ====================================================
              SEARCH
              ==================================================== */}

          <AnimatePresence initial={false}>
            {showSearch && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                style={{
                  overflow:
                    "hidden",
                }}
              >
                <Box
                  sx={{
                    pt: 1.3,
                    pb: 0.4,
                  }}
                >
                  <TextField
                    fullWidth
                    autoFocus
                    size="small"
                    value={
                      searchQuery
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchQuery(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Search notifications, products, SKUs..."
                    InputProps={{
                      startAdornment:
                        (
                          <InputAdornment position="start">
                            <FilterAltOutlinedIcon
                              sx={{
                                fontSize:
                                  18,
                                color:
                                  UI.muted,
                              }}
                            />
                          </InputAdornment>
                        ),

                      endAdornment:
                        searchQuery && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() =>
                                setSearchQuery(
                                  ""
                                )
                              }
                              sx={{
                                width: 28,
                                height: 28,
                              }}
                            >
                              <CloseRoundedIcon
                                sx={{
                                  fontSize:
                                    15,
                                }}
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root":
                        {
                          minHeight:
                            38,
                          borderRadius:
                            "11px",
                          background:
                            "#ffffff",
                          fontSize:
                            ".68rem",

                          "& fieldset":
                            {
                              borderColor:
                                UI.border,
                            },

                          "&:hover fieldset":
                            {
                              borderColor:
                                alpha(
                                  UI.primary,
                                  0.35
                                ),
                            },

                          "&.Mui-focused fieldset":
                            {
                              borderColor:
                                UI.primary,
                              borderWidth:
                                1,
                            },
                        },
                    }}
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* ======================================================
            FILTER TABS
            ====================================================== */}

        <NotificationFilterBar
          activeTab={
            activeTab
          }
          unreadCount={
            unreadCount
          }
          alertCount={
            alertCount
          }
          onTabChange={
            setActiveTab
          }
        />
      </PanelHeader>

      {/* ========================================================
          CONTENT
          ======================================================== */}

      <ScrollableContent>
        {filteredNotifications.length ===
        0 ? (
          <NotificationEmptyState
            activeTab={
              activeTab
            }
            hasSearch={
              Boolean(
                searchQuery.trim()
              )
            }
          />
        ) : (
          <Box
            sx={{
              pb: 1,
            }}
          >
            {renderGroup(
              "Today",
              groupedNotifications.Today
            )}

            {renderGroup(
              "Yesterday",
              groupedNotifications.Yesterday
            )}

            {renderGroup(
              "Earlier",
              groupedNotifications.Earlier
            )}
          </Box>
        )}
      </ScrollableContent>

      {/* ========================================================
          FOOTER ACTIONS
          ======================================================== */}

      {notifications.length >
        0 && (
        <Box
          sx={{
            flexShrink: 0,

            px: 1.4,
            py: 1.1,

            borderTop:
              `1px solid ${UI.border}`,

            background:
              "#ffffff",
          }}
        >
          <Stack
            direction={
              isMobile
                ? "column"
                : "row"
            }
            spacing={0.8}
            justifyContent="space-between"
          >
            <Button
              size="small"
              onClick={() =>
                markAllAsRead?.()
              }
              disabled={
                unreadCount === 0
              }
              startIcon={
                <DoneAllRoundedIcon
                  sx={{
                    fontSize:
                      17,
                  }}
                />
              }
              sx={{
                minHeight: 36,

                flex: 1,

                borderRadius:
                  "10px",

                textTransform:
                  "none",

                fontSize:
                  ".64rem",

                fontWeight:
                  800,

                color:
                  unreadCount >
                  0
                    ? UI.primary
                    : UI.muted,

                "&:hover": {
                  background:
                    UI.aquaPale,
                },
              }}
            >
              Mark all as read
            </Button>

            <Button
              size="small"
              onClick={
                handleClearAll
              }
              startIcon={
                <DeleteSweepOutlinedIcon
                  sx={{
                    fontSize:
                      17,
                  }}
                />
              }
              sx={{
                minHeight: 36,

                flex: 1,

                borderRadius:
                  "10px",

                textTransform:
                  "none",

                fontSize:
                  ".64rem",

                fontWeight:
                  800,

                color:
                  UI.error,

                "&:hover": {
                  background:
                    alpha(
                      UI.error,
                      0.06
                    ),
                },
              }}
            >
              Clear history
            </Button>
          </Stack>
        </Box>
      )}
    </PanelContainer>
  );
}

NotificationPanel.propTypes = {
  onClose:
    PropTypes.func,
};

NotificationPanel.defaultProps = {
  onClose:
    undefined,
};
