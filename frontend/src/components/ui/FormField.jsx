import React from 'react';
import TextField from '@mui/material/TextField';

export default function FormField({ label, helperText, error = false, sx = {}, ...props }) {
  return (
    <TextField
      label={label}
      helperText={helperText}
      error={error}
      variant="outlined"
      size="small"
      sx={{ borderRadius: 2, ...sx }}
      {...props}
    />
  );
}
