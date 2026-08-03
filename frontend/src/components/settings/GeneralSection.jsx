import React from "react";
import { Grid, TextField, Typography, Box, InputAdornment, Divider, Chip, Stack, Alert, Card, CardContent } from "@mui/material";
import { Store, AccessTime, Language, CalendarMonth, CurrencyRupee, LocationOn, Phone, Email, Business, CheckCircle, Schedule } from "@mui/icons-material";
import { useLanguage } from "../../context/LanguageContext";
import SectionCard from "../common/SectionCard";
import SettingRow from "../common/SettingRow";
import SelectField from "../common/SelectField";

export default function GeneralSection({ settings, setSettings }) {
  const { t, switchLanguage } = useLanguage();

  const updateValue = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "language") {
      switchLanguage(value);
    }
  };

  return (
    <Stack spacing={4}>
      <SectionCard
        title={t("generalSettings")}
        subtitle={t("generalSubtitle")}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
          <SettingRow
            icon={<Store fontSize="small" />}
            title={t("storeName")}
            description={t("storeNameDesc")}
          >
            <TextField
              size="medium"
              fullWidth
              value={settings.storeName || ""}
              onChange={(e) => updateValue("storeName", e.target.value)}
              placeholder="City SuperMart"
              sx={{ maxWidth: { sm: 420 } }}
            />
          </SettingRow>

          <Divider />

          <SettingRow
            icon={<AccessTime fontSize="small" />}
            title={t("timezone")}
            description={t("timezoneDesc")}
          >
            <SelectField
              value={settings.timezone}
              onChange={(value) => updateValue("timezone", value)}
              options={[
                { value: "Asia/Kolkata", label: "IST (UTC +5:30)" },
                { value: "America/New_York", label: "EST (UTC -5)" },
                { value: "Europe/London", label: "GMT (UTC +0)" },
                { value: "Asia/Dubai", label: "GST (UTC +4)" },
                { value: "Asia/Singapore", label: "SGT (UTC +8)" },
              ]}
            />
          </SettingRow>

          <SettingRow
            icon={<CurrencyRupee fontSize="small" />}
            title={t("currency")}
            description={t("currencyDesc")}
          >
            <SelectField
              value={settings.currency}
              onChange={(value) => updateValue("currency", value)}
              options={[
                { value: "INR", label: "₹ Indian Rupee" },
                { value: "USD", label: "$ US Dollar" },
                { value: "EUR", label: "€ Euro" },
                { value: "GBP", label: "£ British Pound" },
                { value: "AED", label: "د.إ UAE Dirham" },
              ]}
            />
          </SettingRow>

          <SettingRow
            icon={<CalendarMonth fontSize="small" />}
            title={t("dateFormat")}
            description={t("dateFormatDesc")}
          >
            <SelectField
              value={settings.dateFormat}
              onChange={(value) => updateValue("dateFormat", value)}
              options={[
                { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
              ]}
            />
          </SettingRow>

          <SettingRow
            icon={<Language fontSize="small" />}
            title={t("language")}
            description={t("languageDesc")}
            border={false}
          >
            <SelectField
              value={settings.language}
              onChange={(value) => updateValue("language", value)}
              options={[
                { value: "en", label: "English" },
                { value: "hi", label: "हिंदी (Hindi)" },
              ]}
            />
          </SettingRow>
        </Box>
      </SectionCard>

      {/* ==================== STORE CONTACT ==================== */}
      <SectionCard
        title={t("storeContact")}
        subtitle={t("storeContactDesc")}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <SettingRow
              icon={<Phone fontSize="small" />}
              title={t("phoneNumber")}
              description={t("phoneNumberDesc")}
            >
              <TextField
                size="medium"
                fullWidth
                placeholder="+91 98765 43210"
                defaultValue="+91 98765 43210"
              />
            </SettingRow>
          </Grid>
          <Grid item xs={12} sm={6}>
            <SettingRow
              icon={<Email fontSize="small" />}
              title={t("businessEmail")}
              description={t("businessEmailDesc")}
            >
              <TextField
                size="medium"
                fullWidth
                placeholder="hello@citysupermart.in"
                defaultValue="hello@citysupermart.in"
              />
            </SettingRow>
          </Grid>
          <Grid item xs={12}>
            <SettingRow
              icon={<LocationOn fontSize="small" />}
              title={t("fullAddress")}
              description={t("fullAddressDesc")}
            >
              <TextField
                size="medium"
                fullWidth
                multiline
                rows={3}
                placeholder="Shop No. 12, MG Road, Pune, Maharashtra 411001, India"
                defaultValue="Shop No. 12, MG Road, Pune, Maharashtra 411001, India"
              />
            </SettingRow>
          </Grid>
        </Grid>
      </SectionCard>

      {/* ==================== CURRENT STATUS ==================== */}
      <SectionCard
        title={t("configStatus")}
        subtitle={t("configStatusDesc")}
      >
        <Card variant="outlined" sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<CheckCircle color="success" />}
                  label={`Language: ${settings.language?.toUpperCase() || 'EN'}`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  icon={<CurrencyRupee />}
                  label={`Currency: ${settings.currency}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<CalendarMonth />}
                  label={`Date Format: ${settings.dateFormat}`}
                  color="info"
                  variant="outlined"
                />
                <Chip
                  icon={<Schedule />}
                  label={`Timezone: ${settings.timezone}`}
                  color="secondary"
                  variant="outlined"
                />
              </Stack>

              <Alert severity="info" sx={{ borderRadius: 3 }}>
                Remember to click <strong>Save Changes</strong> in the top right to apply all modifications across the platform.
              </Alert>
            </Stack>
          </CardContent>
        </Card>
      </SectionCard>

      {/* ==================== TIPS CARD ==================== */}
      <SectionCard
        title="QUICK TIPS"
        subtitle="Best practices for store settings"
      >
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            • Changing Language will update the entire interface after save.<br />
            • Currency affects all monetary values in reports and invoices.<br />
            • Use consistent Date Format for better analytics.<br />
            • Store Name appears on all customer-facing documents.
          </Typography>
        </Stack>
      </SectionCard>

    </Stack>
  );
}