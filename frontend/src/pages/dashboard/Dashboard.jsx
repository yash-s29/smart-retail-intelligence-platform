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

import {
  alpha,
  keyframes,
  useTheme,
} from "@mui/material/styles";

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
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
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
    transform: translateY(-5px);
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-120%) skewX(-15deg);
  }

  100% {
    transform: translateX(260%) skewX(-15deg);
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

const pulse = keyframes`
  0%, 100% {
    opacity: .55;
    transform: scale(.95);
  }

  50% {
    opacity: 1;
    transform: scale(1);
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
// SHARED CARD
// ============================================================

const cardSx = {
  position: "relative",
  overflow: "hidden",
  height: "100%",
  borderRadius: RADIUS,

  border: `1px solid ${COLORS.border}`,

  background:
    "linear-gradient(145deg, #FFFFFF 0%, #F9FCFD 100%)",

  boxShadow:
    "0 5px 20px rgba(16,77,96,.045)",

  transition:
    "transform .28s cubic-bezier(.16,1,.3,1), box-shadow .28s ease, border-color .28s ease",

  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: alpha(COLORS.primary, 0.22),
    boxShadow:
      "0 18px 42px rgba(16,77,96,.10)",
  },

  ...reduceMotion,
};

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
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
        spacing={1.15}
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
              fontSize: "0.64rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              lineHeight: 1.2,
            }}
          >
            {eyebrow}
          </Typography>

          <Typography
            sx={{
              color: COLORS.ink,
              fontSize: {
                xs: "1rem",
                sm: "1.05rem",
              },
              fontWeight: 850,
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
                fontSize: "0.69rem",
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
  delay = 0,
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
        ...cardSx,
        minHeight: {
          xs: 142,
          sm: 154,
        },

        cursor: onClick ? "pointer" : "default",

        animation:
          `${fadeUp} .55s ${delay}ms both`,

        "&:hover": {
          transform: "translateY(-5px)",
          borderColor: alpha(tone.main, 0.28),
          boxShadow:
            "0 18px 42px rgba(16,77,96,.11)",
        },

        "&:hover .dashboard-kpi-icon": {
          transform:
            "translateY(-2px) scale(1.06) rotate(-4deg)",
        },

        "&:hover .dashboard-kpi-shine": {
          animation:
            `${shimmer} 850ms ease`,
        },

        ...reduceMotion,
      }}
    >
      {/* subtle hover light */}
      <Box
        className="dashboard-kpi-shine"
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          width: "24%",
          pointerEvents: "none",

          background:
            "linear-gradient(100deg, transparent, rgba(255,255,255,.75), transparent)",

          transform:
            "translateX(-120%) skewX(-15deg)",
        }}
      />

      {/* accent line */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          bgcolor: tone.main,
        }}
      />

      <CardContent
        sx={{
          p: {
            xs: 1.8,
            sm: 2.15,
          },

          "&:last-child": {
            pb: {
              xs: 1.8,
              sm: 2.15,
            },
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={1.5}
        >
          <Box
            minWidth={0}
            flex={1}
          >
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
                  sm: "1.7rem",
                },
                fontWeight: 900,
                letterSpacing: "-.045em",
                lineHeight: 1.05,
                overflowWrap: "anywhere",
              }}
            >
              {value}
            </Typography>
          </Box>

          {/* Icon stays in one consistent corner */}
          <Avatar
            className="dashboard-kpi-icon"
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: "13px",
              bgcolor: tone.bg,
              color: tone.main,
              border:
                `1px solid ${alpha(tone.main, .08)}`,

              transition:
                "transform .28s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <Icon sx={{ fontSize: 21 }} />
          </Avatar>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.7}
          sx={{
            mt: 1.9,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: tone.main,
              flexShrink: 0,
              animation:
                `${pulse} 3s ease-in-out infinite`,
            }}
          />

          <Typography
            sx={{
              color: COLORS.slate,
              fontSize: "0.67rem",
              fontWeight: 600,
              lineHeight: 1.35,
              flex: 1,
            }}
          >
            {description}
          </Typography>

          <ArrowForwardRoundedIcon
            sx={{
              fontSize: 17,
              color: tone.main,
              opacity: 0.45,
              flexShrink: 0,
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

// ============================================================
// STOCK ALERT ITEM
// ============================================================

function StockAlertItem({
  alert,
  onClick,
}) {
  const isOut =
    alert.type === "out_of_stock";

  const productName =
    alert.product?.product_name ||
    alert.product?.name ||
    "Unknown Product";

  const productId =
    alert.product?.id ||
    alert.product?.sku ||
    "N/A";

  const currentStock =
    alert.product?.current_stock ?? 0;

  const minimumStock =
    alert.product?.minimum_stock ??
    alert.product?.reorder_level ??
    "—";

  const tone = isOut
    ? {
        main: COLORS.danger,
        bg: COLORS.dangerSoft,
        label: "Out of stock",
      }
    : {
        main: COLORS.warning,
        bg: COLORS.warningSoft,
        label: "Low stock",
      };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "auto minmax(0,1fr) auto",
          sm: "auto minmax(0,1fr) 100px 100px auto",
        },

        alignItems: "center",
        gap: {
          xs: 1.1,
          sm: 1.5,
        },

        p: {
          xs: 1.1,
          sm: 1.25,
        },

        borderRadius: "13px",
        border:
          `1px solid ${alpha(tone.main, .12)}`,

        bgcolor: "#FFFFFF",

        cursor: "pointer",

        transition:
          "transform .2s ease, background .2s ease, box-shadow .2s ease",

        "&:hover": {
          transform: "translateX(3px)",
          bgcolor: tone.bg,
          boxShadow:
            "0 7px 18px rgba(16,77,96,.06)",
        },

        ...reduceMotion,
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          borderRadius: "11px",
          bgcolor: tone.bg,
          color: tone.main,
        }}
      >
        <Inventory2RoundedIcon
          sx={{ fontSize: 18 }}
        />
      </Avatar>

      <Box minWidth={0}>
        <Typography
          noWrap
          sx={{
            color: COLORS.ink,
            fontSize: "0.73rem",
            fontWeight: 800,
          }}
        >
          {productName}
        </Typography>

        <Typography
          noWrap
          sx={{
            color: COLORS.muted,
            fontSize: "0.59rem",
            mt: 0.25,
          }}
        >
          SKU / ID #{productId}
        </Typography>
      </Box>

      <Chip
        label={tone.label}
        size="small"
        sx={{
          display: {
            xs: "none",
            sm: "inline-flex",
          },

          height: 24,
          borderRadius: 999,
          bgcolor: tone.bg,
          color: tone.main,
          fontSize: "0.59rem",
          fontWeight: 800,
        }}
      />

      <Box
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          textAlign: "right",
        }}
      >
        <Typography
          sx={{
            color: tone.main,
            fontSize: "0.73rem",
            fontWeight: 900,
          }}
        >
          {currentStock}
        </Typography>

        <Typography
          sx={{
            color: COLORS.muted,
            fontSize: "0.55rem",
          }}
        >
          min. {minimumStock}
        </Typography>
      </Box>

      <IconButton
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
        sx={{
          width: 30,
          height: 30,
          border:
            `1px solid ${COLORS.border}`,
          color: COLORS.primary,

          "&:hover": {
            bgcolor: COLORS.aquaSoft,
            transform: "translateX(2px)",
          },

          transition:
            "all .2s ease",
        }}
      >
        <ArrowForwardRoundedIcon
          sx={{ fontSize: 16 }}
        />
      </IconButton>
    </Box>
  );
}

// ============================================================
// DASHBOARD
// ============================================================

function Dashboard() {
  const theme = useTheme();
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
            api.get("/sales/summary"),

          () =>
            api.get("/sales/stats"),

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
  // INVENTORY HEALTH
  // ==========================================================

  const inventoryHealth = useMemo(() => {
    if (!totalProducts) {
      return 0;
    }

    if (!hasAlerts) {
      return 100;
    }

    return Math.max(
      15,
      Math.round(
        ((totalProducts - alertCount) /
          totalProducts) *
          100
      )
    );
  }, [
    totalProducts,
    alertCount,
    hasAlerts,
  ]);

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
            "rgba(24,121,159,.08)",

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
            padding: 15,

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
            "rgba(18,49,61,.96)",

          titleColor:
            COLORS.white,

          bodyColor:
            COLORS.white,

          padding: 11,
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
              "rgba(96,121,132,.075)",
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
        title:
          "Inventory attention required",

        text: `${alertCount} stock alert${
          alertCount > 1 ? "s" : ""
        } need review.`,

        progress: 92,
        tone: COLORS.warning,
      });
    }

    if (
      forecastConnected &&
      forecastAvg
    ) {
      insights.push({
        title:
          "Demand outlook available",

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
      const recommendation =
        String(
          mlData.recommendation
        );

      insights.push({
        title:
          "Model recommendation",

        text:
          recommendation.slice(0, 90) +
          (recommendation.length > 90
            ? "…"
            : ""),

        progress: 78,
        tone: COLORS.success,
      });
    }

    if (!insights.length) {
      insights.push({
        title:
          "AI engine ready",

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
  // ACTIVITY
  // Remove inventory alerts from activity because they already
  // appear in the dedicated Stock Alerts component.
  // ==========================================================

  const recentActivity = useMemo(
    () =>
      notifications
        .filter(
          (item) =>
            ![
              "low_stock",
              "out_of_stock",
              "over_stock",
            ].includes(item.type)
        )
        .slice(0, 5),
    [notifications]
  );

  // ==========================================================
  // LOADING
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
        width: "100%",
        minHeight: "100%",
        position: "relative",
        overflow: "hidden",

        bgcolor:
          COLORS.aquaPale,

        // subtle premium background texture
        backgroundImage: `
          linear-gradient(
            180deg,
            rgba(255,255,255,.7),
            rgba(245,251,252,.92)
          ),
          linear-gradient(
            90deg,
            rgba(24,121,159,.025) 1px,
            transparent 1px
          ),
          linear-gradient(
            rgba(24,121,159,.025) 1px,
            transparent 1px
          )
        `,

        backgroundSize:
          "100% 100%, 34px 34px, 34px 34px",

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
          width: 360,
          height: 360,
          top: -220,
          right: -120,
          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(103,189,212,.17), transparent 68%)",

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
          width: 280,
          height: 280,
          left: -180,
          top: 460,

          borderRadius: "50%",

          border:
            "1px solid rgba(103,189,212,.10)",

          transform:
            "rotate(15deg)",

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
        {/* ====================================================
            HEADER
        ==================================================== */}

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
          }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                color: COLORS.ink,
                fontWeight: 900,

                fontSize: {
                  xs: "1.45rem",
                  sm: "1.7rem",
                  md: "1.95rem",
                },

                lineHeight: 1.1,
                letterSpacing: "-.045em",
              }}
            >
              Dashboard
            </Typography>

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
                  bgcolor:
                    COLORS.success,

                  boxShadow:
                    `0 0 0 4px ${alpha(
                      COLORS.success,
                      .1
                    )}`,

                  animation:
                    `${pulse} 3s ease-in-out infinite`,
                }}
              />

              <Typography
                sx={{
                  color: COLORS.slate,
                  fontSize: {
                    xs: ".7rem",
                    sm: ".75rem",
                  },
                  fontWeight: 600,
                }}
              >
                Your retail operations at a glance
              </Typography>
            </Stack>
          </Box>

          {/* Only genuinely useful dashboard actions */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              width: {
                xs: "100%",
                md: "auto",
              },
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <RefreshRoundedIcon
                  sx={{
                    animation:
                      refreshing
                        ? `${spin} .8s linear infinite`
                        : "none",
                  }}
                />
              }
              disabled={refreshing}
              onClick={refreshAll}
              sx={{
                minHeight: 40,
                px: 1.7,

                borderRadius: "11px",
                borderColor: COLORS.border,

                bgcolor:
                  "rgba(255,255,255,.82)",

                color:
                  COLORS.primaryDark,

                textTransform: "none",
                fontWeight: 750,
                fontSize: ".74rem",

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
              fullWidth
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

                borderRadius: "11px",

                background:
                  `linear-gradient(
                    135deg,
                    ${COLORS.primary},
                    ${COLORS.primaryDark}
                  )`,

                color: COLORS.white,

                textTransform: "none",
                fontWeight: 750,
                fontSize: ".74rem",

                boxShadow:
                  "0 8px 20px rgba(24,121,159,.18)",

                transition:
                  "all .2s ease",

                "&:hover": {
                  background:
                    `linear-gradient(
                      135deg,
                      ${COLORS.primaryDark},
                      ${COLORS.primaryDeep}
                    )`,

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

        {/* ====================================================
            KPI CARDS
            Stock Alerts deliberately removed here.
            It already exists as the dedicated operational card.
        ==================================================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0,1fr))",
              lg: "repeat(3, minmax(0,1fr))",
            },

            gap: {
              xs: 1.5,
              sm: 2,
              md: 2.25,
            },
          }}
        >
          {loadingKpis ? (
            [1, 2, 3].map((item) => (
              <Card
                key={item}
                sx={{
                  minHeight: 154,
                  borderRadius: RADIUS,
                  border:
                    `1px solid ${COLORS.border}`,
                }}
              >
                <CardContent sx={{ p: 2.2 }}>
                  <Skeleton
                    width="42%"
                    height={18}
                  />

                  <Skeleton
                    width="62%"
                    height={42}
                    sx={{ mt: 1 }}
                  />

                  <Skeleton
                    width="80%"
                    height={18}
                  />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <KpiCard
                label="Today's Revenue"
                value={
                  salesConnected
                    ? money(todayRevenue)
                    : "—"
                }
                description={
                  salesConnected
                    ? "Live sales performance"
                    : "Sales data unavailable"
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
                delay={100}
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
                delay={160}
              />

              <KpiCard
                label="7-Day Forecast"
                value={
                  forecastConnected
                    ? money(forecastTotal)
                    : "—"
                }
                description={
                  forecastConnected
                    ? `${modelType} demand outlook`
                    : "Forecast unavailable"
                }
                icon={
                  AutoGraphRoundedIcon
                }
                tone={{
                  main:
                    COLORS.primaryDark,
                  bg: COLORS.aquaSoft,
                }}
                onClick={() =>
                  navigate("/forecasting")
                }
                delay={220}
              />
            </>
          )}
        </Box>

        {/* ====================================================
            FORECAST + INVENTORY HEALTH
        ==================================================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.75fr) minmax(300px, .8fr)",
            },

            gap: {
              xs: 2,
              md: 2.5,
            },
          }}
        >
          {/* ================= FORECAST ================= */}

          <Card
            sx={{
              ...cardSx,
              animation:
                `${fadeUp} .6s 300ms both`,
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 1.8,
                  sm: 2.4,
                  md: 2.7,
                },

                "&:last-child": {
                  pb: {
                    xs: 1.8,
                    sm: 2.4,
                    md: 2.7,
                  },
                },
              }}
            >
              <SectionHeader
                icon={
                  AutoGraphRoundedIcon
                }
                eyebrow="Demand intelligence"
                title="Sales & demand forecast"
                description={
                  forecastConnected
                    ? `Live ${modelType} outlook · avg ${money(
                        forecastAvg
                      )}/day`
                    : "Understand historical performance and future demand"
                }
                action={
                  <Stack
                    direction="row"
                    spacing={0.7}
                    alignItems="center"
                  >
                    {forecastConnected && (
                      <Chip
                        size="small"
                        label="LIVE"
                        sx={{
                          height: 25,
                          borderRadius: 999,
                          bgcolor:
                            COLORS.successSoft,
                          color:
                            COLORS.success,
                          fontSize: ".58rem",
                          fontWeight: 850,
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
                          width: 31,
                          height: 31,
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
                            fontSize: 16,
                            animation:
                              forecastLoading
                                ? `${spin} .8s linear infinite`
                                : "none",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              />

              <Box
                sx={{
                  mt: 2.3,

                  height: {
                    xs: 230,
                    sm: 260,
                    md: 285,
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
                  chartData.datasets.length ? (
                  <Line
                    data={chartData}
                    options={
                      chartOptions
                    }
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

                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
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
                        color:
                          COLORS.ink,
                        fontSize: ".8rem",
                        fontWeight: 800,
                      }}
                    >
                      Forecast not connected
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          COLORS.slate,
                        fontSize: ".65rem",
                        maxWidth: 360,
                        lineHeight: 1.5,
                      }}
                    >
                      Connect the forecasting
                      service to view actual
                      performance and predicted
                      demand.
                    </Typography>

                    <Button
                      size="small"
                      endIcon={
                        <ArrowForwardRoundedIcon />
                      }
                      onClick={() =>
                        navigate(
                          "/forecasting"
                        )
                      }
                      sx={{
                        mt: .4,
                        borderRadius: 999,
                        textTransform:
                          "none",
                        fontWeight: 750,
                        fontSize: ".67rem",
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

          {/* ================= INVENTORY HEALTH ================= */}

          <Card
            sx={{
              ...cardSx,
              animation:
                `${fadeUp} .6s 360ms both`,
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 1.8,
                  sm: 2.4,
                },

                "&:last-child": {
                  pb: {
                    xs: 1.8,
                    sm: 2.4,
                  },
                },
              }}
            >
              <SectionHeader
                icon={
                  Inventory2RoundedIcon
                }
                eyebrow="Inventory overview"
                title="Inventory health"
                description="Current stock condition"
              />

              <Box
                sx={{
                  mt: 2.5,
                  p: 2,

                  borderRadius: "15px",

                  background:
                    hasAlerts
                      ? "linear-gradient(145deg,#FFF9F0,#FFFFFF)"
                      : "linear-gradient(145deg,#F0FBF5,#FFFFFF)",

                  border:
                    `1px solid ${
                      hasAlerts
                        ? alpha(
                            COLORS.warning,
                            .14
                          )
                        : alpha(
                            COLORS.success,
                            .14
                          )
                    }`,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      sx={{
                        color:
                          COLORS.slate,
                        fontSize:
                          ".66rem",
                        fontWeight: 700,
                      }}
                    >
                      Stock health
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          hasAlerts
                            ? COLORS.warning
                            : COLORS.success,

                        fontSize:
                          "1.7rem",

                        fontWeight: 900,
                        letterSpacing:
                          "-.04em",

                        mt: .25,
                      }}
                    >
                      {inventoryHealth}%
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "14px",

                      bgcolor:
                        hasAlerts
                          ? COLORS.warningSoft
                          : COLORS.successSoft,

                      color:
                        hasAlerts
                          ? COLORS.warning
                          : COLORS.success,

                      animation:
                        `${softFloat} 4s ease-in-out infinite`,
                    }}
                  >
                    {hasAlerts ? (
                      <WarningAmberRoundedIcon />
                    ) : (
                      <CheckCircleRoundedIcon />
                    )}
                  </Avatar>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={inventoryHealth}
                  sx={{
                    mt: 1.6,
                    height: 7,
                    borderRadius: 999,

                    bgcolor:
                      hasAlerts
                        ? COLORS.warningSoft
                        : COLORS.successSoft,

                    "& .MuiLinearProgress-bar":
                      {
                        borderRadius: 999,

                        background:
                          hasAlerts
                            ? COLORS.warning
                            : COLORS.success,
                      },
                  }}
                />

                <Typography
                  sx={{
                    mt: 1,
                    color:
                      COLORS.slate,
                    fontSize: ".63rem",
                    lineHeight: 1.5,
                  }}
                >
                  {hasAlerts
                    ? `${alertCount} product${
                        alertCount > 1
                          ? "s"
                          : ""
                      } need attention.`
                    : "Inventory is currently healthy."}
                </Typography>
              </Box>

              <Divider
                sx={{
                  my: 2,
                  borderColor:
                    COLORS.border,
                }}
              />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    sx={{
                      color:
                        COLORS.muted,
                      fontSize:
                        ".6rem",
                      fontWeight: 700,
                    }}
                  >
                    PRODUCTS
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        COLORS.ink,
                      fontSize:
                        "1rem",
                      fontWeight: 850,
                      mt: .2,
                    }}
                  >
                    {totalProducts}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    textAlign: "right",
                  }}
                >
                  <Typography
                    sx={{
                      color:
                        COLORS.muted,
                      fontSize:
                        ".6rem",
                      fontWeight: 700,
                    }}
                  >
                    ALERTS
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        hasAlerts
                          ? COLORS.danger
                          : COLORS.success,
                      fontSize:
                        "1rem",
                      fontWeight: 850,
                      mt: .2,
                    }}
                  >
                    {alertCount}
                  </Typography>
                </Box>
              </Stack>

              <Button
                fullWidth
                endIcon={
                  <ArrowForwardRoundedIcon />
                }
                onClick={() =>
                  navigate("/inventory")
                }
                sx={{
                  mt: 2,
                  minHeight: 38,
                  borderRadius: "10px",

                  bgcolor:
                    COLORS.aquaSoft,

                  color:
                    COLORS.primaryDark,

                  textTransform:
                    "none",

                  fontWeight: 800,
                  fontSize: ".68rem",

                  transition:
                    "all .2s ease",

                  "&:hover": {
                    bgcolor:
                      "#DDF3F8",
                    transform:
                      "translateY(-1px)",
                  },
                }}
              >
                Manage inventory
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* ====================================================
            OPERATIONS
        ==================================================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0,1.5fr) minmax(320px,.9fr)",
            },

            gap: {
              xs: 2,
              md: 2.5,
            },
          }}
        >
          {/* ================= STOCK ALERTS ================= */}

          <Card
            sx={{
              ...cardSx,
              animation:
                `${fadeUp} .6s 420ms both`,
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 1.8,
                  sm: 2.3,
                },

                "&:last-child": {
                  pb: {
                    xs: 1.8,
                    sm: 2.3,
                  },
                },
              }}
            >
              <SectionHeader
                icon={
                  hasAlerts
                    ? WarningAmberRoundedIcon
                    : CheckCircleRoundedIcon
                }
                eyebrow="Inventory control"
                title="Stock alerts"
                description={
                  hasAlerts
                    ? `${alertCount} product${
                        alertCount > 1
                          ? "s need"
                          : " needs"
                      } attention`
                    : "No stock issues detected"
                }
                action={
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
                      height: 27,
                      borderRadius: 999,

                      bgcolor:
                        hasAlerts
                          ? COLORS.dangerSoft
                          : COLORS.successSoft,

                      color:
                        hasAlerts
                          ? COLORS.danger
                          : COLORS.success,

                      fontSize: ".6rem",
                      fontWeight: 850,

                      "& .MuiChip-icon": {
                        color:
                          "inherit",
                        fontSize: 15,
                      },
                    }}
                  />
                }
              />

              <Stack
                spacing={1}
                sx={{
                  mt: 2,
                }}
              >
                {!hasAlerts ? (
                  <Box
                    sx={{
                      py: 3.5,
                      px: 2,

                      borderRadius:
                        "14px",

                      bgcolor:
                        COLORS.successSoft,

                      border:
                        `1px solid ${alpha(
                          COLORS.success,
                          .12
                        )}`,
                    }}
                  >
                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      alignItems={{
                        xs: "center",
                        sm: "center",
                      }}
                      justifyContent="center"
                      spacing={1.2}
                      textAlign={{
                        xs: "center",
                        sm: "left",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
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

                      <Box>
                        <Typography
                          sx={{
                            color:
                              COLORS.ink,
                            fontSize:
                              ".78rem",
                            fontWeight:
                              850,
                          }}
                        >
                          Inventory looks healthy
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              COLORS.slate,
                            fontSize:
                              ".64rem",
                            mt: .25,
                          }}
                        >
                          No urgent stock issues detected.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ) : (
                  inventoryAlerts
                    .slice(0, 5)
                    .map((alert) => (
                      <StockAlertItem
                        key={
                          alert.id ||
                          `${alert.type}-${alert.product?.id}`
                        }
                        alert={alert}
                        onClick={() =>
                          navigate(
                            "/inventory"
                          )
                        }
                      />
                    ))
                )}
              </Stack>

              {hasAlerts && (
                <Button
                  fullWidth
                  onClick={() =>
                    navigate("/inventory")
                  }
                  endIcon={
                    <ArrowForwardRoundedIcon />
                  }
                  sx={{
                    mt: 1.5,
                    minHeight: 37,
                    borderRadius:
                      "10px",

                    bgcolor:
                      COLORS.aquaSoft,

                    color:
                      COLORS.primaryDark,

                    textTransform:
                      "none",

                    fontWeight: 800,
                    fontSize: ".67rem",

                    "&:hover": {
                      bgcolor:
                        "#DDF3F8",
                    },
                  }}
                >
                  Review inventory
                </Button>
              )}
            </CardContent>
          </Card>

          {/* ================= AI STORE MANAGER ================= */}

          <Card
            sx={{
              ...cardSx,

              background:
                `linear-gradient(
                  145deg,
                  #FFFFFF 0%,
                  ${COLORS.aquaPale} 100%
                )`,

              animation:
                `${fadeUp} .6s 470ms both`,
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 1.8,
                  sm: 2.3,
                },

                "&:last-child": {
                  pb: {
                    xs: 1.8,
                    sm: 2.3,
                  },
                },
              }}
            >
              <Stack
                direction="row"
                spacing={1.1}
                alignItems="center"
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
                  flex={1}
                  minWidth={0}
                >
                  <Typography
                    sx={{
                      color:
                        COLORS.muted,
                      fontSize:
                        ".64rem",
                      fontWeight: 800,
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        ".08em",
                    }}
                  >
                    AI Store Manager
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        COLORS.slate,
                      fontSize:
                        ".67rem",
                      mt: .3,
                    }}
                  >
                    Business recommendations
                  </Typography>
                </Box>

                <Chip
                  label={
                    forecastConnected
                      ? "ACTIVE"
                      : "STANDBY"
                  }
                  size="small"
                  sx={{
                    height: 21,
                    borderRadius: 999,

                    bgcolor:
                      forecastConnected
                        ? COLORS.successSoft
                        : COLORS.warningSoft,

                    color:
                      forecastConnected
                        ? COLORS.success
                        : COLORS.warning,

                    fontSize: ".51rem",
                    fontWeight: 900,
                  }}
                />
              </Stack>

              <Stack
                spacing={1.35}
                sx={{
                  mt: 2.1,
                }}
              >
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
                        mb={0.45}
                      >
                        <Typography
                          sx={{
                            color:
                              COLORS.ink,
                            fontSize:
                              ".65rem",
                            fontWeight:
                              750,
                            lineHeight:
                              1.35,
                          }}
                        >
                          {insight.title}
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              insight.tone,
                            fontSize:
                              ".6rem",
                            fontWeight:
                              900,
                            flexShrink: 0,
                          }}
                        >
                          {insight.progress}%
                        </Typography>
                      </Stack>

                      <Typography
                        sx={{
                          color:
                            COLORS.slate,
                          fontSize:
                            ".61rem",
                          lineHeight:
                            1.45,
                          mb: .7,
                        }}
                      >
                        {insight.text}
                      </Typography>

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
                              borderRadius:
                                999,

                              background:
                                `linear-gradient(
                                  90deg,
                                  ${COLORS.aqua},
                                  ${insight.tone}
                                )`,
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
                  mt: 2,
                  minHeight: 37,
                  borderRadius:
                    "10px",

                  bgcolor:
                    COLORS.aquaSoft,

                  color:
                    COLORS.primaryDark,

                  textTransform:
                    "none",

                  fontWeight: 800,
                  fontSize: ".67rem",

                  transition:
                    "all .2s ease",

                  "&:hover": {
                    bgcolor:
                      "#DDF3F8",
                    transform:
                      "translateY(-1px)",
                  },
                }}
              >
                Open AI Store Manager
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* ====================================================
            RECENT ACTIVITY
            Inventory alerts are intentionally excluded because
            they already have their own dedicated card above.
        ==================================================== */}

        <Card
          sx={{
            ...cardSx,
            animation:
              `${fadeUp} .6s 540ms both`,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 1.8,
                sm: 2.3,
              },

              "&:last-child": {
                pb: {
                  xs: 1.8,
                  sm: 2.3,
                },
              },
            }}
          >
            <SectionHeader
              icon={
                NotificationsNoneRoundedIcon
              }
              eyebrow="Operations"
              title="Recent activity"
              description="Latest non-inventory operational events"
              action={
                <Button
                  size="small"
                  endIcon={
                    <ArrowForwardRoundedIcon />
                  }
                  onClick={() =>
                    navigate(
                      "/notifications"
                    )
                  }
                  sx={{
                    minHeight: 30,
                    borderRadius:
                      999,

                    textTransform:
                      "none",

                    color:
                      COLORS.primary,

                    fontWeight: 800,
                    fontSize: ".64rem",
                  }}
                >
                  View all
                </Button>
              }
            />

            <Divider
              sx={{
                mt: 2,
                borderColor:
                  COLORS.border,
              }}
            />

            {recentActivity.length ===
            0 ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={0.5}
                sx={{
                  py: 4,
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
                  <CheckCircleRoundedIcon />
                </Avatar>

                <Typography
                  sx={{
                    color:
                      COLORS.ink,
                    fontSize:
                      ".76rem",
                    fontWeight: 800,
                    mt: .3,
                  }}
                >
                  All caught up
                </Typography>

                <Typography
                  sx={{
                    color:
                      COLORS.slate,
                    fontSize:
                      ".62rem",
                  }}
                >
                  No new operational activity.
                </Typography>
              </Stack>
            ) : (
              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0,1fr))",
                    lg: "repeat(3, minmax(0,1fr))",
                  },

                  gap: 1,
                  mt: 1.4,
                }}
              >
                {recentActivity.map(
                  (notification) => (
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

                        p: 1.1,

                        borderRadius:
                          "12px",

                        bgcolor:
                          notification.read
                            ? "#FFFFFF"
                            : alpha(
                                COLORS.primary,
                                .045
                              ),

                        border:
                          `1px solid ${COLORS.border}`,

                        cursor:
                          "pointer",

                        transition:
                          "all .2s ease",

                        "&:hover": {
                          bgcolor:
                            COLORS.aquaSoft,

                          transform:
                            "translateY(-2px)",

                          boxShadow:
                            "0 8px 18px rgba(16,77,96,.06)",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 31,
                          height: 31,
                          flexShrink: 0,
                          borderRadius:
                            "9px",

                          bgcolor:
                            COLORS.aquaSoft,

                          color:
                            COLORS.primary,
                        }}
                      >
                        <TrendingFlatRoundedIcon
                          sx={{
                            fontSize: 17,
                          }}
                        />
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
                                ".64rem",
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
                                ".52rem",
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
                              ".59rem",
                            lineHeight:
                              1.4,
                            mt: .3,

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
                      </Box>
                    </Box>
                  )
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* ====================================================
            SMALL SERVICE STATUS
        ==================================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,

            px: {
              xs: .5,
              sm: 1,
            },

            animation:
              `${fadeUp} .6s 600ms both`,
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
                borderRadius: "50%",
                bgcolor:
                  COLORS.success,

                boxShadow:
                  `0 0 0 4px ${alpha(
                    COLORS.success,
                    .08
                  )}`,
              }}
            />

            <Typography
              sx={{
                color:
                  COLORS.muted,
                fontSize:
                  ".58rem",
                fontWeight: 650,
              }}
            >
              Dashboard services monitored
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            flexWrap="wrap"
            useFlexGap
          >
            <Typography
              sx={{
                color:
                  COLORS.muted,
                fontSize:
                  ".58rem",
                fontWeight: 650,
              }}
            >
              Products{" "}
              <Box
                component="span"
                sx={{
                  color:
                    COLORS.primary,
                  fontWeight: 850,
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
                  ".58rem",
                fontWeight: 650,
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
                  fontWeight: 850,
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
                  ".58rem",
                fontWeight: 650,
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
                  fontWeight: 850,
                }}
              >
                {forecastConnected
                  ? "Online"
                  : "Standby"}
              </Box>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
