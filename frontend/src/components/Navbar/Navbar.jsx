import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Material UI Core
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

// Material UI Styles & Animations
import { styled, keyframes, useTheme } from "@mui/material/styles";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Context & Hooks
import { useNotifications } from "../../context/NotificationContext";
import NotificationPanel from "../notification/NotificationPanel";
import { useAuth } from "../../hooks/useAuth";
import { useThemeContext } from '../../context/ThemeContext';
import logo from "../../assets/images/logo.png";

// ============================================================================
// 1. ANIMATIONS (Refined for Performance & Elegance)
// ============================================================================

const entranceSlideDown = keyframes`
  0% { transform: translateY(-15px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const badgePulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 4px rgba(239, 68, 68, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const bellSwing = keyframes`
  0% { transform: rotate(0deg); }
  15% { transform: rotate(12deg); }
  30% { transform: rotate(-10deg); }
  45% { transform: rotate(6deg); }
  60% { transform: rotate(-4deg); }
  75%, 100% { transform: rotate(0deg); }
`;

// ============================================================================
// 2. STYLED COMPONENTS (Premium UI Elements)
// ============================================================================

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(16px) saturate(180%)",
  WebkitBackdropFilter: "blur(16px) saturate(180%)",
  borderBottom: `1px solid rgba(226, 232, 240, 0.8)`,
  color: theme.palette.text.primary,
  animation: `${entranceSlideDown} 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
}));

const LogoContainer = styled(Stack)(({ theme }) => ({
  cursor: "pointer",
  padding: "6px 12px",
  borderRadius: "12px",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "rgba(79, 70, 229, 0.04)",
    "& .logo-avatar": {
      transform: "translateY(-1px) scale(1.05)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
  },
  "&:active": {
    transform: "scale(0.97)",
  },
}));

const SearchContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isFocused",
})(({ theme, isFocused }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: 480,
  backgroundColor: isFocused ? "#ffffff" : "#F8FAFC",
  border: "1px solid",
  borderColor: isFocused ? "#4F46E5" : "#E2E8F0",
  borderRadius: "12px",
  padding: "8px 16px",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: isFocused 
    ? "0 0 0 3px rgba(79, 70, 229, 0.12), 0 4px 12px rgba(0,0,0,0.04)" 
    : "none",
  "&:hover": {
    backgroundColor: isFocused ? "#ffffff" : "#F1F5F9",
    borderColor: isFocused ? "#4F46E5" : "#CBD5E1",
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: 340,
  },
  [theme.breakpoints.down("sm")]: {
    display: "none", 
  },
}));

const ShortcutBadge = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  backgroundColor: theme.palette.mode === "light" ? "#F1F5F9" : "#334155",
  border: `1px solid ${theme.palette.mode === "light" ? "#E2E8F0" : "#475569"}`,
  borderRadius: "6px",
  padding: "3px 8px",
  color: theme.palette.text.secondary,
  fontSize: "0.7rem",
  fontWeight: 600,
  pointerEvents: "none",
  transition: "opacity 0.2s ease",
}));

const NotificationButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "hasUnread" && prop !== "isOpen",
})(({ theme, hasUnread, isOpen }) => ({
  width: 42,
  height: 42,
  borderRadius: "12px",
  backgroundColor: isOpen ? "#F8FAFC" : "#ffffff",
  border: "1px solid",
  borderColor: isOpen ? "#4F46E5" : "#E2E8F0",
  color: isOpen ? "#4F46E5" : "#475569",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },
  "&:active": {
    transform: "translateY(0) scale(0.95)",
  },
  "& .bell-icon": {
    animation: hasUnread && !isOpen ? `${bellSwing} 4s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite` : "none",
    transformOrigin: "top center",
  },
}));

const PremiumBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#EF4444", // Bright alert red
    color: "#fff",
    minWidth: 18,
    height: 18,
    borderRadius: "50%",
    fontSize: "0.7rem",
    fontWeight: 700,
    border: "2px solid #ffffff",
    padding: 0,
    animation: `${badgePulse} 2s infinite`,
  },
}));

const UserProfileWrapper = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "isOpen",
})(({ theme, isOpen }) => ({
  padding: "6px 12px 6px 6px",
  borderRadius: "30px", 
  cursor: "pointer",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: isOpen ? "#F8FAFC" : "transparent",
  border: "1px solid",
  borderColor: isOpen ? "#E2E8F0" : "transparent",
  "&:hover": {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  "&:active": {
    transform: "scale(0.98)",
  },
  "& .chevron-icon": {
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    color: isOpen ? "#0F172A" : theme.palette.text.secondary,
  }
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    marginTop: theme.spacing(1),
    minWidth: 260,
    borderRadius: 16,
    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.12), 0 0 2px rgba(0,0,0,0.05)",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    padding: theme.spacing(1),
  },
  "& .MuiMenuItem-root": {
    borderRadius: 8,
    margin: "4px 0",
    padding: "10px 16px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#F8FAFC",
      color: "#0F172A",
      "& .MuiSvgIcon-root": {
        color: "#4F46E5",
      }
    },
    "&:active": {
      transform: "scale(0.98)",
    }
  },
}));

