// src/layouts/AuthLayout.jsx
// Premium Smart Retail authentication shell
// Visual/UI layer only — routing, <Outlet />, and backend logic unchanged.

import { Outlet } from "react-router-dom";

import {
  Avatar,
  Box,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import logo from "../assets/images/logo.png";
import banner from "../assets/images/login-banner.png";

/* ============================================================
   PREMIUM LIGHT PALETTE
   ============================================================ */

const COLORS = {
  sea50: "#F4FBFD",
  sea75: "#ECF8FB",
  sea100: "#E2F3F8",
  sea200: "#C8E8F1",
  sea300: "#9ED7E5",
  sea400: "#67BDD4",

  ocean500: "#238FB8",
  ocean600: "#18789E",
  ocean700: "#105D7D",
  ocean800: "#0A4862",

  ink: "#102A35",
  slate: "#607985",
  muted: "#8297A0",

  white: "#FFFFFF",

  sand50: "#FCF8F1",
  sand100: "#F7EFE1",
  sand200: "#EFDDBF",
  sand300: "#D9AD6C",

  green: "#35A56A",
};

/* ============================================================
   SMALL CONTENT
   ============================================================ */

const CHIPS = [
  "Demand Forecasting",
  "Inventory AI",
  "Sales Insights",
];

const FEATURES = [
  {
    icon: <Inventory2RoundedIcon />,
    title: "Smart Inventory",
    desc: "Stock visibility",
    tone: COLORS.ocean500,
  },
  {
    icon: <AutoGraphRoundedIcon />,
    title: "AI Forecasting",
    desc: "Predict demand",
    tone: COLORS.ocean600,
  },
  {
    icon: <TrendingUpRoundedIcon />,
    title: "Sales Analytics",
    desc: "Track performance",
    tone: COLORS.sand300,
  },
  {
    icon: <ShieldOutlinedIcon />,
    title: "Secure Platform",
    desc: "Protected access",
    tone: "#4D91A8",
  },
];

/* ============================================================
   ANIMATIONS
   ============================================================ */

const KEYFRAMES = `
  @keyframes srBackgroundZoom {
    0% {
      transform: scale(1.02);
    }

    100% {
      transform: scale(1.09);
    }
  }

  @keyframes srBlobOne {
    0%,
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }

    50% {
      transform: translate3d(55px, 28px, 0) scale(1.08);
    }
  }

  @keyframes srBlobTwo {
    0%,
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }

    50% {
      transform: translate3d(-40px, -35px, 0) scale(1.07);
    }
  }

  @keyframes srBlobThree {
    0%,
    100% {
      transform: translate3d(0, 0, 0);
    }

    50% {
      transform: translate3d(30px, -25px, 0);
    }
  }

  @keyframes srFadeLeft {
    from {
      opacity: 0;
      transform: translate3d(-28px, 0, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes srFadeRight {
    from {
      opacity: 0;
      transform: translate3d(28px, 0, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes srFadeUp {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes srLogoFloat {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }

    50% {
      transform: translateY(-5px) rotate(1deg);
    }
  }

  @keyframes srRingRotate {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @keyframes srRingRotateReverse {
    from {
      transform: rotate(360deg);
    }

    to {
      transform: rotate(0deg);
    }
  }

  @keyframes srOrbit {
    from {
      transform: rotate(0deg) translateX(30px) rotate(0deg);
    }

    to {
      transform: rotate(360deg) translateX(30px) rotate(-360deg);
    }
  }

  @keyframes srPulse {
    0%,
    100% {
      opacity: 0.55;
      transform: scale(0.92);
    }

    50% {
      opacity: 1;
      transform: scale(1.15);
    }
  }

  @keyframes srShimmer {
    0% {
      transform: translateX(-120%);
    }

    100% {
      transform: translateX(120%);
    }
  }

  @keyframes srWave {
    0%,
    100% {
      transform: translateX(0) translateY(0);
    }

    50% {
      transform: translateX(-12px) translateY(-4px);
    }
  }

  @keyframes srCardGlow {
    0%,
    100% {
      opacity: 0.55;
    }

    50% {
      opacity: 0.9;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
    }
  }
`;

/* ============================================================
   ANIMATED BRAND MARK
   ============================================================ */

function BrandMark({ size = 64 }) {
  const logoSize = size - 12;

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "srLogoFloat 4.8s ease-in-out infinite",
      }}
    >
      {/* Soft halo */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: -8,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(35,143,184,0.18), rgba(35,143,184,0.04) 52%, transparent 72%)",
          filter: "blur(4px)",
          animation: "srPulse 3.5s ease-in-out infinite",
        }}
      />

      {/* Main rotating ring */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          padding: "2px",
          background:
            "conic-gradient(from 0deg, #238FB8, #67BDD4, #D9AD6C, #F7EFE1, #238FB8)",
          animation: "srRingRotate 7s linear infinite",
          boxShadow:
            "0 8px 28px rgba(16,93,125,0.16)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.82)",
          }}
        />
      </Box>

      {/* Inner reverse ring */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 5,
          borderRadius: "50%",
          border: "1px dashed rgba(35,143,184,0.32)",
          animation:
            "srRingRotateReverse 11s linear infinite",
        }}
      />

      {/* Orbiting accent */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 3,
          borderRadius: "50%",
          animation: "srOrbit 4.8s linear infinite",
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: COLORS.sand300,
            boxShadow:
              "0 0 0 4px rgba(217,173,108,0.14)",
          }}
        />
      </Box>

      {/* Actual logo */}
      <Avatar
        src={logo}
        alt="Smart Retail"
        imgProps={{
          draggable: false,
        }}
        sx={{
          position: "relative",
          zIndex: 3,
          width: logoSize,
          height: logoSize,
          borderRadius: "16px",
          bgcolor: COLORS.white,
          border: "3px solid rgba(255,255,255,0.96)",
          boxShadow:
            "0 8px 22px rgba(16,93,125,0.18)",
          transition:
            "transform 0.35s ease, box-shadow 0.35s ease",
          "&:hover": {
            transform: "scale(1.07) rotate(-4deg)",
            boxShadow:
              "0 14px 32px rgba(16,93,125,0.25)",
          },
        }}
      />
    </Box>
  );
}

