import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Grid } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import { cardSx, cardPad, fadeUp, InfoRow, SectionHeading } from "./shared";

export default function PersonalInfoCard({ user }) {
  return (
    <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible" style={{ height: "100%" }}>
      <Card sx={cardSx}>
        <CardContent sx={cardPad}>
          <SectionHeading icon={PersonRoundedIcon} label="Personal information" />

          <Grid container spacing={{ xs: 1.75, sm: 2 }}>
            <Grid item xs={6}>
              <InfoRow label="Full name" value={user.name} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="Email" value={user.email} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="Phone" value={user.phone} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="Location" value={user.location} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="Store name" value={user.storeName} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="Store type" value={user.storeType} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="Category" value={user.businessCategory} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}
