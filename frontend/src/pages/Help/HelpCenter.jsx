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
  MenuBook,
  AccountCircle,
  IntegrationInstructions,
  Build,
  ShoppingCart,
  Receipt,
  HeadsetMic
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const helpCategories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of setting up your store,products, configuring your dashboard.',
    icon: <MenuBook fontSize="large" />,
    color: '#3b82f6'
  },
  {
    title: 'Account & Settings',
    description: 'Manage your profile, team permissions, security settings, and notifications.',
    icon: <AccountCircle fontSize="large" />,
    color: '#8b5cf6'
  },
  {
    title: 'Products & Inventory',
    description: 'Everything you need to know about stock management, SKU generation, and categories.',
    icon: <ShoppingCart fontSize="large" />,
    color: '#10b981'
  },
  {
    title: 'Billing & Subscriptions',
    description: 'Understand our pricing tiers, update your payment methods, and view invoices.',
    icon: <Receipt fontSize="large" />,
    color: '#f59e0b'
  },
  {
    title: 'API & Integrations',
    description: 'Connect your POS, accounting software, and e-commerce platforms seamlessly.',
    icon: <IntegrationInstructions fontSize="large" />,
    color: '#ec4899'
  },
  {
    title: 'Troubleshooting',
    description: 'Fix common errors, connection issues, and learn how to read your diagnostic logs.',
    icon: <Build fontSize="large" />,
    color: '#ef4444'
  }
];

const HelpCenter = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ pb: 10, pt: { xs: 4, md: 8 }, backgroundColor: theme.palette.background.default }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 8,
          pt: 4,
          mb: 8
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            How can we help you?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 5, fontWeight: 400 }}>
            Search our knowledge base or browse categories below to find answers.
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
              placeholder="Search for articles, tutorials, and guides..."
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
        </Container>
      </Box>

      {/* Categories Grid */}
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Browse by Category
        </Typography>
        
        <Grid container spacing={4}>
          {helpCategories.map((category, index) => (
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

        {/* Bottom CTA */}
        <Paper 
          elevation={0} 
          sx={{ 
            mt: 8, 
            p: { xs: 4, md: 5 }, 
            borderRadius: 4, 
            backgroundColor: alpha(theme.palette.primary.main, 0.03),
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ p: 2, borderRadius: '50%', backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
              <HeadsetMic color="primary" fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Need human assistance?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our support team is available Monday to Friday, 9am - 6pm EST.
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate('/contact')}
            sx={{ px: 4, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1.05rem', whiteSpace: 'nowrap' }}
          >
            Submit a Ticket
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default HelpCenter;