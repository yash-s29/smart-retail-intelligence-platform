// src/components/inventory/InventoryFilters.jsx

import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

/* ============================================================
   Animation Variants
============================================================ */

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const iconVariants = {
  rest: {
    rotate: 0,
    scale: 1,
  },

  hover: {
    rotate: [0, -8, 8, -4, 0],
    scale: 1.08,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

/* ============================================================
   Filter Field
============================================================ */

const FilterField = ({
  label,
  value,
  onChange,
  options,
  disabled,
  icon,
  allLabel,
}) => {
  return (
    <FormControl
      fullWidth
      size="small"
      disabled={disabled}
      sx={{
        minWidth: 0,
      }}
    >
      <InputLabel
        sx={{
          fontSize: "0.78rem",
          fontWeight: 650,

          color: "#78909C",

          "&.Mui-focused": {
            color: "#23858B",
          },

          "&.Mui-disabled": {
            color: "#A8B8BD",
          },
        }}
      >
        {label}
      </InputLabel>

      <Select
        value={value}
        label={label}
        onChange={onChange}
        IconComponent={(props) => (
          <Box
            component="span"
            {...props}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              right: "10px !important",

              color: "#62AEB2",

              "& svg": {
                fontSize: 20,
              },
            }}
          />
        )}
        sx={{
          minHeight: {
            xs: 46,
            sm: 48,
          },

          borderRadius: "11px",

          bgcolor: "rgba(255,255,255,0.92)",

          fontSize: "0.78rem",

          fontWeight: 650,

          color: "#344D55",

          boxShadow:
            "0 3px 12px rgba(36, 89, 99, 0.035)",

          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            gap: 0.8,

            py: 1.15,
            pr: 5,
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor:
              "rgba(148,190,199,0.24)",
            borderWidth: 1,
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor:
              "rgba(84,191,195,0.48)",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#54BFC3",
            borderWidth: 1.5,

            boxShadow:
              "0 0 0 3px rgba(84,191,195,0.10)",
          },

          "&.Mui-disabled": {
            bgcolor: "rgba(244,248,249,0.8)",
          },

          transition:
            "box-shadow .2s ease, background-color .2s ease, border-color .2s ease",
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 0.6,

              borderRadius: "12px",

              border:
                "1px solid rgba(148,190,199,0.20)",

              boxShadow:
                "0 14px 35px rgba(36,89,99,0.12)",

              "& .MuiMenuItem-root": {
                minHeight: 40,

                borderRadius: "8px",

                mx: 0.5,
                my: 0.25,

                fontSize: "0.77rem",
                fontWeight: 600,

                color: "#405960",

                "&:hover": {
                  bgcolor:
                    "rgba(84,191,195,0.08)",
                },

                "&.Mui-selected": {
                  bgcolor:
                    "rgba(84,191,195,0.12)",

                  color: "#237F85",

                  "&:hover": {
                    bgcolor:
                      "rgba(84,191,195,0.16)",
                  },
                },
              },
            },
          },
        }}
      >
        <MenuItem value="">
          <Stack
            direction="row"
            spacing={0.8}
            alignItems="center"
          >
            <Box
              sx={{
                width: 25,
                height: 25,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: "7px",

                bgcolor:
                  "rgba(84,191,195,0.08)",

                color: "#54AEB2",
              }}
            >
              {icon}
            </Box>

            <Typography
              component="span"
              sx={{
                fontSize: "0.77rem",
                fontWeight: 650,
              }}
            >
              {allLabel}
            </Typography>
          </Stack>
        </MenuItem>

        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

/* ============================================================
   Inventory Filters
============================================================ */

