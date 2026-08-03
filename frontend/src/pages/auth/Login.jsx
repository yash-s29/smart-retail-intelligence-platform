// src/pages/auth/Login.jsx
// Self-contained card — sits inside AuthLayout <Outlet />.
// All logic unchanged: useAuth, login(), localStorage, navigate.
// Uses slotProps.input (MUI v6/v7) so eye icon always renders.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
import ShieldRounded        from "@mui/icons-material/ShieldRounded";
import AutoGraphOutlined    from "@mui/icons-material/AutoGraphOutlined";
import Inventory2Outlined   from "@mui/icons-material/Inventory2Outlined";
import InsightsOutlined     from "@mui/icons-material/InsightsOutlined";

import { useAuth } from "../../hooks/useAuth";
import logo        from "../../assets/images/logo.png";

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
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", p: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460, // Slimmer than register for a focused login experience
          borderRadius: "16px",
          p: { xs: 3, sm: 5 },
          bgcolor: "rgba(255, 255, 255, 0.98)",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 40px -10px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>
          
          {/* ── Header Section ── */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", mb: 4, width: "100%" }}>
            <Avatar
              src={logo}
              alt="Smart Retail Logo"
              sx={{ width: 64, height: 64, mb: 2, borderRadius: "14px", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
            />
            <Typography variant="h5" fontWeight={800} color="#0f172a" gutterBottom>
              Welcome back
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
              Sign in to access your inventory and AI insights.
            </Typography>
          </Box>

          {/* ── Alerts ── */}
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
                      <EmailOutlined sx={{ fontSize: "1.1rem", color: "#94a3b8" }} />
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
                      <LockOutlined sx={{ fontSize: "1.1rem", color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small" edge="end" tabIndex={-1}
                        onClick={() => setShowPw((p) => !p)}
                        sx={{ color: "#94a3b8", "&:hover": { color: "#2563eb" } }}
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
                mt: -0.5 
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small" checked={rememberMe}
                    onChange={(e) => setRemember(e.target.checked)}
                    sx={{ color: "#94a3b8", "&.Mui-checked": { color: "#2563eb" }, p: 0.8 }}
                  />
                }
                label={<Typography fontSize="0.875rem" color="#64748b">Remember me</Typography>}
              />
              <Typography
                component={Link} to="/forgot-password"
                sx={{
                  fontSize: "0.875rem", 
                  fontWeight: 600, 
                  color: "#2563eb",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            {/* ── Submit Button ── */}
            <Button
              type="submit" fullWidth variant="contained"
              disabled={loading}
              endIcon={!loading && <ArrowForwardRounded />}
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
              direction="row" spacing={1.2} alignItems="center" justifyContent="center"
              sx={{ py: 1 }}
            >
              
             
            </Stack>
          </Stack>

          {/* ── Divider ── */}
          <Divider sx={{ my: 3, opacity: 0.6 }} />

          

          {/* ── Register link ── */}
          <Typography textAlign="center" fontSize="0.875rem" color="#64748b">
            Don't have an account?{" "}
            <Typography
              component={Link} to="/register"
              sx={{
                color: "#2563eb", fontWeight: 600,
                textDecoration: "none", display: "inline",
                "&:hover": { textDecoration: "underline" },
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