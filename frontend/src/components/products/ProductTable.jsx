// src/components/products/ProductTable.jsx
// Reusable table component — used by ProductList and any other page
// that needs to display a list of products (e.g. Dashboard, Reports).
// Props:
//   products  : ProductWithStock[]  — array from backend
//   loading   : boolean
//   onView    : (id) => void
//   onEdit    : (id) => void
//   onDelete  : (product) => void   — passes full object for dialog
//   minimal   : boolean             — hides Actions column (read-only embed mode)

import React from "react";
import {
  Avatar, Box, Chip, IconButton, Skeleton, Stack,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Typography, Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import { motion } from "framer-motion";

import { COLORS, fmt, stockStatus, calcMargin, marginTone, initials, tone, toneSoft } from "./shared";

/* ─── Column definitions ─────────────────────────────────── */
const COLUMNS = [
  { id: "product", label: "Product", minWidth: 200 },
  { id: "sku", label: "SKU", minWidth: 90 },
  { id: "category", label: "Category", minWidth: 130 },
  { id: "selling", label: "Selling Price", minWidth: 110 },
  { id: "cost", label: "Cost Price", minWidth: 100 },
  { id: "margin", label: "Margin", minWidth: 80 },
  { id: "stock", label: "Stock", minWidth: 70 },
  { id: "status", label: "Status", minWidth: 110 },
  { id: "actions", label: "Actions", minWidth: 110 },
];

/* ─── Skeleton Row ───────────────────────────────────────── */
function SkeletonRow({ cols }) {
  return (
    <TableRow>
      {cols.map((c) => (
        <TableCell key={c.id}>
          <Skeleton variant="rounded" width={c.minWidth * 0.7} height={16} sx={{ borderRadius: 1 }} />
        </TableCell>
      ))}
    </TableRow>
  );
}

/* ─── Empty State ────────────────────────────────────────── */
function EmptyRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
          <InventoryIcon sx={{ fontSize: 44, color: COLORS.muted, mb: 1 }} />
          <Typography sx={{ fontWeight: 750, fontSize: ".9rem", color: COLORS.ink }}>
            No products to display
          </Typography>
          <Typography sx={{ fontSize: ".76rem", color: COLORS.muted, mt: 0.4 }}>
            Products will appear here once they are added.
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}

/* ─── Data Row ───────────────────────────────────────────── */
function DataRow({ product, index, onView, onEdit, onDelete, minimal }) {
  const status = stockStatus(product);
  const margin = calcMargin(product);
  const marginColor = tone(marginTone(margin));

  return (
    <motion.tr
      component={TableRow}
      key={product.id}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.2 }}
      sx={{
        transition: "background .16s ease",
        "&:hover": { bgcolor: COLORS.aquaPale },
        "& td": { py: 1.3, fontSize: ".82rem", borderBottom: `1px solid ${COLORS.border}` },
        "&:last-child td": { borderBottom: 0 },
      }}
    >
      {/* ── Product (avatar + name) ── */}
      <TableCell>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: COLORS.aquaSoft,
              color: COLORS.primary,
              fontWeight: 800,
              width: 32,
              height: 32,
              fontSize: ".68rem",
              borderRadius: "8px",
              flexShrink: 0,
            }}
          >
            {initials(product.name)}
          </Avatar>
          <Typography sx={{ fontWeight: 700, fontSize: ".82rem", color: COLORS.ink, maxWidth: 220 }} noWrap>
            {product.name}
          </Typography>
        </Stack>
      </TableCell>

      {/* ── SKU ── */}
      <TableCell>
        <Typography sx={{ fontSize: ".73rem", color: COLORS.slate, fontFamily: "monospace", letterSpacing: ".02em" }}>
          {product.sku || "—"}
        </Typography>
      </TableCell>

      {/* ── Category ── */}
      <TableCell>
        <Typography sx={{ fontSize: ".77rem", color: COLORS.slate }}>{product.category || "—"}</Typography>
      </TableCell>

      {/* ── Selling Price ── */}
      <TableCell>
        <Typography sx={{ fontWeight: 750, fontSize: ".82rem", color: COLORS.ink }}>{fmt(product.selling_price)}</Typography>
      </TableCell>

      {/* ── Cost Price ── */}
      <TableCell>
        <Typography sx={{ fontSize: ".77rem", color: COLORS.slate }}>{fmt(product.cost_price)}</Typography>
      </TableCell>

      {/* ── Margin ── */}
      <TableCell>
        <Typography sx={{ fontWeight: 750, fontSize: ".77rem", color: marginColor }}>
          {margin != null ? `${margin.toFixed(1)}%` : "—"}
        </Typography>
      </TableCell>

      {/* ── Stock count ── */}
      <TableCell>
        <Typography sx={{ fontWeight: 750, fontSize: ".82rem", color: status.tone === "success" ? COLORS.ink : tone(status.tone) }}>
          {product.current_stock ?? 0}
        </Typography>
      </TableCell>

      {/* ── Status chip ── */}
      <TableCell>
        <Chip
          label={status.label}
          size="small"
          sx={{ fontWeight: 750, fontSize: ".66rem", height: 21, borderRadius: "6px", bgcolor: toneSoft(status.tone), color: tone(status.tone) }}
        />
      </TableCell>

      {/* ── Actions ── */}
      {!minimal && (
        <TableCell>
          <Stack direction="row" spacing={0.4}>
            <Tooltip title="View Details" arrow>
              <IconButton
                size="small"
                onClick={() => onView?.(product.id)}
                sx={{ color: COLORS.primary, borderRadius: "7px", "&:hover": { bgcolor: COLORS.aquaSoft } }}
              >
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit Product" arrow>
              <IconButton
                size="small"
                onClick={() => onEdit?.(product.id)}
                sx={{ color: COLORS.slate, borderRadius: "7px", "&:hover": { color: COLORS.primary, bgcolor: COLORS.aquaSoft } }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Product" arrow>
              <IconButton
                size="small"
                onClick={() => onDelete?.(product)}
                sx={{ color: COLORS.slate, borderRadius: "7px", "&:hover": { color: COLORS.danger, bgcolor: COLORS.dangerSoft } }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      )}
    </motion.tr>
  );
}

/* ─── ProductTable ───────────────────────────────────────── */
export default function ProductTable({
  products = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  minimal = false,
  maxHeight,
}) {
  const visibleCols = minimal ? COLUMNS.filter((c) => c.id !== "actions") : COLUMNS;

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: "14px",
        border: `1px solid ${COLORS.border}`,
        overflow: "hidden",
        ...(maxHeight ? { maxHeight, overflow: "auto" } : {}),
      }}
    >
      <Table size="small" stickyHeader={!!maxHeight}>
        <TableHead>
          <TableRow>
            {visibleCols.map((col) => (
              <TableCell
                key={col.id}
                sx={{
                  minWidth: col.minWidth,
                  bgcolor: COLORS.aquaSoft,
                  fontWeight: 800,
                  fontSize: ".66rem",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  color: COLORS.primaryDark,
                  py: 1.4,
                  whiteSpace: "nowrap",
                  borderBottom: `2px solid ${alpha(COLORS.primary, 0.14)}`,
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={visibleCols} />)
          ) : products.length === 0 ? (
            <EmptyRow colSpan={visibleCols.length} />
          ) : (
            products.map((product, index) => (
              <DataRow key={product.id} product={product} index={index} onView={onView} onEdit={onEdit} onDelete={onDelete} minimal={minimal} />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
