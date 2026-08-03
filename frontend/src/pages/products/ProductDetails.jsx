// src/pages/products/ProductDetails.jsx
// GET /products/{id}  →  ProductWithStock schema
// Shows: product info, inventory status, pricing analysis, actions.

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog,
  DialogActions, DialogContent, DialogTitle, Divider, Grid,
  LinearProgress, Skeleton, Stack, Typography,
} from "@mui/material";
import { PrimaryButton } from '../../components/ui';
import ArrowBackIcon      from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon   from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon  from "@mui/icons-material/DeleteOutlined";
import InventoryIcon      from "@mui/icons-material/Inventory2Outlined";
import WarningAmberIcon   from "@mui/icons-material/WarningAmber";
import LocalOfferIcon     from "@mui/icons-material/Sell";
import TrendingUpIcon     from "@mui/icons-material/TrendingUp";
import CalendarIcon       from "@mui/icons-material/CalendarToday";
import CategoryIcon       from "@mui/icons-material/Category";
import { motion }         from "framer-motion";
import { deleteProduct, getProduct } from "../../services/productApi";

/* ─── Helpers ────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n ?? 0);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

function stockStatus(p) {
  const stock   = p.current_stock ?? 0;
  const reorder = p.reorder_level ?? 10;
  const safety  = p.safety_stock  ?? 20;
  if (stock === 0)       return { label: "Out of Stock", color: "error",   pct: 0   };
  if (stock <= reorder)  return { label: "Critical",     color: "error",   pct: 15  };
  if (stock <= safety)   return { label: "Low Stock",    color: "warning", pct: 40  };
  return                        { label: "In Stock",     color: "success", pct: 100 };
}

/* ─── Stat Card ──────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color = "primary" }) {
  return (
    <Box sx={{
      bgcolor: "#fff", border: "1px solid", borderColor: "divider",
      borderRadius: 3, p: { xs: 2, sm: 2.5 },
      transition: "box-shadow 0.2s", "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.07)" },
    }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box sx={{ p: 1.2, bgcolor: `${color}.lighter`, borderRadius: 2, color: `${color}.main`, flexShrink: 0 }}>
          <Icon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontSize="0.72rem" fontWeight={700} color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {label}
          </Typography>
          <Typography fontWeight={800} fontSize={{ xs: "1.1rem", sm: "1.25rem" }} color="text.primary" noWrap>
            {value}
          </Typography>
          {sub && <Typography fontSize="0.75rem" color="text.secondary">{sub}</Typography>}
        </Box>
      </Stack>
    </Box>
  );
}

/* ─── Info Row ───────────────────────────────────────────── */
function InfoRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center"
      sx={{ py: 1.5, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
      <Typography fontSize="0.83rem" color="text.secondary" fontWeight={600}>{label}</Typography>
      <Typography fontSize="0.83rem" color="text.primary" fontWeight={700} sx={{ textAlign: "right", ml: 2 }}>{value || "—"}</Typography>
    </Stack>
  );
}

/* ─── Page Skeleton ──────────────────────────────────────── */
function PageSkeleton() {
  return (
    <Box>
      <Skeleton width={200} height={32} sx={{ mb: 0.5 }} />
      <Skeleton width={300} height={20} sx={{ mb: 3 }} />
      <Grid container spacing={2} mb={3}>
        {[...Array(4)].map((_, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Skeleton variant="rounded" height={90} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}><Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} /></Grid>
        <Grid item xs={12} md={5}><Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} /></Grid>
      </Grid>
    </Box>
  );
}

