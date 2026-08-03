import React from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Skeleton,
} from "@mui/material";
import {
  DollarSign,
  BadgeIndianRupee,
  ShoppingCart,
  Package,
} from "lucide-react";
import { formatCurrency } from "../../utils/salesHelpers";

/* ==========================================================
   Reusable Stat Card
========================================================== */

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  loading,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all .25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Box flex={1}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
          mb={1}
        >
          {title}
        </Typography>

        {loading ? (
          <Skeleton width={120} height={42} />
        ) : (
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: (theme) =>
            theme.palette[color]?.light || "#E3F2FD",
        }}
      >
        <Icon size={30} color="currentColor" />
      </Box>
    </Paper>
  );
};

/* ==========================================================
   Sales Stats
========================================================== */

const SalesStats = ({ analytics, loading }) => {
  return (
    <Grid container spacing={3} mb={4}>
      {/* Revenue */}
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Total Revenue"
          value={formatCurrency(analytics?.total_revenue ?? 0)}
          subtitle="Overall sales revenue"
          icon={DollarSign}
          color="success"
          loading={loading}
        />
      </Grid>

      {/* Profit */}
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Total Profit"
          value={formatCurrency(analytics?.total_profit ?? 0)}
          subtitle="Estimated profit"
          icon={BadgeIndianRupee}
          color="primary"
          loading={loading}
        />
      </Grid>

      {/* Orders */}
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Orders"
          value={loading ? "" : (analytics?.total_orders ?? 0).toLocaleString()}
          subtitle="Completed orders"
          icon={ShoppingCart}
          color="warning"
          loading={loading}
        />
      </Grid>

      {/* Products Sold */}
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Products Sold"
          value={loading ? "" : (analytics?.total_products_sold ?? 0).toLocaleString()}
          subtitle="Units sold"
          icon={Package}
          color="secondary"
          loading={loading}
        />
      </Grid>

      {/* Today's Sales */}
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Today's Sales"
          value={formatCurrency(analytics?.today_sales ?? 0)}
          subtitle="Revenue generated today"
          icon={DollarSign}
          color="info"
          loading={loading}
        />
      </Grid>

      {/* Today's Orders */}
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Today's Orders"
          value={loading ? "" : (analytics?.today_orders ?? 0).toLocaleString()}
          subtitle="Orders placed today"
          icon={ShoppingCart}
          color="success"
          loading={loading}
        />
      </Grid>

      {/* Low Stock */}
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Low Stock"
          value={loading ? "" : (analytics?.low_stock_products ?? 0).toLocaleString()}
          subtitle="Need restocking"
          icon={Package}
          color="warning"
          loading={loading}
        />
      </Grid>

      {/* Out Of Stock */}
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Out Of Stock"
          value={loading ? "" : (analytics?.out_of_stock_products ?? 0).toLocaleString()}
          subtitle="Currently unavailable"
          icon={Package}
          color="error"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default SalesStats;