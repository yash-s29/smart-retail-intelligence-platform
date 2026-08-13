import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  alpha,
  keyframes,
  useTheme,
} from "@mui/material/styles";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import TrendingFlatRoundedIcon from "@mui/icons-material/TrendingFlatRounded";

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

  border: "#DDEDF2",
};

const RADIUS = "18px";

// ============================================================
// ANIMATIONS
// ============================================================

const pageEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const softFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
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

const shimmer = keyframes`
  0% {
    transform: translateX(-120%) skewX(-15deg);
  }

  100% {
    transform: translateX(250%) skewX(-15deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.45;
    transform: scale(0.92);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
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
    return new Date(dateString).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "numeric",
      }
    );
  } catch {
    return dateString;
  }
}

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

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
}) {
  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      justifyContent="space-between"
      alignItems={{
        xs: "flex-start",
        sm: "center",
      }}
      spacing={1.5}
    >
      <Stack
        direction="row"
        spacing={1.2}
        alignItems="center"
        minWidth={0}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: "12px",
            bgcolor: COLORS.aquaSoft,
            color: COLORS.primary,
          }}
        >
          <Icon sx={{ fontSize: 20 }} />
        </Avatar>

        <Box minWidth={0}>
          <Typography
            sx={{
              color: COLORS.muted,
              fontSize: "0.68rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              lineHeight: 1.2,
            }}
          >
            {eyebrow}
          </Typography>

          <Typography
            sx={{
              color: COLORS.ink,
              fontSize: {
                xs: "0.95rem",
                sm: "1rem",
              },
              fontWeight: 800,
              mt: 0.35,
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              sx={{
                color: COLORS.slate,
                fontSize: "0.7rem",
                mt: 0.35,
                lineHeight: 1.4,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Stack>

      {action}
    </Stack>
  );
}

// ============================================================
// KPI CARD
// ============================================================

function KpiCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
  onClick,
  delay,
}) {
  return (
    <Card
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (
          onClick &&
          (event.key === "Enter" ||
            event.key === " ")
        ) {
          event.preventDefault();
          onClick();
        }
      }}
      sx={{
        position: "relative",
        height: "100%",
        minHeight: 158,
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",

        borderRadius: RADIUS,
        border: `1px solid ${COLORS.border}`,

        background:
          "linear-gradient(145deg, #FFFFFF 0%, #F9FCFD 100%)",

        boxShadow:
          "0 4px 18px rgba(16,77,96,0.045)",

        animation:
          `${fadeUp} 550ms ${delay}ms both`,

        transition:
          "transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease, border-color .25s ease",

        "&:hover": {
          transform: onClick
            ? "translateY(-5px)"
            : "translateY(-2px)",

          borderColor:
            alpha(tone.main, 0.3),

          boxShadow:
            "0 18px 38px rgba(16,77,96,0.11)",

          "& .kpi-icon": {
            transform:
              "rotate(-5deg) scale(1.08)",
          },

          "& .kpi-arrow": {
            opacity: 1,
            transform: "translateX(0)",
          },

          "& .kpi-shine": {
            animation:
              `${shimmer} 850ms ease`,
          },
        },

        "&:focus-visible": {
          outline:
            `3px solid ${alpha(tone.main, 0.18)}`,
          outlineOffset: 2,
        },

        ...reduceMotion,
      }}
    >
      {/* subtle hover shine */}
      <Box
        className="kpi-shine"
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "25%",
          height: "100%",
          pointerEvents: "none",

          background:
            "linear-gradient(100deg, transparent, rgba(255,255,255,.7), transparent)",

          transform:
            "translateX(-120%) skewX(-15deg)",
        }}
      />

      {/* top accent */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: tone.main,
        }}
      />

      <CardContent
        sx={{
          p: {
            xs: 1.8,
            sm: 2.1,
          },

          "&:last-child": {
            pb: {
              xs: 1.8,
              sm: 2.1,
            },
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              sx={{
                color: COLORS.slate,
                fontSize: "0.72rem",
                fontWeight: 750,
                lineHeight: 1.3,
              }}
            >
              {label}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: tone.main,
                fontSize: {
                  xs: "1.45rem",
                  sm: "1.65rem",
                },
                fontWeight: 900,
                letterSpacing: "-0.045em",
                lineHeight: 1.05,
                wordBreak: "break-word",
              }}
            >
              {value}
            </Typography>
          </Box>

          <Avatar
            className="kpi-icon"
            sx={{
              width: 42,
              height: 42,
              borderRadius: "13px",
              bgcolor: tone.bg,
              color: tone.main,
              border:
                `1px solid ${alpha(tone.main, 0.08)}`,

              transition:
                "transform .25s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </Avatar>
        </Stack>

        <Stack
          direction="row"
          spacing={0.7}
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              flexShrink: 0,
              borderRadius: "50%",
              bgcolor: tone.main,
              animation:
                `${pulse} 3s ease-in-out infinite`,
              ...reduceMotion,
            }}
          />

          <Typography
            sx={{
              flex: 1,
              color: COLORS.slate,
              fontSize: "0.68rem",
              fontWeight: 600,
              lineHeight: 1.35,
            }}
          >
            {description}
          </Typography>

          {onClick && (
            <ArrowForwardRoundedIcon
              className="kpi-arrow"
              sx={{
                fontSize: 18,
                color: tone.main,
                opacity: 0,
                transform: "translateX(-5px)",
                transition:
                  "opacity .2s ease, transform .2s ease",
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ============================================================
// DASHBOARD
// ============================================================

function Dashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================================
  // REDUX
  // ==========================================================

  const {
    inventory = [],
    notifications = [],
    loading: inventoryLoading = false,
  } = useSelector(
    (state) => state.inventory
  );

  // ==========================================================
  // STATE
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
              data?.today_revenue != null ||
              data?.todayRevenue != null
            ) {
              setTodayRevenue(
                data.today_revenue ??
                  data.todayRevenue
              );

              setSalesConnected(true);
              return;
            }

            if (
              data?.total_revenue != null
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
                  (total, row) => {
                    const date =
                      String(
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

                    return date === today
                      ? total + amount
                      : total;
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
  // INITIAL DATA LOAD
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
  // REFRESH EVERYTHING
  // ==========================================================

  const refreshAll =
    useCallback(async () => {
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
    }, [
      dispatch,
      loadProducts,
      loadSalesSummary,
      loadForecast,
    ]);

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

  const getAlertConfig =
    (type) => {
      switch (type) {
        case "out_of_stock":
          return {
            label: "Out of stock",
            tone: {
              main: COLORS.danger,
              bg: COLORS.dangerSoft,
            },
            icon:
              <WarningAmberRoundedIcon />,
          };

        case "low_stock":
          return {
            label: "Low stock",
            tone: {
              main: COLORS.warning,
              bg: COLORS.warningSoft,
            },
            icon:
              <WarningAmberRoundedIcon />,
          };

        case "success":
          return {
            label: "Completed",
            tone: {
              main: COLORS.success,
              bg: COLORS.successSoft,
            },
            icon:
              <CheckCircleRoundedIcon />,
          };

        default:
          return {
            label: "Info",
            tone: {
              main: COLORS.primary,
              bg: COLORS.aquaSoft,
            },
            icon:
              <AutoGraphRoundedIcon />,
          };
      }
    };

  // ==========================================================
  // FORECAST CHART
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

    const history =
      mlData.history || [];

    const forecast =
      mlData.forecast || [];

    const historyTail =
      history.slice(-7);

    const labels = [
      ...historyTail.map((point) =>
        shortDayLabel(point.ds)
      ),

      ...forecast.map((point) =>
        shortDayLabel(point.ds)
      ),
    ];

    const actual = [
      ...historyTail.map((point) =>
        point.y_actual != null
          ? Number(point.y_actual)
          : null
      ),

      ...forecast.map(() => null),
    ];

    const predicted = [
      ...historyTail.map((point) =>
        point.yhat != null
          ? Number(point.yhat)
          : null
      ),

      ...forecast.map(
        (point) =>
          Number(point.yhat) || 0
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
            "rgba(24,121,159,0.08)",

          borderColor:
            COLORS.primary,

          pointBackgroundColor:
            COLORS.white,

          pointBorderColor:
            COLORS.primary,

          pointRadius: 2.5,
          pointHoverRadius: 6,

          borderWidth: 2.4,
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

          pointRadius: 2.5,
          pointHoverRadius: 6,

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

      animation: {
        duration: 900,
        easing: "easeOutQuart",
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
            padding: 16,

            color: COLORS.slate,

            font: {
              family: "inherit",
              size: 11,
              weight: 700,
            },
          },
        },

        tooltip: {
          backgroundColor:
            "rgba(18,49,61,0.96)",

          titleColor:
            COLORS.white,

          bodyColor:
            COLORS.white,

          padding: 12,
          cornerRadius: 10,

          callbacks: {
            label: (context) => {
              const value =
                context.parsed.y;

              if (value == null) {
                return `${context.dataset.label}: —`;
              }

              return `${context.dataset.label}: ${money(
                value
              )}`;
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
              size: 10,
              weight: 600,
            },

            maxRotation: 0,
          },
        },

        y: {
          beginAtZero: true,

          grid: {
            color:
              "rgba(96,121,132,0.08)",
          },

          border: {
            display: false,
          },

          ticks: {
            color: COLORS.muted,

            font: {
              size: 10,
              weight: 600,
            },

            callback: (value) =>
              value >= 1000000
                ? `${(
                    value / 1000000
                  ).toFixed(1)}M`
                : value >= 1000
                ? `${(
                    value / 1000
                  ).toFixed(0)}k`
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
        text: `${alertCount} stock alert${
          alertCount > 1 ? "s" : ""
        } require review.`,
        progress: 92,
        tone: COLORS.warning,
      });
    }

    if (
      forecastConnected &&
      forecastAvg
    ) {
      insights.push({
        title: "Demand outlook available",
        text: `Expected average daily revenue is ${money(
          forecastAvg
        )}.`,
        progress: 86,
        tone: COLORS.primary,
      });
    }

    if (
      forecastConnected &&
      mlData?.recommendation
    ) {
      insights.push({
        title: "Model recommendation",
        text:
          String(
            mlData.recommendation
          ).slice(0, 90) +
          (String(
            mlData.recommendation
          ).length > 90
            ? "…"
            : ""),
        progress: 78,
        tone: COLORS.success,
      });
    }

    if (!insights.length) {
      insights.push({
        title: "AI engine ready",
        text:
          "Connect forecasting data to unlock demand and inventory recommendations.",
        progress: 45,
        tone: COLORS.primary,
      });
    }

    return insights.slice(0, 3);
  }, [
    hasAlerts,
    alertCount,
    forecastConnected,
    forecastAvg,
    mlData,
  ]);

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  const loadingKpis =
    inventoryLoading &&
    !totalProducts;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box
      sx={{
        minHeight: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden",

        bgcolor: COLORS.aquaPale,

        ...reduceMotion,
      }}
    >
      {/* ======================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          width: 320,
          height: 320,
          top: -190,
          right: -100,
          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(103,189,212,.16), transparent 68%)",

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
          width: 260,
          height: 260,
          left: -170,
          top: 420,

          borderRadius: "50%",

          border:
            "1px solid rgba(103,189,212,.12)",

          animation:
            `${spin} 30s linear infinite`,

          pointerEvents: "none",

          ...reduceMotion,
        }}
      />

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <Box
        sx={{
          position: "relative",
          zIndex: 1,

          width: "100%",
          maxWidth: 1540,

          mx: "auto",

          px: {
            xs: 1.5,
            sm: 2.5,
            md: 3,
            lg: 4,
          },

          py: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },

          display: "flex",
          flexDirection: "column",

          gap: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },

          animation:
            `${pageEnter} .55s cubic-bezier(.16,1,.3,1) both`,

          ...reduceMotion,
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          spacing={2}
          sx={{
            animation:
              `${fadeUp} .5s 60ms both`,
            ...reduceMotion,
          }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Typography
                component="h1"
                sx={{
                  color: COLORS.ink,

                  fontWeight: 900,

                  fontSize: {
                    xs: "1.5rem",
                    sm: "1.75rem",
                    md: "2rem",
                  },

                  lineHeight: 1.1,
                  letterSpacing: "-0.045em",
                }}
              >
                Dashboard
              </Typography>

              <Typography
                component="span"
                sx={{
                  fontSize: {
                    xs: "1.1rem",
                    sm: "1.25rem",
                  },

                  animation:
                    `${softFloat} 3s ease-in-out infinite`,
                  ...reduceMotion,
                }}
              >
                👋
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={0.8}
              alignItems="center"
              sx={{ mt: 0.7 }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: COLORS.success,

                  boxShadow:
                    `0 0 0 4px ${alpha(
                      COLORS.success,
                      0.1
                    )}`,

                  animation:
                    `${pulse} 3s ease-in-out infinite`,
                }}
              />

              <Typography
                sx={{
                  color: COLORS.slate,
                  fontSize: {
                    xs: "0.72rem",
                    sm: "0.78rem",
                  },
                  fontWeight: 600,
                }}
              >
                Your retail operations at a glance
              </Typography>
            </Stack>
          </Box>

          {/* PRIMARY ACTIONS */}

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{
              width: {
                xs: "100%",
                md: "auto",
              },
            }}
          >
            <Button
              variant="outlined"
              startIcon={
                <RefreshRoundedIcon
                  sx={{
                    animation: refreshing
                      ? `${spin} .8s linear infinite`
                      : "none",
                  }}
                />
              }
              disabled={refreshing}
              onClick={refreshAll}
              sx={{
                minHeight: 40,
                px: 1.8,

                flex: {
                  xs: 1,
                  sm: "initial",
                },

                borderRadius: "11px",
                borderColor: COLORS.border,

                bgcolor:
                  "rgba(255,255,255,.82)",

                color: COLORS.primaryDark,

                textTransform: "none",
                fontWeight: 750,
                fontSize: "0.75rem",

                transition:
                  "all .2s ease",

                "&:hover": {
                  borderColor:
                    COLORS.aqua,
                  bgcolor:
                    COLORS.white,
                  transform:
                    "translateY(-1px)",
                },
              }}
            >
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </Button>

            <Button
              variant="contained"
              startIcon={
                <FileUploadRoundedIcon />
              }
              onClick={() =>
                navigate("/sales")
              }
              disableElevation
              sx={{
                minHeight: 40,
                px: 2,

                flex: {
                  xs: 1,
                  sm: "initial",
                },

                borderRadius: "11px",

                background:
                  `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,

                color: COLORS.white,

                textTransform: "none",
                fontWeight: 750,
                fontSize: "0.75rem",

                boxShadow:
                  "0 8px 20px rgba(24,121,159,.18)",

                transition:
                  "all .2s ease",

                "&:hover": {
                  background:
                    `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primaryDeep})`,

                  transform:
                    "translateY(-2px)",

                  boxShadow:
                    "0 12px 26px rgba(24,121,159,.25)",
                },
              }}
            >
              Upload Sales
            </Button>
          </Stack>
        </Stack>

        {/* ==================================================
            KPI GRID
        ================================================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },

            gap: {
              xs: 1.5,
              sm: 2,
              md: 2.25,
            },
          }}
        >
          {loadingKpis ? (
            [1, 2, 3, 4].map(
              (item) => (
                <Card
                  key={item}
                  sx={{
                    minHeight: 158,
                    borderRadius: RADIUS,
                    border:
                      `1px solid ${COLORS.border}`,
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Skeleton
                      width="45%"
                      height={18}
                    />
                    <Skeleton
                      width="65%"
                      height={45}
                      sx={{ mt: 1 }}
                    />
                    <Skeleton
                      width="85%"
                      height={18}
                    />
                  </CardContent>
                </Card>
              )
            )
          ) : (
            <>
              <KpiCard
                label="Today's Revenue"
                value={
                  salesConnected
                    ? money(todayRevenue)
                    : "Not connected"
                }
                description={
                  salesConnected
                    ? "Live sales performance"
                    : "Connect sales data"
                }
                icon={
                  TrendingUpRoundedIcon
                }
                tone={{
                  main: COLORS.success,
                  bg: COLORS.successSoft,
                }}
                onClick={() =>
                  navigate("/sales")
                }
                delay={120}
              />

              <KpiCard
                label="Total Products"
                value={totalProducts.toLocaleString()}
                description="Active product catalog"
                icon={
                  LocalOfferRoundedIcon
                }
                tone={{
                  main: COLORS.primary,
                  bg: COLORS.aquaSoft,
                }}
                onClick={() =>
                  navigate("/products")
                }
                delay={180}
              />

              <KpiCard
                label="Stock Alerts"
                value={alertCount}
                description={
                  hasAlerts
                    ? "Needs attention"
                    : "Inventory is healthy"
                }
                icon={
                  Inventory2OutlinedIcon
                }
                tone={
                  hasAlerts
                    ? {
                        main: COLORS.danger,
                        bg: COLORS.dangerSoft,
                      }
                    : {
                        main: COLORS.success,
                        bg: COLORS.successSoft,
                      }
                }
                onClick={() =>
                  navigate("/inventory")
                }
                delay={240}
              />

              <KpiCard
                label="7-Day Forecast"
                value={
                  forecastConnected
                    ? money(forecastTotal)
                    : "Not connected"
                }
                description={
                  forecastConnected
                    ? `${modelType} demand outlook`
                    : "Connect forecasting"
                }
                icon={
                  AutoGraphRoundedIcon
                }
                tone={{
                  main: COLORS.primaryDark,
                  bg: COLORS.aquaSoft,
                }}
                onClick={() =>
                  navigate("/forecasting")
                }
                delay={300}
              />
            </>
          )}
        </Box>

        {/* ==================================================
            FORECAST + OPERATIONS
        ================================================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.7fr) minmax(340px, 1fr)",
            },

            gap: {
              xs: 2,
              md: 2.5,
            },
          }}
        >
          {/* ==================================================
              FORECAST
          ================================================== */}

          <Card
            sx={{
              borderRadius: RADIUS,
              border:
                `1px solid ${COLORS.border}`,

              background:
                "linear-gradient(145deg,#FFFFFF,#FAFDFE)",

              boxShadow:
                "0 6px 22px rgba(16,77,96,.05)",

              animation:
                `${fadeUp} .6s .35s both`,

              ...reduceMotion,
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 1.8,
                  sm: 2.5,
                  md: 2.8,
                },

                "&:last-child": {
                  pb: {
                    xs: 1.8,
                    sm: 2.5,
                    md: 2.8,
                  },
                },
              }}
            >
              <SectionHeader
                eyebrow="Demand intelligence"
                title="Sales & demand forecast"
                description={
                  forecastConnected
                    ? `Live ${modelType} outlook · ${money(
                        forecastAvg
                      )} average daily revenue`
                    : "Use historical sales to understand what comes next"
                }
                icon={
                  AutoGraphRoundedIcon
                }
                action={
                  <Stack
                    direction="row"
                    spacing={0.8}
                    alignItems="center"
                  >
                    {forecastConnected && (
                      <Chip
                        size="small"
                        label="LIVE"
                        sx={{
                          height: 27,
                          borderRadius: 999,

                          bgcolor:
                            COLORS.successSoft,

                          color:
                            COLORS.success,

                          fontWeight: 850,
                          fontSize: "0.62rem",
                        }}
                      />
                    )}

                    <Tooltip title="Refresh forecast">
                      <IconButton
                        onClick={
                          loadForecast
                        }
                        disabled={
                          forecastLoading
                        }
                        size="small"
                        sx={{
                          width: 34,
                          height: 34,

                          border:
                            `1px solid ${COLORS.border}`,

                          color:
                            COLORS.primary,

                          "&:hover": {
                            bgcolor:
                              COLORS.aquaSoft,
                          },
                        }}
                      >
                        <RefreshRoundedIcon
                          sx={{
                            fontSize: 17,
                            animation:
                              forecastLoading
                                ? `${spin} .8s linear infinite`
                                : "none",
                          }}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Open Forecasting">
                      <IconButton
                        onClick={() =>
                          navigate(
                            "/forecasting"
                          )
                        }
                        size="small"
                        sx={{
                          width: 34,
                          height: 34,

                          border:
                            `1px solid ${COLORS.border}`,

                          color:
                            COLORS.primary,

                          "&:hover": {
                            bgcolor:
                              COLORS.aquaSoft,
                            transform:
                              "translateX(2px)",
                          },

                          transition:
                            "all .2s ease",
                        }}
                      >
                        <ArrowForwardRoundedIcon
                          sx={{
                            fontSize: 17,
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              />

              <Box
                sx={{
                  mt: 2.5,

                  height: {
                    xs: 235,
                    sm: 275,
                    md: 300,
                  },

                  position: "relative",
                  width: "100%",
                }}
              >
                {forecastLoading &&
                !mlData ? (
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height="100%"
                    sx={{
                      borderRadius: "14px",
                    }}
                  />
                ) : forecastConnected &&
                  chartData.datasets
                    .length ? (
                  <Line
                    data={chartData}
                    options={chartOptions}
                  />
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.8}
                    sx={{
                      width: "100%",
                      height: "100%",

                      borderRadius: "14px",

                      bgcolor:
                        COLORS.aquaPale,

                      border:
                        `1px dashed ${COLORS.border}`,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 52,
                        height: 52,

                        bgcolor:
                          COLORS.aquaSoft,

                        color:
                          COLORS.primary,

                        animation:
                          `${softFloat} 4s ease-in-out infinite`,
                      }}
                    >
                      <AutoGraphRoundedIcon />
                    </Avatar>

                    <Typography
                      sx={{
                        color: COLORS.ink,
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        mt: 0.4,
                      }}
                    >
                      Forecast not connected
                    </Typography>

                    <Typography
                      sx={{
                        color: COLORS.slate,
                        fontSize: "0.7rem",
                        textAlign: "center",
                        maxWidth: 340,
                        px: 2,
                      }}
                    >
                      Connect the forecasting
                      service to view actual
                      performance and predicted
                      demand in one view.
                    </Typography>

                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          "/forecasting"
                        )
                      }
                      endIcon={
                        <ArrowForwardRoundedIcon />
                      }
                      sx={{
                        mt: 0.6,
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 750,
                        fontSize: "0.7rem",
                        color:
                          COLORS.primary,
                      }}
                    >
                      Open Forecasting
                    </Button>
                  </Stack>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* ==================================================
              AI STORE MANAGER
          ================================================== */}

          <Card
            sx={{
              borderRadius: RADIUS,
              border:
                `1px solid ${COLORS.border}`,

              background:
                `linear-gradient(145deg,#FFFFFF 0%, ${COLORS.aquaPale} 100%)`,

              boxShadow:
                "0 6px 22px rgba(16,77,96,.05)",

              animation:
                `${fadeUp} .6s .42s both`,

              ...reduceMotion,
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 1.8,
                  sm: 2.5,
                },

                "&:last-child": {
                  pb: {
                    xs: 1.8,
                    sm: 2.5,
                  },
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 43,
                        height: 43,
                        borderRadius: "13px",

                        bgcolor:
                          COLORS.primaryDark,

                        color:
                          COLORS.white,

                        boxShadow:
                          "0 8px 20px rgba(16,93,125,.2)",

                        animation:
                          `${softFloat} 4.5s ease-in-out infinite`,
                      }}
                    >
                      <SmartToyRoundedIcon
                        sx={{
                          fontSize: 21,
                        }}
                      />
                    </Avatar>

                    <Box
                      sx={{
                        position: "absolute",
                        right: -1,
                        bottom: -1,

                        width: 10,
                        height: 10,

                        borderRadius: "50%",

                        bgcolor:
                          forecastConnected
                            ? COLORS.success
                            : COLORS.warning,

                        border:
                          `2px solid ${COLORS.white}`,
                      }}
                    />
                  </Box>

                  <Box>
                    <Stack
                      direction="row"
                      spacing={0.7}
                      alignItems="center"
                    >
                      <Typography
                        sx={{
                          color: COLORS.muted,
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.08em",
                        }}
                      >
                        AI Store Manager
                      </Typography>

                      <Chip
                        size="small"
                        label={
                          forecastConnected
                            ? "ACTIVE"
                            : "STANDBY"
                        }
                        sx={{
                          height: 20,
                          borderRadius: 999,

                          bgcolor:
                            forecastConnected
                              ? COLORS.successSoft
                              : COLORS.warningSoft,

                          color:
                            forecastConnected
                              ? COLORS.success
                              : COLORS.warning,

                          fontSize: "0.53rem",
                          fontWeight: 900,
                        }}
                      />
                    </Stack>

                    <Typography
                      sx={{
                        color: COLORS.slate,
                        fontSize: "0.7rem",
                        mt: 0.35,
                      }}
                    >
                      {forecastConnected
                        ? "Business recommendations"
                        : "Predictive engine on standby"}
                    </Typography>
                  </Box>
                </Stack>

                <MoreHorizRoundedIcon
                  sx={{
                    color: COLORS.muted,
                  }}
                />
              </Stack>

              <Divider
                sx={{
                  my: 2,
                  borderColor: COLORS.border,
                }}
              />

              <Stack spacing={1.7}>
                {aiInsights.map(
                  (insight) => (
                    <Box
                      key={
                        insight.title
                      }
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={1}
                        mb={0.55}
                      >
                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              color:
                                COLORS.ink,
                              fontSize:
                                "0.74rem",
                              fontWeight: 800,
                            }}
                          >
                            {
                              insight.title
                            }
                          </Typography>

                          <Typography
                            sx={{
                              color:
                                COLORS.slate,
                              fontSize:
                                "0.67rem",
                              lineHeight: 1.45,
                              mt: 0.25,
                            }}
                          >
                            {
                              insight.text
                            }
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            color:
                              insight.tone,
                            fontSize:
                              "0.68rem",
                            fontWeight: 900,
                            flexShrink: 0,
                          }}
                        >
                          {insight.progress}%
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={
                          insight.progress
                        }
                        sx={{
                          height: 5,
                          borderRadius: 999,

                          bgcolor:
                            COLORS.aquaSoft,

                          "& .MuiLinearProgress-bar":
                            {
                              borderRadius: 999,

                              background:
                                `linear-gradient(90deg, ${COLORS.aqua}, ${insight.tone})`,
                            },
                        }}
                      />
                    </Box>
                  )
                )}
              </Stack>

              <Button
                fullWidth
                onClick={() =>
                  navigate(
                    "/ai-manager"
                  )
                }
                endIcon={
                  <ArrowForwardRoundedIcon />
                }
                sx={{
                  mt: 2.2,
                  minHeight: 38,

                  borderRadius: "10px",

                  bgcolor:
                    COLORS.aquaSoft,

                  color:
                    COLORS.primaryDark,

                  textTransform: "none",

                  fontWeight: 800,
                  fontSize: "0.7rem",

                  "&:hover": {
                    bgcolor:
                      "#DDF3F8",
                    transform:
                      "translateY(-1px)",
                  },

                  transition:
                    "all .2s ease",
                }}
              >
                Open AI Store Manager
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* ==================================================
            INVENTORY ALERTS
        ================================================== */}

        <Card
          sx={{
            borderRadius: RADIUS,
            border:
              `1px solid ${COLORS.border}`,

            background: COLORS.white,

            boxShadow:
              "0 6px 22px rgba(16,77,96,.045)",

            animation:
              `${fadeUp} .6s .5s both`,

            ...reduceMotion,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 1.8,
                sm: 2.5,
              },

              "&:last-child": {
                pb: {
                  xs: 1.8,
                  sm: 2.5,
                },
              },
            }}
          >
            <SectionHeader
              eyebrow="Inventory control"
              title="Stock alerts"
              description={
                hasAlerts
                  ? `${alertCount} product${
                      alertCount > 1
                        ? "s need"
                        : " needs"
                    } attention`
                  : "Your inventory is currently healthy"
              }
              icon={
                Inventory2RoundedIcon
              }
              action={
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Chip
                    size="small"
                    icon={
                      hasAlerts ? (
                        <WarningAmberRoundedIcon />
                      ) : (
                        <CheckCircleRoundedIcon />
                      )
                    }
                    label={
                      hasAlerts
                        ? `${alertCount} alert${
                            alertCount > 1
                              ? "s"
                              : ""
                          }`
                        : "All healthy"
                    }
                    sx={{
                      height: 28,
                      borderRadius: 999,

                      bgcolor:
                        hasAlerts
                          ? COLORS.dangerSoft
                          : COLORS.successSoft,

                      color:
                        hasAlerts
                          ? COLORS.danger
                          : COLORS.success,

                      fontSize: "0.62rem",
                      fontWeight: 850,

                      "& .MuiChip-icon": {
                        color:
                          "inherit",
                        fontSize: 15,
                      },
                    }}
                  />

                  <Button
                    size="small"
                    onClick={() =>
                      navigate(
                        "/inventory"
                      )
                    }
                    endIcon={
                      <ArrowForwardRoundedIcon />
                    }
                    sx={{
                      display: {
                        xs: "none",
                        sm: "inline-flex",
                      },

                      minHeight: 30,
                      borderRadius: 999,

                      textTransform: "none",

                      color:
                        COLORS.primary,

                      fontSize: "0.68rem",
                      fontWeight: 800,
                    }}
                  >
                    View inventory
                  </Button>
                </Stack>
              }
            />

            <Box sx={{ mt: 2 }}>
              {!hasAlerts ? (
                <Box
                  sx={{
                    py: {
                      xs: 3,
                      sm: 4,
                    },

                    borderRadius:
                      "14px",

                    bgcolor:
                      COLORS.successSoft,

                    border:
                      `1px solid ${alpha(
                        COLORS.success,
                        0.12
                      )}`,
                  }}
                >
                  <Stack
                    alignItems="center"
                    spacing={0.7}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,

                        bgcolor:
                          COLORS.white,

                        color:
                          COLORS.success,

                        boxShadow:
                          "0 6px 18px rgba(41,154,102,.12)",

                        animation:
                          `${softFloat} 4s ease-in-out infinite`,
                      }}
                    >
                      <CheckCircleRoundedIcon />
                    </Avatar>

                    <Typography
                      sx={{
                        color: COLORS.ink,
                        fontSize:
                          "0.82rem",
                        fontWeight: 850,
                        mt: 0.4,
                      }}
                    >
                      Inventory looks healthy
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          COLORS.slate,
                        fontSize:
                          "0.68rem",
                      }}
                    >
                      No urgent stock issues detected.
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                <TableContainer
                  sx={{
                    border:
                      `1px solid ${COLORS.border}`,
                    borderRadius:
                      "14px",
                    overflowX: "auto",

                    "&::-webkit-scrollbar":
                      {
                        height: 5,
                      },

                    "&::-webkit-scrollbar-thumb":
                      {
                        background:
                          COLORS.aqua,
                        borderRadius: 999,
                      },
                  }}
                >
                  <Table
                    size="small"
                    sx={{
                      minWidth: 650,
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        {[
                          "Product",
                          "Status",
                          "Current stock",
                          "Minimum",
                          "Action",
                        ].map(
                          (heading) => (
                            <TableCell
                              key={
                                heading
                              }
                              sx={{
                                py: 1.3,

                                bgcolor:
                                  "#F7FBFC",

                                color:
                                  COLORS.slate,

                                borderBottom:
                                  `1px solid ${COLORS.border}`,

                                fontSize:
                                  "0.65rem",

                                fontWeight:
                                  850,

                                textTransform:
                                  "uppercase",

                                letterSpacing:
                                  "0.05em",
                              }}
                            >
                              {heading}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {inventoryAlerts
                        .slice(0, 6)
                        .map((alert) => {
                          const config =
                            getAlertConfig(
                              alert.type
                            );

                          const productName =
                            alert
                              .product
                              ?.product_name ||
                            alert
                              .product
                              ?.name ||
                            "Unknown Product";

                          const currentStock =
                            alert
                              .product
                              ?.current_stock ??
                            0;

                          const minimumStock =
                            alert
                              .product
                              ?.minimum_stock ??
                            alert
                              .product
                              ?.reorder_level ??
                            "—";

                          return (
                            <TableRow
                              key={
                                alert.id
                              }
                              hover
                              sx={{
                                transition:
                                  "background .2s ease",

                                "&:hover": {
                                  bgcolor:
                                    COLORS.aquaPale,
                                },

                                "& td": {
                                  borderBottom:
                                    `1px solid ${COLORS.border}`,
                                },

                                "&:last-child td":
                                  {
                                    borderBottom:
                                      "none",
                                  },
                              }}
                            >
                              <TableCell
                                sx={{
                                  py: 1.5,
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Avatar
                                    sx={{
                                      width: 34,
                                      height: 34,

                                      borderRadius:
                                        "10px",

                                      bgcolor:
                                        COLORS.aquaSoft,

                                      color:
                                        COLORS.primary,
                                    }}
                                  >
                                    <LocalOfferRoundedIcon
                                      sx={{
                                        fontSize: 17,
                                      }}
                                    />
                                  </Avatar>

                                  <Box>
                                    <Typography
                                      sx={{
                                        color:
                                          COLORS.ink,
                                        fontSize:
                                          "0.73rem",
                                        fontWeight:
                                          800,
                                      }}
                                    >
                                      {
                                        productName
                                      }
                                    </Typography>

                                    <Typography
                                      sx={{
                                        color:
                                          COLORS.muted,
                                        fontSize:
                                          "0.61rem",
                                        mt: 0.2,
                                      }}
                                    >
                                      SKU / ID #
                                      {alert
                                        .product
                                        ?.id ||
                                        "N/A"}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </TableCell>

                              <TableCell>
                                <Chip
                                  size="small"
                                  label={
                                    config.label
                                  }
                                  sx={{
                                    height: 25,
                                    borderRadius:
                                      999,

                                    bgcolor:
                                      config
                                        .tone
                                        .bg,

                                    color:
                                      config
                                        .tone
                                        .main,

                                    fontSize:
                                      "0.61rem",

                                    fontWeight:
                                      850,
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <Typography
                                  sx={{
                                    color:
                                      alert.type ===
                                      "out_of_stock"
                                        ? COLORS.danger
                                        : COLORS.warning,

                                    fontSize:
                                      "0.78rem",

                                    fontWeight:
                                      900,
                                  }}
                                >
                                  {
                                    currentStock
                                  }
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Typography
                                  sx={{
                                    color:
                                      COLORS.slate,

                                    fontSize:
                                      "0.72rem",

                                    fontWeight:
                                      700,
                                  }}
                                >
                                  {
                                    minimumStock
                                  }
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Button
                                  size="small"
                                  endIcon={
                                    <ArrowForwardRoundedIcon />
                                  }
                                  onClick={() =>
                                    navigate(
                                      "/inventory"
                                    )
                                  }
                                  sx={{
                                    minHeight: 30,
                                    px: 1.1,

                                    borderRadius:
                                      "8px",

                                    textTransform:
                                      "none",

                                    color:
                                      COLORS.primary,

                                    fontSize:
                                      "0.65rem",

                                    fontWeight:
                                      800,

                                    "&:hover":
                                      {
                                        bgcolor:
                                          COLORS.aquaSoft,
                                      },
                                  }}
                                >
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* ==================================================
            RECENT ACTIVITY
        ================================================== */}

        <Card
          sx={{
            borderRadius: RADIUS,
            border:
              `1px solid ${COLORS.border}`,

            background: COLORS.white,

            boxShadow:
              "0 6px 22px rgba(16,77,96,.04)",

            animation:
              `${fadeUp} .6s .58s both`,

            ...reduceMotion,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 1.8,
                sm: 2.5,
              },

              "&:last-child": {
                pb: {
                  xs: 1.8,
                  sm: 2.5,
                },
              },
            }}
          >
            <SectionHeader
              eyebrow="Recent activity"
              title="What's happening"
              description="Latest operational events across your store"
              icon={
                TrendingFlatRoundedIcon
              }
              action={
                <Button
                  size="small"
                  onClick={() =>
                    navigate(
                      "/notifications"
                    )
                  }
                  sx={{
                    minHeight: 32,
                    px: 1.2,

                    borderRadius: 999,

                    textTransform: "none",

                    color:
                      COLORS.primary,

                    fontSize: "0.68rem",
                    fontWeight: 800,
                  }}
                >
                  View all
                </Button>
              }
            />

            <Divider
              sx={{
                mt: 2,
                mb: 1,
                borderColor:
                  COLORS.border,
              }}
            />

            {notifications.length ===
            0 ? (
              <Box
                sx={{
                  py: 3.5,

                  borderRadius:
                    "14px",

                  bgcolor:
                    COLORS.aquaPale,
                }}
              >
                <Stack
                  alignItems="center"
                  spacing={0.7}
                >
                  <Avatar
                    sx={{
                      width: 46,
                      height: 46,

                      bgcolor:
                        COLORS.successSoft,

                      color:
                        COLORS.success,
                    }}
                  >
                    <CheckCircleRoundedIcon />
                  </Avatar>

                  <Typography
                    sx={{
                      color: COLORS.ink,
                      fontSize:
                        "0.8rem",
                      fontWeight: 800,
                    }}
                  >
                    All caught up
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        COLORS.slate,
                      fontSize:
                        "0.68rem",
                    }}
                  >
                    No recent operational activity.
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                  },

                  gap: 1,
                }}
              >
                {notifications
                  .slice(0, 6)
                  .map(
                    (notification) => {
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
                            display: "flex",
                            gap: 1.1,

                            p: 1.25,

                            borderRadius:
                              "12px",

                            cursor: "pointer",

                            bgcolor:
                              notification.read
                                ? "transparent"
                                : alpha(
                                    COLORS.primary,
                                    0.045
                                  ),

                            border:
                              `1px solid ${
                                notification.read
                                  ? "transparent"
                                  : alpha(
                                      COLORS.primary,
                                      0.08
                                    )
                              }`,

                            transition:
                              "all .2s ease",

                            "&:hover": {
                              bgcolor:
                                COLORS.aquaSoft,

                              transform:
                                "translateY(-2px)",

                              borderColor:
                                COLORS.border,
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              flexShrink: 0,

                              borderRadius:
                                "10px",

                              bgcolor:
                                config
                                  .tone
                                  .bg,

                              color:
                                config
                                  .tone
                                  .main,
                            }}
                          >
                            {config.icon}
                          </Avatar>

                          <Box
                            minWidth={0}
                            flex={1}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              spacing={1}
                            >
                              <Typography
                                noWrap
                                sx={{
                                  color:
                                    COLORS.ink,

                                  fontSize:
                                    "0.7rem",

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
                                    "0.58rem",

                                  whiteSpace:
                                    "nowrap",

                                  flexShrink: 0,
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
                                  "0.63rem",

                                lineHeight:
                                  1.45,

                                mt: 0.35,

                                display:
                                  "-webkit-box",

                                WebkitLineClamp: 2,

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
                                    COLORS.primary,

                                  fontSize:
                                    "0.58rem",

                                  fontWeight:
                                    800,

                                  mt: 0.45,
                                }}
                              >
                                Product:{" "}
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
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Dashboard;
