// src/layouts/AuthLayout.jsx
// Premium auth layout — light "sea water" theme (no dark mode).
// Left hero panel (desktop), right card panel with <Outlet /> for
// Login / Register / ForgotPassword. Mobile: full-screen card with
// compact branding below. All animations are CSS-only.
// Structure, routing, and logic unchanged — visuals only.

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

import TrendingUpRoundedIcon  from "@mui/icons-material/TrendingUpRounded";
import Inventory2RoundedIcon  from "@mui/icons-material/Inventory2Rounded";
import AutoGraphRoundedIcon   from "@mui/icons-material/AutoGraphRounded";
import ShieldOutlinedIcon     from "@mui/icons-material/ShieldOutlined";

import logo   from "../assets/images/logo.png";
import banner from "../assets/images/login-banner.png";

/* ─── Palette — "sea water" theme (shared with Login) ───────
   sea-50  #F2FAFC   ocean-500 #1F8FBE   sand-100 #F7F0E3
   sea-100 #E3F4F9   ocean-600 #14739A   sand-300 #D9A45B
   sea-200 #C7E9F2   ocean-700 #0E5A78   ink      #10222B
   sea-400 #6FC3DE                       slate    #5B7481
──────────────────────────────────────────────────────────── */

const CHIPS = ["Demand Forecasting", "Inventory AI", "Sales Insights"];

const FEATURES = [
  {
    icon : <Inventory2RoundedIcon sx={{ fontSize: 24, color: "#1F8FBE" }} />,
    title: "Smart Inventory",
    desc : "Real-time stock alerts",
  },
  {
    icon : <AutoGraphRoundedIcon sx={{ fontSize: 24, color: "#14739A" }} />,
    title: "AI Forecasting",
    desc : "Predict demand early",
  },
  {
    icon : <TrendingUpRoundedIcon sx={{ fontSize: 24, color: "#C98A3B" }} />,
    title: "Sales Analytics",
    desc : "Revenue at a glance",
  },
  {
    icon : <ShieldOutlinedIcon sx={{ fontSize: 24, color: "#4C8FA6" }} />,
    title: "Secure Platform",
    desc : "Enterprise-grade security",
  },
];

/* ─── Keyframes injected once ────────────────────────────── */
const KF = `
  @keyframes srHeroZoom {
    from { transform: scale(1.03); }
    to   { transform: scale(1.1); }
  }
  @keyframes srFloat1 {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(40px,32px) scale(1.08); }
  }
  @keyframes srFloat2 {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(-38px,-26px) scale(1.06); }
  }
  @keyframes srFadeLeft {
    from { opacity:0; transform:translateX(-24px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes srFadeRight {
    from { opacity:0; transform:translateX(28px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes srFadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes srPulse {
    0%,100% { opacity:0.65; }
    50%      { opacity:1; }
  }
  @keyframes srRingRotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes srLogoFloat {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-4px); }
  }
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; }
  }
`;

/* Reusable animated brand mark (rotating sea-to-sand ring + float) */
function BrandMark({ size = 62 }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "srLogoFloat 4.5s ease-in-out infinite",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "conic-gradient(from 0deg, #1F8FBE, #6FC3DE, #D9A45B, #1F8FBE)",
          animation: "srRingRotate 7s linear infinite",
          opacity: 0.9,
        }}
      />
      <Avatar
        src={logo}
        alt="Smart Retail"
        sx={{
          width: size - 10,
          height: size - 10,
          borderRadius: "12px",
          border: "3px solid #ffffff",
          boxShadow: "0 8px 20px rgba(14, 90, 120, 0.2)",
        }}
      />
    </Box>
  );
}

