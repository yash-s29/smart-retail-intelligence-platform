import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

// ============================================================
// Material UI
// ============================================================
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  Popover,
  Fade,
  Zoom,
} from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";

// ============================================================
// Icons
// ============================================================
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

// ============================================================
// Context / Hooks
// ============================================================
import { useNotifications } from "../../context/NotificationContext";
import NotificationPanel from "../notification/NotificationPanel";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/images/logo.png";

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

// ============================================================
// Styled Components
// ============================================================
const GlassAppBar = styled(AppBar)(({ theme }) => ({
  color: TEXT_PRIMARY,
  zIndex: theme.zIndex.drawer + 1,
}));

const LogoContainer = styled(Stack)(() => ({
  cursor: "pointer",
  padding: "5px 8px",
  borderRadius: 14,
  transition:
    "background-color 220ms ease, transform 220ms ease, box-shadow 220ms ease",
  userSelect: "none",

  "&:hover": {
    backgroundColor: alpha(SEA_BLUE, 0.055),
    boxShadow: `0 5px 18px ${alpha(SEA_BLUE, 0.06)}`,
  },

  "&:focus-visible": {
    outline: `3px solid ${alpha(SEA_BLUE, 0.18)}`,
    outlineOffset: 2,
  },
}));

const SearchContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isFocused",
})(({ theme, isFocused }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: 500,
  minHeight: 42,

  backgroundColor: isFocused
    ? WHITE
    : alpha(SEA_BLUE, 0.035),

  border: "1px solid",

  borderColor: isFocused
    ? alpha(SEA_BLUE, 0.58)
    : BORDER,

  borderRadius: 13,

  padding: "5px 8px 5px 13px",

  boxShadow: isFocused
    ? `0 0 0 3px ${alpha(
        SEA_BLUE,
        0.1
      )}, 0 8px 24px ${alpha(SEA_BLUE, 0.08)}`
    : "0 1px 2px rgba(23,49,59,0.02)",

  "&:hover": {
    backgroundColor: WHITE,
    borderColor: isFocused
      ? alpha(SEA_BLUE, 0.58)
      : alpha(SEA_BLUE, 0.22),
  },

  [theme.breakpoints.down("lg")]: {
    maxWidth: 420,
  },

  [theme.breakpoints.down("md")]: {
    maxWidth: 320,
  },

  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const ShortcutBadge = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  minWidth: 38,
  backgroundColor: "#F5FAFB",
  border: `1px solid ${BORDER}`,
  borderRadius: 7,
  padding: "3px 7px",
  color: TEXT_SECONDARY,
  fontSize: "0.67rem",
  fontWeight: 700,
  pointerEvents: "none",
}));

const NotificationButton = styled(IconButton, {
  shouldForwardProp: (prop) =>
    prop !== "hasUnread" && prop !== "isOpen",
})(({ isOpen }) => ({
  width: 42,
  height: 42,
  borderRadius: 12,

  backgroundColor: isOpen
    ? SEA_BLUE_SOFT
    : alpha(SEA_BLUE, 0.025),

  border: "1px solid",

  borderColor: isOpen
    ? alpha(SEA_BLUE, 0.32)
    : BORDER,

  color: isOpen
    ? SEA_BLUE_DARK
    : TEXT_SECONDARY,

  transition:
    "background-color 200ms ease, border-color 200ms ease, color 200ms ease, transform 200ms ease, box-shadow 200ms ease",

  "&:hover": {
    backgroundColor: SEA_BLUE_SOFT,
    borderColor: alpha(SEA_BLUE, 0.3),
    color: SEA_BLUE_DARK,
    transform: "translateY(-2px)",
    boxShadow: `0 7px 18px ${alpha(
      SEA_BLUE,
      0.1
    )}`,
  },

  "&:focus-visible": {
    outline: `3px solid ${alpha(
      SEA_BLUE,
      0.16
    )}`,
    outlineOffset: 2,
  },
}));

const PremiumBadge = styled(Badge)(() => ({}));

