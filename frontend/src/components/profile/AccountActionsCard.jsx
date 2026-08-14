import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Divider, Stack } from "@mui/material";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { COLORS, ActionRow, cardPad, cardSx, fadeUp, SectionHeading } from "./shared";

export default function AccountActionsCard({ onDownloadClick, onExportClick, onDeleteClick }) {
  return (
    <motion.div variants={fadeUp(0.13)} initial="hidden" animate="visible" style={{ height: "100%" }}>
      <Card sx={cardSx}>
        <CardContent sx={cardPad}>
          <SectionHeading icon={TaskAltRoundedIcon} label="Account actions" />

          <Stack spacing={0.25}>
            <ActionRow
              icon={FileDownloadRoundedIcon}
              label="Download my data"
              hint="Profile & dashboard as JSON"
              tone={COLORS.primary}
              onClick={onDownloadClick}
              endIcon={ChevronRightRoundedIcon}
            />

            <ActionRow
              icon={DescriptionRoundedIcon}
              label="Export reports"
              hint="Performance data as CSV"
              tone={COLORS.primary}
              onClick={onExportClick}
              endIcon={ChevronRightRoundedIcon}
            />
          </Stack>

          <Divider sx={{ my: 1.4, borderColor: COLORS.border }} />

          <ActionRow
            icon={DeleteOutlineRoundedIcon}
            label="Delete account"
            hint="Permanently remove account & data"
            tone={COLORS.danger}
            onClick={onDeleteClick}
            endIcon={ChevronRightRoundedIcon}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
