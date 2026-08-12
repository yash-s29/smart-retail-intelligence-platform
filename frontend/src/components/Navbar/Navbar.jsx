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

import {
  alpha,
  keyframes,
  styled,
} from "@mui/material/styles";

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
// DESIGN TOKENS
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
// ANIMATIONS
// ============================================================

const navbarEntrance = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-14px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const logoFloat = keyframes`
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  20% {
    transform: translateY(-2px) rotate(1.5deg);
  }

  40% {
    transform: translateY(0) rotate(0deg);
  }

  65% {
    transform: translateY(-1.5px) rotate(-1.2deg);
  }

  82% {
    transform: translateY(0) rotate(0deg);
  }
`;

const logoGlow = keyframes`
  0% {
    opacity: 0.35;
    transform: scale(0.96);
  }

  50% {
    opacity: 0.65;
    transform: scale(1.04);
  }

  100% {
    opacity: 0.35;
    transform: scale(0.96);
  }
`;

const accentFlow = keyframes`
  0% {
    transform: translateX(-35%);
    opacity: 0.25;
  }

  50% {
    opacity: 0.75;
  }

  100% {
    transform: translateX(35%);
    opacity: 0.25;
  }
`;

const notificationSwing = keyframes`
  0%,
  76%,
  100% {
    transform: rotate(0deg);
  }

  79% {
    transform: rotate(11deg);
  }

  81% {
    transform: rotate(-9deg);
  }

  83% {
    transform: rotate(7deg);
  }

  85% {
    transform: rotate(-5deg);
  }

  87% {
    transform: rotate(2deg);
  }

  89% {
    transform: rotate(0deg);
  }
`;

const notificationPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(22, 138, 173, 0.30);
  }

  65% {
    box-shadow: 0 0 0 5px rgba(22, 138, 173, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(22, 138, 173, 0);
  }
`;

const searchGlow = keyframes`
  0% {
    opacity: 0.25;
  }

  50% {
    opacity: 0.70;
  }

  100% {
    opacity: 0.25;
  }
`;

const menuEnter = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-7px) scale(0.97);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const mobileSearchEnter = keyframes`
  0% {
    opacity: 0;
    transform: translateX(16px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const avatarShimmer = keyframes`
  0% {
    transform: translateX(-120%);
  }

  100% {
    transform: translateX(120%);
  }
`;

// ============================================================
// APP BAR
// ============================================================

const GlassAppBar = styled(AppBar)(() => ({
  position: "fixed",

  top: 0,
  left: 0,
  right: 0,

  background: `
    linear-gradient(
      180deg,
      rgba(255,255,255,0.96) 0%,
      rgba(255,255,255,0.91) 100%
    )
  `,

  backdropFilter: "blur(20px) saturate(160%)",
  WebkitBackdropFilter: "blur(20px) saturate(160%)",

  color: TEXT_PRIMARY,

  borderBottom: `1px solid ${alpha(
    SEA_BLUE,
    0.10
  )}`,

  boxShadow: `
    0 1px 0 rgba(255,255,255,0.95),
    0 5px 24px rgba(25,83,95,0.055)
  `,

  animation: `${navbarEntrance} 480ms cubic-bezier(0.16,1,0.3,1)`,

  zIndex: 1300,

  overflow: "visible",

  "&::after": {
    content: '""',

    position: "absolute",

    left: 0,
    right: 0,
    bottom: -1,

    height: 2,

    background: `
      linear-gradient(
        90deg,
        transparent 0%,
        ${alpha(SEA_BLUE, 0.12)} 20%,
        ${alpha(AQUA, 0.18)} 50%,
        ${alpha(SEA_BLUE, 0.12)} 80%,
        transparent 100%
      )
    `,

    transform: "translateX(-35%)",

    animation: `${accentFlow} 7s ease-in-out infinite`,

    pointerEvents: "none",
  },

  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",

    "&::after": {
      animation: "none",
    },
  },
}));

// ============================================================
// TOOLBAR
// ============================================================

const NavbarToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: 64,

  height: 64,

  width: "100%",

  paddingLeft: 24,
  paddingRight: 24,

  display: "flex",

  alignItems: "center",

  gap: 18,

  position: "relative",

  overflow: "visible",

  [theme.breakpoints.down("lg")]: {
    paddingLeft: 20,
    paddingRight: 20,

    gap: 14,
  },

  [theme.breakpoints.down("md")]: {
    minHeight: 60,
    height: 60,

    paddingLeft: 14,
    paddingRight: 14,

    gap: 10,
  },

  [theme.breakpoints.down("sm")]: {
    minHeight: 56,
    height: 56,

    paddingLeft: 8,
    paddingRight: 8,

    gap: 6,
  },
}));

// ============================================================
// LEFT SIDE
// ============================================================