/* ============================================================
   FEATURE CARD
   ============================================================ */

function FeatureCard({ feature, index }) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: 94,
        p: { xs: 1.45, lg: 1.6 },
        borderRadius: "16px",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.88), rgba(246,251,252,0.68))",
        border:
          "1px solid rgba(156,207,220,0.46)",
        boxShadow:
          "0 7px 22px rgba(15,81,103,0.055)",
        backdropFilter: "blur(12px)",
        animation: `srFadeUp 0.65s ease ${0.15 + index * 0.08}s both`,
        transition:
          "transform 0.3s cubic-bezier(.2,.8,.2,1), box-shadow 0.3s ease, border-color 0.3s ease",
        cursor: "default",

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(103,189,212,0.7), transparent)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        },

        "&:hover": {
          transform: "translateY(-5px)",
          borderColor:
            "rgba(103,189,212,0.72)",
          boxShadow:
            "0 16px 32px rgba(15,81,103,0.12)",
        },

        "&:hover::before": {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          mb: 1,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: `${feature.tone}12`,
          color: feature.tone,
          transition: "transform 0.3s ease",
          ".MuiBox-root:hover &": {
            transform: "scale(1.08) rotate(-4deg)",
          },
        }}
      >
        {feature.icon}
      </Box>

      <Typography
        sx={{
          color: COLORS.ink,
          fontWeight: 800,
          fontSize: "0.78rem",
          lineHeight: 1.2,
          mb: 0.35,
        }}
      >
        {feature.title}
      </Typography>

      <Typography
        sx={{
          color: COLORS.slate,
          fontSize: "0.67rem",
          lineHeight: 1.35,
        }}
      >
        {feature.desc}
      </Typography>
    </Box>
  );
}

/* ============================================================
   MAIN AUTH LAYOUT
   ============================================================ */

