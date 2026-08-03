import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";

import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
} from "chart.js";

import { PrimaryButton } from "../../components/ui";
import { Line } from "react-chartjs-2";

import { fetchInventory } from "../../redux/slices/inventorySlice";
import { getProducts } from "../../services/productApi";
import forecastApi from "../../services/forecastApi";
import api from "../../services/api";

// ======================================================
// Chart registration
// ======================================================
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);

// ======================================================
// Motion
// ======================================================
const waveAnimation = keyframes`
  0% { transform: rotate(0deg) }
  10% { transform: rotate(14deg) }
  20% { transform: rotate(-8deg) }
  30% { transform: rotate(14deg) }
  40% { transform: rotate(-4deg) }
  50% { transform: rotate(10deg) }
  60%, 100% { transform: rotate(0deg) }
`;

// ======================================================
// Layout tokens — shared with the Forecasting page so the
// whole app reads as one design system (circular icon
// chips, pill buttons, one radius scale, theme-driven color).
// ======================================================
const RADIUS = "16px";
const GAP = { xs: 2, md: 2.5 };

const cardSx = (theme) => ({
  height: "100%",
  borderRadius: RADIUS,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
  bgcolor: "background.paper",
  transition: "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
  "&:hover": {
    boxShadow: "0 10px 24px -8px rgba(15, 23, 42, 0.14)",
    borderColor: alpha(theme.palette.text.primary, 0.14),
  },
});

const pillButtonSx = {
  textTransform: "none",
  fontWeight: 700,
  fontSize: "0.8rem",
  borderRadius: 999,
};

// ======================================================
// Helpers
// ======================================================
function SectionEyebrow({ children, sx }) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontSize: "0.7rem",
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function getRelativeTime(date) {
  if (!date) return "Just now";
  const now = new Date();
  const created = new Date(date);
  const difference = Math.floor((now - created) / 1000);
  if (difference < 60) return "Just now";
  if (difference < 3600) return `${Math.floor(difference / 60)}m ago`;
  if (difference < 86400) return `${Math.floor(difference / 3600)}h ago`;
  return created.toLocaleDateString("en-IN");
}

function shortDayLabel(ds) {
  try {
    return new Date(ds).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
  } catch {
    return ds;
  }
}