const NavbarLeft = styled(Stack, {
  shouldForwardProp: (prop) =>
    prop !== "mobileSearchOpen",
})(({ mobileSearchOpen }) => ({
  display: "flex",

  flexDirection: "row",

  alignItems: "center",

  minWidth: 0,

  flexShrink: 1,

  opacity: mobileSearchOpen ? 0 : 1,

  pointerEvents: mobileSearchOpen ? "none" : "auto",

  transition:
    "opacity 180ms ease, transform 220ms ease",

  transform: mobileSearchOpen
    ? "translateX(-8px)"
    : "translateX(0)",
}));

// ============================================================
// MENU BUTTON
// ============================================================

const NavbarMenuButton = styled(IconButton)(() => ({
  display: "none",

  width: 40,
  height: 40,

  marginRight: 2,

  color: TEXT_SECONDARY,

  borderRadius: 11,

  transition:
    "background-color 180ms ease, color 180ms ease, transform 220ms cubic-bezier(.34,1.56,.64,1), box-shadow 180ms ease",

  "&:hover": {
    backgroundColor: SEA_BLUE_SOFT,

    color: SEA_BLUE_DARK,

    transform: "translateY(-2px)",

    boxShadow: `0 6px 16px ${alpha(
      SEA_BLUE,
      0.08
    )}`,
  },

  "&:active": {
    transform: "scale(0.94)",
  },

  "@media (max-width: 899px)": {
    display: "flex",
  },

  "@media (max-width: 599px)": {
    width: 38,
    height: 38,
  },
}));

// ============================================================
// BRAND
// ============================================================

const NavbarBrand = styled(Box)(() => ({
  position: "relative",

  display: "flex",

  alignItems: "center",

  gap: 10,

  cursor: "pointer",

  padding: "5px 8px 5px 5px",

  borderRadius: 16,

  userSelect: "none",

  outline: "none",

  transition:
    "background-color 220ms ease, transform 220ms ease, box-shadow 220ms ease",

  "&:hover": {
    backgroundColor: alpha(SEA_BLUE, 0.045),

    boxShadow: `0 7px 20px ${alpha(
      SEA_BLUE,
      0.055
    )}`,

    transform: "translateY(-1px)",

    "& .navbar-logo-wrap": {
      transform: "translateY(-2px) scale(1.035)",
    },

    "& .brand-title": {
      color: SEA_BLUE_DARK,
    },

    "& .brand-subtitle": {
      color: alpha(SEA_BLUE_DARK, 0.78),
    },
  },

  "&:active": {
    transform: "scale(0.985)",
  },

  "&:focus-visible": {
    outline: `3px solid ${alpha(
      SEA_BLUE,
      0.18
    )}`,

    outlineOffset: 2,
  },

  "@media (max-width: 599px)": {
    padding: 3,
  },
}));

// ============================================================
// LOGO WRAPPER
// ============================================================

