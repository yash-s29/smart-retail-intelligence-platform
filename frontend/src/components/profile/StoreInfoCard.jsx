import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Grid } from "@mui/material";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

import { cardSx, cardPad, fadeUp, InfoRow, SectionHeading } from "./shared";

export default function StoreInfoCard({ store }) {
  return (
    <motion.div variants={fadeUp(0.12)} initial="hidden" animate="visible" style={{ height: "100%" }}>
      <Card sx={cardSx}>
        <CardContent sx={cardPad}>
          <SectionHeading icon={StorefrontRoundedIcon} label="Store information" />

          <Grid container spacing={{ xs: 1.75, sm: 2 }}>
            <Grid item xs={6}>
              <InfoRow label="Store name" value={store.name} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="GST number" value={store.gst} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="Address" value={store.address} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="City" value={store.city} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="State" value={store.state} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="Country" value={store.country} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="PIN code" value={store.pin} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="Hours" value={store.hours} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}
