// src/components/Inventory/inventoryTheme.js
//
// Shared Inventory Design System
// ------------------------------------------------------
// Purpose:
// - One consistent visual language across ALL Inventory pages
// - Light sea-water / faint blue palette
// - White + warm beige surfaces
// - Responsive-first styling
// - Framer Motion variants
// - Shared MUI sx tokens
// - Accessible focus states
// - Reduced-motion friendly
// - No dark-mode-specific styling
//
// Used by:
// - Inventory
// - AddInventory
// - EditInventory
// - InventoryDetails
// - InventoryAlerts
// - RestockRecommendations
// - Inventory components
// ------------------------------------------------------

import { alpha } from "@mui/material/styles";

// ======================================================
// COLOR PALETTE
// ======================================================

export const COLORS = {
  // ----------------------------------------------------
  // Brand / Primary
  // ----------------------------------------------------

  primary: "#168AAD",
  primaryDark: "#0F7897",
  primaryDeep: "#075985",
  primaryLight: "#22A6C5",

  // ----------------------------------------------------
  // Aqua / Sea-water backgrounds
  // ----------------------------------------------------

  aqua: "#E8F8FC",
  aquaSoft: "#F1FBFD",
  aquaPale: "#F7FCFD",

  cyan: "#22B8CF",
  cyanLight: "#6CCBD9",

  // ----------------------------------------------------
  // Text
  // ----------------------------------------------------

  ink: "#17324D",
  slate: "#64748B",
  muted: "#8A9AAF",
  white: "#FFFFFF",

  // ----------------------------------------------------
  // Borders / Dividers
  // ----------------------------------------------------

  border: "#D9EAF0",
  borderStrong: "#C5DEE7",

  // ----------------------------------------------------
  // Warm neutral / beige
  // ----------------------------------------------------

  beige: "#FAF8F2",
  beigeSoft: "#FBF9F4",
  beigeDeep: "#F5F0E5",

  // ----------------------------------------------------
  // Semantic: Success
  // ----------------------------------------------------

  success: "#16A085",
  successDark: "#12836D",
  successSoft: "#E7F6F1",

  // ----------------------------------------------------
  // Semantic: Warning
  // ----------------------------------------------------

  warning: "#D98E04",
  warningDark: "#B97800",
  warningSoft: "#FBF2E1",

  // ----------------------------------------------------
  // Semantic: Error
  // ----------------------------------------------------

  error: "#D64545",
  errorDark: "#B93737",
  errorSoft: "#FBEAEA",

  // ----------------------------------------------------
  // Semantic: Info
  // ----------------------------------------------------

  info: "#1976D2",
  infoSoft: "#EAF3FC",
};

// ======================================================
// ALPHA HELPERS
// ======================================================

export const colorAlpha = {
  primary: (value = 0.1) => alpha(COLORS.primary, value),
  cyan: (value = 0.1) => alpha(COLORS.cyan, value),
  success: (value = 0.1) => alpha(COLORS.success, value),
  warning: (value = 0.1) => alpha(COLORS.warning, value),
  error: (value = 0.1) => alpha(COLORS.error, value),
  info: (value = 0.1) => alpha(COLORS.info, value),
};

// ======================================================
// FRAMER MOTION
// ======================================================
//
// Keep motion subtle.
// Inventory is a business application, so animations
// should support hierarchy rather than distract from data.
//

export const containerVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
    },
  },
};