const LogoWrap = styled(Box)(() => ({
  position: "relative",

  width: 44,
  height: 44,

  display: "grid",

  placeItems: "center",

  flexShrink: 0,

  transition:
    "transform 320ms cubic-bezier(.34,1.56,.64,1)",

  "&::before": {
    content: '""',

    position: "absolute",

    inset: -3,

    borderRadius: 14,

    border: `1px solid ${alpha(
      SEA_BLUE,
      0.12
    )}`,

    opacity: 0.45,

    animation: `${logoGlow} 4.5s ease-in-out infinite`,

    pointerEvents: "none",
  },

  "&::after": {
    content: '""',

    position: "absolute",

    inset: -6,

    borderRadius: 17,

    border: `1px solid ${alpha(
      AQUA,
      0.06
    )}`,

    opacity: 0,

    transition: "opacity 220ms ease",

    pointerEvents: "none",
  },

  "&:hover::after": {
    opacity: 1,
  },

  "@media (max-width: 599px)": {
    width: 38,
    height: 38,

    "&::before": {
      inset: -2,
      borderRadius: 12,
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    "&::before": {
      animation: "none",
    },
  },
}));

// ============================================================
// LOGO
// ============================================================

const NavbarLogo = styled(Avatar)(() => ({
  width: 42,
  height: 42,

  borderRadius: 12,

  backgroundColor: WHITE,

  border: `1px solid ${alpha(
    SEA_BLUE,
    0.12
  )}`,

  padding: 2,

  objectFit: "contain",

  boxShadow: `
    0 4px 12px ${alpha(SEA_BLUE, 0.10)},
    0 1px 3px rgba(23,49,59,0.04)
  `,

  animation: `${logoFloat} 5.5s ease-in-out infinite`,

  transition:
    "transform 320ms cubic-bezier(.34,1.56,.64,1), box-shadow 220ms ease, border-color 220ms ease",

  "&:hover": {
    boxShadow: `
      0 8px 22px ${alpha(SEA_BLUE, 0.18)},
      0 2px 5px rgba(23,49,59,0.05)
    `,

    borderColor: alpha(SEA_BLUE, 0.24),
  },

  "@media (max-width: 599px)": {
    width: 36,
    height: 36,

    borderRadius: 10,

    animation: `${logoFloat} 6s ease-in-out infinite`,
  },

  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
}));

// ============================================================
// BRAND COPY
// ============================================================

const BrandCopy = styled(Box)(() => ({
  display: "flex",

  flexDirection: "column",

  justifyContent: "center",

  minWidth: 0,

  "@media (max-width: 599px)": {
    display: "none",
  },

  "@media (min-width: 600px) and (max-width: 899px)": {
    ".brand-subtitle": {
      display: "none",
    },
  },
}));

const BrandTitle = styled(Typography)(() => ({
  fontWeight: 850,

  letterSpacing: "-0.028em",

  lineHeight: 1.05,

  fontSize: "1.02rem",

  color: TEXT_PRIMARY,

  whiteSpace: "nowrap",

  transition:
    "color 180ms ease, transform 220ms ease",

  "@media (max-width: 899px)": {
    fontSize: "0.98rem",
  },
}));

const BrandSubtitle = styled(Typography)(() => ({
  marginTop: 3,

  fontSize: "0.66rem",

  color: TEXT_SECONDARY,

  fontWeight: 650,

  letterSpacing: "0.015em",

  lineHeight: 1.2,

  whiteSpace: "nowrap",

  transition: "color 180ms ease",
}));

// ============================================================
// SEARCH
// ============================================================

const SearchContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isFocused",
})(({ isFocused }) => ({
  position: "relative",

  display: "flex",

  alignItems: "center",

  flex: "1 1 500px",

  width: "100%",

  maxWidth: 500,

  minHeight: 42,

  padding: "5px 8px 5px 13px",

  backgroundColor: isFocused
    ? WHITE
    : alpha(SEA_BLUE, 0.032),

  border: "1px solid",

  borderColor: isFocused
    ? alpha(SEA_BLUE, 0.48)
    : BORDER,

  borderRadius: 14,

  boxShadow: isFocused
    ? `
      0 0 0 3px ${alpha(SEA_BLUE, 0.09)},
      0 9px 25px ${alpha(SEA_BLUE, 0.075)}
    `
    : "0 1px 3px rgba(23,49,59,0.025)",

  transition:
    "background-color 220ms ease, border-color 220ms ease, box-shadow 240ms ease, transform 240ms cubic-bezier(.34,1.2,.64,1)",

  "&::before": isFocused
    ? {
        content: '""',

        position: "absolute",

        inset: -1,

        borderRadius: 14,

        background: `
          linear-gradient(
            90deg,
            ${alpha(SEA_BLUE, 0.10)},
            transparent 40%,
            ${alpha(AQUA, 0.09)}
          )
        `,

        zIndex: -1,

        animation: `${searchGlow} 2.8s ease-in-out infinite`,
      }
    : {},

  "&:hover": {
    backgroundColor: WHITE,

    borderColor: isFocused
      ? alpha(SEA_BLUE, 0.48)
      : alpha(SEA_BLUE, 0.22),

    transform: "translateY(-1px)",

    boxShadow: isFocused
      ? `
        0 0 0 3px ${alpha(SEA_BLUE, 0.09)},
        0 9px 25px ${alpha(SEA_BLUE, 0.075)}
      `
      : `0 6px 18px ${alpha(
          SEA_BLUE,
          0.055
        )}`,
  },

  "@media (max-width: 1199px)": {
    maxWidth: 430,
  },

  "@media (max-width: 899px)": {
    maxWidth: 330,
  },

  "@media (max-width: 599px)": {
    display: "none",
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",

    "&::before": {
      animation: "none",
    },
  },
}));

const SearchIconStyled = styled(SearchIcon, {
  shouldForwardProp: (prop) =>
    prop !== "isFocused",
})(({ isFocused }) => ({
  color: isFocused
    ? SEA_BLUE
    : "#91A7AE",

  marginRight: 9,

  fontSize: 20,

  flexShrink: 0,

  transition:
    "color 180ms ease, transform 220ms cubic-bezier(.34,1.56,.64,1)",

  transform: isFocused
    ? "scale(1.08) translateX(1px)"
    : "scale(1)",
}));

const NavbarSearchInput = styled(InputBase)(() => ({
  flex: 1,

  minWidth: 0,

  "& input": {
    fontSize: "0.82rem",

    fontWeight: 550,

    color: TEXT_PRIMARY,

    padding: "2px 0",

    "&::placeholder": {
      color: "#8AA0A8",

      opacity: 1,
    },
  },

  "@media (max-width: 899px)": {
    "& input": {
      fontSize: "0.78rem",
    },
  },
}));

const SearchClearButton = styled(IconButton)(() => ({
  width: 28,

  height: 28,

  marginLeft: 3,

  color: TEXT_SECONDARY,

  borderRadius: 8,

  transition:
    "background-color 180ms ease, color 180ms ease, transform 180ms ease",

  "&:hover": {
    backgroundColor: SEA_BLUE_SOFT,

    color: SEA_BLUE_DARK,

    transform: "scale(1.05)",
  },
}));

