import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { AccessTime as ClockIcon, Logout as LogoutIcon } from '@mui/icons-material';

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

export default function LoginHistoryCard({ logins, onSessionsClick }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div variants={fadeUp(0.26)} initial="hidden" animate="visible">
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
          <SectionHeading icon={ClockIcon} label="Recent Login Activity" />

          <Stack spacing={2.5}>
            {logins.map((login, index) => (
              <Stack
                key={index}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: '16px',
                  backgroundColor: 'rgba(249, 250, 251, 0.6)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(249, 250, 251, 0.95)',
                    borderColor: 'rgba(79, 70, 229, 0.15)',
                  },
                }}
              >
                {/* Left Side - Device & Details */}
                <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: login.active ? '#22c55e' : '#94a3b8',
                        boxShadow: login.active 
                          ? '0 0 8px rgba(34, 197, 94, 0.5)' 
                          : 'none',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {login.device}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      pl: 3.5,
                    }}
                  >
                    {login.time} • {login.location}
                  </Typography>
                </Stack>

                {/* Right Side - Status / Action */}
                {login.active ? (
                  <Chip
                    label="Active Now"
                    size={isSmallScreen ? 'small' : 'medium'}
                    sx={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      px: 2,
                      py: 0.5,
                      borderRadius: '9999px',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<LogoutIcon sx={{ fontSize: '1.1rem' }} />}
                    onClick={() => {/* Add revoke logic if needed */}}
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      color: '#dc2626',
                      borderColor: '#fecaca',
                      backgroundColor: 'rgba(254, 226, 226, 0.6)',
                      '&:hover': {
                        backgroundColor: '#fee2e2',
                        borderColor: '#dc2626',
                      },
                      px: 3,
                      py: 0.75,
                      borderRadius: '12px',
                      flexShrink: 0,
                    }}
                  >
                    Revoke
                  </Button>
                )}
              </Stack>
            ))}

            {/* View All Sessions Button */}
            {onSessionsClick && (
              <Button
                onClick={onSessionsClick}
                variant="text"
                sx={{
                  mt: 1,
                  alignSelf: 'flex-start',
                  color: '#4f46e5',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.08)' },
                }}
              >
                View All Active Sessions →
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}