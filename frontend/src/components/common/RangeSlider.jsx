import { Slider, Stack, Typography } from "@mui/material";

export default function RangeSlider({ value, onChange, min = 0, max = 100, step = 1, suffix = "" }) {
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: "100%", sm: 260 } }}>
            <Slider
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={(_, val) => onChange(val)}
                color="primary"
                sx={{ flex: 1 }}
            />
            <Typography fontWeight={700} minWidth={40} textAlign="right">
                {value}
                {suffix}
            </Typography>
        </Stack>
    );
}