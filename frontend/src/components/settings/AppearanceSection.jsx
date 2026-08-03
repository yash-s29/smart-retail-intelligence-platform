import React from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { Box, Grid, Typography, Stack, IconButton, alpha } from "@mui/material";
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

const COLORS = ["#6366F1", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#3B82F6"];

export default function AppearanceSection({ settings, setSettings }) {
    const { t } = useLanguage();
    const updateValue = (field, value) => setSettings((prev) => ({ ...prev, [field]: value }));
    const { setThemeMode, setThemeOptions } = useThemeContext();

    const handleThemeSelect = (value) => {
        updateValue("theme", value);
        if (value === "system") {
            const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
            setThemeMode(systemDark ? "dark" : "light");
            try { localStorage.setItem("app_theme_pref", "system"); } catch (e) {}
        } else {
            setThemeMode(value);
            try { localStorage.setItem("app_theme_pref", value); } catch (e) {}
            try { localStorage.setItem("app_theme_mode", value); } catch (e) {}
        }
    };

    return (
        <Stack spacing={3}>
            <SectionCard title={t("appearance")} subtitle={t("appearanceDesc")}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 600 }}>
                    {t("theme")}
                </Typography>
                <Grid container spacing={2}>
                    {THEMES.map((theme) => {
                        const Icon = theme.icon;
                        const selected = settings.theme === theme.id;
                        return (
                            <Grid item xs={12} sm={4} key={theme.id}>
                                <Box
                                    onClick={() => handleThemeSelect(theme.id)}
                                    sx={{
                                        cursor: "pointer",
                                        borderRadius: 3,
                                        border: selected ? "2px solid" : "1px solid",
                                        borderColor: selected ? "primary.main" : "divider",
                                        p: { xs: 2.2, sm: 3 },
                                        textAlign: "center",
                                        transition: "all .25s ease",
                                        background: (muiTheme) =>
                                            selected
                                                ? alpha(muiTheme.palette.primary.main, muiTheme.palette.mode === "dark" ? 0.18 : 0.12)
                                                : muiTheme.palette.mode === "dark"
                                                    ? alpha(muiTheme.palette.background.paper, 0.7)
                                                    : muiTheme.palette.background.paper,
                                        backdropFilter: "blur(16px)",
                                        boxShadow: selected ? "0 10px 24px rgba(99, 102, 241, 0.18)" : "none",
                                        "&:hover": {
                                            boxShadow: 4,
                                            transform: "translateY(-3px)",
                                        },
                                    }}
                                >
                                    <Icon sx={{ fontSize: 40, color: selected ? "primary.main" : "text.secondary" }} />
                                    <Typography mt={2} fontWeight={700}>
                                        {t(theme.id === "light" ? "light" : theme.id === "dark" ? "dark" : "system")}
                                    </Typography>
                                    {selected && <Check color="primary" sx={{ mt: 1 }} />}
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </SectionCard>

            <SectionCard title={t("accentColor")} subtitle={t("accentColorDesc")}>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    {COLORS.map((color) => (
                        <IconButton
                            key={color}
                            onClick={() => {
                                updateValue("accent", color);
                                setThemeOptions({ accent: color });
                            }}
                            sx={{
                                width: 48,
                                height: 48,
                                backgroundColor: color,
                                border: settings.accent === color ? "3px solid white" : "none",
                                outline: settings.accent === color ? `3px solid ${color}` : "none",
                                boxShadow: settings.accent === color ? "0 8px 24px rgba(0,0,0,0.2)" : "none",
                                "&:hover": {
                                    backgroundColor: color,
                                    transform: "scale(1.08)",
                                },
                            }}
                        >
                            {settings.accent === color && <Check sx={{ color: "#fff" }} />}
                        </IconButton>
                    ))}
                </Stack>
            </SectionCard>

            <SectionCard title={t("displaySettings")} subtitle={t("displaySettingsDesc")}>
                <SettingRow title={t("compactMode")} description={t("compactModeDesc")}>
                    <ToggleSwitch checked={settings.compact} onChange={(value) => updateValue("compact", value)} />
                </SettingRow>

                <SettingRow title={t("enableAnimations")} description={t("enableAnimationsDesc")}>
                    <ToggleSwitch checked={settings.animations} onChange={(value) => updateValue("animations", value)} />
                </SettingRow>

                <SettingRow title={t("glassEffect")} description={t("glassEffectDesc")}>
                    <ToggleSwitch checked={settings.glass} onChange={(value) => updateValue("glass", value)} />
                </SettingRow>

                <SettingRow title={t("roundedComponents")} description={t("roundedComponentsDesc")}>
                    <RangeSlider
                        value={settings.radius}
                        min={0}
                        max={24}
                        step={2}
                        onChange={(value) => {
                            updateValue("radius", value);
                            try { setThemeOptions({ radius: value }); } catch (e) {}
                        }}
                    />
                </SettingRow>

                <SettingRow title={t("fontSize")} description={t("fontSizeDesc")}>
                    <SelectField
                        value={settings.fontSize}
                        onChange={(value) => updateValue("fontSize", value)}
                        options={[
                            { label: t("small"), value: "small" },
                            { label: t("medium"), value: "medium" },
                            { label: t("large"), value: "large" },
                        ]}
                    />
                </SettingRow>

                <SettingRow title={t("uiDensity")} description={t("uiDensityDesc")}>
                    <SelectField
                        value={settings.density}
                        onChange={(value) => updateValue("density", value)}
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
                        p: { xs: 2.2, sm: 3 },
                        borderRadius: 3,
                        background: (theme) =>
                            theme.palette.mode === "dark"
                                ? alpha(theme.palette.background.default, 0.8)
                                : alpha(theme.palette.background.default, 0.9),
                        border: "1px solid",
                        borderColor: "divider",
                        backdropFilter: "blur(16px)",
                    }}
                >
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        {t("smartRetailDashboard")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        {t("previewUpdates")}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                        <Box sx={{ px: 3, py: 1, borderRadius: 2, bgcolor: "primary.main", color: "#fff", fontWeight: 600 }}>
                            {t("primaryButton")}
                        </Box>
                        <Box sx={{ px: 3, py: 1, borderRadius: 2, bgcolor: "grey.200", fontWeight: 600 }}>
                            {t("secondary")}
                        </Box>
                    </Stack>
                </Box>
            </SectionCard>
        </Stack>
    );
}