export default function AuthLayout() {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  return (
    <>
      <style>{KEYFRAMES}</style>

      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          width: "100%",
          overflow: "hidden",
          bgcolor: COLORS.sea50,
          color: COLORS.ink,
          display: "flex",
          alignItems: "stretch",
          isolation: "isolate",
        }}
      >
        {/* ==================================================
            BACKGROUND IMAGE
            ================================================== */}

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: -5,
            backgroundImage: `url(${banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: "scale(1.03)",
            filter: "blur(3px) saturate(0.72)",
            opacity: { xs: 0.16, md: 0.23 },
            animation:
              "srBackgroundZoom 24s ease-in-out infinite alternate",
          }}
        />

        {/* ==================================================
            LIGHT PREMIUM OVERLAY
            ================================================== */}

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: -4,
            background: `
              linear-gradient(
                135deg,
                rgba(244,251,253,0.98) 0%,
                rgba(236,248,251,0.94) 43%,
                rgba(252,248,241,0.91) 100%
              )
            `,
          }}
        />

        {/* ==================================================
            SOFT BACKGROUND GRID
            ================================================== */}

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: -3,
            opacity: 0.35,
            backgroundImage: `
              linear-gradient(
                rgba(35,143,184,0.035) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(35,143,184,0.035) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "42px 42px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 82%)",
          }}
        />

        {/* ==================================================
            AMBIENT SEA GLOW
            ================================================== */}

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: "-13%",
            left: "-8%",
            width: { xs: 240, md: 390 },
            height: { xs: 240, md: 390 },
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(103,189,212,0.34), rgba(103,189,212,0.07) 48%, transparent 72%)",
            filter: "blur(35px)",
            animation:
              "srBlobOne 15s ease-in-out infinite alternate",
            pointerEvents: "none",
            zIndex: -2,
          }}
        />

        {/* ==================================================
            AMBIENT SAND GLOW
            ================================================== */}

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            right: "-10%",
            bottom: "-18%",
            width: { xs: 280, md: 470 },
            height: { xs: 280, md: 470 },
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(217,173,108,0.23), rgba(247,239,225,0.1) 48%, transparent 72%)",
            filter: "blur(48px)",
            animation:
              "srBlobTwo 18s ease-in-out infinite alternate",
            pointerEvents: "none",
            zIndex: -2,
          }}
        />

        {/* ==================================================
            SMALL SEA GLOW
            ================================================== */}

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            right: "25%",
            top: "-14%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(35,143,184,0.10), transparent 68%)",
            filter: "blur(25px)",
            animation:
              "srBlobThree 12s ease-in-out infinite alternate",
            pointerEvents: "none",
            zIndex: -2,
          }}
        />

        {/* ==================================================
            CONTENT
            ================================================== */}

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            minHeight: "100vh",

            display: "flex",
            alignItems: "center",

            px: {
              xs: 1.5,
              sm: 3,
              md: 5,
              lg: 7,
              xl: 10,
            },

            py: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
            },

            gap: {
              md: 5,
              lg: 7,
              xl: 10,
            },
          }}
        >
          {/* ==================================================
              LEFT HERO
              ================================================== */}

          {!isMobile && (
            <Box
              sx={{
                flex: "1 1 0",
                minWidth: 0,
                maxWidth: 660,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                animation:
                  "srFadeLeft 0.8s cubic-bezier(.2,.8,.2,1) both",
              }}
            >
              {/* BRAND HEADER */}

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  mb: { md: 2.5, lg: 3 },
                }}
              >
                <BrandMark size={58} />

                <Box>
                  <Typography
                    sx={{
                      color: COLORS.ink,
                      fontWeight: 900,
                      fontSize: {
                        md: "1.2rem",
                        lg: "1.28rem",
                      },
                      letterSpacing: "-0.035em",
                      lineHeight: 1.05,
                    }}
                  >
                    Smart Retail
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.45,
                      color: COLORS.slate,
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      letterSpacing: "0.01em",
                    }}
                  >
                    AI Retail Intelligence
                  </Typography>
                </Box>
              </Stack>

              {/* EYEBROW */}

              <Stack
                direction="row"
                spacing={0.8}
                alignItems="center"
                sx={{
                  mb: 1.1,
                  animation:
                    "srFadeUp 0.7s ease 0.08s both",
                }}
              >
                <AutoAwesomeRoundedIcon
                  sx={{
                    fontSize: 15,
                    color: COLORS.ocean500,
                  }}
                />

                <Typography
                  sx={{
                    color: COLORS.ocean600,
                    fontWeight: 800,
                    fontSize: "0.68rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Smarter retail starts here
                </Typography>
              </Stack>

              {/* HERO HEADING */}

              <Typography
                component="h1"
                sx={{
                  color: COLORS.ink,
                  fontWeight: 900,
                  lineHeight: 1.02,
                  letterSpacing: "-0.055em",

                  fontSize: {
                    md: "2.35rem",
                    lg: "2.85rem",
                    xl: "3.25rem",
                  },

                  maxWidth: 620,
                  mb: 1.4,

                  animation:
                    "srFadeUp 0.7s ease 0.15s both",
                }}
              >
                Retail intelligence
                <br />

                <Box
                  component="span"
                  sx={{
                    background:
                      "linear-gradient(100deg, #18789E 5%, #238FB8 48%, #C8954E 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  powered by AI.
                </Box>
              </Typography>

              {/* SUBTITLE */}

              <Typography
                sx={{
                  color: COLORS.slate,
                  fontSize: {
                    md: "0.84rem",
                    lg: "0.9rem",
                  },
                  lineHeight: 1.55,
                  maxWidth: 480,
                  mb: 2.1,

                  animation:
                    "srFadeUp 0.7s ease 0.22s both",
                }}
              >
                Forecast demand, optimize inventory, and understand
                sales — from one intelligent workspace.
              </Typography>

              {/* CHIPS */}

              <Stack
                direction="row"
                spacing={0.8}
                flexWrap="wrap"
                useFlexGap
                sx={{
                  mb: { md: 2.1, lg: 2.4 },
                  animation:
                    "srFadeUp 0.7s ease 0.3s both",
                }}
              >
                {CHIPS.map((chip) => (
                  <Chip
                    key={chip}
                    label={chip}
                    size="small"
                    sx={{
                      height: 26,
                      px: 0.25,
                      color: COLORS.ocean700,
                      bgcolor:
                        "rgba(255,255,255,0.72)",
                      border:
                        "1px solid rgba(103,189,212,0.35)",
                      backdropFilter: "blur(8px)",
                      fontSize: "0.65rem",
                      fontWeight: 700,

                      transition:
                        "all 0.25s ease",

                      "& .MuiChip-label": {
                        px: 1,
                      },

                      "&:hover": {
                        bgcolor: COLORS.white,
                        transform:
                          "translateY(-2px)",
                        borderColor:
                          "rgba(35,143,184,0.5)",
                        boxShadow:
                          "0 7px 16px rgba(35,143,184,0.12)",
                      },
                    }}
                  />
                ))}
              </Stack>

              {/* FEATURES */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 1.15,
                  maxWidth: 520,
                }}
              >
                {FEATURES.map((feature, index) => (
                  <FeatureCard
                    key={feature.title}
                    feature={feature}
                    index={index}
                  />
                ))}
              </Box>

              {/* STATUS */}

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  mt: 1.8,
                  animation:
                    "srFadeUp 0.7s ease 0.55s both",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 8,
                    height: 8,
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      bgcolor: COLORS.green,
                      animation:
                        "srPulse 2.4s ease-in-out infinite",
                    }}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      inset: 2,
                      borderRadius: "50%",
                      bgcolor: "#FFFFFF",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    color: COLORS.slate,
                    fontSize: "0.66rem",
                    fontWeight: 600,
                  }}
                >
                  Platform operational
                </Typography>

                <Box
                  sx={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    bgcolor: COLORS.muted,
                  }}
                />

                <Typography
                  sx={{
                    color: COLORS.muted,
                    fontSize: "0.64rem",
                  }}
                >
                  Secure access
                </Typography>
              </Stack>
            </Box>
          )}

          {/* ==================================================
              RIGHT AUTH AREA
              ================================================== */}

          <Box
            sx={{
              flex: {
                xs: "1 1 auto",
                md: "0 0 auto",
              },

              width: {
                xs: "100%",
                sm: "100%",
                md: 430,
                lg: 450,
                xl: 470,
              },

              minWidth: 0,

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",

              minHeight: {
                xs: "100vh",
                md: "auto",
              },

              animation:
                "srFadeRight 0.8s cubic-bezier(.2,.8,.2,1) both",
            }}
          >
            {/* AUTH CARD WRAPPER */}

            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: {
                  xs: 420,
                  sm: 440,
                  md: 450,
                  lg: 460,
                },
              }}
            >
              {/* CARD AMBIENT GLOW */}

              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: -24,
                  borderRadius: "36px",
                  background: `
                    radial-gradient(
                      circle at 20% 15%,
                      rgba(35,143,184,0.17),
                      transparent 48%
                    ),
                    radial-gradient(
                      circle at 85% 85%,
                      rgba(217,173,108,0.13),
                      transparent 50%
                    )
                  `,
                  filter: "blur(25px)",
                  animation:
                    "srCardGlow 4.5s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />

              {/* OUTLET CONTAINER */}

              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,

                  width: "100%",

                  /* Makes existing Login/Register cards
                     visually align with this shell. */

                  "& > .MuiBox-root, & > .MuiPaper-root": {
                    width: "100%",
                    borderRadius:
                      "22px !important",
                  },

                  /* Existing auth page card polish */

                  "& .MuiPaper-root": {
                    background:
                      "rgba(255,255,255,0.91)",
                    backdropFilter:
                      "blur(18px)",
                    WebkitBackdropFilter:
                      "blur(18px)",
                    border:
                      "1px solid rgba(255,255,255,0.86)",
                    boxShadow:
                      "0 22px 65px rgba(15,75,94,0.13), 0 4px 18px rgba(15,75,94,0.05)",
                  },

                  /* Better input interaction */

                  "& .MuiOutlinedInput-root": {
                    transition:
                      "all 0.22s ease",
                  },

                  "& .MuiOutlinedInput-root:hover": {
                    borderColor:
                      "rgba(35,143,184,0.42)",
                  },

                  "& .MuiOutlinedInput-root.Mui-focused": {
                    boxShadow:
                      "0 0 0 4px rgba(35,143,184,0.09)",
                  },

                  /* Button polish without changing logic */

                  "& .MuiButton-root": {
                    transition:
                      "transform 0.22s ease, box-shadow 0.22s ease, background-color 0.22s ease",
                  },

                  "& .MuiButton-root:hover": {
                    transform:
                      "translateY(-2px)",
                    boxShadow:
                      "0 10px 24px rgba(35,143,184,0.18)",
                  },
                }}
              >
                <Outlet />
              </Box>
            </Box>

            {/* ==================================================
                MOBILE BRANDING
                ================================================== */}

            {isMobile && (
              <Box
                sx={{
                  mt: 2,
                  width: "100%",
                  textAlign: "center",
                  animation:
                    "srFadeUp 0.75s ease 0.2s both",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.15}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ mb: 0.6 }}
                >
                  <BrandMark size={40} />

                  <Typography
                    sx={{
                      color: COLORS.ink,
                      fontWeight: 900,
                      fontSize: "0.95rem",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    Smart Retail
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    color: COLORS.slate,
                    fontSize: "0.65rem",
                    fontWeight: 500,
                  }}
                >
                  AI-powered retail intelligence
                </Typography>
              </Box>
            )}

            {/* ==================================================
                FOOTER
                ================================================== */}

            <Typography
              sx={{
                mt: { xs: 1, md: 1.2 },
                color: COLORS.muted,
                fontSize: "0.58rem",
                fontWeight: 500,
                textAlign: "center",
                letterSpacing: "0.025em",
                opacity: 0.85,
              }}
            >
              © {new Date().getFullYear()} Smart Retail Intelligence
              Platform
            </Typography>
          </Box>
        </Box>

        {/* ==================================================
            DECORATIVE BOTTOM WAVE
            ================================================== */}

        {!isMobile && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              left: "-5%",
              right: "-5%",
              bottom: -52,
              height: 110,
              borderRadius: "50% 50% 0 0",
              background:
                "linear-gradient(180deg, rgba(200,232,241,0.18), rgba(247,239,225,0.18))",
              filter: "blur(2px)",
              animation:
                "srWave 8s ease-in-out infinite",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}
      </Box>
    </>
  );
}
