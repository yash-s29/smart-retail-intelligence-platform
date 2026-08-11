
// src/pages/auth/ResetPassword.jsx
// Premium Smart Retail New Password Card
// ------------------------------------------------------------
// UI enhancement only.
// Existing routing behavior preserved:
// Save password -> /login
// ------------------------------------------------------------

import { useState } from "react";
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";

import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
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

  success: "#36A66A",
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

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
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

function AnimatedResetLogo() {
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

      {/* Inner reverse ring */}

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

      {/* Orbiting sand accent */}

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
   PASSWORD FIELD
   ============================================================ */

function PasswordField({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
}) {
  return (
    <TextField
      fullWidth
      required
      size="small"
      label={label}
      name={name}
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      autoComplete={
        name === "newPassword"
          ? "new-password"
          : "new-password"
      }
      sx={fieldSx}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon
                sx={{
                  fontSize: 18,
                  color: C.sea400,
                }}
              />
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                size="small"
                edge="end"
                aria-label={
                  visible
                    ? `Hide ${label.toLowerCase()}`
                    : `Show ${label.toLowerCase()}`
                }
                onClick={onToggle}
                sx={{
                  color: C.muted,

                  transition:
                    "color 180ms ease, transform 180ms ease, background-color 180ms ease",

                  "&:hover": {
                    color: C.ocean500,

                    bgcolor:
                      "rgba(35,143,184,0.07)",

                    transform:
                      "scale(1.06)",
                  },
                }}
              >
                {visible ? (
                  <VisibilityOffRoundedIcon
                    sx={{
                      fontSize: 18,
                    }}
                  />
                ) : (
                  <VisibilityRoundedIcon
                    sx={{
                      fontSize: 18,
                    }}
                  />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

/* ============================================================
   RESET PASSWORD
   ============================================================ */

function ResetPassword() {
  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  /*
   * UI-only password state.
   * Existing component did not have backend logic.
   */

  const hasPassword =
    newPassword.length > 0;

  const passwordLength =
    newPassword.length >= 8;

  const passwordsMatch =
    hasPassword &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

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

        /* Premium top accent */

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
          xs: 1.85,
          sm: 2.2,
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

          <AnimatedResetLogo />

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
            Create a new password
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
              Add a fresh password for your
              retail workspace.
            </Typography>
          </Stack>
        </Stack>

        {/* ==================================================
            PASSWORD FORM
            ================================================== */}

        <Stack spacing={1.45}>
          <PasswordField
            label="New password"
            name="newPassword"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            visible={showNewPassword}
            onToggle={() =>
              setShowNewPassword(
                (prev) => !prev
              )
            }
          />

          <PasswordField
            label="Confirm password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            visible={
              showConfirmPassword
            }
            onToggle={() =>
              setShowConfirmPassword(
                (prev) => !prev
              )
            }
          />
        </Stack>

        {/* ==================================================
            PASSWORD REQUIREMENTS
            ================================================== */}

        <Box
          sx={{
            px: 1.25,
            py: 1.1,

            borderRadius: "11px",

            bgcolor:
              "rgba(244,251,253,0.8)",

            border:
              "1px solid rgba(199,232,241,0.7)",
          }}
        >
          <Typography
            sx={{
              color: C.slate,

              fontSize: "0.62rem",

              fontWeight: 700,

              mb: 0.7,
            }}
          >
            Password requirements
          </Typography>

          <Stack spacing={0.45}>
            <Stack
              direction="row"
              spacing={0.6}
              alignItems="center"
            >
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 14,

                  color:
                    passwordLength
                      ? C.success
                      : C.sea300,

                  transition:
                    "color 180ms ease",
                }}
              />

              <Typography
                sx={{
                  fontSize: "0.61rem",

                  color:
                    passwordLength
                      ? C.success
                      : C.muted,

                  transition:
                    "color 180ms ease",
                }}
              >
                At least 8 characters
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={0.6}
              alignItems="center"
            >
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 14,

                  color:
                    passwordsMatch
                      ? C.success
                      : C.sea300,

                  transition:
                    "color 180ms ease",
                }}
              />

              <Typography
                sx={{
                  fontSize: "0.61rem",

                  color:
                    passwordsMatch
                      ? C.success
                      : C.muted,

                  transition:
                    "color 180ms ease",
                }}
              >
                Passwords match
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* ==================================================
            SAVE PASSWORD
            ================================================== */}

        <Button
          component={Link}
          to="/login"
          variant="contained"
          fullWidth
          endIcon={
            <ArrowForwardRoundedIcon
              className="reset-arrow"
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

              "& .reset-arrow": {
                transform:
                  "translateX(3px)",
              },

              "& .reset-shimmer": {
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
          {/* Button shimmer */}

          <Box
            className="reset-shimmer"
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

          <span>Save password</span>
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
            Your password stays private and secure
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
              className="back-arrow"
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

              "& .back-arrow": {
                transform:
                  "translateX(-2px)",
              },
            },

            ...reduceMotion,
          }}
        >
          Back to login
        </Button>
      </Stack>
    </Paper>
  );
}

export default ResetPassword;

