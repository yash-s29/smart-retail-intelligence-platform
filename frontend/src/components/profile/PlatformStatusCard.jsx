import React from "react";
import { motion } from "framer-motion";
import { Box, Card, CardContent, Chip, Stack, Typography, useMediaQuery } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { COLORS, RADIUS, fadeUp, reduceMotion } from "./shared";

function StatusLine({ label, detail }) {
  return (
    <Stack direction="row" spacing={0.7} alignItems="center">
      <CheckCircleRoundedIcon sx={{ fontSize: 15, color: "#8FE0C4" }} />
      <Typography sx={{ fontSize: ".7rem", fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ fontSize: ".64rem", opacity: 0.85 }}>· {detail}</Typography>
    </Stack>
  );
}

export default function PlatformStatusCard() {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <motion.div variants={fadeUp(0.15)} initial="hidden" animate="visible" style={{ height: "100%" }}>
      <Card
        sx={{
          borderRadius: RADIUS,
          border: `1px solid ${COLORS.primaryDeep}`,
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
          color: COLORS.white,
          boxShadow: "0 10px 28px rgba(16,93,125,.22)",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          transition: "box-shadow .22s ease, transform .22s ease",
          "&:hover": { boxShadow: "0 16px 36px rgba(16,93,125,.3)", transform: "translateY(-3px)" },
          ...reduceMotion,
        }}
      >
        <motion.div
          aria-hidden
          animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "rgba(255,255,255,.08)",
            pointerEvents: "none",
          }}
        />

        <CardContent sx={{ p: { xs: 2, sm: 2.5 }, position: "relative", zIndex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography sx={{ fontSize: ".6rem", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.85 }}>
                Platform status
              </Typography>
              <Typography sx={{ mt: 0.3, fontSize: "1.02rem", fontWeight: 900, letterSpacing: "-.02em" }}>
                Smart Retail Intelligence
              </Typography>
            </Box>

            <Chip
              label="v2.4.1"
              size="small"
              sx={{
                height: 22,
                bgcolor: "rgba(255,255,255,.16)",
                color: COLORS.white,
                fontWeight: 800,
                fontSize: ".6rem",
              }}
            />
          </Stack>

          <Typography sx={{ mt: 0.9, fontSize: ".68rem", opacity: 0.9 }}>
            All systems operational
          </Typography>

          <Stack spacing={0.9} sx={{ mt: 1.6 }}>
            <StatusLine label="API" detail="99.98% uptime" />
            <StatusLine label="Database" detail="Low latency" />
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}
