```jsx
// src/pages/auth/ForgotPassword.jsx
// Premium Smart Retail Password Recovery Card
// ------------------------------------------------------------
// UI-only enhancement.
// Existing routing logic preserved:
//   Continue -> /reset-password
//   Back to login -> /login
// ------------------------------------------------------------

import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";

import {
  Avatar,
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

import logo from "../../assets/images/logo.png";

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

const logoFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
`;

const ringRotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const ringRotateReverse = keyframes`
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
`;

const orbit = keyframes`
  from {
    transform: rotate(0deg) translateX(29px) rotate(0deg);
  }

  to {
    transform: rotate(360deg) translateX(29px) rotate(-360deg);
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-130%) skewX(-15deg);
  }

  100% {
    transform: translateX(230%) skewX(-15deg);
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

      boxShadow:
        "0 0 0 4px rgba(35,143,184,0.08)",
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
   ANIMATED LOGO
   ============================================================ */

function AnimatedForgotLogo() {
  return (
    <Box
      sx={{
        position: "relative",
        width: 72,
        height: 72,

        mx: "auto",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        animation:
          `${logoFloat} 4.5s ease-in-out infinite`,

        ...reduceMotion,
      }}
    >
      {/* Soft glow */}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: -10,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(35,143,184,0.17), transparent 68%)",

          filter: "blur(5px)",
        }}
      />

      {/* Outer rotating ring */}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,

          borderRadius: "50%",

          padding: "2px",

          background:
            "conic-gradient(from 0deg, #238FB8, #67BDD4, #D7A965, #F7EFE1, #238FB8)",

          animation:
            `${ringRotate} 7s linear infinite`,

          ...reduceMotion,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",

            borderRadius: "50%",

            bgcolor:
              "rgba(255,255,255,0.96)",
          }}
        />
      </Box>

      {/* Inner ring */}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 5,

          borderRadius: "50%",

          border:
            "1px dashed rgba(35,143,184,0.35)",

          animation:
            `${ringRotateReverse} 10s linear infinite`,

          ...reduceMotion,
        }}
      />

      {/* Orbiting sand dot */}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 3,

          borderRadius: "50%",

          animation:
            `${orbit} 5s linear infinite`,

          ...reduceMotion,
        }}
      >
        <Box
          sx={{
            width: 5,
            height: 5,

            borderRadius: "50%",

            bgcolor: C.sand300,

            boxShadow:
              "0 0 0 4px rgba(215,169,101,0.13)",
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
          zIndex: 2,

          width: 56,
          height: 56,

          borderRadius: "14px",

          bgcolor: C.white,

          border:
            "3px solid rgba(255,255,255,0.98)",

          boxShadow:
            "0 8px 22px rgba(16,93,125,0.18)",

          transition:
            "transform 250ms ease, box-shadow 250ms ease",

          "&:hover": {
            transform:
              "scale(1.06) rotate(-3deg)",

            boxShadow:
              "0 12px 28px rgba(16,93,125,0.24)",
          },
        }}
      />
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

        bgcolor:
          "rgba(255,255,255,0.93)",

        backdropFilter: "blur(20px)",
        WebkitBackdropFilter:
          "blur(20px)",

        border:
          "1px solid rgba(255,255,255,0.94)",

        boxShadow:
          "0 24px 65px rgba(16,76,96,0.13), 0 5px 20px rgba(16,76,96,0.055)",

        overflow: "hidden",

        animation:
          `${cardEntrance} 650ms cubic-bezier(.16,1,.3,1) both`,

        ...reduceMotion,

        /* Top accent */

        "&::before": {
          content: '""',

          position: "absolute",

          top: 0,
          left: "9%",
          right: "9%",

          height: 2,

          borderRadius:
            "0 0 10px 10px",

          background:
            "linear-gradient(90deg, transparent, #67BDD4, #238FB8, #D7A965, transparent)",
        },

        /* Corner glow */

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
        {/* ==================================================
            HEADER
            ================================================== */}

        <Stack
          alignItems="center"
          textAlign="center"
        >
          {/* Centered logo */}

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

              letterSpacing:
                "-0.04em",
            }}
          >
            Reset your password
          </Typography>

          <Stack
            direction="row"
            spacing={0.55}
            alignItems="center"
            justifyContent="center"
            sx={{
              mt: 0.7,
            }}
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
              Enter your account email to continue
              password recovery.
            </Typography>
          </Stack>
        </Stack>

        {/* ==================================================
            INFO STRIP
            ================================================== */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,

            px: 1.2,
            py: 1,

            borderRadius: "11px",

            bgcolor:
              "rgba(226,243,248,0.55)",

            border:
              "1px solid rgba(199,232,241,0.75)",
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
            We'll use your registered email to
            help you securely regain access.
          </Typography>
        </Box>

        {/* ==================================================
            EMAIL
            ================================================== */}

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

        {/* ==================================================
            CONTINUE BUTTON
            ================================================== */}

        <Button
          component={Link}
          to="/reset-password"
          variant="contained"
          fullWidth
          endIcon={
            <ArrowForwardRoundedIcon
              className="forgot-arrow"
              sx={{
                fontSize:
                  "19px !important",

                transition:
                  "transform 220ms ease",
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

            boxShadow:
              "0 8px 20px rgba(24,121,159,0.22)",

            transition:
              "transform 180ms ease, box-shadow 180ms ease, filter 180ms ease",

            "&:hover": {
              background:
                "linear-gradient(135deg, #238FB8 0%, #105D7D 100%)",

              transform:
                "translateY(-2px)",

              boxShadow:
                "0 13px 27px rgba(16,93,125,0.27)",

              filter:
                "saturate(1.05)",

              "& .forgot-arrow": {
                transform:
                  "translateX(3px)",
              },

              "& .forgot-shimmer": {
                animation:
                  `${shimmer} 900ms ease`,
              },
            },

            "&:active": {
              transform:
                "translateY(0)",
            },

            ...reduceMotion,
          }}
        >
          {/* Shimmer */}

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

        {/* ==================================================
            SECURITY
            ================================================== */}

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

        {/* ==================================================
            DIVIDER
            ================================================== */}

        <Divider
          sx={{
            borderColor:
              "rgba(199,232,241,0.75)",
          }}
        />

        {/* ==================================================
            BACK TO LOGIN
            ================================================== */}

        <Button
          component={Link}
          to="/login"
          variant="text"
          startIcon={
            <ArrowBackRoundedIcon
              sx={{
                fontSize:
                  "17px !important",

                transition:
                  "transform 180ms ease",
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
              bgcolor:
                "rgba(35,143,184,0.07)",

              color: C.ocean700,

              "& .MuiButton-startIcon": {
                transform:
                  "translateX(-2px)",
              },
            },

            "& .MuiButton-startIcon": {
              transition:
                "transform 180ms ease",
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
```
