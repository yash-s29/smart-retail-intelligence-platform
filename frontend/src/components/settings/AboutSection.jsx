import React from "react";
import { Box, Stack, Grid, Card, CardContent, Typography, Chip, Avatar, alpha, useTheme } from "@mui/material";
import {
  Storage,
  Memory,
  CloudDone,
  VerifiedUser,
  Security,
  Speed,
  Analytics,
  Cloud,
} from "@mui/icons-material";
import { motion } from "framer-motion";

import SectionCard from "../common/SectionCard";

const appInfo = [
  { title: "Application", value: "Smart Retail Intelligence Platform" },
  { title: "Version", value: "v2.4.1 Enterprise" },
  { title: "Build", value: "#2026.06.18" },
  { title: "Environment", value: "Production" },
  { title: "License", value: "Enterprise" },
  { title: "Region", value: "Asia Pacific" },
];

const services = [
  { title: "Backend API", status: "Operational", color: "success", icon: CloudDone },
  { title: "Database Cluster", status: "Operational", color: "success", icon: Storage },
  { title: "AI Forecast Engine", status: "Operational", color: "success", icon: Memory },
  { title: "Analytics Engine", status: "Running", color: "info", icon: Analytics },
  { title: "Cloud Sync", status: "Connected", color: "primary", icon: Cloud },
  { title: "Security Monitor", status: "Protected", color: "success", icon: Security },
];

const features = [
  { title: "Demand Forecasting", description: "AI-powered predictions to stock smarter.", icon: Analytics },
  { title: "Inventory Intelligence", description: "Real-time stock insights & automation.", icon: CloudDone },
  { title: "Performance Analytics", description: "Operational dashboards, faster decisions.", icon: Speed },
  { title: "Secure Operations", description: "Built-in monitoring & compliance checks.", icon: VerifiedUser },
];

function IconTile({ Icon, tone = "primary" }) {
  const theme = useTheme();
  const color = theme.palette[tone]?.main || theme.palette.primary.main;
  return (
    <Avatar sx={{ bgcolor: alpha(color, 0.12), color, width: 40, height: 40, borderRadius: "11px" }}>
      <Icon sx={{ fontSize: 19 }} />
    </Avatar>
  );
}

export default function AboutSection() {
  const theme = useTheme();

  return (
    <Stack spacing={2.5}>
      <SectionCard title="Application information" subtitle="Current platform and deployment details">
        <Grid container spacing={1.5}>
          {appInfo.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "box-shadow .2s ease, transform .2s ease",
                    "&:hover": {
                      boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.08)}`,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 1.6, "&:last-child": { pb: 1.6 } }}>
                    <Typography sx={{ fontSize: ".65rem", color: "text.secondary", fontWeight: 650 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ mt: 0.4, fontSize: ".82rem", fontWeight: 750 }}>{item.value}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SectionCard title="System status" subtitle="Live infrastructure and service health">
        <Grid container spacing={1.5}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={service.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.6,
                    transition: "box-shadow .2s ease, transform .2s ease",
                    "&:hover": {
                      boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.08)}`,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <IconTile Icon={Icon} tone={service.color === "info" ? "info" : service.color} />
                  <Box minWidth={0}>
                    <Typography sx={{ fontSize: ".78rem", fontWeight: 750 }} noWrap>
                      {service.title}
                    </Typography>
                    <Chip label={service.status} size="small" color={service.color} sx={{ mt: 0.5, height: 20, fontSize: ".62rem", fontWeight: 700 }} />
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </SectionCard>

      <SectionCard title="Feature highlights" subtitle="Core capabilities for smarter retail operations">
        <Grid container spacing={1.5}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Grid item xs={12} sm={6} key={feature.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.6,
                  }}
                >
                  <IconTile Icon={Icon} />
                  <Box minWidth={0}>
                    <Typography sx={{ fontSize: ".78rem", fontWeight: 750 }}>{feature.title}</Typography>
                    <Typography sx={{ fontSize: ".68rem", color: "text.secondary", mt: 0.15 }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </SectionCard>
    </Stack>
  );
}
