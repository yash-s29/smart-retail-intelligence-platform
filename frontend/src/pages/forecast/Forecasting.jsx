import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip as MuiTooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PrimaryButton, FormField } from '../../components/ui';
import {
  ChartNoAxesCombined,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Bot,
  Package,
  IndianRupee,
  CalendarDays,
  Activity,
  Layers,
  AlertTriangle,
  Inbox,
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

import { getProducts } from "../../services/productApi";
import forecastApi from "../../services/forecastApi";
import { useForecast } from "../../hooks/useForecast";

// =====================================================
// Layout tokens — one small set of numbers reused
// everywhere so the page reads as one compact system
// instead of a stack of separately-tuned cards.
// =====================================================

const RADIUS = 3; // consistent corner radius across all surfaces
const GAP = 2; // consistent gap between cards/sections
const CARD_PAD = { xs: 1.75, sm: 2.25 }; // consistent inner card padding

// CSS-grid auto-fit is used instead of MUI's 12-col Grid for control
// rows and KPI strips. Auto-fit reflows based on the *actual* pixel
// width available (works correctly next to a sidebar), whereas MUI's
// xs/sm/md breakpoints react to the viewport width and can squeeze
// fields (e.g. the Product select truncating to "P..") when a fixed
// sidebar eats into the real content width.
const autoGrid = (min) => ({
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
  gap: GAP,
});

// =====================================================
// Helpers
// =====================================================

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const compactMoney = (v) => {
  const n = Number(v) || 0;
  if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
  if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  if (Math.abs(n) >= 1e3) return `₹${(n / 1e3).toFixed(0)}k`;
  return `₹${n}`;
};

const shortDate = (ds) => {
  if (!ds) return "—";
  try {
    return new Date(ds).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return ds;
  }
};

const fullDate = (ds) => {
  if (!ds) return "—";
  try {
    return new Date(ds).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
  } catch {
    return ds;
  }
};

// =====================================================
// Reusable UI pieces
// =====================================================

function MetricCard({ icon, label, value, sub, color, loading }) {
  const theme = useTheme();
  const c = color || theme.palette.primary.main;
  return (
    <Paper
      elevation={0}
      sx={{
        p: CARD_PAD,
        height: "100%",
        borderRadius: RADIUS,
        border: "1px solid",
        borderColor: "divider",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: `${c}1A`,
            color: c,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 600, lineHeight: 1.3, fontSize: "0.76rem" }}
            noWrap
          >
            {label}
          </Typography>
          {loading ? (
            <Box
              sx={{
                mt: 0.75,
                height: 24,
                width: "65%",
                borderRadius: 1,
                bgcolor: "action.hover",
              }}
            />
          ) : (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mt: 0.4,
                fontSize: { xs: "1.1rem", sm: "1.3rem" },
                letterSpacing: "-0.02em",
                wordBreak: "break-word",
                lineHeight: 1.15,
              }}
            >
              {value}
            </Typography>
          )}
          {sub ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.4, fontSize: "0.7rem" }}
              noWrap
            >
              {sub}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </Paper>
  );
}

function SectionHeader({ icon, title, subtitle, action }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={1.25}
      mb={1.5}
    >
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              fontSize: { xs: "1rem", sm: "1.15rem" },
            }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.82rem" } }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Stack>
      {action ? (
        <Box sx={{ width: { xs: "100%", sm: "auto" } }}>{action}</Box>
      ) : null}
    </Stack>
  );
}

function EmptyState({ title, description, icon }) {
  return (
    <Box sx={{ py: { xs: 4, md: 5.5 }, px: 2, textAlign: "center" }}>
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          bgcolor: "action.hover",
          display: "grid",
          placeItems: "center",
          mx: "auto",
          mb: 1.5,
          color: "text.secondary",
        }}
      >
        {icon || <Inbox size={22} />}
      </Box>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" maxWidth={400} mx="auto">
        {description}
      </Typography>
    </Box>
  );
}

function LoadingBlock({ label = "Loading…" }) {
  return (
    <Box textAlign="center" py={6}>
      <CircularProgress size={32} thickness={4} />
      <Typography mt={1.5} color="text.secondary" variant="body2">
        {label}
      </Typography>
    </Box>
  );
}

