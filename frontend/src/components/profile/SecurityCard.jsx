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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  Security as SecurityIcon, 
  Key, 
  Smartphone, 
  AccessTime, 
  ChevronRight 
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

export default function SecurityCard({ 
  onPasswordClick, 
  onTwoFactorClick, 
  onSessionsClick 
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const securityItems = [
    { 
      icon: Key, 
      label: 'Change Password', 
      action: onPasswordClick 
    },
    { 
      icon: Smartphone, 
      label: 'Two-Factor Auth', 
      action: onTwoFactorClick ?? (() => alert('Two-Factor Authentication coming soon!')) 
    },
    { 
      icon: AccessTime, 
      label: 'Active Sessions', 
      action: onSessionsClick 
    },
  ];

  return (
    <motion.div variants={fadeUp(0.2)} initial="hidden" animate="visible">
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
          <SectionHeading icon={SecurityIcon} label="Security" />

          <List sx={{ p: 0 }}>
            {securityItems.map((item, index) => (
              <ListItem
                button
                onClick={item.action}
                key={index}
                sx={{
                  py: 2,
                  px: 2.5,
                  mx: -1,
                  mb: index < securityItems.length - 1 ? 1 : 0,
                  borderRadius: '16px',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(79, 70, 229, 0.08)',
                    '& .MuiListItemIcon-root': {
                      color: '#4f46e5',
                      transform: 'scale(1.1)',
                    },
                    '& .chevron': {
                      color: '#4f46e5',
                      transform: 'translateX(4px)',
                    },
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 48, 
                    color: 'text.secondary', 
                    transition: 'all 0.2s ease' 
                  }}
                >
                  <item.icon fontSize="medium" />
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: { 
                      fontSize: '1rem', 
                      fontWeight: 600, 
                      color: 'text.primary' 
                    },
                  }}
                />

                <ChevronRight
                  className="chevron"
                  sx={{ 
                    fontSize: '1.4rem', 
                    color: 'text.disabled', 
                    transition: 'all 0.2s ease' 
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </motion.div>
  );
}