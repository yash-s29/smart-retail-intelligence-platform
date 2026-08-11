// src/pages/auth/Register.jsx
// Self-contained card — sits inside AuthLayout <Outlet />.
// All logic unchanged: useAuth, register(), navigate.
// Visual pass: same sea-water blue / sand / white palette and
// animated logo ring as Login.jsx, for a consistent auth experience.

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
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

import Visibility                from "@mui/icons-material/Visibility";
import VisibilityOff             from "@mui/icons-material/VisibilityOff";
import PersonAddAltOutlinedIcon  from "@mui/icons-material/PersonAddAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon         from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon          from "@mui/icons-material/LockOutlined";
import StorefrontOutlinedIcon    from "@mui/icons-material/StorefrontOutlined";
import LocationOnOutlinedIcon    from "@mui/icons-material/LocationOnOutlined";
import CategoryOutlinedIcon      from "@mui/icons-material/CategoryOutlined";

import { useAuth } from "../../hooks/useAuth";
import logo        from "../../assets/images/logo.png";

/* ─── Constants ──────────────────────────────────────────── */
const BUSINESS_TYPES = [
  "Grocery", "Fashion", "Electronics", "Pharmacy", "General Retail",
];

/* ─── Keyframes (shared visual language with Login.jsx) ──── */
const rotateRing = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const floatLogo = keyframes`
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-5px); }
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

/* ─── Shared field style — sea-water theme ───────────────── */
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

/* ─── Adornment helper ───────────────────────────────────── */
function StartIcon({ icon: Icon }) {
  return (
    <InputAdornment position="start">
      <Icon sx={{ fontSize: "1.1rem", color: "#6FC3DE" }} />
    </InputAdornment>
  );
}

export default function Register() {
  const navigate  = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    full_name        : "",
    email            : "",
    password         : "",
    store_name       : "",
    store_type       : "General Retail",
    location         : "",
    business_category: "",
  });

  const [showPw,  setShowPw]  = useState(false);
  const [success, setSuccess] = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await register(form);
      setSuccess("Account created successfully. Redirecting…");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      let msg = err?.message || "Registration failed";
      if (detail) {
        if (Array.isArray(detail))
          msg = detail.map((d) => d?.msg || JSON.stringify(d)).join("; ");
        else if (typeof detail === "object")
          msg = detail.detail || Object.entries(detail).map(([k,v]) => `${k}: ${v}`).join("; ");
        else
          msg = String(detail);
      }
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", p: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 600, // Perfectly sized for the right side of your layout
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
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>

          {/* Animated logo — rotating gradient ring + gentle float */}
          <Box
            sx={{
              position: "relative",
              width: 70,
              height: 70,
              mx: "auto",
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
                background: "conic-gradient(from 0deg, #1F8FBE, #6FC3DE, #D9A45B, #1F8FBE)",
                animation: `${rotateRing} 7s linear infinite`,
                opacity: 0.85,
                ...reduceMotion,
              }}
            />
            <Avatar
              src={logo}
              alt="Smart Retail Logo"
              sx={{
                width: 56,
                height: 56,
                borderRadius: "12px",
                boxShadow: "0 6px 18px rgba(14, 90, 120, 0.18)",
                border: "3px solid #ffffff",
              }}
            />
          </Box>

          <Typography variant="h5" fontWeight={800} color="#10222B" gutterBottom letterSpacing="-0.01em">
            Let's get started
          </Typography>
          <Typography variant="body2" sx={{ color: "#5B7481" }}>
            Set up your account to get started with Smart Retail.
          </Typography>
        </Box>

        {/* Alerts */}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: "10px", animation: `${fadeIn} 0.35s ease-out`, ...reduceMotion }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "10px", animation: `${fadeIn} 0.35s ease-out`, ...reduceMotion }}>
            {error}
          </Alert>
        )}

        {/* Form Section */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>

            {/* Row 1 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" required
                label="Full Name" name="full_name"
                value={form.full_name} onChange={handleChange}
                sx={fieldSx}
                slotProps={{ input: { startAdornment: <StartIcon icon={PersonOutlineOutlinedIcon} /> } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" required
                label="Email Address" name="email" type="email"
                value={form.email} onChange={handleChange}
                sx={fieldSx}
                slotProps={{ input: { startAdornment: <StartIcon icon={EmailOutlinedIcon} /> } }}
              />
            </Grid>

            {/* Row 2 (Full Width Password) */}
            <Grid item xs={12}>
              <TextField
                fullWidth size="small" required
                label="Password" name="password"
                type={showPw ? "text" : "password"}
                value={form.password} onChange={handleChange}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: <StartIcon icon={LockOutlinedIcon} />,
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
                          {showPw ? <VisibilityOff sx={{ fontSize: "1.1rem" }} /> : <Visibility sx={{ fontSize: "1.1rem" }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Row 3 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" required
                label="Store Name" name="store_name"
                value={form.store_name} onChange={handleChange}
                sx={fieldSx}
                slotProps={{ input: { startAdornment: <StartIcon icon={StorefrontOutlinedIcon} /> } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" select
                label="Store Type" name="store_type"
                value={form.store_type} onChange={handleChange}
                sx={fieldSx}
                slotProps={{ input: { startAdornment: <StartIcon icon={StorefrontOutlinedIcon} /> } }}
              >
                {BUSINESS_TYPES.map((t) => (
                  <MenuItem key={t} value={t} sx={{ fontSize: "0.875rem" }}>{t}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Row 4 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" required
                label="Location" name="location"
                value={form.location} onChange={handleChange}
                sx={fieldSx}
                slotProps={{ input: { startAdornment: <StartIcon icon={LocationOnOutlinedIcon} /> } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" required
                label="Business Category" name="business_category"
                value={form.business_category} onChange={handleChange}
                placeholder="e.g. FMCG"
                sx={fieldSx}
                slotProps={{ input: { startAdornment: <StartIcon icon={CategoryOutlinedIcon} /> } }}
              />
            </Grid>

            {/* Submit Button — animated shimmer sweep on hover */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                type="submit" fullWidth variant="contained"
                disabled={loading}
                endIcon={!loading && <PersonAddAltOutlinedIcon sx={{ transition: "transform 0.25s ease" }} />}
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
                {loading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} color="inherit" />
                    <span>Creating Account…</span>
                  </Stack>
                ) : (
                  "Sign Up for Free"
                )}
              </Button>

              <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#8CA0AA", mt: 2 }}>
                By clicking sign up, you agree to our Terms of Service and Privacy Policy.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3, opacity: 0.6, borderColor: "#C7E9F2" }} />

        {/* Login Link */}
        <Typography textAlign="center" fontSize="0.875rem" color="#5B7481">
          Already have an account?{" "}
          <Typography
            component={Link} to="/login"
            sx={{
              color: "#1F8FBE", fontWeight: 600,
              textDecoration: "none", display: "inline",
              transition: "color 0.2s ease",
              "&:hover": { color: "#0E5A78", textDecoration: "underline" },
            }}
          >
            Sign in
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
}
