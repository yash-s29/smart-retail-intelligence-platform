// src/pages/auth/Register.jsx
// Self-contained card — sits inside AuthLayout <Outlet />.
// All logic unchanged: useAuth, register(), navigate.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

/* ─── Shared field style — Zoho/Enterprise style ─────────── */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    fontSize: "0.875rem",
    transition: "all 0.2s ease-in-out",
    "& fieldset": { borderColor: "#d1d5db" },
    "&:hover fieldset": { borderColor: "#94a3b8" },
    "&.Mui-focused": { backgroundColor: "#ffffff" },
    "&.Mui-focused fieldset": { 
      borderColor: "#2563eb", 
      borderWidth: "1.5px",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)"
    },
  },
  "& .MuiInputLabel-root": { fontSize: "0.875rem", color: "#64748b" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
};

/* ─── Adornment helper ───────────────────────────────────── */
function StartIcon({ icon: Icon }) {
  return (
    <InputAdornment position="start">
      <Icon sx={{ fontSize: "1.1rem", color: "#94a3b8" }} />
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
          borderRadius: "16px",
          p: { xs: 3, sm: 5 },
          bgcolor: "rgba(255, 255, 255, 0.98)",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 40px -10px rgba(15, 23, 42, 0.08)",
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            src={logo}
            alt="Smart Retail Logo"
            sx={{ width: 56, height: 56, mx: "auto", mb: 2, borderRadius: "12px", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
          />
          <Typography variant="h5" fontWeight={800} color="#0f172a" gutterBottom>
            Let's get started
          </Typography>
          <Typography variant="body2" color="#64748b">
            Set up your account to get started with Smart Retail.
          </Typography>
        </Box>

        {/* Alerts */}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: "8px" }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "8px" }}>
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
                          sx={{ color: "#94a3b8" }}
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

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                type="submit" fullWidth variant="contained"
                disabled={loading}
                endIcon={!loading && <PersonAddAltOutlinedIcon />}
                sx={{
                  height: 48,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  borderRadius: "8px",
                  textTransform: "none",
                  bgcolor: "#2563eb",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.15)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#1d4ed8",
                    boxShadow: "0 6px 16px rgba(37,99,235,0.25)",
                    transform: "translateY(-1px)",
                  },
                  "&.Mui-disabled": { bgcolor: "#e2e8f0", color: "#94a3b8", boxShadow: "none" },
                }}
              >
                {loading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} color="inherit" />
                    <span>Creating Account…</span>
                  </Stack>
                ) : (
                  "Sign Up for Free"
                )}
              </Button>
              
              <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#94a3b8", mt: 2 }}>
                By clicking sign up, you agree to our Terms of Service and Privacy Policy.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3, opacity: 0.6 }} />

        {/* Login Link */}
        <Typography textAlign="center" fontSize="0.875rem" color="#64748b">
          Already have an account?{" "}
          <Typography
            component={Link} to="/login"
            sx={{
              color: "#2563eb", fontWeight: 600,
              textDecoration: "none", display: "inline",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign in
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
}