// src/pages/auth/ForgotPassword.jsx
// Premium Smart Retail Password Recovery Card
// ------------------------------------------------------------
// UI-only enhancement.
// Existing routing logic preserved:
// Continue -> /reset-password
// Back to login -> /login
// ------------------------------------------------------------
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

/* ============================================================
   PALETTE
   ============================================================ */
const C = {
  sea50: "#F4FBFD",
  sea75: "#EDF8FB",
  sea100: "#E2F3F8",
  sea150: "#D6EEF5",
  sea200: "#C7E8F1",
  sea300: "#9DD5E4",
  sea400: "#67BDD4",
  ocean500: "#238FB8",
  ocean600: "#18799F",
  ocean700: "#105D7D",
  ocean800: "#0A4962",
  ink: "#102A35",
  slate: "#607985",
  muted: "#82979F",
  white: "#FFFFFF",
  sand100: "#F7EFE1",
  sand200: "#EEDDBF",
  sand300: "#D7A965",
};

/* ============================================================
   ANIMATIONS
   ============================================================ */
const cardEntrance = keyframes`
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.985);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const ringRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ringRotateReverse = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-130%) skewX(-15deg); }
  100% { transform: translateX(230%) skewX(-15deg); }
`;

/* ---------- Cart animations (same as Login & Register) ---------- */
const softCirclePulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.04); opacity: 1; }
`;

const wheelSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const cartDrive = keyframes`
  0% {
    transform: translateZ(0) scale(1) rotateY(0deg);
    opacity: 1;
  }
  10% {
    transform: translateZ(0) scale(1.06) rotateY(0deg);
    opacity: 1;
  }
  18% {
    transform: translateZ(0) scale(1) rotateY(0deg);
    opacity: 1;
  }
  /* Drive FORWARD (out toward user) */
  32% {
    transform: translateZ(80px) scale(1.25) rotateY(8deg);
    opacity: 0.15;
  }
  38% {
    transform: translateZ(120px) scale(1.35) rotateY(12deg);
    opacity: 0;
  }
  /* Invisible – reposition behind */
  45% {
    transform: translateZ(-90px) scale(0.75) rotateY(-25deg);
    opacity: 0;
  }
  /* Come FROM BEHIND */
  58% {
    transform: translateZ(-40px) scale(0.9) rotateY(-12deg);
    opacity: 1;
  }
  /* Soft landing + bump */
  72% {
    transform: translateZ(0) scale(1.08) rotateY(0deg);
    opacity: 1;
  }
  82% {
    transform: translateZ(0) scale(0.97) rotateY(0deg);
    opacity: 1;
  }
  100% {
    transform: translateZ(0) scale(1) rotateY(0deg);
    opacity: 1;
  }
