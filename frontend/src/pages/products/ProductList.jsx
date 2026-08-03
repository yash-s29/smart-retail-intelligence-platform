// src/pages/products/ProductList.jsx
// Full product list page — search, filter, pagination, delete dialog,
// loading skeletons, empty state, responsive table + card layout.
// Compatible with FastAPI /products endpoint (ProductWithStock schema).

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert, Avatar, Box, Button, Chip, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, Fade, Grid,
  IconButton, InputAdornment, MenuItem, Pagination,
  Paper, Select, Skeleton, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import AddIcon             from "@mui/icons-material/Add";
import DeleteOutlineIcon   from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon    from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchIcon          from "@mui/icons-material/Search";
import FilterListIcon      from "@mui/icons-material/FilterList";
import InventoryIcon       from "@mui/icons-material/Inventory2Outlined";
import WarningAmberIcon    from "@mui/icons-material/WarningAmber";
import { motion, AnimatePresence } from "framer-motion";
import { deleteProduct, getProducts } from "../../services/productApi";
import { PrimaryButton, CardContainer, FormField } from '../../components/ui';

/* ─── Constants ──────────────────────────────────────────── */
const PAGE_SIZE = 10;

const CATEGORIES = [
  "All", "Dairy & Eggs", "Beverages", "Snacks & Confectionery",
  "Grains & Pulses", "Fruits & Vegetables", "Bakery", "Frozen Foods",
  "Personal Care", "Household Cleaning", "Health & Wellness",
  "Baby Products", "Other",
];

/* ─── Helpers ────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

function stockStatus(product) {
  const stock = product.current_stock ?? 0;
  const reorder = product.reorder_level ?? 10;
  const safety  = product.safety_stock  ?? 20;
  if (stock === 0)          return { label: "Out of Stock", color: "error"   };
  if (stock <= reorder)     return { label: "Critical",     color: "error"   };
  if (stock <= safety)      return { label: "Low Stock",    color: "warning" };
  return                           { label: "In Stock",     color: "success" };
}

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
}

/* ─── Loading Skeleton Row ───────────────────────────────── */
function SkeletonRow() {
  return (
    <TableRow>
      {[80, 120, 80, 90, 90, 70, 90, 100].map((w, i) => (
        <TableCell key={i}>
          <Skeleton variant="rounded" width={w} height={20} />
        </TableCell>
      ))}
    </TableRow>
  );
}

/* ─── Loading Skeleton Card ──────────────────────────────── */
function SkeletonCard() {
  return (
    <Box sx={{ bgcolor: "#fff", borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: 2 }} />
        <Box flex={1}><Skeleton width="70%" height={18} /><Skeleton width="45%" height={14} sx={{ mt: 0.5 }} /></Box>
      </Stack>
      <Skeleton height={14} sx={{ mb: 0.5 }} />
      <Skeleton height={14} width="80%" />
    </Box>
  );
}

/* ─── Empty State ────────────────────────────────────────── */
function EmptyState({ hasSearch, onAdd }) {
  return (
    <Box sx={{ textAlign: "center", py: 10, px: 2 }}>
      <InventoryIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
      <Typography variant="h6" fontWeight={700} color="text.primary" mb={1}>
        {hasSearch ? "No products match your search" : "No products yet"}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {hasSearch
          ? "Try adjusting your search or category filter."
          : "Add your first product to start tracking inventory."}
      </Typography>
      {!hasSearch && (
        <PrimaryButton variant="contained" startIcon={<AddIcon />} onClick={onAdd}
          sx={{ borderRadius: "10px", fontWeight: 700 }}>
          Add Product
        </PrimaryButton>
      )}
    </Box>
  );
}

/* ─── Delete Dialog ──────────────────────────────────────── */
function DeleteDialog({ open, product, onClose, onConfirm, loading }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Delete Product?</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ p: 1.5, bgcolor: "error.lighter", borderRadius: 2, color: "error.main" }}>
            <WarningAmberIcon />
          </Box>
          <Typography variant="body2" color="text.secondary">
            <strong>{product?.name}</strong> will be permanently deleted along with its inventory and
            sales history. This cannot be undone.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <PrimaryButton onClick={onClose} variant="outlined" sx={{ borderRadius: "10px", fontWeight: 600 }}>
          Cancel
        </PrimaryButton>
        <PrimaryButton onClick={onConfirm} variant="contained" color="error" disabled={loading}
          sx={{ borderRadius: "10px", fontWeight: 700 }}>
          {loading ? "Deleting…" : "Delete"}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}

