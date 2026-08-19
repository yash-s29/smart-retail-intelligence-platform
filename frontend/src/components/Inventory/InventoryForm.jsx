// src/components/inventory/InventoryForm.jsx

import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

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

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";

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
// Animation Variants
// ======================================================

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.055,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const iconFloatVariants = {
  animate: {
    y: [0, -3, 0],
    rotate: [0, 2, 0, -2, 0],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ======================================================
// Color Palette
// Light Sea-Water + White + Soft Beige
// ======================================================

const COLORS = {
  primary: "#168AAD",
  primaryDark: "#0F7897",
  primaryDeep: "#075985",

  aqua: "#E8F8FC",
  aquaSoft: "#F1FBFD",
  aquaPale: "#F7FCFD",

  cyan: "#22B8CF",

  ink: "#17324D",
  slate: "#64748B",
  muted: "#8A9AAF",

  border: "#D9EAF0",
  beige: "#FAF8F2",
  white: "#FFFFFF",

  success: "#16A085",
};

// ======================================================
// Small Section Header
// ======================================================

const SectionHeader = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      sx={{ mb: 2 }}
    >
      <motion.div
        variants={iconFloatVariants}
        animate="animate"
        style={{ display: "flex" }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background:
              "linear-gradient(135deg, rgba(22,138,173,.14), rgba(34,184,207,.06))",

            border: `1px solid ${COLORS.border}`,

            color: COLORS.primary,

            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </motion.div>

      <Box minWidth={0}>
        <Typography
          sx={{
            fontSize: ".86rem",
            fontWeight: 800,
            color: COLORS.ink,
            letterSpacing: "-.01em",
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              fontSize: ".68rem",
              color: COLORS.slate,
              mt: 0.15,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

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
  // Reset Form
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
  // Shared Text Field Styling
  // ======================================================

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: 48,
      borderRadius: "11px",

      bgcolor: COLORS.white,

      transition:
        "border-color .2s ease, box-shadow .2s ease, background-color .2s ease",

      "& fieldset": {
        borderColor: COLORS.border,
        transition: "border-color .2s ease",
      },

      "&:hover": {
        bgcolor: "#FCFEFF",

        "& fieldset": {
          borderColor: "#A9D8E5",
        },
      },

      "&.Mui-focused": {
        bgcolor: COLORS.white,

        boxShadow:
          "0 0 0 3px rgba(22,138,173,.09)",

        "& fieldset": {
          borderColor: COLORS.primary,
          borderWidth: 1.5,
        },
      },

      "&.Mui-error": {
        boxShadow:
          "0 0 0 3px rgba(211,47,47,.06)",
      },
    },

    "& .MuiInputLabel-root": {
      color: COLORS.slate,
      fontSize: ".78rem",
      fontWeight: 600,

      "&.Mui-focused": {
        color: COLORS.primary,
      },
    },

    "& .MuiInputBase-input": {
      fontSize: ".82rem",
      fontWeight: 550,
      color: COLORS.ink,
    },

    "& .MuiFormHelperText-root": {
      fontSize: ".65rem",
      mx: 0.5,
      mt: 0.5,
    },
  };

  // ======================================================
  // Autocomplete Styling
  // ======================================================

  const autocompleteSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: 48,
      borderRadius: "11px",
      bgcolor: COLORS.white,

      transition:
        "border-color .2s ease, box-shadow .2s ease, background-color .2s ease",

      "& fieldset": {
        borderColor: COLORS.border,
      },

      "&:hover fieldset": {
        borderColor: "#A9D8E5",
      },

      "&.Mui-focused": {
        boxShadow:
          "0 0 0 3px rgba(22,138,173,.09)",

        "& fieldset": {
          borderColor: COLORS.primary,
          borderWidth: 1.5,
        },
      },

      "& .MuiInputBase-input": {
        fontSize: ".82rem",
        fontWeight: 550,
        color: COLORS.ink,
      },
    },

    "& .MuiInputLabel-root": {
      fontSize: ".78rem",
      fontWeight: 600,

      "&.Mui-focused": {
        color: COLORS.primary,
      },
    },

    "& .MuiFormHelperText-root": {
      fontSize: ".65rem",
    },
  };

  // ======================================================
  // Button Styling
  // ======================================================

  const buttonSx = {
    minHeight: 44,
    borderRadius: "11px",

    fontSize: ".76rem",
    fontWeight: 750,

    textTransform: "none",

    transition:
      "transform .2s ease, box-shadow .2s ease, background .2s ease",

    "&:hover": {
      transform: "translateY(-2px)",
    },

    "&:active": {
      transform: "scale(.98)",
    },
  };

  // ======================================================
  // Submit
  // ======================================================

  const handleFormSubmit = (data) => {
    onSubmit({
      product_id: data.product?.id,
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",

          borderRadius: {
            xs: "16px",
            sm: "18px",
            md: "20px",
          },

          border: `1px solid ${COLORS.border}`,

          background:
            "linear-gradient(145deg, #FFFFFF 0%, #FBFEFF 55%, #F8FCFA 100%)",

          boxShadow:
            "0 10px 35px rgba(22, 70, 90, .055)",

          transition:
            "transform .3s ease, box-shadow .3s ease",

          "&:hover": {
            boxShadow:
              "0 18px 48px rgba(22, 70, 90, .085)",
          },

          "&::before": {
            content: '""',
            position: "absolute",
            top: -160,
            right: -120,

            width: 340,
            height: 340,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(34,184,207,.11) 0%, rgba(34,184,207,.035) 42%, transparent 72%)",

            pointerEvents: "none",
          },

          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -180,
            left: -120,

            width: 360,
            height: 360,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(22,138,173,.075) 0%, rgba(22,138,173,.025) 40%, transparent 72%)",

            pointerEvents: "none",
          },
        }}
      >
        {/* ==================================================
            Top Accent
        ================================================== */}

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,

            background:
              "linear-gradient(90deg, #0F7897 0%, #22B8CF 50%, #6CCBD9 100%)",

            zIndex: 2,
          }}
        />

        {/* ==================================================
            Main Content
        ================================================== */}

        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{
            position: "relative",
            zIndex: 1,

            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          {/* ==================================================
              Form Header
          ================================================== */}

          <motion.div variants={itemVariants}>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              spacing={1.5}
              sx={{ mb: 2.5 }}
            >
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: 40,
                        sm: 44,
                      },

                      height: {
                        xs: 40,
                        sm: 44,
                      },

                      borderRadius: "12px",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      color: COLORS.primary,

                      background:
                        "linear-gradient(135deg, rgba(22,138,173,.13), rgba(34,184,207,.05))",

                      border:
                        `1px solid ${COLORS.border}`,

                      boxShadow:
                        "0 6px 18px rgba(22,138,173,.08)",
                    }}
                  >
                    <Inventory2RoundedIcon
                      sx={{
                        fontSize: {
                          xs: 20,
                          sm: 22,
                        },
                      }}
                    />
                  </Box>
                </motion.div>

                <Box>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "1rem",
                        sm: "1.12rem",
                      },

                      fontWeight: 850,
                      color: COLORS.ink,

                      letterSpacing: "-.025em",
                      lineHeight: 1.2,
                    }}
                  >
                    {mode === "add"
                      ? "Add inventory"
                      : "Edit inventory"}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: ".68rem",
                      color: COLORS.slate,
                      mt: 0.3,
                    }}
                  >
                    {mode === "add"
                      ? "Add stock details to your inventory"
                      : "Update inventory information"}
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.65,

                    borderRadius: "8px",

                    bgcolor: COLORS.aquaSoft,

                    border:
                      `1px solid ${COLORS.border}`,

                    color: COLORS.primary,

                    fontSize: ".64rem",
                    fontWeight: 750,
                  }}
                >
                  Inventory control
                </Box>
              </Box>
            </Stack>
          </motion.div>

          {/* ==================================================
              Product & Stock Section
          ================================================== */}

          <motion.div variants={itemVariants}>
            <Box
              sx={{
                p: {
                  xs: 1.5,
                  sm: 2,
                },

                mb: 1.75,

                borderRadius: "14px",

                bgcolor:
                  "rgba(247,252,253,.75)",

                border:
                  `1px solid ${COLORS.border}`,
              }}
            >
              <SectionHeader
                icon={
                  <CategoryRoundedIcon
                    sx={{ fontSize: 19 }}
                  />
                }
                title="Product & stock"
                subtitle="Set the product and current inventory levels"
              />

              <Grid
                container
                spacing={{
                  xs: 1.5,
                  sm: 2,
                }}
              >
                {/* Product */}

                <Grid item xs={12} md={6}>
                  <Controller
                    name="product"
                    control={control}
                    rules={{
                      required:
                        "Please select a product",
                    }}
                    render={({ field }) => (
                      <Autocomplete
                        options={products || []}
                        loading={loading}
                        value={field.value ?? null}
                        onChange={(_, value) =>
                          field.onChange(value)
                        }
                        getOptionLabel={(option) =>
                          option?.name || ""
                        }
                        isOptionEqualToValue={(
                          option,
                          value
                        ) =>
                          option?.id === value?.id
                        }
                        sx={autocompleteSx}
                        renderOption={(
                          props,
                          option
                        ) => (
                          <Box
                            component="li"
                            {...props}
                            key={option?.id ?? props.key}
                            sx={{
                              "&:hover":
                                {
                                  bgcolor:
                                    `${COLORS.aqua} !important`,
                                },
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Inventory2RoundedIcon
                                sx={{
                                  fontSize: 17,
                                  color:
                                    COLORS.primary,
                                }}
                              />

                              <Typography
                                sx={{
                                  fontSize:
                                    ".78rem",
                                  fontWeight: 650,
                                }}
                              >
                                {option?.name}
                              </Typography>
                            </Stack>
                          </Box>
                        )}
                        renderInput={(params) => {
                          const {
                            InputProps = {},
                            ...restParams
                          } = params || {};

                          return (
                            <TextField
                              {...restParams}
                              label="Product"
                              placeholder="Select product"
                              error={
                                !!errors.product
                              }
                              helperText={
                                errors.product
                                  ?.message
                              }
                              sx={textFieldSx}
                              InputProps={{
                                ...InputProps,
                                endAdornment: (
                                  <>
                                    {loading ? (
                                      <CircularProgress
                                        size={16}
                                        sx={{
                                          color:
                                            COLORS.primary,
                                        }}
                                      />
                                    ) : null}
                                    {
                                      InputProps.endAdornment
                                    }
                                  </>
                                ),
                              }}
                            />
                          );
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Current */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                >
                  <Controller
                    name="current_stock"
                    control={control}
                    rules={{
                      required:
                        "Current stock is required",
                      min: {
                        value: 0,
                        message:
                          "Current stock cannot be negative",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Current stock"
                        error={
                          !!errors.current_stock
                        }
                        helperText={
                          errors.current_stock
                            ?.message
                        }
                        sx={textFieldSx}
                        inputProps={{
                          min: 0,
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Minimum */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                >
                  <Controller
                    name="minimum_stock"
                    control={control}
                    rules={{
                      required:
                        "Minimum stock is required",
                      min: {
                        value: 0,
                        message:
                          "Minimum stock cannot be negative",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Minimum stock"
                        error={
                          !!errors.minimum_stock
                        }
                        helperText={
                          errors.minimum_stock
                            ?.message
                        }
                        sx={textFieldSx}
                        inputProps={{
                          min: 0,
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Maximum */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <Controller
                    name="maximum_stock"
                    control={control}
                    rules={{
                      required:
                        "Maximum stock is required",
                      min: {
                        value: 1,
                        message:
                          "Maximum stock must be greater than 0",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Maximum stock"
                        error={
                          !!errors.maximum_stock
                        }
                        helperText={
                          errors.maximum_stock
                            ?.message
                        }
                        sx={textFieldSx}
                        inputProps={{
                          min: 1,
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Reorder */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <Controller
                    name="reorder_level"
                    control={control}
                    rules={{
                      required:
                        "Reorder level is required",
                      min: {
                        value: 0,
                        message:
                          "Reorder level cannot be negative",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Reorder level"
                        error={
                          !!errors.reorder_level
                        }
                        helperText={
                          errors.reorder_level
                            ?.message
                        }
                        sx={textFieldSx}
                        inputProps={{
                          min: 0,
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Safety */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <Controller
                    name="safety_stock"
                    control={control}
                    rules={{
                      required:
                        "Safety stock is required",
                      min: {
                        value: 0,
                        message:
                          "Safety stock cannot be negative",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Safety stock"
                        error={
                          !!errors.safety_stock
                        }
                        helperText={
                          errors.safety_stock
                            ?.message
                        }
                        sx={textFieldSx}
                        inputProps={{
                          min: 0,
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          {/* ==================================================
              Warehouse & Supplier
          ================================================== */}

          <motion.div variants={itemVariants}>
            <Box
              sx={{
                p: {
                  xs: 1.5,
                  sm: 2,
                },

                mb: 1.75,

                borderRadius: "14px",

                bgcolor:
                  "rgba(255,255,255,.9)",

                border:
                  `1px solid ${COLORS.border}`,
              }}
            >
              <SectionHeader
                icon={
                  <WarehouseRoundedIcon
                    sx={{ fontSize: 19 }}
                  />
                }
                title="Storage & supplier"
                subtitle="Define where stock is stored and sourced"
              />

              <Grid
                container
                spacing={{
                  xs: 1.5,
                  sm: 2,
                }}
              >
                {/* Warehouse */}

                <Grid item xs={12} md={6}>
                  <Controller
                    name="warehouse"
                    control={control}
                    rules={{
                      required:
                        "Warehouse is required",
                    }}
                    render={({ field }) => (
                      <Autocomplete
                        freeSolo
                        options={warehouseOptions}
                        value={field.value ?? ""}
                        onChange={(_, value) =>
                          field.onChange(value ?? "")
                        }
                        onInputChange={(
                          _,
                          value
                        ) =>
                          field.onChange(value)
                        }
                        sx={autocompleteSx}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            label="Warehouse"
                            placeholder="Select or enter warehouse"
                            error={
                              !!errors.warehouse
                            }
                            helperText={
                              errors.warehouse
                                ?.message
                            }
                            sx={textFieldSx}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                {/* Supplier */}

                <Grid item xs={12} md={6}>
                  <Controller
                    name="supplier"
                    control={control}
                    rules={{
                      required:
                        "Supplier is required",
                    }}
                    render={({ field }) => (
                      <Autocomplete
                        freeSolo
                        options={supplierOptions}
                        value={field.value ?? ""}
                        onChange={(_, value) =>
                          field.onChange(value ?? "")
                        }
                        onInputChange={(
                          _,
                          value
                        ) =>
                          field.onChange(value)
                        }
                        sx={autocompleteSx}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            label="Supplier"
                            placeholder="Select or enter supplier"
                            error={
                              !!errors.supplier
                            }
                            helperText={
                              errors.supplier
                                ?.message
                            }
                            sx={textFieldSx}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                {/* Status */}

                <Grid item xs={12} md={6}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Inventory status"
                        sx={textFieldSx}
                      >
                        {statusOptions.map(
                          (status) => (
                            <MenuItem
                              key={status}
                              value={status}
                              sx={{
                                fontSize:
                                  ".78rem",
                              }}
                            >
                              {status}
                            </MenuItem>
                          )
                        )}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          {/* ==================================================
              Smart Inventory Information
          ================================================== */}

          <motion.div variants={itemVariants}>
            <Box
              sx={{
                mb: 1.75,

                p: {
                  xs: 1.5,
                  sm: 1.75,
                },

                borderRadius: "13px",

                background:
                  "linear-gradient(135deg, #F0FAFC 0%, #FAFBF7 100%)",

                border:
                  `1px solid ${COLORS.border}`,

                display: "flex",

                alignItems: "flex-start",

                gap: 1.25,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "9px",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  bgcolor: COLORS.white,

                  color: COLORS.primary,

                  border:
                    `1px solid ${COLORS.border}`,

                  flexShrink: 0,
                }}
              >
                <TuneRoundedIcon
                  sx={{ fontSize: 17 }}
                />
              </Box>

              <Box minWidth={0}>
                <Typography
                  sx={{
                    fontSize: ".73rem",
                    fontWeight: 800,
                    color: COLORS.ink,
                  }}
                >
                  Inventory controls
                </Typography>

                <Typography
                  sx={{
                    fontSize: ".66rem",
                    lineHeight: 1.55,
                    color: COLORS.slate,
                    mt: 0.2,
                  }}
                >
                  Stock limits and reorder values help
                  maintain accurate inventory alerts and
                  replenishment decisions.
                </Typography>
              </Box>
            </Box>
          </motion.div>

          {/* ==================================================
              Actions
          ================================================== */}

          <motion.div variants={itemVariants}>
            <Stack
              direction={{
                xs: "column-reverse",
                sm: "row",
              }}
              justifyContent="flex-end"
              spacing={1}
              sx={{
                pt: 0.5,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                disabled={loading}
                onClick={() => reset()}
                startIcon={
                  <RestartAltRoundedIcon
                    sx={{ fontSize: 17 }}
                  />
                }
                sx={{
                  ...buttonSx,

                  minWidth: {
                    xs: "100%",
                    sm: 120,
                  },

                  color: COLORS.slate,

                  borderColor: COLORS.border,

                  bgcolor: COLORS.white,

                  "&:hover": {
                    borderColor: "#A9D8E5",
                    bgcolor: COLORS.aquaSoft,
                    color: COLORS.primary,
                  },
                }}
              >
                Reset
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={17}
                      color="inherit"
                    />
                  ) : (
                    <SaveRoundedIcon
                      sx={{ fontSize: 17 }}
                    />
                  )
                }
                sx={{
                  ...buttonSx,

                  minWidth: {
                    xs: "100%",
                    sm: 185,
                  },

                  color: COLORS.white,

                  background:
                    "linear-gradient(135deg, #168AAD 0%, #22A6C5 100%)",

                  boxShadow:
                    "0 7px 20px rgba(22,138,173,.20)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0F7897 0%, #168AAD 100%)",

                    boxShadow:
                      "0 10px 26px rgba(22,138,173,.28)",
                  },

                  "&.Mui-disabled": {
                    color: COLORS.white,
                    opacity: 0.7,
                  },
                }}
              >
                {loading
                  ? mode === "add"
                    ? "Adding inventory..."
                    : "Updating inventory..."
                  : submitButtonText ||
                    (mode === "add"
                      ? "Add inventory"
                      : "Update inventory")}
              </Button>
            </Stack>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

// ======================================================
// PropTypes
// ======================================================

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

// ======================================================
// Default Props
// ======================================================

InventoryForm.defaultProps = {
  mode: "add",

  initialValues: {},

  defaultValues: {},

  products: [],

  loading: false,

  submitButtonText: undefined,
};

export default InventoryForm;