`;

const reduceMotion = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none !important",
    transition: "none !important",
  },
};

/* ============================================================
   FIELD STYLE
   ============================================================ */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 49,
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.92)",
    color: C.ink,
    fontSize: "0.82rem",
    transition:
      "border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
    "& fieldset": {
      borderColor: "rgba(199,232,241,0.95)",
      borderWidth: "1px",
    },
    "&:hover": {
      backgroundColor: C.white,
      "& fieldset": {
        borderColor: C.sea300,
      },
    },
    "&.Mui-focused": {
      backgroundColor: C.white,
      "& fieldset": {
        borderColor: C.ocean500,
        borderWidth: "1.5px",
      },
      boxShadow: "0 0 0 4px rgba(35,143,184,0.08)",
    },
  },
  "& .MuiInputLabel-root": {
    color: C.slate,
    fontSize: "0.8rem",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: C.ocean600,
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#9AAEB6",
    opacity: 1,
  },
};

/* ============================================================
   ANIMATED LOGO (same premium version)
   ============================================================ */
function AnimatedForgotLogo() {
  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: 68, sm: 74 },
        height: { xs: 68, sm: 74 },
        mx: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        ...reduceMotion,

        "&:hover .cart-svg": {
          transform: "scale(1.08)",
          filter: "drop-shadow(0 6px 14px rgba(35,143,184,0.35))",
        },
        "&:hover .soft-circle": {
          transform: "scale(1.06)",
          background:
            "radial-gradient(circle, rgba(103,189,212,0.28), rgba(35,143,184,0.08) 70%)",
        },
      }}
    >
      {/* Soft light-blue circle */}
      <Box
        className="soft-circle"
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(103,189,212,0.22), rgba(35,143,184,0.06) 70%)",
          boxShadow:
            "0 0 0 1px rgba(103,189,212,0.25), 0 8px 24px rgba(16,93,125,0.12)",
          transition: "all 0.35s ease",
          animation: `${softCirclePulse} 4.5s ease-in-out infinite`,
          ...reduceMotion,
        }}
      />

      {/* Outer rotating gradient ring */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: -3,
          borderRadius: "50%",
          padding: "2px",
          background:
            "conic-gradient(from 0deg, #238FB8, #67BDD4, #D7A965, #F7EFE1, #238FB8)",
          animation: `${ringRotate} 8s linear infinite`,
          ...reduceMotion,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* Inner dashed ring */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 6,
          borderRadius: "50%",
          border: "1px dashed rgba(35,143,184,0.35)",
          animation: `${ringRotateReverse} 11s linear infinite`,
          ...reduceMotion,
        }}
      />

      {/* SVG CART */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "700px",
          transformStyle: "preserve-3d",
        }}
      >
        <Box
          className="cart-svg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformStyle: "preserve-3d",
            transition: "transform 0.3s ease, filter 0.3s ease",
            animation: `${cartDrive} 7.8s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
            ...reduceMotion,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="36"
            height="36"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ overflow: "visible" }}
          >
            <path
              d="M12 18h4l6 28h24l6-18H22"
              stroke="url(#cartGradient)"
              strokeWidth="2.8"
            />
            <path
              d="M18 18c0-4 3-7 7-7h2"
              stroke="url(#cartGradient)"
              strokeWidth="2.8"
            />

            {/* Left wheel */}
            <g
              style={{
                transformOrigin: "24px 50px",
                animation: `${wheelSpin} 0.9s linear infinite`,
              }}
            >
              <circle
                cx="24"
                cy="50"
                r="4.5"
                stroke="url(#cartGradient)"
                strokeWidth="2.8"
                fill="none"
              />
              <circle cx="24" cy="50" r="1.6" fill="url(#cartGradient)" />
            </g>

            {/* Right wheel */}
            <g
              style={{
                transformOrigin: "42px 50px",
                animation: `${wheelSpin} 0.9s linear infinite`,
              }}
            >
              <circle
                cx="42"
                cy="50"
                r="4.5"
                stroke="url(#cartGradient)"
                strokeWidth="2.8"
                fill="none"
              />
              <circle cx="42" cy="50" r="1.6" fill="url(#cartGradient)" />
            </g>

            <defs>
              <linearGradient
                id="cartGradient"
                x1="12"
                y1="10"
                x2="52"
                y2="54"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5B8DEF" />
                <stop offset="1" stopColor="#2BA4D2" />
              </linearGradient>
            </defs>
          </svg>
        </Box>
      </Box>
    </Box>
  );
}

/* ============================================================
   FORGOT PASSWORD
   ============================================================ */
