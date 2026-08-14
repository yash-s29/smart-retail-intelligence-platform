import React from "react";
import { Dialog, DialogContent, DialogActions, Button, Stack, Slide, Box, Typography, Alert } from "@mui/material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

import { COLORS } from "./shared";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteAccountDialog({ open, onClose, onConfirm }) {
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
            boxShadow: "0 25px 60px rgba(16,77,96,.2)",
          },
        },
        backdrop: { sx: { backgroundColor: "rgba(18,49,61,.45)", backdropFilter: "blur(6px)" } },
      }}
    >
      <DialogContent sx={{ pt: 3, pb: 1.5, px: 2.75 }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Box
            sx={{
              p: 1.75,
              borderRadius: "16px",
              bgcolor: COLORS.dangerSoft,
              border: `1.5px solid ${COLORS.danger}22`,
            }}
          >
            <WarningRoundedIcon sx={{ color: COLORS.danger, fontSize: "2.5rem" }} />
          </Box>

          <Stack spacing={1}>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: 850, color: COLORS.ink, letterSpacing: "-.02em" }}>
              Delete account?
            </Typography>

            <Typography sx={{ fontSize: ".82rem", color: COLORS.slate, maxWidth: 340, lineHeight: 1.5 }}>
              This is permanent. Your account, store data, products, and reports will be deleted.
            </Typography>

            <Alert
              severity="error"
              sx={{ mt: 1.5, borderRadius: "10px", textAlign: "left", bgcolor: COLORS.dangerSoft, fontSize: ".78rem" }}
            >
              This cannot be recovered. Are you sure?
            </Alert>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.75, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            textTransform: "none",
            fontWeight: 750,
            borderRadius: "10px",
            py: 1.1,
            borderColor: COLORS.border,
            color: COLORS.slate,
            "&:hover": { borderColor: COLORS.aqua, bgcolor: COLORS.aquaSoft },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          fullWidth
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 800,
            bgcolor: COLORS.danger,
            borderRadius: "10px",
            py: 1.1,
            fontSize: ".8rem",
            boxShadow: "0 6px 16px rgba(214,91,91,.28)",
            "&:hover": { bgcolor: "#C24C4C" },
          }}
        >
          Yes, delete permanently
        </Button>
      </DialogActions>
    </Dialog>
  );
}
