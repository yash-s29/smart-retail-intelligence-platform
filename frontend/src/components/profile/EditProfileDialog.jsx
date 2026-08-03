import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Slide,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

import { updateProfile } from '../../services/userApi';

export default function EditProfileDialog({ open, onClose, user, onSaved }) {
  const [form, setForm] = useState({
    name: user?.full_name || user?.name || '',
    phone: user?.phone || '',
    role: user?.role || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setForm({
        name: user?.full_name || user?.name || '',
        phone: user?.phone || '',
        role: user?.role || '',
      });
      setError(null);
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = { 
        full_name: form.name, 
        phone: form.phone, 
        role: form.role 
      };
      await updateProfile(payload);
      if (onSaved) await onSaved();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(12px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.35rem',
          fontWeight: 700,
          color: 'text.primary',
          pb: 1,
          pt: 3,
          px: 3,
        }}
      >
        Edit Profile
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 3, px: 3 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            InputLabelProps={{
              sx: { fontSize: '1rem', fontWeight: 600 },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#4f46e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4f46e5',
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            InputLabelProps={{
              sx: { fontSize: '1rem', fontWeight: 600 },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#4f46e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4f46e5',
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            InputLabelProps={{
              sx: { fontSize: '1rem', fontWeight: 600 },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#4f46e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4f46e5',
                },
              },
            }}
          />

          {error && (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '12px',
            px: 4,
            py: 1.2,
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
            borderRadius: '12px',
            px: 5,
            py: 1.2,
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)',
              boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
            },
            '&:active': {
              transform: 'scale(0.97)',
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}