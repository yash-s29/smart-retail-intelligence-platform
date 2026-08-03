import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Send,
  AccessTime
} from '@mui/icons-material';

const Contact = () => {
  const theme = useTheme();

  const contactInfo = [
    {
      icon: <LocationOn />,
      title: 'Office Address',
      details: '123 Innovation Drive, Suite 400\nSan Francisco, CA 94105'
    },
    {
      icon: <Email />,
      title: 'Email Us',
      details: 'support@smartretail.com\nsales@smartretail.com'
    },
    {
      icon: <Phone />,
      title: 'Call Us',
      details: '+1 (555) 123-4567\nMon-Fri, 9am-6pm EST'
    },
    {
      icon: <AccessTime />,
      title: 'Business Hours',
      details: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday & Sunday: Closed'
    }
  ];

  return (
    <Box sx={{ pb: 10, pt: { xs: 4, md: 8 }, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="overline" color="primary" fontWeight="bold" sx={{ letterSpacing: 2 }}>
          GET IN TOUCH
        </Typography>
        <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ mt: 1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          Contact Our Team
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4, lineHeight: 1.6, fontWeight: 400 }}>
          Whether you have a question about features, pricing, or need technical support, our team is ready to answer all your questions.
        </Typography>
      </Container>

      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={7}>
            <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, p: { xs: 2, md: 4 } }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                  Send us a message
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="First Name" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Last Name" variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Email Address" type="email" variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Subject" variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Message" multiline rows={6} variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large" 
                      fullWidth 
                      endIcon={<Send />}
                      sx={{ py: 1.5, borderRadius: 2, fontSize: '1.1rem', textTransform: 'none' }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Grid container spacing={3}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} sm={6} md={12} key={index}>
                  <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}`, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'flex-start', p: 3 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mr: 2 }}>
                        {info.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {info.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                          {info.details}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: 250, 
                    borderRadius: 3, 
                    overflow: 'hidden',
                    position: 'relative',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 2
                  }}
                >
                  
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;