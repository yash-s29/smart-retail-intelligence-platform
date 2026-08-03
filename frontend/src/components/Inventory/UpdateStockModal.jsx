import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import StockBadge from "./StockBadge";

function UpdateStockModal({
  open = false,
  inventory = null,
  loading = false,
  onClose,
  onSave,
}) {

  // ==========================================================
  // Local State
  // ==========================================================

  const [stock, setStock] = useState("");

  const [error, setError] = useState("");

  // ==========================================================
  // Initialize
  // ==========================================================

  useEffect(() => {

    if (inventory) {
      setStock(inventory.current_stock ?? 0);
    } else {
      setStock("");
    }

    setError("");

  }, [inventory, open]);

  // ==========================================================
  // Current Values
  // ==========================================================

  const currentStock = Number(
    inventory?.current_stock ?? 0
  );

  const minimumStock = Number(
    inventory?.minimum_stock ?? 0
  );

  const maximumStock = Number(
    inventory?.maximum_stock ?? 0
  );

  const reorderLevel = Number(
    inventory?.reorder_level ?? minimumStock
  );

  const safetyStock = Number(
    inventory?.safety_stock ?? 0
  );

  const newStock = Number(stock || 0);

  // ==========================================================
  // Difference
  // ==========================================================

  const stockDifference = useMemo(() => {

    return newStock - currentStock;

  }, [newStock, currentStock]);

  // ==========================================================
  // Capacity
  // ==========================================================

  const stockCapacity = useMemo(() => {

    if (!maximumStock) return 0;

    return Math.min(
      (newStock / maximumStock) * 100,
      100
    );

  }, [newStock, maximumStock]);

  // ==========================================================
  // Status
  // ==========================================================

  const stockStatus = useMemo(() => {

    if (newStock <= 0) {
      return {
        label: "Out of Stock",
        color: "error",
        icon: <WarningAmberRoundedIcon />,
      };
    }

    if (newStock <= minimumStock) {
      return {
        label: "Low Stock",
        color: "warning",
        icon: <WarningAmberRoundedIcon />,
      };
    }

    if (
      maximumStock &&
      newStock >= maximumStock
    ) {
      return {
        label: "Overstock",
        color: "info",
        icon: <TrendingUpRoundedIcon />,
      };
    }

    return {
      label: "Healthy",
      color: "success",
      icon: <CheckCircleRoundedIcon />,
    };

  }, [
    newStock,
    minimumStock,
    maximumStock,
  ]);

  // ==========================================================
  // Input Change
  // ==========================================================

  const handleStockChange = (event) => {

    setStock(event.target.value);

    if (error) {
      setError("");
    }

  };

  // ==========================================================
  // Quick Quantity Buttons
  // ==========================================================

  const changeQuantity = (amount) => {

    const nextValue = Math.max(
      0,
      Number(stock || 0) + amount
    );

    setStock(nextValue);

    if (error) {
      setError("");
    }

  };

  // ==========================================================
  // Validation
  // ==========================================================

  const validate = () => {

    if (
      stock === "" ||
      stock === null
    ) {
      setError("Stock quantity is required.");
      return false;
    }

    const quantity = Number(stock);

    if (Number.isNaN(quantity)) {
      setError("Please enter a valid number.");
      return false;
    }

    if (quantity < 0) {
      setError("Stock cannot be negative.");
      return false;
    }

    return true;
  };

  // ==========================================================
  // Save
  // ==========================================================

  const handleSave = () => {

    if (!validate()) return;

    onSave(Number(stock));

  };
    return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
        },
      }}
    >
      {/* ==========================================================
          Header
      ========================================================== */}

      <DialogTitle
        sx={{
          pb: 2.5,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Avatar
            sx={{
              width: 58,
              height: 58,
              bgcolor: "primary.main",
              borderRadius: 3,
            }}
          >
            <InventoryRoundedIcon />
          </Avatar>

          <Box flex={1}>
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Update Inventory Stock
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Modify product stock and preview
              inventory changes before saving.
            </Typography>
          </Box>

          <Chip
            icon={stockStatus.icon}
            label={stockStatus.label}
            color={stockStatus.color}
          />
        </Stack>
      </DialogTitle>

      <Divider />

      {/* ==========================================================
          Body
      ========================================================== */}

      <DialogContent
        sx={{
          p: {
            xs: 2.5,
            md: 3.5,
          },
        }}
      >
        {/* ==========================================================
            Product Summary
        ========================================================== */}

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 3,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={3}
            justifyContent="space-between"
          >
            <Box flex={1}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Product Name
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {inventory?.product_name ||
                  inventory?.product?.name ||
                  "-"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
              >
                SKU :
                {" "}
                {inventory?.sku ||
                  inventory?.product?.sku ||
                  "-"}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mt={1}
              >
                <WarehouseRoundedIcon
                  fontSize="small"
                  color="action"
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {inventory?.warehouse ||
                    "-"}
                </Typography>
              </Stack>
            </Box>

            <Stack
              spacing={1}
              alignItems={{
                xs: "flex-start",
                md: "flex-end",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Current Status
              </Typography>

              <StockBadge
                currentStock={currentStock}
                minimumStock={minimumStock}
                maximumStock={maximumStock}
              />

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Supplier
              </Typography>

              <Typography
                fontWeight={600}
              >
                {inventory?.supplier || "-"}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* ==========================================================
            Inventory Statistics
        ========================================================== */}

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          mb={3}
        >
          <Paper
            variant="outlined"
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Current Stock
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="primary.main"
            >
              {currentStock}
            </Typography>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Reorder Level
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="warning.main"
            >
              {reorderLevel}
            </Typography>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Safety Stock
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="success.main"
            >
              {safetyStock}
            </Typography>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Maximum Stock
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {maximumStock || "-"}
            </Typography>
          </Paper>
        </Stack>

        {/* ==========================================================
            Capacity Indicator
        ========================================================== */}

        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 3,
            mb: 3,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            mb={1.5}
          >
            <Typography
              fontWeight={700}
            >
              Warehouse Capacity
            </Typography>

            <Typography
              color="text.secondary"
            >
              {Math.round(stockCapacity)}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={stockCapacity}
            sx={{
              height: 10,
              borderRadius: 10,
            }}
          />
        </Paper>
                {/* ==========================================================
            Stock Difference
        ========================================================== */}

        <Alert
          severity={
            stockDifference > 0
              ? "success"
              : stockDifference < 0
              ? "warning"
              : "info"
          }
          icon={
            stockDifference >= 0 ? (
              <TrendingUpRoundedIcon />
            ) : (
              <TrendingDownRoundedIcon />
            )
          }
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          <Typography fontWeight={700}>
            Stock Preview
          </Typography>

          <Typography variant="body2">
            {stockDifference > 0
              ? `Stock will increase by ${stockDifference} units.`
              : stockDifference < 0
              ? `Stock will decrease by ${Math.abs(
                  stockDifference
                )} units.`
              : "No stock changes detected."}
          </Typography>
        </Alert>

        {/* ==========================================================
            Quantity Controls
        ========================================================== */}

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 3,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={2}
          >
            Quick Quantity Adjustment
          </Typography>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
            alignItems={{
              xs: "stretch",
              md: "center",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
            >
              <Tooltip title="Decrease by 50">
                <IconButton
                  color="error"
                  onClick={() =>
                    changeQuantity(-50)
                  }
                >
                  <RemoveRoundedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Decrease by 10">
                <IconButton
                  color="warning"
                  onClick={() =>
                    changeQuantity(-10)
                  }
                >
                  <RemoveRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>

            <TextField
              fullWidth
              type="number"
              label="New Stock Quantity"
              value={stock}
              onChange={handleStockChange}
              error={Boolean(error)}
              helperText={
                error ||
                "Enter the updated inventory quantity."
              }
              inputProps={{
                min: 0,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InventoryRoundedIcon
                      color="primary"
                    />
                  </InputAdornment>
                ),
              }}
            />

            <Stack
              direction="row"
              spacing={1}
            >
              <Tooltip title="Increase by 10">
                <IconButton
                  color="success"
                  onClick={() =>
                    changeQuantity(10)
                  }
                >
                  <AddRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Increase by 50">
                <IconButton
                  color="primary"
                  onClick={() =>
                    changeQuantity(50)
                  }
                >
                  <AddRoundedIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>

        {/* ==========================================================
            Live Preview
        ========================================================== */}

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={3}
          >
            Live Inventory Preview
          </Typography>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={3}
          >
            <Box flex={1}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Current Quantity
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
              >
                {currentStock}
              </Typography>
            </Box>

            <Box flex={1}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Updated Quantity
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
              >
                {newStock}
              </Typography>
            </Box>

            <Box flex={1}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Difference
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color={
                  stockDifference > 0
                    ? "success.main"
                    : stockDifference < 0
                    ? "error.main"
                    : "text.primary"
                }
              >
                {stockDifference > 0
                  ? `+${stockDifference}`
                  : stockDifference}
              </Typography>
            </Box>
          </Stack>

          {(newStock <= minimumStock ||
            newStock <= reorderLevel) && (
            <Alert
              severity="warning"
              sx={{
                mt: 3,
                borderRadius: 2,
              }}
            >
              Inventory will remain below the
              reorder level after this update.
              Consider creating a purchase order.
            </Alert>
          )}

          {maximumStock > 0 &&
            newStock > maximumStock && (
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                }}
              >
                Updated stock exceeds the
                configured warehouse capacity.
              </Alert>
            )}
        </Paper>
              {/* ================================================
          Validation Error
      ================================================ */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mt: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

    </DialogContent>

    <Divider />

    {/* ================================================
        Footer
    ================================================ */}

    <DialogActions
      sx={{
        px: 3,
        py: 2.5,
        display: "flex",
        flexDirection: {
          xs: "column-reverse",
          sm: "row",
        },
        justifyContent: "space-between",
        gap: 2,
      }}
    >

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          textAlign: {
            xs: "center",
            sm: "left",
          },
        }}
      >
        Updating stock immediately refreshes inventory,
        dashboard analytics and low-stock alerts.
      </Typography>

      <Stack
        direction="row"
        spacing={2}
      >
        <Button
          variant="outlined"
          color="inherit"
          disabled={loading}
          onClick={onClose}
          sx={{
            minWidth: 120,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disableElevation
          disabled={loading}
          onClick={handleSave}
          startIcon={
            loading ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : (
              <InventoryRoundedIcon />
            )
          }
          sx={{
            minWidth: 170,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {loading
            ? "Updating..."
            : "Update Stock"}
        </Button>
      </Stack>

    </DialogActions>

  </Dialog>
);

UpdateStockModal.propTypes = {
  open: PropTypes.bool,
  inventory: PropTypes.object,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

UpdateStockModal.defaultProps = {
  open: false,
  inventory: null,
  loading: false,
};
}
export default UpdateStockModal;