// src/pages/auth/Login.jsx
// Self-contained card — sits inside AuthLayout <Outlet />.
// All logic unchanged: useAuth, login(), localStorage, navigate.
// Uses slotProps.input (MUI v6/v7) so eye icon always renders.
// Visual pass: sea-water blue / sand / white palette, animated logo ring,
// drifting ambient blobs, glassmorphism card, shimmer CTA. Respects
// prefers-reduced-motion throughout.

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
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

import EmailOutlined        from "@mui/icons-material/EmailOutlined";
import LockOutlined         from "@mui/icons-material/LockOutlined";
import Visibility           from "@mui/icons-material/Visibility";
import VisibilityOff        from "@mui/icons-material/VisibilityOff";
import ArrowForwardRounded  from "@mui/icons-material/ArrowForwardRounded";
import VerifiedUserRounded  from "@mui/icons-material/VerifiedUserRounded";

import { useAuth } from "../../hooks/useAuth";
import logo        from "../../assets/images/logo.png";

/* ─────────────────────────────────────────────────────────
   Palette — "sea water" theme
   sea-50  #F2FAFC  wash background
   sea-100 #E3F4F9  card tint
   sea-200 #C7E9F2  borders / hover fills
   sea-400 #6FC3DE  mid accent
   ocean-500 #1F8FBE  primary
   ocean-600 #14739A  primary hover
   ocean-700 #0E5A78  primary active / text accent
   sand-100 #F7F0E3  warm neutral accent
   sand-200 #EEE2C8  warm neutral border
   ink     #10222B  headline text
   slate   #5B7481  supporting text
───────────────────────────────────────────────────────── */

/* ─── Keyframes ──────────────────────────────────────────── */
const drift1 = keyframes`
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(24px, -18px) scale(1.08); }
  100% { transform: translate(0, 0) scale(1); }
`;

const drift2 = keyframes`
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(-20px, 16px) scale(1.06); }
  100% { transform: translate(0, 0) scale(1); }
`;

const rotateRing = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const floatLogo = keyframes`
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
`;

const cardIn = keyframes`
  from { opacity: 0; transform: translateY(18px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmerSweep = keyframes`
  0%   { transform: translateX(-120%) skewX(-15deg); }
  100% { transform: translateX(220%) skewX(-15deg); }
