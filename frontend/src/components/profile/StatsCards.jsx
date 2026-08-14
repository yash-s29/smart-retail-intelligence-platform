import React from "react";
import { motion } from "framer-motion";
import { Box, Card, CardContent, Grid, Typography, Avatar } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { COLORS, RADIUS, fadeUp, reduceMotion } from "./shared";

const TONE = {
  blue: COLORS.primary,
  green: COLORS.success,
  indigo: COLORS.primaryDark,
  amber: COLORS.warning,
};

const ICON = {
  blue: Inventory2RoundedIcon,
  green: TrendingUpRoundedIcon,
  indigo: CurrencyRupeeRoundedIcon,
  amber: WarningAmberRoundedIcon,
};

export default function StatsCards({ stats }) {
  return (
    <Grid container spacing={{ xs: 1.25, sm: 1.5 }}>
      {stats.map((stat, index) => {
        const tone = TONE[stat.color] || COLORS.primary;
        const Icon = ICON[stat.color] || Inventory2RoundedIcon;

        return (
          <Grid item xs={6} lg={3} key={stat.label}>
            <motion.div variants={fadeUp(index * 0.05)} initial="hidden" animate="visible" style={{ height: "100%" }}>
              <Card
                sx={{
                  borderRadius: RADIUS,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.white,
                  boxShadow: "0 1px 2px rgba(16,77,96,.04)",
                  height: "100%",
                  transition: "box-shadow .2s ease, transform .2s ease, border-color .2s ease",

                  "&:hover": {
                    borderColor: alpha(tone, 0.24),
                    boxShadow: "0 12px 28px rgba(16,77,96,.09)",
                    transform: "translateY(-3px)",
                  },

                  ...reduceMotion,
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 1.85 }, "&:last-child": { pb: { xs: 1.5, sm: 1.85 } } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography
                      sx={{
                        fontSize: ".62rem",
                        fontWeight: 750,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                        color: COLORS.slate,
                      }}
                    >
                      {stat.label}
                    </Typography>

                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "9px",
                        bgcolor: alpha(tone, 0.1),
                        color: tone,
                      }}
                    >
                      <Icon sx={{ fontSize: 15 }} />
                    </Avatar>
                  </Box>

                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: { xs: "1.15rem", sm: "1.35rem" },
                      fontWeight: 900,
                      color: tone,
                      letterSpacing: "-.03em",
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.prefix}
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        );
      })}
    </Grid>
  );
}
