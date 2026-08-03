import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Avatar, 
  useTheme, 
  alpha 
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const blogPosts = [
  {
    id: 1,
    title: 'How AI is Revolutionizing Inventory Forecasting',
    excerpt: 'Discover how machine learning models are helping retailers predict demand with 95% accuracy and reduce stockouts.',
    category: 'AI & Forecasting',
    author: 'Sarah Jenkins',
    date: 'Oct 12, 2026',
    readTime: '5 min read',
    imageGradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  },
  {
    id: 2,
    title: 'Retail Analytics: Understanding Customer Behavior',
    excerpt: 'Stop guessing what your customers want. Learn how to turn raw sales data into actionable business intelligence.',
    category: 'Retail Analytics',
    author: 'David Chen',
    date: 'Oct 08, 2026',
    readTime: '7 min read',
    imageGradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  },
  {
    id: 3,
    title: 'Sales Optimization Techniques for Q4',
    excerpt: 'Prepare your store for the holiday rush. Strategies to optimize pricing, manage discounts, and maximize profit margins.',
    category: 'Sales Optimization',
    author: 'Elena Rodriguez',
    date: 'Sep 28, 2026',
    readTime: '6 min read',
    imageGradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  },
  {
    id: 4,
    title: 'Demand Prediction in a Volatile Market',
    excerpt: 'Supply chain disruptions are the new normal. Here is how dynamic demand prediction keeps your shelves perfectly stocked.',
    category: 'Demand Prediction',
    author: 'Michael Scott',
    date: 'Sep 15, 2026',
    readTime: '8 min read',
    imageGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  },
  {
    id: 5,
    title: 'Leveraging Business Intelligence for SMEs',
    excerpt: 'Enterprise-grade analytics are no longer just for the giants. How small to medium retailers are using BI to scale.',
    category: 'Business Intelligence',
    author: 'Sarah Jenkins',
    date: 'Sep 02, 2026',
    readTime: '4 min read',
    imageGradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  },
  {
    id: 6,
    title: 'The Future of Omnichannel Retail in 2027',
    excerpt: 'Bridging the gap between physical stores and e-commerce. What you need to know to stay competitive next year.',
    category: 'Industry Trends',
    author: 'David Chen',
    date: 'Aug 20, 2026',
    readTime: '6 min read',
    imageGradient: 'linear-gradient(135deg, #64748b 0%, #0f172a 100%)',
  }
];

const Blog = () => {
  const theme = useTheme();

  return (
    <Box sx={{ pb: 10, pt: { xs: 4, md: 8 }, backgroundColor: theme.palette.background.default }}>
      
      <Container maxWidth="lg" sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="overline" color="primary" fontWeight="bold" sx={{ letterSpacing: 2 }}>
          RESOURCES & INSIGHTS
        </Typography>
        <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ mt: 1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          Latest Articles
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4, lineHeight: 1.6, fontWeight: 400 }}>
          Expert insights, industry trends, and strategic advice on inventory forecasting, retail analytics, and sales optimization.
        </Typography>
      </Container>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {blogPosts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: 3, 
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: theme.shadows[8],
                    borderColor: theme.palette.primary.main,
                    '& .read-more-btn .MuiButton-endIcon': {
                      transform: 'translateX(4px)'
                    }
                  }
                }}
              >
                <Box sx={{ width: '100%', height: 200, background: post.imageGradient, position: 'relative' }}>
                  <Chip 
                    label={post.category} 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      left: 16, 
                      bgcolor: 'rgba(255, 255, 255, 0.9)', 
                      color: 'black', 
                      fontWeight: 'bold' 
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {post.date} • {post.readTime}
                  </Typography>
                  
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.4, mb: 2 }}>
                    {post.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 3, lineHeight: 1.6 }}>
                    {post.excerpt}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main, fontSize: '0.875rem' }}>
                        {post.author.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {post.author}
                      </Typography>
                    </Box>
                    
                    <Button 
                      className="read-more-btn"
                      color="primary" 
                      variant="text"
                      endIcon={<ArrowForward sx={{ transition: 'transform 0.2s' }} />}
                      sx={{ p: 0, '&:hover': { bgcolor: 'transparent' }, textTransform: 'none', fontWeight: 'bold' }}
                    >
                      Read More
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            size="large" 
            sx={{ py: 1.5, px: 4, borderRadius: 2, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
          >
            Load More Articles
          </Button>
        </Box>
      </Container>

    </Box>
  );
};

export default Blog;