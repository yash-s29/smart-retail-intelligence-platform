// src/components/products/ProductForm.jsx
// Reusable form for AddProduct and EditProduct.
// Schema mirrors ProductCreate / ProductUpdate from your FastAPI backend.

import { Box, Grid, InputAdornment, MenuItem, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";

import { COLORS, RADIUS } from "./shared";

/* ─── Field config ───────────────────────────────────────── */
const CATEGORIES = [
  "Dairy & Eggs", "Beverages", "Snacks & Confectionery", "Grains & Pulses",
  "Fruits & Vegetables", "Bakery", "Frozen Foods", "Personal Care",
  "Household Cleaning", "Health & Wellness", "Baby Products", "Other",
];

/* ─── Animation ──────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, delay, ease: "easeOut" },
});

/* ─── Section wrapper ────────────────────────────────────── */
function FormSection({ title, delay = 0, children }) {
  return (
    <motion.div {...fadeUp(delay)}>
      <Box
        sx={{
          bgcolor: COLORS.white,
          borderRadius: RADIUS,
          border: `1px solid ${COLORS.border}`,
          p: { xs: 2, sm: 2.5 },
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.75 }}>
          <Box sx={{ width: 4, height: 18, borderRadius: 999, bgcolor: "primary.main", flexShrink: 0 }} />
          <Typography sx={{ fontSize: ".75rem", fontWeight: 800, color: COLORS.slate, textTransform: "uppercase", letterSpacing: ".06em" }}>
            {title}
          </Typography>
        </Box>
        {children}
      </Box>
    </motion.div>
  );
}

/* ─── Helper: styled text field ──────────────────────────── */
function Field({ label, name, value, onChange, errors, type = "text", required = false, ...rest }) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      error={!!errors?.[name]}
      helperText={errors?.[name] || " "}
      variant="outlined"
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          fontSize: ".85rem",
          "&:hover fieldset": { borderColor: COLORS.aqua },
          "&.Mui-focused fieldset": { borderColor: COLORS.primary },
        },
        "& .MuiInputLabel-root.Mui-focused": { color: COLORS.primary },
      }}
      {...rest}
    />
  );
}

/* ─── ProductForm ────────────────────────────────────────── */
export default function ProductForm({ form, onChange, errors, isEdit = false }) {
  return (
    <Box>
      {/* ── Product Info ── */}
      <FormSection title="Product Information" delay={0}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Field
              label="Product Name"
              name="name"
              value={form.name}
              onChange={onChange}
              errors={errors}
              required
              inputProps={{ maxLength: 160 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Field
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={onChange}
              errors={errors}
              placeholder="e.g. PROD-001"
              inputProps={{ maxLength: 80 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field label="Category" name="category" value={form.category} onChange={onChange} errors={errors} select>
              <MenuItem value=""><em>None</em></MenuItem>
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Field>
          </Grid>
        </Grid>
      </FormSection>

      {/* ── Pricing ── */}
      <FormSection title="Pricing" delay={0.05}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Field
              label="Selling Price"
              name="selling_price"
              value={form.selling_price}
              onChange={onChange}
              errors={errors}
              type="number"
              required
              inputProps={{ min: 0.01, step: "0.01" }}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field
              label="Cost Price"
              name="cost_price"
              value={form.cost_price}
              onChange={onChange}
              errors={errors}
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            />
          </Grid>
        </Grid>
      </FormSection>

      {/* ── Inventory — only on Add (ProductCreate has stock fields) ── */}
      {!isEdit && (
        <FormSection title="Inventory" delay={0.1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Field
                label="Current Stock"
                name="current_stock"
                value={form.current_stock}
                onChange={onChange}
                errors={errors}
                type="number"
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Field
                label="Reorder Level"
                name="reorder_level"
                value={form.reorder_level}
                onChange={onChange}
                errors={errors}
                type="number"
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Field
                label="Safety Stock"
                name="safety_stock"
                value={form.safety_stock}
                onChange={onChange}
                errors={errors}
                type="number"
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
          </Grid>
        </FormSection>
      )}
    </Box>
  );
}