export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const fadeVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const slideUpVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const iconFloatVariants = {
  animate: {
    y: [0, -3, 0],
    rotate: [0, 2, 0, -2, 0],

    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ======================================================
// ACCESSIBILITY / FOCUS
// ======================================================

export const focusVisibleSx = {
  "&:focus-visible": {
    outline: `3px solid ${alpha(COLORS.cyan, 0.35)}`,
    outlineOffset: 2,
  },
};

// ======================================================
// CARD HOVER
// ======================================================

export const cardHoverSx = {
  transition:
    "transform .25s ease, box-shadow .25s ease, border-color .25s ease",

  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 14px 34px rgba(22,70,90,.10)",
    borderColor: COLORS.borderStrong,
  },

  "&:focus-within": {
    borderColor: alpha(COLORS.primary, 0.45),
  },
};

// ======================================================
// PAGE BACKDROP
// ======================================================

export const pageBackdropSx = {
  minHeight: "100%",

  background: `
    radial-gradient(
      1200px 480px at 8% -10%,
      rgba(34,184,207,.06),
      transparent 60%
    ),
    radial-gradient(
      900px 420px at 100% 0%,
      rgba(22,138,173,.05),
      transparent 55%
    )
  `,
};

// ======================================================
// MAIN INVENTORY PAGE CONTAINER
// ======================================================

export const pageContainerSx = {
  width: "100%",
  maxWidth: "1440px",
  mx: "auto",

  px: {
    xs: 1.5,
    sm: 2,
    md: 3,
    lg: 4,
  },

  py: {
    xs: 2,
    sm: 3,
    md: 4,
  },
};

// ======================================================
// MAIN PANEL
// ======================================================

export const panelSx = {
  position: "relative",
  overflow: "hidden",

  borderRadius: {
    xs: "16px",
    sm: "18px",
    md: "20px",
  },

  border: `1px solid ${COLORS.border}`,

  background:
    "linear-gradient(145deg, #FFFFFF 0%, #FBFEFF 55%, #FAFAF5 100%)",

  boxShadow:
    "0 10px 32px rgba(22,70,90,.05)",

  ...focusVisibleSx,
};

// ======================================================
// SECONDARY PANEL
// ======================================================

export const secondaryPanelSx = {
  position: "relative",
  overflow: "hidden",

  borderRadius: {
    xs: "14px",
    sm: "16px",
  },

  border: `1px solid ${COLORS.border}`,

  background: COLORS.white,

  boxShadow:
    "0 6px 22px rgba(22,70,90,.04)",

  ...focusVisibleSx,
};

// ======================================================
// SOFT AQUA PANEL
// ======================================================

export const aquaPanelSx = {
  position: "relative",

  borderRadius: {
    xs: "14px",
    sm: "16px",
  },

  border: `1px solid ${COLORS.border}`,

  background:
    "linear-gradient(135deg, #F7FCFD 0%, #E8F8FC 100%)",

  boxShadow:
    "0 6px 20px rgba(22,138,173,.05)",
};

// ======================================================
// BEIGE PANEL
// ======================================================

export const beigePanelSx = {
  position: "relative",

  borderRadius: {
    xs: "14px",
    sm: "16px",
  },

  border: `1px solid ${COLORS.border}`,

  background:
    "linear-gradient(135deg, #FFFFFF 0%, #FBF9F4 100%)",

  boxShadow:
    "0 6px 20px rgba(90,80,50,.04)",
};

// ======================================================
// TOP ACCENT
// ======================================================

export const topAccentSx = {
  position: "absolute",

  top: 0,
  left: 0,
  right: 0,

  height: 3,

  background:
    "linear-gradient(90deg, #0F7897 0%, #22B8CF 50%, #6CCBD9 100%)",

  zIndex: 2,
};

// ======================================================
// PAGE HEADER
// ======================================================

export const pageHeaderSx = {
  mb: {
    xs: 2.5,
    sm: 3,
    md: 4,
  },
};

// ======================================================
// PAGE TITLE
// ======================================================

export const pageTitleSx = {
  color: COLORS.ink,

  fontWeight: 800,

  fontSize: {
    xs: "1.55rem",
    sm: "1.85rem",
    md: "2.15rem",
    lg: "2.35rem",
  },

  lineHeight: 1.2,

  letterSpacing: "-0.02em",
};

// ======================================================
// PAGE SUBTITLE
// ======================================================

export const pageSubtitleSx = {
  color: COLORS.slate,

  mt: 0.75,

  maxWidth: {
    xs: "100%",
    md: "760px",
  },

  fontSize: {
    xs: ".82rem",
    sm: ".9rem",
    md: ".95rem",
  },

  lineHeight: 1.7,
};

// ======================================================
// SECTION TITLE
// ======================================================

export const sectionTitleSx = {
  color: COLORS.ink,

  fontWeight: 750,

  fontSize: {
    xs: "1rem",
    sm: "1.1rem",
    md: "1.2rem",
  },

  lineHeight: 1.3,
};

// ======================================================
// SECTION DESCRIPTION
// ======================================================

export const sectionDescriptionSx = {
  color: COLORS.slate,

  fontSize: {
    xs: ".78rem",
    sm: ".82rem",
    md: ".86rem",
  },

  lineHeight: 1.65,
};

// ======================================================
// ACTION BUTTON
// ======================================================

export const actionButtonSx = {
  height: {
    xs: 42,
    sm: 44,
  },

  minWidth: {
    xs: 0,
    sm: 132,
  },

  px: {
    xs: 2,
    sm: 2.25,
  },

  borderRadius: 2,

  fontWeight: 700,

  fontSize: {
    xs: ".76rem",
    sm: ".78rem",
  },

  textTransform: "none",

  transition:
    "transform .2s ease, box-shadow .2s ease, background .2s ease",

  ...focusVisibleSx,

  "&:hover": {
    transform: "translateY(-2px)",
  },

  "&:active": {
    transform: "scale(.98)",
  },

  "&:disabled": {
    transform: "none",
  },
};

// ======================================================
// PRIMARY BUTTON
// ======================================================

export const primaryButtonSx = {
  ...actionButtonSx,

  color: COLORS.white,

  background:
    "linear-gradient(135deg, #168AAD 0%, #22A6C5 100%)",

  boxShadow:
    "0 7px 18px rgba(22,138,173,.20)",

  "&:hover": {
    transform: "translateY(-2px)",

    background:
      "linear-gradient(135deg, #0F7897 0%, #168AAD 100%)",

    boxShadow:
      "0 10px 24px rgba(22,138,173,.28)",
  },
};

// ======================================================
// SECONDARY BUTTON
// ======================================================

export const secondaryButtonSx = {
  ...actionButtonSx,

  color: COLORS.primary,

  borderColor: COLORS.borderStrong,

  backgroundColor: COLORS.white,

  "&:hover": {
    transform: "translateY(-2px)",

    borderColor: COLORS.primary,

    backgroundColor: COLORS.aquaSoft,
  },
};

// ======================================================
// DANGER BUTTON
// ======================================================

export const dangerButtonSx = {
  ...actionButtonSx,

  color: COLORS.error,

  borderColor: alpha(COLORS.error, 0.3),

  backgroundColor: COLORS.white,

  "&:hover": {
    transform: "translateY(-2px)",

    borderColor: COLORS.error,

    backgroundColor: COLORS.errorSoft,
  },
};

// ======================================================
// SMALL ICON BADGE
// Replaces inconsistent Avatar usage
// ======================================================

export const iconBadgeSx = (size = 44) => ({
  width: size,
  height: size,

  minWidth: size,

  borderRadius: "12px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  color: COLORS.primary,

  background:
    "linear-gradient(135deg, rgba(22,138,173,.13), rgba(34,184,207,.05))",

  border:
    `1px solid ${COLORS.border}`,

  boxShadow:
    "0 6px 16px rgba(22,138,173,.08)",

  flexShrink: 0,

  ...focusVisibleSx,
});

// ======================================================
// LARGE PAGE ICON BADGE
// ======================================================

export const pageIconBadgeSx = {
  ...iconBadgeSx(56),

  borderRadius: {
    xs: "14px",
    sm: "16px",
  },

  background:
    "linear-gradient(135deg, rgba(22,138,173,.14), rgba(34,184,207,.07))",
};

// ======================================================
// STAT CARD
// ======================================================

export const statCardSx = {
  ...secondaryPanelSx,

  p: {
    xs: 1.75,
    sm: 2,
    md: 2.25,
  },

  minHeight: {
    xs: 112,
    sm: 120,
  },

  ...cardHoverSx,
};

// ======================================================
// KPI VALUE
// ======================================================

export const kpiValueSx = {
  color: COLORS.ink,

  fontWeight: 800,

  fontSize: {
    xs: "1.35rem",
    sm: "1.55rem",
    md: "1.8rem",
  },

  lineHeight: 1.1,
};

// ======================================================
// KPI LABEL
// ======================================================

export const kpiLabelSx = {
  color: COLORS.slate,

  fontWeight: 600,

  fontSize: {
    xs: ".7rem",
    sm: ".75rem",
    md: ".78rem",
  },

  lineHeight: 1.4,
};

// ======================================================
// DATA CARD
// ======================================================

export const dataCardSx = {
  borderRadius: {
    xs: "12px",
    sm: "14px",
  },

  border: `1px solid ${COLORS.border}`,

  backgroundColor: COLORS.white,

  transition:
    "transform .2s ease, box-shadow .2s ease, border-color .2s ease",

  "&:hover": {
    transform: "translateY(-2px)",

    boxShadow:
      "0 10px 24px rgba(22,70,90,.08)",

    borderColor: COLORS.borderStrong,
  },
};

// ======================================================
// FORM SECTION
// ======================================================

export const formSectionSx = {
  p: {
    xs: 2,
    sm: 2.5,
    md: 3,
  },

  borderRadius: {
    xs: "14px",
    sm: "16px",
  },

  border: `1px solid ${COLORS.border}`,

  backgroundColor: COLORS.white,
};

// ======================================================
// INPUT FIELD
// ======================================================

export const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,

    backgroundColor: COLORS.white,

    transition:
      "border-color .2s ease, box-shadow .2s ease",

    "& fieldset": {
      borderColor: COLORS.border,
    },

    "&:hover fieldset": {
      borderColor: COLORS.borderStrong,
    },

    "&.Mui-focused": {
      boxShadow:
        `0 0 0 3px ${alpha(COLORS.primary, 0.10)}`,
    },

    "&.Mui-focused fieldset": {
      borderColor: COLORS.primary,
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: COLORS.primary,
  },
};