const UserProfileWrapper = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "isOpen",
})(({ isOpen }) => ({
  padding: "5px 9px 5px 5px",
  borderRadius: 30,
  cursor: "pointer",

  border: "1px solid",

  borderColor: isOpen
    ? alpha(SEA_BLUE, 0.22)
    : "transparent",

  backgroundColor: isOpen
    ? alpha(SEA_BLUE, 0.045)
    : "transparent",

  transition:
    "background-color 200ms ease, border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease",

  "&:hover": {
    backgroundColor: alpha(
      SEA_BLUE,
      0.045
    ),

    borderColor: alpha(
      SEA_BLUE,
      0.14
    ),

    boxShadow: `0 5px 18px ${alpha(
      SEA_BLUE,
      0.06
    )}`,
  },

  "&:focus-visible": {
    outline: `3px solid ${alpha(
      SEA_BLUE,
      0.16
    )}`,
    outlineOffset: 2,
  },
}));

const ProfileAvatar = styled(Avatar)(() => ({
  width: 38,
  height: 38,

  background: `linear-gradient(
    145deg,
    ${SEA_BLUE},
    ${AQUA}
  )`,

  color: WHITE,

  fontWeight: 800,

  fontSize: "0.92rem",

  border: `2px solid ${WHITE}`,

  boxShadow: `0 4px 12px ${alpha(
    SEA_BLUE,
    0.18
  )}`,

  /* Make selected illustrated avatars look clean */
  objectFit: "cover",
}));

const StyledMenu = styled(Menu)(() => ({
  "& .MuiPaper-root": {
    marginTop: 8,
    minWidth: 255,
    borderRadius: 16,

    backgroundColor:
      "rgba(255,255,255,0.97)",

    backdropFilter: "blur(16px)",

    border: `1px solid ${alpha(
      SEA_BLUE,
      0.1
    )}`,

    boxShadow:
      "0 18px 45px rgba(23,49,59,0.12), 0 2px 8px rgba(23,49,59,0.04)",

    padding: 7,

    overflow: "hidden",
  },

  "& .MuiMenuItem-root": {
    minHeight: 42,

    borderRadius: 10,

    margin: "2px 0",

    padding: "9px 12px",

    color: TEXT_PRIMARY,

    transition:
      "background-color 170ms ease, transform 170ms ease, color 170ms ease",

    "&:hover": {
      backgroundColor: alpha(
        SEA_BLUE,
        0.065
      ),

      color: SEA_BLUE_DARK,

      transform: "translateX(2px)",

      "& .MuiSvgIcon-root": {
        color: SEA_BLUE,
      },
    },
  },
}));

