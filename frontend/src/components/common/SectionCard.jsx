import React from "react";
import { Box, Card, CardContent, Divider, Stack, Typography, alpha, useTheme } from "@mui/material";
import { motion } from "framer-motion";

export default function SectionCard({ title, subtitle, children, action }) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "box-shadow .2s ease, border-color .2s ease",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.22),
            boxShadow: `0 10px 26px ${alpha(theme.palette.primary.main, 0.08)}`,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 1.5 }}
          >
            <Stack direction="row" spacing={1.1} alignItems="center" minWidth={0}>
              <Box
                sx={{
                  width: 4,
                  height: 22,
                  borderRadius: 999,
                  bgcolor: "primary.main",
                  flexShrink: 0,
                }}
              />
              <Box minWidth={0}>
                <Typography
                  sx={{ fontSize: "0.86rem", fontWeight: 800, color: "text.primary", letterSpacing: "-.01em" }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography sx={{ fontSize: ".68rem", color: "text.secondary", mt: 0.15 }}>
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Stack>

            {action}
          </Stack>

          <Divider sx={{ mb: 1.75 }} />

          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
