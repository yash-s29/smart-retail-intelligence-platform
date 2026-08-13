import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import { alpha, keyframes } from "@mui/material/styles";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";

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

import { Line } from "react-chartjs-2";

import { fetchInventory } from "../../redux/slices/inventorySlice";

import { getProducts } from "../../services/productApi";
import forecastApi from "../../services/forecastApi";
import api from "../../services/api";

// ============================================================
// CHART
// ============================================================

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);

// ============================================================
// DESIGN TOKENS
// ============================================================

const COLORS = {
  primary: "#18799F",
  primaryDark: "#105D7D",
  primaryDeep: "#0B4D67",

  aqua: "#67BDD4",
  aquaSoft: "#E8F7FA",
  aquaPale: "#F5FBFC",

  ink: "#12313D",
  slate: "#607984",
  muted: "#8BA0A8",

  white: "#FFFFFF",

  success: "#299A66",
  successSoft: "#EAF8F1",

  warning: "#C98221",
  warningSoft: "#FFF6E8",

  danger: "#D65B5B",
  dangerSoft: "#FCEEEE",

  border: "#E1EEF2",
};

const RADIUS = "14px";

// ============================================================
// ANIMATIONS (kept minimal, purposeful — no ambient blinking)
// ============================================================

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { transform: translateX(-120%) skewX(-15deg); }
  100% { transform: translateX(260%) skewX(-15deg); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const reduceMotion = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none !important",
    transition: "none !important",
  },
};

