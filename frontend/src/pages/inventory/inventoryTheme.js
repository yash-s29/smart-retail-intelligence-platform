// src/components/Inventory/inventoryTheme.js
//
// Shared design tokens + Framer Motion variants for all Inventory pages.
// Light sea-water / faint blue palette, white + warm beige accents.
// No dark mode. No backend/API concerns live here.

// ======================================================
// Color Palette
// ======================================================

export const COLORS = {
  primary: "#168AAD",
  primaryDark: "#0F7897",
  primaryDeep: "#075985",

  aqua: "#E8F8FC",
  aquaSoft: "#F1FBFD",
  aquaPale: "#F7FCFD",

  cyan: "#22B8CF",

  ink: "#17324D",
  slate: "#64748B",
  muted: "#8A9AAF",

  border: "#D9EAF0",

  beige: "#FAF8F2",
  beigeSoft: "#FBF9F4",

  white: "#FFFFFF",

  success: "#16A085",
  successSoft: "#E7F6F1",

  warning: "#D98E04",
  warningSoft: "#FBF2E1",

  error: "#D64545",
  errorSoft: "#FBEAEA",
};

// ======================================================
// Motion Variants
// (MotionConfig reducedMotion="user" at each page root
// automatically disables/simplifies these for people with
// prefers-reduced-motion enabled — no extra code needed.)
// ======================================================

export const containerVariants = {
  hidden: { opacity: 0, y: 14 },
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
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export const iconFloatVariants = {
  animate: {
    y: [0, -3, 0],
    rotate: [0, 2, 0, -2, 0],
    transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
  },
};

export const cardHoverSx = {
  transition: "transform .25s ease, box-shadow .25s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 14px 34px rgba(22,70,90,.10)",
  },
};

// ======================================================
// Shared Surfaces
// ======================================================

export const pageBackdropSx = {
  background:
    "radial-gradient(1200px 480px at 8% -10%, rgba(34,184,207,.06), transparent 60%), radial-gradient(900px 420px at 100% 0%, rgba(22,138,173,.05), transparent 55%)",
};

export const panelSx = {
  position: "relative",
  overflow: "hidden",
  borderRadius: { xs: "16px", sm: "18px", md: "20px" },
  border: `1px solid ${COLORS.border}`,
  background: "linear-gradient(145deg, #FFFFFF 0%, #FBFEFF 55%, #FAFAF5 100%)",
  boxShadow: "0 10px 32px rgba(22,70,90,.05)",
};

export const topAccentSx = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 3,
  background: "linear-gradient(90deg, #0F7897 0%, #22B8CF 50%, #6CCBD9 100%)",
  zIndex: 2,
};

export const actionButtonSx = {
  height: 44,
  minWidth: 132,
  borderRadius: 2,
  fontWeight: 700,
  fontSize: ".78rem",
  textTransform: "none",
  transition: "transform .2s ease, box-shadow .2s ease",
  "&:hover": { transform: "translateY(-2px)" },
  "&:active": { transform: "scale(.98)" },
};

export const primaryButtonSx = {
  ...actionButtonSx,
  color: COLORS.white,
  background: "linear-gradient(135deg, #168AAD 0%, #22A6C5 100%)",
  boxShadow: "0 7px 18px rgba(22,138,173,.20)",
  "&:hover": {
    transform: "translateY(-2px)",
    background: "linear-gradient(135deg, #0F7897 0%, #168AAD 100%)",
    boxShadow: "0 10px 24px rgba(22,138,173,.28)",
  },
};

// ======================================================
// Small icon badge — replaces Avatar usage everywhere
// ======================================================

export const iconBadgeSx = (size = 44) => ({
  width: size,
  height: size,
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: COLORS.primary,
  background:
    "linear-gradient(135deg, rgba(22,138,173,.13), rgba(34,184,207,.05))",
  border: `1px solid ${COLORS.border}`,
  boxShadow: "0 6px 16px rgba(22,138,173,.08)",
  flexShrink: 0,
});