const SearchShortcut = styled(Box)(() => ({
  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  gap: 3,

  minWidth: 38,

  height: 27,

  padding: "3px 7px",

  borderRadius: 7,

  backgroundColor: "#F5FAFB",

  border: `1px solid ${BORDER}`,

  color: TEXT_SECONDARY,

  fontSize: "0.67rem",

  fontWeight: 750,

  pointerEvents: "none",

  transition:
    "opacity 180ms ease, transform 180ms ease",

  "& svg": {
    fontSize: 12,
  },
}));

// ============================================================
// RIGHT SIDE
// ============================================================

const NavbarRight = styled(Stack, {
  shouldForwardProp: (prop) =>
    prop !== "mobileSearchOpen",
})(({ mobileSearchOpen }) => ({
  display: "flex",

  flexDirection: "row",

  alignItems: "center",

  gap: 8,

  flexShrink: 0,

  opacity: mobileSearchOpen ? 0 : 1,

  pointerEvents: mobileSearchOpen
    ? "none"
    : "auto",

  transition:
    "opacity 180ms ease, transform 220ms ease",

  transform: mobileSearchOpen
    ? "translateX(8px)"
    : "translateX(0)",

  "@media (max-width: 599px)": {
    gap: 4,
  },
}));

// ============================================================
// MOBILE SEARCH BUTTON
// ============================================================

const MobileSearchButton = styled(IconButton)(() => ({
  display: "none",

  width: 40,
  height: 40,

  color: TEXT_SECONDARY,

  borderRadius: 11,

  transition:
    "background-color 180ms ease, color 180ms ease, transform 220ms cubic-bezier(.34,1.56,.64,1), box-shadow 180ms ease",

  "&:hover": {
    backgroundColor: SEA_BLUE_SOFT,

    color: SEA_BLUE_DARK,

    transform: "translateY(-2px)",

    boxShadow: `0 6px 16px ${alpha(
      SEA_BLUE,
      0.08
    )}`,
  },

  "&:active": {
    transform: "scale(0.94)",
  },

  "@media (max-width: 599px)": {
    display: "flex",

    width: 38,
    height: 38,
  },
}));

// ============================================================
// NOTIFICATION BUTTON
// ============================================================

const NotificationButton = styled(IconButton, {
  shouldForwardProp: (prop) =>
    prop !== "hasUnread" &&
    prop !== "isOpen",
})(({ hasUnread, isOpen }) => ({
  width: 42,

  height: 42,

  borderRadius: 12,

  backgroundColor: isOpen
    ? SEA_BLUE_SOFT
    : alpha(SEA_BLUE, 0.025),

  border: "1px solid",

  borderColor: isOpen
    ? alpha(SEA_BLUE, 0.30)
    : BORDER,

  color: isOpen
    ? SEA_BLUE_DARK
    : TEXT_SECONDARY,

  transition:
    "background-color 200ms ease, border-color 200ms ease, color 200ms ease, transform 220ms cubic-bezier(.34,1.56,.64,1), box-shadow 200ms ease",

  "&:hover": {
    backgroundColor: SEA_BLUE_SOFT,

    borderColor: alpha(SEA_BLUE, 0.28),

    color: SEA_BLUE_DARK,

    transform: "translateY(-2px)",

    boxShadow: `0 8px 20px ${alpha(
      SEA_BLUE,
      0.10
    )}`,
  },

  "&:active": {
    transform: "scale(0.94)",
  },

  "&:focus-visible": {
    outline: `3px solid ${alpha(
      SEA_BLUE,
      0.16
    )}`,

    outlineOffset: 2,
  },

  "& .bell-icon": {
    animation:
      hasUnread && !isOpen
        ? `${notificationSwing} 4.8s ease-in-out infinite`
        : "none",

    transformOrigin: "top center",
  },

  "@media (max-width: 599px)": {
    width: 38,
    height: 38,

    borderRadius: 11,
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& .bell-icon": {
      animation: "none",
    },
  },
}));

// ============================================================
// NOTIFICATION BADGE
// ============================================================

const NotificationBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    backgroundColor: SEA_BLUE,

    color: WHITE,

    minWidth: 17,

    height: 17,

    borderRadius: 999,

    padding: 0,

    border: `2px solid ${WHITE}`,

    fontSize: "0.62rem",

    fontWeight: 800,

    animation: `${notificationPulse} 2.5s ease-out infinite`,
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& .MuiBadge-badge": {
      animation: "none",
    },
  },
}));

// ============================================================
// NAVBAR DIVIDER
// ============================================================

const NavbarDivider = styled(Divider)(() => ({
  height: 30,

  margin: "0 3px",

  borderColor: BORDER,

  "@media (max-width: 599px)": {
    display: "none",
  },
}));

// ============================================================
// PROFILE
// ============================================================

