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
  Alert,
  CircularProgress,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { updateProfile } from "../../services/userApi";
import { COLORS } from "./shared";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "11px",
    "&:hover fieldset": { borderColor: COLORS.aqua },
    "&.Mui-focused fieldset": { borderColor: COLORS.primary },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: COLORS.primary },
};

export default function EditProfileDialog({ open, onClose, user, onSaved }) {
  const [form, setForm] = useState({
    name: user?.full_name || user?.name || "",
    phone: user?.phone || "",
    role: user?.role || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setForm({
        name: user?.full_name || user?.name || "",
        phone: user?.phone || "",
        role: user?.role || "",
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
      await updateProfile({ full_name: form.name, phone: form.phone, role: form.role });
      if (onSaved) await onSaved();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to update profile. Please try again.");
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
      <DialogTitle sx={{ fontSize: "1.1rem", fontWeight: 800, color: COLORS.ink, pb: 1, pt: 2.5, px: 2.75 }}>
        Edit profile
      </DialogTitle>

      <DialogContent sx={{ pt: 0.5, pb: 2.5, px: 2.75 }}>
        <Stack spacing={2}>
          <TextField fullWidth label="Full name" name="name" value={form.name} onChange={handleChange} size="small" sx={fieldSx} />
          <TextField fullWidth label="Phone number" name="phone" value={form.phone} onChange={handleChange} size="small" sx={fieldSx} />
          <TextField fullWidth label="Role" name="role" value={form.role} onChange={handleChange} size="small" sx={fieldSx} />

          {error && <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.75, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px",
            px: 2.5,
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
            textTransform: "none",
            fontWeight: 750,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
            borderRadius: "10px",
            px: 3,
            boxShadow: "0 6px 16px rgba(16,121,159,.24)",
            "&:hover": { background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primaryDeep})` },
          }}
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
