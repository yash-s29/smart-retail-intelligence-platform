import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// ======================================================
// Static Options
// ======================================================

const warehouseOptions = [
  "Main Warehouse",
  "Warehouse A",
  "Warehouse B",
  "Mumbai Warehouse",
  "Pune Warehouse",
];

const supplierOptions = [
  "ABC Suppliers",
  "Reliance",
  "Nestle",
  "ITC",
  "Local Vendor",
];

const statusOptions = [
  "In Stock",
  "Low Stock",
  "Out of Stock",
  "Overstock",
];

// ======================================================
// Component
// ======================================================

const InventoryForm = ({
  mode = "add",
  initialValues = {},
  defaultValues = {},
  products = [],
  loading = false,
  submitButtonText,
  onSubmit,
}) => {
  // ======================================================
  // Source Values
  // ======================================================

 const sourceValues = useMemo(() => {
  if (
    initialValues &&
    typeof initialValues === "object" &&
    Object.keys(initialValues).length > 0
  ) {
    return initialValues;
  }

  return defaultValues || {};
}, [initialValues, defaultValues]);

  // ======================================================
  // React Hook Form
  // ======================================================

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product: null,
      current_stock: 0,
      minimum_stock: 10,
      maximum_stock: 100,
      reorder_level: 20,
      safety_stock: 20,
      warehouse: "",
      supplier: "",
      status: "In Stock",
    },
  });

  // ======================================================
  // Reset Form (Edit Mode)
  // ======================================================

  useEffect(() => {
    if (
      sourceValues &&
      Object.keys(sourceValues).length > 0
    ) {
      const selectedProduct =
        products.find(
          (product) =>
            product.id === sourceValues.product_id
        ) || null;

      reset({
        product: selectedProduct,
        current_stock:
          sourceValues.current_stock ?? 0,
        minimum_stock:
          sourceValues.minimum_stock ?? 10,
        maximum_stock:
          sourceValues.maximum_stock ?? 100,
        reorder_level:
          sourceValues.reorder_level ?? 20,
        safety_stock:
          sourceValues.safety_stock ?? 20,
        warehouse:
          sourceValues.warehouse ?? "",
        supplier:
          sourceValues.supplier ?? "",
        status:
          sourceValues.status ?? "In Stock",
      });
    }
  }, [sourceValues, products, reset]);

  // ======================================================
  // Shared Styles
  // ======================================================

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: 48,
      borderRadius: 2,
      transition: "all .25s ease",

      "& fieldset": {
        borderColor: "divider",
      },

      "&:hover fieldset": {
        borderColor: "primary.main",
      },

      "&.Mui-focused fieldset": {
        borderWidth: 2,
      },
    },

    "& .MuiInputLabel-root": {
      fontWeight: 500,
    },
  };

  const buttonSx = {
    minWidth: 170,
    height: 48,
    borderRadius: 2,
    fontWeight: 700,
    textTransform: "none",
    transition: "all .25s ease",

    "&:hover": {
      transform: "translateY(-2px)",
    },
  };

  // ======================================================
  // Submit
  // ======================================================

  const handleFormSubmit = (data) => {
    onSubmit({
      product_id: data.product.id,
      current_stock: Number(data.current_stock),
      minimum_stock: Number(data.minimum_stock),
      maximum_stock: Number(data.maximum_stock),
      reorder_level: Number(data.reorder_level),
      safety_stock: Number(data.safety_stock),
      warehouse: data.warehouse,
      supplier: data.supplier,
      status: data.status,
    });
  };

  // ======================================================
  // Render
  // ======================================================

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Stack
          spacing={0.5}
          sx={{ mb: 4 }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
          >
            {mode === "add"
              ? "Add Inventory"
              : "Edit Inventory"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Fill in the inventory details below. Fields marked
            as required must be completed before submitting.
          </Typography>
        </Stack>

        <Grid
          container
          spacing={3}
        >
              {/* ======================================================
            Product
        ====================================================== */}

        <Grid item xs={12} md={6}>
          <Controller
            name="product"
            control={control}
            rules={{
              required: "Please select a product",
            }}
            render={({ field }) => (
              <Autocomplete
                options={products}
                loading={loading}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.id === value.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product"
                    placeholder="Select Product"
                    error={!!errors.product}
                    helperText={errors.product?.message}
                    sx={textFieldSx}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* ======================================================
            Current Stock
        ====================================================== */}

        <Grid item xs={12} sm={6} md={3}>
          <Controller
            name="current_stock"
            control={control}
            rules={{
              required: "Current stock is required",
              min: {
                value: 0,
                message: "Current stock cannot be negative",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="Current Stock"
                error={!!errors.current_stock}
                helperText={errors.current_stock?.message}
                sx={textFieldSx}
                inputProps={{
                  min: 0,
                }}
              />
            )}
          />
        </Grid>

        {/* ======================================================
            Minimum Stock
        ====================================================== */}

        <Grid item xs={12} sm={6} md={3}>
          <Controller
            name="minimum_stock"
            control={control}
            rules={{
              required: "Minimum stock is required",
              min: {
                value: 0,
                message: "Minimum stock cannot be negative",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="Minimum Stock"
                error={!!errors.minimum_stock}
                helperText={errors.minimum_stock?.message}
                sx={textFieldSx}
                inputProps={{
                  min: 0,
                }}
              />
            )}
          />
        </Grid>

        {/* ======================================================
            Maximum Stock
        ====================================================== */}

        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="maximum_stock"
            control={control}
            rules={{
              required: "Maximum stock is required",
              min: {
                value: 1,
                message: "Maximum stock must be greater than 0",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="Maximum Stock"
                error={!!errors.maximum_stock}
                helperText={errors.maximum_stock?.message}
                sx={textFieldSx}
                inputProps={{
                  min: 1,
                }}
              />
            )}
          />
        </Grid>

        {/* ======================================================
            Reorder Level
        ====================================================== */}

        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="reorder_level"
            control={control}
            rules={{
              required: "Reorder level is required",
              min: {
                value: 0,
                message: "Reorder level cannot be negative",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="Reorder Level"
                error={!!errors.reorder_level}
                helperText={errors.reorder_level?.message}
                sx={textFieldSx}
                inputProps={{
                  min: 0,
                }}
              />
            )}
          />
        </Grid>

        {/* ======================================================
            Safety Stock
        ====================================================== */}

        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="safety_stock"
            control={control}
            rules={{
              required: "Safety stock is required",
              min: {
                value: 0,
                message: "Safety stock cannot be negative",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="Safety Stock"
                error={!!errors.safety_stock}
                helperText={errors.safety_stock?.message}
                sx={textFieldSx}
                inputProps={{
                  min: 0,
                }}
              />
            )}
          />
        </Grid>
                {/* ======================================================
            Warehouse
        ====================================================== */}

        <Grid item xs={12} md={6}>
          <Controller
            name="warehouse"
            control={control}
            rules={{
              required: "Warehouse is required",
            }}
            render={({ field }) => (
              <Autocomplete
                freeSolo
                options={warehouseOptions}
                value={field.value}
                onInputChange={(_, value) =>
                  field.onChange(value)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Warehouse"
                    placeholder="Select or Enter Warehouse"
                    error={!!errors.warehouse}
                    helperText={errors.warehouse?.message}
                    sx={textFieldSx}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* ======================================================
            Supplier
        ====================================================== */}

        <Grid item xs={12} md={6}>
          <Controller
            name="supplier"
            control={control}
            rules={{
              required: "Supplier is required",
            }}
            render={({ field }) => (
              <Autocomplete
                freeSolo
                options={supplierOptions}
                value={field.value}
                onInputChange={(_, value) =>
                  field.onChange(value)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Supplier"
                    placeholder="Select or Enter Supplier"
                    error={!!errors.supplier}
                    helperText={errors.supplier?.message}
                    sx={textFieldSx}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* ======================================================
            Inventory Status
        ====================================================== */}

        <Grid item xs={12} md={6}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Inventory Status"
                sx={textFieldSx}
              >
                {statusOptions.map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                  >
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* ======================================================
            Information Card
        ====================================================== */}

        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              mt: 1,
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.default",
            }}
          >
            <Stack spacing={1}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Inventory Information
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.8,
                }}
              >
                Configure inventory limits, warehouse,
                supplier, and stock status. These values
                help manage inventory monitoring,
                low-stock alerts, future forecasting,
                and reorder recommendations while keeping
                stock levels accurate across your
                warehouses.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
                {/* ======================================================
            Action Buttons
        ====================================================== */}

        <Grid item xs={12}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="flex-end"
            spacing={2}
            sx={{
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              disabled={loading}
              onClick={() => reset()}
              sx={buttonSx}
            >
              Reset
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                ...buttonSx,
                minWidth: 200,
              }}
              startIcon={
                loading ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : null
              }
            >
              {loading
                ? mode === "add"
                  ? "Adding Inventory..."
                  : "Updating Inventory..."
                : submitButtonText ||
                  (mode === "add"
                    ? "Add Inventory"
                    : "Update Inventory")}
            </Button>
          </Stack>
        </Grid>

      </Grid>

      </Box>
    </Paper>
  );
};

InventoryForm.propTypes = {
  mode: PropTypes.oneOf([
    "add",
    "edit",
  ]),

  initialValues: PropTypes.object,

  defaultValues: PropTypes.object,

  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,

      name: PropTypes.string.isRequired,
    })
  ),

  loading: PropTypes.bool,

  submitButtonText: PropTypes.string,

  onSubmit: PropTypes.func.isRequired,
};

InventoryForm.defaultProps = {
  mode: "add",

  initialValues: {},

  defaultValues: {},

  products: [],

  loading: false,

  submitButtonText: undefined,
};

export default InventoryForm;