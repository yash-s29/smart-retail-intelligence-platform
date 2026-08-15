import React from "react";
import { Switch, alpha, useTheme } from "@mui/material";

export default function ToggleSwitch({ checked, onChange }) {
  const theme = useTheme();

  return (
    <Switch
      checked={!!checked}
      onChange={(e) => onChange?.(e.target.checked)}
      sx={{
        width: 44,
        height: 25,
        padding: 0,

        "& .MuiSwitch-switchBase": {
          padding: 3,
          transitionDuration: "200ms",
          "&.Mui-checked": {
            transform: "translateX(19px)",
            color: "#fff",
            "& + .MuiSwitch-track": { backgroundColor: theme.palette.primary.main, opacity: 1 },
          },
        },

        "& .MuiSwitch-thumb": {
          width: 19,
          height: 19,
          boxShadow: "0 2px 6px rgba(0,0,0,.15)",
        },

        "& .MuiSwitch-track": {
          borderRadius: 999,
          backgroundColor: alpha(theme.palette.text.primary, 0.2),
          opacity: 1,
          transition: theme.transitions.create(["background-color"], { duration: 200 }),
        },
      }}
    />
  );
}
