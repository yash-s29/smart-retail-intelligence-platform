// src/components/profile/PasswordDialog.jsx
//
// Uses slotProps.input (MUI v6/v7 API) rather than the deprecated
// InputProps, which is what makes the eye-toggle adornment render.

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Slide,
  IconButton,
  Alert,
  CircularProgress,
  Box,
  Typography,
  LinearProgress,
  InputAdornment,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import LockOutlineRoundedIcon from "@mui/icons-material/LockOutlineRounded";

import { changePassword } from "../../services/authApi";
import { COLORS } from "./shared";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: COLORS.border };
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  if (score <= 1) return { score: 20, label: "Weak", color: COLORS.danger };
  if (score <= 2) return { score: 40, label: "Fair", color: COLORS.warning };
  if (score === 3) return { score: 65, label: "Good", color: "#C9A521" };
  if (score === 4) return { score: 85, label: "Strong", color: COLORS.success };
  return { score: 100, label: "Very strong", color: COLORS.success };
}

function PasswordField({ label, name, value, onChange, show, onToggleShow, error }) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      size="small"
      autoComplete={name === "current" ? "current-password" : "new-password"}
      error={!!error}
      helperText={error || " "}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlineRoundedIcon sx={{ fontSize: "1.05rem", color: COLORS.muted }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={show ? "Hide password" : "Show password"}
                onClick={onToggleShow}
                edge="end"
                size="small"
                sx={{ color: COLORS.slate, "&:hover": { color: COLORS.primary, bgcolor: COLORS.aquaSoft } }}
              >
                {show ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "11px",
          bgcolor: COLORS.aquaPale,
          "&:hover fieldset": { borderColor: COLORS.aqua },
          "&.Mui-focused fieldset": { borderColor: COLORS.primary, borderWidth: "2px" },
        },
        "& .MuiInputLabel-root.Mui-focused": { color: COLORS.primary },
      }}
    />
  );
}

export default function PasswordDialog({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!open) {
      setForm({ current: "", new: "", confirm: "" });
      setShow({ current: false, new: false, confirm: false });
      setFieldErrors({});
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((er) => ({ ...er, [name]: undefined }));
  };

  const toggleShow = (field) => setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const validate = () => {
    const errs = {};
    if (!form.current) errs.current = "Enter your current password.";
    if (!form.new) {
      errs.new = "Enter a new password.";
    } else if (form.new.length < 8) {
      errs.new = "Must be at least 8 characters.";
    }
    if (form.confirm !== form.new) errs.confirm = "Passwords do not match.";
    if (form.current && form.new && form.current === form.new) {
      errs.new = "New password must differ from current password.";
    }
    return errs;
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await changePassword({ current_password: form.current, new_password: form.new });
      setSuccess("Password updated successfully!");
      if (onSaved) onSaved();
      setTimeout(() => onClose(), 1100);
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.new);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "18px",
            border: `1px solid ${COLORS.border}`,
            background: COLORS.white,
            boxShadow: "0 25px 60px rgba(16,77,96,.18)",
          },
        },
        backdrop: { sx: { backgroundColor: "rgba(18,49,61,.4)", backdropFilter: "blur(6px)" } },
      }}
    >
      <DialogTitle sx={{ fontSize: "1.1rem", fontWeight: 800, color: COLORS.ink, pt: 2.5, px: 2.75, pb: 0.5 }}>
        Change password
      </DialogTitle>

      <DialogContent sx={{ pt: 0.5, pb: 2.5, px: 2.75 }}>
        <Stack spacing={2}>
          <PasswordField
            label="Current password"
            name="current"
            value={form.current}
            onChange={handleChange}
            show={show.current}
            onToggleShow={() => toggleShow("current")}
            error={fieldErrors.current}
          />

          <Box>
            <PasswordField
              label="New password"
              name="new"
              value={form.new}
              onChange={handleChange}
              show={show.new}
              onToggleShow={() => toggleShow("new")}
              error={fieldErrors.new}
            />

            {form.new && (
              <Box sx={{ mt: -1.1, mb: 0.5 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                  <Typography sx={{ fontSize: ".65rem", color: COLORS.slate, fontWeight: 700 }}>
                    Password strength
                  </Typography>
                  <Typography sx={{ fontSize: ".65rem", fontWeight: 800, color: strength.color }}>
                    {strength.label}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={strength.score}
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    bgcolor: COLORS.border,
                    "& .MuiLinearProgress-bar": { bgcolor: strength.color, borderRadius: 3 },
                  }}
                />
              </Box>
            )}
          </Box>

          <PasswordField
            label="Confirm new password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            show={show.confirm}
            onToggleShow={() => toggleShow("confirm")}
            error={fieldErrors.confirm}
          />

          <Typography sx={{ fontSize: ".7rem", color: COLORS.slate }}>
            Use 8+ characters mixing uppercase, numbers, and symbols.
          </Typography>

          {error && <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ borderRadius: "10px" }}>{success}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.75, pt: 0, gap: 1.25 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            flex: 1,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 750,
            py: 1.05,
            borderColor: COLORS.border,
            color: COLORS.slate,
            "&:hover": { borderColor: COLORS.aqua, bgcolor: COLORS.aquaSoft },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          disableElevation
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CheckRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            flex: 1,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 800,
            py: 1.05,
            boxShadow: "0 6px 16px rgba(16,121,159,.24)",
            "&:hover": { background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primaryDeep})` },
          }}
        >
          Update password
        </Button>
      </DialogActions>
    </Dialog>
  );
}
