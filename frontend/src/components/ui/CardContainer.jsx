import React from 'react';
import Paper from '@mui/material/Paper';

export default function CardContainer({ children, sx = {}, elevation = 0, ...props }) {
  return (
    <Paper
      elevation={elevation}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', ...sx }}
      {...props}
    >
      {children}
    </Paper>
  );
}
