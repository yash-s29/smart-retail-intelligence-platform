import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

const InventoryFilters = ({
  warehouses = [],
  suppliers = [],
  value = {},
  loading = false,
  onChange,
}) => {

  // ==========================================================
  // Local State
  // ==========================================================

  const [filters, setFilters] = useState({
    warehouse: "",
    supplier: "",
    status: "",
  });

  // ==========================================================
  // Sync External Filters
  // ==========================================================

  useEffect(() => {
    setFilters({
      warehouse: value.warehouse || "",
      supplier: value.supplier || "",
      status: value.status || "",
    });
  }, [value]);

  // ==========================================================
  // Handle Filter Change
  // ==========================================================

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

  // ==========================================================
  // Reset Filters
  // ==========================================================

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

  // ==========================================================
  // Shared Select Styling
  // ==========================================================

  const selectSx = {
    minHeight: 48,

    borderRadius: 2,

    bgcolor: "background.paper",

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "divider",
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "primary.main",
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: 2,
    },
  };

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <Box
      sx={{
        mt: 2,
        mb: 3,
      }}
    >

      {/* ======================================================
          Section Header
      ====================================================== */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={1}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
        >
          Filter Inventory
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          
        </Typography>
      </Stack>

      <Grid
        container
        spacing={2}
        alignItems="stretch"
      >

        {/* ======================================================
            Warehouse
        ====================================================== */}
                <Grid item xs={12} sm={6} lg={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Warehouse</InputLabel>

            <Select
              value={filters.warehouse}
              label="Warehouse"
              disabled={loading}
              onChange={handleChange("warehouse")}
              sx={selectSx}
            >
              <MenuItem value="">All Warehouses</MenuItem>

              {warehouses.map((warehouse) => (
                <MenuItem
                  key={warehouse}
                  value={warehouse}
                >
                  {warehouse}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* ======================================================
            Supplier
        ====================================================== */}

        <Grid item xs={12} sm={6} lg={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Supplier</InputLabel>

            <Select
              value={filters.supplier}
              label="Supplier"
              disabled={loading}
              onChange={handleChange("supplier")}
              sx={selectSx}
            >
              <MenuItem value="">All Suppliers</MenuItem>

              {suppliers.map((supplier) => (
                <MenuItem
                  key={supplier}
                  value={supplier}
                >
                  {supplier}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* ======================================================
            Status
        ====================================================== */}

        <Grid item xs={12} sm={6} lg={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>

            <Select
              value={filters.status}
              label="Status"
              disabled={loading}
              onChange={handleChange("status")}
              sx={selectSx}
            >
              <MenuItem value="">
                All Status
              </MenuItem>

              <MenuItem value="In Stock">
                In Stock
              </MenuItem>

              <MenuItem value="Low Stock">
                Low Stock
              </MenuItem>

              <MenuItem value="Out of Stock">
                Out of Stock
              </MenuItem>

              <MenuItem value="Overstock">
                Overstock
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* ======================================================
            Reset Button
        ====================================================== */}

        <Grid
          item
          xs={12}
          sm={6}
          lg={3}
          display="flex"
          alignItems="stretch"
        >
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={handleReset}
            sx={{
              minHeight: 48,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              transition: "all .25s ease",

              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            Reset Filters
          </Button>
        </Grid>

      </Grid>
    </Box>
  );
};

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