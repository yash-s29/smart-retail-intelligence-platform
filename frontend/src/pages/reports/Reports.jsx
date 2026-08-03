import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PrimaryButton, FormField } from "../../components/ui";
import {
  BarChart3,
  RefreshCw,
  TrendingUp,
  Package,
  Warehouse,
  Target,
  IndianRupee,
  ShoppingCart,
  Percent,
  AlertTriangle,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import reportsApi from "../../services/reportsApi";

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const num = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );

function defaultRange(days = 30) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { from_date: fmt(from), to_date: fmt(to) };
}

function shortLabel(ds) {
  try {
    return new Date(ds).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return ds;
  }
}

function MetricCard({ icon, label, value, sub, color = "#2563eb" }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 1.75 },
        height: "100%",
        minHeight: { xs: 100, sm: 112 },
        display: "flex",
        flexDirection: "column",
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "divider",
        background: `linear-gradient(145deg, ${color}12 0%, transparent 60%)`,
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 20px rgba(15,23,42,0.07)",
        },
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start", flex: 1 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.75,
            display: "grid",
            placeItems: "center",
            bgcolor: `${color}18`,
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{
              fontSize: "0.68rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: 1.2,
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              mt: 0.4,
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
              letterSpacing: "-0.02em",
              wordBreak: "break-word",
              lineHeight: 1.2,
              flexGrow: 1,
            }}
          >
            {value}
          </Typography>
          {sub ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.25, fontSize: "0.68rem" }}
              noWrap
            >
              {sub}
            </Typography>
          ) : (
            <Box sx={{ height: 14 }} />
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

function MetricGrid({ children }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          md: "repeat(4, minmax(0, 1fr))",
        },
        gap: 1.25,
        mb: 2,
      }}
    >
      {children}
    </Box>
  );
}

function Panel({ title, action, children, sx }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 1.75, sm: 2 },
          py: 1.25,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "action.hover",
        }}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          {title}
        </Typography>
        {action}
      </Stack>
      <Box sx={{ p: { xs: 1.5, sm: 2 }, flex: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );
}

function Empty({ title, description }) {
  return (
    <Box sx={{ py: 4, px: 1, textAlign: "center" }}>
      <Typography fontWeight={700} gutterBottom sx={{ fontSize: "0.95rem" }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mx: "auto", fontSize: "0.8rem" }}>
        {description}
      </Typography>
    </Box>
  );
}

