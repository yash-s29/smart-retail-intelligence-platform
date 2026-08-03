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

/* Sections */
import GeneralSection from "../../components/settings/GeneralSection";
import AppearanceSection from "../../components/settings/AppearanceSection";
import NotificationSection from "../../components/settings/NotificationSection";
import SecuritySection from "../../components/settings/SecuritySection";
import AISection from "../../components/settings/AISection";
import DataSection from "../../components/settings/DataSection";
import AboutSection from "../../components/settings/AboutSection";

const createInitialSettings = () => ({
  storeName: "City SuperMart",
  timezone: "Asia/Kolkata",
  currency: "INR",
  language: "en",
  dateFormat: "DD/MM/YYYY",
  theme: "light",
  accent: "#6366F1",
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

    setSnackbar({
      open: true,
      message: t("saveChanges") + " ✓",
      severity: "success",
    });
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
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ width: "100%" }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            mb: 4,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            background: theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(24px)",
            boxShadow: theme.palette.mode === "dark"
              ? "0 20px 50px rgba(2, 6, 23, 0.28)"
              : "0 18px 45px rgba(15, 23, 42, 0.08)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={3}
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight={800}
                gutterBottom
                sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
              >
                {t("settings")}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680 }}>
                {t("settingsDesc")}
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={`${t("theme")}: ${settings.theme === "system" ? t("system") : settings.theme}`} size="small" color="primary" variant="outlined" />
                <Chip label={`${t("language")}: ${settings.language?.toUpperCase() || "EN"}`} size="small" color="secondary" variant="outlined" />
              </Stack>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  borderRadius: 4,
                  px: 4,
                  py: 1.4,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "0 12px 30px rgba(99, 102, 241, 0.28)",
                  "&:hover": {
                    boxShadow: "0 16px 38px rgba(99, 102, 241, 0.35)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {t("saveChanges")}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          {!isMobile ? (
            <Paper
              elevation={0}
              sx={{
                width: 280,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                position: "sticky",
                top: "var(--navbar-height)",
                alignSelf: "flex-start",
                height: "fit-content",
                background: theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.9)
                  : alpha(theme.palette.background.paper, 0.95),
                backdropFilter: "blur(20px)",
              }}
            >
              <List disablePadding>
                {navigation.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItemButton
                      selected={activeTab === item.id}
                      onClick={() => setActiveTab(item.id)}
                      sx={{
                        py: 2.2,
                        px: 3.5,
                        transition: "all 0.2s ease",
                        "&.Mui-selected": {
                          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          color: "white",
                          "& .MuiListItemIcon-root": { color: "white" },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: activeTab === item.id ? "white" : "inherit" }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700 }} />
                    </ListItemButton>
                    {index < navigation.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          ) : (
            <Paper
              sx={{
                mb: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                background: theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.9)
                  : alpha(theme.palette.background.paper, 0.95),
                backdropFilter: "blur(16px)",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                {navigation.map((item) => (
                  <Tab key={item.id} value={item.id} icon={item.icon} iconPosition="start" label={item.label} sx={{ textTransform: "none", fontWeight: 700, py: 2.5 }} />
                ))}
              </Tabs>
            </Paper>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                {currentSection}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Stack>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3, width: "100%", maxWidth: 420 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}