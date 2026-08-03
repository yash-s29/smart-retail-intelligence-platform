import React from 'react';
import { Box, Typography, Button } from "@mui/material";
import { PackageOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ 
  title = "No data found", 
  description = "There are currently no records to display in this section.",
  actionText,
  actionRoute
}) => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 10,
        px: 3,
        textAlign: 'center'
      }}
    >
      <Box 
        sx={{ 
          bgcolor: 'grey.100', 
          p: 3, 
          borderRadius: '50%', 
          mb: 3,
          color: 'grey.500'
        }}
      >
        <PackageOpen size={48} strokeWidth={1.5} />
      </Box>
      
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        {description}
      </Typography>

      {actionText && actionRoute && (
        <Button 
          variant="contained" 
          onClick={() => navigate(actionRoute)}
          sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;