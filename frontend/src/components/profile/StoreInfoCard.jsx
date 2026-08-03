import React from 'react';
import { motion } from 'framer-motion';
import { Box, Card, CardContent, Typography, Grid, Stack } from '@mui/material';
import { Store as StoreIcon } from '@mui/icons-material';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, delay, ease: 'easeOut' } },
});

function SectionHeading({ icon: Icon, label }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ pb: 2, mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box
        sx={{
          p: 1,
          backgroundColor: '#eef2ff',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ fontSize: '1.0625rem', color: '#4f46e5' }} />
      </Box>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'text.primary' }}>
        {label}
      </Typography>
    </Stack>
  );
}

function InfoRow({ label, value }) {
  return (
    <Stack spacing={0.5}>
      <Typography
        sx={{
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 600,
          color: 'text.secondary',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'text.primary',
          wordBreak: 'break-all',
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export default function StoreInfoCard({ store }) {
  return (
    <motion.div variants={fadeUp(0.22)} initial="hidden" animate="visible">
      <Card
        sx={{
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'rgba(0, 0, 0, 0.05)',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <SectionHeading icon={StoreIcon} label="Store Information" />
          <Grid container spacing={{ xs: 2, sm: 2.5 }}>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Store Name" value={store.name} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="GST Number" value={store.gst} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Address" value={store.address} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="City" value={store.city} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="State" value={store.state} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Country" value={store.country} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="PIN Code" value={store.pin} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Opening Hours" value={store.hours} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}
