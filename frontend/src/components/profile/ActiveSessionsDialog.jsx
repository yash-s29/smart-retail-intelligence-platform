import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";

import { COLORS } from "./shared";

function ActiveSessionsDialog({ open, onClose, sessions = [] }) {
  const getIcon = (device) => {
    const value = (device || "").toLowerCase();
    if (value.includes("mobile") || value.includes("iphone") || value.includes("android")) return <SmartphoneRoundedIcon />;
    if (value.includes("laptop") || value.includes("desktop") || value.includes("mac") || value.includes("windows")) return <LaptopMacRoundedIcon />;
    return <DevicesRoundedIcon />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
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
      <DialogTitle sx={{ fontWeight: 800, fontSize: "1.1rem", color: COLORS.ink, pb: 0.5, pt: 2.5, px: 2.5 }}>
        Active sessions
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, pb: 2.5 }}>
        <Stack spacing={1.5}>
          {sessions.length === 0 && (
            <Typography sx={{ color: COLORS.slate, textAlign: "center", py: 4, fontSize: ".8rem" }}>
              No active sessions found.
            </Typography>
          )}

          {sessions.map((session, index) => (
            <Box key={index}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{
                  p: 1.5,
                  borderRadius: "13px",
                  bgcolor: COLORS.aquaPale,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <Stack direction="row" spacing={1.4} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                  <Avatar sx={{ bgcolor: COLORS.primary, width: 40, height: 40 }}>{getIcon(session.device)}</Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 750, fontSize: ".82rem", color: COLORS.ink }} noWrap>
                      {session.device || "Unknown device"}
                    </Typography>
                    <Typography sx={{ fontSize: ".68rem", color: COLORS.slate, mt: 0.2 }} noWrap>
                      {session.location || "Unknown location"} · {session.last_active || "Just now"}
                    </Typography>
                  </Box>
                </Stack>

                {session.current ? (
                  <Chip
                    label="Current session"
                    size="small"
                    sx={{ bgcolor: COLORS.successSoft, color: COLORS.success, fontWeight: 800, fontSize: ".65rem" }}
                  />
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: "9px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: ".68rem",
                      color: COLORS.danger,
                      borderColor: COLORS.danger,
                      "&:hover": { bgcolor: COLORS.dangerSoft, borderColor: COLORS.danger },
                    }}
                  >
                    Log out
                  </Button>
                )}
              </Stack>

              {index !== sessions.length - 1 && <Divider sx={{ mt: 1.5, borderColor: COLORS.border }} />}
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="contained"
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 750,
            borderRadius: "10px",
            px: 3.5,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
            "&:hover": { background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primaryDeep})` },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActiveSessionsDialog;