/* ─── Product Card (mobile) ──────────────────────────────── */
function ProductCard({ product, onEdit, onDelete, onView }) {
  const status = stockStatus(product);
  const margin = product.selling_price > 0
    ? (((product.selling_price - product.cost_price) / product.selling_price) * 100).toFixed(1)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      layout
    >
        <Box
        sx={{
          bgcolor: 'background.paper', borderRadius: 3, border: "1px solid",
          borderColor: "divider", p: 2.5,
          transition: "box-shadow 0.2s",
          "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.07)" },
        }}
      >
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar variant="rounded"
              sx={{ bgcolor: "primary.light", color: "primary.main", fontWeight: 800,
                width: 44, height: 44, fontSize: "0.85rem", borderRadius: 2 }}>
              {initials(product.name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={700} fontSize="0.9rem" color="text.primary" noWrap>
                {product.name}
              </Typography>
              <Typography fontSize="0.75rem" color="text.secondary">
                {product.sku || "—"} · {product.category || "Uncategorised"}
              </Typography>
            </Box>
          </Stack>
          <Chip label={status.label} color={status.color} size="small"
            sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22, borderRadius: "6px" }} />
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        {/* Stats grid */}
        <Grid container spacing={1} mb={1.5}>
          {[
            { label: "Selling",  value: fmt(product.selling_price) },
            { label: "Cost",     value: fmt(product.cost_price)    },
            { label: "Stock",    value: product.current_stock ?? 0 },
            { label: "Margin",   value: `${margin}%`               },
          ].map(s => (
            <Grid item xs={6} key={s.label}>
              <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 2, px: 1.5, py: 1 }}>
                <Typography fontSize="0.68rem" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.04em">
                  {s.label}
                </Typography>
                <Typography fontWeight={800} fontSize="0.88rem" color="text.primary">{s.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Actions */}
          <Stack direction="row" spacing={1}>
          <PrimaryButton size="small" variant="outlined" startIcon={<VisibilityOutlinedIcon />}
            onClick={() => onView(product.id)}
            sx={{ flex: 1, borderRadius: "8px", fontWeight: 600, fontSize: "0.78rem" }}>
            View
          </PrimaryButton>
          <PrimaryButton size="small" variant="outlined" startIcon={<EditOutlinedIcon />}
            onClick={() => onEdit(product.id)}
            sx={{ flex: 1, borderRadius: "8px", fontWeight: 600, fontSize: "0.78rem" }}>
            Edit
          </PrimaryButton>
          <IconButton size="small" color="error" onClick={() => onDelete(product)}
            sx={{ border: "1px solid", borderColor: "error.light", borderRadius: "8px" }}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function ProductList() {
  const navigate = useNavigate();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Data state
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  // Filters
  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("All");
  const [page,        setPage]        = useState(1);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  /* ── Fetch ── */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Filter + paginate ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter(p => {
      const matchCat = category === "All" || p.category === category;
      const matchQ   = !q
        || p.name?.toLowerCase().includes(q)
        || p.sku?.toLowerCase().includes(q)
        || p.category?.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [products, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── Handlers ── */
  const handleSearch   = (e) => { setSearch(e.target.value); setPage(1); };
  const handleCategory = (e) => { setCategory(e.target.value); setPage(1); };
  const handleDelete   = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts(ps => ps.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setError("Delete failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  /* ── Render ── */
  return (
    <Box sx={{ width: "100%", maxWidth: 1280, mx: "auto" }}>

      {/* ── Page header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} mb={3}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ letterSpacing: "-0.02em" }}>
              Products
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
            </Typography>
          </Box>
          <PrimaryButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/products/add")}
            sx={{ borderRadius: "10px", fontWeight: 700, px: 3, padding: 1.2, py: 1.2, boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }}
          >
            Add Product
          </PrimaryButton>
        </Stack>
      </motion.div>

      {/* ── Error ── */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* ── Search + Filter bar ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mb={2.5}>
          <FormField
            fullWidth
            size="small"
            placeholder="Search by name, SKU, or category…"
            value={search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: "text.secondary" }} /></InputAdornment>,
              sx: { borderRadius: "10px", bgcolor: "surface", fontSize: "0.9rem" },
            }}
          />
          <Select
            size="small"
            value={category}
            onChange={handleCategory}
            startAdornment={<FilterListIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />}
            sx={{ minWidth: { xs: "100%", sm: 220 }, borderRadius: "10px", bgcolor: "#fff", fontWeight: 600, fontSize: "0.9rem" }}
          >
            {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </Stack>
      </motion.div>

      {/* ── Desktop Table ── */}
      {!isMobile && (
        <Fade in>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                  {["Product", "SKU", "Category", "Selling", "Cost", "Margin", "Stock", "Status", "Actions"].map(h => (
                    <TableCell key={h}
                      sx={{ fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase",
                        letterSpacing: "0.06em", color: "text.secondary", py: 1.8, whiteSpace: "nowrap" }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                  : paginated.length === 0
                    ? (
                      <TableRow>
                        <TableCell colSpan={9}>
                          <EmptyState hasSearch={!!search || category !== "All"} onAdd={() => navigate("/products/add")} />
                        </TableCell>
                      </TableRow>
                    )
                    : paginated.map((p, i) => {
                      const status = stockStatus(p);
                      const margin = p.selling_price > 0
                        ? (((p.selling_price - p.cost_price) / p.selling_price) * 100).toFixed(1)
                        : "0.0";
                      return (
                        <motion.tr
                          key={p.id}
                          component={TableRow}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          sx={{
                            "&:hover": { bgcolor: "#F8FAFC" },
                            "& td": { py: 1.6, fontSize: "0.875rem" },
                          }}
                        >
                          {/* Product */}
                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 160 }}>
                              <Avatar variant="rounded"
                                sx={{ bgcolor: "primary.light", color: "primary.main", fontWeight: 800,
                                  width: 36, height: 36, fontSize: "0.78rem", borderRadius: "8px" }}>
                                {initials(p.name)}
                              </Avatar>
                              <Typography fontWeight={700} fontSize="0.875rem" color="text.primary" noWrap sx={{ maxWidth: 200 }}>
                                {p.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell><Typography fontSize="0.8rem" color="text.secondary" fontFamily="monospace">{p.sku || "—"}</Typography></TableCell>
                          <TableCell><Typography fontSize="0.8rem" color="text.secondary">{p.category || "—"}</Typography></TableCell>
                          <TableCell><Typography fontWeight={700} fontSize="0.875rem">{fmt(p.selling_price)}</Typography></TableCell>
                          <TableCell><Typography fontSize="0.8rem" color="text.secondary">{fmt(p.cost_price)}</Typography></TableCell>
                          <TableCell>
                            <Typography fontWeight={600} fontSize="0.8rem"
                              color={parseFloat(margin) >= 20 ? "success.main" : parseFloat(margin) >= 10 ? "warning.main" : "error.main"}>
                              {margin}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={700} fontSize="0.875rem"
                              color={status.color === "success" ? "text.primary" : `${status.color}.main`}>
                              {p.current_stock ?? 0}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={status.label} color={status.color} size="small"
                              sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22, borderRadius: "6px" }} />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5}>
                              <Tooltip title="View Details">
                                <IconButton size="small" onClick={() => navigate(`/products/${p.id}`)}
                                  sx={{ color: "primary.main", "&:hover": { bgcolor: "primary.lighter" } }}>
                                  <VisibilityOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Product">
                                <IconButton size="small" onClick={() => navigate(`/products/edit/${p.id}`)}
                                  sx={{ color: "text.secondary", "&:hover": { color: "primary.main", bgcolor: "primary.lighter" } }}>
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Product">
                                <IconButton size="small" onClick={() => setDeleteTarget(p)}
                                  sx={{ color: "text.secondary", "&:hover": { color: "error.main", bgcolor: "error.lighter" } }}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </motion.tr>
                      );
                    })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}

      {/* ── Mobile Cards ── */}
      {isMobile && (
        <Box>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Box key={i} mb={2}><SkeletonCard /></Box>)
            : paginated.length === 0
              ? <EmptyState hasSearch={!!search || category !== "All"} onAdd={() => navigate("/products/add")} />
              : (
                <AnimatePresence>
                  <Stack spacing={2}>
                    {paginated.map(p => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onView={id => navigate(`/products/${id}`)}
                        onEdit={id => navigate(`/products/edit/${id}`)}
                        onDelete={setDeleteTarget}
                      />
                    ))}
                  </Stack>
                </AnimatePresence>
              )
          }
        </Box>
      )}

      {/* ── Pagination ── */}
      {!loading && filtered.length > PAGE_SIZE && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* ── Delete Dialog ── */}
      <DeleteDialog
        open={!!deleteTarget}
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  );
}