import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  alpha,
  Divider
} from '@mui/material';

const PrivacyPolicy = () => {
  const theme = useTheme();
  const lastUpdated = "October 24, 2023";

  return (
    <Box sx={{ pb: 12, pt: { xs: 6, md: 10 }, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" color="primary" fontWeight="bold" sx={{ letterSpacing: 2 }}>
            LEGAL
          </Typography>
          <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ mt: 1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Privacy Policy
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              display: 'inline-block',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 'bold',
              mt: 2
            }}
          >
            Last Updated: {lastUpdated}
          </Typography>
        </Box>

        {/* Content */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: 4, 
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 0 }}>
            1. Introduction
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 4 }}>
            At Smart Retail, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our inventory management and AI forecasting application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            2. Information We Collect
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
            We may collect information about you in a variety of ways. The information we may collect via the Application includes:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 4, '& li': { mb: 1, lineHeight: 1.7 } }}>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number that you voluntarily give to us when registering.</li>
            <li><strong>Business Data:</strong> Inventory counts, product lists, pricing, sales history, and supplier information synced from your POS system or manually entered.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, browser type, and operating system.</li>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            3. How We Use Your Information
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 4, '& li': { mb: 1, lineHeight: 1.7 } }}>
            <li>Create and manage your account.</li>
            <li>Generate AI-driven demand forecasts and inventory recommendations.</li>
            <li>Process transactions and send related information, including confirmations and receipts.</li>
            <li>Send technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to customer service requests and provide support.</li>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            4. Data Security
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 4 }}>
            We use administrative, technical, and physical security measures (including enterprise-grade AES-256 encryption) to help protect your personal and business data. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            5. Your Data Rights
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 4 }}>
            Depending on your location, you may have the right to request access to the personal data we collect from you, change that information, or delete it in some circumstances. You can export your business data at any time via the Reports tab in your dashboard. To request the deletion of your account and personal data, please contact our support team.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            6. Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 0 }}>
            If you have questions or comments about this Privacy Policy, please contact us at:<br /><br />
            <strong>Smart Retail Inc.</strong><br />
            123 Innovation Drive, Suite 400<br />
            San Francisco, CA 94105<br />
            Email: legal@smartretail.com
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;