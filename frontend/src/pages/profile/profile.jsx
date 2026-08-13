// src/pages/profile/Profile.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { deleteProfile, updateTwoFactor } from "../../services/userApi";
import { getDashboardReport } from "../../services/reportsApi";

import ProfileHeader from "../../components/profile/ProfileHeader";
import StatsCards from "../../components/profile/StatsCards";
import PersonalInfoCard from "../../components/profile/PersonalInfoCard";
import StoreInfoCard from "../../components/profile/StoreInfoCard";
import LoginHistoryCard from "../../components/profile/LoginHistoryCard";
import SecurityCard from "../../components/profile/SecurityCard";
import AccountActionsCard from "../../components/profile/AccountActionsCard";
import PlatformStatusCard from "../../components/profile/PlatformStatusCard";

import EditProfileDialog from "../../components/profile/EditProfileDialog";
import PasswordDialog from "../../components/profile/PasswordDialog";
import DeleteAccountDialog from "../../components/profile/DeleteAccountDialog";
import ActiveSessionsDialog from "../../components/profile/ActiveSessionsDialog";
import TwoFactorDialog from "../../components/profile/TwoFactorDialog";

/* ============================================================
   Helpers
============================================================ */

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function computeInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "SR"
  );
}

/* ============================================================
   Animation Variants
============================================================ */

const pageVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.985,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ============================================================
   Reusable animated wrapper
============================================================ */

function AnimatedSection({
  children,
  delay = 0,
  sx = {},
  hover = true,
}) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        delay,
      }}
      whileHover={
        hover
          ? {
              y: -2,
              transition: {
                duration: 0.2,
              },
            }
          }
          : undefined
      }
      style={{
        width: "100%",
      }}
    >
      <Box sx={sx}>{children}</Box>
    </motion.div>
  );
}

/* ============================================================
   Component
============================================================ */

