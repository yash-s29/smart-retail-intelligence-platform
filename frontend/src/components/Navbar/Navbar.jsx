import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";

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
  Popover,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  Fade,
  Zoom,
} from "@mui/material";

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
// Styles
// ============================================================

import "./Navbar.css";

// ============================================================
// Navbar
// ============================================================

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // ==========================================================
  // Auth
  // ==========================================================

  const { user, logout } = useAuth();

  // ==========================================================
  // Notifications
  // ==========================================================

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  } = useNotifications();

  // ==========================================================
  // State
  // ==========================================================

  const [userMenuAnchorEl, setUserMenuAnchorEl] =
    useState(null);

  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [isSearchFocused, setIsSearchFocused] =
    useState(false);

  const [isMobileSearchOpen, setIsMobileSearchOpen] =
    useState(false);

  // ==========================================================
  // Derived
  // ==========================================================

  const isUserMenuOpen = Boolean(userMenuAnchorEl);

  const isNotificationOpen =
    Boolean(notificationAnchorEl);

  const displayName =
    user?.full_name ||
    user?.name ||
    "Retail Manager";

  const storeName =
    user?.store_name ||
    "Store Owner";

  const avatarLetter =
    displayName.charAt(0).toUpperCase() || "R";

  // ==========================================================
  // User Menu
  // ==========================================================

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  // ==========================================================
  // Notifications
  // ==========================================================

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // ==========================================================
  // Navigation
  // ==========================================================

  const handleNav = (path) => {
    handleUserMenuClose();
    navigate(path);
  };

  // ==========================================================
  // Logout
  // ==========================================================

  const handleLogout = () => {
    handleUserMenuClose();

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================================
  // Search
  // ==========================================================

  const handleSearchSubmit = useCallback(() => {
    const query = searchTerm.trim();

    if (!query) return;

    setIsMobileSearchOpen(false);

    navigate(
      `/search?q=${encodeURIComponent(query)}`
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

  // ==========================================================
  // Mobile Search Focus
  // ==========================================================

  useEffect(() => {
    if (!isMobileSearchOpen) return;

    const timer = setTimeout(() => {
      mobileSearchInputRef.current?.focus();
    }, 140);

    return () => clearTimeout(timer);
  }, [isMobileSearchOpen]);

  // ==========================================================
  // Keyboard Shortcuts
  // ==========================================================

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      // Ctrl + K / Cmd + K
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        if (window.innerWidth < 600) {
          setIsMobileSearchOpen(true);
        } else {
          searchInputRef.current?.focus();
        }
      }

      // Escape
      if (event.key === "Escape") {
        if (isSearchFocused) {
          searchInputRef.current?.blur();
        }

        if (isMobileSearchOpen) {
          setIsMobileSearchOpen(false);
        }

        if (isNotificationOpen) {
          setNotificationAnchorEl(null);
        }

        if (isUserMenuOpen) {
          setUserMenuAnchorEl(null);
        }
      }
    };

    window.addEventListener(
      "keydown",
      handleGlobalKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleGlobalKeyDown
      );
    };
  }, [
    isSearchFocused,
    isMobileSearchOpen,
    isNotificationOpen,
    isUserMenuOpen,
  ]);

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <AppBar
      position="fixed"
      elevation={0}
      className="navbar-container navbar-glass"
    >
      <Toolbar
        disableGutters
        className="navbar-toolbar"
      >
        {/* ==================================================
            LEFT SIDE
            ================================================== */}

        <Stack
          direction="row"
          alignItems="center"
          className={`navbar-left ${
            isMobileSearchOpen
              ? "navbar-left-hidden"
              : ""
          }`}
        >
          {/* Mobile Menu */}
          <Tooltip title="Open navigation" arrow>
            <IconButton
              onClick={onMenuClick}
              aria-label="Open navigation menu"
              className="navbar-menu-button"
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          {/* Brand */}
          <Box
            className="navbar-brand"
            onClick={() =>
              navigate("/dashboard")
            }
            role="button"
            tabIndex={0}
            aria-label="Navigate to Dashboard"
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();
                navigate("/dashboard");
              }
            }}
          >
            <Box className="navbar-logo-wrap">
              <Avatar
                src={logo}
                alt="Smart Retail Logo"
                variant="rounded"
                className="navbar-logo"
              />
            </Box>

            <Box className="navbar-brand-copy">
              <Typography className="brand-title">
                Smart Retail
              </Typography>

              <Typography className="brand-subtitle">
                Intelligence Platform
              </Typography>
            </Box>
          </Box>
        </Stack>

        {/* ==================================================
            DESKTOP SEARCH
            ================================================== */}

        <Box
          className={`navbar-search ${
            isSearchFocused
              ? "is-focused"
              : ""
          }`}
        >
          <SearchIcon className="search-icon" />

          <InputBase
            inputRef={searchInputRef}
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            onFocus={() =>
              setIsSearchFocused(true)
            }
            onBlur={() =>
              setIsSearchFocused(false)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearchSubmit();
              }
            }}
            placeholder="Search products, sales, reports..."
            fullWidth
            inputProps={{
              "aria-label": "Global search",
            }}
            className="navbar-search-input"
          />

          {searchTerm ? (
            <Fade in>
              <IconButton
                size="small"
                onClick={clearSearch}
                aria-label="Clear search"
                className="navbar-search-clear"
              >
                <ClearRoundedIcon />
              </IconButton>
            </Fade>
          ) : (
            <Box
              className={`navbar-search-shortcut ${
                isSearchFocused
                  ? "shortcut-muted"
                  : ""
              }`}
            >
              <KeyboardCommandKeyIcon />
              <span>K</span>
            </Box>
          )}
        </Box>

        {/* ==================================================
            RIGHT SIDE
            ================================================== */}

        <Stack
          direction="row"
          alignItems="center"
          className={`navbar-right ${
            isMobileSearchOpen
              ? "navbar-right-hidden"
              : ""
          }`}
        >
          {/* Mobile Search */}
          <Tooltip title="Search" arrow>
            <IconButton
              onClick={() =>
                setIsMobileSearchOpen(true)
              }
              aria-label="Open search"
              className="navbar-mobile-search-button"
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications" arrow>
            <IconButton
              onClick={handleNotificationOpen}
              aria-label={`Notifications, ${unreadCount} unread`}
              className={`navbar-notification ${
                isNotificationOpen
                  ? "is-open"
                  : ""
              } ${
                unreadCount > 0
                  ? "has-unread"
                  : ""
              }`}
            >
              <Badge
                badgeContent={unreadCount}
                invisible={unreadCount === 0}
                max={99}
                className="navbar-notification-badge"
              >
                <NotificationsNoneRoundedIcon className="bell-icon" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Divider */}
          <Divider
            orientation="vertical"
            flexItem
            className="navbar-divider"
          />

          {/* Profile */}
          <Box
            className={`navbar-profile ${
              isUserMenuOpen
                ? "is-open"
                : ""
            }`}
            onClick={handleUserMenuOpen}
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
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();
                handleUserMenuOpen(event);
              }
            }}
          >
            <Avatar
              alt={displayName}
              className="navbar-avatar"
            >
              {avatarLetter}
            </Avatar>

            <Box className="navbar-profile-copy">
              <Typography className="navbar-profile-name">
                {displayName}
              </Typography>

              <Typography className="navbar-profile-store">
                {storeName}
              </Typography>
            </Box>

            <KeyboardArrowDownRoundedIcon className="chevron-icon" />
          </Box>
        </Stack>

        {/* ==================================================
            MOBILE SEARCH
            ================================================== */}

        <Fade
          in={isMobileSearchOpen}
          unmountOnExit
        >
          <Box className="navbar-mobile-search-overlay">
            <IconButton
              onClick={() =>
                setIsMobileSearchOpen(false)
              }
              aria-label="Close search"
              className="mobile-search-back"
            >
              <ArrowBackRoundedIcon />
            </IconButton>

            <Box className="mobile-search-field">
              <SearchIcon />

              <InputBase
                inputRef={
                  mobileSearchInputRef
                }
                fullWidth
                placeholder="Search products, sales..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
              />

              {searchTerm && (
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="mobile-search-clear"
                >
                  <ClearRoundedIcon />
                </IconButton>
              )}
            </Box>

            <IconButton
              onClick={handleSearchSubmit}
              disabled={!searchTerm.trim()}
              aria-label="Submit search"
              className="mobile-search-submit"
            >
              <ArrowForwardRoundedIcon />
            </IconButton>
          </Box>
        </Fade>
      </Toolbar>

      {/* ====================================================
          USER MENU
          ==================================================== */}

      <Menu
        id="user-menu"
        anchorEl={userMenuAnchorEl}
        open={isUserMenuOpen}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        TransitionComponent={Zoom}
        TransitionProps={{
          timeout: 180,
        }}
        className="navbar-user-menu"
      >
        {/* Mobile User Info */}
        <Box className="navbar-mobile-user-info">
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Avatar className="navbar-avatar">
              {avatarLetter}
            </Avatar>

            <Box minWidth={0}>
              <Typography className="mobile-user-name">
                {displayName}
              </Typography>

              <Typography className="mobile-user-store">
                {storeName}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider className="mobile-menu-divider" />

        {/* Profile */}
        <MenuItem
          onClick={() =>
            handleNav("/profile")
          }
        >
          <PersonOutlineOutlinedIcon />

          <Typography>
            My Profile
          </Typography>
        </MenuItem>

        {/* Settings */}
        <MenuItem
          onClick={() =>
            handleNav("/settings")
          }
        >
          <SettingsOutlinedIcon />

          <Typography>
            Account Settings
          </Typography>
        </MenuItem>

        <Divider />

        {/* Logout */}
        <MenuItem
          onClick={handleLogout}
          className="logout-menu-item"
        >
          <LogoutOutlinedIcon />

          <Typography>
            Log out
          </Typography>
        </MenuItem>
      </Menu>

      {/* ====================================================
          NOTIFICATION POPOVER
          ==================================================== */}

      <Popover
        open={isNotificationOpen}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
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
        className="navbar-notification-popover"
      >
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onRemove={removeNotification}
          onClearAll={clearAllNotifications}
          onClose={handleNotificationClose}
        />
      </Popover>
    </AppBar>
  );
}

export default Navbar;
