import React, { useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "lucide-react";

const ProductSelector = ({
  products = [],
  loading = false,
  error = "",
  onSelect,
}) => {
  const [keyword, setKeyword] = useState("");

  /* ==========================================
      Search Products
  ========================================== */

  const filteredProducts = useMemo(() => {
    if (!keyword) return products;

    const search = keyword.toLowerCase();

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search)
      );
    });
  }, [keyword, products]);

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Select Product
      </Typography>

      <Autocomplete
        fullWidth
        options={filteredProducts}
        loading={loading}
        getOptionLabel={(option) => option.name || ""}
        onChange={(_, value) => value && onSelect(value)}
        noOptionsText="No matching products found"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Product"
            placeholder="Product name, SKU..."
            error={Boolean(error)}
            helperText={error}
            onChange={(e) => setKeyword(e.target.value)}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <Search size={18} style={{ marginRight: 8 }} />
                  {/* Added optional chaining to prevent undefined crash */}
                  {params.InputProps?.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {loading && <CircularProgress size={20} />}
                  {/* Added optional chaining to prevent undefined crash */}
                  {params.InputProps?.endAdornment}
                </>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 56,
                borderRadius: 3,
              },
            }}
          />
        )}
        renderOption={(props, option) => {
          // MUI v5+ injects a key into props automatically. 
          // We extract it here to avoid React warnings about passing keys incorrectly.
          const { key, ...optionProps } = props;
          
          return (
            <Box
              component="li"
              key={option.id || key}
              {...optionProps}
              sx={{
                py: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={700}>{option.name}</Typography>
                <Typography color="success.main" fontWeight={700}>
                  ₹{option.selling_price}
                </Typography>
              </Stack>
              
              <Stack
                direction="row"
                spacing={1}
                mt={1}
                flexWrap="wrap"
                useFlexGap
              >
                <Chip
                  size="small"
                  label={option.category || "General"}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={`SKU: ${option.sku || "N/A"}`}
                  variant="outlined"
                />
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                mt={1.5}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                <Typography variant="body2" color="text.secondary">
                  Stock :{" "}
                  <strong>{option.inventory?.current_stock ?? 0}</strong>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Warehouse :{" "}
                  <strong>{option.inventory?.warehouse ?? "Main Warehouse"}</strong>
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                mt={1}
                flexWrap="wrap"
                useFlexGap
              >
                {(option.inventory?.current_stock ?? 0) <= 0 ? (
                  <Chip size="small" color="error" label="Out Of Stock" />
                ) : (option.inventory?.current_stock ?? 0) <=
                  (option.inventory?.minimum_stock ?? 10) ? (
                  <Chip size="small" color="warning" label="Low Stock" />
                ) : (
                  <Chip size="small" color="success" label="In Stock" />
                )}

                <Chip
                  size="small"
                  variant="outlined"
                  label={option.inventory?.status || "Available"}
                />
              </Stack>
            </Box>
          );
        }}
      />

      <Alert
        severity="info"
        sx={{
          mt: 3,
          borderRadius: 2,
        }}
      >
        Select a product to automatically load its selling price and validate available stock before creating the sale.
      </Alert>
    </Box>
  );
};

export default ProductSelector;