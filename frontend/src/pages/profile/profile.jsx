import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { AnimatePresence, motion } from "framer-motion";

import {
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
   Page Animation
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
      staggerChildren: 0.055,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.992,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ============================================================
   Animated Section
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
        amount: 0.08,
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
                ease: "easeOut",
              },
            }
          : undefined
      }
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          ...sx,
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
}

/* ============================================================
   Profile Page
============================================================ */

export default function Profile() {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)"
  );

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
      ["Total Products", dashboard?.total_products ?? 0],
      ["Units Sold", dashboard?.total_units_sold ?? 0],
      ["Revenue", dashboard?.total_sales_amount ?? 0],
      ["Low Stock Alerts", dashboard?.low_stock_alerts ?? 0],
      [
        "Expected Profit (30 days)",
        dashboard?.expected_profit_next_30_days ?? 0,
      ],
    ];

    const csv = rows
      .map((row) =>
        row.map((item) => `"${item}"`).join(",")
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
          backgroundColor: "#f7fbfc",
        }}
      >
        <CircularProgress
          size={30}
          thickness={4}
          sx={{
            color: "#5b9fb3",
          }}
        />
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
    businessCategory: user.business_category || "General",
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
    hours: user.opening_hours || "09:00 AM – 09:00 PM",
  };

  const stats = [
    {
      label: "Products",
      value: String(dashboard?.total_products ?? 0),
      prefix: "",
      color: "blue",
    },

    {
      label: "Units Sold",
      value: String(dashboard?.total_units_sold ?? 0),
      prefix: "",
      color: "green",
    },

    {
      label: "Revenue",
      value:
        dashboard?.total_sales_amount != null
          ? formatCurrency(dashboard.total_sales_amount)
          : "₹0",
      prefix: "",
      color: "indigo",
    },

    {
      label: "Low Stock Alerts",
      value: String(dashboard?.low_stock_alerts ?? 0),
      prefix: "",
      color: "amber",
    },
  ];

  /* ==========================================================
     Login history
  ========================================================== */

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

  const twoFactorEnabled = !!user.two_factor_enabled;

  /* ==========================================================
     Page
  ========================================================== */

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        overflow: "hidden",

        /* ======================================================
           LIGHT SEA-WATER BACKGROUND
        ====================================================== */

        backgroundColor: "#f7fbfc",

        backgroundImage: `
          linear-gradient(
            rgba(59, 130, 160, 0.025) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(59, 130, 160, 0.025) 1px,
            transparent 1px
          )
        `,

        backgroundSize: "30px 30px",

        "@media (prefers-reduced-motion: reduce)": {
          "& .profile-ambient": {
            animation: "none !important",
          },
        },
      }}
    >
      {/* ======================================================
          Ambient background
      ======================================================= */}

      <Box
        className="profile-ambient"
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,

          background: `
            radial-gradient(
              circle at 8% 5%,
              rgba(94, 185, 207, 0.14),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 10%,
              rgba(120, 176, 214, 0.10),
              transparent 25%
            ),
            radial-gradient(
              circle at 50% 100%,
              rgba(225, 204, 173, 0.075),
              transparent 28%
            )
          `,

          animation: prefersReducedMotion
            ? "none"
            : "profileAmbientMove 20s ease-in-out infinite",

          "@keyframes profileAmbientMove": {
            "0%, 100%": {
              transform: "translate3d(0, 0, 0) scale(1)",
            },

            "50%": {
              transform: "translate3d(0, -10px, 0) scale(1.015)",
            },
          },
        }}
      />

      {/* ======================================================
          Floating top-right glow
      ======================================================= */}

      <Box
        className="profile-ambient"
        aria-hidden
        sx={{
          position: "absolute",

          width: {
            xs: 220,
            sm: 320,
            md: 400,
          },

          height: {
            xs: 220,
            sm: 320,
            md: 400,
          },

          borderRadius: "50%",

          top: {
            xs: -150,
            md: -210,
          },

          right: {
            xs: -120,
            md: -150,
          },

          background:
            "radial-gradient(circle, rgba(92,178,199,0.12), rgba(92,178,199,0.025) 50%, transparent 72%)",

          filter: "blur(2px)",

          pointerEvents: "none",

          animation: prefersReducedMotion
            ? "none"
            : "profileFloatOne 10s ease-in-out infinite",

          "@keyframes profileFloatOne": {
            "0%, 100%": {
              transform: "translate(0, 0)",
            },

            "50%": {
              transform: "translate(-12px, 15px)",
            },
          },
        }}
      />

      {/* ======================================================
          Floating lower-left glow
      ======================================================= */}

      <Box
        className="profile-ambient"
        aria-hidden
        sx={{
          position: "absolute",

          width: {
            xs: 180,
            sm: 260,
            md: 320,
          },

          height: {
            xs: 180,
            sm: 260,
            md: 320,
          },

          borderRadius: "50%",

          bottom: -170,
          left: -130,

          background:
            "radial-gradient(circle, rgba(229,211,181,0.13), rgba(229,211,181,0.025) 55%, transparent 72%)",

          pointerEvents: "none",

          animation: prefersReducedMotion
            ? "none"
            : "profileFloatTwo 12s ease-in-out infinite",

          "@keyframes profileFloatTwo": {
            "0%, 100%": {
              transform: "translate(0, 0)",
            },

            "50%": {
              transform: "translate(14px, -10px)",
            },
          },
        }}
      />

      {/* ======================================================
          Main content
      ======================================================= */}

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            position: "relative",

            px: {
              xs: 1.25,
              sm: 2,
              md: 3,
              lg: 3.5,
            },

            py: {
              xs: 1.5,
              sm: 2,
              md: 2.25,
            },
          }}
        >
          {/* ==================================================
              Page heading
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

                gap: 1.5,

                mb: {
                  xs: 1.5,
                  sm: 1.75,
                  md: 2,
                },

                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              {/* Heading */}

              <Box sx={{ minWidth: 0 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.75}
                  sx={{
                    mb: 0.45,
                  }}
                >
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            rotate: [0, -5, 5, 0],
                            y: [0, -2, 0],
                          }
                    }
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Box
                      sx={{
                        width: 29,
                        height: 29,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        borderRadius: "9px",

                        color: "#3d8fa6",

                        background:
                          "linear-gradient(135deg, rgba(91,170,190,0.14), rgba(255,255,255,0.85))",

                        border:
                          "1px solid rgba(91,170,190,0.16)",

                        boxShadow:
                          "0 5px 15px rgba(55,135,155,0.08)",
                      }}
                    >
                      <UserRound size={15} />
                    </Box>
                  </motion.div>

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "0.67rem",
                        sm: "0.7rem",
                      },

                      fontWeight: 800,

                      letterSpacing: "0.13em",

                      textTransform: "uppercase",

                      color: "#72909a",
                    }}
                  >
                    Account
                  </Typography>
                </Stack>

                <Typography
                  component="h1"
                  sx={{
                    fontSize: {
                      xs: "1.3rem",
                      sm: "1.5rem",
                      md: "1.7rem",
                    },

                    lineHeight: 1.15,

                    fontWeight: 800,

                    letterSpacing: "-0.035em",

                    color: "#17343d",
                  }}
                >
                  Profile & Settings
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,

                    fontSize: {
                      xs: "0.75rem",
                      sm: "0.8rem",
                      md: "0.82rem",
                    },

                    lineHeight: 1.5,

                    color: "#70858d",

                    maxWidth: 600,
                  }}
                >
                  Manage your profile, store and account security.
                </Typography>
              </Box>

              {/* ==================================================
                  Account status
              =================================================== */}

              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [0, -2, 0],
                      }
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",

                    alignItems: "center",

                    gap: 0.65,

                    px: 1.2,
                    py: 0.6,

                    borderRadius: "999px",

                    background:
                      "rgba(255,255,255,0.78)",

                    border:
                      "1px solid rgba(65,170,142,0.16)",

                    boxShadow:
                      "0 5px 18px rgba(52,135,125,0.07)",

                    alignSelf: {
                      xs: "flex-start",
                      sm: "center",
                    },
                  }}
                >
                  <CheckCircle2
                    size={14}
                    color="#39a982"
                  />

                  <Typography
                    sx={{
                      fontSize: "0.7rem",

                      fontWeight: 700,

                      color: "#368d73",
                    }}
                  >
                    Account active
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </motion.div>

          {/* ==================================================
              Profile header
          =================================================== */}

          <AnimatedSection
            delay={0.03}
            hover={false}
            sx={{
              mb: {
                xs: 1.5,
                md: 1.75,
              },
            }}
          >
            <ProfileHeader
              user={profileUser}
              onEditClick={() => setModal("edit")}
            />
          </AnimatedSection>

          {/* ==================================================
              Stats
          =================================================== */}

          <AnimatedSection
            delay={0.06}
            hover={false}
            sx={{
              mb: {
                xs: 1.5,
                md: 1.75,
              },
            }}
          >
            <StatsCards stats={stats} />
          </AnimatedSection>

          {/* ==================================================
              Main workspace

              Desktop:
              ┌───────────────────────┬──────────────┐
              │ Personal Information   │ Security     │
              ├───────────────────────┼──────────────┤
              │ Store Information      │ Actions      │
              ├───────────────────────┼──────────────┤
              │ Login History          │ Status       │
              └───────────────────────┴──────────────┘
          =================================================== */}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1.7fr) minmax(300px, 1fr)",
              },

              gap: {
                xs: 1.5,
                sm: 1.75,
                md: 2,
              },

              alignItems: "stretch",
            }}
          >
            {/* Personal information */}

            <AnimatedSection
              delay={0.08}
              sx={{
                height: "100%",
              }}
            >
              <PersonalInfoCard
                user={profileUser}
              />
            </AnimatedSection>

            {/* Security */}

            <AnimatedSection
              delay={0.09}
              sx={{
                height: "100%",
              }}
            >
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

            {/* Store */}

            <AnimatedSection
              delay={0.1}
              sx={{
                height: "100%",
              }}
            >
              <StoreInfoCard
                store={storeInfo}
              />
            </AnimatedSection>

            {/* Account actions */}

            <AnimatedSection
              delay={0.11}
              sx={{
                height: "100%",
              }}
            >
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

            {/* Login history */}

            <AnimatedSection
              delay={0.12}
              sx={{
                height: "100%",
              }}
            >
              <LoginHistoryCard
                logins={logins}
                onSessionsClick={() =>
                  setModal("sessions")
                }
              />
            </AnimatedSection>

            {/* Platform */}

            <AnimatedSection
              delay={0.13}
              sx={{
                height: "100%",
              }}
            >
              <PlatformStatusCard />
            </AnimatedSection>
          </Box>

          {/* ==================================================
              Trust footer
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
                  xs: 1.5,
                  md: 1.75,
                },

                px: {
                  xs: 1.25,
                  sm: 1.75,
                },

                py: 0.9,

                display: "flex",

                alignItems: "center",

                justifyContent: {
                  xs: "flex-start",
                  sm: "center",
                },

                gap: 0.8,

                borderRadius: "11px",

                background:
                  "rgba(255,255,255,0.66)",

                border:
                  "1px solid rgba(91,170,190,0.11)",

                boxShadow:
                  "0 5px 20px rgba(41,91,105,0.035)",

                backdropFilter: "blur(12px)",
              }}
            >
              <ShieldCheck
                size={14}
                color="#48a886"
              />

              <Typography
                sx={{
                  fontSize: {
                    xs: "0.67rem",
                    sm: "0.71rem",
                  },

                  color: "#789098",

                  fontWeight: 600,

                  lineHeight: 1.4,
                }}
              >
                Your account controls are protected by
                Smart Retail Intelligence Platform.
              </Typography>

              {!isMobile && (
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          rotate: [0, 8, -8, 0],
                          y: [0, -1, 0],
                        }
                  }
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles
                    size={12}
                    color="#72aeba"
                    style={{
                      opacity: 0.65,
                    }}
                  />
                </motion.div>
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
      </AnimatePresence>

      {/* ======================================================
          Snackbar
      ======================================================= */}

      <Snackbar
        open={!!alert}
        autoHideDuration={5000}
        onClose={() => setAlert(null)}
        anchorOrigin={{
          vertical: isMobile
            ? "bottom"
            : "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={alert?.severity || "info"}
          onClose={() => setAlert(null)}
          variant="filled"
          sx={{
            minWidth: {
              xs: "calc(100vw - 24px)",
              sm: 360,
            },

            borderRadius: "12px",

            fontWeight: 600,

            boxShadow:
              "0 14px 40px rgba(30,75,88,0.16)",

            backdropFilter: "blur(14px)",
          }}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
