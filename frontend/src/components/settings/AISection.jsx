import React from "react";
import {
  Box,
  Stack,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";

import SectionCard from "../common/SectionCard";
import ToggleSwitch from "../common/ToggleSwitch";
import RangeSlider from "../common/RangeSlider";
import SelectField from "../common/SelectField";

export default function AISection({ settings, setSettings }) {
  const theme = useTheme();

  const updateValue = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const panelSx = {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    height: "100%",
  };

  return (
    <Stack spacing={2.5}>
      <SectionCard
        title="AI preferences"
        subtitle="Configure AI-assisted automation, forecasting, and recommendations"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={panelSx}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: ".85rem", fontWeight: 750, mb: 0.3 }}>Automation</Typography>
                <Typography sx={{ fontSize: ".68rem", color: "text.secondary", mb: 1.5 }}>
                  Keep stock levels and reporting up to date automatically.
                </Typography>

                <Stack spacing={1.25}>
                  <FormControlLabel
                    control={<ToggleSwitch checked={settings.autoRestock} onChange={(v) => updateValue("autoRestock", v)} />}
                    label={<Typography sx={{ fontSize: ".76rem", fontWeight: 600 }}>Auto restock suggestions</Typography>}
                  />
                  <FormControlLabel
                    control={<ToggleSwitch checked={settings.autoReport} onChange={(v) => updateValue("autoReport", v)} />}
                    label={<Typography sx={{ fontSize: ".76rem", fontWeight: 600 }}>Auto report scheduling</Typography>}
                  />
                  <FormControlLabel
                    control={<ToggleSwitch checked={settings.aiManager} onChange={(v) => updateValue("aiManager", v)} />}
                    label={<Typography sx={{ fontSize: ".76rem", fontWeight: 600 }}>AI operations manager</Typography>}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={panelSx}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: ".85rem", fontWeight: 750, mb: 0.3 }}>Forecast confidence</Typography>
                <Typography sx={{ fontSize: ".68rem", color: "text.secondary", mb: 1.75 }}>
                  Tune AI sensitivity for demand forecasting.
                </Typography>

                <Box mb={1.75}>
                  <Typography sx={{ fontSize: ".72rem", fontWeight: 700, mb: 0.75 }}>Confidence threshold</Typography>
                  <RangeSlider
                    value={settings.forecastConfidence}
                    min={50}
                    max={100}
                    step={5}
                    onChange={(v) => updateValue("forecastConfidence", v)}
                  />
                </Box>

                <Typography sx={{ fontSize: ".72rem", fontWeight: 700, mb: 0.75 }}>AI aggressiveness</Typography>
                <SelectField
                  value={settings.aiAggression}
                  onChange={(v) => updateValue("aiAggression", Number(v))}
                  options={[1, 2, 3, 4, 5].map((v) => ({ label: `Level ${v}`, value: v }))}
                  minWidth={160}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography sx={{ fontSize: ".68rem", color: "text.secondary" }}>
          For maximum stability, keep confidence above 75% and review suggested actions before applying.
        </Typography>
      </SectionCard>
    </Stack>
  );
}
