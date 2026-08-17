// src/components/products/shared.jsx
//
// Shared visual language + small pure helpers for the Products
// module. Centralizing fmt/stockStatus/initials here means
// ProductCard and ProductTable can't drift out of sync on how a
// "Low Stock" vs "Critical" threshold is decided.

import { alpha } from "@mui/material/styles";

/* ============================================================
   Palette — same sea-water blue / white / sand system used on
   Dashboard, Profile, and Settings.
============================================================ */

export const COLORS = {
  primary: "#18799F",
  primaryDark: "#105D7D",
  primaryDeep: "#0B4D67",

  aqua: "#67BDD4",
  aquaSoft: "#E8F7FA",
  aquaPale: "#F5FBFC",

  sand: "#C9A46A",
  sandSoft: "#F6EFE2",

  ink: "#12313D",
  slate: "#607984",
  muted: "#8BA0A8",

  white: "#FFFFFF",

  success: "#299A66",
  successSoft: "#EAF8F1",

  warning: "#C98221",
  warningSoft: "#FFF6E8",

  danger: "#D65B5B",
  dangerSoft: "#FCEEEE",

  border: "#E1EEF2",
};

export const RADIUS = "14px";

/* ============================================================
   Formatting / status helpers (unchanged logic, just centralized)
============================================================ */

export const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n ?? 0);

export function stockStatus(p) {
  const stock = p.current_stock ?? 0;
  const reorder = p.reorder_level ?? 10;
  const safety = p.safety_stock ?? 20;
  if (stock === 0) return { label: "Out of Stock", tone: "danger" };
  if (stock <= reorder) return { label: "Critical", tone: "danger" };
  if (stock <= safety) return { label: "Low Stock", tone: "warning" };
  return { label: "In Stock", tone: "success" };
}

export function calcMargin(p) {
  if (!p.selling_price || p.selling_price <= 0) return null;
  return ((p.selling_price - p.cost_price) / p.selling_price) * 100;
}

export function marginTone(marginPct) {
  if (marginPct == null) return "muted";
  if (marginPct >= 20) return "success";
  if (marginPct >= 10) return "warning";
  return "danger";
}

export function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

/* ============================================================
   Tone → color lookup, used for chips/icons/text
============================================================ */

export function tone(name) {
  const map = {
    success: COLORS.success,
    warning: COLORS.warning,
    danger: COLORS.danger,
    primary: COLORS.primary,
    muted: COLORS.muted,
  };
  return map[name] || COLORS.muted;
}

export function toneSoft(name) {
  const map = {
    success: COLORS.successSoft,
    warning: COLORS.warningSoft,
    danger: COLORS.dangerSoft,
    primary: COLORS.aquaSoft,
    muted: COLORS.aquaPale,
  };
  return map[name] || COLORS.aquaPale;
}

/* ============================================================
   Shared surfaces
============================================================ */

export const cardSx = {
  bgcolor: COLORS.white,
  borderRadius: RADIUS,
  border: `1px solid ${COLORS.border}`,
  transition: "box-shadow .2s ease, border-color .2s ease, transform .2s ease",
  "&:hover": {
    borderColor: alpha(COLORS.primary, 0.22),
    boxShadow: `0 12px 28px ${alpha(COLORS.primary, 0.09)}`,
    transform: "translateY(-2px)",
  },
};

export const reduceMotion = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none !important",
    transition: "none !important",
  },
};
