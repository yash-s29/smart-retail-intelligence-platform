import React from "react";
import { motion } from "framer-motion";
import { Box, Card, CardContent, Typography, Button, Avatar, Stack, useMediaQuery } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

import { COLORS, RADIUS, fadeUp, reduceMotion } from "./shared";

function ContactItem({ icon: Icon, value }) {
  return (
    <Stack direction="row" spacing={0.6} alignItems="center" sx={{ minWidth: 0 }}>
      <Icon sx={{ fontSize: 15, color: COLORS.muted, flexShrink: 0 }} />
      <Typography noWrap sx={{ fontSize: ".72rem", color: COLORS.slate, fontWeight: 600 }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function ProfileHeader({ user, onEditClick }) {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
      <Card
        sx={{
          borderRadius: RADIUS,
          border: `1px solid ${COLORS.border}`,
          background: `linear-gradient(135deg, ${COLORS.white} 0%, ${COLORS.aquaPale} 100%)`,
          boxShadow: "0 4px 18px rgba(16,77,96,.06)",
          transition: "box-shadow .22s ease",
          "&:hover": { boxShadow: "0 14px 32px rgba(16,77,96,.1)" },
          ...reduceMotion,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 2.75 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 2.25 }}
            alignItems={{ xs: "center", sm: "center" }}
          >
            {/* Avatar with a slow, continuous "wheel" rotation ring */}
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: `1.5px dashed ${COLORS.aqua}`,
                  opacity: 0.5,
                }}
              />

              <Avatar
                sx={{
                  width: { xs: 66, sm: 76 },
                  height: { xs: 66, sm: 76 },
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                  fontSize: { xs: "1.5rem", sm: "1.7rem" },
                  fontWeight: 900,
                  color: COLORS.white,
                  border: `3px solid ${COLORS.white}`,
                  boxShadow: "0 8px 22px rgba(16,121,159,.28)",
                }}
              >
                {user.initials}
              </Avatar>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 15,
                  height: 15,
                  bgcolor: COLORS.success,
                  borderRadius: "50%",
                  border: `2.5px solid ${COLORS.white}`,
                }}
              />
            </Box>

            {/* Identity */}
            <Box flex={1} minWidth={0} textAlign={{ xs: "center", sm: "left" }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "1.15rem", sm: "1.3rem" },
                  color: COLORS.ink,
                  letterSpacing: "-.02em",
                  lineHeight: 1.2,
                }}
              >
                {user.name}
              </Typography>

              <Typography sx={{ color: COLORS.primary, fontWeight: 750, fontSize: ".73rem", mt: 0.15 }}>
                {user.role || "Store Owner"}
              </Typography>

              <Stack
                direction="row"
                spacing={1.75}
                flexWrap="wrap"
                justifyContent={{ xs: "center", sm: "flex-start" }}
                sx={{ mt: 0.9, rowGap: 0.4 }}
              >
                <ContactItem icon={EmailRoundedIcon} value={user.email} />
                <ContactItem icon={PhoneRoundedIcon} value={user.phone || "Not provided"} />
                <ContactItem icon={PlaceRoundedIcon} value={user.location} />
              </Stack>
            </Box>

            {/* Edit */}
            <Button
              onClick={onEditClick}
              variant="contained"
              startIcon={<EditRoundedIcon sx={{ fontSize: 16 }} />}
              disableElevation
              sx={{
                flexShrink: 0,
                minHeight: 36,
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
  );
}
