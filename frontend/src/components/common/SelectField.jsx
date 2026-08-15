import React from "react";
import { MenuItem, Select, useTheme } from "@mui/material";

export default function SelectField({ value, onChange, options = [], minWidth = 190 }) {
  const theme = useTheme();

  return (
    <Select
      size="small"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      sx={{
        minWidth: { xs: "100%", sm: minWidth },
        borderRadius: "10px",
        fontSize: ".78rem",
        fontWeight: 650,

        "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      }}
      MenuProps={{ PaperProps: { sx: { borderRadius: "12px", mt: 0.5 } } }}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: ".8rem" }}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
}
