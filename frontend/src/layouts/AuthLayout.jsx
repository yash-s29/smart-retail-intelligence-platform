// src/layouts/AuthLayout.jsx
// Premium auth layout — animated background, left hero panel (desktop),
// right card panel with <Outlet /> for Login / Register / ForgotPassword.
// Mobile: full-screen card with compact branding below.
// All animations are CSS-only (no framer-motion dependency here).

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

/* ─── Data ───────────────────────────────────────────────── */
const CHIPS = [
  "Demand Forecasting",
  "Inventory Optimization",
  "AI Store Manager",
  "Sales Analytics",
];

const FEATURES = [
  {
    icon : <Inventory2RoundedIcon sx={{ fontSize: 28, color: "#4ade80" }} />,
    title: "Smart Inventory",
    desc : "Real-time stock tracking with auto reorder alerts.",
  },
  {
    icon : <AutoGraphRoundedIcon sx={{ fontSize: 28, color: "#60a5fa" }} />,
    title: "AI Forecasting",
    desc : "Predict demand before it happens with ML models.",
  },
  {
    icon : <TrendingUpRoundedIcon sx={{ fontSize: 28, color: "#fbbf24" }} />,
    title: "Sales Analytics",
    desc : "Visual dashboards for revenue and profit insights.",
  },
  {
    icon : <ShieldOutlinedIcon sx={{ fontSize: 28, color: "#a78bfa" }} />,
    title: "Secure Platform",
    desc : "Enterprise-grade security for your store data.",
  },
];