`;

const reduceMotion = { "@media (prefers-reduced-motion: reduce)": { animation: "none !important" } };

/* ─── Shared field style ─────────────────────────────────── */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    fontSize: "0.875rem",
    transition: "all 0.25s ease-in-out",
    "& fieldset": { borderColor: "#C7E9F2" },
    "&:hover fieldset": { borderColor: "#6FC3DE" },
    "&.Mui-focused": { backgroundColor: "#ffffff" },
    "&.Mui-focused fieldset": {
      borderColor: "#1F8FBE",
      borderWidth: "1.5px",
      boxShadow: "0 0 0 4px rgba(31, 143, 190, 0.12)",
    },
  },
  "& .MuiInputLabel-root": { fontSize: "0.875rem", color: "#5B7481" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1F8FBE" },
};

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [form, setForm]         = useState({ email: "", password: "" });
  const [rememberMe, setRemember] = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      const response = await login(form);
      if (response?.access_token) {
        localStorage.setItem("access_token", response.access_token);
      }
      setSuccess("Login successful. Redirecting…");
      setTimeout(() => navigate("/dashboard", { replace: true }), 1000);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      let msg = err?.message || "Unable to login.";
      if (detail) {
        if (Array.isArray(detail))         msg = detail.map((d) => d.msg).join(", ");
        else if (typeof detail === "string") msg = detail;
      }
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, sm: 3 },
        overflow: "hidden",
        background: "linear-gradient(160deg, #F2FAFC 0%, #EAF6FA 45%, #F7F0E3 100%)",
      }}
    >
      {/* ── Ambient drifting sea blobs (decorative, hidden on xs) ── */}
      <Box
        aria-hidden
        sx={{
          display: { xs: "none", sm: "block" },
          position: "absolute",
          top: "-8%",
          left: "-6%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #BDEBF7 0%, rgba(189,235,247,0) 70%)",
          filter: "blur(6px)",
          animation: `${drift1} 16s ease-in-out infinite`,
          ...reduceMotion,
        }}
      />
      <Box
        aria-hidden
        sx={{
          display: { xs: "none", sm: "block" },
          position: "absolute",
          bottom: "-10%",
          right: "-8%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle at 60% 40%, #F0E5CC 0%, rgba(240,229,204,0) 70%)",
          filter: "blur(8px)",
          animation: `${drift2} 20s ease-in-out infinite`,
          ...reduceMotion,
        }}
      />
      <Box
        aria-hidden
        sx={{
          display: { xs: "none", md: "block" },
          position: "absolute",
          top: "18%",
          right: "12%",
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, #DFF4FA 0%, rgba(223,244,250,0) 72%)",
          animation: `${drift1} 13s ease-in-out infinite reverse`,
          ...reduceMotion,
        }}
      />

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 460,
          borderRadius: "20px",
          p: { xs: 3, sm: 5 },
          bgcolor: "rgba(255, 255, 255, 0.86)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(199, 233, 242, 0.9)",
          boxShadow: "0 20px 60px -20px rgba(14, 90, 120, 0.25), 0 2px 8px rgba(14, 90, 120, 0.06)",
          animation: `${cardIn} 0.7s cubic-bezier(0.16, 1, 0.3, 1)`,
          ...reduceMotion,
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>

          {/* ── Header Section ── */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", mb: 4, width: "100%" }}>

            {/* Animated logo — rotating gradient ring + gentle float */}
            <Box
              sx={{
                position: "relative",
                width: 78,
                height: 78,
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: `${floatLogo} 4.5s ease-in-out infinite`,
                ...reduceMotion,
              }}
            >
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "conic-gradient(from 0deg, #1F8FBE, #6FC3DE, #F0E5CC, #1F8FBE)",
                  animation: `${rotateRing} 7s linear infinite`,
                  opacity: 0.85,
                  ...reduceMotion,
                }}
              />
              <Avatar
                src={logo}
                alt="Smart Retail Logo"
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "14px",
                  boxShadow: "0 6px 18px rgba(14, 90, 120, 0.18)",
                  border: "3px solid #ffffff",
                }}
              />
            </Box>

            <Typography variant="h5" fontWeight={800} color="#10222B" gutterBottom letterSpacing="-0.01em">
              Welcome back
            </Typography>
            <Typography sx={{ color: "#5B7481", fontSize: "0.9rem" }}>
              Sign in to access your inventory and AI insights.
            </Typography>
          </Box>

          {/* ── Alerts ── */}
          {success && (
            <Alert
              severity="success"
              sx={{ mb: 3, borderRadius: "10px", animation: `${fadeIn} 0.35s ease-out`, ...reduceMotion }}
            >
              {success}
            </Alert>
          )}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: "10px", animation: `${fadeIn} 0.35s ease-out`, ...reduceMotion }}
            >
              {error}
            </Alert>
          )}

          <Stack spacing={2.5}>
            {/* ── Email ── */}
            <TextField
              fullWidth required size="small"
              name="email" label="Email Address" type="email"
              value={form.email} onChange={handleChange}
              autoComplete="email" placeholder="you@example.com"
              sx={fieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ fontSize: "1.1rem", color: "#6FC3DE" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* ── Password ── */}
            <TextField
              fullWidth required size="small"
              name="password" label="Password"
              type={showPw ? "text" : "password"}
              value={form.password} onChange={handleChange}
              autoComplete="current-password"
              sx={fieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ fontSize: "1.1rem", color: "#6FC3DE" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small" edge="end" tabIndex={-1}
                        onClick={() => setShowPw((p) => !p)}
                        sx={{
                          color: "#94a8b3",
                          transition: "color 0.2s ease, transform 0.2s ease",
                          "&:hover": { color: "#1F8FBE", transform: "scale(1.08)" },
                        }}
                      >
                        {showPw
                          ? <VisibilityOff sx={{ fontSize: "1.1rem" }} />
                          : <Visibility    sx={{ fontSize: "1.1rem" }} />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* ── Remember & Forgot Password ── */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                mt: -0.5,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small" checked={rememberMe}
                    onChange={(e) => setRemember(e.target.checked)}
                    sx={{ color: "#94a8b3", "&.Mui-checked": { color: "#1F8FBE" }, p: 0.8 }}
                  />
                }
                label={<Typography fontSize="0.875rem" color="#5B7481">Remember me</Typography>}
              />
              <Typography
                component={Link} to="/forgot-password"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#1F8FBE",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "#0E5A78", textDecoration: "underline" },
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            {/* ── Submit Button (animated shimmer sweep on hover) ── */}
            <Button
              type="submit" fullWidth variant="contained"
              disabled={loading}
              endIcon={!loading && <ArrowForwardRounded sx={{ transition: "transform 0.25s ease" }} />}
              sx={{
                position: "relative",
                overflow: "hidden",
                height: 48,
                fontWeight: 600,
                fontSize: "0.95rem",
                borderRadius: "10px",
                textTransform: "none",
                background: "linear-gradient(135deg, #2CA6D6 0%, #14739A 100%)",
                boxShadow: "0 6px 16px rgba(20, 115, 154, 0.28)",
                transition: "all 0.25s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #1F94C4 0%, #0E5A78 100%)",
                  boxShadow: "0 10px 22px rgba(14, 90, 120, 0.32)",
                  transform: "translateY(-2px)",
                  "& .btn-shimmer": { animation: `${shimmerSweep} 1.1s ease` },
                  "& .MuiButton-endIcon": { transform: "translateX(3px)" },
                },
                "&:active": { transform: "translateY(0)" },
                "&.Mui-disabled": { background: "#DCE7EA", color: "#93A6AD", boxShadow: "none" },
              }}
            >
              {/* shimmer sweep overlay */}
              <Box
                className="btn-shimmer"
                aria-hidden
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "40%",
                  height: "100%",
                  background: "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
                  pointerEvents: "none",
                }}
              />
              {loading
                ? <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} color="inherit" />
                    <span>Signing in…</span>
                  </Stack>
                : "Sign In"
              }
            </Button>

            {/* ── Security notice ── */}
            <Stack
              direction="row" spacing={1} alignItems="center" justifyContent="center"
              sx={{ py: 0.5 }}
            >
              <VerifiedUserRounded sx={{ fontSize: "1rem", color: "#6FC3DE" }} />
              <Typography sx={{ fontSize: "0.78rem", color: "#8CA0AA", fontWeight: 500 }}>
                Your connection is secured and encrypted
              </Typography>
            </Stack>
          </Stack>

          {/* ── Divider ── */}
          <Divider sx={{ my: 3, opacity: 0.6, borderColor: "#C7E9F2" }} />

          {/* ── Register link ── */}
          <Typography textAlign="center" fontSize="0.875rem" color="#5B7481">
            Don't have an account?{" "}
            <Typography
              component={Link} to="/register"
              sx={{
                color: "#1F8FBE", fontWeight: 600,
                textDecoration: "none", display: "inline",
                transition: "color 0.2s ease",
                "&:hover": { color: "#0E5A78", textDecoration: "underline" },
              }}
            >
              Create one free
            </Typography>
          </Typography>

        </Box>
      </Paper>
    </Box>
  );
}
