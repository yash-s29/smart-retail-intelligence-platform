```jsx
// src/pages/auth/Register.jsx
// Premium Smart Retail Registration Card
// ------------------------------------------------------------
// Backend/authentication logic intentionally preserved.
// Uses AuthLayout <Outlet />.
// Light sea-water + white + subtle sand palette.
// Responsive across mobile / tablet / laptop / desktop.
// Compact layout to minimize unnecessary scrolling.
// ------------------------------------------------------------

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

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
    transform: translateY(18px) scale(0.985);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const logoFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-4px) rotate(1deg);
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
    transform: rotate(0deg) translateX(31px) rotate(0deg);
  }

  to {
    transform: rotate(360deg) translateX(31px) rotate(-360deg);
  }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(7px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmerSweep = keyframes`
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
   SHARED FIELD STYLE
   ============================================================ */

const fieldSx = {
  width: "100%",

  "& .MuiOutlinedInput-root": {
    minHeight: 46,
    borderRadius: "11px",
    backgroundColor: "rgba(255,255,255,0.92)",
    color: C.ink,
    fontSize: "0.8rem",

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
        "0 0 0 4px rgba(35,143,184,0.075)",
    },

    "&.Mui-error": {
      "& fieldset": {
        borderColor: C.error,
      },
    },
  },

  "& .MuiInputLabel-root": {
    color: C.slate,
    fontSize: "0.78rem",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: C.ocean600,
  },

  "& .MuiInputBase-input": {
    py: 1.25,
  },

  "& .MuiInputBase-input::placeholder": {
    color: "#9AAEB6",
    opacity: 1,
  },

  "& .MuiSelect-select": {
    py: 1.25,
  },

  "& .MuiFormHelperText-root": {
    marginLeft: 2,
    fontSize: "0.64rem",
  },
};

/* ============================================================
   START ICON
   ============================================================ */

function StartIcon({ icon: Icon }) {
  return (
    <InputAdornment position="start">
      <Icon
        sx={{
          fontSize: 17,
          color: C.sea400,
        }}
      />
    </InputAdornment>
  );
}

/* ============================================================
   ANIMATED CENTER LOGO
   ============================================================ */

