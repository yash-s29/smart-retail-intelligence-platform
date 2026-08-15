import React from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { Box, Grid, Typography, Stack, IconButton, alpha, useTheme } from "@mui/material";
import { LightMode, DarkMode, DesktopWindows, Check } from "@mui/icons-material";
import SectionCard from "../common/SectionCard";
import SettingRow from "../common/SettingRow";
import ToggleSwitch from "../common/ToggleSwitch";
import SelectField from "../common/SelectField";
import RangeSlider from "../common/RangeSlider";

const THEMES = [
  { id: "light", label: "Light", icon: LightMode },
  { id: "dark", label: "Dark", icon: DarkMode },
  { id: "system", label: "System", icon: DesktopWindows },
];

// Sea-water blue leads the swatch list; the rest stay available for variety.
const COLORS = ["#18799F", "#105D7D", "#67BDD4", "#299A66", "#C98221", "#D65B5B", "#8B5CF6", "#3B82F6"];

export default function AppearanceSection({ settings, setSettings }) {
  const { t } = useLanguage();
  const theme = useTheme();
  const updateValue = (field, value) => setSettings((prev) => ({ ...prev, [field]: value }));
  const { setThemeMode, setThemeOptions } = useThemeContext();

  // Logic unchanged — this is the app's real dark-mode switch, not a styling choice.
  const handleThemeSelect = (value) => {
    updateValue("theme", value);
    if (value === "system") {
      const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      setThemeMode(systemDark ? "dark" : "light");
      try {
        localStorage.setItem("app_theme_pref", "system");
      } catch (e) {}
    } else {
      setThemeMode(value);
      try {
        localStorage.setItem("app_theme_pref", value);
      } catch (e) {}
      try {
        localStorage.setItem("app_theme_mode", value);
      } catch (e) {}
    }
  };

  return (
    <Stack spacing={2.5}>
      <SectionCard title={t("appearance")} subtitle={t("appearanceDesc")}>
        <Typography sx={{ mb: 1.5, fontSize: ".72rem", fontWeight: 700, color: "text.secondary" }}>
          {t("theme")}
        </Typography>

        <Grid container spacing={1.5}>
          {THEMES.map((themeOption) => {
            const Icon = themeOption.icon;
            const selected = settings.theme === themeOption.id;
            return (
              <Grid item xs={12} sm={4} key={themeOption.id}>
                <Box
                  onClick={() => handleThemeSelect(themeOption.id)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2.5,
                    border: selected ? "2px solid" : "1px solid",
                    borderColor: selected ? "primary.main" : "divider",
                    p: 2,
                    textAlign: "center",
                    transition: "all .2s ease",
                    bgcolor: selected ? alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.08) : "background.paper",
                    boxShadow: selected ? `0 8px 20px ${alpha(theme.palette.primary.main, 0.16)}` : "none",
                    "&:hover": { boxShadow: 3, transform: "translateY(-2px)" },
                  }}
                >
                  <Icon sx={{ fontSize: 30, color: selected ? "primary.main" : "text.secondary" }} />
                  <Typography sx={{ mt: 1, fontSize: ".78rem", fontWeight: 700 }}>
                    {t(themeOption.id === "light" ? "light" : themeOption.id === "dark" ? "dark" : "system")}
                  </Typography>
                  {selected && <Check color="primary" sx={{ mt: 0.4, fontSize: 16 }} />}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </SectionCard>

      <SectionCard title={t("accentColor")} subtitle={t("accentColorDesc")}>
        <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
          {COLORS.map((color) => (
            <IconButton
              key={color}
              onClick={() => {
                updateValue("accent", color);
                setThemeOptions({ accent: color });
              }}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: color,
                border: settings.accent === color ? "2.5px solid white" : "none",
                outline: settings.accent === color ? `2.5px solid ${color}` : "none",
                boxShadow: settings.accent === color ? "0 6px 18px rgba(0,0,0,.18)" : "none",
                transition: "transform .18s ease",
                "&:hover": { backgroundColor: color, transform: "scale(1.08)" },
              }}
            >
              {settings.accent === color && <Check sx={{ color: "#fff", fontSize: 18 }} />}
            </IconButton>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title={t("displaySettings")} subtitle={t("displaySettingsDesc")}>
        <SettingRow title={t("compactMode")} description={t("compactModeDesc")}>
          <ToggleSwitch checked={settings.compact} onChange={(v) => updateValue("compact", v)} />
        </SettingRow>

        <SettingRow title={t("enableAnimations")} description={t("enableAnimationsDesc")}>
          <ToggleSwitch checked={settings.animations} onChange={(v) => updateValue("animations", v)} />
        </SettingRow>

        <SettingRow title={t("glassEffect")} description={t("glassEffectDesc")}>
          <ToggleSwitch checked={settings.glass} onChange={(v) => updateValue("glass", v)} />
        </SettingRow>

        <SettingRow title={t("roundedComponents")} description={t("roundedComponentsDesc")}>
          <RangeSlider
            value={settings.radius}
            min={0}
            max={24}
            step={2}
            onChange={(v) => {
              updateValue("radius", v);
              try {
                setThemeOptions({ radius: v });
              } catch (e) {}
            }}
          />
        </SettingRow>

        <SettingRow title={t("fontSize")} description={t("fontSizeDesc")}>
          <SelectField
            value={settings.fontSize}
            onChange={(v) => updateValue("fontSize", v)}
            options={[
              { label: t("small"), value: "small" },
              { label: t("medium"), value: "medium" },
              { label: t("large"), value: "large" },
            ]}
          />
        </SettingRow>

        <SettingRow title={t("uiDensity")} description={t("uiDensityDesc")} border={false}>
          <SelectField
            value={settings.density}
            onChange={(v) => updateValue("density", v)}
            options={[
              { label: t("compact"), value: "compact" },
              { label: t("comfortable"), value: "comfortable" },
              { label: t("spacious"), value: "spacious" },
            ]}
          />
        </SettingRow>
      </SectionCard>

      <SectionCard title={t("livePreview")} subtitle={t("livePreviewDesc")}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography sx={{ fontSize: ".85rem", fontWeight: 750, mb: 0.3 }}>{t("smartRetailDashboard")}</Typography>
          <Typography sx={{ fontSize: ".68rem", color: "text.secondary", mb: 1.5 }}>{t("previewUpdates")}</Typography>

          <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
            <Box sx={{ px: 2, py: 0.75, borderRadius: 1.5, bgcolor: "primary.main", color: "#fff", fontWeight: 650, fontSize: ".76rem" }}>
              {t("primaryButton")}
            </Box>
            <Box sx={{ px: 2, py: 0.75, borderRadius: 1.5, bgcolor: alpha(theme.palette.text.primary, 0.06), fontWeight: 650, fontSize: ".76rem" }}>
              {t("secondary")}
            </Box>
          </Stack>
        </Box>
      </SectionCard>
    </Stack>
  );
}
