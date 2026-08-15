import React from "react";
import { Stack, Box, Typography, Button, Chip, LinearProgress, alpha, useTheme } from "@mui/material";
import {
  Download,
  Backup,
  CloudSync,
  Storage,
  Description,
  DeleteForever,
  WarningAmber,
} from "@mui/icons-material";

import SectionCard from "../common/SectionCard";
import SettingRow from "../common/SettingRow";
import ToggleSwitch from "../common/ToggleSwitch";
import SelectField from "../common/SelectField";

export default function DataSection({ settings, setSettings }) {
  const theme = useTheme();

  const updateValue = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const btnSx = { borderRadius: "9px", textTransform: "none", fontWeight: 700, fontSize: ".72rem" };

  return (
    <Stack spacing={2.5}>
      <SectionCard title="Export & backup" subtitle="Manage your business data">
        <SettingRow icon={<Download />} label="Export all data" description="Products, inventory, sales & reports">
          <Button variant="contained" size="small" disableElevation sx={btnSx}>
            Export
          </Button>
        </SettingRow>

        <SettingRow icon={<Backup />} label="Create backup" description="Generate a secure backup instantly">
          <Button variant="outlined" size="small" sx={btnSx}>
            Backup
          </Button>
        </SettingRow>

        <SettingRow icon={<Description />} label="Download reports" description="Monthly & yearly reports" border={false}>
          <Button variant="outlined" size="small" sx={btnSx}>
            Download
          </Button>
        </SettingRow>
      </SectionCard>

      <SectionCard title="Auto backup" subtitle="Automatic cloud backup configuration">
        <SettingRow icon={<CloudSync />} label="Enable auto backup" description="Backs up automatically every day">
          <ToggleSwitch checked={settings.autoBackup} onChange={(v) => updateValue("autoBackup", v)} />
        </SettingRow>

        <SettingRow label="Backup frequency" description="Select backup interval">
          <SelectField
            value={settings.backupFrequency}
            onChange={(v) => updateValue("backupFrequency", v)}
            options={[
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ]}
          />
        </SettingRow>

        <SettingRow label="Cloud sync" description="Synchronize backup with cloud" border={false}>
          <ToggleSwitch checked={settings.cloudSync} onChange={(v) => updateValue("cloudSync", v)} />
        </SettingRow>
      </SectionCard>

      <SectionCard title="Data retention" subtitle="Control storage duration">
        <SettingRow label="Keep sales history" description="How long sales records are stored" border={false}>
          <SelectField
            value={settings.retention}
            onChange={(v) => updateValue("retention", v)}
            options={[
              { label: "6 months", value: "6" },
              { label: "1 year", value: "12" },
              { label: "3 years", value: "36" },
              { label: "Forever", value: "0" },
            ]}
          />
        </SettingRow>
      </SectionCard>

      <SectionCard title="Storage" subtitle="Current storage usage">
        <Stack spacing={1.25}>
          <Box>
            <Typography sx={{ fontSize: ".68rem", color: "text.secondary" }}>Used storage</Typography>
            <Typography sx={{ fontSize: "1rem", fontWeight: 800 }}>7.2 GB / 20 GB</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={36}
            sx={{
              height: 8,
              borderRadius: 5,
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              "& .MuiLinearProgress-bar": { borderRadius: 5, bgcolor: "primary.main" },
            }}
          />
          <Chip icon={<Storage />} label="36% storage used" color="primary" size="small" sx={{ fontWeight: 700, alignSelf: "flex-start" }} />
        </Stack>
      </SectionCard>

      <SectionCard title="Danger zone" subtitle="Permanent actions">
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: alpha(theme.palette.error.main, 0.06),
            border: "1px solid",
            borderColor: alpha(theme.palette.error.main, 0.22),
          }}
        >
          <Stack spacing={1.25}>
            <Typography sx={{ fontSize: ".9rem", fontWeight: 800, color: "error.main" }}>
              Delete all business data
            </Typography>
            <Typography sx={{ fontSize: ".7rem", color: "text.secondary" }}>
              Permanently removes all products, inventory, sales history and AI reports.
            </Typography>
            <Button color="error" variant="contained" size="small" disableElevation startIcon={<DeleteForever sx={{ fontSize: 16 }} />} sx={{ ...btnSx, alignSelf: "flex-start" }}>
              Delete everything
            </Button>
          </Stack>
        </Box>
      </SectionCard>

      <SectionCard title="System status" subtitle="Current backup information">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip color="success" size="small" label="✓ Last backup: Today 02:30 AM" sx={{ fontWeight: 650 }} />
          <Chip color="success" size="small" label="✓ Cloud sync active" sx={{ fontWeight: 650 }} />
          <Chip color="warning" size="small" icon={<WarningAmber sx={{ fontSize: 15 }} />} label="Next backup: Tomorrow 02:00 AM" sx={{ fontWeight: 650 }} />
        </Stack>
      </SectionCard>
    </Stack>
  );
}
