// src/pages/products/AddProduct.jsx
// POST /products  →  ProductCreate schema
// Fields: name, category, sku, selling_price, cost_price,
//         current_stock, reorder_level, safety_stock

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Snackbar, Stack, Typography,
} from "@mui/material";
import { PrimaryButton } from '../../components/ui';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { motion } from "framer-motion";
import { createProduct } from "../../services/productApi";
import ProductForm from "../../components/products/ProductForm";

/* ─── Default form state matches ProductCreate ───────────── */
const DEFAULT = {
  name          : "",
  category      : "",
  sku           : "",
  selling_price : "",
  cost_price    : "0",
  current_stock : "0",
  reorder_level : "10",
  safety_stock  : "20",
};

/* ─── Validate against Pydantic constraints ──────────────── */
function validate(form) {
  const errs = {};
  if (!form.name.trim())                        errs.name          = "Name is required (1–160 chars).";
  if (!form.selling_price || parseFloat(form.selling_price) <= 0)
                                                errs.selling_price = "Selling price must be > 0.";
  if (form.cost_price !== "" && parseFloat(form.cost_price) < 0)
                                                errs.cost_price    = "Cost price cannot be negative.";
  if (form.current_stock !== "" && parseInt(form.current_stock) < 0)
                                                errs.current_stock = "Stock cannot be negative.";
  if (form.reorder_level !== "" && parseInt(form.reorder_level) < 0)
                                                errs.reorder_level = "Reorder level cannot be negative.";
  if (form.safety_stock  !== "" && parseInt(form.safety_stock)  < 0)
                                                errs.safety_stock  = "Safety stock cannot be negative.";
  return errs;
}

export default function AddProduct() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState(DEFAULT);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [apiErr,  setApiErr]  = useState(null);
  const [success, setSuccess] = useState(false);

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
        cost_price    : parseFloat(form.cost_price  || 0),
        current_stock : parseInt(form.current_stock || 0),
        reorder_level : parseInt(form.reorder_level || 10),
        safety_stock  : parseInt(form.safety_stock  || 20),
      };
      await createProduct(payload);
      setSuccess(true);
      setTimeout(() => navigate("/products"), 1200);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setApiErr(typeof detail === "string" ? detail : "Failed to create product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 860, mx: "auto" }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} mb={3}>
          <Box>
            <PrimaryButton
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/products")}
              sx={{ mb: 0.5, fontWeight: 600, color: "text.secondary", pl: 0 }}
            >
              Back to Products
            </PrimaryButton>
            <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ letterSpacing: "-0.02em" }}>
              Add Product
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the details below to create a new product.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <PrimaryButton variant="outlined" onClick={() => navigate("/products")}
              sx={{ borderRadius: "10px", fontWeight: 600, height:5 }}>
              Cancel
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              onClick={handleSubmit}
              disabled={saving}
              sx={{ borderRadius: "10px", fontWeight: 700, px: 3, padding: 1, height: 5, boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }}
            >
              {saving ? "Saving…" : "Save Product"}
            </PrimaryButton>
          </Stack>
        </Stack>
      </motion.div>

      {/* ── API Error ── */}
      {apiErr && (
        <Alert severity="error" onClose={() => setApiErr(null)} sx={{ mb: 2.5, borderRadius: 2 }}>
          {apiErr}
        </Alert>
      )}

      {/* ── Form ── */}
      <ProductForm form={form} onChange={handleChange} errors={errors} isEdit={false} />

      {/* ── Sticky footer on mobile ── */}
      <Box sx={{ display: { sm: "none" }, position: "sticky", bottom: "var(--navbar-height-mobile)", bgcolor: "#F8FAFC",
        borderTop: "1px solid", borderColor: "divider", py: 2, px: 1, mt: 1 }}>
        <Stack direction="row" spacing={1.5}>
          <PrimaryButton fullWidth variant="outlined" onClick={() => navigate("/products")}
            sx={{ borderRadius: "10px", fontWeight: 600 }}>Cancel</PrimaryButton>
          <PrimaryButton fullWidth variant="contained" onClick={handleSubmit} disabled={saving}
            sx={{ borderRadius: "10px", fontWeight: 700 }}>
            {saving ? "Saving…" : "Save Product"}
          </PrimaryButton>
        </Stack>
      </Box>

      {/* ── Success snackbar ── */}
      <Snackbar open={success} autoHideDuration={2000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 2, fontWeight: 600 }}>
          Product created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}