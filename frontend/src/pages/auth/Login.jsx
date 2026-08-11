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

const ringRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ringRotateReverse = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
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
  0% { transform: translateX(-130%) skewX(-15deg); }
  100% { transform: translateX(230%) skewX(-15deg); }
`;

/* ---------- Cart animations ---------- */

// Continuous gentle pump of the outer soft circle
const softCirclePulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.04); opacity: 1; }
`;

// Wheels spinning
const wheelSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Main cart movement:
// goes FORWARD (out) → disappears → comes FROM BEHIND → soft bump
const cartDrive = keyframes`
  /* Idle */
  0% {
    transform: translateZ(0) scale(1) rotateY(0deg);
    opacity: 1;
  }

  /* Slight pump */
  10% {
    transform: translateZ(0) scale(1.06) rotateY(0deg);
    opacity: 1;
  }
  18% {
    transform: translateZ(0) scale(1) rotateY(0deg);
    opacity: 1;
  }

  /* Drive FORWARD (out of circle toward user) */
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

  /* Settle */
  100% {
    transform: translateZ(0) scale(1) rotateY(0deg);
    opacity: 1;
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
      boxShadow: "0 0 0 4px rgba(35,143,184,0.085)",
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
        width: { xs: 68, sm: 74 },
        height: { xs: 68, sm: 74 },
        mx: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        ...reducedMotion,

        // Hover effect on the whole logo
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
      {/* Soft light-blue circle (replaces white card) */}
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
          ...reducedMotion,
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
          ...reducedMotion,
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
          ...reducedMotion,
        }}
      />

      {/* ===== SVG CART ===== */}
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
            ...reducedMotion,
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
            {/* Cart body */}
            <path
              d="M12 18h4l6 28h24l6-18H22"
              stroke="url(#cartGradient)"
              strokeWidth="2.8"
            />
            {/* Handle */}
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

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await login(form);
      if (response?.access_token) {
        localStorage.setItem("access_token", response.access_token);
      }
      setSuccess("Login successful. Redirecting…");
      setTimeout(
        () =>
          navigate("/dashboard", {
            replace: true,
          }),
        1000
      );
    } catch (err) {
      const detail = err?.response?.data?.detail;
      let msg = err?.message || "Unable to login.";
      if (detail) {
        if (Array.isArray(detail)) {
          msg = detail.map((d) => d.msg).join(", ");
        } else if (typeof detail === "string") {
          msg = detail;
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 450,
        borderRadius: {
          xs: "18px",
          sm: "22px",
        },
        p: {
          xs: 2.35,
          sm: 3.4,
          md: 3.8,
        },
        bgcolor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.92)",
        boxShadow:
          "0 24px 65px rgba(16,76,96,0.13), 0 5px 20px rgba(16,76,96,0.055)",
        overflow: "hidden",
        animation: `${cardEntrance} 650ms cubic-bezier(.16,1,.3,1) both`,
        ...reducedMotion,
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
        {/* HEADER */}
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

        {/* ALERTS */}
        {success && (
          <Alert
            severity="success"
            icon={<CheckCircleRounded sx={{ fontSize: 18 }} />}
            sx={{
              mb: 1.8,
              py: 0.15,
              px: 1,
              borderRadius: "11px",
              fontSize: "0.72rem",
              bgcolor: "rgba(54,166,106,0.07)",
              border: "1px solid rgba(54,166,106,0.16)",
              animation: `${successAppear} 300ms ease both`,
              ...reducedMotion,
              "& .MuiAlert-message": { py: 0.65 },
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
              "& .MuiAlert-message": { py: 0.65 },
            }}
          >
            {error}
          </Alert>
        )}

        {/* FORM */}
        <Stack spacing={{ xs: 1.65, sm: 1.8 }}>
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
                      sx={{ fontSize: 18, color: C.sea400 }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            required
            size="small"
            name="password"
            label="Password"
            type={showPw ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined
                      sx={{ fontSize: 18, color: C.sea400 }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      size="small"
                      edge="end"
                      aria-label={showPw ? "Hide password" : "Show password"}
                      onClick={() => setShowPw((prev) => !prev)}
                      sx={{
                        color: C.muted,
                        transition: "all 180ms ease",
                        "&:hover": {
                          color: C.ocean500,
                          bgcolor: "rgba(35,143,184,0.07)",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {showPw ? (
                        <VisibilityOff sx={{ fontSize: 18 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mt: -0.25,
            }}
          >
            <FormControlLabel
              sx={{ m: 0, minWidth: 0 }}
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) => setRemember(e.target.checked)}
                  sx={{
                    p: 0.5,
                    mr: 0.35,
                    color: "#9BAEB5",
                    "&.Mui-checked": { color: C.ocean500 },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    color: C.slate,
                    fontSize: "0.7rem",
                    whiteSpace: "nowrap",
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
                transition: "color 180ms ease",
                "&:hover": {
                  color: C.ocean700,
                  textDecoration: "underline",
                },
              }}
            >
              Forgot password?
            </Typography>
          </Box>

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
                    transition: "transform 220ms ease",
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
              boxShadow: "0 8px 20px rgba(24,121,159,0.22)",
              transition:
                "transform 180ms ease, box-shadow 180ms ease, filter 180ms ease",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #238FB8 0%, #105D7D 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 13px 27px rgba(16,93,125,0.27)",
                filter: "saturate(1.05)",
                "& .login-arrow": { transform: "translateX(3px)" },
                "& .login-shimmer": {
                  animation: `${shimmer} 900ms ease`,
                },
              },
              "&:active": { transform: "translateY(0)" },
              "&.Mui-disabled": {
                background: "linear-gradient(135deg, #DCE8EC, #CFDFE4)",
                color: "#91A3AA",
                boxShadow: "none",
              },
              ...reducedMotion,
            }}
          >
            <Box
              className="login-shimmer"
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
            {loading ? (
              <Stack direction="row" spacing={0.9} alignItems="center">
                <CircularProgress
                  size={17}
                  thickness={4}
                  sx={{ color: "inherit" }}
                />
                <span>Signing in…</span>
              </Stack>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowForwardRounded
                  className="login-arrow"
                  sx={{
                    fontSize: 19,
                    transition: "transform 220ms ease",
                  }}
                />
              </>
            )}
          </Button>

          <Stack
            direction="row"
            spacing={0.65}
            alignItems="center"
            justifyContent="center"
            sx={{ pt: 0.1 }}
          >
            <VerifiedUserRounded
              sx={{ fontSize: 14, color: C.sea400 }}
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

        <Divider
          sx={{
            my: { xs: 2.2, sm: 2.5 },
            borderColor: "rgba(199,232,241,0.75)",
          }}
        />

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
              transition: "color 180ms ease",
              "&:hover": {
                color: C.ocean700,
                textDecoration: "underline",
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
