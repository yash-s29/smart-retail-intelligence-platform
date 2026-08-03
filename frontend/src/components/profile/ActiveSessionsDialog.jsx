import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import LaptopMacOutlinedIcon from "@mui/icons-material/LaptopMacOutlined";

function ActiveSessionsDialog({
  open,
  onClose,
  sessions = [],
}) {
  const getIcon = (device) => {
    const value = (device || "").toLowerCase();

    if (value.includes("mobile") || value.includes("iphone") || value.includes("android")) {
      return <SmartphoneOutlinedIcon />;
    }

    if (value.includes("laptop") || value.includes("desktop") || value.includes("mac") || value.includes("windows")) {
      return <LaptopMacOutlinedIcon />;
    }

    return <DevicesOutlinedIcon />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={undefined} // Using default for smoother feel
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
          fontWeight: 700,
          fontSize: '1.45rem',
          pb: 1,
          pt: 3,
          px: 3,
        }}
      >
        Active Sessions
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Stack spacing={3}>
          {sessions.length === 0 && (
            <Typography
              color="text.secondary"
              textAlign="center"
              sx={{ py: 6 }}
            >
              No active sessions found.
            </Typography>
          )}

          {sessions.map((session, index) => (
            <Box key={index}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: '16px',
                  backgroundColor: 'rgba(249, 250, 251, 0.7)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(249, 250, 251, 0.95)',
                    borderColor: 'rgba(79, 70, 229, 0.2)',
                  },
                }}
              >
                {/* Device Info */}
                <Stack
                  direction="row"
                  spacing={2.5}
                  alignItems="center"
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 52,
                      height: 52,
                    }}
                  >
                    {getIcon(session.device)}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography 
                      fontWeight={600} 
                      sx={{ fontSize: '1.05rem' }}
                    >
                      {session.device || "Unknown Device"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {session.location || "Unknown Location"}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      Last Active: {session.last_active || "Just now"}
                    </Typography>
                  </Box>
                </Stack>

                {/* Status / Action */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  {session.current ? (
                    <Chip
                      label="Current Session"
                      color="success"
                      size="medium"
                      sx={{
                        fontWeight: 700,
                        px: 2,
                      }}
                    />
                  ) : (
                    <Button
                      color="error"
                      variant="outlined"
                      size="medium"
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                      }}
                    >
                      Logout Device
                    </Button>
                  )}
                </Stack>
              </Stack>

              {index !== sessions.length - 1 && (
                <Divider sx={{ mt: 3 }} />
              )}
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '12px',
            px: 5,
            py: 1.2,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActiveSessionsDialog;