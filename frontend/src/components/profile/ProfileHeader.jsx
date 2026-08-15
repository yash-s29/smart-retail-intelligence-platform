import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import { COLORS, RADIUS, fadeUp, reduceMotion } from "./shared";

/* ============================================================
   Avatar Options
   Illustrated, human-style avatars (DiceBear "avataaars") —
   closer to a real person than the fantasy "adventurer" set,
   and matches the reference style you shared. 12 options gives
   enough real variety without turning the picker into a scroll.
   ============================================================ */

const avatarSrc = (seed, backgroundColor) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${backgroundColor}`;

const AVATAR_OPTIONS = [
  { id: "avatar-1", name: "Aiden", src: avatarSrc("Aiden", "b6e3f4") },
  { id: "avatar-2", name: "Amaya", src: avatarSrc("Amaya", "c0aede") },
  { id: "avatar-3", name: "Kabir", src: avatarSrc("Kabir", "d1d4f9") },
  { id: "avatar-4", name: "Priya", src: avatarSrc("Priya", "ffd5dc") },
  { id: "avatar-5", name: "Rohan", src: avatarSrc("Rohan", "ffdfbf") },
  { id: "avatar-6", name: "Meera", src: avatarSrc("Meera", "c9e4de") },
  { id: "avatar-7", name: "Vihaan", src: avatarSrc("Vihaan", "b6e3f4") },
  { id: "avatar-8", name: "Sara", src: avatarSrc("Sara", "c0aede") },
  { id: "avatar-9", name: "Ishaan", src: avatarSrc("Ishaan", "d1d4f9") },
  { id: "avatar-10", name: "Ananya", src: avatarSrc("Ananya", "ffd5dc") },
  { id: "avatar-11", name: "Dev", src: avatarSrc("Dev", "ffdfbf") },
  { id: "avatar-12", name: "Zara", src: avatarSrc("Zara", "c9e4de") },
];

/* ============================================================
   Contact Item
   ============================================================ */

function ContactItem({ icon: Icon, value }) {
  return (
    <Stack
      direction="row"
      spacing={0.6}
      alignItems="center"
      sx={{
        minWidth: 0,
        maxWidth: "100%",
      }}
    >
      <Icon
        sx={{
          fontSize: 15,
          color: COLORS.muted,
          flexShrink: 0,
        }}
      />

      <Typography
        noWrap
        sx={{
          fontSize: ".72rem",
          color: COLORS.slate,
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: { xs: "170px", sm: "none" },
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

/* ============================================================
   Avatar Picker
   ============================================================ */

function AvatarPicker({ open, onClose, currentAvatar, onConfirm }) {
  // Pre-select something so Confirm is never a dead-end button —
  // falls back to the first option if no avatar has been chosen yet.
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || AVATAR_OPTIONS[0].src);

  React.useEffect(() => {
    if (open) {
      setSelectedAvatar(currentAvatar || AVATAR_OPTIONS[0].src);
    }
  }, [open, currentAvatar]);

  const handleConfirm = () => {
    onConfirm(selectedAvatar);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: { xs: "20px", sm: "24px" },
          overflow: "hidden",
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 24px 70px rgba(16,77,96,.18)",
          background: COLORS.white,
          mx: { xs: 1.5, sm: 2 },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 2.5 },
          pb: 1.2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "12px",
                display: "grid",
                placeItems: "center",
                background: `linear-gradient(135deg, ${COLORS.primary}18, ${COLORS.aquaPale})`,
                border: `1px solid ${COLORS.primary}25`,
                color: COLORS.primary,
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 19 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: ".98rem", sm: "1.05rem" },
                  fontWeight: 850,
                  color: COLORS.ink,
                  lineHeight: 1.2,
                }}
              >
                Choose your avatar
              </Typography>

              <Typography sx={{ mt: 0.25, fontSize: ".68rem", color: COLORS.muted, fontWeight: 600 }}>
                Pick a picture for your profile
              </Typography>
            </Box>
          </Stack>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: COLORS.muted,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.white,
              "&:hover": { background: COLORS.aquaPale, color: COLORS.primary },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Avatar Grid */}
      <DialogContent
        sx={{
          px: { xs: 2, sm: 3 },
          pb: 1.5,
          maxHeight: { xs: "56vh", sm: "60vh" },
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: { xs: 1.1, sm: 1.5 },
            mt: 0.8,
          }}
        >
          {AVATAR_OPTIONS.map((avatar) => {
            const isSelected = selectedAvatar === avatar.src;

            return (
              <motion.button
                key={avatar.id}
                type="button"
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.16 }}
                onClick={() => setSelectedAvatar(avatar.src)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    borderRadius: { xs: "15px", sm: "18px" },
                    display: "grid",
                    placeItems: "center",
                    background: isSelected
                      ? `linear-gradient(135deg, ${COLORS.aquaPale}, ${COLORS.primary}16)`
                      : "#f8fbfc",
                    border: isSelected ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
                    boxShadow: isSelected ? "0 8px 24px rgba(16,121,159,.18)" : "0 4px 12px rgba(16,77,96,.05)",
                    transition: "border .2s ease, box-shadow .2s ease, background .2s ease",
                    overflow: "hidden",
                  }}
                >
                  <Avatar
                    src={avatar.src}
                    alt={avatar.name}
                    sx={{
                      width: { xs: 54, sm: 68 },
                      height: { xs: 54, sm: 68 },
                      border: "3px solid white",
                      boxShadow: "0 6px 16px rgba(16,77,96,.12)",
                    }}
                  />

                  {isSelected && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        background: COLORS.primary,
                        color: COLORS.white,
                        border: "2px solid white",
                        boxShadow: "0 4px 10px rgba(16,121,159,.25)",
                      }}
                    >
                      <CheckRoundedIcon sx={{ fontSize: 13 }} />
                    </Box>
                  )}

                  <Typography
                    sx={{
                      position: "absolute",
                      bottom: 5,
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      fontSize: ".56rem",
                      fontWeight: 750,
                      color: isSelected ? COLORS.primary : COLORS.slate,
                    }}
                  >
                    {avatar.name}
                  </Typography>
                </Box>
              </motion.button>
            );
          })}
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.7, sm: 2 },
          borderTop: `1px solid ${COLORS.border}`,
          background: "#fbfdfe",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            minHeight: 38,
            px: 2,
            borderRadius: "10px",
            color: COLORS.slate,
            textTransform: "none",
            fontWeight: 750,
            fontSize: ".72rem",
            "&:hover": { background: COLORS.aquaPale },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          variant="contained"
          disableElevation
          startIcon={<CheckRoundedIcon sx={{ fontSize: 17 }} />}
          sx={{
            minHeight: 38,
            px: 2,
            borderRadius: "10px",
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
            color: COLORS.white,
            textTransform: "none",
            fontWeight: 800,
            fontSize: ".72rem",
            boxShadow: "0 7px 18px rgba(16,121,159,.18)",
            "&:hover": {
              background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primaryDeep})`,
              boxShadow: "0 9px 22px rgba(16,121,159,.25)",
            },
          }}
        >
          Confirm avatar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ============================================================
   Profile Header
   ============================================================ */