const InventoryFilters = ({
  warehouses = [],
  suppliers = [],
  value = {},
  loading = false,
  onChange,
}) => {
  const shouldReduceMotion = useReducedMotion();

  /* ==========================================================
     Local State
  ========================================================== */

  const [filters, setFilters] = useState({
    warehouse: "",
    supplier: "",
    status: "",
  });

  /* ==========================================================
     Sync External Filters
  ========================================================== */

  useEffect(() => {
    setFilters({
      warehouse: value.warehouse || "",
      supplier: value.supplier || "",
      status: value.status || "",
    });
  }, [value]);

  /* ==========================================================
     Active Filter Count
  ========================================================== */

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  /* ==========================================================
     Handle Filter Change
  ========================================================== */

  const handleChange = (field) => (event) => {
    const updatedFilters = {
      ...filters,
      [field]: event.target.value,
    };

    setFilters(updatedFilters);

    if (typeof onChange === "function") {
      onChange(updatedFilters);
    }
  };

  /* ==========================================================
     Reset Filters
  ========================================================== */

  const handleReset = () => {
    const resetFilters = {
      warehouse: "",
      supplier: "",
      status: "",
    };

    setFilters(resetFilters);

    if (typeof onChange === "function") {
      onChange(resetFilters);
    }
  };

  /* ==========================================================
     Status Options
  ========================================================== */

  const statusOptions = [
    "In Stock",
    "Low Stock",
    "Out of Stock",
    "Overstock",
  ];

  /* ==========================================================
     Render
  ========================================================== */

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          position: "relative",

          mt: {
            xs: 1.5,
            sm: 2,
          },

          mb: {
            xs: 2,
            sm: 2.5,
          },

          p: {
            xs: 1.5,
            sm: 2,
            md: 2.25,
          },

          borderRadius: {
            xs: "15px",
            sm: "18px",
          },

          border:
            "1px solid rgba(148,190,199,0.20)",

          background:
            "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,252,252,0.98) 100%)",

          boxShadow:
            "0 7px 25px rgba(36,89,99,0.055)",

          overflow: "hidden",

          "&::before": {
            content: '""',

            position: "absolute",

            top: 0,
            left: 0,
            right: 0,

            height: 3,

            background:
              "linear-gradient(90deg, #54BFC3 0%, #79D1D3 50%, #B4E5E4 100%)",
          },

          "&::after": {
            content: '""',

            position: "absolute",

            top: -100,
            right: -90,

            width: 230,
            height: 230,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(84,191,195,0.09) 0%, rgba(84,191,195,0.025) 45%, transparent 72%)",

            pointerEvents: "none",
          },
        }}
      >
        {/* ====================================================
            Header
        ==================================================== */}

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
          spacing={{
            xs: 1.25,
            sm: 1.5,
          }}
          sx={{
            position: "relative",
            zIndex: 1,
            mb: {
              xs: 1.5,
              sm: 1.75,
            },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            minWidth={0}
          >
            {/* Animated filter icon */}

            <motion.div
              variants={iconVariants}
              initial="rest"
              whileHover={
                shouldReduceMotion
                  ? "rest"
                  : "hover"
              }
              style={{
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: 36,
                    sm: 40,
                  },

                  height: {
                    xs: 36,
                    sm: 40,
                  },

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: "11px",

                  background:
                    "linear-gradient(135deg, rgba(84,191,195,0.14), rgba(235,249,249,0.9))",

                  border:
                    "1px solid rgba(84,191,195,0.22)",

                  color: "#23858B",

                  boxShadow:
                    "0 5px 15px rgba(84,191,195,0.08)",
                }}
              >
                <FilterAltOutlinedIcon
                  sx={{
                    fontSize: {
                      xs: 19,
                      sm: 21,
                    },
                  }}
                />
              </Box>
            </motion.div>

            <Box minWidth={0}>
              <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: "0.91rem",
                      sm: "0.98rem",
                    },

                    lineHeight: 1.2,

                    fontWeight: 800,

                    color: "#263F47",

                    letterSpacing: "-0.015em",
                  }}
                >
                  Inventory filters
                </Typography>

                {activeFilterCount > 0 && (
                  <Chip
                    label={activeFilterCount}
                    size="small"
                    sx={{
                      height: 21,
                      minWidth: 21,

                      borderRadius: "7px",

                      bgcolor:
                        "rgba(84,191,195,0.12)",

                      color: "#237F85",

                      fontSize: "0.64rem",

                      fontWeight: 800,

                      "& .MuiChip-label": {
                        px: 0.65,
                      },
                    }}
                  />
                )}
              </Stack>

              <Typography
                sx={{
                  mt: 0.3,

                  fontSize: {
                    xs: "0.65rem",
                    sm: "0.69rem",
                  },

                  color: "#80949B",

                  lineHeight: 1.3,
                }}
              >
                Refine inventory by location, supplier and stock status.
              </Typography>
            </Box>
          </Stack>

          {/* Active filter indicator */}

          {activeFilterCount > 0 && (
            <Chip
              size="small"
              label={`${activeFilterCount} active`}
              sx={{
                height: 27,

                borderRadius: "8px",

                bgcolor:
                  "rgba(84,191,195,0.08)",

                border:
                  "1px solid rgba(84,191,195,0.16)",

                color: "#4D777D",

                fontSize: "0.65rem",

                fontWeight: 700,
              }}
            />
          )}
        </Stack>

        {/* ====================================================
            Filter Controls
        ==================================================== */}

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Grid
            container
            spacing={{
              xs: 1,
              sm: 1.25,
            }}
            alignItems="stretch"
          >
            {/* ==================================================
                Warehouse
            ================================================== */}

            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
            >
              <FilterField
                label="Warehouse"
                value={filters.warehouse}
                onChange={handleChange("warehouse")}
                disabled={loading}
                options={warehouses}
                allLabel="All Warehouses"
                icon={
                  <WarehouseOutlinedIcon
                    sx={{ fontSize: 15 }}
                  />
                }
              />
            </Grid>

            {/* ==================================================
                Supplier
            ================================================== */}

            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
            >
              <FilterField
                label="Supplier"
                value={filters.supplier}
                onChange={handleChange("supplier")}
                disabled={loading}
                options={suppliers}
                allLabel="All Suppliers"
                icon={
                  <LocalShippingOutlinedIcon
                    sx={{ fontSize: 15 }}
                  />
                }
              />
            </Grid>

            {/* ==================================================
                Status
            ================================================== */}

            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
            >
              <FilterField
                label="Status"
                value={filters.status}
                onChange={handleChange("status")}
                disabled={loading}
                options={statusOptions}
                allLabel="All Status"
                icon={
                  <Inventory2OutlinedIcon
                    sx={{ fontSize: 15 }}
                  />
                }
              />
            </Grid>

            {/* ==================================================
                Reset
            ================================================== */}

            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
              display="flex"
            >
              <Button
                fullWidth
                variant="outlined"
                disabled={
                  loading || activeFilterCount === 0
                }
                startIcon={
                  <RestartAltRoundedIcon
                    sx={{
                      fontSize: 18,
                    }}
                  />
                }
                onClick={handleReset}
                sx={{
                  minHeight: {
                    xs: 46,
                    sm: 48,
                  },

                  width: "100%",

                  borderRadius: "11px",

                  textTransform: "none",

                  fontSize: "0.76rem",

                  fontWeight: 750,

                  color:
                    activeFilterCount > 0
                      ? "#27777D"
                      : "#9AAEB4",

                  borderColor:
                    activeFilterCount > 0
                      ? "rgba(84,191,195,0.34)"
                      : "rgba(148,190,199,0.20)",

                  background:
                    activeFilterCount > 0
                      ? "rgba(255,255,255,0.82)"
                      : "rgba(247,250,251,0.75)",

                  "&:hover": {
                    borderColor: "#54BFC3",

                    background:
                      "rgba(231,248,249,0.9)",

                    color: "#237F85",

                    transform: {
                      xs: "none",
                      sm: "translateY(-1px)",
                    },

                    boxShadow:
                      "0 6px 15px rgba(84,191,195,0.10)",
                  },

                  "&:active": {
                    transform: "scale(0.98)",
                  },

                  "&.Mui-disabled": {
                    color: "#AAB9BD",

                    borderColor:
                      "rgba(148,190,199,0.16)",

                    background:
                      "rgba(247,250,251,0.65)",
                  },

                  transition:
                    "transform .2s ease, box-shadow .2s ease, background-color .2s ease, border-color .2s ease",
                }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* ====================================================
            Active Filter Summary
        ==================================================== */}

        {activeFilterCount > 0 && (
          <Stack
            direction="row"
            spacing={0.7}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
            sx={{
              position: "relative",
              zIndex: 1,

              mt: 1.4,
              pt: 1.25,

              borderTop:
                "1px solid rgba(148,190,199,0.14)",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.62rem",

                fontWeight: 750,

                color: "#84979D",

                mr: 0.2,
              }}
            >
              Active:
            </Typography>

            {filters.warehouse && (
              <Chip
                size="small"
                label={`Warehouse: ${filters.warehouse}`}
                sx={{
                  height: 25,

                  borderRadius: "7px",

                  bgcolor:
                    "rgba(84,191,195,0.08)",

                  border:
                    "1px solid rgba(84,191,195,0.15)",

                  color: "#3F7378",

                  fontSize: "0.62rem",

                  fontWeight: 650,
                }}
              />
            )}

            {filters.supplier && (
              <Chip
                size="small"
                label={`Supplier: ${filters.supplier}`}
                sx={{
                  height: 25,

                  borderRadius: "7px",

                  bgcolor:
                    "rgba(84,191,195,0.08)",

                  border:
                    "1px solid rgba(84,191,195,0.15)",

                  color: "#3F7378",

                  fontSize: "0.62rem",

                  fontWeight: 650,
                }}
              />
            )}

            {filters.status && (
              <Chip
                size="small"
                label={`Status: ${filters.status}`}
                sx={{
                  height: 25,

                  borderRadius: "7px",

                  bgcolor:
                    "rgba(251,248,241,0.82)",

                  border:
                    "1px solid rgba(194,177,142,0.18)",

                  color: "#756A5B",

                  fontSize: "0.62rem",

                  fontWeight: 650,
                }}
              />
            )}
          </Stack>
        )}
      </Box>
    </motion.div>
  );
};

/* ============================================================
   PropTypes
============================================================ */

InventoryFilters.propTypes = {
  warehouses: PropTypes.array,
  suppliers: PropTypes.array,
  value: PropTypes.object,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
};

InventoryFilters.defaultProps = {
  warehouses: [],
  suppliers: [],
  value: {},
  loading: false,
  onChange: () => {},
};

export default InventoryFilters;
