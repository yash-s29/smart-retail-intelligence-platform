// src/components/profile/PasswordDialog.jsx
// Change password dialog with guaranteed-visible eye toggle icons.
// Uses slotProps.input (MUI v6/v7 API) instead of the deprecated
// InputProps prop, which silently fails to render adornments on
// newer MUI versions — this was the root cause of the missing icons.

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, Slide, IconButton,
  Alert, CircularProgress, Box, Typography, LinearProgress,
  InputAdornment,
} from '@mui/material';
import {
  Check as CheckIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';

import { changePassword } from '../../services/authApi';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* ─── Password strength scoring ──────────────────────────── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '#e2e8f0' };
  let score = 0;
  if (pw.length >= 8)          score += 1;
  if (pw.length >= 12)         score += 1;
  if (/[A-Z]/.test(pw))        score += 1;
  if (/[0-9]/.test(pw))        score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  if (score <= 1) return { score: 20,  label: 'Weak',         color: '#dc2626' };
  if (score <= 2) return { score: 40,  label: 'Fair',         color: '#f59e0b' };
  if (score === 3) return { score: 65,  label: 'Good',         color: '#eab308' };
  if (score === 4) return { score: 85,  label: 'Strong',       color: '#22c55e' };
  return                   { score: 100, label: 'Very Strong',  color: '#16a34a' };
}

/* ─── Password field — manually composed, no InputProps ──── */
function PasswordField({ label, name, value, onChange, show, onToggleShow, error }) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      size="medium"
      autoComplete={name === 'current' ? 'current-password' : 'new-password'}
      error={!!error}
      helperText={error || ' '}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ fontSize: '1.2rem', color: '#94a3b8' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={show ? 'Hide password' : 'Show password'}
                onClick={onToggleShow}
                edge="end"
                sx={{
                  color: '#64748b',
                  '&:hover': {
                    color: '#4f46e5',
                    backgroundColor: 'rgba(79,70,229,0.08)',
                  },
                }}
              >
                {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '14px',
          backgroundColor: 'rgba(248, 250, 252, 0.7)',
          '& fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
          '&:hover fieldset': { borderColor: '#a5b4fc' },
          '&.Mui-focused fieldset': { borderColor: '#4f46e5', borderWidth: '2px' },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' },
      }}
    />
  );
}

export default function PasswordDialog({ open, onClose, onSaved }) {
  const [form, setForm]               = useState({ current: '', new: '', confirm: '' });
  const [show, setShow]               = useState({ current: false, new: false, confirm: false });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(null);

  useEffect(() => {
    if (!open) {
      setForm({ current: '', new: '', confirm: '' });
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

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    const errs = {};
    if (!form.current) errs.current = 'Enter your current password.';
    if (!form.new) {
      errs.new = 'Enter a new password.';
    } else if (form.new.length < 8) {
      errs.new = 'Must be at least 8 characters.';
    }
    if (form.confirm !== form.new) {
      errs.confirm = 'Passwords do not match.';
    }
    if (form.current && form.new && form.current === form.new) {
      errs.new = 'New password must differ from current password.';
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
      await changePassword({
        current_password: form.current,
        new_password: form.new,
      });
      setSuccess('Password updated successfully!');
      if (onSaved) onSaved();
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to update password. Please try again.');
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
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
          },
        },
        backdrop: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(12px)' },
        },
      }}
    >
      <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 700, pt: 3.5, px: 3.5, pb: 1 }}>
        Change Password
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 3, px: 3.5 }}>
        <Stack spacing={2.5}>

          <PasswordField
            label="Current Password"
            name="current"
            value={form.current}
            onChange={handleChange}
            show={show.current}
            onToggleShow={() => toggleShow('current')}
            error={fieldErrors.current}
          />

          <Box>
            <PasswordField
              label="New Password"
              name="new"
              value={form.new}
              onChange={handleChange}
              show={show.new}
              onToggleShow={() => toggleShow('new')}
              error={fieldErrors.new}
            />

            {form.new && (
              <Box sx={{ mt: -1.5, mb: 0.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 600 }}>
                    Password strength
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: strength.color }}>
                    {strength.label}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={strength.score}
                  sx={{
                    height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.06)',
                    '& .MuiLinearProgress-bar': { backgroundColor: strength.color, borderRadius: 3 },
                  }}
                />
              </Box>
            )}
          </Box>

          <PasswordField
            label="Confirm New Password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            show={show.confirm}
            onToggleShow={() => toggleShow('confirm')}
            error={fieldErrors.confirm}
          />

          <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', pl: 0.5 }}>
            Use at least 8 characters, mixing uppercase, numbers, and symbols for a stronger password.
          </Typography>

          {error   && <Alert severity="error"   sx={{ borderRadius: '12px' }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ borderRadius: '12px' }}>{success}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3.5, pt: 0, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ flex: 1, borderRadius: '12px', textTransform: 'none', fontWeight: 600, py: 1.3 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
          sx={{
            flex: 1,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 700,
            py: 1.3,
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
              boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
            },
          }}
        >
          Update Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}