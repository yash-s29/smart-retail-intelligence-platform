// src/pages/products/AddProduct.jsx
// POST /products  →  ProductCreate schema
// Fields: name, category, sku, selling_price, cost_price,
//         current_stock, reorder_level, safety_stock

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Snackbar, Stack, Typography, useMediaQuery } from "@mui/material";
import { PrimaryButton } from "../../components/ui";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import { motion } from "framer-motion";
import { createProduct } from "../../services/productApi";
import ProductForm from "../../components/products/ProductForm";
import { COLORS } from "../../components/products/shared";

/* ─── Default form state matches ProductCreate ───────────── */
const DEFAULT = {
  name: "",
  category: "",
  sku: "",
  selling_price: "",
  cost_price: "0",
  current_stock: "0",
  reorder_level: "10",
  safety_stock: "20",
};

/* ─── Validate against Pydantic constraints ──────────────── */
function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = "Name is required (1–160 chars).";
  if (!form.selling_price || parseFloat(form.selling_price) <= 0)
    errs.selling_price = "Selling price must be > 0.";
  if (form.cost_price !== "" && parseFloat(form.cost_price) < 0)
    errs.cost_price = "Cost price cannot be negative.";
  if (form.current_stock !== "" && parseInt(form.current_stock) < 0)
    errs.current_stock = "Stock cannot be negative.";
  if (form.reorder_level !== "" && parseInt(form.reorder_level) < 0)
    errs.reorder_level = "Reorder level cannot be negative.";
  if (form.safety_stock !== "" && parseInt(form.safety_stock) < 0)
    errs.safety_stock = "Safety stock cannot be negative.";
  return errs;
}

export default function AddProduct() {
  const navigate = useNavigate();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [form, setForm] = useState(DEFAULT);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    setApiErr(null);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category || null,
        sku: form.sku.trim() || null,
        selling_price: parseFloat(form.selling_price),
        cost_price: parseFloat(form.cost_price || 0),
        current_stock: parseInt(form.current_stock || 0),
        reorder_level: parseInt(form.reorder_level || 10),
        safety_stock: parseInt(form.safety_stock || 20),
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

  const btnSx = { borderRadius: "10px", fontWeight: 700, fontSize: ".78rem", textTransform: "none" };

  return (
    <Box sx={{ width: "100%", maxWidth: 820, mx: "auto" }}>
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          mb={2}
        >
          <Box>
            <PrimaryButton
              variant="text"
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              onClick={() => navigate("/products")}
              sx={{ mb: 0.3, fontWeight: 650, fontSize: ".74rem", color: COLORS.slate, pl: 0, "&:hover": { color: COLORS.primary, bgcolor: "transparent" } }}
            >
              Back to products
            </PrimaryButton>

            <Stack direction="row" spacing={1} alignItems="center">
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.primary,
                  background: `linear-gradient(135deg, ${COLORS.primary}22, ${COLORS.white})`,
                  border: `1px solid ${COLORS.primary}2A`,
                  flexShrink: 0,
                }}
              >
                <Inventory2RoundedIcon sx={{ fontSize: 15 }} />
              </motion.div>

              <Box>
                <Typography sx={{ fontSize: { xs: "1.2rem", sm: "1.35rem" }, fontWeight: 850, color: COLORS.ink, letterSpacing: "-.02em", lineHeight: 1.15 }}>
                  Add product
                </Typography>
                <Typography sx={{ fontSize: ".72rem", color: COLORS.slate, mt: 0.15 }}>
                  Create a new product in your catalog
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1}>
            <PrimaryButton
              variant="outlined"
              onClick={() => navigate("/products")}
              sx={{ ...btnSx, borderColor: COLORS.border, color: COLORS.slate, "&:hover": { borderColor: COLORS.aqua, bgcolor: COLORS.aquaSoft } }}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              disableElevation
              startIcon={<SaveOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={handleSubmit}
              disabled={saving}
              sx={{
                ...btnSx,
                px: 2.5,
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                boxShadow: `0 6px 16px ${COLORS.primary}3D`,
                "&:hover": { background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primaryDeep})` },
              }}
            >
              {saving ? "Saving…" : "Save product"}
            </PrimaryButton>
          </Stack>
        </Stack>
      </motion.div>

      {/* ── API Error ── */}
      {apiErr && (
        <Alert severity="error" onClose={() => setApiErr(null)} sx={{ mb: 2, borderRadius: "10px" }}>
          {apiErr}
        </Alert>
      )}

      {/* ── Form ── */}
      <ProductForm form={form} onChange={handleChange} errors={errors} isEdit={false} />

      {/* ── Sticky footer on mobile ── */}
      <Box
        sx={{
          display: { sm: "none" },
          position: "sticky",
          bottom: "var(--navbar-height-mobile)",
          bgcolor: COLORS.aquaPale,
          borderTop: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: 1,
          mt: 1,
        }}
      >
        <Stack direction="row" spacing={1.25}>
          <PrimaryButton fullWidth variant="outlined" onClick={() => navigate("/products")} sx={{ ...btnSx, borderColor: COLORS.border, color: COLORS.slate }}>
            Cancel
          </PrimaryButton>
          <PrimaryButton
            fullWidth
            variant="contained"
            disableElevation
            onClick={handleSubmit}
            disabled={saving}
            sx={{ ...btnSx, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
          >
            {saving ? "Saving…" : "Save product"}
          </PrimaryButton>
        </Stack>
      </Box>

      {/* ── Success snackbar ── */}
      <Snackbar open={success} autoHideDuration={2000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: "10px", fontWeight: 650 }}>
          Product created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
