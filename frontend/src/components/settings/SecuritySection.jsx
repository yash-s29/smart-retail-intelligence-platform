import React from "react";

import {
    Stack,
    Button,
    Chip,
    Typography,
    Box
} from "@mui/material";

import {
    Security,
    Lock,
    Devices,
    AccessTime,
    VerifiedUser,
    Logout
} from "@mui/icons-material";

import { useLanguage } from "../../context/LanguageContext";
import SectionCard from "../common/SectionCard";
import SettingRow from "../common/SettingRow";
import ToggleSwitch from "../common/ToggleSwitch";
import SelectField from "../common/SelectField";

export default function SecuritySection({

    settings,

    setSettings

}) {

    const { t } = useLanguage();
    const updateValue = (field, value) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const devices = [

        {

            id: 1,

            name: "Chrome • Windows 11",

            location: "Mumbai, India",

            active: true

        },

        {

            id: 2,

            name: "Android App",

            location: "Pune, India",

            active: false

        },

        {

            id: 3,

            name: "Edge • Laptop",

            location: "Delhi, India",

            active: false

        }

    ];

    return (

        <Stack spacing={3}>

            <SectionCard

                title={t("authentication")}

                subtitle={t("authenticationSubtitle")}

            >

                <SettingRow

                    icon={<VerifiedUser color="primary" />}

                    title={t("twoFactorAuth")}

                    description={t("twoFactorAuthDesc")}

                >

                    <ToggleSwitch

                        checked={settings.twoFactor}

                        onChange={(value) =>

                            updateValue(

                                "twoFactor",

                                value

                            )

                        }

                    />

                </SettingRow>

                <SettingRow

                    icon={<AccessTime color="primary" />}

                    title={t("sessionTimeout")}

                    description={t("sessionTimeoutDesc")}

                >

                    <SelectField

                        value={settings.sessionTimeout}

                        onChange={(value) =>

                            updateValue(

                                "sessionTimeout",

                                value

                            )

                        }

                        options={[

                            {

                                label: "15 Minutes",

                                value: "15"

                            },

                            {

                                label: "30 Minutes",

                                value: "30"

                            },

                            {

                                label: "1 Hour",

                                value: "60"

                            },

                            {

                                label: "4 Hours",

                                value: "240"

                            },

                            {

                                label: "Never",

                                value: "0"

                            }

                        ]}

                    />

                </SettingRow>

            </SectionCard>

            <SectionCard

                title={t("password")}

                subtitle={t("passwordSubtitle")}

            >

                <SettingRow

                    icon={<Lock color="primary" />}

                    title={t("changePassword")}

                    description={t("passwordDesc")}

                >

                    <Button

                        variant="contained"

                    >

                        {t("changePassword")}

                    </Button>

                </SettingRow>

            </SectionCard>

            <SectionCard

                title={t("loginDevices")}

                subtitle={t("loginDevicesSubtitle")}

            >

                {

                    devices.map((device, index) => (

                        <Box

                            key={device.id}

                            sx={{

                                display: "flex",

                                justifyContent: "space-between",

                                alignItems: "center",

                                py: 2,

                                borderBottom:

                                    index !== devices.length - 1

                                        ? "1px solid"

                                        : "none",

                                borderColor: "divider",

                                flexWrap: "wrap",

                                gap: 2

                            }}

                        >

                            <Box>

                                <Typography

                                    fontWeight={600}

                                >

                                    {device.name}

                                </Typography>

                                <Typography

                                    variant="body2"

                                    color="text.secondary"

                                >

                                    {device.location}

                                </Typography>

                            </Box>

                            {

                                device.active ? (

                                    <Chip

                                        color="success"

                                        label={t("currentDevice")}

                                    />

                                ) : (

                                    <Button

                                        color="error"

                                        variant="outlined"

                                    >

                                        {t("revoke")}

                                    </Button>

                                )

                            }

                        </Box>

                    ))

                }

            </SectionCard>

            <SectionCard

                title={t("accountSecurity")}

                subtitle={t("accountSecuritySubtitle")}

            >

                <SettingRow

                    icon={<Security color="primary" />}

                    title={t("loginAlerts")}

                    description={t("loginAlertsDesc")}

                >

                    <ToggleSwitch

                        checked={settings.loginAlerts}

                        onChange={(value) =>

                            updateValue(

                                "loginAlerts",

                                value

                            )

                        }

                    />

                </SettingRow>

                <SettingRow

                    icon={<Devices color="primary" />}

                    title={t("rememberDevices")}

                    description={t("rememberDevicesDesc")}

                >

                    <ToggleSwitch

                        checked={settings.rememberDevices}

                        onChange={(value) =>

                            updateValue(

                                "rememberDevices",

                                value

                            )

                        }

                    />

                </SettingRow>

                <SettingRow

                    icon={<Logout color="primary" />}

                    title={t("logoutAllDevices")}

                    description={t("logoutAllDevicesDesc")}

                >

                    <Button

                        color="error"

                        variant="contained"

                    >

                        {t("logoutAll")}

                    </Button>

                </SettingRow>

            </SectionCard>

            <SectionCard

                title={t("securityStatus")}

                subtitle={t("securityStatusSubtitle")}

            >

                <Stack spacing={2}>

                    <Chip

                        color="success"

                        label={`✓ ${t("accountProtected")}`}

                    />

                    <Chip

                        color="success"

                        label={`✓ ${t("databaseEncrypted")}`}

                    />

                    <Chip

                        color="info"

                        label={`✓ ${t("lastLogin")}`}

                    />

                </Stack>

            </SectionCard>

        </Stack>

    );

}