import React from "react";

import {
    Box,
    Stack,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    Button,
    Avatar
} from "@mui/material";

import {
    InfoOutlined,
    Storage,
    Memory,
    CloudDone,
    Update,
    VerifiedUser,
    CheckCircle,
    Language,
    SupportAgent,
    Security,
    Speed,
    Analytics,
    Cloud
} from "@mui/icons-material";

import { motion } from "framer-motion";

import SectionCard from "../common/SectionCard";

export default function AboutSection() {

    const appInfo = [

        {
            title: "Application",
            value: "Smart Retail Intelligence Platform"
        },

        {
            title: "Version",
            value: "v2.4.1 Enterprise"
        },

        {
            title: "Build",
            value: "#2026.06.18"
        },

        {
            title: "Environment",
            value: "Production"
        },

        {
            title: "License",
            value: "Enterprise"
        },

        {
            title: "Region",
            value: "Asia Pacific"
        }

    ];

    const services = [

        {
            title: "Backend API",
            status: "Operational",
            color: "success",
            icon: CloudDone
        },

        {
            title: "Database Cluster",
            status: "Operational",
            color: "success",
            icon: Storage
        },

        {
            title: "AI Forecast Engine",
            status: "Operational",
            color: "success",
            icon: Memory
        },

        {
            title: "Analytics Engine",
            status: "Running",
            color: "info",
            icon: Analytics
        },

        {
            title: "Cloud Sync",
            status: "Connected",
            color: "primary",
            icon: Cloud
        },

        {
            title: "Security Monitor",
            status: "Protected",
            color: "success",
            icon: Security
        }

    ];

    const features = [
        {
            title: "Demand Forecasting",
            description: "AI-powered predictions to help you stock smarter.",
            icon: Analytics
        },
        {
            title: "Inventory Intelligence",
            description: "Real-time stock insights and automation rules.",
            icon: CloudDone
        },
        {
            title: "Performance Analytics",
            description: "Operational dashboards for faster decisions.",
            icon: Speed
        },
        {
            title: "Secure Operations",
            description: "Built-in security monitoring and compliance checks.",
            icon: VerifiedUser
        }
    ];

    return (

        <Stack spacing={4}>

            <SectionCard

                title="APPLICATION INFORMATION"

                subtitle="Current platform information and deployment details"

            >

                <Grid container spacing={3}>

                    {

                        appInfo.map((item, index) => (

                            <Grid

                                item

                                xs={12}

                                sm={6}

                                md={4}

                                key={index}

                            >

                                <motion.div

                                    initial={{

                                        opacity: 0,

                                        y: 15

                                    }}

                                    animate={{

                                        opacity: 1,

                                        y: 0

                                    }}

                                    transition={{

                                        delay: index * 0.08

                                    }}

                                >

                                    <Card

                                        elevation={0}

                                        sx={{

                                            height: "100%",

                                            borderRadius: 4,

                                            border: "1px solid",

                                            borderColor: "divider",

                                            transition: ".25s",

                                            "&:hover": {

                                                boxShadow: 5,

                                                transform: "translateY(-3px)"

                                            }

                                        }}

                                    >

                                        <CardContent>

                                            <Typography

                                                variant="body2"

                                                color="text.secondary"

                                            >

                                                {item.title}

                                            </Typography>

                                            <Typography

                                                variant="h6"

                                                mt={1}

                                                fontWeight={700}

                                            >

                                                {item.value}

                                            </Typography>

                                        </CardContent>

                                    </Card>

                                </motion.div>

                            </Grid>

                        ))

                    }

                </Grid>

            </SectionCard>

            <SectionCard

                title="SYSTEM STATUS"

                subtitle="Live infrastructure and service health"

            >

                <Grid container spacing={3}>

                    {

                        services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <Grid item xs={12} sm={6} md={4} key={service.title}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: "100%",
                                            borderRadius: 4,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            transition: ".25s",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            p: 3
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
                                            <Icon />
                                        </Avatar>
                                        <Box>
                                            <Typography fontWeight={700}>{service.title}</Typography>
                                            <Chip label={service.status} size="small" color={service.color} sx={{ mt: 1 }} />
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })

                    }

                </Grid>

            </SectionCard>

            <SectionCard
                title="FEATURE HIGHLIGHTS"
                subtitle="Core capabilities that make your retail operations smarter."
            >
                <Grid container spacing={3}>
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Grid item xs={12} sm={6} key={feature.title}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: "100%",
                                        borderRadius: 4,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        p: 3
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
                                        <Icon />
                                    </Avatar>
                                    <Box>
                                        <Typography fontWeight={700}>{feature.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">
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

