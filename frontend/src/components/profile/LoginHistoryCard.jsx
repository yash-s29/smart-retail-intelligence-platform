import React from "react";
import { motion } from "framer-motion";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { COLORS, cardPad, cardSx, fadeUp, reduceMotion, SectionHeading } from "./shared";

export default function LoginHistoryCard({ logins, onSessionsClick }) {
  return (
    <motion.div variants={fadeUp(0.14)} initial="hidden" animate="visible" style={{ height: "100%" }}>
      <Card sx={cardSx}>
        <CardContent sx={cardPad}>
          <SectionHeading icon={AccessTimeRoundedIcon} label="Recent login activity" />

          <Stack spacing={0.9}>
            {logins.map((login, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1.2}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1.1,
                  borderRadius: "11px",
                  border: `1px solid ${COLORS.border}`,
                  transition: "background .18s ease, border-color .18s ease",
                  "&:hover": { bgcolor: COLORS.aquaSoft, borderColor: alpha(COLORS.primary, 0.18) },
                  ...reduceMotion,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" minWidth={0} flex={1}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      flexShrink: 0,
                      bgcolor: login.active ? COLORS.success : COLORS.muted,
                    }}
                  />

                  <Box minWidth={0}>
                    <Typography noWrap sx={{ fontSize: ".76rem", fontWeight: 700, color: COLORS.ink }}>
                      {login.device}
                    </Typography>
                    <Typography noWrap sx={{ fontSize: ".64rem", color: COLORS.slate }}>
                      {login.time} · {login.location}
                    </Typography>
                  </Box>
                </Stack>

                {login.active ? (
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      height: 22,
                      borderRadius: 999,
                      bgcolor: COLORS.successSoft,
                      color: COLORS.success,
                      fontSize: ".62rem",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Button
                    size="small"
                    startIcon={<LogoutRoundedIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      flexShrink: 0,
                      minHeight: 28,
                      px: 1.2,
                      borderRadius: "8px",
                      fontSize: ".64rem",
                      fontWeight: 750,
                      textTransform: "none",
                      color: COLORS.danger,
                      bgcolor: COLORS.dangerSoft,
                      "&:hover": { bgcolor: alpha(COLORS.danger, 0.16) },
                    }}
                  >
                    Revoke
                  </Button>
                )}
              </Stack>
            ))}
          </Stack>

          {onSessionsClick && (
            <Button
              onClick={onSessionsClick}
              size="small"
              sx={{
                mt: 1.2,
                textTransform: "none",
                fontWeight: 750,
                fontSize: ".68rem",
                color: COLORS.primary,
                "&:hover": { bgcolor: COLORS.aquaSoft },
              }}
            >
              View all sessions →
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