// ======================================================
// SEARCH FIELD
// ======================================================

export const searchFieldSx = {
  ...inputSx,

  "& .MuiOutlinedInput-root": {
    ...inputSx["& .MuiOutlinedInput-root"],

    minHeight: 44,

    backgroundColor: COLORS.aquaPale,
  },
};

// ======================================================
// FILTER PANEL
// ======================================================

export const filterPanelSx = {
  ...secondaryPanelSx,

  p: {
    xs: 1.75,
    sm: 2,
    md: 2.5,
  },

  background:
    "linear-gradient(135deg, #FFFFFF 0%, #F7FCFD 100%)",
};

// ======================================================
// ALERT PANEL
// ======================================================

export const alertPanelSx = {
  borderRadius: {
    xs: "12px",
    sm: "14px",
  },

  border: `1px solid ${COLORS.border}`,

  "& .MuiAlert-message": {
    width: "100%",
  },
};

// ======================================================
// EMPTY STATE
// ======================================================

export const emptyStateSx = {
  py: {
    xs: 7,
    sm: 9,
    md: 11,
  },

  px: {
    xs: 2,
    sm: 4,
  },

  textAlign: "center",

  borderRadius: {
    xs: "14px",
    sm: "16px",
  },

  border: `1px dashed ${COLORS.borderStrong}`,

  background:
    "linear-gradient(135deg, #FBFEFF 0%, #FAFAF5 100%)",
};

