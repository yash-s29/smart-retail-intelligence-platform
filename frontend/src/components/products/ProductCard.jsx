// src/components/products/ProductCard.jsx
// Standalone card used in any grid/list view outside ProductList.

import { Avatar, Box, Button, Chip, Divider, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { motion } from "framer-motion";

import { COLORS, RADIUS, fmt, stockStatus, calcMargin, marginTone, initials, tone, toneSoft, reduceMotion } from "./shared";

export default function ProductCard({ product, onView, onEdit, onDelete }) {
  const status = stockStatus(product);
  const margin = calcMargin(product);
  const marginColor = tone(marginTone(margin));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        sx={{
          bgcolor: COLORS.white,
          borderRadius: RADIUS,
          border: `1px solid ${COLORS.border}`,
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow .2s ease, border-color .2s ease, transform .2s ease",
          "&:hover": {
            borderColor: alpha(COLORS.primary, 0.22),
            boxShadow: `0 14px 30px ${alpha(COLORS.primary, 0.1)}`,
            transform: "translateY(-3px)",
          },
          ...reduceMotion,
        }}
      >
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: COLORS.aquaSoft,
                color: COLORS.primary,
                fontWeight: 800,
                width: 38,
                height: 38,
                fontSize: ".76rem",
                borderRadius: "10px",
                flexShrink: 0,
              }}
            >
              {initials(product.name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 750, fontSize: ".85rem", color: COLORS.ink }} noWrap>
                {product.name}
              </Typography>
              <Typography sx={{ fontSize: ".68rem", color: COLORS.slate }} noWrap>
                {product.sku || "No SKU"} · {product.category || "Uncategorised"}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={status.label}
            size="small"
            sx={{
              fontWeight: 750,
              fontSize: ".62rem",
              height: 20,
              borderRadius: "6px",
              flexShrink: 0,
              ml: 1,
              bgcolor: toneSoft(status.tone),
              color: tone(status.tone),
            }}
          />
        </Stack>

        <Divider sx={{ mb: 1.5, borderColor: COLORS.border }} />

        {/* Stats */}
        <Grid container spacing={1} mb={1.5} sx={{ flexGrow: 1 }}>
          {[
            { label: "Selling", value: fmt(product.selling_price), highlight: true },
            { label: "Cost", value: fmt(product.cost_price), highlight: false },
            { label: "Stock", value: `${product.current_stock ?? 0} units`, highlight: false },
            { label: "Margin", value: margin != null ? `${margin.toFixed(1)}%` : "—", highlight: true, color: marginColor },
          ].map((s) => (
            <Grid item xs={6} key={s.label}>
              <Box sx={{ bgcolor: COLORS.aquaPale, borderRadius: "10px", px: 1.25, py: 0.7 }}>
                <Typography sx={{ fontSize: ".6rem", color: COLORS.muted, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".05em" }}>
                  {s.label}
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: ".8rem", color: s.color || (s.highlight ? COLORS.ink : COLORS.slate) }}>
                  {s.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Actions */}
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 15 }} />}
            onClick={() => onView?.(product.id)}
            sx={{
              flex: 1,
              borderRadius: "9px",
              fontWeight: 700,
              fontSize: ".7rem",
              borderColor: COLORS.border,
              color: COLORS.primaryDark,
              "&:hover": { borderColor: COLORS.aqua, bgcolor: COLORS.aquaSoft },
            }}
          >
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
            onClick={() => onEdit?.(product.id)}
            sx={{
              flex: 1,
              borderRadius: "9px",
              fontWeight: 700,
              fontSize: ".7rem",
              borderColor: COLORS.border,
              color: COLORS.primaryDark,
              "&:hover": { borderColor: COLORS.aqua, bgcolor: COLORS.aquaSoft },
            }}
          >
            Edit
          </Button>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete?.(product)}
              sx={{
                border: `1px solid ${alpha(COLORS.danger, 0.3)}`,
                color: COLORS.danger,
                borderRadius: "9px",
                px: 0.9,
                "&:hover": { bgcolor: COLORS.dangerSoft },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </motion.div>
  );
}
