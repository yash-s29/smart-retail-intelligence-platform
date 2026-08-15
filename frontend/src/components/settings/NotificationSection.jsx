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
    <Stack spacing={2.5}>
      <SectionCard title={t("notificationPreferences")} subtitle={t("notificationPreferencesSubtitle")}>
        {notificationItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <SettingRow
              key={item.key}
              icon={<Icon />}
              title={t(item.titleKey)}
              description={t(item.descKey)}
              border={index !== notificationItems.length - 1}
            >
              <ToggleSwitch checked={Boolean(settings[item.key])} onChange={(v) => updateValue(item.key, v)} />
            </SettingRow>
          );
        })}
      </SectionCard>

      <SectionCard title={t("emailFrequency")} subtitle={t("emailFrequencySubtitle")}>
        <SettingRow title={t("reportFrequency")} description={t("reportFrequencyDesc")}>
          <SelectField
            value={settings.reportFrequency}
            onChange={(v) => updateValue("reportFrequency", v)}
            options={[
              { label: t("daily"), value: "daily" },
              { label: t("weekly"), value: "weekly" },
              { label: t("monthly"), value: "monthly" },
            ]}
          />
        </SettingRow>

        <SettingRow title={t("marketingEmails")} description={t("marketingEmailsDesc")} border={false}>
          <ToggleSwitch checked={Boolean(settings.marketingEmails)} onChange={(v) => updateValue("marketingEmails", v)} />
        </SettingRow>
      </SectionCard>

      <SectionCard title={t("soundDesktopAlerts")} subtitle={t("soundDesktopAlertsSubtitle")}>
        <SettingRow title={t("notificationSound")} description={t("notificationSoundDesc")}>
          <ToggleSwitch checked={Boolean(settings.notificationSound)} onChange={(v) => updateValue("notificationSound", v)} />
        </SettingRow>

        <SettingRow title={t("desktopAlerts")} description={t("desktopAlertsDesc")}>
          <ToggleSwitch checked={Boolean(settings.desktopAlerts)} onChange={(v) => updateValue("desktopAlerts", v)} />
        </SettingRow>

        <SettingRow title={t("criticalAlerts")} description={t("criticalAlertsDesc")} border={false}>
          <ToggleSwitch checked={Boolean(settings.criticalAlerts)} onChange={(v) => updateValue("criticalAlerts", v)} />
        </SettingRow>
      </SectionCard>

      <SectionCard title={t("liveStatus")} subtitle={t("liveStatusSubtitle")}>
        <Stack spacing={0.6}>
          <Typography sx={{ fontSize: ".72rem", color: "text.secondary" }}>✓ {t("emailService")}</Typography>
          <Typography sx={{ fontSize: ".72rem", color: "text.secondary" }}>✓ {t("pushService")}</Typography>
          <Typography sx={{ fontSize: ".72rem", color: "text.secondary" }}>✓ {t("aiAlertEngine")}</Typography>
        </Stack>
      </SectionCard>
    </Stack>
  );
}

