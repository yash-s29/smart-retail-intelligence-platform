import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Slide,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

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
      PaperProps={{
        sx: {
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.18)',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(12px)',
        },
      }}
    >
      <DialogContent sx={{ pt: 4, pb: 2, px: 3 }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          {/* Warning Icon */}
          <Box
            sx={{
              p: 2.5,
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              borderRadius: '20px',
              border: '2px solid rgba(220, 38, 38, 0.15)',
            }}
          >
            <WarningIcon sx={{ color: '#dc2626', fontSize: '3.5rem' }} />
          </Box>

          {/* Content */}
          <Stack spacing={1.5}>
            <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: '-0.03em',
              }}
            >
              Delete Account?
            </Typography>
            
            <Typography
              sx={{
                fontSize: '1.05rem',
                color: 'text.secondary',
                maxWidth: '380px',
                lineHeight: 1.5,
              }}
            >
              This action is permanent and cannot be undone. 
              Your account, store data, products, reports, and all associated information will be permanently deleted.
            </Typography>

            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
                borderRadius: '12px',
                textAlign: 'left',
                backgroundColor: 'rgba(254, 226, 226, 0.9)'
              }}
            >
              This cannot be recovered. Are you absolutely sure?
            </Alert>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '12px',
            py: 1.5,
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
          onClick={() => {
            onConfirm();   // This will call deleteProfile() from parent → deletes from database
            onClose();
          }}
          variant="contained"
          fullWidth
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 700,
            backgroundColor: '#dc2626',
            borderRadius: '12px',
            py: 1.5,
            '&:hover': {
              backgroundColor: '#b91c1c',
            },
            '&:active': {
              transform: 'scale(0.97)',
            },
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
          }}
        >
          Yes, Permanently Delete Account
        </Button>
      </DialogActions>
    </Dialog>
  );
}