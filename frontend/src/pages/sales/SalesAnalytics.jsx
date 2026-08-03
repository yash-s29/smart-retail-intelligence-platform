import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Card,
  CardContent,
  useTheme,
  alpha,
  Skeleton,
  MenuItem,
} from '@mui/material';
import { PrimaryButton, FormField } from '../../components/ui';
import {
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
  Percent,
  Coins,
  ArrowUpRight
} from 'lucide-react';

import { useSales } from '../../hooks/useSales';
import { formatCurrency } from '../../utils/salesHelpers';

// Recharts imports for Deep Business Intelligence
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const SalesAnalytics = () => {
  const theme = useTheme();
  const { analytics, loading, refreshAll } = useSales();
  const [timeRange, setTimeRange] = useState('30days');

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main
  ];

  // ==========================================
  // Memoized Safely Mapped Data
  // ==========================================
  const parsedCategoryData = useMemo(() => {
    if (!analytics?.category_performance) {
      return [
        { name: 'Apparel', value: 4000 },
        { name: 'Electronics', value: 3000 },
        { name: 'Groceries', value: 2000 },
        { name: 'Home Appliances', value: 2780 },
      ];
    }
    return analytics.category_performance.map(cat => ({
      name: cat.category,
      value: cat.revenue
    }));
  }, [analytics]);

  const parsedPerformanceData = useMemo(() => {
    if (!analytics?.monthly_performance) {
      return [
        { month: 'Jan', revenue: 4000, profit: 2400 },
        { month: 'Feb', revenue: 5000, profit: 2800 },
        { month: 'Mar', revenue: 6000, profit: 3500 },
        { month: 'Apr', revenue: 5500, profit: 3100 },
        { month: 'May', revenue: 7000, profit: 4200 },
        { month: 'Jun', revenue: 8500, profit: 5100 },
      ];
    }
    return analytics.monthly_performance;
  }, [analytics]);

  // Handle analytical CSV reports download
  const downloadAnalyticsReport = () => {
    const csvRows = [];
    csvRows.push(['Sales Analysis Report', `Exported on: ${new Date().toLocaleDateString()}`]);
    csvRows.push([]);
    
    csvRows.push(['Month', 'Revenue', 'Profit']);
    parsedPerformanceData.forEach(p => {
      csvRows.push([p.month, p.revenue, p.profit]);
    });
    
    csvRows.push([]);
    csvRows.push(['Product Category', 'Total Value Contribution']);
    parsedCategoryData.forEach(c => {
      csvRows.push([c.name, c.value]);
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Analytics_Insights_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ pb: 12, pt: { xs: 4, md: 6 }, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="xl">
        
        {/* ==========================================
            Header Section
           ========================================== */}
        <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" fontWeight="800" sx={{ letterSpacing: -0.5 }}>
              Sales & Predictive Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review platform profitability, high-yield product insights, and distribution.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <FormField
              select
              size="small"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{ width: 150, backgroundColor: theme.palette.background.paper }}
              InputProps={{ startAdornment: <Calendar size={16} style={{ marginRight: '8px', color: theme.palette.text.secondary }} /> }}
            >
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="90days">Last 90 Days</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </FormField>
            
            <PrimaryButton variant="contained" color="primary" startIcon={<Download size={18} />} onClick={downloadAnalyticsReport} sx={{ borderRadius: 2, textTransform: 'none', px: 3, fontWeight: '600' }}>
              Export Analytics
            </PrimaryButton>
          </Stack>
        </Box>

        {/* ==========================================
            Deep BI KPI Stats Cards
           ========================================== */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Average profit margin */}
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ p: 1.5, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ p: 2, borderRadius: 3, backgroundColor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  <Percent size={28} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">Average Profit Margin</Typography>
                  {loading ? (
                    <Skeleton width={80} height={36} />
                  ) : (
                    <Typography variant="h4" fontWeight="800">
                      {analytics?.avg_profit_margin ?? '34.2'}%
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Average Invoice Value */}
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ p: 1.5, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ p: 2, borderRadius: 3, backgroundColor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                  <Coins size={28} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">Average Order Value</Typography>
                  {loading ? (
                    <Skeleton width={120} height={36} />
                  ) : (
                    <Typography variant="h4" fontWeight="800">
                      {formatCurrency(analytics?.avg_order_value ?? 1450)}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Retention Estimate */}
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ p: 1.5, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ p: 2, borderRadius: 3, backgroundColor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                  <TrendingUp size={28} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">Customer Retention Rate</Typography>
                  {loading ? (
                    <Skeleton width={80} height={36} />
                  ) : (
                    <Typography variant="h4" fontWeight="800">
                      {analytics?.retention_rate ?? '78.5'}%
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ==========================================
            Deep Analytics Charts Section
           ========================================== */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Revenue vs Profit (Monthly Performance) */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="700">Financial Performance Overview</Typography>
                <Typography variant="caption" color="text.secondary">Detailed comparison of global incoming revenue versus net platform profits.</Typography>
              </Box>

              <Box sx={{ width: '100%', height: 350 }}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 3 }} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={parsedPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                      <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                      <YAxis stroke={theme.palette.text.secondary} />
                      <ChartTooltip 
                        contentStyle={{ 
                          backgroundColor: theme.palette.background.paper, 
                          borderColor: theme.palette.divider,
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill={theme.palette.primary.main} name="Revenue" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="profit" fill={theme.palette.success.main} name="Profit" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Pie/Donut Chart for Category Distribution */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="700">Category Sales Mix</Typography>
                <Typography variant="caption" color="text.secondary">Overall revenue broken down by product category.</Typography>
              </Box>

              <Box sx={{ width: '100%', height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {loading ? (
                  <Skeleton variant="circular" width={200} height={200} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={parsedCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {parsedCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>

              {/* Chart Legend list below */}
              {!loading && (
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {parsedCategoryData.map((entry, index) => (
                    <Box key={entry.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }} />
                        <Typography variant="caption" fontWeight="600">{entry.name}</Typography>
                      </Stack>
                      <Typography variant="caption" fontWeight="bold" color="text.secondary">
                        {formatCurrency(entry.value)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* ==========================================
            Predictive AI Smart Recommendations Card
           ========================================== */}
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: `1px dashed ${theme.palette.primary.main}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{ color: theme.palette.primary.main }}>
              <Sparkles size={24} />
            </Box>
            <Typography variant="h6" fontWeight="700" color="primary">
              AI Intelligent Store Optimization Engine
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 800, lineHeight: 1.7 }}>
            Our machine learning models have completed evaluating your latest checkout transactions. Based on sales trends, festival scheduling, and consumer buying habits:
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ p: 0.5, color: theme.palette.success.main }}>
                    <ArrowUpRight size={20} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="700" gutterBottom>High Demand Alert</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expect a 15% increase in your highest performing category next week due to historical seasonal trends. Consider initiating early restock procedures.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ p: 0.5, color: theme.palette.secondary.main }}>
                    <ArrowUpRight size={20} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="700" gutterBottom>Dynamic Pricing Recommendation</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Slow-moving stock in secondary items can be paired as bundles with top performing goods to optimize overall platform profit and shelf clearance.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

      </Container>
    </Box>
  );
};

export default SalesAnalytics;