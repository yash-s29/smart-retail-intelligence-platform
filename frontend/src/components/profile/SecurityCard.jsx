import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Stack } from "@mui/material";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { COLORS, ActionRow, cardPad, cardSx, fadeUp, SectionHeading } from "./shared";

export default function SecurityCard({ onPasswordClick, onTwoFactorClick, onSessionsClick, twoFactorEnabled }) {
  const items = [
    { icon: VpnKeyRoundedIcon, label: "Change password", onClick: onPasswordClick },
    {
      icon: SmartphoneRoundedIcon,
      label: "Two-factor authentication",
      hint: twoFactorEnabled ? "Enabled" : "Disabled",
      onClick: onTwoFactorClick ?? (() => {}),
    },
    { icon: AccessTimeRoundedIcon, label: "Active sessions", onClick: onSessionsClick },
  ];

  return (
    <motion.div variants={fadeUp(0.11)} initial="hidden" animate="visible" style={{ height: "100%" }}>
      <Card sx={cardSx}>
        <CardContent sx={cardPad}>
          <SectionHeading icon={SecurityRoundedIcon} label="Security" />

          <Stack spacing={0.25}>
            {items.map((item) => (
              <ActionRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                hint={item.hint}
                tone={COLORS.primary}
                onClick={item.onClick}
                endIcon={ChevronRightRoundedIcon}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}
