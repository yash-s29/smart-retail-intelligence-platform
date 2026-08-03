import { Box, Typography, alpha } from "@mui/material";

export default function SettingRow({ icon, title, description, children, border = true }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                py: 2.5,
                borderBottom: border ? "1px solid" : "none",
                borderColor: (theme) => alpha(theme.palette.divider, 0.8),
            }}
        >
            <Box display="flex" gap={2} alignItems="flex-start" flex={1} sx={{ minWidth: 0 }}>
                {icon && (
                    <Box
                        sx={{
                            color: "primary.main",
                            mt: 0.5,
                            p: 1,
                            borderRadius: 2,
                            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.16 : 0.1),
                        }}
                    >
                        {icon}
                    </Box>
                )}

                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {title}
                    </Typography>
                    {description && (
                        <Typography variant="body2" color="text.secondary" mt={0.5} sx={{ maxWidth: 560 }}>
                            {description}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "auto" }, display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
                {children}
            </Box>
        </Box>
    );
}