import React from "react";

import {
    Stack,
    Box,
    Typography,
    Button,
    Chip,
    LinearProgress
} from "@mui/material";

import {
    Download,
    Backup,
    CloudSync,
    Storage,
    Description,
    DeleteForever,
    WarningAmber
} from "@mui/icons-material";

import SectionCard from "../common/SectionCard";
import SettingRow from "../common/SettingRow";
import ToggleSwitch from "../common/ToggleSwitch";
import SelectField from "../common/SelectField";

export default function DataSection({

    settings,

    setSettings

}) {

    const updateValue = (field, value) => {

        setSettings({

            ...settings,

            [field]: value

        });

    };

    return (

        <Stack spacing={3}>

            {/* ================================= */}

            <SectionCard

                title="EXPORT & BACKUP"

                subtitle="Manage your business data."

            >

                <SettingRow

                    icon={<Download color="primary" />}

                    label="Export All Data"

                    description="Download products, inventory, sales and reports."

                >

                    <Button

                        variant="contained"

                    >

                        Export

                    </Button>

                </SettingRow>

                <SettingRow

                    icon={<Backup color="primary" />}

                    label="Create Backup"

                    description="Generate a secure backup instantly."

                >

                    <Button

                        variant="outlined"

                    >

                        Backup

                    </Button>

                </SettingRow>

                <SettingRow

                    icon={<Description color="primary" />}

                    label="Download Reports"

                    description="Download Monthly & Yearly reports."

                >

                    <Button

                        variant="outlined"

                    >

                        Download

                    </Button>

                </SettingRow>

            </SectionCard>

            {/* ================================= */}

            <SectionCard

                title="AUTO BACKUP"

                subtitle="Automatic cloud backup configuration."

            >

                <SettingRow

                    icon={<CloudSync color="primary" />}

                    label="Enable Auto Backup"

                    description="Automatically backup every day."

                >

                    <ToggleSwitch

                        checked={settings.autoBackup}

                        onChange={(value) =>

                            updateValue(

                                "autoBackup",

                                value

                            )

                        }

                    />

                </SettingRow>

                <SettingRow

                    label="Backup Frequency"

                    description="Select backup interval."

                >

                    <SelectField

                        value={settings.backupFrequency}

                        onChange={(value) =>

                            updateValue(

                                "backupFrequency",

                                value

                            )

                        }

                        options={[

                            {

                                label: "Daily",

                                value: "daily"

                            },

                            {

                                label: "Weekly",

                                value: "weekly"

                            },

                            {

                                label: "Monthly",

                                value: "monthly"

                            }

                        ]}

                    />

                </SettingRow>

                <SettingRow

                    label="Cloud Sync"

                    description="Synchronize backup with cloud."

                >

                    <ToggleSwitch

                        checked={settings.cloudSync}

                        onChange={(value) =>

                            updateValue(

                                "cloudSync",

                                value

                            )

                        }

                    />

                </SettingRow>

            </SectionCard>

            {/* ================================= */}

            <SectionCard

                title="DATA RETENTION"

                subtitle="Control storage duration."

            >

                <SettingRow

                    label="Keep Sales History"

                    description="Choose how long sales records are stored."

                >

                    <SelectField

                        value={settings.retention}

                        onChange={(value) =>

                            updateValue(

                                "retention",

                                value

                            )

                        }

                        options={[

                            {

                                label: "6 Months",

                                value: "6"

                            },

                            {

                                label: "1 Year",

                                value: "12"

                            },

                            {

                                label: "3 Years",

                                value: "36"

                            },

                            {

                                label: "Forever",

                                value: "0"

                            }

                        ]}

                    />

                </SettingRow>

            </SectionCard>

            {/* ================================= */}

            <SectionCard

                title="STORAGE"

                subtitle="Current storage usage."

            >

                <Stack spacing={2}>

                    <Box>

                        <Typography

                            variant="body2"

                            color="text.secondary"

                        >

                            Used Storage

                        </Typography>

                        <Typography

                            variant="h6"

                            fontWeight={700}

                        >

                            7.2 GB / 20 GB

                        </Typography>

                    </Box>

                    <LinearProgress

                        variant="determinate"

                        value={36}

                        sx={{

                            height: 10,

                            borderRadius: 5

                        }}

                    />

                    <Chip

                        icon={<Storage />}

                        label="36% Storage Used"

                        color="primary"

                    />

                </Stack>

            </SectionCard>

            {/* ================================= */}

            <SectionCard

                title="DANGER ZONE"

                subtitle="Permanent actions."

            >

                <Box

                    sx={{

                        p: 3,

                        borderRadius: 2,

                        backgroundColor: "#fff5f5",

                        border: "1px solid #ffcdd2"

                    }}

                >

                    <Stack

                        spacing={2}

                    >

                        <Typography

                            variant="h6"

                            color="error"

                            fontWeight={700}

                        >

                            Delete All Business Data

                        </Typography>

                        <Typography

                            variant="body2"

                            color="text.secondary"

                        >

                            This action permanently removes all products,
                            inventory, sales history and AI reports.

                        </Typography>

                        <Button

                            color="error"

                            variant="contained"

                            startIcon={<DeleteForever />}

                        >

                            Delete Everything

                        </Button>

                    </Stack>

                </Box>

            </SectionCard>

            {/* ================================= */}

            <SectionCard

                title="SYSTEM STATUS"

                subtitle="Current backup information."

            >

                <Stack spacing={2}>

                    <Chip

                        color="success"

                        label="✓ Last Backup : Today 02:30 AM"

                    />

                    <Chip

                        color="success"

                        label="✓ Cloud Sync Active"

                    />

                    <Chip

                        color="warning"

                        icon={<WarningAmber />}

                        label="Next Backup : Tomorrow 02:00 AM"

                    />

                </Stack>

            </SectionCard>

        </Stack>

    );

}