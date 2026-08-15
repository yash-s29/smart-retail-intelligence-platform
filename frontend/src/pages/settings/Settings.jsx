import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Divider,
  useMediaQuery,
  Alert,
  Snackbar,
  Container,
  Chip,
  alpha,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import PaletteIcon from "@mui/icons-material/Palette";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import InfoIcon from "@mui/icons-material/Info";
import { useThemeContext } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

import GeneralSection from "../../components/settings/GeneralSection";
import AppearanceSection from "../../components/settings/AppearanceSection";
import NotificationSection from "../../components/settings/NotificationSection";
import SecuritySection from "../../components/settings/SecuritySection";
import AISection from "../../components/settings/AISection";
import DataSection from "../../components/settings/DataSection";
import AboutSection from "../../components/settings/AboutSection";

// Default accent is now the sea-water blue used across the whole app
// (Dashboard, Profile). Users can still change it in Appearance.
const createInitialSettings = () => ({
  storeName: "City SuperMart",
  timezone: "Asia/Kolkata",
  currency: "INR",
  language: "en",
  dateFormat: "DD/MM/YYYY",
  theme: "light",
  accent: "#18799F",
  compact: false,
  animations: true,
  glass: true,
  radius: 12,
  fontSize: "medium",
  density: "comfortable",
  contactPhone: "+91 98765 43210",
  contactEmail: "hello@citysupermart.in",
  address: "Shop No. 12, MG Road, Pune, Maharashtra 411001, India",
  emailNotifications: true,
  pushNotifications: true,
  lowStockAlerts: true,
  aiRecommendations: true,
  salesReports: true,
  weeklySummary: true,
  reportFrequency: "daily",
  marketingEmails: false,
  notificationSound: true,
  desktopAlerts: true,
  criticalAlerts: true,
  twoFactor: false,
  sessionTimeout: "30",
  loginAlerts: true,
  rememberDevices: true,
  forecastConfidence: 80,
  autoRestock: true,
  autoReport: true,
  aiManager: false,
  aiAggression: 5,
  autoBackup: true,
  backupFrequency: "daily",
  cloudSync: true,
  retention: "12",
});

