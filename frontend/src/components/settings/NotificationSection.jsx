import React from "react";
import { Stack, Typography } from "@mui/material";
import { Email, Notifications, WarningAmber, SmartToy, Assessment, CalendarMonth } from "@mui/icons-material";
import { useLanguage } from "../../context/LanguageContext";
import SectionCard from "../common/SectionCard";
import SettingRow from "../common/SettingRow";
import ToggleSwitch from "../common/ToggleSwitch";
import SelectField from "../common/SelectField";

const notificationItems = [
    { key: "emailNotifications", icon: Email, titleKey: "emailNotifications", descKey: "emailNotificationsDesc" },
    { key: "pushNotifications", icon: Notifications, titleKey: "pushNotifications", descKey: "pushNotificationsDesc" },
    { key: "lowStockAlerts", icon: WarningAmber, titleKey: "lowStockAlerts", descKey: "lowStockAlertsDesc" },
    { key: "aiRecommendations", icon: SmartToy, titleKey: "aiRecommendations", descKey: "aiRecommendationsDesc" },
    { key: "salesReports", icon: Assessment, titleKey: "dailySalesReports", descKey: "dailySalesReportsDesc" },
    { key: "weeklySummary", icon: CalendarMonth, titleKey: "weeklySummary", descKey: "weeklySummaryDesc" },
];

export default function NotificationSection({ settings, setSettings }) {
    const { t } = useLanguage();
    const updateValue = (field, value) => setSettings((prev) => ({ ...prev, [field]: value }));

    return (
        <Stack spacing={3}>
            <SectionCard title={t("notificationPreferences")} subtitle={t("notificationPreferencesSubtitle")}>
                {notificationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <SettingRow key={item.key} icon={<Icon />} title={t(item.titleKey)} description={t(item.descKey)}>
                            <ToggleSwitch checked={Boolean(settings[item.key])} onChange={(value) => updateValue(item.key, value)} />
                        </SettingRow>
                    );
                })}
            </SectionCard>

            <SectionCard title={t("emailFrequency")} subtitle={t("emailFrequencySubtitle")}>
                <SettingRow title={t("reportFrequency")} description={t("reportFrequencyDesc")}>
                    <SelectField
                        value={settings.reportFrequency}
                        onChange={(value) => updateValue("reportFrequency", value)}
                        options={[
                            { label: t("daily"), value: "daily" },
                            { label: t("weekly"), value: "weekly" },
                            { label: t("monthly"), value: "monthly" }
                        ]}
                    />
                </SettingRow>

                <SettingRow title={t("marketingEmails")} description={t("marketingEmailsDesc")}>
                    <ToggleSwitch checked={Boolean(settings.marketingEmails)} onChange={(value) => updateValue("marketingEmails", value)} />
                </SettingRow>
            </SectionCard>

            <SectionCard title={t("soundDesktopAlerts")} subtitle={t("soundDesktopAlertsSubtitle")}>
                <SettingRow title={t("notificationSound")} description={t("notificationSoundDesc")}>
                    <ToggleSwitch checked={Boolean(settings.notificationSound)} onChange={(value) => updateValue("notificationSound", value)} />
                </SettingRow>

                <SettingRow title={t("desktopAlerts")} description={t("desktopAlertsDesc")}>
                    <ToggleSwitch checked={Boolean(settings.desktopAlerts)} onChange={(value) => updateValue("desktopAlerts", value)} />
                </SettingRow>

                <SettingRow title={t("criticalAlerts")} description={t("criticalAlertsDesc")}>
                    <ToggleSwitch checked={Boolean(settings.criticalAlerts)} onChange={(value) => updateValue("criticalAlerts", value)} />
                </SettingRow>
            </SectionCard>

            <SectionCard title={t("liveStatus")} subtitle={t("liveStatusSubtitle")}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    ✓ {t("emailService")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    ✓ {t("pushService")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ✓ {t("aiAlertEngine")}
                </Typography>
            </SectionCard>
        </Stack>
    );
}