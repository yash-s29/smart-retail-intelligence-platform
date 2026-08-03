import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Stack 
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

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

function InfoRow({ label, value }) {
  return (
    <Stack spacing={0.75}>
      <Typography
        sx={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
          color: 'text.secondary',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'text.primary',
          wordBreak: 'break-all',
          lineHeight: 1.4,
        }}
      >
        {value || '—'}
      </Typography>
    </Stack>
  );
}

export default function PersonalInfoCard({ user }) {
  return (
    <motion.div variants={fadeUp(0.18)} initial="hidden" animate="visible">
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
          <SectionHeading icon={PersonIcon} label="Personal Information" />

          <Grid container spacing={{ xs: 3, sm: 3.5 }}>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Full Name" value={user.name} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Email" value={user.email} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Location" value={user.location} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Store Name" value={user.storeName} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Store Type" value={user.storeType} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Category" value={user.businessCategory} />
            </Grid>
            {user.phone && (
              <Grid item xs={12} sm={6}>
                <InfoRow label="Phone" value={user.phone} />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}