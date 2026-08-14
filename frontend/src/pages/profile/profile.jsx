// src/pages/profile/Profile.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, CircularProgress, Container, Snackbar, Stack, Typography, useMediaQuery } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

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

import { COLORS } from "../../components/profile/shared";

/* ============================================================
   Helpers
============================================================ */

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function computeInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "SR";
}

/* ============================================================
   Page-level motion
============================================================ */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/* ============================================================
   Component
============================================================ */

export default function Profile() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const { user, ready, refreshProfile, logout } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [modal, setModal] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loaded, setLoaded] = useState(false);

  /* ---------------------------------------------------------- */

  useEffect(() => {
    if (!ready || !user || loaded) return;

    let cancelled = false;

    (async () => {
      try {
        const report = await getDashboardReport();
        if (!cancelled) setDashboard(report);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, user, loaded]);

  const handleProfileSaved = async () => {
    try {
      await refreshProfile();
      const report = await getDashboardReport();
      setDashboard(report);
      setAlert({ severity: "success", message: "Profile updated successfully!" });
    } catch {
      setAlert({ severity: "error", message: "Unable to refresh profile." });
    }
  };

  const handlePasswordChanged = () => {
    setAlert({ severity: "success", message: "Password updated successfully." });
  };

  const handleTwoFactorToggle = async (nextEnabled, code) => {
    try {
      await updateTwoFactor({ enabled: nextEnabled, code });
      await refreshProfile();
      setAlert({
        severity: "success",
        message: nextEnabled ? "Two-factor authentication enabled." : "Two-factor authentication disabled.",
      });
    } catch (err) {
      setAlert({
        severity: "error",
        message: err?.response?.data?.detail || "Unable to update two-factor authentication.",
      });
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProfile();
      logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setAlert({ severity: "error", message: err?.response?.data?.detail || "Unable to delete account." });
    }
  };

  const handleDownloadData = () => {
    if (!user) {
      setAlert({ severity: "warning", message: "User data not available." });
      return;
    }

    const payload = { profile: user, dashboard: dashboard || {}, downloadedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `srip-data-${user.id || "me"}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setAlert({ severity: "success", message: "Data downloaded successfully!" });
  };

  const handleExportReports = () => {
    if (!dashboard) {
      setAlert({ severity: "warning", message: "No dashboard data available to export." });
      return;
    }

    const rows = [
      ["Metric", "Value"],
      ["Total Products", dashboard?.total_products ?? 0],
      ["Units Sold", dashboard?.total_units_sold ?? 0],
      ["Revenue", dashboard?.total_sales_amount ?? 0],
      ["Low Stock Alerts", dashboard?.low_stock_alerts ?? 0],
      ["Expected Profit (30 days)", dashboard?.expected_profit_next_30_days ?? 0],
    ];

    const csv = rows.map((row) => row.map((item) => `"${item}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `srip-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setAlert({ severity: "success", message: "Reports exported successfully!" });
  };

  /* ---------------------------------------------------------- */

  if (!ready) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: COLORS.aquaPale }}>
        <CircularProgress size={30} thickness={4} sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

  if (!user) return null;

  /* ---------------------------------------------------------- */

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
    { label: "Products", value: String(dashboard?.total_products ?? 0), prefix: "", color: "blue" },
    { label: "Units Sold", value: String(dashboard?.total_units_sold ?? 0), prefix: "", color: "green" },
    {
      label: "Revenue",
      value: dashboard?.total_sales_amount != null ? formatCurrency(dashboard.total_sales_amount) : "₹0",
      prefix: "",
      color: "indigo",
    },
    { label: "Low Stock Alerts", value: String(dashboard?.low_stock_alerts ?? 0), prefix: "", color: "amber" },
  ];

  const logins = [
    { device: "Chrome · Windows", time: "Today, 10:32 AM", location: "Mumbai, IN", active: true },
    { device: "Safari · iPhone", time: "Yesterday, 8:15 PM", location: "Mumbai, IN", active: false },
    { device: "Firefox · Mac", time: "12 Jun, 2:44 PM", location: "Pune, IN", active: false },
  ];

  const sessions = logins.map((login) => ({
    device: login.device,
    location: login.location,
    last_active: login.time,
    current: login.active,
  }));

  const twoFactorEnabled = !!user.two_factor_enabled;

  /* ---------------------------------------------------------- */

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        overflow: "hidden",

        bgcolor: COLORS.aquaPale,

        backgroundImage: `
          linear-gradient(${COLORS.primary}0A 1px, transparent 1px),
          linear-gradient(90deg, ${COLORS.primary}0A 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px",

        "@media (prefers-reduced-motion: reduce)": {
          "& .profile-ambient": { animation: "none !important" },
        },
      }}
    >
      {/* Ambient sea-water glows — sand + aqua, slow drift only */}
      <Box
        className="profile-ambient"
        aria-hidden
        sx={{
          position: "absolute",
          width: { xs: 260, md: 380 },
          height: { xs: 260, md: 380 },
          borderRadius: "50%",
          top: { xs: -160, md: -210 },
          right: { xs: -120, md: -150 },
          zIndex: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle, ${COLORS.aqua}26, ${COLORS.aqua}05 55%, transparent 72%)`,
          animation: prefersReducedMotion ? "none" : "profileFloatA 10s ease-in-out infinite",
          "@keyframes profileFloatA": {
            "0%,100%": { transform: "translate(0,0)" },
            "50%": { transform: "translate(-12px, 14px)" },
          },
        }}
      />

      <Box
        className="profile-ambient"
        aria-hidden
        sx={{
          position: "absolute",
          width: { xs: 200, md: 300 },
          height: { xs: 200, md: 300 },
          borderRadius: "50%",
          bottom: -160,
          left: -130,
          zIndex: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle, ${COLORS.sand}22, ${COLORS.sand}05 55%, transparent 72%)`,
          animation: prefersReducedMotion ? "none" : "profileFloatB 12s ease-in-out infinite",
          "@keyframes profileFloatB": {
            "0%,100%": { transform: "translate(0,0)" },
            "50%": { transform: "translate(13px, -10px)" },
          },
        }}
      />

      <motion.div variants={pageVariants} initial="hidden" animate="visible" style={{ position: "relative", zIndex: 1 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 1.25, sm: 2, md: 3, lg: 3.5 }, py: { xs: 1.5, sm: 1.85, md: 2.1 } }}>
          {/* ============================ Heading ============================ */}

          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 1.5,
                mb: { xs: 1.5, sm: 1.75 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.3 }}>
                  {/* "Wheel" — a slow continuous rotation, the only spinning element on the page */}
                  <motion.div
                    animate={prefersReducedMotion ? {} : { rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.primary,
                      background: `linear-gradient(135deg, ${COLORS.primary}22, ${COLORS.white})`,
                      border: `1px solid ${COLORS.primary}2A`,
                    }}
                  >
                    <PersonRoundedIcon sx={{ fontSize: 14 }} />
                  </motion.div>

                  <Typography sx={{ fontSize: ".66rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: COLORS.muted }}>
                    Account
                  </Typography>
                </Stack>

                <Typography
                  component="h1"
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.45rem", md: "1.6rem" }, lineHeight: 1.15, fontWeight: 850, letterSpacing: "-.03em", color: COLORS.ink }}
                >
                  Profile & settings
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.6,
                  px: 1.2,
                  py: 0.55,
                  borderRadius: 999,
                  bgcolor: COLORS.successSoft,
                  border: `1px solid ${COLORS.success}26`,
                  alignSelf: { xs: "flex-start", sm: "center" },
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 14, color: COLORS.success }} />
                <Typography sx={{ fontSize: ".68rem", fontWeight: 750, color: COLORS.success }}>Account active</Typography>
              </Box>
            </Box>
          </motion.div>

          {/* ============================ Header ============================ */}

          <Box sx={{ mb: { xs: 1.5, md: 1.75 } }}>
            <ProfileHeader user={profileUser} onEditClick={() => setModal("edit")} />
          </Box>

          {/* ============================ Stats ============================ */}

          <Box sx={{ mb: { xs: 1.5, md: 1.75 } }}>
            <StatsCards stats={stats} />
          </Box>

          {/* ============================ Workspace ============================
              Row-paired grid: Personal Info ↔ Security, Store Info ↔ Account
              Actions, Login History ↔ Platform Status.
          =================================================================== */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.7fr 1fr" },
              gap: { xs: 1.25, md: 1.5 },
              alignItems: "stretch",
            }}
          >
            <PersonalInfoCard user={profileUser} />
            <SecurityCard
              onPasswordClick={() => setModal("password")}
              onTwoFactorClick={() => setModal("2fa")}
              onSessionsClick={() => setModal("sessions")}
              twoFactorEnabled={twoFactorEnabled}
            />

            <StoreInfoCard store={storeInfo} />
            <AccountActionsCard
              onDownloadClick={handleDownloadData}
              onExportClick={handleExportReports}
              onDeleteClick={() => setModal("delete")}
            />

            <LoginHistoryCard logins={logins} onSessionsClick={() => setModal("sessions")} />
            <PlatformStatusCard />
          </Box>

          {/* ============================ Trust footer ============================ */}

          <motion.div variants={itemVariants} style={{ width: "100%" }}>
            <Box
              sx={{
                mt: { xs: 1.5, md: 1.75 },
                px: { xs: 1.25, sm: 1.75 },
                py: 0.85,
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "flex-start", sm: "center" },
                gap: 0.75,
                borderRadius: "11px",
                bgcolor: "rgba(255,255,255,.7)",
                border: `1px solid ${COLORS.border}`,
                backdropFilter: "blur(10px)",
              }}
            >
              <ShieldRoundedIcon sx={{ fontSize: 14, color: COLORS.success }} />
              <Typography sx={{ fontSize: { xs: ".65rem", sm: ".69rem" }, color: COLORS.slate, fontWeight: 600 }}>
                Protected by Smart Retail Intelligence Platform.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </motion.div>

      {/* ============================ Modals ============================ */}

      <AnimatePresence>
        {modal === "edit" && (
          <EditProfileDialog open onClose={() => setModal(null)} user={user} onSaved={handleProfileSaved} />
        )}

        {modal === "password" && (
          <PasswordDialog open onClose={() => setModal(null)} onSaved={handlePasswordChanged} />
        )}

        {modal === "delete" && (
          <DeleteAccountDialog open onClose={() => setModal(null)} onConfirm={handleDeleteConfirm} />
        )}

        {modal === "sessions" && (
          <ActiveSessionsDialog open onClose={() => setModal(null)} sessions={sessions} />
        )}
      </AnimatePresence>

      {/* ============================ Snackbar ============================ */}

      <Snackbar
        open={!!alert}
        autoHideDuration={5000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: isMobile ? "bottom" : "top", horizontal: "center" }}
      >
        <Alert
          severity={alert?.severity || "info"}
          onClose={() => setAlert(null)}
          variant="filled"
          sx={{
            minWidth: { xs: "calc(100vw - 24px)", sm: 340 },
            borderRadius: "12px",
            fontWeight: 650,
            boxShadow: "0 14px 36px rgba(16,77,96,.2)",
          }}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
