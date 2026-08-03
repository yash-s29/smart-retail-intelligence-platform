import { Paper, Typography, Box, alpha } from "@mui/material";
import { motion } from "framer-motion";

export default function SectionCard({ title, subtitle, children, sx = {} }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    p: { xs: 2.2, sm: 3 },
                    border: "1px solid",
                    borderColor: "divider",
                    background: (theme) =>
                        theme.palette.mode === "dark"
                            ? alpha(theme.palette.background.paper, 0.82)
                            : alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: "blur(18px)",
                    boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                            ? "0 18px 45px rgba(2, 6, 23, 0.2)"
                            : "0 18px 45px rgba(15, 23, 42, 0.06)",
                    transition: "transform .25s ease, box-shadow .25s ease",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: (theme) =>
                            theme.palette.mode === "dark"
                                ? "0 24px 55px rgba(2, 6, 23, 0.28)"
                                : "0 24px 55px rgba(15, 23, 42, 0.12)",
                    },
                    ...sx,
                }}
            >
                {title && (
                    <Box mb={3}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: "text.secondary",
                                fontWeight: 700,
                                letterSpacing: 1.5,
                            }}
                        >
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                )}
                {children}
            </Paper>
        </motion.div>
    );
}