// ======================================================
// STOCK STATUS
// ======================================================

export const stockStatusSx = {
  healthy: {
    color: COLORS.success,
    backgroundColor: COLORS.successSoft,
    borderColor: alpha(COLORS.success, 0.25),
  },

  low: {
    color: COLORS.warning,
    backgroundColor: COLORS.warningSoft,
    borderColor: alpha(COLORS.warning, 0.25),
  },

  critical: {
    color: COLORS.error,
    backgroundColor: COLORS.errorSoft,
    borderColor: alpha(COLORS.error, 0.25),
  },

  info: {
    color: COLORS.info,
    backgroundColor: COLORS.infoSoft,
    borderColor: alpha(COLORS.info, 0.25),
  },
};

// ======================================================
// CHIP
// ======================================================

export const inventoryChipSx = {
  borderRadius: 1.5,

  fontWeight: 700,

  fontSize: {
    xs: ".68rem",
    sm: ".72rem",
  },

  height: {
    xs: 26,
    sm: 28,
  },
};

// ======================================================
// PROGRESS BAR
// ======================================================

export const progressSx = {
  height: {
    xs: 6,
    sm: 7,
  },

  borderRadius: 999,

  backgroundColor: COLORS.aqua,

  "& .MuiLinearProgress-bar": {
    borderRadius: 999,
  },
};

// ======================================================
// DIVIDER
// ======================================================

export const dividerSx = {
  borderColor: COLORS.border,

  opacity: 0.9,
};

// ======================================================
// TABLE / LIST HEADER
// ======================================================