function ForgotPassword() {
  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: {
          xs: 420,
          sm: 455,
        },
        mx: "auto",
        p: {
          xs: 2.4,
          sm: 3.5,
        },
        borderRadius: {
          xs: "18px",
          sm: "22px",
        },
        bgcolor: "rgba(255,255,255,0.93)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.94)",
        boxShadow:
          "0 24px 65px rgba(16,76,96,0.13), 0 5px 20px rgba(16,76,96,0.055)",
        overflow: "hidden",
        animation: `${cardEntrance} 650ms cubic-bezier(.16,1,.3,1) both`,
        ...reduceMotion,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "9%",
          right: "9%",
          height: 2,
          borderRadius: "0 0 10px 10px",
          background:
            "linear-gradient(90deg, transparent, #67BDD4, #238FB8, #D7A965, transparent)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: 180,
          height: 180,
          top: -115,
          right: -100,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(103,189,212,0.12), transparent 68%)",
          pointerEvents: "none",
        },
      }}
    >
      <Stack
        spacing={{
          xs: 2,
          sm: 2.35,
        }}
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <AnimatedForgotLogo />

          <Typography
            component="h1"
            sx={{
              mt: 1,
              color: C.ink,
              fontWeight: 900,
              fontSize: {
                xs: "1.35rem",
                sm: "1.48rem",
              },
              lineHeight: 1.15,
              letterSpacing: "-0.04em",
            }}
          >
            Reset your password
          </Typography>

          <Stack
            direction="row"
            spacing={0.55}
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 0.7 }}
          >
            <AutoAwesomeRoundedIcon
              sx={{
                fontSize: 13,
                color: C.ocean500,
              }}
            />
            <Typography
              sx={{
                color: C.slate,
                fontSize: "0.71rem",
                lineHeight: 1.45,
                maxWidth: 320,
              }}
            >
              Enter your account email to continue password recovery.
            </Typography>
          </Stack>
        </Box>

        {/* INFO STRIP */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.2,
            py: 1,
            borderRadius: "11px",
            bgcolor: "rgba(226,243,248,0.55)",
            border: "1px solid rgba(199,232,241,0.75)",
          }}
        >
          <LockResetRoundedIcon
            sx={{
              fontSize: 18,
              color: C.ocean500,
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              color: C.slate,
              fontSize: "0.66rem",
              lineHeight: 1.45,
            }}
          >
            We'll use your registered email to help you securely regain access.
          </Typography>
        </Box>

        {/* EMAIL */}
        <TextField
          fullWidth
          required
          size="small"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          sx={fieldSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color: C.sea400,
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* CONTINUE BUTTON */}
        <Button
          component={Link}
          to="/reset-password"
          variant="contained"
          fullWidth
          endIcon={
            <ArrowForwardRoundedIcon
              className="forgot-arrow"
              sx={{
                fontSize: "19px !important",
                transition: "transform 220ms ease",
              }}
            />
          }
          sx={{
            position: "relative",
            overflow: "hidden",
            height: 47,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 800,
            fontSize: "0.82rem",
            color: C.white,
            background:
              "linear-gradient(135deg, #2BA4D2 0%, #18799F 52%, #105D7D 100%)",
            boxShadow: "0 8px 20px rgba(24,121,159,0.22)",
            transition:
              "transform 180ms ease, box-shadow 180ms ease, filter 180ms ease",
            "&:hover": {
              background:
                "linear-gradient(135deg, #238FB8 0%, #105D7D 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 13px 27px rgba(16,93,125,0.27)",
              filter: "saturate(1.05)",
              "& .forgot-arrow": {
                transform: "translateX(3px)",
              },
              "& .forgot-shimmer": {
                animation: `${shimmer} 900ms ease`,
              },
            },
            "&:active": {
              transform: "translateY(0)",
            },
            ...reduceMotion,
          }
        >
          <Box
            className="forgot-shimmer"
            aria-hidden
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "35%",
              height: "100%",
              pointerEvents: "none",
              background:
                "linear-gradient(110deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
          />
          <span>Continue</span>
        </Button>

        {/* SECURITY */}
        <Stack
          direction="row"
          spacing={0.6}
          alignItems="center"
          justifyContent="center"
        >
          <VerifiedUserRoundedIcon
            sx={{
              fontSize: 14,
              color: C.sea400,
            }}
          />
          <Typography
            sx={{
              color: C.muted,
              fontSize: "0.61rem",
              fontWeight: 600,
            }}
          >
            Secure password recovery
          </Typography>
        </Stack>

        <Divider
          sx={{
            borderColor: "rgba(199,232,241,0.75)",
          }}
        />

        {/* BACK TO LOGIN */}
        <Button
          component={Link}
          to="/login"
          variant="text"
          startIcon={
            <ArrowBackRoundedIcon
              sx={{
                fontSize: "17px !important",
                transition: "transform 180ms ease",
              }}
            />
          }
          sx={{
            alignSelf: "center",
            minHeight: 32,
            px: 1.3,
            borderRadius: "9px",
            color: C.ocean500,
            textTransform: "none",
            fontWeight: 800,
            fontSize: "0.71rem",
            transition:
              "background-color 180ms ease, color 180ms ease",
            "&:hover": {
              bgcolor: "rgba(35,143,184,0.07)",
              color: C.ocean700,
              "& .MuiButton-startIcon": {
                transform: "translateX(-2px)",
              },
            },
            "& .MuiButton-startIcon": {
              transition: "transform 180ms ease",
            },
          }}
        >
          Back to login
        </Button>
      </Stack>
    </Paper>
  );
}

export default ForgotPassword;
