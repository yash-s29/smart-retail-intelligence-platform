// src/pages/auth/Login.jsx
// Premium Smart Retail Login Card
// ------------------------------------------------------------
// Backend/authentication logic intentionally unchanged.
// Uses AuthLayout <Outlet />.
// Light sea-water + white + subtle sand palette.
// Responsive, compact, accessible, animated and optimized.
// ------------------------------------------------------------

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import EmailOutlined from "@mui/icons-material/EmailOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import VerifiedUserRounded from "@mui/icons-material/VerifiedUserRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";

import { useAuth } from "../../hooks/useAuth";
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

  sand50: "#FCF9F4",
  sand100: "#F7EFE1",
  sand200: "#EEDDBF",
  sand300: "#D7A965",

  success: "#36A66A",
  error: "#D95D63",
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
    transform: rotate(0deg) translateX(30px) rotate(0deg);
  }

  to {
    transform: rotate(360deg) translateX(30px) rotate(-360deg);
  }
`;

const successAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
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

/* ============================================================
   REDUCED MOTION
   ============================================================ */

const reducedMotion = {
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
    minHeight: 48,
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.9)",
    color: C.ink,
    fontSize: "0.84rem",

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
        "0 0 0 4px rgba(35,143,184,0.085)",
    },

    "&.Mui-error": {
      "& fieldset": {
        borderColor: C.error,
      },
    },
  },

  "& .MuiInputLabel-root": {
    color: C.slate,
    fontSize: "0.82rem",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: C.ocean600,
  },

  "& .MuiInputBase-input::placeholder": {
    color: "#9AAEB6",
    opacity: 1,
  },

  "& .MuiFormHelperText-root": {
    marginLeft: 2,
    fontSize: "0.67rem",
  },
};

/* ============================================================
   ANIMATED LOGIN LOGO
   ============================================================ */

function AnimatedLoginLogo() {
  return (
    <Box
      sx={{
        position: "relative",
        width: 70,
        height: 70,
        mx: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: `${logoFloat} 4.5s ease-in-out infinite`,
        ...reducedMotion,
      }}
    >
      {/* Outer soft glow */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: -9,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(35,143,184,0.17), transparent 68%)",
          filter: "blur(5px)",
        }}
      />

      {/* Main rotating gradient ring */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          padding: "2px",
          background:
            "conic-gradient(from 0deg, #238FB8, #67BDD4, #D7A965, #F7EFE1, #238FB8)",
          animation: `${ringRotate} 7s linear infinite`,
          ...reducedMotion,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.94)",
          }}
        />
      </Box>

      {/* Inner dashed rotating ring */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 5,
          borderRadius: "50%",
          border:
            "1px dashed rgba(35,143,184,0.35)",
          animation: `${ringRotateReverse} 10s linear infinite`,
          ...reducedMotion,
        }}
      />

      {/* Small orbiting sand accent */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 3,
          borderRadius: "50%",
          animation: `${orbit} 5s linear infinite`,
          ...reducedMotion,
        }}
      >
        <Box
          sx={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            bgcolor: C.sand300,
            boxShadow:
              "0 0 0 4px rgba(215,169,101,0.12)",
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
          border: "3px solid rgba(255,255,255,0.98)",
          boxShadow:
            "0 7px 20px rgba(16,93,125,0.18)",
          transition:
            "transform 250ms ease, box-shadow 250ms ease",

          "&:hover": {
            transform: "scale(1.06) rotate(-3deg)",
            boxShadow:
              "0 11px 26px rgba(16,93,125,0.23)",
          },
        }}
      />
    </Box>
  );
}

/* ============================================================
   MAIN LOGIN
   ============================================================ */

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* ==========================================================
     FORM CHANGE
     ========================================================== */

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ==========================================================
     LOGIN LOGIC
     IMPORTANT: SAME BACKEND LOGIC
     ========================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await login(form);

      if (response?.access_token) {
        localStorage.setItem(
          "access_token",
          response.access_token
        );
      }

      setSuccess(
        "Login successful. Redirecting…"
      );

      setTimeout(
        () =>
          navigate("/dashboard", {
            replace: true,
          }),
        1000
      );
    } catch (err) {
      const detail = err?.response?.data?.detail;

      let msg =
        err?.message ||
        "Unable to login.";

      if (detail) {
        if (Array.isArray(detail)) {
          msg = detail
            .map((d) => d.msg)
            .join(", ");
        } else if (
          typeof detail === "string"
        ) {
          msg = detail;
        }
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     UI
     ========================================================== */

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 450,

        /*
         * IMPORTANT:
         * AuthLayout already owns the page background.
         * This card only owns the login surface.
         */

        borderRadius: {
          xs: "18px",
          sm: "22px",
        },

        p: {
          xs: 2.35,
          sm: 3.4,
          md: 3.8,
        },

        bgcolor:
          "rgba(255,255,255,0.92)",

        backdropFilter: "blur(20px)",
        WebkitBackdropFilter:
          "blur(20px)",

        border:
          "1px solid rgba(255,255,255,0.92)",

        boxShadow:
          "0 24px 65px rgba(16,76,96,0.13), 0 5px 20px rgba(16,76,96,0.055)",

        overflow: "hidden",

        animation: `${cardEntrance} 650ms cubic-bezier(.16,1,.3,1) both`,

        ...reducedMotion,

        /* ====================================================
           TOP ACCENT
           ==================================================== */

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
          opacity: 0.9,
        },

        /* ====================================================
           SUBTLE CORNER GLOW
           ==================================================== */

        "&::after": {
          content: '""',
          position: "absolute",
          width: 180,
          height: 180,
          top: -115,
          right: -100,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(103,189,212,0.13), transparent 68%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
{/* ==================================================
    HEADER
    ================================================== */}
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
    mb: {
      xs: 2.4,
      sm: 2.8,
    },
  }}
>
  <AnimatedLoginLogo />

  <Typography
    component="h1"
    sx={{
      mt: 1.15,
      color: C.ink,
      fontWeight: 900,
      fontSize: {
        xs: "1.35rem",
        sm: "1.45rem",
      },
      lineHeight: 1.15,
      letterSpacing: "-0.035em",
    }}
  >
    Welcome back
  </Typography>

  <Stack
    direction="row"
    spacing={0.55}
    alignItems="center"
    justifyContent="center"
    sx={{ mt: 0.7 }}
  >
    <AutoAwesomeRounded
      sx={{
        fontSize: 13,
        color: C.ocean500,
      }}
    />
    <Typography
      sx={{
        color: C.slate,
        fontSize: "0.72rem",
        lineHeight: 1.4,
      }}
    >
      Sign in to your retail workspace
    </Typography>
  </Stack>
</Box>

        {/* ==================================================
            ALERTS
            ================================================== */}

        {success && (
          <Alert
            severity="success"
            icon={
              <CheckCircleRounded
                sx={{ fontSize: 18 }}
              />
            }
            sx={{
              mb: 1.8,
              py: 0.15,
              px: 1,
              borderRadius: "11px",
              fontSize: "0.72rem",
              bgcolor:
                "rgba(54,166,106,0.07)",
              border:
                "1px solid rgba(54,166,106,0.16)",
              animation: `${successAppear} 300ms ease both`,
              ...reducedMotion,

              "& .MuiAlert-message": {
                py: 0.65,
              },
            }}
          >
            {success}
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 1.8,
              py: 0.15,
              px: 1,
              borderRadius: "11px",
              fontSize: "0.72rem",
              animation: `${successAppear} 300ms ease both`,
              ...reducedMotion,

              "& .MuiAlert-message": {
                py: 0.65,
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* ==================================================
            FORM
            ================================================== */}

        <Stack
          spacing={{
            xs: 1.65,
            sm: 1.8,
          }}
        >
          {/* EMAIL */}

          <TextField
            fullWidth
            required
            size="small"
            name="email"
            label="Email address"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="you@example.com"
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined
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

          {/* PASSWORD */}

          <TextField
            fullWidth
            required
            size="small"
            name="password"
            label="Password"
            type={
              showPw
                ? "text"
                : "password"
            }
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined
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
                        showPw
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPw(
                          (prev) => !prev
                        )
                      }
                      sx={{
                        color: C.muted,
                        transition:
                          "all 180ms ease",

                        "&:hover": {
                          color: C.ocean500,
                          bgcolor:
                            "rgba(35,143,184,0.07)",
                          transform:
                            "scale(1.05)",
                        },
                      }}
                    >
                      {showPw ? (
                        <VisibilityOff
                          sx={{ fontSize: 18 }}
                        />
                      ) : (
                        <Visibility
                          sx={{ fontSize: 18 }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* ==================================================
              REMEMBER + FORGOT
              ================================================== */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: 1,
              mt: -0.25,
            }}
          >
            <FormControlLabel
              sx={{
                m: 0,
                minWidth: 0,
              }}
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRemember(
                      e.target.checked
                    )
                  }
                  sx={{
                    p: 0.5,
                    mr: 0.35,
                    color: "#9BAEB5",

                    "&.Mui-checked": {
                      color: C.ocean500,
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    color: C.slate,
                    fontSize: "0.7rem",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  Remember me
                </Typography>
              }
            />

            <Typography
              component={Link}
              to="/forgot-password"
              sx={{
                color: C.ocean500,
                fontSize: "0.7rem",
                fontWeight: 700,
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition:
                  "color 180ms ease",

                "&:hover": {
                  color: C.ocean700,
                  textDecoration:
                    "underline",
                },
              }}
            >
              Forgot password?
            </Typography>
          </Box>

          {/* ==================================================
              SIGN IN BUTTON
              ================================================== */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            endIcon={
              !loading && (
                <ArrowForwardRounded
                  sx={{
                    fontSize: "19px !important",
                    transition:
                      "transform 220ms ease",
                  }}
                />
              )
            }
            sx={{
              position: "relative",
              overflow: "hidden",
              height: 47,
              mt: 0.35,

              borderRadius: "12px",

              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.82rem",
              letterSpacing: "0.005em",

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

                "& .login-arrow": {
                  transform:
                    "translateX(3px)",
                },

                "& .login-shimmer": {
                  animation: `${shimmer} 900ms ease`,
                },
              },

              "&:active": {
                transform:
                  "translateY(0)",
              },

              "&.Mui-disabled": {
                background:
                  "linear-gradient(135deg, #DCE8EC, #CFDFE4)",
                color: "#91A3AA",
                boxShadow: "none",
              },

              ...reducedMotion,
            }}
          >
            {/* Button shimmer */}

            <Box
              className="login-shimmer"
              aria-hidden
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "35%",
                height: "100%",
                pointerEvents:
                  "none",
                background:
                  "linear-gradient(110deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
            />

            {loading ? (
              <Stack
                direction="row"
                spacing={0.9}
                alignItems="center"
              >
                <CircularProgress
                  size={17}
                  thickness={4}
                  sx={{
                    color: "inherit",
                  }}
                />

                <span>
                  Signing in…
                </span>
              </Stack>
            ) : (
              <>
                <span>Sign In</span>

                <ArrowForwardRounded
                  className="login-arrow"
                  sx={{
                    fontSize: 19,
                    transition:
                      "transform 220ms ease",
                  }}
                />
              </>
            )}
          </Button>

          {/* ==================================================
              SECURITY STRIP
              ================================================== */}

          <Stack
            direction="row"
            spacing={0.65}
            alignItems="center"
            justifyContent="center"
            sx={{
              pt: 0.1,
            }}
          >
            <VerifiedUserRounded
              sx={{
                fontSize: 14,
                color: C.sea400,
              }}
            />

            <Typography
              sx={{
                color: C.muted,
                fontSize: "0.62rem",
                fontWeight: 600,
              }}
            >
              Secure encrypted connection
            </Typography>
          </Stack>
        </Stack>

        {/* ==================================================
            DIVIDER
            ================================================== */}

        <Divider
          sx={{
            my: {
              xs: 2.2,
              sm: 2.5,
            },
            borderColor:
              "rgba(199,232,241,0.75)",
          }}
        />

        {/* ==================================================
            REGISTER
            ================================================== */}

        <Typography
          textAlign="center"
          sx={{
            color: C.slate,
            fontSize: "0.7rem",
            lineHeight: 1.4,
          }}
        >
          New to Smart Retail?{" "}
          <Typography
            component={Link}
            to="/register"
            sx={{
              color: C.ocean500,
              fontWeight: 800,
              fontSize: "inherit",
              textDecoration: "none",
              transition:
                "color 180ms ease",

              "&:hover": {
                color: C.ocean700,
                textDecoration:
                  "underline",
              },
            }}
          >
            Create an account
          </Typography>
        </Typography>
      </Box>
    </Paper>
  );
}
