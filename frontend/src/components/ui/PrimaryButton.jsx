import React from 'react';
import Button from '@mui/material/Button';

export default function PrimaryButton({ children, variant = 'contained', size = 'medium', sx = {}, startIcon, endIcon, ...props }) {
  return (
    <Button
      variant={variant}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{ px: 2.25, py: variant === 'contained' ? 1.25 : 0.9, borderRadius: 2, fontWeight: 700, ...sx }}
      {...props}
    >
      {children}
    </Button>
  );
}
