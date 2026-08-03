// src/pages/products/EditProduct.jsx
// GET /products/{id}  then  PUT /products/{id}  →  ProductUpdate schema
// Only name, category, sku, selling_price, cost_price are updatable (backend schema).

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert, Box, Button, CircularProgress, Skeleton,
  Snackbar, Stack, Typography,
} from "@mui/material";
import { PrimaryButton } from '../../components/ui';
import ArrowBackIcon    from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { motion }       from "framer-motion";
import { getProduct, updateProduct } from "../../services/productApi";
import ProductForm from "../../components/products/ProductForm";

/* ─── Validate ProductUpdate fields ──────────────────────── */
function validate(form) {
  const errs = {};
  if (!form.name?.trim())                         errs.name          = "Name is required (1–160 chars).";
  if (!form.selling_price || parseFloat(form.selling_price) <= 0)
                                                  errs.selling_price = "Selling price must be > 0.";
  if (form.cost_price !== "" && parseFloat(form.cost_price) < 0)
                                                  errs.cost_price    = "Cost price cannot be negative.";
  return errs;
}

/* ─── Page Header Skeleton ───────────────────────────────── */
function HeaderSkeleton() {
  return (
    <Box mb={3}>
      <Skeleton width={160} height={28} sx={{ mb: 1 }} />
      <Skeleton width={240} height={20} />
    </Box>
  );
}

export default function EditProduct() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form,    setForm]    = useState(null);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [fetchErr,setFetchErr]= useState(null);
  const [apiErr,  setApiErr]  = useState(null);
  const [success, setSuccess] = useState(false);

  /* ── Fetch product ── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getProduct(id);
        const p   = res.data;
        setForm({
          name          : p.name          ?? "",
          category      : p.category      ?? "",
          sku           : p.sku           ?? "",
          selling_price : String(p.selling_price ?? ""),
          cost_price    : String(p.cost_price    ?? 0),
        });
      } catch {
        setFetchErr("Could not load product. It may have been deleted.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setApiErr(null);
    try {
      const payload = {
        name          : form.name.trim(),
        category      : form.category || null,
        sku           : form.sku.trim() || null,
        selling_price : parseFloat(form.selling_price),
        cost_price    : parseFloat(form.cost_price || 0),
      };
      await updateProduct(id, payload);
      setSuccess(true);
      setTimeout(() => navigate("/products"), 1200);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setApiErr(typeof detail === "string" ? detail : "Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (fetchErr) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", pt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{fetchErr}</Alert>
        <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 860, mx: "auto" }}>

      {/* ── Header ── */}
      {loading ? <HeaderSkeleton /> : (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} mb={3}>
              <Box>
              <PrimaryButton variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate("/products")}
                sx={{ mb: 0.5, fontWeight: 600, color: "text.secondary", pl: 0 }}>
                Back to Products
              </PrimaryButton>
              <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ letterSpacing: "-0.02em" }}>
                Edit Product
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update the details below and save.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <PrimaryButton variant="outlined" onClick={() => navigate("/products")}
                sx={{ borderRadius: "10px", fontWeight: 600, height:5 }}>
                Cancel
              </PrimaryButton>
              <PrimaryButton
                variant="contained"
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveOutlinedIcon />}
                onClick={handleSubmit}
                disabled={saving}
                sx={{ borderRadius: "10px", fontWeight: 700, px: 3, height: 5, boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </PrimaryButton>
            </Stack>
          </Stack>
        </motion.div>
      )}

      {/* ── API Error ── */}
      {apiErr && (
        <Alert severity="error" onClose={() => setApiErr(null)} sx={{ mb: 2.5, borderRadius: 2 }}>
          {apiErr}
        </Alert>
      )}

      {/* ── Form (or skeleton) ── */}
      {loading
        ? (
          <Box>
            {[0, 0.08, 0.16].map((d, i) => (
              <Box key={i} sx={{ bgcolor: "#fff", borderRadius: 3, border: "1px solid", borderColor: "divider", p: 3, mb: 3 }}>
                <Skeleton width={120} height={16} sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Skeleton height={48} sx={{ borderRadius: 2 }} />
                  <Skeleton height={48} sx={{ borderRadius: 2 }} />
                </Stack>
              </Box>
            ))}
          </Box>
        )
        : (
          form && (
            <ProductForm form={form} onChange={handleChange} errors={errors} isEdit={true} />
          )
        )
      }

      {/* ── Note: stock editing is in Inventory module ── */}
      {!loading && (
        <Box sx={{ bgcolor: "info.lighter", border: "1px solid", borderColor: "info.light",
          borderRadius: 2, px: 2.5, py: 1.5, mb: 3 }}>
          <Typography variant="caption" color="info.dark" fontWeight={600}>
            ℹ️ Stock levels (current stock, reorder level, safety stock) are managed from the Inventory module.
          </Typography>
        </Box>
      )}

      {/* ── Mobile sticky footer ── */}
      <Box sx={{ display: { sm: "none" }, position: "sticky", bottom: "var(--navbar-height-mobile)", bgcolor: "#F8FAFC",
        borderTop: "1px solid", borderColor: "divider", py: 2, px: 1, mt: 1 }}>
        <Stack direction="row" spacing={1.5}>
          <PrimaryButton fullWidth variant="outlined" onClick={() => navigate("/products")}
            sx={{ borderRadius: "10px", fontWeight: 600 }}>Cancel</PrimaryButton>
          <PrimaryButton fullWidth variant="contained" onClick={handleSubmit} disabled={saving || loading}
            sx={{ borderRadius: "10px", fontWeight: 700 }}>
            {saving ? "Saving…" : "Save Changes"}
          </PrimaryButton>
        </Stack>
      </Box>

      {/* ── Success snackbar ── */}
      <Snackbar open={success} autoHideDuration={2000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 2, fontWeight: 600 }}>
          Product updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}