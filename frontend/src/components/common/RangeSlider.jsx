import React from "react";
import { Slider, Stack, Typography } from "@mui/material";

export default function RangeSlider({ value, min = 0, max = 100, step = 1, onChange }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: "100%", sm: 210 } }}>
      <Slider
        size="small"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(_, v) => onChange?.(v)}
        sx={{ color: "primary.main" }}
      />
      <Typography sx={{ fontSize: ".72rem", fontWeight: 750, color: "text.secondary", width: 26, textAlign: "right", flexShrink: 0 }}>
        {value}
      </Typography>
    </Stack>
  );
}
