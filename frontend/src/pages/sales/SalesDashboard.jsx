import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Stack, Button, CircularProgress } from "@mui/material";
import { PrimaryButton } from '../../components/ui';
import { ShoppingBag, TrendingUp, DollarSign, RefreshCcw, Plus } from 'lucide-react';
import { useSales } from '../../hooks/useSales';
import { formatCurrency } from '../../utils/salesHelpers';
import SalesTable from '../../components/sales/SalesTable';

// Explicit color mappings for high-contrast, professional KPI cards
const kpiColors = {
  success: { bg: '#ecfdf5', icon: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
  primary: { bg: '#e0e7ff', icon: '#4f46e5', border: 'rgba(79, 70, 229, 0.2)' },
  secondary: { bg: '#cffafe', icon: '#06b6d4', border: 'rgba(6, 182, 212, 0.2)' },
  error: { bg: '#ffe4e6', icon: '#e11d48', border: 'rgba(225, 29, 72, 0.2)' },
};

// Premium Stat Card - Compact, Balanced & Responsive
// Every card fills 100% of its CSS Grid cell, and the parent grid uses
// gridAutoRows: '1fr' — so all four cards are FORCED to the exact same
// height, on every row, regardless of whether they have a trend line or not.
const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const theme = kpiColors[color] || kpiColors.primary;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3.5,
        bgcolor: '#ffffff',
        border: "1px solid",
        borderColor: "#e2e8f0",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        width: '100%',
        height: '100%', // fills the equal-height grid cell exactly
        boxSizing: 'border-box',
        boxShadow: '0 2px 6px -1px rgba(0, 0, 0, 0.03), 0 1px 3px -1px rgba(0, 0, 0, 0.02)',
        '&:hover': {
          boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.08), 0 6px 8px -4px rgba(0, 0, 0, 0.04)',
          transform: 'translateY(-3px)'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#0f172a',
            fontSize: { xs: '1.15rem', sm: '1.4rem', md: '1.5rem', lg: '1.65rem' },
            lineHeight: 1.2,
            mt: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {value}
        </Typography>
        {/* Trend row always renders (even when empty) so every card reserves
            identical vertical space for it — content just goes invisible. */}
        <Typography
          variant="caption"
          sx={{
            color: "#10b981",
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            mt: 0.5,
            fontSize: '0.75rem',
            lineHeight: 1.2,
            minHeight: '1.2em',
            visibility: trend ? 'visible' : 'hidden'
          }}
        >
          {trend || '—'}
        </Typography>
      </Box>
      <Box sx={{
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: 3,
        bgcolor: theme.bg,
        color: theme.icon,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `inset 0 0 0 1px ${theme.border}`,
        flexShrink: 0,
        ml: 1.5
      }}>
        <Icon size={22} strokeWidth={2.5} />
      </Box>
    </Paper>
  );
};

function SalesDashboard() {
  const navigate = useNavigate();
  const { sales, loading } = useSales();

  const totalRevenue = sales.reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
  const totalOrders = sales.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 5 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={3}
        mb={5}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} color="#0f172a" gutterBottom>
            Sales Dashboard
          </Typography>
          <Typography color="#64748b" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Monitor your store's performance metrics in real-time and make data-driven decisions.
          </Typography>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <PrimaryButton
            variant="outlined"
            size="medium"
            onClick={() => navigate('/sales/upload')}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 600, px: 3, height: '44px', borderColor: '#cbd5e1', color: '#334155', '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' } }}
          >
            Upload CSV
          </PrimaryButton>
          <PrimaryButton
            variant="contained"
            size="medium"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/sales/add')}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 600, px: 3.5, height: '44px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 12px 0 rgba(99, 102, 241, 0.3)' }}
          >
            Add New Sale
          </PrimaryButton>
        </Stack>
      </Stack>

      {/* KPI Cards — plain CSS Grid with gridAutoRows: '1fr' so EVERY card,
          in every row, is forced to the exact same height. This is more
          reliable than MUI's <Grid> stretch, which only matches heights
          within a single row and can still drift between the two rows. */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gridAutoRows: '1fr',
          gap: { xs: 1.5, sm: 2.5 },
          mb: 5
        }}
      >
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="success"
          trend="↑ +12% this month"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={ShoppingBag}
          color="primary"
        />
        <StatCard
          title="Avg Order Value"
          value={formatCurrency(avgOrderValue)}
          icon={TrendingUp}
          color="secondary"
        />
        <StatCard
          title="Returns"
          value="0"
          icon={RefreshCcw}
          color="error"
        />
      </Box>

      {/* Recent Sales */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
          <Typography variant="h6" fontWeight={700} color="#0f172a">Recent Sales</Typography>
          <PrimaryButton variant="text" onClick={() => navigate('/sales/list')} sx={{ textTransform: 'none', fontWeight: 600, color: '#4f46e5', fontSize: '0.9rem' }}>
            View All Sales →
          </PrimaryButton>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#4f46e5' }} />
          </Box>
        ) : (
          <SalesTable sales={sales.slice(0, 10)} />
        )}
      </Box>
    </Container>
  );
}

export default SalesDashboard;