export default function Profile() {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { user, ready, refreshProfile, logout } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [modal, setModal] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loaded, setLoaded] = useState(false);

  /* ==========================================================
     Single dashboard fetch
  ========================================================== */

  useEffect(() => {
    if (!ready || !user || loaded) return;

    let cancelled = false;

    (async () => {
      try {
        const report = await getDashboardReport();

        if (!cancelled) {
          setDashboard(report);
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, user, loaded]);

  /* ==========================================================
     Profile update
  ========================================================== */

  const handleProfileSaved = async () => {
    try {
      await refreshProfile();

      const report = await getDashboardReport();

      setDashboard(report);

      setAlert({
        severity: "success",
        message: "Profile updated successfully!",
      });
    } catch {
      setAlert({
        severity: "error",
        message: "Unable to refresh profile.",
      });
    }
  };

  /* ==========================================================
     Password
  ========================================================== */

  const handlePasswordChanged = () => {
    setAlert({
      severity: "success",
      message: "Password updated successfully.",
    });
  };

  /* ==========================================================
     Two factor authentication
  ========================================================== */

  const handleTwoFactorToggle = async (nextEnabled, code) => {
    try {
      await updateTwoFactor({
        enabled: nextEnabled,
        code,
      });

      await refreshProfile();

      setAlert({
        severity: "success",
        message: nextEnabled
          ? "Two-factor authentication enabled."
          : "Two-factor authentication disabled.",
      });
    } catch (err) {
      setAlert({
        severity: "error",
        message:
          err?.response?.data?.detail ||
          "Unable to update two-factor authentication.",
      });

      throw err;
    }
  };

  /* ==========================================================
     Delete account
  ========================================================== */

  const handleDeleteConfirm = async () => {
    try {
      await deleteProfile();

      logout();

      navigate("/login", {
        replace: true,
      });
    } catch (err) {
      setAlert({
        severity: "error",
        message:
          err?.response?.data?.detail ||
          "Unable to delete account.",
      });
    }
  };

  /* ==========================================================
     Download data
  ========================================================== */

  const handleDownloadData = () => {
    if (!user) {
      setAlert({
        severity: "warning",
        message: "User data not available.",
      });

      return;
    }

    const payload = {
      profile: user,
      dashboard: dashboard || {},
      downloadedAt: new Date().toISOString(),
    };

    const blob = new Blob(
      [JSON.stringify(payload, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `srip-data-${
      user.id || "me"
    }-${new Date().toISOString().slice(0, 10)}.json`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    setAlert({
      severity: "success",
      message: "Data downloaded successfully!",
    });
  };

  /* ==========================================================
     Export report
  ========================================================== */

  const handleExportReports = () => {
    if (!dashboard) {
      setAlert({
        severity: "warning",
        message: "No dashboard data available to export.",
      });

      return;
    }

    const rows = [
      ["Metric", "Value"],
      [
        "Total Products",
        dashboard?.total_products ?? 0,
      ],
      [
        "Units Sold",
        dashboard?.total_units_sold ?? 0,
      ],
      [
        "Revenue",
        dashboard?.total_sales_amount ?? 0,
      ],
      [
        "Low Stock Alerts",
        dashboard?.low_stock_alerts ?? 0,
      ],
      [
        "Expected Profit (30 days)",
        dashboard?.expected_profit_next_30_days ?? 0,
      ],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((item) => `"${item}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `srip-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    setAlert({
      severity: "success",
      message: "Reports exported successfully!",
    });
  };

  /* ==========================================================
     Loading
  ========================================================== */

  if (!ready) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  /* ==========================================================
     View models
  ========================================================== */

  const profileUser = {
    initials: computeInitials(user.full_name),
    name: user.full_name,
    email: user.email,
    phone: user.phone || "Not provided",
    location: user.location || "Unknown",
    storeName: user.store_name || "Unnamed Store",
    storeType: user.store_type || "Retail",
    businessCategory:
      user.business_category || "General",
    role: user.role || "Store Owner",
  };

  const storeInfo = {
    name: user.store_name || "Unnamed Store",
    gst: user.gst_number || "Not provided",
    address: user.address || "Not provided",
    city: user.city || "Unknown",
    state: user.state || "Unknown",
    country: user.country || "India",
    pin: user.pincode || "—",
    hours:
      user.opening_hours ||
      "09:00 AM – 09:00 PM",
  };

  const stats = [
    {
      label: "Products",
      value: String(
        dashboard?.total_products ?? 0
      ),
      prefix: "",
      color: "blue",
    },
    {
      label: "Units Sold",
      value: String(
        dashboard?.total_units_sold ?? 0
      ),
      prefix: "",
      color: "green",
    },
    {
      label: "Revenue",
      value:
        dashboard?.total_sales_amount != null
          ? formatCurrency(
              dashboard.total_sales_amount
            )
          : "₹0",
      prefix: "",
      color: "indigo",
    },
    {
      label: "Low Stock Alerts",
      value: String(
        dashboard?.low_stock_alerts ?? 0
      ),
      prefix: "",
      color: "amber",
    },
  ];

  /*
   * NOTE:
   * These remain the same placeholder session records
   * from your original implementation until a real
   * sessions API is available.
   */
  const logins = [
    {
      device: "Chrome · Windows",
      time: "Today, 10:32 AM",
      location: "Mumbai, IN",
      active: true,
    },
    {
      device: "Safari · iPhone",
      time: "Yesterday, 8:15 PM",
      location: "Mumbai, IN",
      active: false,
    },
    {
      device: "Firefox · Mac",
      time: "12 Jun, 2:44 PM",
      location: "Pune, IN",
      active: false,
    },
  ];

  const sessions = logins.map((login) => ({
    device: login.device,
    location: login.location,
    last_active: login.time,
    current: login.active,
  }));

  const twoFactorEnabled =
    !!user.two_factor_enabled;

  /* ==========================================================
     Page
  ========================================================== */

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100%",
        width: "100%",
        overflow: "hidden",

        /* ====================================================
           Premium textured background
        ==================================================== */

        backgroundColor:
          theme.palette.mode === "dark"
            ? "#090d18"
            : "#f6f8fc",

        backgroundImage:
          theme.palette.mode === "dark"
            ? `
              radial-gradient(
                circle at 8% 8%,
                rgba(99,102,241,.13),
                transparent 28%
              ),
              radial-gradient(
                circle at 90% 18%,
                rgba(16,185,129,.07),
                transparent 24%
              ),
              radial-gradient(
                circle at 50% 100%,
                rgba(59,130,246,.06),
                transparent 30%
              ),
              linear-gradient(
                rgba(255,255,255,.018) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.018) 1px,
                transparent 1px
              )
            `
            : `
              radial-gradient(
                circle at 8% 8%,
                rgba(99,102,241,.09),
                transparent 26%
              ),
              radial-gradient(
                circle at 90% 18%,
                rgba(16,185,129,.055),
                transparent 24%
              ),
              radial-gradient(
                circle at 50% 100%,
                rgba(59,130,246,.045),
                transparent 28%
              ),
              linear-gradient(
                rgba(15,23,42,.025) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(15,23,42,.025) 1px,
                transparent 1px
              )
            `,

        backgroundSize:
          "auto, auto, auto, 28px 28px, 28px 28px",

        "&::before": {
          content: '""',
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          top: -250,
          right: -160,

          background:
            theme.palette.mode === "dark"
              ? "rgba(99,102,241,.07)"
              : "rgba(99,102,241,.045)",

          filter: "blur(4px)",
          pointerEvents: "none",
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          bottom: -220,
          left: -160,

          background:
            theme.palette.mode === "dark"
              ? "rgba(16,185,129,.035)"
              : "rgba(16,185,129,.025)",

          filter: "blur(8px)",
          pointerEvents: "none",
        },
      }}
    >
      {/* ======================================================
          Main page animation
      ======================================================= */}

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            zIndex: 1,

            py: {
              xs: 2,
              sm: 2.5,
              md: 3,
              lg: 3.5,
            },

            px: {
              xs: 1.5,
              sm: 2.5,
              md: 3,
              lg: 4,
            },
          }}
        >
          {/* ==================================================
              Compact Page Heading
          =================================================== */}

          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },

                justifyContent: "space-between",

                gap: 2,

                mb: {
                  xs: 2,
                  md: 2.5,
                },

                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 0.5 }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "10px",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      color:
                        theme.palette.primary.main,

                      background:
                        theme.palette.mode ===
                        "dark"
                          ? "rgba(99,102,241,.14)"
                          : "rgba(99,102,241,.09)",

                      border:
                        "1px solid",
                      borderColor:
                        theme.palette.mode ===
                        "dark"
                          ? "rgba(129,140,248,.18)"
                          : "rgba(99,102,241,.12)",
                    }}
                  >
                    <UserRound size={17} />
                  </Box>

                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: ".12em",
                      color:
                        theme.palette.text.secondary,
                    }}
                  >
                    Account
                  </Typography>
                </Stack>

                <Typography
                  component="h1"
                  sx={{
                    fontSize: {
                      xs: "1.45rem",
                      sm: "1.7rem",
                      md: "1.9rem",
                    },

                    lineHeight: 1.15,
                    fontWeight: 800,
                    letterSpacing: "-.035em",

                    color:
                      theme.palette.text.primary,
                  }}
                >
                  Profile & Settings
                </Typography>

                <Typography
                  sx={{
                    mt: 0.65,
                    fontSize: {
                      xs: ".82rem",
                      sm: ".88rem",
                    },

                    color:
                      theme.palette.text.secondary,

                    maxWidth: 620,
                  }}
                >
                  Manage your personal information,
                  store details and account security
                  from one place.
                </Typography>
              </Box>

              {/* Account status */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,

                  px: 1.4,
                  py: 0.8,

                  borderRadius: "999px",

                  background:
                    theme.palette.mode ===
                    "dark"
                      ? "rgba(16,185,129,.08)"
                      : "rgba(16,185,129,.06)",

                  border:
                    "1px solid",
                  borderColor:
                    theme.palette.mode ===
                    "dark"
                      ? "rgba(16,185,129,.18)"
                      : "rgba(16,185,129,.14)",

                  alignSelf: {
                    xs: "flex-start",
                    sm: "center",
                  },
                }}
              >
                <CheckCircle2
                  size={15}
                  color="#10b981"
                />

                <Typography
                  sx={{
                    fontSize: ".76rem",
                    fontWeight: 700,
                    color: "#10b981",
                  }}
                >
                  Account active
                </Typography>
              </Box>
            </Box>
          </motion.div>

          {/* ==================================================
              Profile Header
          =================================================== */}

          <AnimatedSection
            delay={0.03}
            hover={false}
            sx={{
              mb: {
                xs: 2,
                md: 2.5,
              },
            }}
          >
            <ProfileHeader
              user={profileUser}
              onEditClick={() =>
                setModal("edit")
              }
            />
          </AnimatedSection>

          {/* ==================================================
              Statistics
          =================================================== */}

          <AnimatedSection
            delay={0.08}
            hover={false}
            sx={{
              mb: {
                xs: 2,
                md: 2.5,
              },
            }}
          >
            <StatsCards stats={stats} />
          </AnimatedSection>

          {/* ==================================================
              Main Workspace
          =================================================== */}

          <Grid
            container
            spacing={{
              xs: 2,
              md: 2.5,
            }}
            alignItems="flex-start"
          >
            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <Grid item xs={12} lg={8}>
              <Stack
                spacing={{
                  xs: 2,
                  md: 2.5,
                }}
              >
                <AnimatedSection delay={0.1}>
                  <PersonalInfoCard
                    user={profileUser}
                  />
                </AnimatedSection>

                <AnimatedSection delay={0.14}>
                  <StoreInfoCard
                    store={storeInfo}
                  />
                </AnimatedSection>

                <AnimatedSection delay={0.18}>
                  <LoginHistoryCard
                    logins={logins}
                    onSessionsClick={() =>
                      setModal("sessions")
                    }
                  />
                </AnimatedSection>
              </Stack>
            </Grid>

            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <Grid item xs={12} lg={4}>
              <Stack
                spacing={{
                  xs: 2,
                  md: 2.5,
                }}
              >
                <AnimatedSection delay={0.12}>
                  <SecurityCard
                    onPasswordClick={() =>
                      setModal("password")
                    }
                    onTwoFactorClick={() =>
                      setModal("2fa")
                    }
                    onSessionsClick={() =>
                      setModal("sessions")
                    }
                    twoFactorEnabled={
                      twoFactorEnabled
                    }
                  />
                </AnimatedSection>

                <AnimatedSection delay={0.16}>
                  <AccountActionsCard
                    onDownloadClick={
                      handleDownloadData
                    }
                    onExportClick={
                      handleExportReports
                    }
                    onDeleteClick={() =>
                      setModal("delete")
                    }
                  />
                </AnimatedSection>

                <AnimatedSection delay={0.2}>
                  <PlatformStatusCard />
                </AnimatedSection>
              </Stack>
            </Grid>
          </Grid>

          {/* ==================================================
              Bottom trust strip
          =================================================== */}

          <motion.div
            variants={itemVariants}
            style={{
              width: "100%",
            }}
          >
            <Box
              sx={{
                mt: {
                  xs: 2.5,
                  md: 3,
                },

                px: {
                  xs: 1.5,
                  sm: 2,
                },

                py: 1.25,

                display: "flex",
                alignItems: "center",
                justifyContent: {
                  xs: "flex-start",
                  sm: "center",
                },

                gap: 1,

                borderRadius: "12px",

                background:
                  theme.palette.mode ===
                  "dark"
                    ? "rgba(255,255,255,.025)"
                    : "rgba(255,255,255,.55)",

                border:
                  "1px solid",
                borderColor:
                  theme.palette.divider,

                backdropFilter: "blur(12px)",
              }}
            >
              <ShieldCheck
                size={16}
                color={
                  theme.palette.success.main
                }
              />

              <Typography
                sx={{
                  fontSize: {
                    xs: ".72rem",
                    sm: ".76rem",
                  },

                  color:
                    theme.palette.text.secondary,

                  fontWeight: 600,
                }}
              >
                Your profile and account
                controls are protected by
                Smart Retail Intelligence
                Platform.
              </Typography>

              {!isMobile && (
                <Sparkles
                  size={14}
                  style={{
                    opacity: 0.55,
                  }}
                />
              )}
            </Box>
          </motion.div>
        </Container>
      </motion.div>

      {/* ======================================================
          Modals
      ======================================================= */}

      <AnimatePresence>
        {modal === "edit" && (
          <EditProfileDialog
            open
            onClose={() => setModal(null)}
            user={user}
            onSaved={handleProfileSaved}
          />
        )}

        {modal === "password" && (
          <PasswordDialog
            open
            onClose={() => setModal(null)}
            onSaved={handlePasswordChanged}
          />
        )}

        {modal === "delete" && (
          <DeleteAccountDialog
            open
            onClose={() => setModal(null)}
            onConfirm={handleDeleteConfirm}
          />
        )}

        {modal === "sessions" && (
          <ActiveSessionsDialog
            open
            onClose={() => setModal(null)}
            sessions={sessions}
          />
        )}

        {modal === "2fa" && (
          <TwoFactorDialog
            open
            onClose={() => setModal(null)}
            enabled={twoFactorEnabled}
            onToggle={handleTwoFactorToggle}
          />
        )}
      </AnimatePresence>

      {/* ======================================================
          Global Snackbar
      ======================================================= */}

      <Snackbar
        open={!!alert}
        autoHideDuration={5000}
        onClose={() => setAlert(null)}
        anchorOrigin={{
          vertical: isMobile ? "bottom" : "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={
            alert?.severity || "info"
          }
          onClose={() => setAlert(null)}
          variant="filled"
          sx={{
            minWidth: {
              xs: "calc(100vw - 32px)",
              sm: 360,
            },

            borderRadius: "12px",

            fontWeight: 600,

            boxShadow:
              "0 14px 40px rgba(15,23,42,.18)",

            backdropFilter: "blur(14px)",
          }}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
