import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Stack,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

const InventorySearch = ({
  value = "",
  placeholder = "Search by Product, SKU or Supplier...",
  loading = false,
  onSearch,
}) => {

  // ==========================================================
  // Local State
  // ==========================================================

  const [searchValue, setSearchValue] = useState(value);

  // ==========================================================
  // Sync External Value
  // ==========================================================

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  // ==========================================================
  // Debounced Search
  // ==========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onSearch === "function") {
        onSearch(searchValue.trim());
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch]);

  // ==========================================================
  // Clear Search
  // ==========================================================

  const handleClear = () => {
    setSearchValue("");

    if (typeof onSearch === "function") {
      onSearch("");
    }
  };

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <Box
      sx={{
        width: "100%",
        mb: 3,
      }}
    >
      {/* ======================================================
          Header
      ====================================================== */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1.5}
        flexWrap="wrap"
        gap={1}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
        >
          Search Inventory
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          
        </Typography>
      </Stack>

      {/* ======================================================
          Search Field
      ====================================================== */}

      <TextField
        fullWidth
        size="small"
        disabled={loading}
        value={searchValue}
        placeholder={placeholder}
        onChange={(e) => setSearchValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon
                color="action"
                fontSize="small"
              />
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">

              {loading && (
                <CircularProgress
                  size={18}
                  sx={{ mr: 1 }}
                />
              )}

              {searchValue && (
                <Tooltip title="Clear Search">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={handleClear}
                    sx={{
                      transition: "all .2s ease",

                      "&:hover": {
                        transform: "rotate(90deg)",
                      },
                    }}
                  >
                    <ClearRoundedIcon
                      fontSize="small"
                    />
                  </IconButton>
                </Tooltip>
              )}

            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {

            minHeight: 48,

            borderRadius: 2,

            transition: "all .25s ease",

            backgroundColor: "background.paper",

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

          "& input": {
            fontSize: "0.95rem",
            py: 1.3,
          },
        }}
      />
    </Box>
  );
};

InventorySearch.propTypes = {
  value: PropTypes.string,

  placeholder: PropTypes.string,

  loading: PropTypes.bool,

  onSearch: PropTypes.func,
};

InventorySearch.defaultProps = {
  value: "",

  placeholder: "Search by Product, SKU or Supplier...",

  loading: false,

  onSearch: () => {},
};

export default InventorySearch;