const UserProfile = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isOpen",
})(({ isOpen }) => ({
  display: "flex",

  alignItems: "center",

  gap: 8,

  minWidth: 0,

  padding: "4px 8px 4px 4px",

  borderRadius: 30,

  cursor: "pointer",

  border: "1px solid",

  borderColor: isOpen
    ? alpha(SEA_BLUE, 0.20)
    : "transparent",

  backgroundColor: isOpen
    ? alpha(SEA_BLUE, 0.045)
    : "transparent",

  outline: "none",

  transition:
    "background-color 200ms ease, border-color 200ms ease, transform 220ms cubic-bezier(.34,1.56,.64,1), box-shadow 200ms ease",

  "&:hover": {
    backgroundColor: alpha(
      SEA_BLUE,
      0.045
    ),

    borderColor: alpha(SEA_BLUE, 0.14),

    boxShadow: `0 6px 18px ${alpha(
      SEA_BLUE,
      0.065
    )}`,

    transform: "translateY(-1px)",

    "& .navbar-avatar": {
      transform:
        "scale(1.045) rotate(-2deg)",

      boxShadow: `0 8px 20px ${alpha(
        SEA_BLUE,
        0.22
      )}`,
    },

    "& .profile-chevron": {
      color: SEA_BLUE_DARK,
    },
  },

  "&:active": {
    transform: "scale(0.98)",
  },

  "&:focus-visible": {
    outline: `3px solid ${alpha(
      SEA_BLUE,
      0.16
    )}`,

    outlineOffset: 2,
  },

  "@media (max-width: 899px)": {
    padding: 3,

    gap: 0,

    borderRadius: 50,
  },
}));

// ============================================================
// PROFILE AVATAR
// ============================================================

const ProfileAvatar = styled(Avatar)(() => ({
  position: "relative",

  overflow: "hidden",

  width: 38,

  height: 38,

  flexShrink: 0,

  background: `
    linear-gradient(
      145deg,
      ${SEA_BLUE} 0%,
      ${AQUA} 100%
    )
  `,

  color: WHITE,

  fontWeight: 850,

  fontSize: "0.91rem",

  border: `2px solid ${WHITE}`,

  boxShadow: `
    0 4px 13px ${alpha(SEA_BLUE, 0.18)},
    0 1px 3px rgba(23,49,59,0.04)
  `,

  transition:
    "transform 320ms cubic-bezier(.34,1.56,.64,1), box-shadow 220ms ease",

  "&::after": {
    content: '""',

    position: "absolute",

    top: 0,
    bottom: 0,

    width: "35%",

    left: "-50%",

    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",

    transform: "skewX(-20deg)",

    pointerEvents: "none",
  },

  "&:hover::after": {
    animation: `${avatarShimmer} 650ms ease`,
  },

  "@media (max-width: 599px)": {
    width: 36,
    height: 36,
  },

  "@media (prefers-reduced-motion: reduce)": {
    "&::after": {
      animation: "none !important",
    },
  },
}));

// ============================================================
// PROFILE COPY
// ============================================================

const ProfileCopy = styled(Box)(() => ({
  minWidth: 0,

  textAlign: "left",

  "@media (max-width: 899px)": {
    display: "none",
  },
}));

const ProfileName = styled(Typography)(() => ({
  fontWeight: 750,

  fontSize: "0.77rem",

  lineHeight: 1.15,

  color: TEXT_PRIMARY,

  maxWidth: 145,

  overflow: "hidden",

  textOverflow: "ellipsis",

  whiteSpace: "nowrap",
}));

const ProfileStore = styled(Typography)(() => ({
  fontSize: "0.65rem",

  color: TEXT_SECONDARY,

  fontWeight: 550,

  marginTop: 3,

  maxWidth: 145,

  overflow: "hidden",

  textOverflow: "ellipsis",

  whiteSpace: "nowrap",
}));

const ProfileChevron = styled(
  KeyboardArrowDownRoundedIcon
)(() => ({
  display: "block",

  fontSize: 18,

  color: TEXT_SECONDARY,

  transition:
    "transform 280ms cubic-bezier(.34,1.56,.64,1), color 180ms ease",

  "@media (max-width: 899px)": {
    display: "none",
  },
}));

// ============================================================
// USER MENU
// ============================================================

const StyledUserMenu = styled(Menu)(() => ({
  "& .MuiPaper-root": {
    marginTop: 8,

    minWidth: 255,

    padding: 7,

    borderRadius: 17,

    backgroundColor:
      "rgba(255,255,255,0.97)",

    backdropFilter: "blur(18px)",

    WebkitBackdropFilter:
      "blur(18px)",

    border: `1px solid ${alpha(
      SEA_BLUE,
      0.10
    )}`,

    boxShadow: `
      0 20px 48px rgba(23,49,59,0.12),
      0 3px 10px rgba(23,49,59,0.045)
    `,

    overflow: "hidden",

    animation: `${menuEnter} 190ms cubic-bezier(.16,1,.3,1)`,
  },

  "& .MuiMenuItem-root": {
    minHeight: 43,

    margin: "2px 0",

    padding: "9px 12px",

    borderRadius: 10,

    color: TEXT_PRIMARY,

    transition:
      "background-color 170ms ease, color 170ms ease, transform 170ms ease",

    "& svg": {
      marginRight: 13,

      fontSize: 20,

      color: TEXT_SECONDARY,

      transition: "color 170ms ease",
    },

    "& .MuiTypography-root": {
      fontSize: "0.84rem",

      fontWeight: 650,
    },

    "&:hover": {
      backgroundColor: alpha(
        SEA_BLUE,
        0.065
      ),

      color: SEA_BLUE_DARK,

      transform: "translateX(3px)",

      "& svg": {
        color: SEA_BLUE,
      },
    },

    "&:active": {
      transform: "scale(0.985)",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& .MuiPaper-root": {
      animation: "none",
    },

    "& .MuiMenuItem-root": {
      transition: "none",
    },
  },
}));