function AnimatedRegisterLogo() {
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

        animation: `${logoFloat} 4.6s ease-in-out infinite`,
        ...reduceMotion,
      }}
    >
      {/* Ambient glow */}

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

          animation: `${ringRotate} 7s linear infinite`,
          ...reduceMotion,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.95)",
          }}
        />
      </Box>

      {/* Inner dashed ring */}

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

      {/* Orbiting accent */}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 3,
          borderRadius: "50%",

          animation: `${orbit} 5s linear infinite`,
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
          zIndex: 3,

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
   REGISTER PAGE
   ============================================================ */

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    store_name: "",
    store_type: "General Retail",
    location: "",
    business_category: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ==========================================================
     BUSINESS TYPES
     ========================================================== */

  const BUSINESS_TYPES = [
    "Grocery",
    "Fashion",
    "Electronics",
    "Pharmacy",
    "General Retail",
  ];

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
     REGISTER LOGIC
     IMPORTANT: SAME BACKEND LOGIC
     ========================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(form);

      setSuccess(
        "Account created successfully. Redirecting…"
      );

      setTimeout(
        () => navigate("/dashboard"),
        1200
      );
    } catch (err) {
      const detail =
        err?.response?.data?.detail;

      let msg =
        err?.message ||
        "Registration failed";

      if (detail) {
        if (Array.isArray(detail)) {
          msg = detail
            .map(
              (d) =>
                d?.msg ||
                JSON.stringify(d)
            )
            .join("; ");
        } else if (
          typeof detail === "object"
        ) {
          msg =
            detail.detail ||
            Object.entries(detail)
              .map(
                ([k, v]) =>
                  `${k}: ${v}`
              )
              .join("; ");
        } else {
          msg = String(detail);
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
        maxWidth: {
          xs: 430,
          sm: 540,
          md: 580,
          lg: 590,
        },

        /*
         * Important:
         * AuthLayout already owns the full-screen background.
         * Register.jsx only renders the card.
         */

        borderRadius: {
          xs: "18px",
          sm: "22px",
        },

        p: {
          xs: 2.15,
          sm: 2.8,
          md: 3.15,
        },

        bgcolor:
          "rgba(255,255,255,0.93)",

        backdropFilter: "blur(20px)",
        WebkitBackdropFilter:
          "blur(20px)",

        border:
          "1px solid rgba(255,255,255,0.92)",

        boxShadow:
          "0 24px 65px rgba(16,76,96,0.13), 0 5px 20px rgba(16,76,96,0.055)",

        overflow: "hidden",

        animation:
          `${cardEntrance} 650ms cubic-bezier(.16,1,.3,1) both`,

        ...reduceMotion,

        /* Top premium accent */

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

          opacity: 0.9,
        },

        /* Corner glow */

        "&::after": {
          content: '""',

          position: "absolute",

          width: 190,
          height: 190,

          top: -125,
          right: -105,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(103,189,212,0.12), transparent 68%)",

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
          zIndex: 2,
        }}
      >
        {/* ==================================================
            CENTERED HEADER
            ================================================== */}

        <Stack
          alignItems="center"
          textAlign="center"
          sx={{
            mb: {
              xs: 2.1,
              sm: 2.35,
            },
          }}
        >
          {/* LOGO IS CENTERED HERE */}

          <AnimatedRegisterLogo />

          <Typography
            component="h1"
            sx={{
              mt: 0.9,

              color: C.ink,

              fontWeight: 900,

              fontSize: {
                xs: "1.3rem",
                sm: "1.42rem",
              },

              lineHeight: 1.15,

              letterSpacing:
                "-0.04em",
            }}
          >
            Create your account
          </Typography>

          <Stack
            direction="row"
            spacing={0.55}
            alignItems="center"
            justifyContent="center"
            sx={{
              mt: 0.65,
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
                fontSize: "0.7rem",
                lineHeight: 1.4,
              }}
            >
              Start managing your retail business smarter
            </Typography>
          </Stack>
        </Stack>

        {/* ==================================================
            ALERTS
            ================================================== */}

        {success && (
          <Alert
            severity="success"
            icon={
              <CheckCircleRoundedIcon
                sx={{ fontSize: 18 }}
              />
            }
            sx={{
              mb: 1.65,

              py: 0.05,
              px: 1,

              borderRadius: "11px",

              fontSize: "0.7rem",

              bgcolor:
                "rgba(54,166,106,0.07)",

              border:
                "1px solid rgba(54,166,106,0.16)",

              animation:
                `${fadeUp} 300ms ease both`,

              ...reduceMotion,

              "& .MuiAlert-message": {
                py: 0.6,
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
              mb: 1.65,

              py: 0.05,
              px: 1,

              borderRadius: "11px",

              fontSize: "0.7rem",

              animation:
                `${fadeUp} 300ms ease both`,

              ...reduceMotion,

              "& .MuiAlert-message": {
                py: 0.6,
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* ==================================================
            FORM
            ================================================== */}

        <Grid
          container
          spacing={{
            xs: 1.35,
            sm: 1.5,
          }}
        >
          {/* ==================================================
              FULL NAME
              ================================================== */}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              required
              label="Full Name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Your full name"
              sx={fieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <StartIcon
                      icon={
                        PersonOutlineOutlinedIcon
                      }
                    />
                  ),
                },
              }}
            />
          </Grid>

          {/* ==================================================
              EMAIL
              ================================================== */}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              required
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@example.com"
              sx={fieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <StartIcon
                      icon={
                        EmailOutlinedIcon
                      }
                    />
                  ),
                },
              }}
            />
          </Grid>

          {/* ==================================================
              PASSWORD
              ================================================== */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              required
              label="Password"
              name="password"
              type={
                showPw
                  ? "text"
                  : "password"
              }
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Create a secure password"
              sx={fieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <StartIcon
                      icon={
                        LockOutlinedIcon
                      }
                    />
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
                            (p) => !p
                          )
                        }
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
                        {showPw ? (
                          <VisibilityOff
                            sx={{
                              fontSize: 18,
                            }}
                          />
                        ) : (
                          <Visibility
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
          </Grid>

          {/* ==================================================
              STORE NAME
              ================================================== */}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              required
              label="Store Name"
              name="store_name"
              value={form.store_name}
              onChange={handleChange}
              autoComplete="organization"
              placeholder="Your store name"
              sx={fieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <StartIcon
                      icon={
                        StorefrontOutlinedIcon
                      }
                    />
                  ),
                },
              }}
            />
          </Grid>

          {/* ==================================================
              STORE TYPE
              ================================================== */}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              select
              label="Store Type"
              name="store_type"
              value={form.store_type}
              onChange={handleChange}
              sx={fieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <StartIcon
                      icon={
                        StorefrontOutlinedIcon
                      }
                    />
                  ),
                },
              }}
            >
              {BUSINESS_TYPES.map(
                (type) => (
                  <MenuItem
                    key={type}
                    value={type}
                    sx={{
                      fontSize:
                        "0.78rem",
                    }}
                  >
                    {type}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>

          {/* ==================================================
              LOCATION
              ================================================== */}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              required
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              autoComplete="address-level2"
              placeholder="City / Area"
              sx={fieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <StartIcon
                      icon={
                        LocationOnOutlinedIcon
                      }
                    />
                  ),
                },
              }}
            />
          </Grid>

          {/* ==================================================
              BUSINESS CATEGORY
              ================================================== */}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              required
              label="Business Category"
              name="business_category"
              value={
                form.business_category
              }
              onChange={handleChange}
              placeholder="e.g. FMCG"
              sx={fieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <StartIcon
                      icon={
                        CategoryOutlinedIcon
                      }
                    />
                  ),
                },
              }}
            />
          </Grid>

          {/* ==================================================
              SUBMIT
              ================================================== */}

          <Grid
            item
            xs={12}
            sx={{
              mt: {
                xs: 0.35,
                sm: 0.45,
              },
            }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={
                !loading && (
                  <ArrowForwardRoundedIcon
                    className="register-arrow"
                    sx={{
                      fontSize:
                        "19px !important",
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

                borderRadius: "12px",

                textTransform: "none",

                fontWeight: 800,

                fontSize: "0.81rem",

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

                  "& .register-arrow": {
                    transform:
                      "translateX(3px)",
                  },

                  "& .register-shimmer": {
                    animation:
                      `${shimmerSweep} 900ms ease`,
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

                ...reduceMotion,
              }}
            >
              {/* Button shimmer */}

              <Box
                className="register-shimmer"
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
                    Creating Account…
                  </span>
                </Stack>
              ) : (
                <>
                  <span>
                    Create Account
                  </span>

                  <PersonAddAltOutlinedIcon
                    sx={{
                      fontSize: 18,
                    }}
                  />
                </>
              )}
            </Button>

            {/* ==================================================
                TERMS
                ================================================== */}

            <Typography
              sx={{
                display: "block",

                textAlign: "center",

                color: C.muted,

                fontSize: "0.58rem",

                lineHeight: 1.45,

                mt: 1.1,

                px: 1,
              }}
            >
              By creating an account, you agree
              to our Terms of Service and Privacy
              Policy.
            </Typography>
          </Grid>
        </Grid>

        {/* ==================================================
            SECURITY STRIP
            ================================================== */}

        <Stack
          direction="row"
          spacing={0.6}
          alignItems="center"
          justifyContent="center"
          sx={{
            mt: 1.25,
          }}
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
              fontSize: "0.6rem",
              fontWeight: 600,
            }}
          >
            Secure encrypted registration
          </Typography>
        </Stack>

        {/* ==================================================
            DIVIDER
            ================================================== */}

        <Divider
          sx={{
            my: {
              xs: 1.8,
              sm: 2.1,
            },

            borderColor:
              "rgba(199,232,241,0.75)",
          }}
        />

        {/* ==================================================
            LOGIN LINK
            ================================================== */}

        <Typography
          textAlign="center"
          sx={{
            color: C.slate,
            fontSize: "0.69rem",
            lineHeight: 1.4,
          }}
        >
          Already have an account?{" "}

          <Typography
            component={Link}
            to="/login"
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
            Sign in
          </Typography>
        </Typography>
      </Box>
    </Paper>
  );
}
```