// ============================================================
// HELPERS
// ============================================================

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function shortDayLabel(dateString) {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

// ============================================================
// SHARED CARD SURFACE
// Every card on this page uses the exact same surface treatment
// so the grid reads as one coherent system, not mismatched tiles.
// ============================================================

const cardSx = {
  position: "relative",
  overflow: "hidden",
  height: "100%",
  borderRadius: RADIUS,

  border: `1px solid ${COLORS.border}`,
  background: COLORS.white,
  boxShadow: "0 1px 2px rgba(16,77,96,.04)",

  transition: "box-shadow .2s ease, border-color .2s ease",

  "&:hover": {
    borderColor: alpha(COLORS.primary, 0.2),
    boxShadow: "0 8px 22px rgba(16,77,96,.08)",
  },

  ...reduceMotion,
};

const cardPad = {
  p: { xs: 1.75, sm: 2 },
  "&:last-child": { pb: { xs: 1.75, sm: 2 } },
};

// ============================================================
// SECTION HEADER
// Icon anchored to one corner, title/eyebrow as one text block —
// no elements competing for the same space.
// ============================================================

function SectionHeader({ icon: Icon, eyebrow, title, action }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1.5}
      flexWrap="wrap"
      rowGap={1}
    >
      <Stack direction="row" spacing={1.1} alignItems="center" minWidth={0}>
        <Avatar
          sx={{
            width: 34,
            height: 34,
            flexShrink: 0,
            borderRadius: "10px",
            bgcolor: COLORS.aquaSoft,
            color: COLORS.primary,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Avatar>

        <Box minWidth={0}>
          <Typography
            sx={{
              color: COLORS.muted,
              fontSize: "0.63rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              lineHeight: 1.2,
            }}
          >
            {eyebrow}
          </Typography>

          <Typography
            sx={{
              color: COLORS.ink,
              fontSize: "0.94rem",
              fontWeight: 800,
              mt: 0.2,
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Stack>

      {action}
    </Stack>
  );
}

// ============================================================
// KPI CARD
// One value, one icon, one line of context. No status dots.
// ============================================================

function KpiCard({ label, value, description, icon: Icon, tone, onClick, delay = 0 }) {
  return (
    <Card
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      sx={{
        ...cardSx,
        cursor: onClick ? "pointer" : "default",
        animation: `${fadeUp} .4s ${delay}ms both`,

        "&:hover": {
          borderColor: alpha(tone.main, 0.3),
          boxShadow: "0 8px 22px rgba(16,77,96,.09)",
        },
        "&:hover .kpi-shine": { animation: `${shimmer} 750ms ease` },
        "&:focus-visible": {
          outline: `2px solid ${tone.main}`,
          outlineOffset: 2,
        },

        ...reduceMotion,
      }}
    >
      <Box
        className="kpi-shine"
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          width: "24%",
          pointerEvents: "none",
          background:
            "linear-gradient(100deg, transparent, rgba(255,255,255,.7), transparent)",
          transform: "translateX(-120%) skewX(-15deg)",
        }}
      />

      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
          <Box minWidth={0} flex={1}>
            <Typography sx={{ color: COLORS.slate, fontSize: "0.72rem", fontWeight: 700 }}>
              {label}
            </Typography>

            <Typography
              sx={{
                mt: 0.6,
                color: tone.main,
                fontSize: { xs: "1.35rem", sm: "1.55rem" },
                fontWeight: 900,
                letterSpacing: "-.04em",
                lineHeight: 1.1,
                overflowWrap: "anywhere",
              }}
            >
              {value}
            </Typography>
          </Box>

          {/* Icon fixed to a single corner, never competes with text */}
          <Avatar
            sx={{
              width: 38,
              height: 38,
              flexShrink: 0,
              borderRadius: "11px",
              bgcolor: tone.bg,
              color: tone.main,
              border: `1px solid ${alpha(tone.main, 0.08)}`,
            }}
          >
            <Icon sx={{ fontSize: 19 }} />
          </Avatar>
        </Stack>

        <Divider sx={{ my: 1.25, borderColor: COLORS.border }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ color: COLORS.slate, fontSize: "0.67rem", fontWeight: 600 }}>
            {description}
          </Typography>

          {onClick && (
            <ArrowForwardRoundedIcon sx={{ fontSize: 15, color: tone.main, opacity: 0.55 }} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ============================================================
// QUICK ACTION TILE
// Replaces the old duplicate Stock Alerts / Recent Activity
// cards with something that's actually distinct: fast entry
// points into the flows people use most often.
// ============================================================

function QuickActionTile({ icon: Icon, label, onClick }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,

        border: `1px solid ${COLORS.border}`,
        borderRadius: "12px",
        bgcolor: COLORS.white,

        px: 1.4,
        py: 1.1,

        cursor: "pointer",
        textAlign: "left",
        font: "inherit",

        transition: "border-color .18s ease, background .18s ease",

        "&:hover": {
          borderColor: alpha(COLORS.primary, 0.35),
          bgcolor: COLORS.aquaSoft,
        },
        "&:focus-visible": {
          outline: `2px solid ${COLORS.primary}`,
          outlineOffset: 2,
        },

        ...reduceMotion,
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          borderRadius: "9px",
          bgcolor: COLORS.aquaSoft,
          color: COLORS.primary,
        }}
      >
        <Icon sx={{ fontSize: 17 }} />
      </Avatar>

      <Typography sx={{ color: COLORS.ink, fontSize: "0.72rem", fontWeight: 750 }}>
        {label}
      </Typography>
    </Box>
  );
}

// ============================================================
// DASHBOARD
// ============================================================

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    inventory = [],
    notifications = [],
    loading: inventoryLoading = false,
  } = useSelector((state) => state.inventory);

  // ==========================================================
  // STATE
  // ==========================================================

  const [productsCount, setProductsCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(null);
  const [salesConnected, setSalesConnected] = useState(false);
  const [mlData, setMlData] = useState(null);
  const [forecastConnected, setForecastConnected] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================================
  // INVENTORY
  // ==========================================================

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // ==========================================================
  // PRODUCTS
  // ==========================================================

  const loadProducts = useCallback(async () => {
    try {
      const response = await getProducts();
      const list = response?.data || response || [];
      setProductsCount(Array.isArray(list) ? list.length : 0);
    } catch {
      setProductsCount(inventory.length || 0);
    }
  }, [inventory.length]);

  // ==========================================================
  // SALES
  // ==========================================================

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

            const sum = rows.reduce((total, row) => {
              const date = String(row.sale_date || row.date || row.created_at || "").slice(0, 10);
              const amount = Number(row.total_amount ?? row.revenue ?? row.amount ?? 0);
              return date === today ? total + amount : total;
            }, 0);

            setTodayRevenue(sum);
            setSalesConnected(true);
            return;
          }
        } catch {
          // Continue with next endpoint.
        }
      }

      setSalesConnected(false);
      setTodayRevenue(null);
    } catch {
      setSalesConnected(false);
      setTodayRevenue(null);
    }
  }, []);

  // ==========================================================
  // FORECAST
  // ==========================================================

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

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadProducts();
    loadSalesSummary();
    loadForecast();
  }, [loadProducts, loadSalesSummary, loadForecast]);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const refreshAll = useCallback(async () => {
    setRefreshing(true);

    try {
      await Promise.all([
        dispatch(fetchInventory()),
        loadProducts(),
        loadSalesSummary(),
        loadForecast(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, loadProducts, loadSalesSummary, loadForecast]);

  // ==========================================================
  // DERIVED DATA
  // ==========================================================

  const totalProducts = productsCount || inventory.length || 0;

  const inventoryAlerts = notifications.filter((item) =>
    ["low_stock", "out_of_stock", "over_stock"].includes(item.type)
  );

  const alertCount = inventoryAlerts.length;
  const hasAlerts = alertCount > 0;

  const forecastTotal = mlData?.kpis?.forecast_total_revenue ?? mlData?.forecast_total_revenue;
  const forecastAvg = mlData?.kpis?.forecast_avg_daily_revenue ?? mlData?.forecast_avg_daily_revenue;
  const modelType = mlData?.model_type || "best";

  // ==========================================================
  // INVENTORY HEALTH
  // This is the single source of truth for stock condition —
  // it replaces the separate Stock Alerts card entirely instead
  // of repeating the same alert count in two places.
  // ==========================================================

  const inventoryHealth = useMemo(() => {
    if (!totalProducts) return 0;
    if (!hasAlerts) return 100;

    return Math.max(15, Math.round(((totalProducts - alertCount) / totalProducts) * 100));
  }, [totalProducts, alertCount, hasAlerts]);

  // ==========================================================
  // FORECAST CHART
  // ==========================================================

  const chartData = useMemo(() => {
    if (!forecastConnected || !mlData) {
      return { labels: [], datasets: [] };
    }

    const history = mlData.history || [];
    const forecast = mlData.forecast || [];
    const historyTail = history.slice(-7);

    const labels = [
      ...historyTail.map((point) => shortDayLabel(point.ds)),
      ...forecast.map((point) => shortDayLabel(point.ds)),
    ];

    const actual = [
      ...historyTail.map((point) => (point.y_actual != null ? Number(point.y_actual) : null)),
      ...forecast.map(() => null),
    ];

    const predicted = [
      ...historyTail.map((point) => (point.yhat != null ? Number(point.yhat) : null)),
      ...forecast.map((point) => Number(point.yhat) || 0),
    ];

    return {
      labels,
      datasets: [
        {
          label: "Forecast",
          data: predicted,
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(24,121,159,.08)",
          borderColor: COLORS.primary,
          pointBackgroundColor: COLORS.white,
          pointBorderColor: COLORS.primary,
          pointRadius: 2.5,
          pointHoverRadius: 6,
          borderWidth: 2.2,
          spanGaps: true,
        },
        {
          label: "Actual",
          data: actual,
          tension: 0.4,
          fill: false,
          borderColor: COLORS.success,
          pointBackgroundColor: COLORS.white,
          pointBorderColor: COLORS.success,
          pointRadius: 2.5,
          pointHoverRadius: 6,
          borderWidth: 2,
          spanGaps: true,
        },
      ],
    };
  }, [forecastConnected, mlData]);

  // ==========================================================
  // CHART OPTIONS
  // ==========================================================

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      animation: { duration: 700, easing: "easeOutQuart" },

      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: "circle",
            padding: 14,
            color: COLORS.slate,
            font: { family: "inherit", size: 10, weight: 700 },
          },
        },
        tooltip: {
          backgroundColor: "rgba(18,49,61,.96)",
          titleColor: COLORS.white,
          bodyColor: COLORS.white,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context) => {
              const value = context.parsed.y;
              if (value == null) return `${context.dataset.label}: —`;
              return `${context.dataset.label}: ${money(value)}`;
            },
          },
        },
      },

      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: COLORS.muted, font: { size: 9, weight: 600 }, maxRotation: 0 },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(96,121,132,.07)" },
          border: { display: false },
          ticks: {
            color: COLORS.muted,
            font: { size: 9, weight: 600 },
            callback: (value) =>
              value >= 1000000
                ? `${(value / 1000000).toFixed(1)}M`
                : value >= 1000
                ? `${(value / 1000).toFixed(0)}k`
                : value,
          },
        },
      },
    }),
    []
  );

  // ==========================================================
  // AI INSIGHTS
  // ==========================================================

  const aiInsights = useMemo(() => {
    const insights = [];

    if (hasAlerts) {
      insights.push({
        title: "Inventory attention required",
        text: `${alertCount} stock alert${alertCount > 1 ? "s" : ""} need review.`,
        progress: 92,
        tone: COLORS.warning,
      });
    }

    if (forecastConnected && forecastAvg) {
      insights.push({
        title: "Demand outlook available",
        text: `Expected average daily revenue is ${money(forecastAvg)}.`,
        progress: 86,
        tone: COLORS.primary,
      });
    }

    if (forecastConnected && mlData?.recommendation) {
      const recommendation = String(mlData.recommendation);

      insights.push({
        title: "Model recommendation",
        text: recommendation.slice(0, 90) + (recommendation.length > 90 ? "…" : ""),
        progress: 78,
        tone: COLORS.success,
      });
    }

    if (!insights.length) {
      insights.push({
        title: "AI engine ready",
        text: "Connect forecasting data to unlock demand and inventory recommendations.",
        progress: 45,
        tone: COLORS.primary,
      });
    }

    return insights.slice(0, 3);
  }, [hasAlerts, alertCount, forecastConnected, forecastAvg, mlData]);

  // ==========================================================
  // QUICK ACTIONS
  // ==========================================================

  const quickActions = [
    { label: "Add product", icon: AddRoundedIcon, path: "/products" },
    { label: "New sale", icon: ReceiptLongRoundedIcon, path: "/sales" },
    { label: "New purchase", icon: ShoppingCartRoundedIcon, path: "/purchases" },
    { label: "View reports", icon: AssessmentRoundedIcon, path: "/reports" },
  ];

  // ==========================================================
  // LOADING
  // ==========================================================

  const loadingKpis = inventoryLoading && !totalProducts;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        position: "relative",

        bgcolor: COLORS.aquaPale,

        // Quiet, fixed background texture — not animated, so it
        // never competes with the data on screen.
        backgroundImage: `
          linear-gradient(180deg, rgba(255,255,255,.7), rgba(245,251,252,.94)),
          linear-gradient(90deg, rgba(24,121,159,.02) 1px, transparent 1px),
          linear-gradient(rgba(24,121,159,.02) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 32px 32px, 32px 32px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1480,
          mx: "auto",

          px: { xs: 1.5, sm: 2.5, md: 3 },
          py: { xs: 1.75, sm: 2.25, md: 2.5 },

          display: "flex",
          flexDirection: "column",
          gap: { xs: 1.75, sm: 2, md: 2.25 },

          animation: `${fadeUp} .4s both`,
          ...reduceMotion,
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1.5}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                color: COLORS.ink,
                fontWeight: 900,
                fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.65rem" },
                lineHeight: 1.15,
                letterSpacing: "-.03em",
              }}
            >
              Dashboard
            </Typography>

            <Typography
              sx={{
                mt: 0.35,
                color: COLORS.slate,
                fontSize: { xs: ".7rem", sm: ".75rem" },
                fontWeight: 600,
              }}
            >
              Your retail operations at a glance
            </Typography>
          </Box>

          {/* Actions never overlap content: full width + wrap on mobile */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <RefreshRoundedIcon
                  sx={{ animation: refreshing ? `${spin} .8s linear infinite` : "none" }}
                />
              }
              disabled={refreshing}
              onClick={refreshAll}
              sx={{
                minHeight: 38,
                px: 1.6,
                borderRadius: "10px",
                borderColor: COLORS.border,
                bgcolor: COLORS.white,
                color: COLORS.primaryDark,
                textTransform: "none",
                fontWeight: 750,
                fontSize: ".73rem",
                whiteSpace: "nowrap",

                "&:hover": { borderColor: COLORS.aqua, bgcolor: COLORS.aquaSoft },
              }}
            >
              {refreshing ? "Refreshing…" : "Refresh"}
            </Button>

            <Button
              fullWidth
              variant="contained"
              startIcon={<FileUploadRoundedIcon />}
              onClick={() => navigate("/sales")}
              disableElevation
              sx={{
                minHeight: 38,
                px: 1.8,
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                color: COLORS.white,
                textTransform: "none",
                fontWeight: 750,
                fontSize: ".73rem",
                whiteSpace: "nowrap",
                boxShadow: "0 6px 16px rgba(24,121,159,.18)",

                "&:hover": {
                  background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primaryDeep})`,
                  boxShadow: "0 8px 20px rgba(24,121,159,.24)",
                },
              }}
            >
              Upload sales
            </Button>
          </Stack>
        </Stack>

        {/* ==================================================
            KPI CARDS
        ================================================== */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0,1fr))",
              lg: "repeat(3, minmax(0,1fr))",
            },
            gap: { xs: 1.25, sm: 1.5, md: 1.75 },
          }}
        >
          {loadingKpis ? (
            [1, 2, 3].map((item) => (
              <Card key={item} sx={{ borderRadius: RADIUS, border: `1px solid ${COLORS.border}` }}>
                <CardContent sx={{ p: 2 }}>
                  <Skeleton width="42%" height={16} />
                  <Skeleton width="60%" height={38} sx={{ mt: 1 }} />
                  <Skeleton width="80%" height={16} />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <KpiCard
                label="Today's revenue"
                value={salesConnected ? money(todayRevenue) : "—"}
                description={salesConnected ? "Live sales performance" : "Sales data unavailable"}
                icon={TrendingUpRoundedIcon}
                tone={{ main: COLORS.success, bg: COLORS.successSoft }}
                onClick={() => navigate("/sales")}
                delay={60}
              />

              <KpiCard
                label="Total products"
                value={totalProducts.toLocaleString()}
                description="Active product catalog"
                icon={LocalOfferRoundedIcon}
                tone={{ main: COLORS.primary, bg: COLORS.aquaSoft }}
                onClick={() => navigate("/products")}
                delay={110}
              />

              <KpiCard
                label="7-day forecast"
                value={forecastConnected ? money(forecastTotal) : "—"}
                description={forecastConnected ? `${modelType} demand outlook` : "Forecast unavailable"}
                icon={AutoGraphRoundedIcon}
                tone={{ main: COLORS.primaryDark, bg: COLORS.aquaSoft }}
                onClick={() => navigate("/forecasting")}
                delay={160}
              />
            </>
          )}
        </Box>

        {/* ==================================================
            FORECAST + INVENTORY HEALTH
            Inventory Health is the single place stock condition
            is reported — no separate alerts card repeating it.
        ================================================== */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.7fr) minmax(280px, .85fr)" },
            gap: { xs: 1.75, md: 2 },
          }}
        >
          {/* ---------------- FORECAST ---------------- */}

          <Card sx={{ ...cardSx, animation: `${fadeUp} .45s 200ms both` }}>
            <CardContent sx={cardPad}>
              <SectionHeader
                icon={AutoGraphRoundedIcon}
                eyebrow="Demand intelligence"
                title="Sales & demand forecast"
                action={
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    {forecastConnected && (
                      <Chip
                        size="small"
                        label="LIVE"
                        sx={{
                          height: 22,
                          borderRadius: 999,
                          bgcolor: COLORS.successSoft,
                          color: COLORS.success,
                          fontSize: ".57rem",
                          fontWeight: 850,
                        }}
                      />
                    )}

                    <Tooltip title="Refresh forecast">
                      <IconButton
                        size="small"
                        onClick={loadForecast}
                        disabled={forecastLoading}
                        sx={{
                          width: 28,
                          height: 28,
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.primary,
                          "&:hover": { bgcolor: COLORS.aquaSoft },
                        }}
                      >
                        <RefreshRoundedIcon
                          sx={{
                            fontSize: 15,
                            animation: forecastLoading ? `${spin} .8s linear infinite` : "none",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              />

              {forecastConnected && (
                <Typography sx={{ mt: 1, color: COLORS.slate, fontSize: ".68rem" }}>
                  Live {modelType} outlook · avg {money(forecastAvg)}/day
                </Typography>
              )}

              <Box
                sx={{
                  mt: 1.75,
                  height: { xs: 210, sm: 235, md: 250 },
                  position: "relative",
                  width: "100%",
                }}
              >
                {forecastLoading && !mlData ? (
                  <Skeleton variant="rounded" width="100%" height="100%" sx={{ borderRadius: "12px" }} />
                ) : forecastConnected && chartData.datasets.length ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.7}
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "12px",
                      bgcolor: COLORS.aquaPale,
                      border: `1px dashed ${COLORS.border}`,
                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    <Avatar sx={{ width: 42, height: 42, bgcolor: COLORS.aquaSoft, color: COLORS.primary }}>
                      <AutoGraphRoundedIcon />
                    </Avatar>

                    <Typography sx={{ color: COLORS.ink, fontSize: ".78rem", fontWeight: 800 }}>
                      Forecast not connected
                    </Typography>

                    <Typography sx={{ color: COLORS.slate, fontSize: ".64rem", maxWidth: 340, lineHeight: 1.5 }}>
                      Connect the forecasting service to view actual performance and predicted demand.
                    </Typography>

                    <Button
                      size="small"
                      endIcon={<ArrowForwardRoundedIcon />}
                      onClick={() => navigate("/forecasting")}
                      sx={{
                        mt: 0.3,
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 750,
                        fontSize: ".66rem",
                        color: COLORS.primary,
                      }}
                    >
                      Open forecasting
                    </Button>
                  </Stack>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* ---------------- INVENTORY HEALTH ---------------- */}

          <Card sx={{ ...cardSx, animation: `${fadeUp} .45s 250ms both` }}>
            <CardContent sx={cardPad}>
              <SectionHeader icon={Inventory2RoundedIcon} eyebrow="Inventory overview" title="Inventory health" />

              <Box
                sx={{
                  mt: 1.75,
                  p: 1.6,
                  borderRadius: "12px",
                  background: hasAlerts
                    ? "linear-gradient(145deg,#FFF9F0,#FFFFFF)"
                    : "linear-gradient(145deg,#F0FBF5,#FFFFFF)",
                  border: `1px solid ${alpha(hasAlerts ? COLORS.warning : COLORS.success, 0.14)}`,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ color: COLORS.slate, fontSize: ".65rem", fontWeight: 700 }}>
                      Stock health
                    </Typography>

                    <Typography
                      sx={{
                        color: hasAlerts ? COLORS.warning : COLORS.success,
                        fontSize: "1.5rem",
                        fontWeight: 900,
                        letterSpacing: "-.03em",
                        mt: 0.2,
                      }}
                    >
                      {inventoryHealth}%
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      bgcolor: hasAlerts ? COLORS.warningSoft : COLORS.successSoft,
                      color: hasAlerts ? COLORS.warning : COLORS.success,
                    }}
                  >
                    {hasAlerts ? <WarningAmberRoundedIcon /> : <CheckCircleRoundedIcon />}
                  </Avatar>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={inventoryHealth}
                  sx={{
                    mt: 1.3,
                    height: 6,
                    borderRadius: 999,
                    bgcolor: hasAlerts ? COLORS.warningSoft : COLORS.successSoft,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      background: hasAlerts ? COLORS.warning : COLORS.success,
                    },
                  }}
                />

                <Typography sx={{ mt: 0.9, color: COLORS.slate, fontSize: ".62rem", lineHeight: 1.5 }}>
                  {hasAlerts
                    ? `${alertCount} product${alertCount > 1 ? "s" : ""} need attention.`
                    : "Inventory is currently healthy."}
                </Typography>
              </Box>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.6 }}>
                <Box>
                  <Typography sx={{ color: COLORS.muted, fontSize: ".58rem", fontWeight: 700 }}>
                    PRODUCTS
                  </Typography>
                  <Typography sx={{ color: COLORS.ink, fontSize: ".95rem", fontWeight: 850, mt: 0.15 }}>
                    {totalProducts}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ color: COLORS.muted, fontSize: ".58rem", fontWeight: 700 }}>
                    ALERTS
                  </Typography>
                  <Typography
                    sx={{
                      color: hasAlerts ? COLORS.danger : COLORS.success,
                      fontSize: ".95rem",
                      fontWeight: 850,
                      mt: 0.15,
                    }}
                  >
                    {alertCount}
                  </Typography>
                </Box>
              </Stack>

              <Button
                fullWidth
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate("/inventory")}
                sx={{
                  mt: 1.5,
                  minHeight: 36,
                  borderRadius: "9px",
                  bgcolor: COLORS.aquaSoft,
                  color: COLORS.primaryDark,
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: ".67rem",
                  "&:hover": { bgcolor: "#DDF3F8" },
                }}
              >
                Manage inventory
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* ==================================================
            AI STORE MANAGER + QUICK ACTIONS
        ================================================== */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1.5fr) minmax(280px,.9fr)" },
            gap: { xs: 1.75, md: 2 },
          }}
        >
          {/* ---------------- AI STORE MANAGER ---------------- */}

          <Card
            sx={{
              ...cardSx,
              background: `linear-gradient(145deg, #FFFFFF 0%, ${COLORS.aquaPale} 100%)`,
              animation: `${fadeUp} .45s 300ms both`,
            }}
          >
            <CardContent sx={cardPad}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "11px",
                    bgcolor: COLORS.primaryDark,
                    color: COLORS.white,
                    boxShadow: "0 6px 16px rgba(16,93,125,.2)",
                  }}
                >
                  <SmartToyRoundedIcon sx={{ fontSize: 19 }} />
                </Avatar>

                <Box flex={1} minWidth={0}>
                  <Typography
                    sx={{
                      color: COLORS.muted,
                      fontSize: ".62rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: ".07em",
                    }}
                  >
                    AI store manager
                  </Typography>
                  <Typography sx={{ color: COLORS.slate, fontSize: ".67rem", mt: 0.2 }}>
                    Business recommendations
                  </Typography>
                </Box>

                <Chip
                  label={forecastConnected ? "ACTIVE" : "STANDBY"}
                  size="small"
                  sx={{
                    height: 20,
                    borderRadius: 999,
                    bgcolor: forecastConnected ? COLORS.successSoft : COLORS.warningSoft,
                    color: forecastConnected ? COLORS.success : COLORS.warning,
                    fontSize: ".5rem",
                    fontWeight: 900,
                  }}
                />
              </Stack>

              <Stack spacing={1.2} sx={{ mt: 1.75 }}>
                {aiInsights.map((insight) => (
                  <Box key={insight.title}>
                    <Stack direction="row" justifyContent="space-between" spacing={1} mb={0.4}>
                      <Typography sx={{ color: COLORS.ink, fontSize: ".65rem", fontWeight: 750, lineHeight: 1.35 }}>
                        {insight.title}
                      </Typography>

                      <Typography sx={{ color: insight.tone, fontSize: ".6rem", fontWeight: 900, flexShrink: 0 }}>
                        {insight.progress}%
                      </Typography>
                    </Stack>

                    <Typography sx={{ color: COLORS.slate, fontSize: ".61rem", lineHeight: 1.45, mb: 0.6 }}>
                      {insight.text}
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={insight.progress}
                      sx={{
                        height: 5,
                        borderRadius: 999,
                        bgcolor: COLORS.aquaSoft,
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 999,
                          background: `linear-gradient(90deg, ${COLORS.aqua}, ${insight.tone})`,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>

              <Button
                fullWidth
                onClick={() => navigate("/ai-manager")}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  mt: 1.75,
                  minHeight: 36,
                  borderRadius: "9px",
                  bgcolor: COLORS.aquaSoft,
                  color: COLORS.primaryDark,
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: ".67rem",
                  "&:hover": { bgcolor: "#DDF3F8" },
                }}
              >
                Open AI store manager
              </Button>
            </CardContent>
          </Card>

          {/* ---------------- QUICK ACTIONS ---------------- */}

          <Card sx={{ ...cardSx, animation: `${fadeUp} .45s 340ms both` }}>
            <CardContent sx={cardPad}>
              <SectionHeader icon={AddRoundedIcon} eyebrow="Fast entry" title="Quick actions" />

              <Box
                sx={{
                  mt: 1.75,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                  gap: 1,
                }}
              >
                {quickActions.map((action) => (
                  <QuickActionTile
                    key={action.label}
                    icon={action.icon}
                    label={action.label}
                    onClick={() => navigate(action.path)}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* ==================================================
            SERVICE STATUS — plain, static, no blinking dots
        ================================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          rowGap={0.75}
          sx={{ px: { xs: 0.5, sm: 1 } }}
        >
          <Typography sx={{ color: COLORS.muted, fontSize: ".58rem", fontWeight: 650 }}>
            Dashboard services monitored
          </Typography>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Typography sx={{ color: COLORS.muted, fontSize: ".58rem", fontWeight: 650 }}>
              Products{" "}
              <Box component="span" sx={{ color: COLORS.primary, fontWeight: 850 }}>
                {totalProducts}
              </Box>
            </Typography>

            <Typography sx={{ color: COLORS.muted, fontSize: ".58rem", fontWeight: 650 }}>
              Alerts{" "}
              <Box component="span" sx={{ color: hasAlerts ? COLORS.danger : COLORS.success, fontWeight: 850 }}>
                {alertCount}
              </Box>
            </Typography>

            <Typography sx={{ color: COLORS.muted, fontSize: ".58rem", fontWeight: 650 }}>
              AI{" "}
              <Box
                component="span"
                sx={{ color: forecastConnected ? COLORS.success : COLORS.warning, fontWeight: 850 }}
              >
                {forecastConnected ? "Online" : "Standby"}
              </Box>
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default Dashboard;