export default function AuthLayout() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {/* Inject keyframes once */}
      <style>{KF}</style>

      <Box
        sx={{
          position : "relative",
          minHeight: "100vh",
          overflow : "hidden",
          bgcolor  : "#F2FAFC",
          display  : "flex",
          alignItems: "stretch",
        }}
      >

        {/* ══════════════════════════════════════════
            BACKGROUND LAYER — light sea wash
        ═══════════════════════════════════════════ */}
        <Box sx={{
          position          : "absolute", inset: 0,
          backgroundImage   : `url(${banner})`,
          backgroundSize    : "cover",
          backgroundPosition: "center",
          backgroundRepeat  : "no-repeat",
          transform         : "scale(1.03)",
          filter            : "blur(4px) saturate(0.9)",
          opacity           : 0.35,
          animation         : "srHeroZoom 24s ease-in-out infinite alternate",
        }} />

        {/* Light gradient overlay */}
        <Box sx={{
          position: "absolute", inset: 0,
          background: `linear-gradient(
            150deg,
            rgba(242,250,252,0.96) 0%,
            rgba(227,244,249,0.93) 45%,
            rgba(247,240,227,0.90) 100%
          )`,
        }} />

        {/* Ambient glow — top-left (sea) */}
        <Box sx={{
          position    : "absolute", top: "-10%", left: "-8%",
          width       : 340, height: 340, borderRadius: "50%",
          background  : "radial-gradient(circle, rgba(111,195,222,0.45), transparent 70%)",
          filter      : "blur(50px)",
          animation   : "srFloat1 15s ease-in-out infinite alternate",
          pointerEvents: "none",
        }} />

        {/* Ambient glow — bottom-right (sand) */}
        <Box sx={{
          position    : "absolute", bottom: "-12%", right: "-8%",
          width       : 420, height: 420, borderRadius: "50%",
          background  : "radial-gradient(circle, rgba(217,164,91,0.28), transparent 70%)",
          filter      : "blur(60px)",
          animation   : "srFloat2 18s ease-in-out infinite alternate",
          pointerEvents: "none",
        }} />

        {/* ══════════════════════════════════════════
            CONTENT ROW
        ═══════════════════════════════════════════ */}
        <Box
          sx={{
            position      : "relative",
            zIndex        : 5,
            display       : "flex",
            width         : "100%",
            minHeight     : "100vh",
            alignItems    : "center",
            px: { xs: 2, sm: 3, md: 5, lg: 8, xl: 10 },
            py: { xs: 2.5, md: 3 },
            gap: { md: 6, lg: 10, xl: 14 },
          }}
        >

          {/* ════════════════════════════════════════
              LEFT HERO PANEL — desktop only
          ═════════════════════════════════════════ */}
          {!isMobile && (
            <Box
              sx={{
                flex            : 1.1,
                maxWidth        : 640,
                animation       : "srFadeLeft 0.8s ease both",
                display         : "flex",
                flexDirection   : "column",
                justifyContent  : "center",
              }}
            >
              {/* Brand */}
              <Stack direction="row" spacing={1.75} alignItems="center" mb={3}>
                <BrandMark size={58} />
                <Box>
                  <Typography sx={{ color: "#10222B", fontWeight: 800, fontSize: "1.35rem", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    Smart Retail
                  </Typography>
                  <Typography sx={{ color: "#5B7481", fontSize: "0.78rem", mt: 0.3 }}>
                    AI Inventory & Retail Intelligence
                  </Typography>
                </Box>
              </Stack>

              {/* Hero heading — concise */}
              <Typography
                sx={{
                  color       : "#10222B",
                  fontWeight  : 900,
                  lineHeight  : 1.08,
                  letterSpacing: "-1.2px",
                  mb          : 1.75,
                  fontSize    : { md: "2.2rem", lg: "2.7rem", xl: "3rem" },
                }}
              >
                Retail intelligence,
                <br />
                <Box component="span" sx={{
                  background: "linear-gradient(90deg,#1F8FBE,#D9A45B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor : "transparent",
                }}>
                  powered by AI
                </Box>
              </Typography>

              {/* Subtitle — one line, concise */}
              <Typography
                sx={{
                  color     : "#5B7481",
                  fontSize  : { md: "0.9rem", lg: "0.98rem" },
                  lineHeight: 1.6,
                  maxWidth  : 460,
                  mb        : 2.5,
                }}
              >
                Forecast demand, optimize stock, and grow smarter — all in one place.
              </Typography>

              {/* Chips */}
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={3}>
                {CHIPS.map((c) => (
                  <Chip
                    key={c} label={c} size="small"
                    sx={{
                      color      : "#0E5A78",
                      fontWeight : 600,
                      fontSize   : "0.72rem",
                      height     : 27,
                      bgcolor    : "rgba(31,143,190,0.08)",
                      border     : "1px solid rgba(31,143,190,0.22)",
                      transition : "all 0.25s ease",
                      "&:hover"  : {
                        bgcolor  : "rgba(31,143,190,0.14)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 14px rgba(31,143,190,0.18)",
                      },
                    }}
                  />
                ))}
              </Stack>

              {/* Feature cards — 2×2 grid, compact */}
              <Box
                sx={{
                  display            : "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap                : 1.5,
                  maxWidth           : 500,
                }}
              >
                {FEATURES.map((f) => (
                  <Box
                    key={f.title}
                    sx={{
                      p           : 1.75,
                      borderRadius: "14px",
                      background  : "rgba(255,255,255,0.65)",
                      border      : "1px solid #C7E9F2",
                      backdropFilter: "blur(10px)",
                      transition  : "all 0.25s ease",
                      "&:hover"   : {
                        background : "rgba(255,255,255,0.9)",
                        transform  : "translateY(-3px)",
                        boxShadow  : "0 12px 26px rgba(14,90,120,0.12)",
                        borderColor: "#6FC3DE",
                      },
                    }}
                  >
                    <Box sx={{ mb: 0.75 }}>{f.icon}</Box>
                    <Typography sx={{ color: "#10222B", fontWeight: 700, fontSize: "0.82rem", mb: 0.25 }}>
                      {f.title}
                    </Typography>
                    <Typography sx={{ color: "#5B7481", fontSize: "0.72rem", lineHeight: 1.4 }}>
                      {f.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Status strip */}
              <Stack direction="row" spacing={1.5} alignItems="center" mt={3}>
                <Box sx={{
                  display: "flex", alignItems: "center", gap: 0.6,
                  animation: "srPulse 2.5s ease infinite",
                }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#3FAE6B" }} />
                  <Typography sx={{ color: "#5B7481", fontSize: "0.72rem" }}>
                    All systems operational
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          {/* ════════════════════════════════════════
              RIGHT — Auth Card (<Outlet />)
          ═════════════════════════════════════════ */}
          <Box
            sx={{
              flex           : { xs: "1 1 auto", md: "0 0 auto" },
              width: { xs: "100%", md: 460, lg: 480 },
              display        : "flex",
              flexDirection  : "column",
              alignItems     : "center",
              justifyContent : "center",
              animation      : "srFadeRight 0.75s ease both",
              minHeight      : { xs: "100vh", md: "auto" },
            }}
          >
            {/* Glow halo behind card */}
            <Box sx={{
              position    : "relative",
              width       : "100%",
              maxWidth: { xs: 420, sm: 460, md: 480, lg: 500 },
            }}>
              <Box sx={{
                position    : "absolute",
                inset       : -18,
                borderRadius: "32px",
                background  : `
                  radial-gradient(circle at 30% 20%, rgba(31,143,190,0.14), transparent 55%),
                  radial-gradient(circle at 70% 80%, rgba(217,164,91,0.12), transparent 55%)
                `,
                filter      : "blur(30px)",
                zIndex      : 0,
                pointerEvents: "none",
              }} />

              {/* Card shell — the child Login/Register Paper already carries
                  its own glass styling; this just keeps corners/shadow aligned */}
              <Box
                sx={{
                  position: "relative",
                  zIndex  : 1,
                  "& > .MuiBox-root, & > .MuiPaper-root": {
                    width           : "100%",
                    borderRadius    : "20px !important",
                  },
                }}
              >
                <Outlet />
              </Box>
            </Box>

            {/* Mobile branding — below card, compact */}
            {isMobile && (
              <Box
                sx={{
                  mt       : 3,
                  textAlign: "center",
                  animation: "srFadeUp 0.75s ease both",
                  px       : 2,
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="center" mb={1}>
                  <BrandMark size={42} />
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#10222B" }}>
                    Smart Retail
                  </Typography>
                </Stack>
                <Typography sx={{ color: "#5B7481", fontSize: "0.78rem", lineHeight: 1.5, maxWidth: 300, mx: "auto" }}>
                  AI-powered inventory, forecasting and analytics.
                </Typography>
              </Box>
            )}

            {/* Footer */}
            <Typography
              sx={{
                mt       : 2,
                color    : "#8CA0AA",
                fontSize : "0.68rem",
                textAlign: "center",
                letterSpacing: "0.3px",
              }}
            >
              © {new Date().getFullYear()} Smart Retail Intelligence Platform
            </Typography>
          </Box>

        </Box>
      </Box>
    </>
  );
}
