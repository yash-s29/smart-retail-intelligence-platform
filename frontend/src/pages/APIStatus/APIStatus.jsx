import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Schedule
} from '@mui/icons-material';

// Mock data for system services
const services = [
  { name: 'Dashboard Application', status: 'operational', uptime: '99.99%' },
  { name: 'Core API Services', status: 'operational', uptime: '99.98%' },
  { name: 'AI Forecasting Engine', status: 'operational', uptime: '99.95%' },
  { name: 'Database & Storage', status: 'operational', uptime: '99.99%' },
  { name: 'Webhooks & Events', status: 'operational', uptime: '99.99%' },
  { name: 'Third-Party POS Integrations', status: 'degraded', uptime: '98.50%' },
];

// Mock data for past incidents
const incidents = [
  {
    date: 'Oct 21, 2023',
    title: 'Elevated API Latency',
    status: 'Resolved',
    description: 'Between 14:00 UTC and 14:45 UTC, some users experienced slow load times on the inventory dashboard. The issue was identified as a database index lock and has been fully resolved.'
  },
  {
    date: 'Oct 15, 2023',
    title: 'Scheduled Maintenance',
    status: 'Completed',
    description: 'Routine maintenance and upgrades were performed on the AI Forecasting Engine. Service was unavailable for approximately 30 minutes during the scheduled window.'
  },
  {
    date: 'Sep 28, 2023',
    title: 'POS Sync Delays',
    status: 'Resolved',
    description: 'A third-party API rate limit caused delays in syncing sales data from select POS partners. We have upgraded our tier with the provider to prevent future bottlenecks.'
  }
];

const getStatusConfig = (status, theme) => {
  switch (status) {
    case 'operational':
      return { color: theme.palette.success.main, icon: <CheckCircle />, label: 'Operational' };
    case 'degraded':
      return { color: theme.palette.warning.main, icon: <Warning />, label: 'Degraded Performance' };
    case 'outage':
      return { color: theme.palette.error.main, icon: <ErrorIcon />, label: 'Major Outage' };
    default:
      return { color: theme.palette.text.secondary, icon: <CheckCircle />, label: 'Unknown' };
  }
};

const APIStatus = () => {
  const theme = useTheme();
  
  // Check if any service is not operational
  const hasIssues = services.some(s => s.status !== 'operational');
  const overallStatusColor = hasIssues ? theme.palette.warning.main : theme.palette.success.main;

  return (
    <Box sx={{ pb: 12, pt: { xs: 6, md: 10 }, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="md">
        
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="overline" color="text.secondary" fontWeight="bold" sx={{ letterSpacing: 2 }}>
            SYSTEM STATUS
          </Typography>
          <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ mt: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
            Smart Retail API Status
          </Typography>
        </Box>

        {/* Overall Status Banner */}
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: alpha(overallStatusColor, 0.1),
            border: `1px solid ${alpha(overallStatusColor, 0.3)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            mb: 6
          }}
        >
          {hasIssues ? (
            <Warning sx={{ fontSize: 48, color: overallStatusColor }} />
          ) : (
            <CheckCircle sx={{ fontSize: 48, color: overallStatusColor }} />
          )}
          <Box>
            <Typography variant="h4" fontWeight="bold" color={overallStatusColor} gutterBottom={false}>
              {hasIssues ? 'Some systems are experiencing issues' : 'All systems operational'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Last updated: {new Date().toLocaleTimeString()} (Refreshes automatically)
            </Typography>
          </Box>
        </Paper>

        {/* Current Status List */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          Current Service Status
        </Typography>
        <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}`, mb: 8 }}>
          {services.map((service, index) => {
            const config = getStatusConfig(service.status, theme);
            return (
              <React.Fragment key={index}>
                <Box 
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {service.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                      90-day uptime: {service.uptime}
                    </Typography>
                    <Chip 
                      icon={config.icon} 
                      label={config.label} 
                      sx={{ 
                        backgroundColor: alpha(config.color, 0.1), 
                        color: config.color,
                        fontWeight: 'bold',
                        '& .MuiChip-icon': {
                          color: config.color
                        }
                      }} 
                    />
                  </Box>
                </Box>
                {index < services.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </Card>

        {/* Past Incidents */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          Past Incidents
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {incidents.map((incident, index) => (
            <Paper 
              key={index} 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 3, 
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {incident.title}
                </Typography>
                <Chip 
                  label={incident.status} 
                  size="small"
                  sx={{ 
                    backgroundColor: incident.status === 'Resolved' || incident.status === 'Completed' 
                      ? alpha(theme.palette.success.main, 0.1) 
                      : alpha(theme.palette.warning.main, 0.1),
                    color: incident.status === 'Resolved' || incident.status === 'Completed' 
                      ? theme.palette.success.main 
                      : theme.palette.warning.main,
                    fontWeight: 'bold'
                  }} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                <Schedule fontSize="small" />
                <Typography variant="body2">
                  {incident.date}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {incident.description}
              </Typography>
            </Paper>
          ))}
        </Box>
        
      </Container>
    </Box>
  );
};

export default APIStatus;