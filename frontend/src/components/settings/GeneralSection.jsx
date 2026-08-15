import React from "react";
import { Grid, TextField, Box, Chip, Stack, Alert, Card, CardContent } from "@mui/material";
import { Store, AccessTime, Language, CalendarMonth, CurrencyRupee, LocationOn, Phone, Email, CheckCircle, Schedule } from "@mui/icons-material";
import { useLanguage } from "../../context/LanguageContext";
import SectionCard from "../common/SectionCard";
import SettingRow from "../common/SettingRow";
import SelectField from "../common/SelectField";

export default function GeneralSection({ settings, setSettings }) {
  const { t, switchLanguage } = useLanguage();

  const updateValue = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    if (field === "language") {
      switchLanguage(value);
    }
  };

  const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: ".82rem" } };

  return (
    <Stack spacing={2.5}>
      <SectionCard title={t("generalSettings")} subtitle={t("generalSubtitle")}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <SettingRow icon={<Store fontSize="small" />} title={t("storeName")} description={t("storeNameDesc")}>
            <TextField
              size="small"
              fullWidth
              value={settings.storeName || ""}
              onChange={(e) => updateValue("storeName", e.target.value)}
              placeholder="City SuperMart"
              sx={{ ...fieldSx, maxWidth: { sm: 320 } }}
            />
          </SettingRow>

          <SettingRow icon={<AccessTime fontSize="small" />} title={t("timezone")} description={t("timezoneDesc")}>
            <SelectField
              value={settings.timezone}
              onChange={(v) => updateValue("timezone", v)}
              options={[
                { value: "Asia/Kolkata", label: "IST (UTC +5:30)" },
                { value: "America/New_York", label: "EST (UTC -5)" },
                { value: "Europe/London", label: "GMT (UTC +0)" },
                { value: "Asia/Dubai", label: "GST (UTC +4)" },
                { value: "Asia/Singapore", label: "SGT (UTC +8)" },
              ]}
            />
          </SettingRow>

          <SettingRow icon={<CurrencyRupee fontSize="small" />} title={t("currency")} description={t("currencyDesc")}>
            <SelectField
              value={settings.currency}
              onChange={(v) => updateValue("currency", v)}
              options={[
                { value: "INR", label: "₹ Indian Rupee" },
                { value: "USD", label: "$ US Dollar" },
                { value: "EUR", label: "€ Euro" },
                { value: "GBP", label: "£ British Pound" },
                { value: "AED", label: "د.إ UAE Dirham" },
              ]}
            />
          </SettingRow>

          <SettingRow icon={<CalendarMonth fontSize="small" />} title={t("dateFormat")} description={t("dateFormatDesc")}>
            <SelectField
              value={settings.dateFormat}
              onChange={(v) => updateValue("dateFormat", v)}
              options={[
                { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
              ]}
            />
          </SettingRow>

          <SettingRow icon={<Language fontSize="small" />} title={t("language")} description={t("languageDesc")} border={false}>
            <SelectField
              value={settings.language}
              onChange={(v) => updateValue("language", v)}
              options={[
                { value: "en", label: "English" },
                { value: "hi", label: "हिंदी (Hindi)" },
              ]}
            />
          </SettingRow>
        </Box>
      </SectionCard>

      <SectionCard title={t("storeContact")} subtitle={t("storeContactDesc")}>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <SettingRow icon={<Phone fontSize="small" />} title={t("phoneNumber")} description={t("phoneNumberDesc")} border={false}>
              <TextField size="small" fullWidth placeholder="+91 98765 43210" defaultValue="+91 98765 43210" sx={fieldSx} />
            </SettingRow>
          </Grid>
          <Grid item xs={12} sm={6}>
            <SettingRow icon={<Email fontSize="small" />} title={t("businessEmail")} description={t("businessEmailDesc")} border={false}>
              <TextField size="small" fullWidth placeholder="hello@citysupermart.in" defaultValue="hello@citysupermart.in" sx={fieldSx} />
            </SettingRow>
          </Grid>
          <Grid item xs={12}>
            <SettingRow icon={<LocationOn fontSize="small" />} title={t("fullAddress")} description={t("fullAddressDesc")} border={false}>
              <TextField
                size="small"
                fullWidth
                multiline
                rows={2}
                placeholder="Shop No. 12, MG Road, Pune, Maharashtra 411001, India"
                defaultValue="Shop No. 12, MG Road, Pune, Maharashtra 411001, India"
                sx={fieldSx}
              />
            </SettingRow>
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard title={t("configStatus")} subtitle={t("configStatusDesc")}>
        <Card variant="outlined" sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider" }}>
          <CardContent sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip icon={<CheckCircle color="success" />} label={`${t("language")}: ${settings.language?.toUpperCase() || "EN"}`} color="success" variant="outlined" size="small" />
                <Chip icon={<CurrencyRupee />} label={`${t("currency")}: ${settings.currency}`} color="primary" variant="outlined" size="small" />
                <Chip icon={<CalendarMonth />} label={settings.dateFormat} color="info" variant="outlined" size="small" />
                <Chip icon={<Schedule />} label={settings.timezone} color="secondary" variant="outlined" size="small" />
              </Stack>

              <Alert severity="info" sx={{ borderRadius: 2, fontSize: ".76rem" }}>
                Click <strong>Save changes</strong> above to apply modifications platform-wide.
              </Alert>
            </Stack>
          </CardContent>
        </Card>
      </SectionCard>
    </Stack>
  );
}