/* ─── Keyframes injected once ────────────────────────────── */
const KF = `
  @keyframes srHeroZoom {
    from { transform: scale(1.05); }
    to   { transform: scale(1.14); }
  }
  @keyframes srFloat1 {
    from { transform: translate(0,0); }
    to   { transform: translate(55px,45px); }
  }
  @keyframes srFloat2 {
    from { transform: translate(0,0); }
    to   { transform: translate(-55px,-38px); }
  }
  @keyframes srFadeLeft {
    from { opacity:0; transform:translateX(-28px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes srFadeRight {
    from { opacity:0; transform:translateX(32px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes srFadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes srPulse {
    0%,100% { opacity:0.7; }
    50%      { opacity:1; }
  }
`;

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
          bgcolor  : "#050816",
          display  : "flex",
          alignItems: "stretch",
        }}
      >

        {/* ══════════════════════════════════════════
            BACKGROUND LAYER
        ═══════════════════════════════════════════ */}
        {/* Blurred photo */}
        <Box sx={{
          position          : "absolute", inset: 0,
          backgroundImage   : `url(${banner})`,
          backgroundSize    : "cover",
          backgroundPosition: "center",
          backgroundRepeat  : "no-repeat",
          transform         : "scale(1.05)",
          filter            : "blur(3px)",
          animation         : "srHeroZoom 22s ease-in-out infinite alternate",
        }} />

        {/* Dark gradient overlay */}
        <Box sx={{
          position: "absolute", inset: 0,
          background: `linear-gradient(
            135deg,
            rgba(3,7,18,0.94)   0%,
            rgba(15,23,42,0.86) 45%,
            rgba(30,41,59,0.70) 100%
          )`,
        }} />

        {/* Animated glow — top-left */}
        <Box sx={{
          position    : "absolute", top: "-12%", left: "-8%",
          width       : 380, height: 380, borderRadius: "50%",
          background  : "radial-gradient(circle, rgba(59,130,246,0.28), transparent 70%)",
          filter      : "blur(60px)",
          animation   : "srFloat1 14s ease-in-out infinite alternate",
          pointerEvents: "none",
        }} />

        {/* Animated glow — bottom-right */}
        <Box sx={{
          position    : "absolute", bottom: "-14%", right: "-8%",
          width       : 460, height: 460, borderRadius: "50%",
          background  : "radial-gradient(circle, rgba(16,185,129,0.22), transparent 70%)",
          filter      : "blur(70px)",
          animation   : "srFloat2 17s ease-in-out infinite alternate",
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
            px: {
  xs: 2,
  sm: 3,
  md: 6,
  lg: 9,
  xl: 12,
},

py: {
  xs: 3,
  md: 5,
},

gap: {
  md: 10,
  lg: 14,
  xl: 18,
},
          }}
        >

          {/* ════════════════════════════════════════
              LEFT HERO PANEL — desktop only
          ═════════════════════════════════════════ */}
          {!isMobile && (
            <Box
              sx={{
                flex            : 1.2,
                maxWidth        : 720,
                animation       : "srFadeLeft 0.85s ease both",
                display         : "flex",
                flexDirection   : "column",
                justifyContent  : "center",
              }}
            >
              {/* Brand */}
              <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                <Avatar
                  src={logo}
                  alt="Smart Retail"
                  sx={{
                    width       : 62, height: 62,
                    borderRadius: "14px",
                    border      : "2px solid rgba(255,255,255,0.2)",
                    boxShadow   : "0 12px 36px rgba(0,0,0,0.35)",
                  }}
                />
                <Box>
                  <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    Smart Retail
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", mt: 0.3 }}>
                    AI Inventory & Retail Intelligence
                  </Typography>
                </Box>
              </Stack>

              {/* Hero heading */}
              <Typography
                sx={{
                  color       : "#fff",
                  fontWeight  : 900,
                  lineHeight  : 1.06,
                  letterSpacing: "-1.5px",
                  mb          : 2.5,
                  fontSize    : { md: "2.8rem", lg: "3.5rem", xl: "4rem" },
                }}
              >
                AI-Powered
                <br />
                <Box component="span" sx={{
                  background: "linear-gradient(90deg,#60a5fa,#34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor : "transparent",
                }}>
                  Retail Intelligence
                </Box>
                <br />
                For Smarter Growth
              </Typography>

              {/* Subtitle */}
              <Typography
                sx={{
                  color     : "rgba(255,255,255,0.80)",
                  fontSize  : { md: "0.95rem", lg: "1.05rem" },
                  lineHeight: 1.75,
                  maxWidth  : 520,
                  mb        : 3.5,
                }}
              >
                Forecast demand, optimize inventory, monitor sales performance
                and unlock intelligent business decisions with machine learning
                powered insights.
              </Typography>

              {/* Chips */}
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={4}>
                {CHIPS.map((c) => (
                  <Chip
                    key={c} label={c} size="small"
                    sx={{
                      color      : "#fff",
                      fontWeight : 600,
                      fontSize   : "0.75rem",
                      height     : 30,
                      bgcolor    : "rgba(255,255,255,0.08)",
                      border     : "1px solid rgba(255,255,255,0.14)",
                      backdropFilter: "blur(12px)",
                      transition : "all 0.25s ease",
                      "&:hover"  : {
                        bgcolor  : "rgba(255,255,255,0.16)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                      },
                    }}
                  />
                ))}
              </Stack>

              {/* Feature cards — 2×2 grid */}
              <Box
                sx={{
                  display            : "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap                : 2,
                  maxWidth           : 560,
                }}
              >
                {FEATURES.map((f) => (
                  <Box
                    key={f.title}
                    sx={{
                      p           : 2.5,
                      borderRadius: "16px",
                      background  : "rgba(255,255,255,0.06)",
                      border      : "1px solid rgba(255,255,255,0.10)",
                      backdropFilter: "blur(16px)",
                      transition  : "all 0.3s ease",
                      "&:hover"   : {
                        background : "rgba(255,255,255,0.10)",
                        transform  : "translateY(-4px)",
                        boxShadow  : "0 16px 36px rgba(0,0,0,0.22)",
                        borderColor: "rgba(255,255,255,0.18)",
                      },
                    }}
                  >
                    <Box sx={{ mb: 1.5 }}>{f.icon}</Box>
                    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", mb: 0.5 }}>
                      {f.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.78rem", lineHeight: 1.55 }}>
                      {f.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Social proof strip */}
              <Stack direction="row" spacing={3} alignItems="center" mt={4}>
                {[
                 
                ].map(({ val, lbl }) => (
                  <Box key={lbl} textAlign="center">
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.1 }}>
                      {val}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.7rem", mt: 0.3 }}>
                      {lbl}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ height: 28, width: "1px", bgcolor: "rgba(255,255,255,0.15)" }} />
                <Box sx={{
                  display: "flex", alignItems: "center", gap: 0.5,
                  animation: "srPulse 2.5s ease infinite",
                }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#4ade80" }} />
                  <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>
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
              width: {
  xs: "100%",
  md: 520,
  lg: 560,
},
              display        : "flex",
              flexDirection  : "column",
              alignItems     : "center",
              justifyContent : "center",
              animation      : "srFadeRight 0.8s ease both",
              minHeight      : { xs: "100vh", md: "auto" },
            }}
          >
            {/* Glow halo behind card */}
            <Box sx={{
              position    : "relative",
              width       : "100%",
             maxWidth: {
  xs: 440,
  sm: 500,
  md: 560,
  lg: 620,
},
            }}>
              <Box sx={{
                position    : "absolute",
                inset       : -24,
                borderRadius: "36px",
                background  : `
                  radial-gradient(circle at 30% 20%, rgba(59,130,246,0.18), transparent 55%),
                  radial-gradient(circle at 70% 80%, rgba(16,185,129,0.15), transparent 55%)
                `,
                filter      : "blur(40px)",
                zIndex      : 0,
                pointerEvents: "none",
              }} />

              {/* Card shell — styles child Box from Register/Login */}
              <Box
                sx={{
                  position: "relative",
                  zIndex  : 1,
                  "& > .MuiBox-root, & > .MuiPaper-root": {
                    width           : "100%",
                    backdropFilter  : "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    background      : "rgba(255,255,255,0.97) !important",
                    border          : "1px solid rgba(255,255,255,0.35) !important",
                    borderRadius    : "20px !important",
                    boxShadow       : "0 28px 80px rgba(0,0,0,0.24) !important",
                    transition      : "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover"       : {
                      transform : "translateY(-3px)",
                      boxShadow : "0 36px 90px rgba(0,0,0,0.28) !important",
                    },
                  },
                }}
              >
                <Outlet />
              </Box>
            </Box>

            {/* Mobile branding — below card */}
            {isMobile && (
              <Box
                sx={{
                  mt       : 4,
                  textAlign: "center",
                  animation: "srFadeUp 0.8s ease both",
                  px       : 2,
                }}
              >
                <Avatar
                  src={logo} alt="Smart Retail"
                  sx={{
                    width: 54, height: 54, mx: "auto", mb: 1.5,
                    borderRadius: "12px",
                    border: "2px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
                  }}
                />
                <Typography variant="h6" fontWeight={800} sx={{ color: "#fff", mb: 0.5 }}>
                  Smart Retail
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", lineHeight: 1.65, maxWidth: 300, mx: "auto" }}>
                  AI-powered inventory, forecasting and retail analytics — all in one platform.
                </Typography>
                <Stack direction="row" spacing={0.8} justifyContent="center" flexWrap="wrap" useFlexGap mt={2}>
                  {CHIPS.map((c) => (
                    <Chip
                      key={c} label={c} size="small"
                      sx={{
                        color: "#fff", fontWeight: 600, fontSize: "0.68rem", height: 24,
                        bgcolor: "rgba(255,255,255,0.09)",
                        border: "1px solid rgba(255,255,255,0.14)",
                        backdropFilter: "blur(8px)",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Footer */}
            <Typography
              sx={{
                mt       : 3,
                color    : "rgba(255,255,255,0.45)",
                fontSize : "0.72rem",
                textAlign: "center",
                letterSpacing: "0.3px",
              }}
            >
              © {new Date().getFullYear()} Smart Retail Intelligence Platform · All rights reserved
            </Typography>
          </Box>

        </Box>
      </Box>
    </>
  );
}