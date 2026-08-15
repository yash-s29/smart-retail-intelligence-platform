import React from "react";
import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";

export default function SettingRow({ icon, title, label, description, children, border = true }) {
  const theme = useTheme();
  const heading = title ?? label;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={1.25}
      sx={{
        py: 1.35,
        px: 1,
        mx: -1,
        borderRadius: 2,
        borderBottom: border ? "1px solid" : "none",
        borderColor: "divider",
        transition: "background .18s ease",
        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0} flex={1}>
        {icon && (
          <Box
            sx={{
              width: 34,
              height: 34,
              flexShrink: 0,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              "& svg": { fontSize: 18 },
            }}
          >
            {icon}
          </Box>
        )}

        <Box minWidth={0}>
          <Typography sx={{ fontSize: ".8rem", fontWeight: 700, color: "text.primary" }}>{heading}</Typography>
          {description && (
            <Typography sx={{ fontSize: ".68rem", color: "text.secondary", mt: 0.1, lineHeight: 1.4 }}>
              {description}
            </Typography>
          )}
        </Box>
      </Stack>

      <Box sx={{ flexShrink: 0, width: { xs: "100%", sm: "auto" } }}>{children}</Box>
    </Stack>
  );
}

