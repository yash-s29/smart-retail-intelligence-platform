import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChatBubbleOutlined from '@mui/icons-material/ChatBubbleOutlined';
import { useNavigate } from 'react-router-dom';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I create and manage products?',
        a: 'You can create products by navigating to the Products section in your dashboard and clicking "Add Product". You can manage inventory levels, pricing, and SKUs all from a single interface.'
      },
      {
        q: 'Can multiple users log into the same store?',
        a: 'Yes, Smart Retail supports multi-user access. You can invite team members from the Settings > Team tab and assign them specific roles and permissions.'
      },
      {
        q: 'How do I integrate my Point of Sale (POS) system?',
        a: 'We offer native integrations with most major POS systems. Go to Settings > Integrations, select your POS provider, and follow the OAuth authorization flow.'
      }
    ]
  },
  {
    category: 'Inventory & Forecasting',
    questions: [
      {
        q: 'How does the AI demand forecasting work?',
        a: 'Our AI model analyzes your historical sales data, seasonal trends, and external factors like upcoming holidays to predict future demand. It updates recommendations daily.'
      },
      {
        q: 'Will I get alerts when stock is running low?',
        a: 'Yes. You can set custom reorder points for every product. When inventory drops below that threshold, you will receive an automated alert in your dashboard and via email.'
      }
    ]
  },
  {
    category: 'Billing & Security',
    questions: [
      {
        q: 'How secure is my business data?',
        a: 'We use enterprise-grade AES-256 encryption for all data at rest and in transit. Your data is backed up daily across multiple geographical regions.'
      },
      {
        q: 'Can I export my reports and data?',
        a: 'Absolutely. All reports, sales data, and inventory lists can be exported as CSV or PDF files directly from the Reports tab.'
      },
      {
        q: 'How do I upgrade or cancel my subscription?',
        a: 'You can manage your subscription at any time by going to Settings > Billing. Upgrades take effect immediately, while cancellations apply at the end of your current billing cycle.'
      }
    ]
  }
];

const FAQ = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ pb: 10, pt: { xs: 4, md: 8 }, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="md" sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="overline" color="primary" fontWeight="bold" sx={{ letterSpacing: 2 }}>
          SUPPORT CENTER
        </Typography>
        <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ mt: 1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mx: 'auto', mb: 4, lineHeight: 1.6, fontWeight: 400 }}>
          Find answers to common questions about setting up your store, managing inventory, and utilizing our AI forecasting tools.
        </Typography>
      </Container>

      <Container maxWidth="md">
        {faqs.map((group, groupIndex) => (
          <Box key={groupIndex} sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              {group.category}
            </Typography>
            
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, overflow: 'hidden' }}>
              {group.questions.map((faq, index) => {
                const panelId = `panel-${groupIndex}-${index}`;
                const isLast = index === group.questions.length - 1;
                
                return (
                  <Accordion 
                    key={index} 
                    expanded={expanded === panelId} 
                    onChange={handleChange(panelId)}
                    disableGutters
                    elevation={0}
                    sx={{
                      '&:before': { display: 'none' },
                      borderBottom: isLast ? 'none' : `1px solid ${theme.palette.divider}`,
                      backgroundColor: 'transparent'
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore color="primary" />}
                      sx={{ 
                        px: 3, 
                        py: 1,
                        backgroundColor: expanded === panelId ? alpha(theme.palette.primary.main, 0.03) : 'transparent',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={expanded === panelId ? "bold" : "medium"}>
                        {faq.q}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 3, pb: 3, pt: 1, backgroundColor: expanded === panelId ? alpha(theme.palette.primary.main, 0.03) : 'transparent' }}>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {faq.a}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Paper>
          </Box>
        ))}

        <Paper 
          elevation={0} 
          sx={{ 
            mt: 8, 
            p: { xs: 4, md: 5 }, 
            textAlign: 'center', 
            borderRadius: 4, 
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            border: `1px dashed ${theme.palette.primary.main}`
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ p: 2, borderRadius: '50%', backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
              <ChatBubbleOutline color="primary" fontSize="large" />
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Still have questions?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            Can't find the answer you're looking for? Our support team is here to help you get the most out of Smart Retail.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate('/contact')}
            sx={{ px: 4, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1.05rem' }}
          >
            Contact Support
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default FAQ;