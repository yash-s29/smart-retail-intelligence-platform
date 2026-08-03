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

const TermsOfService = () => {
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
            Terms of Service
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
            1. Agreement to Terms
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 4 }}>
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Smart Retail Inc. ("we," "us," or "our"), concerning your access to and use of the Smart Retail web application as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto. You agree that by accessing the application, you have read, understood, and agree to be bound by all of these Terms of Service.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            2. Intellectual Property Rights
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 4 }}>
            Unless otherwise indicated, the application is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the application (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            3. User Registration and Security
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
            You may be required to register with the application to access certain features. You agree to:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 4, '& li': { mb: 1, lineHeight: 1.7 } }}>
            <li>Keep your password confidential and be responsible for all use of your account and password.</li>
            <li>Provide true, accurate, current, and complete registration information.</li>
            <li>Maintain and promptly update your information to keep it true, accurate, current, and complete.</li>
            <li>Notify us immediately of any unauthorized access to or use of your account.</li>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            4. Prohibited Activities
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
            You may not access or use the application for any purpose other than that for which we make the application available. As a user of the application, you agree not to:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 4, '& li': { mb: 1, lineHeight: 1.7 } }}>
            <li>Systematically retrieve data or other content from the application to create or compile a database or directory without written permission from us.</li>
            <li>Interfere with, disrupt, or create an undue burden on the application or the networks or services connected to the application.</li>
            <li>Attempt to bypass any measures of the application designed to prevent or restrict access to the application, or any portion of the application.</li>
            <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the application.</li>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            5. Limitation of Liability
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 4 }}>
            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the application, even if we have been advised of the possibility of such damages.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            6. Contact Information
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 0 }}>
            In order to resolve a complaint regarding the application or to receive further information regarding use of the application, please contact us at:<br /><br />
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

export default TermsOfService;