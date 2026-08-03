import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  InputAdornment,
  Button,
  useTheme,
  alpha,
  Paper
} from '@mui/material';
import {
  Search,
  Api,
  Code,
  IntegrationInstructions,
  Build,
  Terminal,
  Security,
  Layers
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const docCategories = [
  {
    title: 'API Reference',
    description: 'Comprehensive guides for our REST and GraphQL APIs, including endpoints and authentication.',
    icon: <Api fontSize="large" />,
    color: '#3b82f6'
  },
  {
    title: 'Integration Guides',
    description: 'Learn how to connect your existing POS systems and e-commerce platforms with Smart Retail.',
    icon: <IntegrationInstructions fontSize="large" />,
    color: '#8b5cf6'
  },
  {
    title: 'AI Models',
    description: 'Deep dive into our demand forecasting algorithms and machine learning training procedures.',
    icon: <Layers fontSize="large" />,
    color: '#10b981'
  },
  {
    title: 'Authentication',
    description: 'Best practices for managing OAuth2, JWT tokens, and secure user sessions.',
    icon: <Security fontSize="large" />,
    color: '#f59e0b'
  },
  {
    title: 'CLI Tools',
    description: 'Manage your retail data and environment configurations directly from your terminal.',
    icon: <Terminal fontSize="large" />,
    color: '#ec4899'
  },
  {
    title: 'SDKs',
    description: 'Download our official client libraries for Python, JavaScript, and Node.js.',
    icon: <Code fontSize="large" />,
    color: '#ef4444'
  }
];

const Documentation = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ pb: 12, pt: { xs: 6, md: 10 }, backgroundColor: theme.palette.background.default }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="overline" color="primary" fontWeight="bold" sx={{ letterSpacing: 2 }}>
          DEVELOPER RESOURCES
        </Typography>
        <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ mt: 1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          Documentation
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 5, fontWeight: 400 }}>
          Everything you need to build, integrate, and scale your retail intelligence applications.
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: '2px 4px',
            borderRadius: 3,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          <TextField
            fullWidth
            placeholder="Search documentation..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ pl: 1 }}>
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mr: 1, borderRadius: 2, px: 4, py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
          >
            Search
          </Button>
        </Paper>
      </Box>

      {/* Categories Grid */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {docCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  borderRadius: 3, 
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                    borderColor: alpha(category.color, 0.5)
                  }
                }}
              >
                <CardActionArea sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      backgroundColor: alpha(category.color, 0.1),
                      color: category.color,
                      mb: 2
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {category.description}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Links / Community */}
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Still stuck?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Check out our community forums or reach out to our engineering support team.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" size="large" sx={{ borderRadius: 2, px: 4 }}>
              View Forum
            </Button>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/contact')}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Contact Developer Support
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Documentation;