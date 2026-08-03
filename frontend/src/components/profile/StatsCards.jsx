import React from 'react';
import { motion } from 'framer-motion';
import { Box, Card, CardContent, Grid, Typography, Stack } from '@mui/material';
import {
  Inventory2 as PackageIcon,
  TrendingUp as TrendingUpIcon,
  CurrencyRupee as DollarSignIcon,
  Insights as ActivityIcon,
} from '@mui/icons-material';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, delay, ease: 'easeOut' } 
  },
});

const COLOR_CONFIG = {
  blue: {
    bg: 'rgba(239, 246, 255, 0.9)',
    icon: '#2563eb',
    text: '#1e40af',
    accent: '#3b82f6',
  },
  green: {
    bg: 'rgba(240, 253, 244, 0.9)',
    icon: '#16a34a',
    text: '#15803d',
    accent: '#22c55e',
  },
  indigo: {
    bg: 'rgba(238, 242, 255, 0.9)',
    icon: '#4f46e5',
    text: '#3730a3',
    accent: '#6366f1',
  },
  amber: {
    bg: 'rgba(254, 249, 195, 0.9)',
    icon: '#b45309',
    text: '#92400e',
    accent: '#f59e0b',
  },
};

const ICON_MAP = {
  blue: PackageIcon,
  green: TrendingUpIcon,
  indigo: DollarSignIcon,
  amber: ActivityIcon,
};

export default function StatsCards({ stats }) {
  return (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      {stats.map((stat, index) => {
        const colors = COLOR_CONFIG[stat.color];
        const IconComponent = ICON_MAP[stat.color];

        return (
          <Grid item xs={6} lg={3} key={stat.label}>
            <motion.div
              variants={fadeUp(index * 0.08)}
              initial="hidden"
              animate="visible"
              style={{ height: '100%' }}
            >
              <Card
                sx={{
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  height: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-8px)',
                    background: 'rgba(255, 255, 255, 0.95)',
                  },
                }}
              >
                <CardContent 
                  sx={{ 
                    p: { xs: 2.5, sm: 3.5 }, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Stack spacing={2.5}>
                    {/* Icon Container */}
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        backgroundColor: colors.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${colors.accent}20`,
                        boxShadow: `0 4px 12px ${colors.accent}30`,
                      }}
                    >
                      <IconComponent 
                        sx={{ 
                          color: colors.icon, 
                          fontSize: '2rem' 
                        }} 
                      />
                    </Box>

                    {/* Label */}
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'text.secondary',
                      }}
                    >
                      {stat.label}
                    </Typography>

                    {/* Value */}
                    <Typography
                      sx={{
                        fontSize: { xs: '1.75rem', sm: '2.1rem' },
                        fontWeight: 900,
                        color: colors.text,
                        letterSpacing: '-0.04em',
                        lineHeight: 1.1,
                      }}
                    >
                      {stat.prefix}
                      {stat.value}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        );
      })}
    </Grid>
  );
}