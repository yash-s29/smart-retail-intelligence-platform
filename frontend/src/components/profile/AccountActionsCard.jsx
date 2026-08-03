import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Stack, 
  Divider 
} from '@mui/material';
import { 
  Description as FileTextIcon, 
  Download, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, delay, ease: 'easeOut' } 
  },
});

function SectionHeading({ icon: Icon, label }) {
  return (
    <Stack 
      direction="row" 
      spacing={2} 
      alignItems="center" 
      sx={{ 
        pb: 3, 
        mb: 3, 
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)' 
      }}
    >
      <Box
        sx={{
          p: 1.5,
          backgroundColor: 'rgba(79, 70, 229, 0.08)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Icon sx={{ fontSize: '1.35rem', color: '#4f46e5' }} />
      </Box>
      <Typography 
        sx={{ 
          fontSize: '1.05rem', 
          fontWeight: 700, 
          color: 'text.primary',
          letterSpacing: '-0.02em'
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}

export default function AccountActionsCard({ 
  onDownloadClick, 
  onExportClick, 
  onDeleteClick 
}) {
  return (
    <motion.div variants={fadeUp(0.25)} initial="hidden" animate="visible">
      <Card
        sx={{
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-6px)',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <SectionHeading icon={FileTextIcon} label="Account Actions" />

          <List sx={{ p: 0 }}>
            {/* Download My Data */}
            <ListItem
              button
              onClick={onDownloadClick}
              sx={{
                py: 2.5,
                px: 2.5,
                mx: -1,
                mb: 1,
                borderRadius: '16px',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: 'rgba(79, 70, 229, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 52, color: '#4f46e5' }}>
                <Download fontSize="medium" />
              </ListItemIcon>
              <ListItemText
                primary="Download My Data"
                secondary="Export your profile and dashboard data as JSON"
                primaryTypographyProps={{
                  sx: { fontSize: '1.05rem', fontWeight: 600, color: '#4f46e5' },
                }}
                secondaryTypographyProps={{
                  sx: { fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 },
                }}
              />
            </ListItem>

            {/* Export Reports */}
            <ListItem
              button
              onClick={onExportClick}
              sx={{
                py: 2.5,
                px: 2.5,
                mx: -1,
                mb: 1,
                borderRadius: '16px',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: 'rgba(79, 70, 229, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 52, color: '#4f46e5' }}>
                <FileTextIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText
                primary="Export Reports"
                secondary="Download sales and performance reports as CSV"
                primaryTypographyProps={{
                  sx: { fontSize: '1.05rem', fontWeight: 600, color: '#4f46e5' },
                }}
                secondaryTypographyProps={{
                  sx: { fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 },
                }}
              />
            </ListItem>
          </List>

          {/* Divider */}
          <Divider sx={{ my: 2.5 }} />

          {/* Delete Account */}
          <ListItem
            button
            onClick={onDeleteClick}
            sx={{
              py: 2.5,
              px: 2.5,
              mx: -1,
              borderRadius: '16px',
              transition: 'all 0.25s ease',
              color: '#dc2626',
              '&:hover': {
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 52, color: '#dc2626' }}>
              <DeleteIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText
              primary="Delete Account"
              secondary="Permanently remove account and all data"
              primaryTypographyProps={{
                sx: { fontSize: '1.05rem', fontWeight: 600, color: '#dc2626' },
              }}
              secondaryTypographyProps={{
                sx: { fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 },
              }}
            />
          </ListItem>
        </CardContent>
      </Card>
    </motion.div>
  );
}