// ============================================================
// MOBILE USER INFO
// ============================================================

const MobileUserInfo = styled(Box)(() => ({
  display: "none",

  padding: "10px 11px",

  marginBottom: 5,

  borderRadius: 11,

  background: `
    linear-gradient(
      135deg,
      ${alpha(SEA_BLUE, 0.07)},
      ${alpha(AQUA, 0.035)}
    )
  `,

  "@media (max-width: 899px)": {
    display: "block",
  },
}));

const MobileMenuDivider = styled(Divider)(
  () => ({
    display: "none",

    margin: "7px 0",

    borderColor: BORDER,

    "@media (max-width: 899px)": {
      display: "block",
    },
  })
);

// ============================================================
// MOBILE SEARCH OVERLAY
// ============================================================

const MobileSearchOverlay = styled(Box)(
  () => ({
    position: "absolute",

    inset: 0,

    zIndex: 20,

    display: "none",

    alignItems: "center",

    gap: 6,

    padding: "0 8px",

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.985),
        rgba(255,255,255,0.97)
      )
    `,

    backdropFilter: "blur(18px)",

    WebkitBackdropFilter:
      "blur(18px)",

    borderBottom: `1px solid ${BORDER}`,

    animation: `${mobileSearchEnter} 220ms cubic-bezier(.16,1,.3,1)`,

    "@media (max-width: 599px)": {
      display: "flex",
    },

    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  })
);

const MobileSearchBack = styled(
  IconButton
)(() => ({
  width: 38,

  height: 38,

  flexShrink: 0,

  color: TEXT_SECONDARY,

  borderRadius: 11,

  transition:
    "background-color 180ms ease, color 180ms ease, transform 180ms ease",

  "&:hover": {
    backgroundColor: SEA_BLUE_SOFT,

    color: SEA_BLUE_DARK,

    transform: "translateX(-2px)",
  },
}));

const MobileSearchField = styled(Box)(
  () => ({
    flex: 1,

    minWidth: 0,

    height: 39,

    display: "flex",

    alignItems: "center",

    padding: "0 7px 0 10px",

    borderRadius: 11,

    backgroundColor: "#F5FAFB",

    border: `1px solid ${BORDER}`,

    transition:
      "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",

    "&:focus-within": {
      backgroundColor: WHITE,

      borderColor: alpha(
        SEA_BLUE,
        0.38
      ),

      boxShadow: `0 0 0 3px ${alpha(
        SEA_BLUE,
        0.075
      )}`,
    },

    "& > svg": {
      color: SEA_BLUE,

      fontSize: 20,

      marginRight: 7,

      flexShrink: 0,
    },

    "& .MuiInputBase-root": {
      minWidth: 0,
      flex: 1,
    },

    "& input": {
      minWidth: 0,

      fontSize: "0.86rem",

      color: TEXT_PRIMARY,

      "&::placeholder": {
        color: "#8AA0A8",

        opacity: 1,
      },
    },
  })
);

const MobileSearchClear = styled(
  IconButton
)(() => ({
  width: 28,

  height: 28,

  flexShrink: 0,

  color: TEXT_SECONDARY,

  borderRadius: 8,
}));

const MobileSearchSubmit = styled(
  IconButton
)(() => ({
  width: 39,

  height: 39,

  flexShrink: 0,

  borderRadius: 11,

  color: WHITE,

  backgroundColor: SEA_BLUE,

  boxShadow: `0 5px 14px ${alpha(
    SEA_BLUE,
    0.18
  )}`,

  transition:
    "background-color 180ms ease, transform 220ms cubic-bezier(.34,1.56,.64,1), box-shadow 180ms ease",

  "&:hover": {
    backgroundColor: SEA_BLUE_DARK,

    transform: "translateY(-1px) scale(1.025)",

    boxShadow: `0 7px 17px ${alpha(
      SEA_BLUE,
      0.23
    )}`,
  },

  "&:active": {
    transform: "scale(0.94)",
  },

  "&.Mui-disabled": {
    backgroundColor: "#E7EFF1",

    color: "#9AAEB5",

    boxShadow: "none",
  },
}));

// ============================================================
// NOTIFICATION POPOVER
// ============================================================

const NotificationPopover = styled(
  Popover
)(() => ({
  "& .MuiPaper-root": {
    width: 430,

    maxWidth:
      "calc(100vw - 20px)",

    maxHeight: "82vh",

    marginTop: 8,

    borderRadius: 17,

    backgroundColor:
      "rgba(255,255,255,0.98)",

    backdropFilter: "blur(18px)",

    WebkitBackdropFilter:
      "blur(18px)",

    border: `1px solid ${alpha(
      SEA_BLUE,
      0.11
    )}`,

    boxShadow: `
      0 22px 52px rgba(23,49,59,0.13),
      0 3px 10px rgba(23,49,59,0.05)
    `,

    overflow: "hidden",

    "@media (max-width: 599px)": {
      width:
        "calc(100vw - 20px)",

      maxHeight:
        "calc(100vh - 76px)",

      marginTop: 6,
    },
  },
}));

// ============================================================
// NAVBAR
// ============================================================

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const searchInputRef = useRef(null);
  const mobileSearchInputRef =
    useRef(null);

  // ==========================================================
  // AUTH
  // ==========================================================

  const { user, logout } = useAuth();

  // ==========================================================
  // NOTIFICATIONS
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
  // STATE
  // ==========================================================

  const [userMenuAnchorEl, setUserMenuAnchorEl] =
    useState(null);

  const [
    notificationAnchorEl,
    setNotificationAnchorEl,
  ] = useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    isSearchFocused,
    setIsSearchFocused,
  ] = useState(false);

  const [
    isMobileSearchOpen,
    setIsMobileSearchOpen,
  ] = useState(false);

  // ==========================================================
  // DERIVED
  // ==========================================================

  const isUserMenuOpen =
    Boolean(userMenuAnchorEl);

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
    displayName.charAt(0).toUpperCase() ||
    "R";

  // ==========================================================
  // USER MENU
  // ==========================================================

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(
      event.currentTarget
    );
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  const handleNotificationOpen = (
    event
  ) => {
    setNotificationAnchorEl(
      event.currentTarget
    );
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const handleNav = (path) => {
    handleUserMenuClose();

    navigate(path);
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    handleUserMenuClose();

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearchSubmit =
    useCallback(() => {
      const query = searchTerm.trim();

      if (!query) return;

      setIsMobileSearchOpen(false);

      setIsSearchFocused(false);

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

  // ==========================================================
  // MOBILE SEARCH FOCUS
  // ==========================================================

  useEffect(() => {
    if (!isMobileSearchOpen) return;

    const timer = setTimeout(() => {
      mobileSearchInputRef.current?.focus();
    }, 140);

    return () => clearTimeout(timer);
  }, [isMobileSearchOpen]);

  // ==========================================================
  // KEYBOARD SHORTCUTS
  // ==========================================================

  useEffect(() => {
    const handleGlobalKeyDown = (
      event
    ) => {
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

          setIsSearchFocused(false);
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
  // RENDER
  // ==========================================================

  return (
    <GlassAppBar
      elevation={0}
      className="navbar-container navbar-glass"
    >
      <NavbarToolbar disableGutters>
        {/* ====================================================
            LEFT / BRAND
            ==================================================== */}

        <NavbarLeft
          direction="row"
          mobileSearchOpen={
            isMobileSearchOpen
          }
        >
          {/* Mobile Menu */}
          <Tooltip
            title="Open navigation"
            arrow
          >
            <NavbarMenuButton
              onClick={onMenuClick}
              edge="start"
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </NavbarMenuButton>
          </Tooltip>

          {/* Brand */}
          <NavbarBrand
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
            <LogoWrap className="navbar-logo-wrap">
              <NavbarLogo
                src={logo}
                alt="Smart Retail Logo"
                variant="rounded"
                className="navbar-logo"
              />
            </LogoWrap>

            <BrandCopy className="navbar-brand-copy">
              <BrandTitle className="brand-title">
                Smart Retail
              </BrandTitle>

              <BrandSubtitle className="brand-subtitle">
                Intelligence Platform
              </BrandSubtitle>
            </BrandCopy>
          </NavbarBrand>
        </NavbarLeft>

        {/* ====================================================
            DESKTOP SEARCH
            ==================================================== */}

        <SearchContainer
          isFocused={isSearchFocused}
          className="navbar-search"
        >
          <SearchIconStyled
            isFocused={isSearchFocused}
            className="search-icon"
          />

          <NavbarSearchInput
            inputRef={searchInputRef}
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
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
              "aria-label":
                "Global search",
            }}
            className="navbar-search-input"
          />

          {searchTerm ? (
            <Fade in>
              <SearchClearButton
                size="small"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <ClearRoundedIcon
                  sx={{ fontSize: 17 }}
                />
              </SearchClearButton>
            </Fade>
          ) : (
            <SearchShortcut
              className="navbar-search-shortcut"
              sx={{
                opacity: isSearchFocused
                  ? 0.45
                  : 1,
              }}
            >
              <KeyboardCommandKeyIcon />
              <span>K</span>
            </SearchShortcut>
          )}
        </SearchContainer>

        {/* ====================================================
            RIGHT SIDE
            ==================================================== */}

        <NavbarRight
          direction="row"
          mobileSearchOpen={
            isMobileSearchOpen
          }
        >
          {/* Mobile Search */}
          <Tooltip title="Search" arrow>
            <MobileSearchButton
              onClick={() =>
                setIsMobileSearchOpen(
                  true
                )
              }
              aria-label="Open search"
            >
              <SearchIcon />
            </MobileSearchButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip
            title="Notifications"
            arrow
          >
            <NotificationButton
              className="navbar-notification"
              onClick={
                handleNotificationOpen
              }
              hasUnread={unreadCount > 0}
              isOpen={isNotificationOpen}
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <NotificationBadge
                badgeContent={unreadCount}
                invisible={
                  unreadCount === 0
                }
                max={99}
                className="navbar-notification-badge"
              >
                <NotificationsNoneRoundedIcon
                  className="bell-icon"
                  sx={{
                    fontSize: {
                      xs: 20,
                      sm: 21,
                    },
                  }}
                />
              </NotificationBadge>
            </NotificationButton>
          </Tooltip>

          {/* Divider */}
          <NavbarDivider
            orientation="vertical"
            flexItem
            className="navbar-divider"
          />

          {/* Profile */}
          <UserProfile
            className={`navbar-profile ${
              isUserMenuOpen
                ? "is-open"
                : ""
            }`}
            isOpen={isUserMenuOpen}
            onClick={
              handleUserMenuOpen
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
            <ProfileAvatar
              alt={displayName}
              className="navbar-avatar"
            >
              {avatarLetter}
            </ProfileAvatar>

            <ProfileCopy className="navbar-profile-copy">
              <ProfileName className="navbar-profile-name">
                {displayName}
              </ProfileName>

              <ProfileStore className="navbar-profile-store">
                {storeName}
              </ProfileStore>
            </ProfileCopy>

            <ProfileChevron
              className="profile-chevron chevron-icon"
              sx={{
                transform:
                  isUserMenuOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
              }}
            />
          </UserProfile>
        </NavbarRight>

        {/* ====================================================
            MOBILE SEARCH
            SINGLE OVERLAY — NO DUPLICATE NAVBAR
            ==================================================== */}

        <Fade
          in={isMobileSearchOpen}
          mountOnEnter
          unmountOnExit
        >
          <MobileSearchOverlay
            className="navbar-mobile-search-overlay"
          >
            <MobileSearchBack
              onClick={() =>
                setIsMobileSearchOpen(
                  false
                )
              }
              aria-label="Close search"
            >
              <ArrowBackRoundedIcon />
            </MobileSearchBack>

            <MobileSearchField className="mobile-search-field">
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
                  if (
                    event.key === "Enter"
                  ) {
                    handleSearchSubmit();
                  }
                }}
              />

              {searchTerm && (
                <MobileSearchClear
                  size="small"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <ClearRoundedIcon
                    sx={{
                      fontSize: 17,
                    }}
                  />
                </MobileSearchClear>
              )}
            </MobileSearchField>

            <MobileSearchSubmit
              onClick={handleSearchSubmit}
              disabled={!searchTerm.trim()}
              aria-label="Submit search"
            >
              <ArrowForwardRoundedIcon
                sx={{ fontSize: 19 }}
              />
            </MobileSearchSubmit>
          </MobileSearchOverlay>
        </Fade>
      </NavbarToolbar>

      {/* ======================================================
          USER MENU
          ====================================================== */}

      <StyledUserMenu
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
      >
        {/* Mobile User Information */}
        <MobileUserInfo>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <ProfileAvatar>
              {avatarLetter}
            </ProfileAvatar>

            <Box minWidth={0}>
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  color: TEXT_PRIMARY,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {displayName}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.68rem",
                  color: TEXT_SECONDARY,
                  mt: 0.25,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {storeName}
              </Typography>
            </Box>
          </Stack>
        </MobileUserInfo>

        <MobileMenuDivider />

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

        <Divider
          sx={{
            my: 0.75,
            borderColor: BORDER,
          }}
        />

        {/* Logout */}
        <MenuItem
          onClick={handleLogout}
          className="logout-menu-item"
          sx={{
            color: "#C84A4A",

            "&:hover": {
              backgroundColor:
                "rgba(200,74,74,0.055) !important",

              color: "#B33F3F",

              "& svg": {
                color: "#B33F3F !important",
              },
            },
          }}
        >
          <LogoutOutlinedIcon
            sx={{
              color: "inherit !important",
            }}
          />

          <Typography>
            Log out
          </Typography>
        </MenuItem>
      </StyledUserMenu>

      {/* ======================================================
          NOTIFICATION POPOVER
          ====================================================== */}

      <NotificationPopover
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
      </NotificationPopover>
    </GlassAppBar>
  );
}

export default Navbar;
