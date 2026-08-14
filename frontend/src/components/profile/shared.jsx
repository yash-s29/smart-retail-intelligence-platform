// src/components/profile/shared.jsx
//
// Shared visual language for the profile page cards: one card
// surface, one section heading, one info-row pattern. Keeping
// these in a single place is what makes 8 different cards read
// as one coherent product instead of 8 separate experiments.

import React from "react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

/* ============================================================
   Design tokens — the sea-water blue / white / sand palette,
   defined right here so no separate "theme" folder is needed.
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

export const RADIUS = "16px";

/* ============================================================
   Motion
============================================================ */

export const reduceMotion = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none !important",
    transition: "none !important",
  },
};

export const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 16, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
  },
});

/* ============================================================
   Card surface — every card on the profile page uses this
============================================================ */

export const cardSx = {
  borderRadius: RADIUS,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.white,
  boxShadow: "0 1px 2px rgba(16,77,96,.04)",
  transition: "box-shadow .22s ease, border-color .22s ease, transform .22s ease",
  height: "100%",

  "&:hover": {
    borderColor: alpha(COLORS.primary, 0.22),
    boxShadow: "0 14px 32px rgba(16,77,96,.09)",
    transform: "translateY(-3px)",
  },

  ...reduceMotion,
};

export const cardPad = {
  p: { xs: 2, sm: 2.5 },
  "&:last-child": { pb: { xs: 2, sm: 2.5 } },
};

/* ============================================================
   Section heading — icon fixed to one corner, label beside it.
   No filler description line by default (keeps pages concise).
============================================================ */

export function SectionHeading({ icon: Icon, label, action, tone = COLORS.primary }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1.5}
      sx={{ pb: 1.5, mb: 1.75, borderBottom: `1px solid ${COLORS.border}` }}
    >
      <Stack direction="row" spacing={1.1} alignItems="center" minWidth={0}>
        <Avatar
          sx={{
            width: 34,
            height: 34,
            flexShrink: 0,
            borderRadius: "10px",
            bgcolor: alpha(tone, 0.1),
            color: tone,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Avatar>

        <Typography
          sx={{
            fontSize: "0.86rem",
            fontWeight: 800,
            color: COLORS.ink,
            letterSpacing: "-.01em",
          }}
        >
          {label}
        </Typography>
      </Stack>

      {action}
    </Stack>
  );
}

/* ============================================================
   Info row — compact label/value pair used by info cards
============================================================ */

export function InfoRow({ label, value }) {
  return (
    <Stack spacing={0.3} minWidth={0}>
      <Typography
        sx={{
          fontSize: ".6rem",
          textTransform: "uppercase",
          letterSpacing: ".08em",
          fontWeight: 700,
          color: COLORS.muted,
        }}
      >
        {label}
      </Typography>

      <Typography
        noWrap
        sx={{
          fontSize: ".78rem",
          fontWeight: 700,
          color: COLORS.ink,
        }}
        title={value || "—"}
      >
        {value || "—"}
      </Typography>
    </Stack>
  );
}

/* ============================================================
   Interactive row — the tappable list-item pattern shared by
   Security and Account Actions cards
============================================================ */

export function ActionRow({ icon: Icon, label, hint, tone = COLORS.primary, onClick, endIcon: EndIcon }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 1.1,

        border: "none",
        borderRadius: "12px",
        bgcolor: "transparent",

        px: 1.1,
        py: 1.05,

        cursor: "pointer",
        textAlign: "left",
        font: "inherit",

        transition: "background .18s ease",

        "&:hover": { bgcolor: alpha(tone, 0.07) },
        "&:hover .action-row-icon": { color: tone, transform: "scale(1.08)" },
        "&:hover .action-row-end": { color: tone, transform: "translateX(3px)" },
        "&:focus-visible": { outline: `2px solid ${tone}`, outlineOffset: 2 },

        ...reduceMotion,
      }}
    >
      <Box
        className="action-row-icon"
        sx={{
          width: 34,
          height: 34,
          flexShrink: 0,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(tone, 0.08),
          color: tone,
          transition: "transform .18s ease, color .18s ease",
        }}
      >
        <Icon sx={{ fontSize: 17 }} />
      </Box>

      <Box flex={1} minWidth={0}>
        <Typography sx={{ fontSize: ".78rem", fontWeight: 700, color: COLORS.ink }}>
          {label}
        </Typography>
        {hint && (
          <Typography sx={{ fontSize: ".64rem", color: COLORS.slate, mt: 0.1 }} noWrap>
            {hint}
          </Typography>
        )}
      </Box>

      {EndIcon && (
        <EndIcon
          className="action-row-end"
          sx={{ fontSize: 17, color: COLORS.muted, flexShrink: 0, transition: "all .18s ease" }}
        />
      )}
    </Box>
  );
}