function CardShell({ children, sx }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: RADIUS,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

function CardTitleBar({ title, action }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={1}
      sx={{
        px: CARD_PAD,
        py: 1.5,
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
  );
}

// Custom chart tooltip — fixes the original bug where both series
// rendered the label "Predicted". Reads the real dataKey per entry
// and only shows series that actually have a value on that date.
function ForecastTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const ds = payload[0]?.payload?.ds;
  const rows = payload.filter((p) => p.value !== null && p.value !== undefined);

  if (!rows.length) return null;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
        px: 2,
        py: 1.25,
        minWidth: 180,
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {fullDate(ds) !== "—" ? fullDate(ds) : label}
      </Typography>
      <Stack spacing={0.5} mt={0.75}>
        {rows.map((row) => {
          const isActual = row.dataKey === "actual";
          return (
            <Stack
              key={row.dataKey}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: isActual ? "text.secondary" : "primary.main",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {isActual ? "Actual" : "Predicted"}
                </Typography>
              </Stack>
              <Typography variant="body2" fontWeight={700}>
                {money(row.value)}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}

// =====================================================
// Page
// =====================================================

export default function Forecasting() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Small accent palette derived from the app's own theme so the
  // KPI cards feel native to the product instead of a generic blue
  // dashboard dropped on top.
  const ACCENTS = {
    revenue: theme.palette.primary.main,
    growth: theme.palette.success?.main || "#059669",
    history: theme.palette.secondary?.main || "#7c3aed",
    forecast: theme.palette.warning?.main || "#d97706",
    danger: theme.palette.error?.main || "#dc2626",
    actualLine: theme.palette.text.secondary,
    predictedLine: theme.palette.primary.main,
  };

  const {
    forecasts,
    summary,
    loading: productLoading,
    error: productError,
    refresh: refreshProducts,
    generate,
    generateAll,
  } = useForecast();

  const [tab, setTab] = useState(0);

  // ML state
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState("");
  const [mlData, setMlData] = useState(null);
  const [models, setModels] = useState([]);
  const [horizonDays, setHorizonDays] = useState(7);
  const [modelName, setModelName] = useState("best");
  const [historyDays, setHistoryDays] = useState(30);

  // Product state
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [periodDays, setPeriodDays] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSeverity, setMessageSeverity] = useState("warning");

  // ---- products ----
  useEffect(() => {
    getProducts()
      .then((response) => {
        const list = response?.data || response || [];
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        setMessageSeverity("warning");
        setMessage(
          "Products could not be loaded. Create a product before generating a forecast."
        );
      });
  }, []);

  // ---- models list ----
  useEffect(() => {
    forecastApi
      .mlModels()
      .then((res) => {
        setModels(res?.models || []);
        if (res?.default_model) setModelName(res.default_model);
      })
      .catch(() => {});
  }, []);

  // ---- ML dashboard ----
  const loadMlDashboard = useCallback(async () => {
    setMlLoading(true);
    setMlError("");
    try {
      const data = await forecastApi.mlDashboard({
        horizon_days: horizonDays,
        model_name: modelName,
        include_history_days: historyDays,
      });
      setMlData(data);
      if (data?.status === "error") {
        setMlError(
          data?.recommendation ||
            data?.error ||
            "ML forecast unavailable. Train models first."
        );
      }
    } catch (err) {
      setMlError(
        err?.friendlyMessage ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load ML forecast"
      );
      setMlData(null);
    } finally {
      setMlLoading(false);
    }
  }, [horizonDays, modelName, historyDays]);

  useEffect(() => {
    loadMlDashboard();
  }, [loadMlDashboard]);

  const chartData = useMemo(() => {
    if (!mlData) return [];
    const hist = (mlData.history || []).map((p) => ({
      ds: p.ds,
      label: shortDate(p.ds),
      actual: p.y_actual ?? null,
      predicted: p.yhat ?? null,
    }));
    const fut = (mlData.forecast || []).map((p) => ({
      ds: p.ds,
      label: shortDate(p.ds),
      actual: null,
      predicted: p.yhat ?? null,
    }));
    return [...hist, ...fut];
  }, [mlData]);

  const handleRefreshAll = () => {
    loadMlDashboard();
    refreshProducts();
  };

  const runProduct = async (all = false) => {
    if (!all && !productId) {
      setMessageSeverity("warning");
      setMessage("Select a product first.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const result = all
        ? await generateAll(periodDays)
        : await generate(productId, periodDays);
      setMessageSeverity("success");
      setMessage(
        all
          ? `${result?.length || 0} forecasts generated.`
          : "Forecast generated successfully."
      );
    } catch (err) {
      setMessageSeverity("error");
      setMessage(
        err?.friendlyMessage ||
          err?.response?.data?.detail ||
          "Forecast generation failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const availableModels = models.length
    ? models.filter((m) => m.exists)
    : [
        { name: "best", exists: true, model_type: "best" },
        { name: "xgboost", exists: true, model_type: "xgboost" },
        { name: "random_forest", exists: true, model_type: "random_forest" },
        { name: "ridge", exists: true, model_type: "ridge" },
      ];

  const totalRev =
    mlData?.kpis?.forecast_total_revenue ?? mlData?.forecast_total_revenue;
  const avgRev =
    mlData?.kpis?.forecast_avg_daily_revenue ??
    mlData?.forecast_avg_daily_revenue;

  // =====================================================
  // Render
  // =====================================================
  return (
    <Box sx={{ minHeight: "100%", bgcolor: "background.default", pb: { xs: 3, md: 4 } }}>
      <Container maxWidth="xl" sx={{ pt: { xs: 1.75, sm: 2.5 }, px: { xs: 1.5, sm: 2.5 } }}>
        {/* ---------- Page header ---------- */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "flex-start" }}
          spacing={1.5}
          mb={{ xs: 2, md: 2.5 }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.35rem", sm: "1.6rem", md: "1.8rem" },
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              Demand Forecasting
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 0.5, maxWidth: 560, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
            >
              Live chain revenue from trained models and per-product stock
              recommendations from your sales history.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-end", sm: "flex-start" }}>
            <MuiTooltip title="Refresh all data">
              <span>
                <PrimaryButton
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  startIcon={
                    <RefreshCw
                      size={16}
                      className={mlLoading || productLoading ? "spin-icon" : undefined}
                    />
                  }
                  disabled={mlLoading || productLoading}
                  onClick={handleRefreshAll}
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 600,
                    flexShrink: 0,
                    "& .spin-icon": { animation: "spin 1s linear infinite" },
                    "@keyframes spin": {
                      from: { transform: "rotate(0deg)" },
                      to: { transform: "rotate(360deg)" },
                    },
                  }}
                >
                  {isMobile ? "Refresh" : "Refresh data"}
                </PrimaryButton>
              </span>
            </MuiTooltip>
          </Stack>
        </Stack>

        {/* ---------- Alerts ---------- */}
        {(message || productError) && (
          <Stack spacing={1.25} mb={1.75}>
            {message && (
              <Alert
                severity={messageSeverity}
                onClose={() => setMessage("")}
                sx={{ borderRadius: 2 }}
              >
                {message}
              </Alert>
            )}
            {productError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {productError}
              </Alert>
            )}
          </Stack>
        )}

        {/* ---------- Tabs ---------- */}
          <Paper
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: RADIUS,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            position: { xs: "sticky", sm: "static" },
            top: "var(--navbar-height)",
            zIndex: 2,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant={isMobile ? "fullWidth" : "standard"}
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
            <Tab
              icon={<Bot size={17} />}
              iconPosition="start"
              label={isMobile ? "ML Forecast" : "ML Chain Forecast"}
            />
            <Tab
              icon={<Package size={17} />}
              iconPosition="start"
              label={isMobile ? "Products" : "Product Forecasts"}
            />
          </Tabs>
        </Paper>

        {/* ============================================================
            TAB 0 — ML Chain
           ============================================================ */}
        {tab === 0 && (
          <Box role="tabpanel">
            <SectionHeader
              icon={<TrendingUp size={19} />}
              title="Chain revenue forecast"
              subtitle="Powered by best_model.pkl / XGBoost training pipeline"
            />

            {/* Controls card */}
            <CardShell sx={{ p: CARD_PAD, mb: GAP }}>
              <Box sx={autoGrid(150)}>
                <FormField
                  select
                  fullWidth
                  label="Model"
                  size="small"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                >
                  {availableModels.map((m) => (
                    <MenuItem key={m.name} value={m.name}>
                      {m.name}
                      {m.model_type ? ` · ${m.model_type}` : ""}
                    </MenuItem>
                  ))}
                </FormField>

                <FormField
                  select
                  fullWidth
                  label="Horizon"
                  size="small"
                  value={horizonDays}
                  onChange={(e) => setHorizonDays(Number(e.target.value))}
                >
                  {[7, 14, 21, 30, 45, 60].map((d) => (
                    <MenuItem key={d} value={d}>
                      {d} days
                    </MenuItem>
                  ))}
                </FormField>

                <FormField
                  select
                  fullWidth
                  label="History"
                  size="small"
                  value={historyDays}
                  onChange={(e) => setHistoryDays(Number(e.target.value))}
                >
                  {[14, 30, 60, 90].map((d) => (
                    <MenuItem key={d} value={d}>
                      Last {d}d
                    </MenuItem>
                  ))}
                </FormField>

                <Stack
                  direction="row"
                  spacing={1.25}
                  alignItems="center"
                  justifyContent={{ xs: "flex-start", md: "flex-end" }}
                  sx={{ minWidth: 0 }}
                >
                  <PrimaryButton
                    variant="contained"
                    fullWidth
                    startIcon={mlLoading ? <CircularProgress size={16} color="inherit" /> : <ChartNoAxesCombined size={18} />}
                    disabled={mlLoading}
                    onClick={loadMlDashboard}
                    sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700, whiteSpace: "nowrap" }}
                  >
                    Run forecast
                  </PrimaryButton>
                </Stack>
              </Box>

              {mlData?.model_type && (
                <Chip
                  size="small"
                  color="primary"
                  variant="outlined"
                  label={`Active: ${mlData.model_type}`}
                  sx={{ fontWeight: 600, mt: 1.5 }}
                />
              )}
            </CardShell>

            {mlError && (
              <Alert
                severity="warning"
                icon={<AlertTriangle size={18} />}
                sx={{ mb: GAP, borderRadius: 2 }}
              >
                {mlError}
              </Alert>
            )}

            {mlLoading && !mlData ? (
              <CardShell>
                <LoadingBlock label="Loading forecast from trained model…" />
              </CardShell>
            ) : (
              <>
                {/* KPI cards — auto-fit grid: 2-up on phones, 4-up once
                    there's room, based on real available width. */}
                <Box sx={{ ...autoGrid(150), mb: GAP }}>
                  <MetricCard
                    icon={<IndianRupee size={18} />}
                    label="Forecast total revenue"
                    value={money(totalRev)}
                    sub={`Next ${horizonDays} days`}
                    color={ACCENTS.revenue}
                    loading={mlLoading}
                  />
                  <MetricCard
                    icon={<TrendingUp size={18} />}
                    label="Avg daily revenue"
                    value={money(avgRev)}
                    sub="Across forecast horizon"
                    color={ACCENTS.growth}
                    loading={mlLoading}
                  />
                  <MetricCard
                    icon={<Activity size={18} />}
                    label="History points"
                    value={mlData?.history?.length || 0}
                    sub={`Last ${historyDays} days`}
                    color={ACCENTS.history}
                    loading={mlLoading}
                  />
                  <MetricCard
                    icon={<Layers size={18} />}
                    label="Forecast points"
                    value={mlData?.forecast?.length || 0}
                    sub={mlData?.model_type || modelName}
                    color={ACCENTS.forecast}
                    loading={mlLoading}
                  />
                </Box>

                {/* Recommendation */}
                {mlData?.recommendation && (
                  <Alert
                    severity="info"
                    icon={<Sparkles size={18} />}
                    sx={{ mb: GAP, borderRadius: 2 }}
                  >
                    {mlData.recommendation}
                  </Alert>
                )}

                {/* Chart */}
                <CardShell sx={{ p: CARD_PAD, mb: GAP }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ sm: "center" }}
                    spacing={1}
                    mb={1.5}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      Actual vs predicted + future
                    </Typography>
                    <Chip
                      size="small"
                      icon={<CalendarDays size={14} />}
                      label={`${historyDays}d history · ${horizonDays}d ahead`}
                      variant="outlined"
                    />
                  </Stack>

                  {chartData.length === 0 ? (
                    <EmptyState
                      icon={<ChartNoAxesCombined size={22} />}
                      title="No series data yet"
                      description="Train models with python -m ml.train_model and ensure /forecast/ml/dashboard returns history and forecast arrays."
                    />
                  ) : (
                    <Box sx={{ width: "100%", height: { xs: 230, sm: 290, md: 340 } }}>
                      <ResponsiveContainer>
                        <ComposedChart
                          data={chartData}
                          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="predictedFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={ACCENTS.predictedLine} stopOpacity={0.25} />
                              <stop offset="100%" stopColor={ACCENTS.predictedLine} stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                          <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11 }}
                            minTickGap={isMobile ? 28 : 20}
                            axisLine={{ opacity: 0.3 }}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 11 }}
                            width={isMobile ? 40 : 54}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={compactMoney}
                          />
                          <Tooltip content={<ForecastTooltip />} />
                          <Legend
                            verticalAlign="top"
                            height={28}
                            iconType="circle"
                            wrapperStyle={{ fontSize: 12 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="predicted"
                            name="Predicted"
                            stroke={ACCENTS.predictedLine}
                            fill="url(#predictedFill)"
                            strokeWidth={2}
                            dot={false}
                            connectNulls
                          />
                          <Line
                            type="monotone"
                            dataKey="actual"
                            name="Actual"
                            stroke={ACCENTS.actualLine}
                            strokeWidth={2}
                            dot={false}
                            connectNulls
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </CardShell>

                {/* Future table */}
                <CardShell>
                  <CardTitleBar title={`Next ${horizonDays} days`} />

                  {(mlData?.forecast || []).length === 0 ? (
                    <EmptyState
                      icon={<CalendarDays size={22} />}
                      title="No future points"
                      description="Run forecast after the model is available."
                    />
                  ) : (
                    <Box sx={{ overflowX: "auto" }}>
                      <Box
                        component="table"
                        sx={{
                          width: "100%",
                          minWidth: 360,
                          borderCollapse: "collapse",
                          "& th": {
                            textAlign: "left",
                            px: 2,
                            py: 1.25,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: "text.secondary",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            whiteSpace: "nowrap",
                          },
                          "& td": {
                            px: 2,
                            py: 1.4,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            fontSize: "0.85rem",
                          },
                          "& tbody tr:last-of-type td": { borderBottom: "none" },
                          "& tbody tr:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Predicted revenue</th>
                            <th>Step</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(mlData.forecast || []).map((row) => (
                            <tr key={row.ds}>
                              <td>{fullDate(row.ds)}</td>
                              <td style={{ fontWeight: 700, color: ACCENTS.predictedLine }}>
                                {money(row.yhat)}
                              </td>
                              <td>
                                <Chip
                                  size="small"
                                  label={row.horizon_step ?? "—"}
                                  variant="outlined"
                                  sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Box>
                    </Box>
                  )}
                </CardShell>
              </>
            )}
          </Box>
        )}

        {/* ============================================================
            TAB 1 — Product forecasts
           ============================================================ */}
        {tab === 1 && (
          <Box role="tabpanel">
            <SectionHeader
              icon={<Package size={19} />}
              title="Product demand & stock"
              subtitle="Per-product forecasts from completed sales in PostgreSQL"
            />

            <Box sx={{ ...autoGrid(150), mb: GAP }}>
              <MetricCard
                icon={<IndianRupee size={18} />}
                label="Expected revenue"
                value={money(summary?.total_expected_revenue)}
                color={ACCENTS.revenue}
                loading={productLoading}
              />
              <MetricCard
                icon={<TrendingUp size={18} />}
                label="Expected profit"
                value={money(summary?.total_expected_profit)}
                color={ACCENTS.growth}
                loading={productLoading}
              />
              <MetricCard
                icon={<Layers size={18} />}
                label="Forecasts generated"
                value={summary?.total_forecasts || 0}
                color={ACCENTS.history}
                loading={productLoading}
              />
              <MetricCard
                icon={<AlertTriangle size={18} />}
                label="Low stock products"
                value={summary?.low_stock_products ?? summary?.low_stock_count ?? 0}
                color={ACCENTS.danger}
                loading={productLoading}
              />
            </Box>

            {/* Generate form */}
            <CardShell sx={{ p: CARD_PAD, mb: GAP }}>
              <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
                Generate product forecast
              </Typography>

              <Box sx={autoGrid(160)}>
                <FormField
                  select
                  fullWidth
                  label="Product"
                  size="small"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  sx={{ gridColumn: { xs: "auto", sm: "span 2", md: "auto" } }}
                >
                  {products.length === 0 ? (
                    <MenuItem disabled value="">
                      No products available
                    </MenuItem>
                  ) : (
                    products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))
                  )}
                </FormField>

                <FormField
                  select
                  fullWidth
                  label="Period"
                  size="small"
                  value={periodDays}
                  onChange={(e) => setPeriodDays(Number(e.target.value))}
                >
                  {[7, 14, 30, 60, 90].map((days) => (
                    <MenuItem key={days} value={days}>
                      {days} days
                    </MenuItem>
                  ))}
                </FormField>

                <Stack
                  direction="row"
                  flexWrap="wrap"
                  spacing={1.25}
                  useFlexGap
                  alignItems="center"
                  sx={{ gridColumn: { xs: "auto", sm: "span 2", md: "auto" } }}
                >
                  <PrimaryButton
                    variant="contained"
                    startIcon={
                      submitting ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <ChartNoAxesCombined size={18} />
                      )
                    }
                    disabled={submitting}
                    onClick={() => runProduct(false)}
                    sx={{
                      borderRadius: 999,
                      textTransform: "none",
                      fontWeight: 700,
                      flex: { xs: "1 1 auto", sm: "0 0 auto" },
                    }}
                  >
                    Generate
                  </PrimaryButton>
                  <PrimaryButton
                    variant="outlined"
                    startIcon={<Sparkles size={18} />}
                    disabled={submitting || !products.length}
                    onClick={() => runProduct(true)}
                    sx={{
                      borderRadius: 999,
                      textTransform: "none",
                      fontWeight: 600,
                      flex: { xs: "1 1 auto", sm: "0 0 auto" },
                    }}
                  >
                    Generate all
                  </PrimaryButton>
                </Stack>
              </Box>
            </CardShell>

            {/* Product table */}
            <CardShell>
              <CardTitleBar title="Latest product forecasts" />

              {productLoading ? (
                <LoadingBlock label="Loading product forecasts…" />
              ) : forecasts.length === 0 ? (
                <EmptyState
                  icon={<Package size={22} />}
                  title="No forecasts yet"
                  description="Select a product and generate a forecast to see demand and stock recommendations."
                />
              ) : (
                <Box sx={{ overflowX: "auto" }}>
                  <Box
                    component="table"
                    sx={{
                      width: "100%",
                      minWidth: 620,
                      borderCollapse: "collapse",
                      "& th": {
                        textAlign: "left",
                        px: 2,
                        py: 1.25,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        whiteSpace: "nowrap",
                      },
                      "& td": {
                        px: 2,
                        py: 1.4,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        fontSize: "0.85rem",
                      },
                      "& tbody tr:last-of-type td": { borderBottom: "none" },
                      "& tbody tr:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Period</th>
                        <th>Demand</th>
                        <th>Recommended stock</th>
                        <th>Expected revenue</th>
                        <th>Model</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecasts.map((f) => (
                        <tr key={f.id}>
                          <td style={{ fontWeight: 600 }}>
                            {f.product_name || `Product #${f.product_id}`}
                          </td>
                          <td>{f.period_days} days</td>
                          <td>{Math.ceil(f.predicted_demand || 0)}</td>
                          <td>{f.recommended_stock}</td>
                          <td style={{ fontWeight: 700 }}>{money(f.expected_revenue)}</td>
                          <td>
                            <Chip
                              size="small"
                              label={f.model_name}
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Box>
                </Box>
              )}
            </CardShell>
          </Box>
        )}

        {/* Footer note */}
        <Divider sx={{ mt: 3, mb: 1.5 }} />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center" }}
        >
          
        </Typography>
      </Container>
    </Box>
  );
}