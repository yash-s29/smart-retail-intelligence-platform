// src/components/products/ProductCard.jsx
// Standalone card used in any grid/list view outside ProductList.

import {
  Avatar, Box, Button, Chip, Divider, Grid, IconButton,
  Stack, Tooltip, Typography,
} from "@mui/material";
import DeleteOutlineIcon    from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon     from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { motion } from "framer-motion";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n ?? 0);

function stockStatus(p) {
  const stock   = p.current_stock ?? 0;
  const reorder = p.reorder_level ?? 10;
  const safety  = p.safety_stock  ?? 20;
  if (stock === 0)      return { label: "Out of Stock", color: "error"   };
  if (stock <= reorder) return { label: "Critical",     color: "error"   };
  if (stock <= safety)  return { label: "Low Stock",    color: "warning" };
  return                       { label: "In Stock",     color: "success" };
}

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
}

export default function ProductCard({ product, onView, onEdit, onDelete }) {
  const status = stockStatus(product);
  const margin = product.selling_price > 0
    ? (((product.selling_price - product.cost_price) / product.selling_price) * 100).toFixed(1)
    : "0.0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Box sx={{
        bgcolor: "#fff", borderRadius: 3, border: "1px solid", borderColor: "divider",
        p: 2.5, height: "100%", display: "flex", flexDirection: "column",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 6px 24px rgba(0,0,0,0.08)" },
      }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
            <Avatar variant="rounded"
              sx={{ bgcolor: "primary.light", color: "primary.main", fontWeight: 800,
                width: 42, height: 42, fontSize: "0.82rem", borderRadius: "10px", flexShrink: 0 }}>
              {initials(product.name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={700} fontSize="0.9rem" color="text.primary" noWrap>
                {product.name}
              </Typography>
              <Typography fontSize="0.73rem" color="text.secondary" noWrap>
                {product.sku || "No SKU"} · {product.category || "Uncategorised"}
              </Typography>
            </Box>
          </Stack>
          <Chip label={status.label} color={status.color} size="small"
            sx={{ fontWeight: 700, fontSize: "0.68rem", height: 20, borderRadius: "6px", flexShrink: 0, ml: 1 }} />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Stats */}
        <Grid container spacing={1} mb={2} sx={{ flexGrow: 1 }}>
          {[
            { label: "Selling",  value: fmt(product.selling_price), highlight: true  },
            { label: "Cost",     value: fmt(product.cost_price),    highlight: false },
            { label: "Stock",    value: `${product.current_stock ?? 0} units`, highlight: false },
            { label: "Margin",   value: `${margin}%`,               highlight: true  },
          ].map(s => (
            <Grid item xs={6} key={s.label}>
              <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 2, px: 1.5, py: 0.8 }}>
                <Typography fontSize="0.65rem" color="text.secondary" fontWeight={700}
                  textTransform="uppercase" letterSpacing="0.05em">
                  {s.label}
                </Typography>
                <Typography fontWeight={800} fontSize="0.85rem"
                  color={s.highlight ? "text.primary" : "text.secondary"}>
                  {s.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Actions */}
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" startIcon={<VisibilityOutlinedIcon />}
            onClick={() => onView?.(product.id)}
            sx={{ flex: 1, borderRadius: "8px", fontWeight: 600, fontSize: "0.75rem" }}>
            View
          </Button>
          <Button size="small" variant="outlined" startIcon={<EditOutlinedIcon />}
            onClick={() => onEdit?.(product.id)}
            sx={{ flex: 1, borderRadius: "8px", fontWeight: 600, fontSize: "0.75rem" }}>
            Edit
          </Button>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete?.(product)}
              sx={{ border: "1px solid", borderColor: "error.light", borderRadius: "8px", px: 0.8 }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </motion.div>
  );
}