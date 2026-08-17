// src/pages/products/EditProduct.jsx
// GET /products/{id}  then  PUT /products/{id}  →  ProductUpdate schema
// Only name, category, sku, selling_price, cost_price are updatable (backend schema).

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Skeleton, Snackbar, Stack, Typography, useMediaQuery } from "@mui/material";
import { PrimaryButton } from "../../components/ui";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { motion } from "framer-motion";
import { getProduct, updateProduct } from "../../services/productApi";
import ProductForm from "../../components/products/ProductForm";
import { COLORS, RADIUS } from "../../components/products/shared";

/* ─── Validate ProductUpdate fields ──────────────────────── */
function validate(form) {
  const errs = {};
  if (!form.name?.trim()) errs.name = "Name is required (1–160 chars).";
  if (!form.selling_price || parseFloat(form.selling_price) <= 0)
    errs.selling_price = "Selling price must be > 0.";
  if (form.cost_price !== "" && parseFloat(form.cost_price) < 0)
    errs.cost_price = "Cost price cannot be negative.";
  return errs;
}

/* ─── Page Header Skeleton ───────────────────────────────── */
function HeaderSkeleton() {
  return (
    <Box mb={2}>
      <Skeleton width={150} height={24} sx={{ mb: 0.75, borderRadius: 1 }} />
      <Skeleton width={220} height={18} sx={{ borderRadius: 1 }} />
    </Box>
  );
}

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchErr, setFetchErr] = useState(null);
  const [apiErr, setApiErr] = useState(null);
  const [success, setSuccess] = useState(false);

  /* ── Fetch product ── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getProduct(id);
        const p = res.data;
        setForm({
          name: p.name ?? "",
          category: p.category ?? "",
          sku: p.sku ?? "",
          selling_price: String(p.selling_price ?? ""),
          cost_price: String(p.cost_price ?? 0),
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

  const btnSx = { borderRadius: "10px", fontWeight: 700, fontSize: ".78rem", textTransform: "none" };

  if (fetchErr) {
    return (
      <Box sx={{ maxWidth: 560, mx: "auto", pt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: "10px" }}>
          {fetchErr}
        </Alert>
        <Button sx={{ mt: 2, color: COLORS.primary, textTransform: "none", fontWeight: 700 }} startIcon={<ArrowBackIcon />} onClick={() => navigate("/products")}>
          Back to products
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 820, mx: "auto" }}>
      {/* ── Header ── */}
      {loading ? (
        <HeaderSkeleton />
      ) : (
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
                  <EditRoundedIcon sx={{ fontSize: 14 }} />
                </motion.div>

                <Box>
                  <Typography sx={{ fontSize: { xs: "1.2rem", sm: "1.35rem" }, fontWeight: 850, color: COLORS.ink, letterSpacing: "-.02em", lineHeight: 1.15 }}>
                    Edit product
                  </Typography>
                  <Typography sx={{ fontSize: ".72rem", color: COLORS.slate, mt: 0.15 }}>
                    Update the details below and save
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
                startIcon={saving ? <CircularProgress size={15} color="inherit" /> : <SaveOutlinedIcon sx={{ fontSize: 16 }} />}
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
                {saving ? "Saving…" : "Save changes"}
              </PrimaryButton>
            </Stack>
          </Stack>
        </motion.div>
      )}

      {/* ── API Error ── */}
      {apiErr && (
        <Alert severity="error" onClose={() => setApiErr(null)} sx={{ mb: 2, borderRadius: "10px" }}>
          {apiErr}
        </Alert>
      )}

      {/* ── Form (or skeleton) ── */}
      {loading ? (
        <Box>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ bgcolor: COLORS.white, borderRadius: RADIUS, border: `1px solid ${COLORS.border}`, p: 2.25, mb: 2 }}>
              <Skeleton width={110} height={14} sx={{ mb: 1.5, borderRadius: 1 }} />
              <Stack spacing={1.5}>
                <Skeleton height={42} sx={{ borderRadius: "10px" }} />
                <Skeleton height={42} sx={{ borderRadius: "10px" }} />
              </Stack>
            </Box>
          ))}
        </Box>
      ) : (
        form && <ProductForm form={form} onChange={handleChange} errors={errors} isEdit={true} />
      )}

      {/* ── Note: stock editing is in Inventory module ── */}
      {!loading && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ bgcolor: COLORS.aquaSoft, border: `1px solid ${COLORS.primary}22`, borderRadius: "10px", px: 1.75, py: 1, mb: 2 }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 16, color: COLORS.primary, flexShrink: 0 }} />
          <Typography sx={{ fontSize: ".72rem", fontWeight: 650, color: COLORS.primaryDark }}>
            Stock levels are managed from the Inventory module.
          </Typography>
        </Stack>
      )}

      {/* ── Mobile sticky footer ── */}
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
            disabled={saving || loading}
            sx={{ ...btnSx, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
          >
            {saving ? "Saving…" : "Save changes"}
          </PrimaryButton>
        </Stack>
      </Box>

      {/* ── Success snackbar ── */}
      <Snackbar open={success} autoHideDuration={2000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: "10px", fontWeight: 650 }}>
          Product updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