export default function ProfileHeader({ user, onEditClick, onAvatarChange }) {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  const avatarUrl = user.avatarUrl || null;

  return (
    <>
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Card
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            borderRadius: RADIUS,
            border: `1px solid ${COLORS.border}`,
            background: `linear-gradient(135deg, ${COLORS.white} 0%, ${COLORS.aquaPale} 100%)`,
            boxShadow: "0 4px 18px rgba(16,77,96,.06)",
            transition: "box-shadow .22s ease",
            "&:hover": { boxShadow: "0 14px 32px rgba(16,77,96,.1)" },
            ...reduceMotion,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 1.5, sm: 2.5, md: 2.75 },
              "&:last-child": { pb: { xs: 1.5, sm: 2.5, md: 2.75 } },
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 2.25 }}
              alignItems={{ xs: "center", sm: "center" }}
              sx={{ width: "100%", minWidth: 0 }}
            >
              {/* =====================================================
                  Avatar — glow + orbit dots, no dashed ring (that's
                  what caused the "ridge" artifact on mobile: rotating
                  a CSS dashed border via transform renders jagged on
                  some mobile GPUs). Nothing here is a bordered shape
                  being rotated, so it stays crisp on every device.
                  ===================================================== */}

              <Box
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  width: { xs: 82, sm: 92 },
                  height: { xs: 82, sm: 92 },
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <motion.div
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.06, 1], opacity: [0.45, 0.7, 0.45] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    inset: 2,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${COLORS.aqua}28, transparent 68%)`,
                    pointerEvents: "none",
                  }}
                />

                <motion.div
                  animate={prefersReducedMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", pointerEvents: "none" }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 3,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: COLORS.primary,
                      opacity: 0.65,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 9,
                      right: 7,
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: COLORS.aqua,
                      opacity: 0.8,
                    }}
                  />
                </motion.div>

                <motion.button
                  type="button"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.045 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                  onClick={() => setAvatarPickerOpen(true)}
                  aria-label="Change profile avatar"
                  style={{
                    position: "relative",
                    zIndex: 2,
                    border: "none",
                    padding: 0,
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: "50%",
                    outline: "none",
                  }}
                >
                  <Avatar
                    src={avatarUrl || undefined}
                    alt={user.name}
                    sx={{
                      width: { xs: 68, sm: 76 },
                      height: { xs: 68, sm: 76 },
                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                      fontSize: { xs: "1.5rem", sm: "1.7rem" },
                      fontWeight: 900,
                      color: COLORS.white,
                      border: `3px solid ${COLORS.white}`,
                      boxShadow: "0 8px 22px rgba(16,121,159,.25)",
                      transition: "box-shadow .2s ease",
                    }}
                  >
                    {!avatarUrl && user.initials}
                  </Avatar>

                  <Box
                    sx={{
                      position: "absolute",
                      right: -1,
                      bottom: -1,
                      width: { xs: 25, sm: 27 },
                      height: { xs: 25, sm: 27 },
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      background: COLORS.white,
                      color: COLORS.primary,
                      border: `1px solid ${COLORS.border}`,
                      boxShadow: "0 5px 13px rgba(16,77,96,.15)",
                    }}
                  >
                    <CameraAltRoundedIcon sx={{ fontSize: { xs: 13, sm: 14 } }} />
                  </Box>
                </motion.button>

                <Box
                  sx={{
                    position: "absolute",
                    zIndex: 3,
                    bottom: 6,
                    right: { xs: 2, sm: 4 },
                    width: 14,
                    height: 14,
                    bgcolor: COLORS.success,
                    borderRadius: "50%",
                    border: `2.5px solid ${COLORS.white}`,
                    boxShadow: "0 2px 8px rgba(63,145,93,.25)",
                    pointerEvents: "none",
                  }}
                />
              </Box>

              {/* =====================================================
                  Identity
                  ===================================================== */}

              <Box flex={1} minWidth={0} width="100%" textAlign={{ xs: "center", sm: "left" }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: "1.12rem", sm: "1.3rem" },
                    color: COLORS.ink,
                    letterSpacing: "-.02em",
                    lineHeight: 1.2,
                    overflowWrap: "anywhere",
                  }}
                >
                  {user.name}
                </Typography>

                <Typography sx={{ color: COLORS.primary, fontWeight: 750, fontSize: ".73rem", mt: 0.15 }}>
                  {user.role || "Store Owner"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  flexWrap="wrap"
                  justifyContent={{ xs: "center", sm: "flex-start" }}
                  sx={{ mt: 0.9, rowGap: 0.55, columnGap: { xs: 1.2, sm: 1.75 }, width: "100%" }}
                >
                  <ContactItem icon={EmailRoundedIcon} value={user.email} />
                  <ContactItem icon={PhoneRoundedIcon} value={user.phone || "Not provided"} />
                  <ContactItem icon={PlaceRoundedIcon} value={user.location} />
                </Stack>
              </Box>

              {/* =====================================================
                  Edit Button
                  ===================================================== */}

              <Button
                onClick={onEditClick}
                variant="contained"
                startIcon={<EditRoundedIcon sx={{ fontSize: 16 }} />}
                disableElevation
                sx={{
                  flexShrink: 0,
                  minHeight: 38,
                  px: 2,
                  borderRadius: "10px",
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                  color: COLORS.white,
                  textTransform: "none",
                  fontWeight: 750,
                  fontSize: ".73rem",
                  boxShadow: "0 6px 16px rgba(16,121,159,.2)",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primaryDeep})`,
                    boxShadow: "0 8px 20px rgba(16,121,159,.28)",
                  },
                }}
              >
                Edit profile
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          Avatar Selection Dialog
          ============================================================ */}

      <AvatarPicker
        open={avatarPickerOpen}
        onClose={() => setAvatarPickerOpen(false)}
        currentAvatar={avatarUrl}
        onConfirm={onAvatarChange}
      />
    </>
  );
}
