import React from "react";
import { Stack, Button, Chip, Typography, Box, alpha, useTheme } from "@mui/material";
import { Security, Lock, Devices, AccessTime, VerifiedUser, Logout } from "@mui/icons-material";

import { useLanguage } from "../../context/LanguageContext";
import SectionCard from "../common/SectionCard";
import SettingRow from "../common/SettingRow";
import ToggleSwitch from "../common/ToggleSwitch";
import SelectField from "../common/SelectField";

const devices = [
  { id: 1, name: "Chrome · Windows 11", location: "Mumbai, India", active: true },
  { id: 2, name: "Android App", location: "Pune, India", active: false },
  { id: 3, name: "Edge · Laptop", location: "Delhi, India", active: false },
];

export default function SecuritySection({ settings, setSettings }) {
  const { t } = useLanguage();
  const theme = useTheme();
  const updateValue = (field, value) => setSettings((prev) => ({ ...prev, [field]: value }));

  const btnSx = { borderRadius: "9px", textTransform: "none", fontWeight: 700, fontSize: ".72rem" };

  return (
    <Stack spacing={2.5}>
      <SectionCard title={t("authentication")} subtitle={t("authenticationSubtitle")}>
        <SettingRow icon={<VerifiedUser />} title={t("twoFactorAuth")} description={t("twoFactorAuthDesc")}>
          <ToggleSwitch checked={settings.twoFactor} onChange={(v) => updateValue("twoFactor", v)} />
        </SettingRow>

        <SettingRow icon={<AccessTime />} title={t("sessionTimeout")} description={t("sessionTimeoutDesc")} border={false}>
          <SelectField
            value={settings.sessionTimeout}
            onChange={(v) => updateValue("sessionTimeout", v)}
            options={[
              { label: "15 minutes", value: "15" },
              { label: "30 minutes", value: "30" },
              { label: "1 hour", value: "60" },
              { label: "4 hours", value: "240" },
              { label: "Never", value: "0" },
            ]}
          />
        </SettingRow>
      </SectionCard>

      <SectionCard title={t("password")} subtitle={t("passwordSubtitle")}>
        <SettingRow icon={<Lock />} title={t("changePassword")} description={t("passwordDesc")} border={false}>
          <Button variant="contained" size="small" disableElevation sx={btnSx}>
            {t("changePassword")}
          </Button>
        </SettingRow>
      </SectionCard>

      <SectionCard title={t("loginDevices")} subtitle={t("loginDevicesSubtitle")}>
        {devices.map((device, index) => (
          <Box
            key={device.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.35,
              px: 1,
              mx: -1,
              borderRadius: 2,
              borderBottom: index !== devices.length - 1 ? "1px solid" : "none",
              borderColor: "divider",
              flexWrap: "wrap",
              gap: 1,
              transition: "background .18s ease",
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
            }}
          >
            <Box minWidth={0}>
              <Typography sx={{ fontSize: ".8rem", fontWeight: 700 }}>{device.name}</Typography>
              <Typography sx={{ fontSize: ".68rem", color: "text.secondary" }}>{device.location}</Typography>
            </Box>

            {device.active ? (
              <Chip color="success" size="small" label={t("currentDevice")} sx={{ fontWeight: 700 }} />
            ) : (
              <Button color="error" variant="outlined" size="small" sx={btnSx}>
                {t("revoke")}
              </Button>
            )}
          </Box>
        ))}
      </SectionCard>

      <SectionCard title={t("accountSecurity")} subtitle={t("accountSecuritySubtitle")}>
        <SettingRow icon={<Security />} title={t("loginAlerts")} description={t("loginAlertsDesc")}>
          <ToggleSwitch checked={settings.loginAlerts} onChange={(v) => updateValue("loginAlerts", v)} />
        </SettingRow>

        <SettingRow icon={<Devices />} title={t("rememberDevices")} description={t("rememberDevicesDesc")}>
          <ToggleSwitch checked={settings.rememberDevices} onChange={(v) => updateValue("rememberDevices", v)} />
        </SettingRow>

        <SettingRow icon={<Logout />} title={t("logoutAllDevices")} description={t("logoutAllDevicesDesc")} border={false}>
          <Button color="error" variant="contained" size="small" disableElevation sx={btnSx}>
            {t("logoutAll")}
          </Button>
        </SettingRow>
      </SectionCard>

      <SectionCard title={t("securityStatus")} subtitle={t("securityStatusSubtitle")}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip color="success" size="small" label={`✓ ${t("accountProtected")}`} sx={{ fontWeight: 650 }} />
          <Chip color="success" size="small" label={`✓ ${t("databaseEncrypted")}`} sx={{ fontWeight: 650 }} />
          <Chip color="info" size="small" label={`✓ ${t("lastLogin")}`} sx={{ fontWeight: 650 }} />
        </Stack>
      </SectionCard>
    </Stack>
  );
}
