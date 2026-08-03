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
import DeleteOutlineIcon      from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon       from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InventoryIcon          from "@mui/icons-material/Inventory2Outlined";
import { motion }             from "framer-motion";

/* ─── Helpers ────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2,
  }).format(n ?? 0);

function stockStatus(product) {
  const stock   = product.current_stock ?? 0;
  const reorder = product.reorder_level ?? 10;
  const safety  = product.safety_stock  ?? 20;
  if (stock === 0)       return { label: "Out of Stock", color: "error"   };
  if (stock <= reorder)  return { label: "Critical",     color: "error"   };
  if (stock <= safety)   return { label: "Low Stock",    color: "warning" };
  return                        { label: "In Stock",     color: "success" };
}

function calcMargin(p) {
  if (!p.selling_price || p.selling_price <= 0) return "—";
  const m = ((p.selling_price - p.cost_price) / p.selling_price) * 100;
  return `${m.toFixed(1)}%`;
}

function marginColor(p) {
  if (!p.selling_price || p.selling_price <= 0) return "text.secondary";
  const m = ((p.selling_price - p.cost_price) / p.selling_price) * 100;
  if (m >= 20) return "success.main";
  if (m >= 10) return "warning.main";
  return "error.main";
}

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
}

/* ─── Column definitions ─────────────────────────────────── */
const COLUMNS = [
  { id: "product",  label: "Product",       minWidth: 200 },
  { id: "sku",      label: "SKU",           minWidth: 90  },
  { id: "category", label: "Category",      minWidth: 130 },
  { id: "selling",  label: "Selling Price", minWidth: 110 },
  { id: "cost",     label: "Cost Price",    minWidth: 100 },
  { id: "margin",   label: "Margin",        minWidth: 80  },
  { id: "stock",    label: "Stock",         minWidth: 70  },
  { id: "status",   label: "Status",        minWidth: 110 },
  { id: "actions",  label: "Actions",       minWidth: 110 },
];

/* ─── Skeleton Row ───────────────────────────────────────── */
function SkeletonRow({ cols }) {
  return (
    <TableRow>
      {cols.map((c) => (
        <TableCell key={c.id}>
          <Skeleton variant="rounded" width={c.minWidth * 0.7} height={18} sx={{ borderRadius: 1 }} />
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
        <Box sx={{ textAlign: "center", py: 7, px: 2 }}>
          <InventoryIcon sx={{ fontSize: 52, color: "text.disabled", mb: 1.5 }} />
          <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
            No products to display
          </Typography>
          <Typography variant="body2" color="text.disabled" mt={0.5}>
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

  return (
    <motion.tr
      component={TableRow}
      key={product.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, duration: 0.25 }}
      sx={{
        cursor: "default",
        "&:hover": { bgcolor: "#F8FAFC" },
        "& td": { py: 1.6, fontSize: "0.875rem", borderBottom: "1px solid", borderColor: "divider" },
        "&:last-child td": { borderBottom: 0 },
      }}
    >
      {/* ── Product (avatar + name) ── */}
      <TableCell>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              bgcolor     : "primary.light",
              color       : "primary.main",
              fontWeight  : 800,
              width       : 36,
              height      : 36,
              fontSize    : "0.75rem",
              borderRadius: "8px",
              flexShrink  : 0,
            }}
          >
            {initials(product.name)}
          </Avatar>
          <Typography
            fontWeight={700}
            fontSize="0.875rem"
            color="text.primary"
            noWrap
            sx={{ maxWidth: 220 }}
          >
            {product.name}
          </Typography>
        </Stack>
      </TableCell>

      {/* ── SKU ── */}
      <TableCell>
        <Typography
          fontSize="0.78rem"
          color="text.secondary"
          fontFamily="monospace"
          sx={{ letterSpacing: "0.03em" }}
        >
          {product.sku || "—"}
        </Typography>
      </TableCell>

      {/* ── Category ── */}
      <TableCell>
        <Typography fontSize="0.82rem" color="text.secondary">
          {product.category || "—"}
        </Typography>
      </TableCell>

      {/* ── Selling Price ── */}
      <TableCell>
        <Typography fontWeight={700} fontSize="0.875rem" color="text.primary">
          {fmt(product.selling_price)}
        </Typography>
      </TableCell>

      {/* ── Cost Price ── */}
      <TableCell>
        <Typography fontSize="0.82rem" color="text.secondary">
          {fmt(product.cost_price)}
        </Typography>
      </TableCell>

      {/* ── Margin ── */}
      <TableCell>
        <Typography fontWeight={700} fontSize="0.82rem" color={marginColor(product)}>
          {calcMargin(product)}
        </Typography>
      </TableCell>

      {/* ── Stock count ── */}
      <TableCell>
        <Typography
          fontWeight={700}
          fontSize="0.875rem"
          color={status.color === "success" ? "text.primary" : `${status.color}.main`}
        >
          {product.current_stock ?? 0}
        </Typography>
      </TableCell>

      {/* ── Status chip ── */}
      <TableCell>
        <Chip
          label={status.label}
          color={status.color}
          size="small"
          sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22, borderRadius: "6px" }}
        />
      </TableCell>

      {/* ── Actions ── */}
      {!minimal && (
        <TableCell>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View Details" arrow>
              <IconButton
                size="small"
                onClick={() => onView?.(product.id)}
                sx={{ color: "primary.main", "&:hover": { bgcolor: "primary.lighter" }, borderRadius: "7px" }}
              >
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit Product" arrow>
              <IconButton
                size="small"
                onClick={() => onEdit?.(product.id)}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "primary.main", bgcolor: "primary.lighter" },
                  borderRadius: "7px",
                }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Product" arrow>
              <IconButton
                size="small"
                onClick={() => onDelete?.(product)}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "error.main", bgcolor: "error.lighter" },
                  borderRadius: "7px",
                }}
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
  loading   = false,
  onView,
  onEdit,
  onDelete,
  minimal   = false,
  maxHeight,
}) {
  // When minimal=true (e.g. dashboard embed), hide Actions column
  const visibleCols = minimal
    ? COLUMNS.filter(c => c.id !== "actions")
    : COLUMNS;

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius : 3,
        border       : "1px solid",
        borderColor  : "divider",
        overflow     : "hidden",
        ...(maxHeight ? { maxHeight, overflow: "auto" } : {}),
      }}
    >
      <Table size="small" stickyHeader={!!maxHeight}>

        {/* ── Head ── */}
        <TableHead>
          <TableRow>
            {visibleCols.map((col) => (
              <TableCell
                key={col.id}
                sx={{
                  minWidth        : col.minWidth,
                  bgcolor         : "#F8FAFC",
                  fontWeight      : 800,
                  fontSize        : "0.72rem",
                  textTransform   : "uppercase",
                  letterSpacing   : "0.06em",
                  color           : "text.secondary",
                  py              : 1.8,
                  whiteSpace      : "nowrap",
                  borderBottom    : "2px solid",
                  borderColor     : "divider",
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* ── Body ── */}
        <TableBody>
          {loading ? (
            /* Skeleton rows while fetching */
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} cols={visibleCols} />
            ))
          ) : products.length === 0 ? (
            /* Empty state */
            <EmptyRow colSpan={visibleCols.length} />
          ) : (
            /* Data rows */
            products.map((product, index) => (
              <DataRow
                key={product.id}
                product={product}
                index={index}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                minimal={minimal}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}