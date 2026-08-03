import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Stack, 
  Chip 
} from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, delay, ease: 'easeOut' } 
  },
});

export default function PlatformStatusCard() {
  return (
    <motion.div variants={fadeUp(0.3)} initial="hidden" animate="visible">
      <Card
        sx={{
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
          color: 'white',
          boxShadow: '0 10px 40px rgba(79, 70, 229, 0.35)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 50px rgba(79, 70, 229, 0.45)',
            transform: 'translateY(-6px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            zIndex: 1,
            pointerEvents: 'none',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 }, position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Box>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  opacity: 0.9,
                  mb: 0.5,
                }}
              >
                Platform Status
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1.35rem', sm: '1.5rem' },
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}
              >
                Smart Retail Intelligence
              </Typography>
            </Box>

            <Chip
              label="v2.4.1"
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.75rem',
                backdropFilter: 'blur(10px)',
              }}
            />
          </Stack>

          <Typography
            sx={{
              fontSize: '0.95rem',
              opacity: 0.95,
              mb: 4,
              fontWeight: 500,
            }}
          >
            All systems operational • Real-time monitoring active
          </Typography>

          {/* Status Indicators */}
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckIcon sx={{ fontSize: '1.4rem', color: '#86efac' }} />
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    API
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: '0.95rem', opacity: 0.9 }}>
                  Online • 99.98% Uptime
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckIcon sx={{ fontSize: '1.4rem', color: '#86efac' }} />
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    Database
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: '0.95rem', opacity: 0.9 }}>
                  Online • Low Latency
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}