// ============================================================
// Navbar Component
// ============================================================
function Navbar({ onMenuClick }) {
  const theme = useTheme();

  const navigate = useNavigate();

  const searchInputRef = useRef(null);

  const mobileSearchInputRef =
    useRef(null);

  const { user, logout } = useAuth();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  } = useNotifications();

  // ============================================================
  // State
  // ============================================================

  const [
    userMenuAnchorEl,
    setUserMenuAnchorEl,
  ] = useState(null);

  const [
    notificationAnchorEl,
    setNotificationAnchorEl,
  ] = useState(null);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    isSearchFocused,
    setIsSearchFocused,
  ] = useState(false);

  const [
    isMobileSearchOpen,
    setIsMobileSearchOpen,
  ] = useState(false);

  // ============================================================
  // User Information
  // ============================================================

  const displayName =
    user?.full_name ||
    user?.name ||
    "Retail Manager";

  const storeName =
    user?.store_name ||
    "Store Owner";

  const avatarLetter =
    displayName
      .charAt(0)
      .toUpperCase() || "R";

  // ============================================================
  // PROFILE AVATAR
  //
  // This is the important new part.
  //
  // Profile.jsx stores the selected avatar using:
  // "srip_profile_avatar"
  //
  // Navbar listens to a custom event so the avatar updates
  // immediately in the SAME browser tab.
  // ============================================================

  const [
    profileAvatar,
    setProfileAvatar,
  ] = useState(() => {
    try {
      return (
        localStorage.getItem(
          "srip_profile_avatar"
        ) || ""
      );
    } catch {
      return "";
    }
  });

  // ============================================================
  // Keep Navbar Avatar In Sync
  // ============================================================

  useEffect(() => {
    const loadAvatar = () => {
      try {
        const savedAvatar =
          localStorage.getItem(
            "srip_profile_avatar"
          ) || "";

        setProfileAvatar(savedAvatar);
      } catch {
        setProfileAvatar("");
      }
    };

    // Load immediately when Navbar mounts
    loadAvatar();

    // ----------------------------------------------------------
    // Same-tab update
    // Profile.jsx dispatches:
    //
    // window.dispatchEvent(
    //   new CustomEvent("profile-avatar-changed", ...)
    // )
    // ----------------------------------------------------------

    const handleAvatarChanged = (event) => {
      const newAvatar =
        event?.detail?.avatarUrl || "";

      setProfileAvatar(newAvatar);
    };

    // ----------------------------------------------------------
    // Cross-tab update
    // ----------------------------------------------------------

    const handleStorageChange = (event) => {
      if (
        event.key ===
        "srip_profile_avatar"
      ) {
        setProfileAvatar(
          event.newValue || ""
        );
      }
    };

    window.addEventListener(
      "profile-avatar-changed",
      handleAvatarChanged
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "profile-avatar-changed",
        handleAvatarChanged
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // ============================================================
  // Menu State
  // ============================================================

  const isUserMenuOpen =
    Boolean(userMenuAnchorEl);

  const isNotificationOpen =
    Boolean(notificationAnchorEl);

  // ============================================================
  // Menu Handlers
  // ============================================================

  const handleUserMenuOpen = (event) =>
    setUserMenuAnchorEl(
      event.currentTarget
    );

  const handleUserMenuClose = () =>
    setUserMenuAnchorEl(null);

  const handleNotificationOpen = (event) =>
    setNotificationAnchorEl(
      event.currentTarget
    );

  const handleNotificationClose = () =>
    setNotificationAnchorEl(null);

  // ============================================================
  // Navigation
  // ============================================================

  const handleNav = (path) => {
    handleUserMenuClose();

    navigate(path);
  };

  // ============================================================
  // Logout
  // ============================================================

  const handleLogout = () => {
    handleUserMenuClose();

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // ============================================================
  // Search
  // ============================================================

  const handleSearchSubmit =
    useCallback(() => {
      const query =
        searchTerm.trim();

      if (!query) return;

      setIsMobileSearchOpen(false);

      navigate(
        `/search?q=${encodeURIComponent(
          query
        )}`
      );
    }, [searchTerm, navigate]);

  const clearSearch = () => {
    setSearchTerm("");

    if (isMobileSearchOpen) {
      mobileSearchInputRef.current?.focus();
    } else {
      searchInputRef.current?.focus();
    }
  };

  // ============================================================
  // Mobile Search Focus
  // ============================================================

  useEffect(() => {
    if (!isMobileSearchOpen) return;

    const timer = setTimeout(() => {
      mobileSearchInputRef.current?.focus();
    }, 120);

    return () =>
      clearTimeout(timer);
  }, [isMobileSearchOpen]);

  // ============================================================
  // Keyboard Shortcuts
  // ============================================================

  useEffect(() => {
    const handleGlobalKeyDown = (
      event
    ) => {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "k"
      ) {
        event.preventDefault();

        if (window.innerWidth < 600) {
          setIsMobileSearchOpen(true);
        } else {
          searchInputRef.current?.focus();
        }
      }

      if (event.key === "Escape") {
        if (isSearchFocused) {
          searchInputRef.current?.blur();
        }

        if (isMobileSearchOpen) {
          setIsMobileSearchOpen(false);
        }
      }
    };

    window.addEventListener(
      "keydown",
      handleGlobalKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleGlobalKeyDown
      );
  }, [
    isSearchFocused,
    isMobileSearchOpen,
  ]);

  // ============================================================
  // Render
  // ============================================================

  return (
    <GlassAppBar
      position="fixed"
      elevation={0}
      className="navbar-container navbar-glass"
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: {
            xs: 56,
            sm: 60,
            md: 64,
          },

          height: {
            xs: 56,
            sm: 60,
            md: 64,
          },

          px: {
            xs: 1,
            sm: 1.75,
            md: 2.5,
            lg: 3,
          },

          gap: {
            xs: 0.75,
            sm: 1,
            md: 1.5,
          },

          justifyContent:
            "space-between",

          position: "relative",

          width: "100%",

          overflow: "visible",
        }}
      >
        {/* ======================================================
            LEFT – Brand
            ====================================================== */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{
            minWidth: 0,

            flexShrink: 1,

            opacity:
              isMobileSearchOpen
                ? 0
                : 1,

            pointerEvents:
              isMobileSearchOpen
                ? "none"
                : "auto",

            transition:
              "opacity 180ms ease",
          }}
        >
          <Tooltip
            title="Open navigation"
            arrow
          >
            <IconButton
              onClick={onMenuClick}
              edge="start"
              aria-label="Open navigation menu"
              className="navbar-btn"
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },

                width: 40,
                height: 40,

                mr: 0.25,

                color: TEXT_SECONDARY,

                borderRadius: 11,

                "&:hover": {
                  bgcolor:
                    SEA_BLUE_SOFT,

                  color:
                    SEA_BLUE_DARK,

                  transform:
                    "translateY(-1px)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <LogoContainer
            className="logo-container"
            direction="row"
            alignItems="center"
            spacing={1}
            onClick={() =>
              navigate("/dashboard")
            }
            role="button"
            tabIndex={0}
            aria-label="Navigate to Dashboard"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" ||
                e.key === " "
              ) {
                e.preventDefault();

                navigate(
                  "/dashboard"
                );
              }
            }}
          >
            <Avatar
              className="logo-avatar navbar-logo"
              src={logo}
              alt="Smart Retail Logo"
              variant="rounded"
              sx={{
                width: {
                  xs: 34,
                  sm: 37,
                  md: 40,
                },

                height: {
                  xs: 34,
                  sm: 37,
                  md: 40,
                },

                borderRadius: {
                  xs: 10,
                  md: 11,
                },

                bgcolor: WHITE,

                border: `1px solid ${alpha(
                  SEA_BLUE,
                  0.12
                )}`,

                objectFit:
                  "contain",

                p: 0.25,

                flexShrink: 0,
              }}
            />

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },

                flexDirection:
                  "column",

                justifyContent:
                  "center",

                minWidth: 0,
              }}
            >
              <Typography
                className="brand-title"
                sx={{
                  fontWeight: 850,

                  letterSpacing:
                    "-0.025em",

                  lineHeight: 1.05,

                  fontSize: {
                    sm: "0.98rem",
                    md: "1.02rem",
                  },

                  color:
                    TEXT_PRIMARY,

                  whiteSpace:
                    "nowrap",

                  transition:
                    "color 180ms ease",
                }}
              >
                Smart Retail
              </Typography>

              <Typography
                sx={{
                  display: {
                    xs: "none",
                    lg: "block",
                  },

                  fontSize:
                    "0.66rem",

                  color:
                    TEXT_SECONDARY,

                  fontWeight: 650,

                  letterSpacing:
                    "0.015em",

                  lineHeight: 1.25,

                  whiteSpace:
                    "nowrap",

                  mt: 0.25,
                }}
              >
                Intelligence Platform
              </Typography>
            </Box>
          </LogoContainer>
        </Stack>

        {/* ======================================================
            DESKTOP SEARCH
            ====================================================== */}

        <SearchContainer
          isFocused={isSearchFocused}
          className={`navbar-search ${
            isSearchFocused
              ? "is-focused"
              : ""
          }`}
        >
          <SearchIcon
            sx={{
              color: isSearchFocused
                ? SEA_BLUE
                : "#91A7AE",

              mr: 1,

              fontSize: 20,

              transition:
                "color 180ms ease, transform 180ms ease",

              transform:
                isSearchFocused
                  ? "scale(1.05)"
                  : "scale(1)",
            }}
          />

          <InputBase
            inputRef={
              searchInputRef
            }
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            onFocus={() =>
              setIsSearchFocused(
                true
              )
            }
            onBlur={() =>
              setIsSearchFocused(
                false
              )
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleSearchSubmit()
            }
            placeholder="Search products, sales, reports..."
            fullWidth
            inputProps={{
              "aria-label":
                "Global search",
            }}
            sx={{
              flex: 1,

              minWidth: 0,

              "& input": {
                fontSize: {
                  sm: "0.78rem",
                  md: "0.82rem",
                },

                fontWeight: 550,

                color:
                  TEXT_PRIMARY,

                "&::placeholder": {
                  color:
                    "#8AA0A8",

                  opacity: 1,
                },
              },
            }}
          />

          {searchTerm ? (
            <Fade in>
              <IconButton
                size="small"
                onClick={
                  clearSearch
                }
                aria-label="Clear search"
                className="navbar-btn"
                sx={{
                  width: 28,
                  height: 28,

                  color:
                    TEXT_SECONDARY,

                  borderRadius: 8,

                  "&:hover": {
                    bgcolor:
                      SEA_BLUE_SOFT,

                    color:
                      SEA_BLUE_DARK,
                  },
                }}
              >
                <ClearRoundedIcon
                  sx={{
                    fontSize: 17,
                  }}
                />
              </IconButton>
            </Fade>
          ) : (
            <ShortcutBadge
              sx={{
                opacity:
                  isSearchFocused
                    ? 0.45
                    : 1,
              }}
            >
              <KeyboardCommandKeyIcon
                sx={{
                  fontSize: 12,
                }}
              />
              K
            </ShortcutBadge>
          )}
        </SearchContainer>

        {/* ======================================================
            RIGHT SIDE
            ====================================================== */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 0.75,
            md: 1,
          }}
          sx={{
            flexShrink: 0,

            opacity:
              isMobileSearchOpen
                ? 0
                : 1,

            pointerEvents:
              isMobileSearchOpen
                ? "none"
                : "auto",

            transition:
              "opacity 180ms ease",
          }}
        >
          {/* Mobile Search */}
          <Tooltip
            title="Search"
            arrow
          >
            <IconButton
              className="navbar-search-mobile navbar-btn"
              sx={{
                display: {
                  xs: "flex",
                  sm: "none",
                },

                width: 40,
                height: 40,

                color:
                  TEXT_SECONDARY,

                borderRadius: 11,

                "&:hover": {
                  bgcolor:
                    SEA_BLUE_SOFT,

                  color:
                    SEA_BLUE_DARK,
                },
              }}
              onClick={() =>
                setIsMobileSearchOpen(
                  true
                )
              }
              aria-label="Open search"
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip
            title="Notifications"
            arrow
          >
            <NotificationButton
              className={`navbar-notification ${
                unreadCount > 0
                  ? "has-unread"
                  : ""
              }`}
              onClick={
                handleNotificationOpen
              }
              isOpen={
                isNotificationOpen
              }
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <PremiumBadge
                className="navbar-badge"
                badgeContent={
                  unreadCount
                }
                invisible={
                  unreadCount === 0
                }
                max={99}
              >
                <NotificationsNoneRoundedIcon
                  className="bell-icon"
                  sx={{
                    fontSize: 21,
                  }}
                />
              </PremiumBadge>
            </NotificationButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              my: 1,

              display: {
                xs: "none",
                sm: "block",
              },

              borderColor:
                BORDER,
            }}
          />

          {/* ====================================================
              USER PROFILE
              ==================================================== */}

          <UserProfileWrapper
            className="navbar-avatar-wrapper"
            direction="row"
            spacing={1}
            alignItems="center"
            onClick={
              handleUserMenuOpen
            }
            isOpen={
              isUserMenuOpen
            }
            role="button"
            tabIndex={0}
            aria-controls={
              isUserMenuOpen
                ? "user-menu"
                : undefined
            }
            aria-haspopup="true"
            aria-expanded={
              isUserMenuOpen
                ? "true"
                : undefined
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" ||
                e.key === " "
              ) {
                e.preventDefault();

                handleUserMenuOpen(
                  e
                );
              }
            }}
          >
            {/* ==================================================
                UPDATED NAVBAR AVATAR
                ================================================== */}

            <ProfileAvatar
              className="navbar-avatar"
              src={
                profileAvatar ||
                undefined
              }
              alt={displayName}
              imgProps={{
                loading: "eager",
              }}
            >
              {!profileAvatar &&
                avatarLetter}
            </ProfileAvatar>

            {/* User name */}
            <Box
              sx={{
                display: {
                  xs: "none",
                  lg: "block",
                },

                textAlign: "left",

                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 750,

                  fontSize:
                    "0.77rem",

                  lineHeight: 1.15,

                  color:
                    TEXT_PRIMARY,

                  maxWidth: 145,

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",

                  whiteSpace:
                    "nowrap",
                }}
              >
                {displayName}
              </Typography>

              <Typography
                sx={{
                  fontSize:
                    "0.65rem",

                  color:
                    TEXT_SECONDARY,

                  fontWeight: 550,

                  mt: 0.25,

                  maxWidth: 145,

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",

                  whiteSpace:
                    "nowrap",
                }}
              >
                {storeName}
              </Typography>
            </Box>

            {/* Chevron */}
            <KeyboardArrowDownRoundedIcon
              className={`chevron-icon ${
                isUserMenuOpen
                  ? "is-open"
                  : ""
              }`}
              sx={{
                display: {
                  xs: "none",
                  lg: "block",
                },

                fontSize: 18,
              }}
            />
          </UserProfileWrapper>
        </Stack>

        {/* ======================================================
            MOBILE SEARCH OVERLAY
            ====================================================== */}

        <Fade
          in={isMobileSearchOpen}
          unmountOnExit
        >
          <Box
            className="mobile-search-overlay"
            sx={{
              position: "absolute",

              top: 0,
              left: 0,
              right: 0,
              bottom: 0,

              bgcolor:
                "rgba(255,255,255,0.98)",

              backdropFilter:
                "blur(16px)",

              zIndex: 10,

              display: {
                xs: "flex",
                sm: "none",
              },

              alignItems: "center",

              px: 1.25,

              gap: 0.75,

              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <IconButton
              onClick={() =>
                setIsMobileSearchOpen(
                  false
                )
              }
              edge="start"
              aria-label="Close search"
              className="navbar-btn"
              sx={{
                width: 40,
                height: 40,

                color:
                  TEXT_SECONDARY,

                borderRadius: 11,

                "&:hover": {
                  bgcolor:
                    SEA_BLUE_SOFT,

                  color:
                    SEA_BLUE_DARK,
                },
              }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>

            <Box
              sx={{
                flex: 1,

                display: "flex",

                alignItems:
                  "center",

                minWidth: 0,

                px: 1,

                py: 0.65,

                borderRadius: 10,

                bgcolor:
                  "#F5FAFB",

                border: `1px solid ${BORDER}`,
              }}
            >
              <SearchIcon
                sx={{
                  color: SEA_BLUE,
                  fontSize: 20,
                  mr: 0.75,
                }}
              />

              <InputBase
                inputRef={
                  mobileSearchInputRef
                }
                fullWidth
                placeholder="Search products, sales..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleSearchSubmit()
                }
                sx={{
                  "& input": {
                    fontSize:
                      "0.88rem",

                    color:
                      TEXT_PRIMARY,
                  },
                }}
              />

              {searchTerm && (
                <IconButton
                  size="small"
                  onClick={
                    clearSearch
                  }
                  aria-label="Clear search"
                  sx={{
                    color:
                      TEXT_SECONDARY,

                    width: 28,
                    height: 28,
                  }}
                >
                  <ClearRoundedIcon
                    sx={{
                      fontSize: 17,
                    }}
                  />
                </IconButton>
              )}
            </Box>

            <IconButton
              onClick={
                handleSearchSubmit
              }
              disabled={
                !searchTerm.trim()
              }
              aria-label="Submit search"
              className="navbar-btn"
              sx={{
                width: 40,
                height: 40,

                borderRadius: 11,

                color: WHITE,

                bgcolor:
                  SEA_BLUE,

                "&:hover": {
                  bgcolor:
                    SEA_BLUE_DARK,
                },

                "&.Mui-disabled": {
                  bgcolor:
                    "#E7EFF1",

                  color:
                    "#9AAEB5",
                },
              }}
            >
              <ArrowForwardRoundedIcon
                sx={{
                  fontSize: 19,
                }}
              />
            </IconButton>
          </Box>
        </Fade>
      </Toolbar>

      {/* ========================================================
          USER MENU
          ======================================================== */}

      <StyledMenu
        id="user-menu"
        anchorEl={
          userMenuAnchorEl
        }
        open={isUserMenuOpen}
        onClose={
          handleUserMenuClose
        }
        onClick={
          handleUserMenuClose
        }
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        TransitionComponent={Zoom}
        TransitionProps={{
          timeout: 180,
        }}
      >
        {/* Mobile user information */}
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            mb: 0.5,

            display: {
              xs: "block",
              lg: "none",
            },

            borderRadius: 10,

            background: `linear-gradient(
              135deg,
              ${alpha(
                SEA_BLUE,
                0.07
              )},
              ${alpha(
                AQUA,
                0.035
              )}
            )`,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            {/* UPDATED DROPDOWN AVATAR */}

            <ProfileAvatar
              src={
                profileAvatar ||
                undefined
              }
              alt={displayName}
              imgProps={{
                loading: "eager",
              }}
            >
              {!profileAvatar &&
                avatarLetter}
            </ProfileAvatar>

            <Box minWidth={0}>
              <Typography
                variant="subtitle2"
                fontWeight={800}
                color={TEXT_PRIMARY}
                noWrap
              >
                {displayName}
              </Typography>

              <Typography
                variant="caption"
                color={TEXT_SECONDARY}
                noWrap
              >
                {storeName}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider
          sx={{
            display: {
              xs: "block",
              lg: "none",
            },

            my: 0.75,

            borderColor:
              BORDER,
          }}
        />

        {/* My Profile */}
        <MenuItem
          onClick={() =>
            handleNav("/profile")
          }
        >
          <PersonOutlineOutlinedIcon
            fontSize="small"
            sx={{
              mr: 1.5,
              color:
                TEXT_SECONDARY,
            }}
          />

          <Typography
            variant="body2"
            fontWeight={650}
          >
            My Profile
          </Typography>
        </MenuItem>

        {/* Account Settings */}
        <MenuItem
          onClick={() =>
            handleNav("/settings")
          }
        >
          <SettingsOutlinedIcon
            fontSize="small"
            sx={{
              mr: 1.5,
              color:
                TEXT_SECONDARY,
            }}
          />

          <Typography
            variant="body2"
            fontWeight={650}
          >
            Account Settings
          </Typography>
        </MenuItem>

        <Divider
          sx={{
            my: 0.75,
            borderColor:
              BORDER,
          }}
        />

        {/* Logout */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: "#C84A4A",

            "&:hover": {
              backgroundColor:
                "rgba(200,74,74,0.055) !important",

              color: "#B33F3F",
            },
          }}
        >
          <LogoutOutlinedIcon
            fontSize="small"
            sx={{
              mr: 1.5,
              color: "inherit",
            }}
          />

          <Typography
            variant="body2"
            fontWeight={700}
          >
            Log out
          </Typography>
        </MenuItem>
      </StyledMenu>

      {/* ========================================================
          NOTIFICATION POPOVER
          ======================================================== */}

      <Popover
        open={
          isNotificationOpen
        }
        anchorEl={
          notificationAnchorEl
        }
        onClose={
          handleNotificationClose
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        TransitionComponent={Zoom}
        TransitionProps={{
          timeout: 180,
        }}
        PaperProps={{
          sx: {
            width: {
              xs: "calc(100vw - 20px)",
              sm: 430,
            },

            maxWidth: 430,

            maxHeight: {
              xs: "calc(100vh - 80px)",
              sm: "82vh",
            },

            mt: 1,

            borderRadius: 16,

            backgroundColor:
              "rgba(255,255,255,0.98)",

            backdropFilter:
              "blur(18px)",

            border: `1px solid ${alpha(
              SEA_BLUE,
              0.11
            )}`,

            boxShadow:
              "0 20px 50px rgba(23,49,59,0.13), 0 3px 10px rgba(23,49,59,0.05)",

            overflow: "hidden",
          },
        }}
      >
        <NotificationPanel
          notifications={
            notifications
          }
          unreadCount={
            unreadCount
          }
          onMarkAsRead={
            markAsRead
          }
          onMarkAllAsRead={
            markAllAsRead
          }
          onRemove={
            removeNotification
          }
          onClearAll={
            clearAllNotifications
          }
          onClose={
            handleNotificationClose
          }
        />
      </Popover>
    </GlassAppBar>
  );
}

export default Navbar;
