import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  useTheme,
  alpha
} from '@mui/material';

const CookiePolicy = () => {
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
            Cookie Policy
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
            1. What are Cookies?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 4 }}>
            Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            2. How We Use Cookies
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
            Smart Retail uses cookies and similar technologies for the following purposes:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 4, '& li': { mb: 2, lineHeight: 1.7 } }}>
            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you, such as logging in or filling in forms.</li>
            <li><strong>Performance and Analytics:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.</li>
            <li><strong>Functional Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization, such as remembering your preferences and settings.</li>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            3. Managing Your Cookie Preferences
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 4 }}>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in our cookie consent banner. Alternatively, you can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though your access to some functionality and areas of our website may be restricted.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            4. Updates to This Policy
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 4 }}>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            5. Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 0 }}>
            If you have any questions about our use of cookies or other technologies, please email us at:
            <br /><br />
            <strong>Email:</strong> legal@smartretail.com
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default CookiePolicy;