function DataTable({ columns, rows, emptyTitle, emptyDesc }) {
  if (!rows?.length) {
    return <Empty title={emptyTitle} description={emptyDesc} />;
  }
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box
        component="table"
        sx={{
          width: "100%",
          minWidth: 480,
          borderCollapse: "collapse",
          "& th": {
            textAlign: "left",
            px: 1.5,
            py: 1,
            fontSize: "0.68rem",
            fontWeight: 700,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            borderBottom: "1px solid",
            borderColor: "divider",
            whiteSpace: "nowrap",
          },
          "& td": {
            px: 1.5,
            py: 1.2,
            borderBottom: "1px solid",
            borderColor: "divider",
            fontSize: "0.82rem",
          },
          "& tbody tr:hover": { bgcolor: "action.hover" },
          "& tbody tr:last-of-type td": { borderBottom: "none" },
        }}
      >
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.product_id || row.ds || row.category || i}>
              {columns.map((c) => (
                <td key={c.key} style={c.bold ? { fontWeight: 600 } : undefined}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}

export default function Reports() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const initial = defaultRange(30);
  const [fromDate, setFromDate] = useState(initial.from_date);
  const [toDate, setToDate] = useState(initial.to_date);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await reportsApi.dashboard({
        from_date: fromDate,
        to_date: toDate,
        product_limit: 10,
      });
      setData(res);
    } catch (err) {
      setError(
        err?.friendlyMessage ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load reports"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    load();
  }, [load]);

  const overview = data?.overview || {};
  const trend = data?.trend?.points || [];
  const topProducts = data?.products?.top || [];
  const bottomProducts = data?.products?.bottom || [];
  const inventory = data?.inventory || {};
  const categories = data?.category_mix?.categories || [];
  const accuracy = data?.forecast_accuracy || {};

  const trendChart = useMemo(
    () => trend.map((p) => ({ ...p, label: shortLabel(p.ds) })),
    [trend]
  );

  const accuracyChart = useMemo(() => {
    const pts = accuracy.points || [];
    return pts.slice(-30).map((p) => ({
      label: shortLabel(p.ds),
      ds: p.ds,
      actual: p.y_actual,
      predicted: p.yhat,
    }));
  }, [accuracy]);

  const productCols = [
    {
      key: "product_name",
      label: "Product",
      bold: true,
      render: (r) => r.product_name,
    },
    { key: "units_sold", label: "Units", render: (r) => num(r.units_sold) },
    { key: "revenue", label: "Revenue", render: (r) => money(r.revenue) },
    { key: "profit", label: "Profit", render: (r) => money(r.profit) },
    {
      key: "margin_pct",
      label: "Margin",
      render: (r) => `${Number(r.margin_pct || 0).toFixed(1)}%`,
    },
  ];

  const preset = (days) => {
    const r = defaultRange(days);
    setFromDate(r.from_date);
    setToDate(r.to_date);
  };

  return (
    <Box sx={{ minHeight: "100%", bgcolor: "background.default", pb: { xs: 3, md: 4 } }}>
      <Container maxWidth="xl" sx={{ pt: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2.25 } }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{
            mb: 2,
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "flex-start" },
          }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.3rem", sm: "1.55rem" },
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              Reports
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.35, maxWidth: 480, fontSize: "0.82rem" }}>
              Sales, inventory health, and forecast accuracy from live store data.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ alignItems: { sm: "center" }, flexWrap: "wrap" }}
          >
            <FormField
              type="date"
              size="small"
              label="From"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: { xs: "100%", sm: 140 } }}
            />
            <FormField
              type="date"
              size="small"
              label="To"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: { xs: "100%", sm: 140 } }}
            />
            <Stack direction="row" spacing={0.75}>
              {[7, 30, 90].map((d) => (
                <Chip
                  key={d}
                  size="small"
                  label={`${d}d`}
                  onClick={() => preset(d)}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    transition: "all 150ms ease",
                    "&:hover": { borderColor: "primary.main", bgcolor: "rgba(99,102,241,0.06)" },
                  }}
                />
              ))}
            </Stack>
            <PrimaryButton
              variant="contained"
              size="small"
              startIcon={
                loading ? <CircularProgress size={14} color="inherit" /> : <RefreshCw size={14} />
              }
              disabled={loading}
              onClick={load}
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
            >
              Refresh
            </PrimaryButton>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {loading && !data ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress size={30} />
            <Typography sx={{ mt: 1.5 }} color="text.secondary" variant="body2">
              Loading reports…
            </Typography>
          </Box>
        ) : (
          <>
            {/* Top KPIs — equal size */}
            <MetricGrid>
              <MetricCard
                icon={<IndianRupee size={18} />}
                label="Total revenue"
                value={money(overview.total_revenue)}
                sub={`${overview.from_date || fromDate} → ${overview.to_date || toDate}`}
                color="#2563eb"
              />
              <MetricCard
                icon={<TrendingUp size={18} />}
                label="Total profit"
                value={money(overview.total_profit)}
                sub={`Margin ${Number(overview.profit_margin_pct || 0).toFixed(1)}%`}
                color="#059669"
              />
              <MetricCard
                icon={<ShoppingCart size={18} />}
                label="Orders"
                value={num(overview.total_orders)}
                sub={`AOV ${money(overview.avg_order_value)}`}
                color="#7c3aed"
              />
              <MetricCard
                icon={<Package size={18} />}
                label="Units sold"
                value={num(overview.total_units)}
                sub={`${overview.unique_products_sold || 0} products`}
                color="#d97706"
              />
            </MetricGrid>

            {/* Tabs */}
            <Paper
              elevation={0}
              sx={{
                mb: 2,
                borderRadius: 2.5,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
              }}
            >
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{
                  minHeight: 46,
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    minHeight: 46,
                    fontSize: { xs: "0.78rem", sm: "0.88rem" },
                  },
                }}
              >
                <Tab icon={<BarChart3 size={15} />} iconPosition="start" label="Overview" />
                <Tab icon={<Package size={15} />} iconPosition="start" label="Products" />
                <Tab icon={<Warehouse size={15} />} iconPosition="start" label="Inventory" />
                <Tab icon={<Target size={15} />} iconPosition="start" label="Forecast accuracy" />
              </Tabs>
            </Paper>

      {/* -------- Overview -------- */}
{tab === 0 && (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "minmax(0, 1.6fr) minmax(0, 1fr)",
      },
      gap: 1.75,
      width: "100%",
      alignItems: "stretch",
    }}
  >
    {/* Sales trend — takes most width */}
    <Panel title="Sales trend">
      {trendChart.length === 0 ? (
        <Empty
          title="No sales in this period"
          description="Record completed sales to see revenue over time."
        />
      ) : (
        <Box sx={{ width: "100%", height: { xs: 240, sm: 300, md: 340 } }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={trendChart}
              margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                minTickGap={16}
                tickLine={false}
                axisLine={{ opacity: 0.25 }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                width={42}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  v >= 1e6
                    ? `${(v / 1e6).toFixed(1)}M`
                    : v >= 1e3
                    ? `${(v / 1e3).toFixed(0)}k`
                    : v
                }
              />
              <Tooltip
                formatter={(value, name) => [
                  name === "orders" ? num(value) : money(value),
                  name === "revenue"
                    ? "Revenue"
                    : name === "profit"
                    ? "Profit"
                    : "Orders",
                ]}
                labelFormatter={(_, p) => p?.[0]?.payload?.ds || ""}
              />
              <Legend
                verticalAlign="top"
                height={28}
                iconType="circle"
                wrapperStyle={{ fontSize: 12, paddingBottom: 4 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.12}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Panel>

    {/* Category mix — side panel, full height of row */}
    <Panel title="Category mix">
      {categories.length === 0 ? (
        <Empty
          title="No category data"
          description="Add categories on products to see mix."
        />
      ) : (
        <Stack spacing={1.75} sx={{ minHeight: { md: 280 } }}>
          {categories.slice(0, 8).map((c) => (
            <Box key={c.category}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 0.6,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    fontSize: "0.85rem",
                    flex: "1 1 auto",
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.category}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    flex: "0 0 auto",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    fontSize: "0.75rem",
                  }}
                >
                  {Number(c.share_pct || 0).toFixed(0)}% · {money(c.revenue)}
                </Typography>
              </Stack>
              <Box
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "action.hover",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${Math.min(100, Number(c.share_pct) || 0)}%`,
                    height: "100%",
                    bgcolor: "primary.main",
                    borderRadius: 4,
                    transition: "width 400ms ease",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Panel>
  </Box>
)}

            {/* Products */}
            {tab === 1 && (
              <Grid container spacing={1.75}>
                <Grid item xs={12} lg={6}>
                  <Panel title="Top products by revenue" action={<Chip size="small" label="Top 10" variant="outlined" />}>
                    <DataTable
                      columns={productCols}
                      rows={topProducts}
                      emptyTitle="No product sales"
                      emptyDesc="Complete sales in this date range to rank products."
                    />
                  </Panel>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Panel title="Lower performers" action={<Chip size="small" label="Bottom" variant="outlined" />}>
                    <DataTable
                      columns={productCols}
                      rows={bottomProducts}
                      emptyTitle="No product sales"
                      emptyDesc="Not enough sales to show bottom performers."
                    />
                  </Panel>
                </Grid>
              </Grid>
            )}

            {/* Inventory */}
            {tab === 2 && (
              <>
                <MetricGrid>
                  <MetricCard
                    icon={<Layers size={18} />}
                    label="SKUs"
                    value={num(inventory.total_skus)}
                    color="#2563eb"
                  />
                  <MetricCard
                    icon={<Warehouse size={18} />}
                    label="Stock units"
                    value={num(inventory.total_stock_units)}
                    color="#7c3aed"
                  />
                  <MetricCard
                    icon={<IndianRupee size={18} />}
                    label="Stock value"
                    value={money(inventory.total_stock_value)}
                    color="#059669"
                  />
                  <MetricCard
                    icon={<AlertTriangle size={18} />}
                    label="At risk"
                    value={(inventory.low_stock_count || 0) + (inventory.out_of_stock_count || 0)}
                    sub={`${inventory.out_of_stock_count || 0} out · ${inventory.low_stock_count || 0} low`}
                    color="#dc2626"
                  />
                </MetricGrid>

                <Grid container spacing={1.75}>
                  <Grid item xs={12} md={6}>
                    <Panel title="Out of stock">
                      <DataTable
                        columns={[
                          {
                            key: "product_name",
                            label: "Product",
                            bold: true,
                            render: (r) => r.product_name,
                          },
                          { key: "current_stock", label: "Stock", render: (r) => r.current_stock },
                          { key: "reorder_level", label: "Reorder", render: (r) => r.reorder_level },
                          { key: "stock_value", label: "Value", render: (r) => money(r.stock_value) },
                        ]}
                        rows={inventory.out_of_stock_items || []}
                        emptyTitle="No out-of-stock items"
                        emptyDesc="All tracked products have stock on hand."
                      />
                    </Panel>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Panel title="Low stock">
                      <DataTable
                        columns={[
                          {
                            key: "product_name",
                            label: "Product",
                            bold: true,
                            render: (r) => r.product_name,
                          },
                          { key: "current_stock", label: "Stock", render: (r) => r.current_stock },
                          { key: "reorder_level", label: "Reorder", render: (r) => r.reorder_level },
                          {
                            key: "status",
                            label: "Status",
                            render: (r) => (
                              <Chip
                                size="small"
                                label={r.status}
                                color="warning"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                            ),
                          },
                        ]}
                        rows={inventory.low_stock_items || []}
                        emptyTitle="No low-stock items"
                        emptyDesc="Nothing below reorder level right now."
                      />
                    </Panel>
                  </Grid>
                </Grid>
              </>
            )}

            {/* Forecast accuracy */}
            {tab === 3 && (
              <>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 1.25,
                    mb: 2,
                  }}
                >
                  <MetricCard
                    icon={<Percent size={18} />}
                    label="MAPE"
                    value={accuracy.mape != null ? `${Number(accuracy.mape).toFixed(1)}%` : "—"}
                    sub={accuracy.model_type || "Model"}
                    color="#2563eb"
                  />
                  <MetricCard
                    icon={<Target size={18} />}
                    label="MAE"
                    value={accuracy.mae != null ? money(accuracy.mae) : "—"}
                    sub={`${accuracy.n_points || 0} scored points`}
                    color="#7c3aed"
                  />
                  <MetricCard
                    icon={<TrendingUp size={18} />}
                    label="RMSE"
                    value={accuracy.rmse != null ? money(accuracy.rmse) : "—"}
                    sub={accuracy.status || "—"}
                    color="#059669"
                  />
                </Box>

                {accuracy.recommendation && (
                  <Alert severity="info" sx={{ mb: 1.75, borderRadius: 2 }}>
                    {accuracy.recommendation}
                  </Alert>
                )}

                <Panel title="Actual vs predicted (chain revenue)">
                  {accuracyChart.length === 0 ? (
                    <Empty
                      title="Forecast accuracy unavailable"
                      description="Train models and ensure forecast accuracy can load ML history."
                    />
                  ) : (
                    <Box sx={{ width: "100%", height: { xs: 240, md: 320 } }}>
                      <ResponsiveContainer>
                        <ComposedChart data={accuracyChart} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                          <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={16} tickLine={false} />
                          <YAxis
                            tick={{ fontSize: 11 }}
                            width={44}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) =>
                              v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}k` : v
                            }
                          />
                          <Tooltip
                            formatter={(v, name) => [money(v), name === "actual" ? "Actual" : "Predicted"]}
                            labelFormatter={(_, p) => p?.[0]?.payload?.ds || ""}
                          />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Area
                            type="monotone"
                            dataKey="predicted"
                            name="predicted"
                            stroke="#2563eb"
                            fill="#2563eb"
                            fillOpacity={0.12}
                            strokeWidth={2}
                            connectNulls
                          />
                          <Line
                            type="monotone"
                            dataKey="actual"
                            name="actual"
                            stroke="#64748b"
                            strokeWidth={2}
                            dot={false}
                            connectNulls
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </Panel>
              </>
            )}
          </>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mt: 3 }}
        >
    
        </Typography>
      </Container>
    </Box>
  );
}