/* ─── Delete Dialog ──────────────────────────────────────── */
function DeleteDialog({ open, name, onClose, onConfirm, loading }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800 }}>Delete Product?</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ p: 1.5, bgcolor: "error.lighter", borderRadius: 2, color: "error.main" }}>
            <WarningAmberIcon />
          </Box>
          <Typography variant="body2" color="text.secondary">
            <strong>{name}</strong> will be permanently deleted along with its inventory and
            sales history. This cannot be undone.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "10px", fontWeight: 600 }}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}
          sx={{ borderRadius: "10px", fontWeight: 700 }}>
          {loading ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function ProductDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [product,   setProduct]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [delDialog, setDelDialog] = useState(false);
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProduct(id);
        setProduct(res.data);
      } catch {
        setError("Product not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(id);
      navigate("/products");
    } catch {
      setError("Delete failed. Please try again.");
      setDelDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", pt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
        <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </Box>
    );
  }

  const status = stockStatus(product);
  const margin = product.selling_price > 0
    ? (((product.selling_price - product.cost_price) / product.selling_price) * 100).toFixed(1)
    : "0.0";
  const stockPct = product.safety_stock > 0
    ? Math.min(100, Math.round((product.current_stock / product.safety_stock) * 100))
    : status.pct;

  return (
    <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto" }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} mb={3}>
          <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/products")}
              sx={{ mb: 0.5, fontWeight: 600, color: "text.secondary", pl: 0 }}>
              Back to Products
            </Button>
            <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
              <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ letterSpacing: "-0.02em" }}>
                {product.name}
              </Typography>
              <Chip label={status.label} color={status.color} size="small"
                sx={{ fontWeight: 700, fontSize: "0.72rem", height: 22, borderRadius: "6px" }} />
            </Stack>
            {product.category && (
              <Typography variant="body2" color="text.secondary" mt={0.3}>
                {product.category}{product.sku ? ` · SKU: ${product.sku}` : ""}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1.5}>
            <PrimaryButton variant="outlined" color="error" startIcon={<DeleteOutlineIcon />}
              onClick={() => setDelDialog(true)}
              sx={{ borderRadius: "10px", fontWeight: 700, height:5, boxShadow: "0 4px 14px rgba(241,99,102,0.25)" }}>
              Delete
            </PrimaryButton>
            <PrimaryButton variant="contained" startIcon={<EditOutlinedIcon />}
              onClick={() => navigate(`/products/edit/${product.id}`)}
              sx={{ borderRadius: "10px", fontWeight: 700,height:5, boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }}>
              Edit Product
            </PrimaryButton>
          </Stack>
        </Stack>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard icon={LocalOfferIcon} label="Selling Price" value={fmt(product.selling_price)} color="primary" />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard icon={LocalOfferIcon} label="Cost Price" value={fmt(product.cost_price)} color="warning" />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard icon={TrendingUpIcon} label="Gross Margin" value={`${margin}%`}
              color={parseFloat(margin) >= 20 ? "success" : parseFloat(margin) >= 10 ? "warning" : "error"} />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard icon={InventoryIcon} label="Current Stock"
              value={product.current_stock ?? 0}
              sub={`Reorder at ${product.reorder_level ?? 10}`}
              color={status.color === "success" ? "success" : status.color === "warning" ? "warning" : "error"} />
          </Grid>
        </Grid>
      </motion.div>

      {/* ── Main Detail Grid ── */}
      <Grid container spacing={3}>

        {/* ── Product Info ── */}
        <Grid item xs={12} md={7}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
            <Box sx={{ bgcolor: "#fff", border: "1px solid", borderColor: "divider", borderRadius: 3, p: { xs: 2.5, sm: 3 }, height: "100%" }}>
              <Typography variant="subtitle2" fontWeight={800} color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: "0.06em", mb: 2 }}>
                Product Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoRow label="Product Name" value={product.name}       />
              <InfoRow label="Category"     value={product.category}   />
              <InfoRow label="SKU"          value={product.sku}        />
              <InfoRow label="Selling Price" value={fmt(product.selling_price)} />
              <InfoRow label="Cost Price"   value={fmt(product.cost_price)}    />
              <InfoRow label="Gross Margin" value={`${margin}%`}              />
              <InfoRow label="Added On"     value={fmtDate(product.created_at)}/>
            </Box>
          </motion.div>
        </Grid>

        {/* ── Inventory Status ── */}
        <Grid item xs={12} md={5}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Box sx={{ bgcolor: "#fff", border: "1px solid", borderColor: "divider", borderRadius: 3, p: { xs: 2.5, sm: 3 }, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={800} color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: "0.06em", mb: 2 }}>
                Inventory Status
              </Typography>
              <Divider sx={{ mb: 2.5 }} />

              {/* Stock bar */}
              <Box mb={2.5}>
                <Stack direction="row" justifyContent="space-between" mb={0.8}>
                  <Typography fontSize="0.8rem" fontWeight={700} color="text.secondary">Stock Level</Typography>
                  <Chip label={status.label} color={status.color} size="small"
                    sx={{ fontWeight: 700, fontSize: "0.68rem", height: 20, borderRadius: "5px" }} />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={stockPct}
                  color={status.color}
                  sx={{ height: 8, borderRadius: 4, bgcolor: "grey.100" }}
                />
                <Stack direction="row" justifyContent="space-between" mt={0.6}>
                  <Typography fontSize="0.72rem" color="text.disabled">0</Typography>
                  <Typography fontSize="0.72rem" color="text.disabled">{product.safety_stock ?? 20} (safe)</Typography>
                </Stack>
              </Box>

              <InfoRow label="Current Stock"  value={`${product.current_stock ?? 0} units`}  />
              <InfoRow label="Reorder Level"  value={`${product.reorder_level ?? 10} units`} />
              <InfoRow label="Safety Stock"   value={`${product.safety_stock  ?? 20} units`} />

              {(product.current_stock ?? 0) <= (product.reorder_level ?? 10) && (
                <Alert severity="warning" icon={<WarningAmberIcon fontSize="small" />}
                  sx={{ mt: 2, borderRadius: 2, fontSize: "0.78rem" }}>
                  Stock is at or below reorder level. Consider restocking soon.
                </Alert>
              )}
            </Box>

            {/* Profit Analysis mini card */}
            <Box sx={{ bgcolor: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              borderRadius: 3, p: { xs: 2.5, sm: 3 }, color: "#fff" }}>
              <Typography fontSize="0.72rem" fontWeight={700} sx={{ opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em", mb: 1.5 }}>
                Profit Per Unit
              </Typography>
              <Typography fontSize="1.6rem" fontWeight={900} mb={0.3}>
                {fmt(product.selling_price - product.cost_price)}
              </Typography>
              <Typography fontSize="0.8rem" sx={{ opacity: 0.8 }}>
                {margin}% gross margin · Cost {fmt(product.cost_price)}
              </Typography>
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* ── Delete Dialog ── */}
      <DeleteDialog
        open={delDialog}
        name={product.name}
        onClose={() => setDelDialog(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  );
}