export const listHeaderSx = {
  px: {
    xs: 1.5,
    sm: 2,
    md: 2.5,
  },

  py: {
    xs: 1.25,
    sm: 1.5,
  },

  backgroundColor: COLORS.aquaPale,

  borderBottom:
    `1px solid ${COLORS.border}`,

  color: COLORS.slate,

  fontWeight: 700,

  fontSize: {
    xs: ".68rem",
    sm: ".72rem",
  },

  textTransform: "uppercase",

  letterSpacing: ".04em",
};

// ======================================================
// LIST ITEM
// ======================================================

export const listItemSx = {
  px: {
    xs: 1.5,
    sm: 2,
    md: 2.5,
  },

  py: {
    xs: 1.75,
    sm: 2,
  },

  borderBottom:
    `1px solid ${COLORS.border}`,

  transition:
    "background-color .2s ease, transform .2s ease",

  "&:hover": {
    backgroundColor: COLORS.aquaPale,
  },

  "&:last-child": {
    borderBottom: "none",
  },
};

// ======================================================
// RESPONSIVE ACTION GROUP
// ======================================================

export const actionGroupSx = {
  display: "flex",

  flexDirection: {
    xs: "column",
    sm: "row",
  },

  gap: 1.25,

  width: {
    xs: "100%",
    sm: "auto",
  },

  "& .MuiButton-root": {
    width: {
      xs: "100%",
      sm: "auto",
    },
  },
};

// ======================================================
// BOTTOM ACTION PANEL
// ======================================================

export const bottomActionPanelSx = {
  mt: {
    xs: 2.5,
    sm: 3,
    md: 4,
  },

  p: {
    xs: 2,
    sm: 2.5,
    md: 3,
  },

  borderRadius: {
    xs: "14px",
    sm: "16px",
  },

  border:
    `1px solid ${COLORS.border}`,

  background:
    "linear-gradient(135deg, #FFFFFF 0%, #FBF9F4 100%)",
};

// ======================================================
// GRADIENT SUMMARY PANEL
// ======================================================

export const summaryPanelSx = {
  p: {
    xs: 2,
    sm: 2.5,
    md: 3,
  },

  borderRadius: {
    xs: "14px",
    sm: "16px",
  },

  border:
    `1px solid ${COLORS.border}`,

  background:
    "linear-gradient(135deg, rgba(22,138,173,.04), rgba(22,160,133,.04))",
};

// ======================================================
// LOADING CONTAINER
// ======================================================

export const loadingContainerSx = {
  minHeight: {
    xs: "55vh",
    sm: "60vh",
    md: "65vh",
  },

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  px: 2,
};

// ======================================================
// MOBILE CARD CONTENT
// ======================================================

export const mobileStackSx = {
  width: "100%",

  gap: {
    xs: 1.5,
    sm: 2,
  },
};

// ======================================================
// SAFE TEXT WRAPPING
// ======================================================

export const safeTextSx = {
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

// ======================================================
// EXPORT DEFAULT
// ======================================================

export default {
  COLORS,

  colorAlpha,

  containerVariants,
  itemVariants,
  fadeVariants,
  slideUpVariants,
  iconFloatVariants,

  focusVisibleSx,
  cardHoverSx,

  pageBackdropSx,
  pageContainerSx,

  panelSx,
  secondaryPanelSx,
  aquaPanelSx,
  beigePanelSx,

  topAccentSx,

  pageHeaderSx,
  pageTitleSx,
  pageSubtitleSx,

  sectionTitleSx,
  sectionDescriptionSx,

  actionButtonSx,
  primaryButtonSx,
  secondaryButtonSx,
  dangerButtonSx,

  iconBadgeSx,
  pageIconBadgeSx,

  statCardSx,
  kpiValueSx,
  kpiLabelSx,

  dataCardSx,
  formSectionSx,
  inputSx,
  searchFieldSx,
  filterPanelSx,

  alertPanelSx,
  emptyStateSx,

  stockStatusSx,
  inventoryChipSx,
  progressSx,

  dividerSx,
  listHeaderSx,
  listItemSx,

  actionGroupSx,
  bottomActionPanelSx,
  summaryPanelSx,

  loadingContainerSx,
  mobileStackSx,
  safeTextSx,
};