// ============================================================================
// 3. MAIN COMPONENT
// ============================================================================

function Navbar({ onMenuClick }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  
  const { user, logout } = useAuth();
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  } = useNotifications();

  const { themeMode, setThemeMode } = useThemeContext();

  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const isUserMenuOpen = Boolean(userMenuAnchorEl);
  const isNotificationOpen = Boolean(notificationAnchorEl);

  const handleUserMenuOpen = (event) => setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);
  
  const handleNotificationOpen = (event) => setNotificationAnchorEl(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchorEl(null);

  const handleNav = (path) => {
    handleUserMenuClose();
    navigate(path);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate("/login", { replace: true });
  };

  const handleSearchSubmit = useCallback(() => {
    const query = searchTerm.trim();
    if (!query) return;
    setIsMobileSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }, [searchTerm, navigate]);

  const clearSearch = () => {
    setSearchTerm("");
    if (isMobileSearchOpen) {
      mobileSearchInputRef.current?.focus();
    } else {
      searchInputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
    }
  }, [isMobileSearchOpen]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); 
        searchInputRef.current?.focus();
      }
      
      if (e.key === "Escape") {
        if (isSearchFocused) searchInputRef.current?.blur();
        if (isMobileSearchOpen) setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isSearchFocused, isMobileSearchOpen]);

  return (
    <GlassAppBar position="fixed" elevation={0}>
      <Toolbar
        sx={{
          minHeight: { xs: 64, sm: 72, md: 76 },
          px: { xs: 2, sm: 3, md: 4 },
          justifyContent: "space-between",
          gap: 2,
          position: "relative", 
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: isMobileSearchOpen ? 0 : 1, transition: 'opacity 0.2s' }}>
          <IconButton
            onClick={onMenuClick}
            edge="start"
            aria-label="open menu"
            sx={{ mr: 1, display: { md: "none" }, color: "text.secondary" }}
          >
            <MenuIcon />
          </IconButton>

          <LogoContainer
            direction="row"
            alignItems="center"
            spacing={1.5}
            onClick={() => navigate("/dashboard")}
            role="button"
            tabIndex={0}
            aria-label="Navigate to Dashboard"
          >
            <Avatar
              className="logo-avatar"
              src={logo}
              alt="Smart Retail Logo"
              variant="rounded"
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: "10px",
                transition: "all 0.3s ease",
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Typography
                variant="subtitle1"
                fontWeight={800}
                sx={{
                  letterSpacing: "-0.01em",
                  lineHeight: 1.1,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  color: "#0F172A",
                }}
              >
                Smart Retail
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: { xs: "none", sm: "block" },
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  color: "#64748B",
                  letterSpacing: "0.01em",
                }}
              >
                Intelligence Platform
              </Typography>
            </Box>
          </LogoContainer>
        </Stack>

        <SearchContainer isFocused={isSearchFocused}>
          <SearchIcon 
            sx={{ 
              color: isSearchFocused ? "#4F46E5" : "#94A3B8", 
              mr: 1.5,
              fontSize: "1.25rem",
              transition: "color 0.2s ease"
            }} 
          />
          <InputBase
            inputRef={searchInputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit();
            }}
            placeholder="Search products, sales, reports..."
            fullWidth
            inputProps={{
              "aria-label": "Global search",
              style: {
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#1E293B",
              },
            }}
          />
          
          {searchTerm ? (
            <Fade in={Boolean(searchTerm)}>
              <IconButton size="small" onClick={clearSearch} sx={{ ml: 1, color: "#64748B" }}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </Fade>
          ) : (
            <ShortcutBadge sx={{ opacity: isSearchFocused ? 0 : 1 }}>
              <KeyboardCommandKeyIcon sx={{ fontSize: "0.8rem" }} />
              K
            </ShortcutBadge>
          )}
        </SearchContainer>

        <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }} sx={{ opacity: isMobileSearchOpen ? 0 : 1, transition: 'opacity 0.2s' }}>
          
          <Tooltip title="Search" arrow>
            <IconButton
              sx={{ display: { xs: "flex", sm: "none" }, color: "#64748B" }}
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="Open mobile search"
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications" arrow>
            <NotificationButton
              onClick={handleNotificationOpen}
              hasUnread={unreadCount > 0}
              isOpen={isNotificationOpen}
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <PremiumBadge 
                badgeContent={unreadCount} 
                invisible={unreadCount === 0}
                max={99}
              >
                <NotificationsIcon className="bell-icon" sx={{ fontSize: 24 }} />
              </PremiumBadge>
            </NotificationButton>
          </Tooltip>

          <Tooltip title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} arrow>
            <IconButton
              onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
              sx={{ width: 42, height: 42, borderRadius: '12px', color: '#475569' }}
            >
              {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              my: 1.5,
              display: { xs: "none", sm: "block" },
              borderColor: "#E2E8F0"
            }}
          />

          <UserProfileWrapper
            direction="row"
            spacing={1.5}
            alignItems="center"
            onClick={handleUserMenuOpen}
            isOpen={isUserMenuOpen}
            aria-controls={isUserMenuOpen ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isUserMenuOpen ? "true" : undefined}
          >
            <Avatar
              sx={{
                bgcolor: "#4F46E5",
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                fontWeight: 700,
                fontSize: "1rem",
                boxShadow: "0 2px 8px rgba(79, 70, 229, 0.2)",
              }}
            >
              {(user?.full_name || user?.name || "R").charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "left" }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  lineHeight: 1.2,
                  color: "#0F172A"
                }}
              >
                {user?.full_name || user?.name || "Retail Manager"}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "#64748B",
                  fontWeight: 500,
                }}
              >
                {user?.store_name || "Store Owner"}
              </Typography>
            </Box>
            
            <KeyboardArrowDownIcon 
              className="chevron-icon"
              sx={{ display: { xs: "none", md: "block" }, fontSize: "1.2rem" }} 
            />
          </UserProfileWrapper>
        </Stack>

        <Fade in={isMobileSearchOpen} unmountOnExit>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(255, 255, 255, 0.98)",
              zIndex: 10,
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
              px: 2,
              gap: 1,
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            <IconButton onClick={() => setIsMobileSearchOpen(false)} edge="start" sx={{ color: "#64748B" }}>
              <ArrowBackIcon />
            </IconButton>
            <InputBase
              inputRef={mobileSearchInputRef}
              fullWidth
              placeholder="Search products, sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              sx={{ flex: 1, fontSize: "1rem", color: "#0F172A" }}
            />
            {searchTerm && (
              <IconButton size="small" onClick={clearSearch} sx={{ color: "#64748B" }}>
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Fade>

      </Toolbar>

      <StyledMenu
        id="user-menu"
        anchorEl={userMenuAnchorEl}
        open={isUserMenuOpen}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 200 }}
      >
        <Box sx={{ px: 2, py: 1.5, mb: 1, display: { xs: 'block', md: 'none' } }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#0F172A">
             {user?.full_name || user?.name || "Retail Manager"}
          </Typography>
          <Typography variant="caption" color="#64748B">
             {user?.store_name || "Store Owner"}
          </Typography>
        </Box>
        
        <Divider sx={{ display: { xs: 'block', md: 'none' }, mb: 1, borderColor: "#E2E8F0" }} />

        <MenuItem onClick={() => handleNav("/profile")}>
          <PersonOutlineOutlinedIcon fontSize="small" sx={{ mr: 1.5, color: "#64748B" }} />
          <Typography variant="body2" fontWeight={500}>My Profile</Typography>
        </MenuItem>

        <MenuItem onClick={() => handleNav("/settings")}>
          <SettingsOutlinedIcon fontSize="small" sx={{ mr: 1.5, color: "#64748B" }} />
          <Typography variant="body2" fontWeight={500}>Account Settings</Typography>
        </MenuItem>

        <Divider sx={{ my: 1, borderColor: "#E2E8F0" }} />

        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            color: "#EF4444",
            "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.05) !important" }
          }}
        >
          <LogoutOutlinedIcon fontSize="small" sx={{ mr: 1.5, color: "inherit !important" }} />
          <Typography variant="body2" fontWeight={600}>Log out</Typography>
        </MenuItem>
      </StyledMenu>

      <Popover
        open={isNotificationOpen}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 200 }}
        PaperProps={{
          sx: {
            width: { xs: "95vw", sm: 440 },
            maxHeight: "85vh",
            borderRadius: "16px",
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1), 0 0 3px rgba(0,0,0,0.05)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            overflow: "hidden",
            mt: 1.5,
          },
        }}
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
    </GlassAppBar>
  );
}

export default Navbar;