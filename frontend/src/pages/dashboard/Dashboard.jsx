

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
  LinearProgress,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  alpha,
  keyframes,
} from "@mui/material/styles";

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
import TrendingFlatRoundedIcon from "@mui/icons-material/TrendingFlatRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

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

import { PrimaryButton } from "../../components/ui";

import {
  fetchInventory,
} from "../../redux/slices/inventorySlice";

import { getProducts } from "../../services/productApi";
import forecastApi from "../../services/forecastApi";
import api from "../../services/api";

// ============================================================
// CHART REGISTRATION
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
  ocean: "#18799F",
  oceanDark: "#105D7D",
  oceanDeep: "#0B4D67",

  aqua: "#67BDD4",
  aquaSoft: "#E8F7FA",
  aquaPale: "#F3FBFD",

  blue: "#238FB8",

  beige: "#D7A965",
  beigeSoft: "#F7EFE1",

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

  border: "#DDEDF2",
};

const RADIUS = "18px";

const GAP = {
  xs: 1.5,
  sm: 2,
  md: 2.25,
};

// ============================================================
// ANIMATIONS
// ============================================================

const pageEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const softFloat = keyframes`
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, -8px, 0);
  }
`;

const rotateSlow = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.5;
    transform: scale(0.95);
  }

  50% {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  from {
    transform: translateX(-120%) skewX(-15deg);
  }

  to {
    transform: translateX(250%) skewX(-15deg);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const waveAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }

  10% {
    transform: rotate(14deg);
  }

  20% {
    transform: rotate(-8deg);
  }

  30% {
    transform: rotate(14deg);
  }

  40% {
    transform: rotate(-4deg);
  }

  50% {
    transform: rotate(10deg);
  }

  60%,
  100% {
    transform: rotate(0deg);
  }
`;

const reduceMotion = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none !important",
    transition: "none !important",
  },
};

// ============================================================
// SHARED CARD STYLE
// ============================================================

const cardSx = {
  position: "relative",

  height: "100%",

  overflow: "hidden",

  borderRadius: RADIUS,

  border: `1px solid ${COLORS.border}`,

  background:
    "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,252,253,0.96))",

  boxShadow:
    "0 4px 18px rgba(16, 77, 96, 0.045)",

  transition:
    "transform 220ms cubic-bezier(.16,1,.3,1), box-shadow 220ms ease, border-color 220ms ease",

  "&:hover": {
    transform: "translateY(-3px)",

    borderColor:
      "rgba(35,143,184,0.22)",

    boxShadow:
      "0 18px 40px rgba(16,77,96,0.10)",
  },

  ...reduceMotion,
};

// ============================================================
// SECTION EYEBROW
// ============================================================

function SectionEyebrow({
  children,
  sx,
}) {
  return (
    <Typography
      variant="caption"
      sx={{
        color: COLORS.slate,

        fontWeight: 800,

        letterSpacing: "0.075em",

        textTransform: "uppercase",

        fontSize: "0.63rem",

        lineHeight: 1.2,

        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

// ============================================================
// HELPERS
// ============================================================

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

  const difference = Math.floor(
    (now - created) / 1000
  );

  if (difference < 60) return "Just now";

  if (difference < 3600) {
    return `${Math.floor(difference / 60)}m ago`;
  }

  if (difference < 86400) {
    return `${Math.floor(difference / 3600)}h ago`;
  }

  return created.toLocaleDateString("en-IN");
}

function shortDayLabel(ds) {
  try {
    return new Date(ds).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "numeric",
      }
    );
  } catch {
    return ds;
  }
}

// ============================================================
// NAVIGABLE CARD
// ============================================================

function NavigableCard({
  onClick,
  children,
  ariaLabel,
  accent,
}) {
  if (!onClick) {
    return (
      <Card
        sx={{
          ...cardSx,
          borderTop: `3px solid ${accent}`,
        }}
      >
        {children}
      </Card>
    );
  }

  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      sx={{
        ...cardSx,

        cursor: "pointer",

        borderTop: `3px solid ${accent}`,

        "&:hover .dashboard-nav-arrow": {
          opacity: 1,
          transform: "translateX(0)",
        },

        "&:hover .dashboard-kpi-icon": {
          transform:
            "translateY(-2px) rotate(-4deg) scale(1.05)",
        },

        "&:hover .dashboard-card-shine": {
          animation:
            `${shimmer} 900ms ease`,
        },

        "&:focus-visible": {
          outline:
            `3px solid ${alpha(COLORS.blue, 0.18)}`,

          outlineOffset: 2,
        },

        ...reduceMotion,
      }}
      onKeyDown={(e) => {
        if (
          e.key === "Enter" ||
          e.key === " "
        ) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Box
        className="dashboard-card-shine"
        aria-hidden
        sx={{
          position: "absolute",

          top: 0,
          left: 0,

          width: "28%",
          height: "100%",

          pointerEvents: "none",

          background:
            "linear-gradient(100deg, transparent, rgba(255,255,255,0.48), transparent)",

          transform:
            "translateX(-120%) skewX(-15deg)",
        }}
      />

      {children}
    </Card>
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
  } = useSelector(
    (state) => state.inventory
  );

  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [
    productsCount,
    setProductsCount,
  ] = useState(0);

  const [
    todayRevenue,
    setTodayRevenue,
  ] = useState(null);

  const [
    salesConnected,
    setSalesConnected,
  ] = useState(false);

  const [
    mlData,
    setMlData,
  ] = useState(null);

  const [
    forecastConnected,
    setForecastConnected,
  ] = useState(false);

  const [
    forecastLoading,
    setForecastLoading,
  ] = useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  // ==========================================================
  // INVENTORY
  // ==========================================================

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // ==========================================================
  // PRODUCTS
  // ==========================================================

  const loadProducts = useCallback(
    async () => {
      try {
        const response =
          await getProducts();

        const list =
          response?.data ||
          response ||
          [];

        setProductsCount(
          Array.isArray(list)
            ? list.length
            : 0
        );
      } catch {
        setProductsCount(
          inventory.length || 0
        );
      }
    },
    [inventory.length]
  );

  // ==========================================================
  // SALES
  // ==========================================================

  const loadSalesSummary =
    useCallback(async () => {
      try {
        const attempts = [
          () =>
            api.get(
              "/sales/summary"
            ),

          () =>
            api.get(
              "/sales/stats"
            ),

          () =>
            api.get("/sales", {
              params: {
                limit: 200,
              },
            }),
        ];

        for (const attempt of attempts) {
          try {
            const { data } =
              await attempt();

            if (
              data?.today_revenue !=
                null ||
              data?.todayRevenue !=
                null
            ) {
              setTodayRevenue(
                data.today_revenue ??
                  data.todayRevenue
              );

              setSalesConnected(true);

              return;
            }

            if (
              data?.total_revenue !=
              null
            ) {
              setTodayRevenue(
                data.total_revenue
              );

              setSalesConnected(true);

              return;
            }

            const rows =
              Array.isArray(data)
                ? data
                : data?.items ||
                  data?.sales ||
                  [];

            if (
              Array.isArray(rows) &&
              rows.length
            ) {
              const today =
                new Date()
                  .toISOString()
                  .slice(0, 10);

              const sum =
                rows.reduce(
                  (acc, row) => {
                    const d = String(
                      row.sale_date ||
                        row.date ||
                        row.created_at ||
                        ""
                    ).slice(0, 10);

                    const amount =
                      Number(
                        row.total_amount ??
                          row.revenue ??
                          row.amount ??
                          0
                      );

                    return d === today
                      ? acc + amount
                      : acc;
                  },
                  0
                );

              setTodayRevenue(sum);
              setSalesConnected(true);

              return;
            }
          } catch {
            // Try next endpoint.
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

  const loadForecast =
    useCallback(async () => {
      setForecastLoading(true);

      try {
        const data =
          await forecastApi.mlDashboard({
            horizon_days: 7,
            model_name: "best",
            include_history_days: 14,
          });

        if (
          data?.status === "error"
        ) {
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
  }, [
    loadProducts,
    loadSalesSummary,
    loadForecast,
  ]);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const refreshAll = useCallback(
    async () => {
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
    },
    [
      dispatch,
      loadProducts,
      loadSalesSummary,
      loadForecast,
    ]
  );

  // ==========================================================
  // DERIVED DATA
  // ==========================================================

  const totalProducts =
    productsCount ||
    inventory.length ||
    0;

  const inventoryAlerts =
    notifications.filter((item) =>
      [
        "low_stock",
        "out_of_stock",
        "over_stock",
      ].includes(item.type)
    );

  const alertCount =
    inventoryAlerts.length;

  const hasAlerts =
    alertCount > 0;

  const forecastTotal =
    mlData?.kpis
      ?.forecast_total_revenue ??
    mlData?.forecast_total_revenue;

  const forecastAvg =
    mlData?.kpis
      ?.forecast_avg_daily_revenue ??
    mlData?.forecast_avg_daily_revenue;

  const modelType =
    mlData?.model_type || "best";

  // ==========================================================
  // ALERT CONFIG
  // ==========================================================

  function getAlertConfig(type) {
    switch (type) {
      case "out_of_stock":
        return {
          label: "Out of stock",
          color: "error",
          icon: (
            <WarningAmberRoundedIcon />
          ),
        };

      case "low_stock":
        return {
          label: "Low stock",
          color: "warning",
          icon: (
            <WarningAmberRoundedIcon />
          ),
        };

      case "success":
        return {
          label: "Completed",
          color: "success",
          icon: (
            <CheckCircleOutlineRoundedIcon />
          ),
        };

      default:
        return {
          label: "Info",
          color: "info",
          icon: (
            <AutoGraphOutlinedIcon />
          ),
        };
    }
  }

  // ==========================================================
  // STATUS COLORS
  // ==========================================================

  const STATUS_COLORS = useMemo(
    () => ({
      info: {
        main: COLORS.blue,
        bg: COLORS.aquaSoft,
      },

      success: {
        main: COLORS.success,
        bg: COLORS.successSoft,
      },

      error: {
        main: COLORS.danger,
        bg: COLORS.dangerSoft,
      },

      warning: {
        main: COLORS.warning,
        bg: COLORS.warningSoft,
      },

      accent: {
        main: COLORS.ocean,
        bg: COLORS.aquaSoft,
      },
    }),
    []
  );

  // ==========================================================
  // KPI METRICS
  // ==========================================================

  const metrics = [
    {
      label: "Today's Revenue",

      value: salesConnected
        ? money(todayRevenue)
        : "Not connected",

      change: salesConnected
        ? "Live sales records"
        : "Sales API required",

      icon: TrendingUpOutlinedIcon,

      statusType:
        salesConnected
          ? "success"
          : "info",

      to: "/sales",

      cta: "View sales",

      accent: COLORS.success,
    },

    {
      label: "Total Products",

      value:
        totalProducts.toLocaleString(),

      change: "Live product catalog",

      icon: LocalOfferOutlinedIcon,

      statusType: "success",

      to: "/products",

      cta: "View products",

      accent: COLORS.blue,
    },

    {
      label: "Active Alerts",

      value: alertCount,

      change: hasAlerts
        ? "Requires attention"
        : "Everything looks healthy",

      icon: Inventory2OutlinedIcon,

      statusType: hasAlerts
        ? "error"
        : "success",

      to: "/inventory",

      cta: "View inventory",

      accent: hasAlerts
        ? COLORS.danger
        : COLORS.success,
    },

    {
      label: "AI Forecast",

      value: forecastConnected
        ? money(forecastTotal)
        : "Not connected",

      change: forecastConnected
        ? `${modelType} · 7-day outlook`
        : "Forecast service required",

      icon: AutoGraphOutlinedIcon,

      statusType:
        forecastConnected
          ? "success"
          : "info",

      to: "/forecasting",

      cta: "View forecast",

      accent: COLORS.ocean,
    },
  ];

  // ==========================================================
  // QUICK LINKS
  // ==========================================================

  const quickLinks = [
    {
      label: "Products",
      icon: StorefrontRoundedIcon,
      to: "/products",
    },

    {
      label: "Inventory",
      icon: Inventory2RoundedIcon,
      to: "/inventory",
    },

    {
      label: "Sales",
      icon: ReceiptLongRoundedIcon,
      to: "/sales",
    },

    {
      label: "Forecast",
      icon: AutoGraphOutlinedIcon,
      to: "/forecasting",
    },

    {
      label: "Notifications",
      icon: NotificationsNoneRoundedIcon,
      to: "/notifications",
    },
  ];

  // ==========================================================
  // CHART DATA
  // ==========================================================

  const chartData = useMemo(() => {
    if (
      !forecastConnected ||
      !mlData
    ) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const hist =
      mlData.history || [];

    const fut =
      mlData.forecast || [];

    const histTail =
      hist.slice(-7);

    const labels = [
      ...histTail.map((p) =>
        shortDayLabel(p.ds)
      ),

      ...fut.map((p) =>
        shortDayLabel(p.ds)
      ),
    ];

    const actual = [
      ...histTail.map((p) =>
        p.y_actual != null
          ? Number(p.y_actual)
          : null
      ),

      ...fut.map(() => null),
    ];

    const predicted = [
      ...histTail.map((p) =>
        p.yhat != null
          ? Number(p.yhat)
          : null
      ),

      ...fut.map(
        (p) =>
          Number(p.yhat) || 0
      ),
    ];

    return {
      labels,

      datasets: [
        {
          label: "Forecast",

          data: predicted,

          tension: 0.42,

          fill: true,

          backgroundColor:
            "rgba(35,143,184,0.08)",

          borderColor:
            COLORS.ocean,

          pointBackgroundColor:
            COLORS.white,

          pointBorderColor:
            COLORS.ocean,

          pointRadius: 2,

          pointHoverRadius: 5,

          borderWidth: 2.2,

          spanGaps: true,
        },

        {
          label: "Actual",

          data: actual,

          tension: 0.42,

          fill: false,

          borderColor:
            COLORS.success,

          pointBackgroundColor:
            COLORS.white,

          pointBorderColor:
            COLORS.success,

          pointRadius: 2,

          pointHoverRadius: 5,

          borderWidth: 2,

          spanGaps: true,
        },
      ],
    };
  }, [
    forecastConnected,
    mlData,
  ]);

  // ==========================================================
  // CHART OPTIONS
  // ==========================================================

  const chartOptions = useMemo(
    () => ({
      responsive: true,

      maintainAspectRatio: false,

      interaction: {
        intersect: false,
        mode: "index",
      },

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

            font: {
              family: "inherit",
              size: 10,
              weight: 700,
            },
          },
        },

        tooltip: {
          backgroundColor:
            "rgba(16,61,78,0.94)",

          titleColor:
            COLORS.white,

          bodyColor:
            COLORS.white,

          padding: 10,

          cornerRadius: 10,

          displayColors: true,

          callbacks: {
            label: (ctx) => {
              const v =
                ctx.parsed.y;

              if (v == null) {
                return `${ctx.dataset.label}: —`;
              }

              return `${ctx.dataset.label}: ${money(v)}`;
            },
          },
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },

          border: {
            display: false,
          },

          ticks: {
            color: COLORS.muted,

            font: {
              size: 9,
              weight: 600,
            },

            maxRotation: 0,
          },
        },

        y: {
          beginAtZero: true,

          grid: {
            color:
              "rgba(96,121,132,0.07)",
          },

          border: {
            display: false,
            dash: [3, 4],
          },

          ticks: {
            color: COLORS.muted,

            font: {
              size: 9,
              weight: 600,
            },

            callback: (v) =>
              v >= 1e6
                ? `${(
                    v / 1e6
                  ).toFixed(1)}M`
                : v >= 1e3
                ? `${(
                    v / 1e3
                  ).toFixed(0)}k`
                : v,
          },
        },
      },
    }),
    []
  );

  // ==========================================================
  // AI ASSISTANT TIPS
  // ==========================================================

  const assistantTips =
    useMemo(() => {
      const tips = [];

      if (
        forecastConnected &&
        forecastAvg
      ) {
        tips.push({
          text: `Plan stock around ~${money(
            forecastAvg
          )} avg daily revenue`,

          value: 88,
        });
      }

      if (hasAlerts) {
        tips.push({
          text: `Resolve ${alertCount} stock alert${
            alertCount > 1
              ? "s"
              : ""
          }`,

          value: 92,
        });
      }

      if (
        forecastConnected &&
        mlData?.recommendation
      ) {
        const text =
          String(
            mlData.recommendation
          );

        tips.push({
          text:
            text.slice(0, 64) +
            (text.length > 64
              ? "…"
              : ""),

          value: 76,
        });
      }

      if (!tips.length) {
        tips.push(
          {
            text:
              "Connect forecast service for demand tips",
            value: 40,
          },

          {
            text:
              "Keep inventory levels updated",
            value: 55,
          }
        );
      }

      return tips.slice(0, 3);
    }, [
      forecastConnected,
      forecastAvg,
      hasAlerts,
      alertCount,
      mlData,
    ]);

  const loadingKpis =
    inventoryLoading &&
    !totalProducts;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box
      sx={{
        width: "100%",

        minHeight: "100%",

        position: "relative",

        overflow: "hidden",

        bgcolor:
          COLORS.aquaPale,

        containerType:
          "inline-size",

        containerName:
          "dashboard",

        ...reduceMotion,
      }}
    >
      {/* ====================================================
          AMBIENT BACKGROUND
          ==================================================== */}

      <Box
        aria-hidden
        sx={{
          position: "absolute",

          width: 260,
          height: 260,

          top: -150,
          right: -80,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(103,189,212,0.16), transparent 68%)",

          animation:
            `${softFloat} 8s ease-in-out infinite`,

          pointerEvents: "none",

          ...reduceMotion,
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",

          width: 210,
          height: 210,

          left: -130,
          top: 330,

          borderRadius: "50%",

          border:
            "1px solid rgba(103,189,212,0.13)",

          animation:
            `${rotateSlow} 25s linear infinite`,

          pointerEvents: "none",

          ...reduceMotion,
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",

          width: 7,
          height: 7,

          top: 175,
          right: "18%",

          borderRadius: "50%",

          bgcolor:
            "rgba(215,169,101,0.55)",

          animation:
            `${pulse} 3.5s ease-in-out infinite`,

          pointerEvents: "none",

          ...reduceMotion,
        }}
      />

      {/* ====================================================
          MAIN CONTAINER
          ==================================================== */}

      <Box
        sx={{
          position: "relative",

          zIndex: 1,

          width: "100%",

          maxWidth: "1680px",

          mx: "auto",

          display: "flex",

          flexDirection: "column",

          gap: {
            xs: 1.75,
            sm: 2.25,
            md: 2.5,
          },

          p: {
            xs: 1.25,
            sm: 2,
            md: 2.75,
            lg: 3,
          },

          animation:
            `${pageEnter} 550ms cubic-bezier(.16,1,.3,1) both`,

          ...reduceMotion,
        }}
      >
        {/* ==================================================
            HEADER
            ================================================== */}

        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            lg: "center",
          }}
          spacing={{
            xs: 1.5,
            lg: 2,
          }}
        >
          <Box
            sx={{
              animation:
                `${fadeUp} 500ms 80ms both`,

              ...reduceMotion,
            }}
          >
            <Stack
              direction="row"
              spacing={0.8}
              alignItems="center"
            >
              <Typography
                component="h1"
                sx={{
                  color: COLORS.ink,

                  fontWeight: 900,

                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.5rem",
                    md: "1.65rem",
                  },

                  lineHeight: 1.1,

                  letterSpacing:
                    "-0.045em",
                }}
              >
                Dashboard
              </Typography>

              <Box
                component="span"
                sx={{
                  display: "inline-flex",

                  transformOrigin:
                    "70% 70%",

                  animation:
                    `${waveAnimation} 2.5s infinite`,

                  fontSize: {
                    xs: "1rem",
                    sm: "1.15rem",
                  },

                  ...reduceMotion,
                }}
              >
                👋
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={0.7}
              alignItems="center"
              sx={{
                mt: 0.55,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,

                  borderRadius:
                    "50%",

                  bgcolor:
                    COLORS.success,

                  boxShadow:
                    `0 0 0 4px ${alpha(
                      COLORS.success,
                      0.1
                    )}`,
                }}
              />

              <Typography
                sx={{
                  color: COLORS.slate,

                  fontSize: {
                    xs: "0.68rem",
                    sm: "0.73rem",
                  },

                  fontWeight: 600,
                }}
              >
                Real-time retail intelligence
              </Typography>
            </Stack>
          </Box>

          {/* ACTIONS */}

          <Stack
            direction={{
              xs: "row",
              sm: "row",
            }}
            spacing={0.8}
            flexWrap="wrap"
            useFlexGap
            sx={{
              width: {
                xs: "100%",
                lg: "auto",
              },

              animation:
                `${fadeUp} 500ms 140ms both`,

              ...reduceMotion,
            }}
          >
            <PrimaryButton
              variant="outlined"
              size="small"
              startIcon={
                <RefreshRoundedIcon
                  sx={{
                    fontSize:
                      "16px !important",

                    animation:
                      refreshing
                        ? `${spin} 0.9s linear infinite`
                        : "none",
                  }}
                />
              }
              onClick={refreshAll}
              disabled={refreshing}
              sx={{
                minHeight: 38,

                px: 1.5,

                borderRadius:
                  "11px",

                textTransform:
                  "none",

                fontWeight: 800,

                fontSize: "0.7rem",

                color:
                  COLORS.oceanDark,

                borderColor:
                  COLORS.border,

                bgcolor:
                  "rgba(255,255,255,0.72)",

                "&:hover": {
                  borderColor:
                    COLORS.aqua,

                  bgcolor:
                    COLORS.white,
                },

                flex: {
                  xs: 1,
                  sm: "initial",
                },
              }}
            >
              {refreshing
                ? "Refreshing…"
                : "Refresh"}
            </PrimaryButton>

            <PrimaryButton
              variant="outlined"
              size="small"
              startIcon={
                <AutoGraphOutlinedIcon
                  sx={{
                    fontSize:
                      "16px !important",
                  }}
                />
              }
              onClick={() =>
                navigate(
                  "/forecasting"
                )
              }
              sx={{
                minHeight: 38,

                px: 1.5,

                borderRadius:
                  "11px",

                textTransform:
                  "none",

                fontWeight: 800,

                fontSize: "0.7rem",

                color:
                  COLORS.oceanDark,

                borderColor:
                  COLORS.border,

                bgcolor:
                  "rgba(255,255,255,0.72)",

                "&:hover": {
                  borderColor:
                    COLORS.aqua,

                  bgcolor:
                    COLORS.white,
                },

                flex: {
                  xs: 1,
                  sm: "initial",
                },
              }}
            >
              {forecastConnected
                ? "Forecast"
                : "Setup AI"}
            </PrimaryButton>

            <PrimaryButton
              variant="contained"
              size="small"
              startIcon={
                <FileUploadOutlinedIcon
                  sx={{
                    fontSize:
                      "16px !important",
                  }}
                />
              }
              disableElevation
              onClick={() =>
                navigate("/sales")
              }
              sx={{
                position: "relative",

                overflow: "hidden",

                minHeight: 38,

                px: 1.6,

                borderRadius:
                  "11px",

                textTransform:
                  "none",

                fontWeight: 800,

                fontSize: "0.7rem",

                color: COLORS.white,

                background:
                  `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.oceanDark})`,

                boxShadow:
                  "0 7px 18px rgba(24,121,159,0.18)",

                "&:hover": {
                  background:
                    `linear-gradient(135deg, ${COLORS.ocean}, ${COLORS.oceanDeep})`,

                  transform:
                    "translateY(-1px)",

                  boxShadow:
                    "0 10px 22px rgba(24,121,159,0.25)",
                },

                transition:
                  "all 180ms ease",

                flex: {
                  xs: 1,
                  sm: "initial",
                },
              }}
            >
              Upload Sales
            </PrimaryButton>
          </Stack>
        </Stack>

        {/* ==================================================
            QUICK LINKS
            ================================================== */}

        <Box
          sx={{
            overflowX: "auto",

            pb: 0.25,

            scrollbarWidth: "none",

            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Stack
            direction="row"
            spacing={0.8}
            sx={{
              width: "max-content",
            }}
          >
            {quickLinks.map(
              (link) => {
                const Icon =
                  link.icon;

                return (
                  <Chip
                    key={link.label}
                    clickable
                    onClick={() =>
                      navigate(
                        link.to
                      )
                    }
                    icon={
                      <Icon
                        sx={{
                          fontSize:
                            "15px !important",
                        }}
                      />
                    }
                    label={link.label}
                    variant="outlined"
                    sx={{
                      height: 31,

                      borderRadius:
                        999,

                      bgcolor:
                        "rgba(255,255,255,0.68)",

                      borderColor:
                        COLORS.border,

                      color:
                        COLORS.oceanDark,

                      fontWeight: 750,

                      fontSize:
                        "0.68rem",

                      transition:
                        "all 180ms ease",

                      "&:hover": {
                        bgcolor:
                          COLORS.white,

                        borderColor:
                          COLORS.aqua,

                        color:
                          COLORS.ocean,

                        transform:
                          "translateY(-1px)",

                        boxShadow:
                          "0 5px 14px rgba(16,77,96,0.07)",
                      },
                    }}
                  />
                );
              }
            )}
          </Stack>
        </Box>

        {/* ==================================================
            KPI GRID
            ================================================== */}

        <Box
          sx={{
            display: "grid",

            gap: GAP,

            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",

            "@container dashboard (max-width: 1120px)":
              {
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
              },

            "@container dashboard (max-width: 560px)":
              {
                gridTemplateColumns:
                  "1fr",
              },
          }}
        >
          {metrics.map(
            (item, index) => {
              const Icon =
                item.icon;

              const tone =
                STATUS_COLORS[
                  item.statusType
                ] ||
                STATUS_COLORS.info;

              return (
                <Box
                  key={item.label}
                  sx={{
                    animation:
                      `${fadeUp} 500ms ${
                        180 +
                        index * 70
                      }ms both`,

                    ...reduceMotion,
                  }}
                >
                  <NavigableCard
                    onClick={() =>
                      navigate(
                        item.to
                      )
                    }
                    ariaLabel={
                      item.cta
                    }
                    accent={
                      item.accent
                    }
                  >
                    <CardContent
                      sx={{
                        position:
                          "relative",

                        p: {
                          xs: 1.5,
                          sm: 1.85,
                        },

                        "&:last-child": {
                          pb: {
                            xs: 1.5,
                            sm: 1.85,
                          },
                        },
                      }}
                    >
                      {loadingKpis ? (
                        <Stack
                          spacing={
                            1
                          }
                        >
                          <Skeleton
                            width="55%"
                            height={
                              14
                            }
                          />

                          <Skeleton
                            width="62%"
                            height={
                              32
                            }
                          />

                          <Skeleton
                            width="80%"
                            height={
                              12
                            }
                          />
                        </Stack>
                      ) : (
                        <Stack
                          spacing={
                            1
                          }
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <SectionEyebrow>
                              {
                                item.label
                              }
                            </SectionEyebrow>

                            <Avatar
                              className="dashboard-kpi-icon"
                              sx={{
                                width: 34,
                                height: 34,

                                flexShrink: 0,

                                bgcolor:
                                  tone.bg,

                                color:
                                  tone.main,

                                border:
                                  `1px solid ${alpha(
                                    tone.main,
                                    0.08
                                  )}`,

                                transition:
                                  "transform 220ms cubic-bezier(.16,1,.3,1)",
                              }}
                            >
                              <Icon
                                sx={{
                                  fontSize: 17,
                                }}
                              />
                            </Avatar>
                          </Stack>

                          <Typography
                            sx={{
                              color:
                                tone.main,

                              fontWeight: 900,

                              fontSize: {
                                xs: "1.18rem",
                                sm: "1.38rem",
                              },

                              lineHeight: 1.1,

                              letterSpacing:
                                "-0.04em",

                              wordBreak:
                                "break-word",
                            }}
                          >
                            {
                              item.value
                            }
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={
                              0.45
                            }
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                width: 5,
                                height: 5,

                                borderRadius:
                                  "50%",

                                bgcolor:
                                  tone.main,

                                opacity:
                                  0.65,
                              }}
                            />

                            <Typography
                              sx={{
                                color:
                                  COLORS.slate,

                                fontWeight:
                                  600,

                                fontSize:
                                  "0.64rem",

                                lineHeight:
                                  1.3,

                                flex: 1,
                              }}
                            >
                              {
                                item.change
                              }
                            </Typography>

                            <ArrowForwardRoundedIcon
                              className="dashboard-nav-arrow"
                              sx={{
                                fontSize: 16,

                                color:
                                  tone.main,

                                opacity: 0,

                                transform:
                                  "translateX(-5px)",

                                transition:
                                  "opacity 180ms ease, transform 180ms ease",
                              }}
                            />
                          </Stack>
                        </Stack>
                      )}
                    </CardContent>
                  </NavigableCard>
                </Box>
              );
            }
          )}
        </Box>

        {/* ==================================================
            MAIN TWO-COLUMN AREA
            ================================================== */}

        <Box
          sx={{
            display: "grid",

            gap: GAP,

            gridTemplateColumns:
              "minmax(0, 1.9fr) minmax(280px, 1fr)",

            "@container dashboard (max-width: 920px)":
              {
                gridTemplateColumns:
                  "1fr",
              },
          }}
        >
          {/* =================================================
              LEFT COLUMN
              ================================================= */}

          <Stack
            spacing={GAP}
            sx={{
              minWidth: 0,
            }}
          >
            {/* ===============================================
                FORECAST CARD
                =============================================== */}

            <Card
              sx={{
                ...cardSx,

                animation:
                  `${fadeUp} 600ms 420ms both`,

                ...reduceMotion,
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 1.6,
                    sm: 2,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 1.6,
                      sm: 2,
                    },
                  },
                }}
              >
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "stretch",
                    sm: "center",
                  }}
                  spacing={1}
                  mb={1.5}
                >
                  <Box>
                    <Stack
                      direction="row"
                      spacing={0.7}
                      alignItems="center"
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,

                          bgcolor:
                            COLORS.aquaSoft,

                          color:
                            COLORS.ocean,

                          borderRadius:
                            "9px",
                        }}
                      >
                        <AutoGraphOutlinedIcon
                          sx={{
                            fontSize: 15,
                          }}
                        />
                      </Avatar>

                      <Box>
                        <SectionEyebrow>
                          Weekly demand forecast
                        </SectionEyebrow>

                        <Typography
                          sx={{
                            mt: 0.25,

                            color:
                              COLORS.slate,

                            fontSize:
                              "0.65rem",

                            fontWeight:
                              600,
                          }}
                        >
                          {forecastConnected
                            ? `Live · ${modelType} · avg ${money(
                                forecastAvg
                              )}/day`
                            : "AI-driven predictive outlook"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={0.65}
                    alignItems="center"
                  >
                    {forecastConnected && (
                      <Chip
                        size="small"
                        label="LIVE"
                        icon={
                          <BoltRoundedIcon
                            sx={{
                              fontSize:
                                "13px !important",
                            }}
                          />
                        }
                        sx={{
                          height: 25,

                          borderRadius:
                            999,

                          bgcolor:
                            COLORS.successSoft,

                          color:
                            COLORS.success,

                          fontWeight: 800,

                          fontSize:
                            "0.59rem",
                        }}
                      />
                    )}

                    <Tooltip title="Refresh forecast">
                      <IconButton
                        size="small"
                        onClick={
                          loadForecast
                        }
                        disabled={
                          forecastLoading
                        }
                        sx={{
                          width: 30,
                          height: 30,

                          border:
                            `1px solid ${COLORS.border}`,

                          color:
                            COLORS.ocean,

                          "&:hover": {
                            bgcolor:
                              COLORS.aquaSoft,
                          },
                        }}
                      >
                        <RefreshRoundedIcon
                          sx={{
                            fontSize: 15,

                            animation:
                              forecastLoading
                                ? `${spin} 0.9s linear infinite`
                                : "none",
                          }}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Open forecast">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(
                            "/forecasting"
                          )
                        }
                        sx={{
                          width: 30,
                          height: 30,

                          border:
                            `1px solid ${COLORS.border}`,

                          color:
                            COLORS.ocean,

                          "&:hover": {
                            bgcolor:
                              COLORS.aquaSoft,
                          },
                        }}
                      >
                        <ArrowForwardRoundedIcon
                          sx={{
                            fontSize: 15,
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    height: {
                      xs: 195,
                      sm: 220,
                      md: 230,
                    },

                    position:
                      "relative",
                  }}
                >
                  {forecastLoading &&
                  !mlData ? (
                    <Skeleton
                      variant="rounded"
                      width="100%"
                      height="100%"
                      sx={{
                        borderRadius:
                          "13px",
                      }}
                    />
                  ) : forecastConnected &&
                    chartData
                      .datasets
                      .length >
                      0 ? (
                    <Line
                      data={
                        chartData
                      }
                      options={
                        chartOptions
                      }
                    />
                  ) : (
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      spacing={0.6}
                      sx={{
                        height:
                          "100%",

                        borderRadius:
                          "13px",

                        bgcolor:
                          COLORS.aquaPale,

                        border:
                          `1px dashed ${COLORS.border}`,

                        px: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,

                          bgcolor:
                            COLORS.aquaSoft,

                          color:
                            COLORS.ocean,

                          animation:
                            `${softFloat} 4s ease-in-out infinite`,
                        }}
                      >
                        <AutoGraphOutlinedIcon
                          sx={{
                            fontSize: 21,
                          }}
                        />
                      </Avatar>

                      <Typography
                        sx={{
                          color:
                            COLORS.ink,

                          fontWeight:
                            800,

                          fontSize:
                            "0.75rem",

                          mt: 0.3,
                        }}
                      >
                        Forecast not connected
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            COLORS.slate,

                          fontSize:
                            "0.62rem",

                          textAlign:
                            "center",

                          maxWidth: 330,
                        }}
                      >
                        Connect the predictive service to view demand trends.
                      </Typography>

                      <Button
                        size="small"
                        onClick={() =>
                          navigate(
                            "/forecasting"
                          )
                        }
                        sx={{
                          mt: 0.4,

                          minHeight: 29,

                          px: 1.4,

                          borderRadius:
                            999,

                          textTransform:
                            "none",

                          fontSize:
                            "0.65rem",

                          fontWeight:
                            800,

                          color:
                            COLORS.ocean,

                          bgcolor:
                            COLORS.white,

                          border:
                            `1px solid ${COLORS.border}`,

                          "&:hover": {
                            bgcolor:
                              COLORS.aquaSoft,
                          },
                        }}
                      >
                        Open forecasting
                      </Button>
                    </Stack>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* ===============================================
                STOCK ALERTS
                =============================================== */}

            <Card
              sx={{
                ...cardSx,

                animation:
                  `${fadeUp} 600ms 500ms both`,

                ...reduceMotion,
              }}
            >
              <CardContent
                sx={{
                  p: 0,

                  "&:last-child": {
                    pb: 0,
                  },
                }}
              >
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "stretch",
                    sm: "center",
                  }}
                  spacing={1}
                  sx={{
                    p: {
                      xs: 1.6,
                      sm: 2,
                    },

                    pb: {
                      xs: 1.2,
                      sm: 1.4,
                    },
                  }}
                >
                  <Box>
                    <Stack
                      direction="row"
                      spacing={0.7}
                      alignItems="center"
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,

                          bgcolor:
                            hasAlerts
                              ? COLORS.warningSoft
                              : COLORS.successSoft,

                          color:
                            hasAlerts
                              ? COLORS.warning
                              : COLORS.success,

                          borderRadius:
                            "9px",
                        }}
                      >
                        {hasAlerts ? (
                          <WarningAmberRoundedIcon
                            sx={{
                              fontSize: 15,
                            }}
                          />
                        ) : (
                          <CheckCircleOutlineRoundedIcon
                            sx={{
                              fontSize: 15,
                            }}
                          />
                        )}
                      </Avatar>

                      <Box>
                        <SectionEyebrow>
                          Live stock alerts
                        </SectionEyebrow>

                        <Typography
                          sx={{
                            mt: 0.25,

                            color:
                              COLORS.slate,

                            fontSize:
                              "0.65rem",

                            fontWeight:
                              600,
                          }}
                        >
                          Real-time inventory levels
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={0.6}
                    alignItems="center"
                  >
                    <Chip
                      size="small"
                      icon={
                        hasAlerts ? (
                          <WarningAmberRoundedIcon
                            sx={{
                              fontSize:
                                "13px !important",
                            }}
                          />
                        ) : (
                          <CheckCircleOutlineRoundedIcon
                            sx={{
                              fontSize:
                                "13px !important",
                            }}
                          />
                        )
                      }
                      label={
                        hasAlerts
                          ? `${alertCount} alerts`
                          : "All healthy"
                      }
                      sx={{
                        height: 24,

                        borderRadius:
                          999,

                        fontSize:
                          "0.61rem",

                        fontWeight:
                          800,

                        bgcolor:
                          hasAlerts
                            ? COLORS.dangerSoft
                            : COLORS.successSoft,

                        color:
                          hasAlerts
                            ? COLORS.danger
                            : COLORS.success,
                      }}
                    />

                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          "/inventory"
                        )
                      }
                      sx={{
                        minWidth: 0,

                        px: 0.8,

                        minHeight: 28,

                        textTransform:
                          "none",

                        fontWeight:
                          800,

                        fontSize:
                          "0.65rem",

                        color:
                          COLORS.ocean,

                        borderRadius:
                          "8px",
                      }}
                    >
                      View all
                    </Button>
                  </Stack>
                </Stack>

                {!hasAlerts ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.45}
                    sx={{
                      py: {
                        xs: 3.2,
                        sm: 4,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,

                        bgcolor:
                          COLORS.successSoft,

                        color:
                          COLORS.success,

                        animation:
                          `${softFloat} 4s ease-in-out infinite`,
                      }}
                    >
                      <CheckCircleOutlineRoundedIcon
                        sx={{
                          fontSize: 21,
                        }}
                      />
                    </Avatar>

                    <Typography
                      sx={{
                        mt: 0.4,

                        fontWeight: 800,

                        fontSize:
                          "0.75rem",

                        color:
                          COLORS.ink,
                      }}
                    >
                      No alerts outstanding
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          COLORS.slate,

                        fontSize:
                          "0.62rem",
                      }}
                    >
                      Inventory is currently healthy.
                    </Typography>
                  </Stack>
                ) : (
                  <TableContainer
                    sx={{
                      maxHeight: 265,

                      overflowX:
                        "auto",

                      "&::-webkit-scrollbar":
                        {
                          height: 5,
                        },

                      "&::-webkit-scrollbar-thumb":
                        {
                          backgroundColor:
                            COLORS.aqua,

                          borderRadius:
                            999,
                        },
                    }}
                  >
                    <Table
                      stickyHeader
                      size="small"
                      sx={{
                        minWidth: 530,
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          {[
                            "Product",
                            "Status",
                            "Current",
                            "Minimum",
                            "",
                          ].map(
                            (
                              h,
                              i
                            ) => (
                              <TableCell
                                key={
                                  h +
                                  i
                                }
                                align={
                                  i ===
                                  4
                                    ? "right"
                                    : "left"
                                }
                                sx={{
                                  fontWeight:
                                    800,

                                  color:
                                    COLORS.slate,

                                  bgcolor:
                                    "#F7FBFC",

                                  py: 1,

                                  fontSize:
                                    "0.59rem",

                                  textTransform:
                                    "uppercase",

                                  letterSpacing:
                                    "0.05em",

                                  borderBottom:
                                    `1px solid ${COLORS.border}`,
                                }}
                              >
                                {h ===
                                ""
                                  ? "Manage"
                                  : h}
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {inventoryAlerts.map(
                          (alert) => {
                            const config =
                              getAlertConfig(
                                alert.type
                              );

                            const tone =
                              STATUS_COLORS[
                                config.color
                              ] ||
                              STATUS_COLORS.info;

                            return (
                              <TableRow
                                key={
                                  alert.id
                                }
                                hover
                                sx={{
                                  "& td":
                                    {
                                      borderBottom:
                                        `1px solid ${COLORS.border}`,
                                    },

                                  "&:hover":
                                    {
                                      bgcolor:
                                        COLORS.aquaPale,
                                    },
                                }}
                              >
                                <TableCell
                                  sx={{
                                    py: 1.05,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize:
                                        "0.7rem",

                                      fontWeight:
                                        800,

                                      color:
                                        COLORS.ink,
                                    }}
                                  >
                                    {alert
                                      .product
                                      ?.product_name ||
                                      alert
                                        .product
                                        ?.name ||
                                      "Unknown Product"}
                                  </Typography>

                                  <Typography
                                    sx={{
                                      fontSize:
                                        "0.58rem",

                                      color:
                                        COLORS.muted,

                                      mt: 0.15,
                                    }}
                                  >
                                    ID: #
                                    {alert
                                      .product
                                      ?.id ||
                                      "N/A"}
                                  </Typography>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    py: 1.05,
                                  }}
                                >
                                  <Chip
                                    label={
                                      config.label
                                    }
                                    size="small"
                                    sx={{
                                      height: 21,

                                      fontSize:
                                        "0.58rem",

                                      fontWeight:
                                        800,

                                      borderRadius:
                                        999,

                                      bgcolor:
                                        tone.bg,

                                      color:
                                        tone.main,
                                    }}
                                  />
                                </TableCell>

                                <TableCell
                                  sx={{
                                    py: 1.05,

                                    fontSize:
                                      "0.7rem",

                                    fontWeight:
                                      900,

                                    color:
                                      alert.type ===
                                      "out_of_stock"
                                        ? COLORS.danger
                                        : COLORS.warning,
                                  }}
                                >
                                  {alert
                                    .product
                                    ?.current_stock ??
                                    0}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    py: 1.05,

                                    fontSize:
                                      "0.68rem",

                                    color:
                                      COLORS.slate,

                                    fontWeight:
                                      700,
                                  }}
                                >
                                  {alert
                                    .product
                                    ?.minimum_stock ??
                                    alert
                                      .product
                                      ?.reorder_level ??
                                    "N/A"}
                                </TableCell>

                                <TableCell
                                  align="right"
                                  sx={{
                                    py: 1.05,
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      navigate(
                                        "/inventory"
                                      )
                                    }
                                    sx={{
                                      width: 27,
                                      height: 27,

                                      border:
                                        `1px solid ${COLORS.border}`,

                                      color:
                                        COLORS.ocean,

                                      bgcolor:
                                        COLORS.white,

                                      "&:hover":
                                        {
                                          bgcolor:
                                            COLORS.aquaSoft,

                                          transform:
                                            "translateX(2px)",
                                        },

                                      transition:
                                        "all 180ms ease",
                                    }}
                                  >
                                    <ArrowForwardRoundedIcon
                                      sx={{
                                        fontSize: 14,
                                      }}
                                    />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Stack>

          {/* =================================================
              RIGHT COLUMN
              ================================================= */}

          <Stack
            spacing={GAP}
            sx={{
              minWidth: 0,
            }}
          >
            {/* ===============================================
                AI ASSISTANT
                =============================================== */}

            <Card
              sx={{
                ...cardSx,

                background:
                  `linear-gradient(145deg, rgba(255,255,255,0.98), ${COLORS.aquaPale})`,

                animation:
                  `${fadeUp} 600ms 470ms both`,

                ...reduceMotion,
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 1.6,
                    sm: 2,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 1.6,
                      sm: 2,
                    },
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  mb={1.6}
                >
                  <Box
                    sx={{
                      position:
                        "relative",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,

                        bgcolor:
                          COLORS.oceanDark,

                        color:
                          COLORS.white,

                        borderRadius:
                          "12px",

                        boxShadow:
                          "0 7px 18px rgba(16,93,125,0.18)",

                        animation:
                          `${softFloat} 4.5s ease-in-out infinite`,
                      }}
                    >
                      <SmartToyOutlinedIcon
                        sx={{
                          fontSize: 19,
                        }}
                      />
                    </Avatar>

                    <Box
                      sx={{
                        position:
                          "absolute",

                        right: -1,
                        bottom: -1,

                        width: 9,
                        height: 9,

                        borderRadius:
                          "50%",

                        bgcolor:
                          forecastConnected
                            ? COLORS.success
                            : COLORS.warning,

                        border:
                          `2px solid ${COLORS.white}`,
                      }}
                    />
                  </Box>

                  <Box
                    flex={1}
                    minWidth={0}
                  >
                    <Stack
                      direction="row"
                      spacing={0.6}
                      alignItems="center"
                    >
                      <SectionEyebrow>
                        AI assistant
                      </SectionEyebrow>

                      <Chip
                        label={
                          forecastConnected
                            ? "ACTIVE"
                            : "STANDBY"
                        }
                        size="small"
                        sx={{
                          height: 18,

                          borderRadius:
                            999,

                          fontSize:
                            "0.5rem",

                          fontWeight:
                            900,

                          bgcolor:
                            forecastConnected
                              ? COLORS.successSoft
                              : COLORS.warningSoft,

                          color:
                            forecastConnected
                              ? COLORS.success
                              : COLORS.warning,
                        }}
                      />
                    </Stack>

                    <Typography
                      sx={{
                        color:
                          COLORS.slate,

                        fontSize:
                          "0.61rem",

                        fontWeight:
                          600,

                        mt: 0.25,
                      }}
                    >
                      {forecastConnected
                        ? "Forecast + stock recommendations"
                        : "Operations optimization"}
                    </Typography>
                  </Box>

                  <MoreHorizRoundedIcon
                    sx={{
                      color:
                        COLORS.muted,

                      fontSize: 18,
                    }}
                  />
                </Stack>

                {forecastConnected ||
                hasAlerts ? (
                  <Stack spacing={1.5}>
                    {assistantTips.map(
                      ({
                        text,
                        value,
                      }) => (
                        <Box
                          key={text}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={1}
                            mb={0.45}
                          >
                            <Typography
                              sx={{
                                color:
                                  COLORS.ink,

                                fontSize:
                                  "0.63rem",

                                fontWeight:
                                  700,

                                lineHeight:
                                  1.35,
                              }}
                            >
                              {text}
                            </Typography>

                            <Typography
                              sx={{
                                color:
                                  COLORS.ocean,

                                fontSize:
                                  "0.61rem",

                                fontWeight:
                                  900,

                                flexShrink:
                                  0,
                              }}
                            >
                              {value}%
                            </Typography>
                          </Stack>

                          <LinearProgress
                            variant="determinate"
                            value={
                              value
                            }
                            sx={{
                              height: 5,

                              borderRadius:
                                999,

                              bgcolor:
                                COLORS.aquaSoft,

                              "& .MuiLinearProgress-bar":
                                {
                                  borderRadius:
                                    999,

                                  background:
                                    `linear-gradient(90deg, ${COLORS.aqua}, ${COLORS.ocean})`,
                                },
                            }}
                          />
                        </Box>
                      )
                    )}

                    <Button
                      fullWidth
                      size="small"
                      onClick={() =>
                        navigate(
                          "/forecasting"
                        )
                      }
                      endIcon={
                        <ArrowForwardRoundedIcon
                          sx={{
                            fontSize:
                              "14px !important",
                          }}
                        />
                      }
                      sx={{
                        minHeight: 34,

                        mt: 0.2,

                        borderRadius:
                          "10px",

                        textTransform:
                          "none",

                        fontWeight:
                          800,

                        fontSize:
                          "0.65rem",

                        color:
                          COLORS.oceanDark,

                        bgcolor:
                          COLORS.aquaSoft,

                        "&:hover": {
                          bgcolor:
                            COLORS.aqua100 ||
                            "#DFF3F8",
                        },
                      }}
                    >
                      View AI insights
                    </Button>
                  </Stack>
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.55}
                    sx={{
                      py: 2,
                      textAlign:
                        "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,

                        bgcolor:
                          COLORS.aquaSoft,

                        color:
                          COLORS.ocean,

                        mb: 0.3,

                        animation:
                          `${softFloat} 4s ease-in-out infinite`,
                      }}
                    >
                      <PsychologyRoundedIcon
                        sx={{
                          fontSize: 21,
                        }}
                      />
                    </Avatar>

                    <Typography
                      sx={{
                        color:
                          COLORS.ink,

                        fontSize:
                          "0.74rem",

                        fontWeight:
                          800,
                      }}
                    >
                      AI engine is on standby
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          COLORS.slate,

                        fontSize:
                          "0.61rem",

                        maxWidth:
                          240,

                        lineHeight:
                          1.45,
                      }}
                    >
                      Connect forecasting to activate predictive recommendations.
                    </Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        navigate(
                          "/forecasting"
                        )
                      }
                      sx={{
                        mt: 0.6,

                        minHeight: 31,

                        px: 1.5,

                        borderRadius:
                          999,

                        textTransform:
                          "none",

                        fontWeight:
                          800,

                        fontSize:
                          "0.63rem",

                        color:
                          COLORS.ocean,

                        borderColor:
                          COLORS.border,

                        bgcolor:
                          COLORS.white,

                        "&:hover": {
                          borderColor:
                            COLORS.aqua,

                          bgcolor:
                            COLORS.aquaSoft,
                        },
                      }}
                    >
                      Connect AI
                    </Button>
                  </Stack>
                )}
              </CardContent>
            </Card>

            {/* ===============================================
                ACTIVITY FEED
                =============================================== */}

            <Card
              sx={{
                ...cardSx,

                flexGrow: 1,

                animation:
                  `${fadeUp} 600ms 540ms both`,

                ...reduceMotion,
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 1.6,
                    sm: 2,
                  },

                  display:
                    "flex",

                  flexDirection:
                    "column",

                  height: "100%",

                  "&:last-child": {
                    pb: {
                      xs: 1.6,
                      sm: 2,
                    },
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1.2}
                >
                  <Stack
                    direction="row"
                    spacing={0.7}
                    alignItems="center"
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,

                        bgcolor:
                          COLORS.beigeSoft,

                        color:
                          COLORS.warning,

                        borderRadius:
                          "9px",
                      }}
                    >
                      <NotificationsNoneRoundedIcon
                        sx={{
                          fontSize: 15,
                        }}
                      />
                    </Avatar>

                    <SectionEyebrow>
                      Activity feed
                    </SectionEyebrow>
                  </Stack>

                  <Button
                    size="small"
                    onClick={() =>
                      navigate(
                        "/notifications"
                      )
                    }
                    sx={{
                      minWidth: 0,

                      p: 0,

                      textTransform:
                        "none",

                      fontWeight:
                        800,

                      fontSize:
                        "0.63rem",

                      color:
                        COLORS.ocean,
                    }}
                  >
                    View all
                  </Button>
                </Stack>

                <Divider
                  sx={{
                    borderColor:
                      COLORS.border,

                    mb: 0.8,
                  }}
                />

                <Box
                  sx={{
                    overflowY:
                      "auto",

                    maxHeight: 275,

                    pr: 0.3,

                    scrollbarWidth:
                      "thin",

                    scrollbarColor:
                      `${COLORS.aqua} transparent`,

                    "&::-webkit-scrollbar":
                      {
                        width: 4,
                      },

                    "&::-webkit-scrollbar-thumb":
                      {
                        backgroundColor:
                          COLORS.aqua,

                        borderRadius:
                          999,
                      },
                  }}
                >
                  {notifications.length ===
                  0 ? (
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      spacing={0.5}
                      sx={{
                        py: 4.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,

                          bgcolor:
                            COLORS.successSoft,

                          color:
                            COLORS.success,
                        }}
                      >
                        <CheckCircleOutlineRoundedIcon
                          sx={{
                            fontSize: 21,
                          }}
                        />
                      </Avatar>

                      <Typography
                        sx={{
                          color:
                            COLORS.ink,

                          fontSize:
                            "0.74rem",

                          fontWeight:
                            800,

                          mt: 0.3,
                        }}
                      >
                        All caught up
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            COLORS.slate,

                          fontSize:
                            "0.61rem",
                        }}
                      >
                        No new activity.
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack
                      spacing={
                        0.55
                      }
                    >
                      {notifications
                        .slice(
                          0,
                          5
                        )
                        .map(
                          (
                            notification
                          ) => {
                            const config =
                              getAlertConfig(
                                notification.type
                              );

                            return (
                              <Box
                                key={
                                  notification.id
                                }
                                onClick={() =>
                                  navigate(
                                    "/notifications"
                                  )
                                }
                                sx={{
                                  display:
                                    "flex",

                                  gap: 1,

                                  p: 0.9,

                                  borderRadius:
                                    "11px",

                                  cursor:
                                    "pointer",

                                  bgcolor:
                                    notification.read
                                      ? "transparent"
                                      : alpha(
                                          COLORS.ocean,
                                          0.055
                                        ),

                                  transition:
                                    "all 180ms ease",

                                  "&:hover":
                                    {
                                      bgcolor:
                                        COLORS.aquaSoft,

                                      transform:
                                        "translateX(2px)",
                                    },
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: 29,
                                    height: 29,

                                    flexShrink:
                                      0,

                                    bgcolor:
                                      COLORS.aquaSoft,

                                    color:
                                      COLORS.ocean,

                                    borderRadius:
                                      "9px",
                                  }}
                                >
                                  {config.icon}
                                </Avatar>

                                <Box
                                  flex={1}
                                  minWidth={
                                    0
                                  }
                                >
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    spacing={1}
                                  >
                                    <Typography
                                      noWrap
                                      sx={{
                                        color:
                                          COLORS.ink,

                                        fontSize:
                                          "0.64rem",

                                        fontWeight:
                                          notification.read
                                            ? 650
                                            : 850,
                                      }}
                                    >
                                      {
                                        notification.title
                                      }
                                    </Typography>

                                    <Typography
                                      sx={{
                                        color:
                                          COLORS.muted,

                                        fontSize:
                                          "0.54rem",

                                        whiteSpace:
                                          "nowrap",

                                        flexShrink:
                                          0,
                                      }}
                                    >
                                      {getRelativeTime(
                                        notification.createdAt ||
                                          notification.created_at
                                      )}
                                    </Typography>
                                  </Stack>

                                  <Typography
                                    sx={{
                                      color:
                                        COLORS.slate,

                                      fontSize:
                                        "0.59rem",

                                      lineHeight:
                                        1.4,

                                      mt: 0.25,

                                      display:
                                        "-webkit-box",

                                      WebkitLineClamp:
                                        2,

                                      WebkitBoxOrient:
                                        "vertical",

                                      overflow:
                                        "hidden",
                                    }}
                                  >
                                    {
                                      notification.message
                                    }
                                  </Typography>

                                  {notification.product && (
                                    <Typography
                                      sx={{
                                        color:
                                          COLORS.ocean,

                                        fontSize:
                                          "0.55rem",

                                        fontWeight:
                                          800,

                                        mt: 0.4,

                                        display:
                                          "block",
                                      }}
                                    >
                                      Ref:{" "}
                                      {notification
                                        .product
                                        .product_name ||
                                        notification
                                          .product
                                          .name ||
                                        notification
                                          .product
                                          .id}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            );
                          }
                        )}
                    </Stack>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        {/* ==================================================
            BOTTOM STATUS STRIP
            ================================================== */}

        <Card
          elevation={0}
          sx={{
            borderRadius:
              "14px",

            border:
              `1px solid ${COLORS.border}`,

            bgcolor:
              "rgba(255,255,255,0.72)",

            boxShadow:
              "0 3px 15px rgba(16,77,96,0.035)",

            animation:
              `${fadeUp} 600ms 600ms both`,

            ...reduceMotion,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={{
              xs: 1,
              sm: 2,
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            sx={{
              px: {
                xs: 1.4,
                sm: 1.8,
              },

              py: 1.1,
            }}
          >
            <Stack
              direction="row"
              spacing={0.8}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,

                  borderRadius:
                    "50%",

                  bgcolor:
                    COLORS.success,

                  boxShadow:
                    `0 0 0 4px ${alpha(
                      COLORS.success,
                      0.08
                    )}`,
                }}
              />

              <Typography
                sx={{
                  color:
                    COLORS.slate,

                  fontSize:
                    "0.6rem",

                  fontWeight:
                    650,
                }}
              >
                Dashboard services monitored
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1.4}
              flexWrap="wrap"
              useFlexGap
            >
              <Typography
                sx={{
                  color:
                    COLORS.muted,

                  fontSize:
                    "0.58rem",

                  fontWeight:
                    650,
                }}
              >
                Products{" "}
                <Box
                  component="span"
                  sx={{
                    color:
                      COLORS.ocean,

                    fontWeight:
                      850,
                  }}
                >
                  {totalProducts}
                </Box>
              </Typography>

              <Typography
                sx={{
                  color:
                    COLORS.muted,

                  fontSize:
                    "0.58rem",

                  fontWeight:
                    650,
                }}
              >
                Alerts{" "}
                <Box
                  component="span"
                  sx={{
                    color:
                      hasAlerts
                        ? COLORS.danger
                        : COLORS.success,

                    fontWeight:
                      850,
                  }}
                >
                  {alertCount}
                </Box>
              </Typography>

              <Typography
                sx={{
                  color:
                    COLORS.muted,

                  fontSize:
                    "0.58rem",

                  fontWeight:
                    650,
                }}
              >
                AI{" "}
                <Box
                  component="span"
                  sx={{
                    color:
                      forecastConnected
                        ? COLORS.success
                        : COLORS.warning,

                    fontWeight:
                      850,
                  }}
                >
                  {forecastConnected
                    ? "Online"
                    : "Standby"}
                </Box>
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}

export default Dashboard;
