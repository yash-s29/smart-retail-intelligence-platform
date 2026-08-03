import {
  Box,
  Stack,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
  Slider,
  TextField,
  Divider
} from "@mui/material";

import SectionCard from "../common/SectionCard";

export default function AISection({ settings, setSettings }) {
  const updateValue = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Stack spacing={4}>
      <SectionCard
        title="AI PREFERENCES"
        subtitle="Configure AI-assisted automation, forecasting, and recommendations."
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={1}>
                  Automation
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Enable automated AI workflows to keep stock levels optimized and reporting up to date.
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoRestock}
                        onChange={(event) => updateValue("autoRestock", event.target.checked)}
                      />
                    }
                    label="Auto Restock Suggestions"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoReport}
                        onChange={(event) => updateValue("autoReport", event.target.checked)}
                      />
                    }
                    label="Auto Report Scheduling"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.aiManager}
                        onChange={(event) => updateValue("aiManager", event.target.checked)}
                      />
                    }
                    label="AI Operations Manager"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={1}>
                  Forecast Confidence
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Adjust the AI sensitivity level for demand forecasting and inventory recommendations.
                </Typography>
                <Box mb={2}>
                  <Typography variant="body2" fontWeight={700} gutterBottom>
                    Confidence threshold
                  </Typography>
                  <Slider
                    value={settings.forecastConfidence}
                    onChange={(_, value) => updateValue("forecastConfidence", value)}
                    valueLabelDisplay="auto"
                    min={50}
                    max={100}
                    marks={[{ value: 50, label: "50%" }, { value: 75, label: "75%" }, { value: 100, label: "100%" }]}
                  />
                </Box>
                <TextField
                  fullWidth
                  select
                  label="AI aggressiveness"
                  value={settings.aiAggression}
                  onChange={(event) => updateValue("aiAggression", Number(event.target.value))}
                  SelectProps={{ native: true }}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </TextField>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary">
          These AI settings help balance automation with control. For maximum stability, use a confidence threshold above 75% and review suggested actions before applying.
        </Typography>
      </SectionCard>
    </Stack>
  );
}
