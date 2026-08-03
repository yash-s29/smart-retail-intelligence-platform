import React, { useRef } from 'react';
import { Paper, Typography, Box, Button } from "@mui/material";
import { UploadCloud } from 'lucide-react';

const UploadCard = () => {
  const fileInputRef = useRef(null);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        borderRadius: 3, 
        border: "2px dashed", 
        borderColor: "divider",
        textAlign: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Box sx={{ color: 'primary.main', mb: 2 }}>
        <UploadCloud size={48} />
      </Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>Upload Sales Data</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Drag and drop your CSV file here, or click to browse.
      </Typography>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        hidden 
        accept=".csv"
        onChange={(e) => console.log(e.target.files[0])}
      />
      
      <Button 
        variant="contained" 
        onClick={() => fileInputRef.current.click()}
        sx={{ borderRadius: 2, textTransform: 'none' }}
      >
        Choose File
      </Button>
    </Paper>
  );
};

export default UploadCard;