export default function Settings() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { setThemeMode, setThemeOptions } = useThemeContext();
  const { t, switchLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState("general");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [settings, setSettings] = useState(() => {
    if (typeof window === "undefined") return createInitialSettings();
    try {
      const saved = localStorage.getItem("app_settings");
      return saved ? { ...createInitialSettings(), ...JSON.parse(saved) } : createInitialSettings();
    } catch (error) {
      console.warn("Unable to load settings", error);
      return createInitialSettings();
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app_settings", JSON.stringify(settings));
    }
  }, [settings]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const themeValue = settings.theme || "light";
    if (themeValue === "system") {
      const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      setThemeMode(systemDark ? "dark" : "light");
      localStorage.setItem("app_theme_pref", "system");
    } else {
      setThemeMode(themeValue);
      localStorage.setItem("app_theme_pref", themeValue);
      localStorage.setItem("app_theme_mode", themeValue);
    }

    if (settings.accent) {
      setThemeOptions({ accent: settings.accent });
    }
    if (typeof settings.radius !== "undefined") {
      setThemeOptions({ radius: settings.radius });
    }
  }, [settings.theme, settings.accent, settings.radius, setThemeMode, setThemeOptions]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = settings.language || "en";
      document.documentElement.style.setProperty(
        "--app-font-scale",
        settings.fontSize === "small" ? "0.95" : settings.fontSize === "large" ? "1.05" : "1"
      );
      localStorage.setItem("app_language", settings.language || "en");
    }
  }, [settings.language, settings.fontSize]);

  const navigation = useMemo(
    () => [
      { id: "general", label: t("general"), icon: <SettingsIcon /> },
      { id: "appearance", label: t("appearance"), icon: <PaletteIcon /> },
      { id: "notifications", label: t("notifications"), icon: <NotificationsIcon /> },
      { id: "security", label: t("security"), icon: <SecurityIcon /> },
      { id: "ai", label: t("aiPreferences"), icon: <SmartToyIcon /> },
      { id: "data", label: t("dataPrivacy"), icon: <StorageIcon /> },
      { id: "about", label: t("about"), icon: <InfoIcon /> },
    ],
    [t]
  );

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app_settings", JSON.stringify(settings));
      localStorage.setItem("app_language", settings.language || "en");
      switchLanguage(settings.language || "en");
    }

    setSnackbar({ open: true, message: t("saveChanges") + " ✓", severity: "success" });
  };

  const currentSection = {
    general: <GeneralSection settings={settings} setSettings={setSettings} />,
    appearance: <AppearanceSection settings={settings} setSettings={setSettings} />,
    notifications: <NotificationSection settings={settings} setSettings={setSettings} />,
    security: <SecuritySection settings={settings} setSettings={setSettings} />,
    ai: <AISection settings={settings} setSettings={setSettings} />,
    data: <DataSection settings={settings} setSettings={setSettings} />,
    about: <AboutSection />,
  }[activeTab];

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100%",
        width: "100%",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      {/* Quiet sea-water + sand ambient texture, page chrome only — not tied to the accent picker */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: theme.palette.mode === "dark" ? 0.5 : 1,
          background: `
            radial-gradient(circle at 6% 0%, ${alpha("#67BDD4", 0.1)}, transparent 26%),
            radial-gradient(circle at 96% 12%, ${alpha("#C9A46A", 0.07)}, transparent 24%)
          `,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 1.75, sm: 2.25, md: 2.75 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5, md: 2.75 },
            mb: { xs: 2, md: 2.5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: theme.palette.primary.main,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)}, ${theme.palette.background.paper})`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <SettingsIcon sx={{ fontSize: 18 }} />
              </motion.div>

              <Box minWidth={0}>
                <Typography
                  component="h1"
                  sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" }, fontWeight: 850, letterSpacing: "-.02em", lineHeight: 1.15 }}
                >
                  {t("settings")}
                </Typography>
                <Typography sx={{ fontSize: ".72rem", color: "text.secondary", mt: 0.15 }}>
                  {t("settingsDesc")}
                </Typography>
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ xs: "stretch", sm: "center" }}>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                <Chip
                  label={`${t("theme")}: ${settings.theme === "system" ? t("system") : settings.theme}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 650, fontSize: ".65rem" }}
                />
                <Chip
                  label={`${t("language")}: ${settings.language?.toUpperCase() || "EN"}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 650, fontSize: ".65rem" }}
                />
              </Stack>

              <Button
                variant="contained"
                size="medium"
                disableElevation
                startIcon={<SaveIcon sx={{ fontSize: 17 }} />}
                onClick={handleSave}
                sx={{
                  borderRadius: "10px",
                  px: 2.5,
                  textTransform: "none",
                  fontWeight: 750,
                  fontSize: ".78rem",
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.24)}`,
                  "&:hover": { boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.3)}`, transform: "translateY(-1px)" },
                }}
              >
                {t("saveChanges")}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 2.5 }}>
          {!isMobile ? (
            <Paper
              elevation={0}
              sx={{
                width: 240,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                position: "sticky",
                top: "var(--navbar-height)",
                alignSelf: "flex-start",
                height: "fit-content",
                bgcolor: "background.paper",
              }}
            >
              <List disablePadding>
                {navigation.map((item, index) => {
                  const selected = activeTab === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <ListItemButton
                        selected={selected}
                        onClick={() => setActiveTab(item.id)}
                        sx={{
                          py: 1.25,
                          px: 2,
                          transition: "background .18s ease",
                          "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.06) },
                          "&.Mui-selected": {
                            bgcolor: theme.palette.primary.main,
                            color: "#fff",
                            "&:hover": { bgcolor: theme.palette.primary.dark },
                            "& .MuiListItemIcon-root": { color: "#fff" },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 34, color: selected ? "#fff" : "primary.main", "& svg": { fontSize: 19 } }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700, fontSize: ".8rem" }} />
                      </ListItemButton>
                      {index < navigation.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ mb: 1, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                {navigation.map((item) => (
                  <Tab
                    key={item.id}
                    value={item.id}
                    icon={item.icon}
                    iconPosition="start"
                    label={item.label}
                    sx={{ textTransform: "none", fontWeight: 700, fontSize: ".76rem", py: 1.5, minHeight: 48 }}
                  />
                ))}
              </Tabs>
            </Paper>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {currentSection}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Stack>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2.5, width: "100%", maxWidth: 380 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