// A KPI card that behaves like a real navigation target: hover lift,
// keyboard focusable, and a trailing arrow that appears on hover so
// it's obvious the whole tile is clickable — not just decoration.
function NavigableCard({ onClick, children, ariaLabel, theme }) {
  if (!onClick) {
    return <Card sx={cardSx(theme)}>{children}</Card>;
  }
  return (
    <Card
      sx={{
        ...cardSx(theme),
        cursor: "pointer",
        "&:hover .nav-arrow": { opacity: 1, transform: "translateX(0)" },
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </Card>
  );
}

// ======================================================
// Dashboard
// ======================================================
function Dashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    inventory = [],
    notifications = [],
    loading: inventoryLoading = false,
  } = useSelector((state) => state.inventory);

  // Theme-derived status palette — same accents used on the
  // Forecasting page, so colors mean the same thing everywhere.
  const STATUS_COLORS = useMemo(
    () => ({
      info: {
        main: theme.palette.primary.main,
        bg: alpha(theme.palette.primary.main, 0.1),
      },
      success: {
        main: theme.palette.success?.main || "#0F9D67",
        bg: alpha(theme.palette.success?.main || "#0F9D67", 0.1),
      },
      error: {
        main: theme.palette.error?.main || "#DC2626",
        bg: alpha(theme.palette.error?.main || "#DC2626", 0.1),
      },
      warning: {
        main: theme.palette.warning?.main || "#D97706",
        bg: alpha(theme.palette.warning?.main || "#D97706", 0.1),
      },
      accent: {
        main: theme.palette.secondary?.main || "#6366F1",
        bg: alpha(theme.palette.secondary?.main || "#6366F1", 0.1),
      },
    }),
    [theme]
  );

  function getAlertConfig(type) {
    switch (type) {
      case "out_of_stock":
        return { label: "Out Of Stock", color: "error", icon: <WarningAmberRoundedIcon /> };
      case "low_stock":
        return { label: "Low Stock", color: "warning", icon: <WarningAmberRoundedIcon /> };
      case "success":
        return { label: "Completed", color: "success", icon: <CheckCircleOutlineRoundedIcon /> };
      default:
        return { label: "Info", color: "info", icon: <AutoGraphOutlinedIcon /> };
    }
  }

  // Local live data
  const [productsCount, setProductsCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(null);
  const [salesConnected, setSalesConnected] = useState(false);
  const [mlData, setMlData] = useState(null);
  const [forecastConnected, setForecastConnected] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ---- Inventory ----
  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // ---- Products count ----
  const loadProducts = useCallback(async () => {
    try {
      const response = await getProducts();
      const list = response?.data || response || [];
      setProductsCount(Array.isArray(list) ? list.length : 0);
    } catch {
      setProductsCount(inventory.length || 0);
    }
  }, [inventory.length]);

  // ---- Sales / today's revenue (best-effort) ----
  const loadSalesSummary = useCallback(async () => {
    try {
      const attempts = [
        () => api.get("/sales/summary"),
        () => api.get("/sales/stats"),
        () => api.get("/sales", { params: { limit: 200 } }),
      ];
      for (const attempt of attempts) {
        try {
          const { data } = await attempt();
          if (data?.today_revenue != null || data?.todayRevenue != null) {
            setTodayRevenue(data.today_revenue ?? data.todayRevenue);
            setSalesConnected(true);
            return;
          }
          if (data?.total_revenue != null) {
            setTodayRevenue(data.total_revenue);
            setSalesConnected(true);
            return;
          }
          const rows = Array.isArray(data) ? data : data?.items || data?.sales || [];
          if (Array.isArray(rows) && rows.length) {
            const today = new Date().toISOString().slice(0, 10);
            const sum = rows.reduce((acc, row) => {
              const d = String(row.sale_date || row.date || row.created_at || "").slice(0, 10);
              const amount = Number(row.total_amount ?? row.revenue ?? row.amount ?? 0);
              return d === today ? acc + amount : acc;
            }, 0);
            setTodayRevenue(sum);
            setSalesConnected(true);
            return;
          }
        } catch {
          // try next
        }
      }
      setSalesConnected(false);
      setTodayRevenue(null);
    } catch {
      setSalesConnected(false);
      setTodayRevenue(null);
    }
  }, []);

  // ---- ML Forecast ----
  const loadForecast = useCallback(async () => {
    setForecastLoading(true);
    try {
      const data = await forecastApi.mlDashboard({
        horizon_days: 7,
        model_name: "best",
        include_history_days: 14,
      });
      if (data?.status === "error") {
        setForecastConnected(false);
        setMlData(null);
      } else {
        setMlData(data);
        setForecastConnected(true);
      }
    } catch {
      setForecastConnected(false);
      setMlData(null);
    } finally {
      setForecastLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchInventory()),
      loadProducts(),
      loadSalesSummary(),
      loadForecast(),
    ]);
    setRefreshing(false);
  }, [dispatch, loadProducts, loadSalesSummary, loadForecast]);

  useEffect(() => {
    loadProducts();
    loadSalesSummary();
    loadForecast();
  }, [loadProducts, loadSalesSummary, loadForecast]);

  // ---- Derived ----
  const totalProducts = productsCount || inventory.length || 0;
  const inventoryAlerts = notifications.filter((item) =>
    ["low_stock", "out_of_stock", "over_stock"].includes(item.type)
  );
  const alertCount = inventoryAlerts.length;
  const hasAlerts = alertCount > 0;

  const forecastTotal =
    mlData?.kpis?.forecast_total_revenue ?? mlData?.forecast_total_revenue;
  const forecastAvg =
    mlData?.kpis?.forecast_avg_daily_revenue ?? mlData?.forecast_avg_daily_revenue;
  const modelType = mlData?.model_type || "best";

  // Each KPI now owns a destination — tapping the card is real
  // navigation, not a static number.
  const metrics = [
    {
      label: "Today's Revenue",
      value: salesConnected ? money(todayRevenue) : "Not Connected",
      change: salesConnected ? "From sales records" : "Sales API required",
      icon: TrendingUpOutlinedIcon,
      statusType: salesConnected ? "success" : "info",
      to: "/sales",
      cta: "View sales",
    },
    {
      label: "Total Products",
      value: totalProducts.toLocaleString(),
      change: "Live catalog",
      icon: LocalOfferOutlinedIcon,
      statusType: "success",
      to: "/products",
      cta: "View products",
    },
    {
      label: "Active Alerts",
      value: alertCount,
      change: hasAlerts ? "Requires action" : "Healthy",
      icon: Inventory2OutlinedIcon,
      statusType: hasAlerts ? "error" : "success",
      to: "/inventory",
      cta: "View inventory",
    },
    {
      label: "AI Forecast",
      value: forecastConnected ? money(forecastTotal) : "Not Connected",
      change: forecastConnected ? `${modelType} · 7-day total` : "Service required",
      icon: AutoGraphOutlinedIcon,
      statusType: forecastConnected ? "success" : "info",
      to: "/forecast",
      cta: "View forecast",
    },
  ];

  // Quick-links strip — one tap to every connected page.
  const quickLinks = [
    { label: "Products", icon: StorefrontRoundedIcon, to: "/products" },
    { label: "Inventory", icon: Inventory2RoundedIcon, to: "/inventory" },
    { label: "Sales", icon: ReceiptLongRoundedIcon, to: "/sales" },
    { label: "Forecast", icon: AutoGraphOutlinedIcon, to: "/forecasting" },
   
  ];

  // Chart from real ML history + forecast
  const chartData = useMemo(() => {
    if (!forecastConnected || !mlData) {
      return { labels: [], datasets: [] };
    }
    const hist = mlData.history || [];
    const fut = mlData.forecast || [];

    const histTail = hist.slice(-7);
    const labels = [
      ...histTail.map((p) => shortDayLabel(p.ds)),
      ...fut.map((p) => shortDayLabel(p.ds)),
    ];
    const actual = [
      ...histTail.map((p) => (p.y_actual != null ? Number(p.y_actual) : null)),
      ...fut.map(() => null),
    ];
    const predicted = [
      ...histTail.map((p) => (p.yhat != null ? Number(p.yhat) : null)),
      ...fut.map((p) => Number(p.yhat) || 0),
    ];

    return {
      labels,
      datasets: [
        {
          label: "Predicted",
          data: predicted,
          tension: 0.4,
          fill: true,
          backgroundColor: alpha(STATUS_COLORS.accent.main, 0.08),
          borderColor: STATUS_COLORS.accent.main,
          pointRadius: 2,
          borderWidth: 2,
          spanGaps: true,
        },
        {
          label: "Actual",
          data: actual,
          tension: 0.4,
          fill: false,
          borderColor: STATUS_COLORS.success.main,
          pointRadius: 2,
          borderWidth: 2,
          spanGaps: true,
        },
      ],
    };
  }, [forecastConnected, mlData, STATUS_COLORS]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { boxWidth: 12, font: { family: "inherit", size: 11, weight: 600 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y;
            if (v == null) return `${ctx.dataset.label}: —`;
            return `${ctx.dataset.label}: ${money(v)}`;
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: {
        grid: { color: alpha(theme.palette.text.primary, 0.06) },
        beginAtZero: true,
        ticks: {
          font: { size: 10 },
          callback: (v) =>
            v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}k` : v,
        },
      },
    },
  };

  // AI assistant tips from forecast + alerts
  const assistantTips = useMemo(() => {
    const tips = [];
    if (forecastConnected && forecastAvg) {
      tips.push({
        text: `Plan stock for ~${money(forecastAvg)} avg daily revenue`,
        value: 88,
      });
    }
    if (hasAlerts) {
      tips.push({
        text: `Resolve ${alertCount} stock alert${alertCount > 1 ? "s" : ""}`,
        value: 92,
      });
    }
    if (forecastConnected && mlData?.recommendation) {
      tips.push({
        text:
          String(mlData.recommendation).slice(0, 64) +
          (mlData.recommendation.length > 64 ? "…" : ""),
        value: 76,
      });
    }
    if (!tips.length) {
      tips.push(
        { text: "Connect forecast service for demand tips", value: 40 },
        { text: "Keep inventory levels updated", value: 55 }
      );
    }
    return tips.slice(0, 3);
  }, [forecastConnected, forecastAvg, hasAlerts, alertCount, mlData]);

  const loadingKpis = inventoryLoading && !totalProducts;

  // ======================================================
  // Render
  // ======================================================
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.default",
        minHeight: "100%",
        containerType: "inline-size",
        containerName: "dashboard",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1680px",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2.25, md: 3 },
          p: { xs: 1.75, sm: 2.5, md: 3.5 },
        }}
      >
        {/* HEADER */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.75}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ display: "flex", alignItems: "center", gap: 1, letterSpacing: "-0.02em" }}
            >
              Dashboard
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  animation: `${waveAnimation} 2.5s infinite`,
                  transformOrigin: "70% 70%",
                  fontSize: "1.3rem",
                }}
              >
                👋
              </Box>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.25 }}>
              Real-time stock control & predictive retail intelligence.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} width={{ xs: "100%", sm: "auto" }} flexWrap="wrap" useFlexGap>
            <PrimaryButton
              variant="outlined"
              size="small"
              startIcon={
                <RefreshRoundedIcon
                  sx={{
                    fontSize: 16,
                    animation: refreshing ? "spin 1s linear infinite" : "none",
                    "@keyframes spin": {
                      from: { transform: "rotate(0deg)" },
                      to: { transform: "rotate(360deg)" },
                    },
                  }}
                />
              }
              onClick={refreshAll}
              disabled={refreshing}
              sx={{ ...pillButtonSx, borderColor: "divider", color: "text.primary" }}
            >
              {refreshing ? "Refreshing…" : "Refresh"}
            </PrimaryButton>
            <PrimaryButton
              variant="outlined"
              size="small"
              startIcon={<AutoGraphOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => navigate("/forecasting")}
              sx={{
                ...pillButtonSx,
                flexGrow: { xs: 1, sm: 0 },
                borderColor: "divider",
                color: "text.primary",
              }}
            >
              {forecastConnected ? "Open Forecast" : "Setup Forecast"}
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              size="small"
              startIcon={<FileUploadOutlinedIcon sx={{ fontSize: 16 }} />}
              disableElevation
              onClick={() => navigate("/sales")}
              sx={{ ...pillButtonSx, flexGrow: { xs: 1, sm: 0 } }}
            >
              Upload Sales
            </PrimaryButton>
          </Stack>
        </Stack>

        {/* QUICK LINKS — one tap to every connected page */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Chip
                key={link.label}
                clickable
                onClick={() => navigate(link.to)}
                icon={<Icon sx={{ fontSize: "16px !important" }} />}
                label={link.label}
                variant="outlined"
                sx={{
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  borderColor: "divider",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            );
          })}
        </Stack>

        {/* KPI STRIP — auto-fit grid: reflows on real available width,
            not just viewport, so it never squeezes next to a sidebar. */}
        <Box
          sx={{
            display: "grid",
            gap: GAP,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {metrics.map((item) => {
            const Icon = item.icon;
            const tone = STATUS_COLORS[item.statusType] || STATUS_COLORS.info;
            return (
              <NavigableCard
                key={item.label}
                theme={theme}
                onClick={() => navigate(item.to)}
                ariaLabel={`${item.cta}`}
              >
                <CardContent
                  sx={{
                    position: "relative",
                    p: { xs: 1.75, sm: 2.25 },
                    pt: { xs: 2, sm: 2.5 },
                    "&:last-child": { pb: { xs: 1.75, sm: 2.25 } },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      bgcolor: tone.main,
                      opacity: 0.85,
                    }}
                  />
                  {loadingKpis ? (
                    <Stack spacing={1.25}>
                      <Skeleton variant="text" width="60%" height={15} />
                      <Skeleton variant="rounded" width="50%" height={30} />
                      <Skeleton variant="text" width="80%" height={12} />
                    </Stack>
                  ) : (
                    <Stack spacing={1.1}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <SectionEyebrow>{item.label}</SectionEyebrow>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: tone.bg,
                            color: tone.main,
                          }}
                        >
                          <Icon sx={{ fontSize: 17 }} />
                        </Avatar>
                      </Stack>
                      <Typography
                        fontWeight={800}
                        sx={{
                          color: tone.main,
                          lineHeight: 1.15,
                          letterSpacing: "-0.02em",
                          fontSize: { xs: "1.2rem", sm: "1.45rem" },
                          wordBreak: "break-word",
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Divider />
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                        >
                          {item.change}
                        </Typography>
                        <ArrowForwardRoundedIcon
                          className="nav-arrow"
                          sx={{
                            fontSize: 15,
                            color: "text.disabled",
                            opacity: 0,
                            transform: "translateX(-4px)",
                            transition: "opacity 0.2s ease, transform 0.2s ease",
                          }}
                        />
                      </Stack>
                    </Stack>
                  )}
                </CardContent>
              </NavigableCard>
            );
          })}
        </Box>

        {/* TWO COLUMN LAYOUT */}
        <Box
          sx={{
            display: "grid",
            gap: GAP,
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
            "@container dashboard (max-width: 880px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          {/* LEFT */}
          <Box sx={{ minWidth: 0 }}>
            <Stack spacing={GAP}>
              {/* WEEKLY FORECAST */}
              <Card sx={cardSx(theme)}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Box>
                      <SectionEyebrow>Weekly Demand Forecast</SectionEyebrow>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.25 }}>
                        {forecastConnected
                          ? `Live · ${modelType} · avg ${money(forecastAvg)}/day`
                          : "AI-driven predictive outlook"}
                      </Typography>
                    </Box>
                   <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title="Refresh forecast">
                    <IconButton size="small" onClick={loadForecast} disabled={forecastLoading} sx={{ width: 32, height: 32, border: "1px solid", borderColor: "divider" }}>
                      <RefreshRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View detailed forecast">
                    <IconButton size="small" onClick={() => navigate("/forecasting")} sx={{ width: 32, height: 32, border: "1px solid", borderColor: "divider" }}>
                      <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
            
                  </Stack>

                  <Box sx={{ height: { xs: 190, sm: 220 }, position: "relative" }}>
                    {forecastLoading && !mlData ? (
                      <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <Skeleton variant="rounded" width="100%" height="100%" sx={{ borderRadius: "12px" }} />
                      </Stack>
                    ) : forecastConnected && chartData.datasets.length > 0 ? (
                      <Line data={chartData} options={chartOptions} />
                    ) : (
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={0.5}
                        sx={{
                          height: "100%",
                          bgcolor: "action.hover",
                          borderRadius: "12px",
                          border: "1px dashed",
                          borderColor: "divider",
                          px: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: STATUS_COLORS.accent.bg,
                            color: STATUS_COLORS.accent.main,
                            mb: 0.5,
                          }}
                        >
                          <AutoGraphOutlinedIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="body2" fontWeight={700}>
                          Forecast not connected
                        </Typography>
                        <Typography variant="caption" color="text.secondary" textAlign="center">
                          Train models and ensure the API can import ml.predict
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => navigate("/forecasting")}
                          sx={{ mt: 1, textTransform: "none", fontWeight: 700, borderRadius: 999 }}
                        >
                          Go to forecasting
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* LIVE STOCK ALERTS */}
              <Card sx={cardSx(theme)}>
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ p: 2, pb: 1.25 }}
                  >
                    <Box>
                      <SectionEyebrow>Live Stock Alerts</SectionEyebrow>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.25 }}>
                        Real-time inventory levels
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <Chip
                        size="small"
                        icon={
                          hasAlerts ? (
                            <WarningAmberRoundedIcon sx={{ fontSize: "14px !important" }} />
                          ) : (
                            <CheckCircleOutlineRoundedIcon sx={{ fontSize: "14px !important" }} />
                          )
                        }
                        label={hasAlerts ? `${alertCount} Alerts` : "All Healthy"}
                        sx={{
                          fontWeight: 700,
                          borderRadius: 999,
                          height: 24,
                          fontSize: "0.72rem",
                          bgcolor: hasAlerts ? STATUS_COLORS.error.bg : STATUS_COLORS.success.bg,
                          color: hasAlerts ? STATUS_COLORS.error.main : STATUS_COLORS.success.main,
                        }}
                      />
                      <Button
                        size="small"
                        onClick={() => navigate("/inventory")}
                        sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.75rem", minWidth: 0 }}
                      >
                        View all
                      </Button>
                    </Stack>
                  </Stack>

                  {!hasAlerts ? (
                    <Stack alignItems="center" justifyContent="center" spacing={0.5} sx={{ py: 5 }}>
                      <CheckCircleOutlineRoundedIcon sx={{ fontSize: 34, color: STATUS_COLORS.success.main }} />
                      <Typography variant="body2" fontWeight={700}>
                        No alerts outstanding
                      </Typography>
                    </Stack>
                  ) : (
                    <TableContainer sx={{ maxHeight: 260, overflowX: "auto" }}>
                      <Table stickyHeader size="small" sx={{ minWidth: 520 }}>
                        <TableHead>
                          <TableRow>
                            {["Product", "Status", "Current", "Minimum", ""].map((h, i) => (
                              <TableCell
                                key={h + i}
                                align={i === 4 ? "right" : "left"}
                                sx={{
                                  fontWeight: 700,
                                  color: "text.secondary",
                                  bgcolor: "action.hover",
                                  py: 1,
                                  fontSize: "0.7rem",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.04em",
                                  borderBottom: "1px solid",
                                  borderColor: "divider",
                                }}
                              >
                                {h === "" ? "Manage" : h}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {inventoryAlerts.map((alert) => (
                            <TableRow
                              key={alert.id}
                              hover
                              sx={{ "& td": { borderBottom: "1px solid", borderColor: "divider" } }}
                            >
                              <TableCell sx={{ py: 1.1 }}>
                                <Typography variant="body2" fontWeight={700} sx={{ fontSize: "0.78rem" }}>
                                  {alert.product?.product_name ||
                                    alert.product?.name ||
                                    "Unknown Product"}
                                </Typography>
                                <Typography sx={{ fontSize: "0.68rem" }} color="text.secondary">
                                  ID: #{alert.product?.id || "N/A"}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ py: 1.1 }}>
                                {(() => {
                                  const config = getAlertConfig(alert.type);
                                  const tone = STATUS_COLORS[config.color] || STATUS_COLORS.info;
                                  return (
                                    <Chip
                                      label={config.label}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: "0.68rem",
                                        fontWeight: 700,
                                        borderRadius: 999,
                                        bgcolor: tone.bg,
                                        color: tone.main,
                                      }}
                                    />
                                  );
                                })()}
                              </TableCell>
                              <TableCell
                                sx={{
                                  py: 1.1,
                                  fontSize: "0.78rem",
                                  fontWeight: 800,
                                  color:
                                    alert.type === "out_of_stock"
                                      ? STATUS_COLORS.error.main
                                      : STATUS_COLORS.warning.main,
                                }}
                              >
                                {alert.product?.current_stock ?? 0}
                              </TableCell>
                              <TableCell
                                sx={{ py: 1.1, fontSize: "0.78rem", color: "text.secondary", fontWeight: 600 }}
                              >
                                {alert.product?.minimum_stock ?? alert.product?.reorder_level ?? "N/A"}
                              </TableCell>
                              <TableCell align="right" sx={{ py: 1.1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => navigate("/inventory")}
                                  sx={{ p: 0.5, border: "1px solid", borderColor: "divider", borderRadius: "50%" }}
                                >
                                  <ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Box>

          {/* RIGHT */}
          <Box sx={{ minWidth: 0 }}>
            <Stack spacing={GAP} sx={{ height: "100%" }}>
              {/* AI ASSISTANT */}
              <Card sx={cardSx(theme)}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center" mb={1.5}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: STATUS_COLORS.accent.bg,
                        color: STATUS_COLORS.accent.main,
                        borderRadius: "50%",
                      }}
                    >
                      <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box>
                      <SectionEyebrow>AI Assistant</SectionEyebrow>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.15 }}>
                        {forecastConnected
                          ? "Live recommendations from forecast + stock"
                          : "Operations optimization recommendations"}
                      </Typography>
                    </Box>
                  </Stack>

                  {forecastConnected || hasAlerts ? (
                    <Stack spacing={2}>
                      {assistantTips.map(({ text, value }) => (
                        <Box key={text}>
                          <Stack direction="row" justifyContent="space-between" mb={0.35}>
                            <Typography variant="caption" fontWeight={600}>
                              {text}
                            </Typography>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">
                              {value}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={value}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: "action.hover",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: STATUS_COLORS.accent.main,
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>
                      ))}
                      <Button
                        fullWidth
                        size="small"
                        onClick={() => navigate("/forecasting")}
                        sx={{ mt: 0.5, textTransform: "none", fontWeight: 700, borderRadius: 999 }}
                      >
                        View full forecast
                      </Button>
                    </Stack>
                  ) : (
                    <Stack alignItems="center" justifyContent="center" spacing={0.5} sx={{ py: 2.5, textAlign: "center" }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: "action.hover",
                          color: "text.secondary",
                          mb: 0.5,
                        }}
                      >
                        <SmartToyOutlinedIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="body2" fontWeight={700}>
                        Engine offline
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 220 }}>
                        Activate predictive services to deploy active assistant advice.
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate("/forecasting")}
                        sx={{
                          textTransform: "none",
                          borderRadius: 999,
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          mt: 1.5,
                          borderColor: "divider",
                        }}
                      >
                        Connect AI
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>

              {/* ACTIVITY FEED */}
              <Card sx={{ ...cardSx(theme), flexGrow: 1 }}>
                <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.25}>
                    <SectionEyebrow>Activity Feed</SectionEyebrow>
                    <Button
                      size="small"
                      onClick={() => navigate("/notifications")}
                      sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.75rem", p: 0, minWidth: 0 }}
                    >
                      View all
                    </Button>
                  </Stack>

                  <Box sx={{ overflowY: "auto", maxHeight: 240, pr: 0.5 }}>
                    {notifications.length === 0 ? (
                      <Stack alignItems="center" justifyContent="center" spacing={0.5} sx={{ py: 5 }}>
                        <CheckCircleOutlineRoundedIcon sx={{ fontSize: 32, color: STATUS_COLORS.success.main }} />
                        <Typography variant="body2" fontWeight={700}>
                          All caught up
                        </Typography>
                      </Stack>
                    ) : (
                      <Stack spacing={1.1}>
                        {notifications.slice(0, 4).map((notification) => (
                          <Box
                            key={notification.id}
                            onClick={() => navigate("/notifications")}
                            sx={{
                              display: "flex",
                              gap: 1.25,
                              p: 1,
                              borderRadius: 2,
                              cursor: "pointer",
                              bgcolor: notification.read ? "transparent" : alpha(STATUS_COLORS.accent.main, 0.06),
                              transition: "background-color 0.15s ease",
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 30,
                                height: 30,
                                bgcolor: STATUS_COLORS.accent.bg,
                                color: STATUS_COLORS.accent.main,
                                flexShrink: 0,
                                borderRadius: "50%",
                              }}
                            >
                              {getAlertConfig(notification.type).icon}
                            </Avatar>
                            <Box flex={1} minWidth={0}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.25} gap={1}>
                                <Typography
                                  variant="caption"
                                  fontWeight={notification.read ? 600 : 800}
                                  noWrap
                                >
                                  {notification.title}
                                </Typography>
                                <Typography sx={{ fontSize: "0.62rem", color: "text.secondary" }} whiteSpace="nowrap">
                                  {getRelativeTime(notification.createdAt || notification.created_at)}
                                </Typography>
                              </Stack>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  lineHeight: 1.35,
                                }}
                              >
                                {notification.message}
                              </Typography>
                              {notification.product && (
                                <Typography
                                  sx={{ fontSize: "0.65rem", mt: 0.5, display: "block" }}
                                  fontWeight={700}
                                  color="primary.main"
                                >
                                  Ref:{" "}
                                  {notification.product.product_name ||
                                    notification.product.name ||
                                    notification.product.id}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;