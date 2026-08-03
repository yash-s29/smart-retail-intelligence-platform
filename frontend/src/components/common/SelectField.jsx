import { FormControl, Select, MenuItem } from "@mui/material";

export default function SelectField({ value, onChange, options, width = 220 }) {
    return (
        <FormControl size="small" sx={{ minWidth: width, width: { xs: "100%", sm: width } }}>
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                displayEmpty
                sx={{
                    borderRadius: 3,
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "divider",
                    },
                }}
            >
                {options.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}