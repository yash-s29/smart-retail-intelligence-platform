import { Switch } from "@mui/material";

export default function ToggleSwitch({ checked, onChange }) {
    return (
        <Switch
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            color="primary"
            sx={{
                transform: "scale(1.02)",
                "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "primary.main",
                },
                "& .MuiSwitch-track": {
                    borderRadius: 999,
                },
            }}
        />
    );
}