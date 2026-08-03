// src/components/products/ProductForm.jsx
// Reusable form for AddProduct and EditProduct.
// Schema mirrors ProductCreate / ProductUpdate from your FastAPI backend.

import {
  Box, Button, Divider, Grid, InputAdornment,
  MenuItem, Stack, TextField, Typography
} from "@mui/material";
import { motion } from "framer-motion";

/* ─── Field config ───────────────────────────────────────── */
const CATEGORIES = [
  "Dairy & Eggs", "Beverages", "Snacks & Confectionery", "Grains & Pulses",
  "Fruits & Vegetables", "Bakery", "Frozen Foods", "Personal Care",
  "Household Cleaning", "Health & Wellness", "Baby Products", "Other",
];

/* ─── Animation ──────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial  : { opacity: 0, y: 14 },
  animate  : { opacity: 1, y: 0  },
  transition: { duration: 0.3, delay, ease: "easeOut" },
});

/* ─── Section wrapper ────────────────────────────────────── */
function FormSection({ title, delay = 0, children }) {
  return (
    <motion.div {...fadeUp(delay)}>
      <Box
        sx={{
          bgcolor     : "#fff",
          borderRadius: 3,
          border      : "1px solid",
          borderColor : "divider",
          p           : { xs: 2.5, sm: 3 },
          mb          : 3,
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: "0.06em", mb: 2.5 }}
        >
          {title}
        </Typography>
        <Divider sx={{ mb: 3 }} />
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
          fontSize: "0.9rem",
        },
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
        <Grid container spacing={2.5}>
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
            <Field
              label="Category"
              name="category"
              value={form.category}
              onChange={onChange}
              errors={errors}
              select
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {CATEGORIES.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Field>
          </Grid>
        </Grid>
      </FormSection>

      {/* ── Pricing ── */}
      <FormSection title="Pricing" delay={0.06}>
        <Grid container spacing={2.5}>
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
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
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
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </FormSection>

      {/* ── Inventory — only on Add (ProductCreate has stock fields) ── */}
      {!isEdit && (
        <FormSection title="Inventory" delay={0.12}>
          <Grid container spacing={2.5}>
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