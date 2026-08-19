import PropTypes from "prop-types";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

// ==========================================================
// Component
// ==========================================================

const UpdateStockModal = ({
  open = false,
  inventory = null,
  loading = false,
  onClose,
  onSave,
}) => {
  // ==========================================================
  // Local State
  // ==========================================================

  const [stock, setStock] = useState("");
  const [error, setError] = useState("");

  // ==========================================================
  // Initialize / Reset
  // ==========================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    if (inventory) {
      setStock(
        inventory.current_stock !== null &&
        inventory.current_stock !== undefined
          ? String(inventory.current_stock)
          : "0"
      );
    } else {
      setStock("");
    }

    setError("");
  }, [inventory, open]);

  // ==========================================================
  // Inventory Values
  // ==========================================================

  const currentStock = useMemo(
    () => Number(inventory?.current_stock) || 0,
    [inventory?.current_stock]
  );

  const minimumStock = useMemo(
    () => Number(inventory?.minimum_stock) || 0,
    [inventory?.minimum_stock]
  );

  const maximumStock = useMemo(
    () => Number(inventory?.maximum_stock) || 0,
    [inventory?.maximum_stock]
  );

  const reorderLevel = useMemo(
    () =>
      Number(inventory?.reorder_level) ||
      minimumStock,
    [inventory?.reorder_level, minimumStock]
  );

  const safetyStock = useMemo(
    () => Number(inventory?.safety_stock) || 0,
    [inventory?.safety_stock]
  );

  // ==========================================================
  // New Stock Value
  // ==========================================================

  const newStock = useMemo(() => {
    if (stock === "" || stock === null) {
      return 0;
    }

    const value = Number(stock);

    return Number.isFinite(value) ? value : 0;
  }, [stock]);

  // ==========================================================
  // Stock Difference
  // ==========================================================

  const stockDifference = useMemo(
    () => newStock - currentStock,
    [newStock, currentStock]
  );

  // ==========================================================
  // Capacity Percentage
  // ==========================================================

  const stockCapacity = useMemo(() => {
    if (maximumStock <= 0) {
      return 0;
    }

    return Math.min(
      Math.max((newStock / maximumStock) * 100, 0),
      100
    );
  }, [newStock, maximumStock]);

  // ==========================================================
  // Capacity Status
  // ==========================================================

  const capacityStatus = useMemo(() => {
    if (maximumStock <= 0) {
      return {
        label: "No maximum configured",
        color: "text.secondary",
      };
    }

    if (newStock > maximumStock) {
      return {
        label: "Over Capacity",
        color: "error.main",
      };
    }

    if (newStock >= maximumStock * 0.9) {
      return {
        label: "Near Capacity",
        color: "warning.main",
      };
    }

    return {
      label: "Within Capacity",
      color: "success.main",
    };
  }, [newStock, maximumStock]);

  // ==========================================================
  // Preview Status
  // ==========================================================

  const stockStatus = useMemo(() => {
    if (newStock <= 0) {
      return {
        label: "Out of Stock",
        color: "error",
        icon: <WarningAmberRoundedIcon />,
      };
    }

    if (
      minimumStock > 0 &&
      newStock <= minimumStock
    ) {
      return {
        label: "Low Stock",
        color: "warning",
        icon: <WarningAmberRoundedIcon />,
      };
    }

    if (
      maximumStock > 0 &&
      newStock >= maximumStock
    ) {
      return {
        label: "Overstock",
        color: "info",
        icon: <TrendingUpRoundedIcon />,
      };
    }

    return {
      label: "In Stock",
      color: "success",
      icon: <CheckCircleRoundedIcon />,
    };
  }, [
    newStock,
    minimumStock,
    maximumStock,
  ]);

  // ==========================================================
  // Handle Stock Input
  // ==========================================================

  const handleStockChange = (event) => {
    const value = event.target.value;

    // Allow empty input while typing.
    if (value === "") {
      setStock("");
      setError("");
      return;
    }

    // Prevent invalid characters from being stored.
    if (!/^\d*$/.test(value)) {
      return;
    }

    setStock(value);

    if (error) {
      setError("");
    }
  };

  // ==========================================================
  // Quick Quantity Adjustment
  // ==========================================================

  const changeQuantity = (amount) => {
    const currentValue =
      Number(stock || 0);

    const nextValue = Math.max(
      0,
      currentValue + amount
    );

    setStock(String(nextValue));

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
      stock === null ||
      stock === undefined
    ) {
      setError(
        "Stock quantity is required."
      );

      return false;
    }

    const quantity = Number(stock);

    if (!Number.isFinite(quantity)) {
      setError(
        "Please enter a valid stock quantity."
      );

      return false;
    }

    if (quantity < 0) {
      setError(
        "Stock quantity cannot be negative."
      );

      return false;
    }

    if (!Number.isInteger(quantity)) {
      setError(
        "Stock quantity must be a whole number."
      );

      return false;
    }

    return true;
  };

  // ==========================================================
  // Save
  // ==========================================================

  const handleSave = () => {
    if (loading) {
      return;
    }

    if (!validate()) {
      return;
    }

    if (typeof onSave === "function") {
      onSave(Number(stock));
    }
  };

  // ==========================================================
  // Product Information
  // ==========================================================

  const productName =
    inventory?.product_name ||
    inventory?.product?.name ||
    "Unknown Product";

  const productSku =
    inventory?.sku ||
    inventory?.product?.sku ||
    "-";

  const warehouse =
    inventory?.warehouse ||
    "-";

  const supplier =
    inventory?.supplier ||
    "-";

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <Dialog
      open={open}
      onClose={
        loading
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="md"
      fullScreen={false}
      scroll="paper"
      PaperProps={{
        sx: {
          width: "100%",
          maxHeight: "92vh",
          borderRadius: {
            xs: 0,
            sm: 4,
          },
          overflow: "hidden",
        },
      }}
    >
      {/* ======================================================
          Header
      ====================================================== */}

      <DialogTitle
        sx={{
          px: {
            xs: 2,
            sm: 3,
          },
          pt: {
            xs: 2,
            sm: 3,
          },
          pb: 2.5,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
        >
          <Avatar
            sx={{
              width: {
                xs: 50,
                sm: 58,
              },
              height: {
                xs: 50,
                sm: 58,
              },
              bgcolor: "primary.main",
              borderRadius: 3,
              flexShrink: 0,
            }}
          >
            <InventoryRoundedIcon />
          </Avatar>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.5rem",
                },
              }}
            >
              Update Inventory Stock
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                lineHeight: 1.6,
              }}
            >
              Modify product stock and preview
              inventory changes before saving.
            </Typography>
          </Box>

          <Chip
            icon={stockStatus.icon}
            label={stockStatus.label}
            color={stockStatus.color}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              alignSelf: {
                xs: "flex-start",
                sm: "center",
              },
            }}
          />
        </Stack>
      </DialogTitle>

      <Divider />

      {/* ======================================================
          Body
      ====================================================== */}

      <DialogContent
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 3.5,
          },
        }}
      >
        {/* ====================================================
            Product Summary
        ==================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            borderRadius: 3,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
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
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                Product Name
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  mt: 0.5,
                  wordBreak: "break-word",
                }}
              >
                {productName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                SKU: {productSku}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  mt: 1,
                }}
              >
                <WarehouseRoundedIcon
                  fontSize="small"
                  color="action"
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {warehouse}
                </Typography>
              </Stack>
            </Box>

            <Stack
              spacing={0.75}
              alignItems={{
                xs: "flex-start",
                md: "flex-end",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                Current Status
              </Typography>

              <StockBadge
                status={inventory?.status}
                currentStock={currentStock}
                minimumStock={minimumStock}
                maximumStock={maximumStock}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{
                  mt: 1,
                }}
              >
                Supplier
              </Typography>

              <Typography
                fontWeight={600}
              >
                {supplier}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* ====================================================
            Inventory Statistics
        ==================================================== */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: {
              xs: 1.5,
              sm: 2,
            },
            mb: 3,
          }}
        >
          {/* Current Stock */}

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 1.75,
                sm: 2.5,
              },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              Current Stock
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="primary.main"
              sx={{
                mt: 0.5,
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                },
              }}
            >
              {currentStock}
            </Typography>
          </Paper>

          {/* Reorder Level */}

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 1.75,
                sm: 2.5,
              },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              Reorder Level
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="warning.main"
              sx={{
                mt: 0.5,
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                },
              }}
            >
              {reorderLevel}
            </Typography>
          </Paper>

          {/* Safety Stock */}

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 1.75,
                sm: 2.5,
              },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              Safety Stock
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="success.main"
              sx={{
                mt: 0.5,
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                },
              }}
            >
              {safetyStock}
            </Typography>
          </Paper>

          {/* Maximum Stock */}

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 1.75,
                sm: 2.5,
              },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              Maximum Stock
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                mt: 0.5,
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                },
              }}
            >
              {maximumStock || "-"}
            </Typography>
          </Paper>
        </Box>

        {/* ====================================================
            Warehouse Capacity
        ==================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            borderRadius: 3,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            mb={1.5}
          >
            <Box>
              <Typography
                fontWeight={700}
              >
                Warehouse Capacity
              </Typography>

              <Typography
                variant="caption"
                color={capacityStatus.color}
                fontWeight={600}
              >
                {capacityStatus.label}
              </Typography>
            </Box>

            <Typography
              color="text.secondary"
              fontWeight={700}
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

        {/* ====================================================
            Stock Difference
        ==================================================== */}

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
          <Typography
            fontWeight={700}
          >
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

        {/* ====================================================
            Quantity Controls
        ==================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            borderRadius: 3,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
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
              sm: "row",
            }}
            spacing={2}
            alignItems={{
              xs: "stretch",
              sm: "center",
            }}
          >
            {/* Decrease */}

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
            >
              <Tooltip title="Decrease by 50">
                <span>
                  <IconButton
                    color="error"
                    disabled={
                      loading ||
                      newStock <= 0
                    }
                    onClick={() =>
                      changeQuantity(-50)
                    }
                    sx={{
                      width: 44,
                      height: 44,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <RemoveRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Decrease by 10">
                <span>
                  <IconButton
                    color="warning"
                    disabled={
                      loading ||
                      newStock <= 0
                    }
                    onClick={() =>
                      changeQuantity(-10)
                    }
                    sx={{
                      width: 44,
                      height: 44,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <RemoveRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>

            {/* Quantity Input */}

            <TextField
              fullWidth
              type="number"
              label="New Stock Quantity"
              value={stock}
              disabled={loading}
              onChange={handleStockChange}
              error={Boolean(error)}
              helperText={
                error ||
                "Enter the updated inventory quantity."
              }
              inputProps={{
                min: 0,
                step: 1,
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  minHeight: 50,
                  borderRadius: 2,

                  "& fieldset": {
                    borderColor: "divider",
                  },

                  "&:hover fieldset": {
                    borderColor:
                      "primary.main",
                  },

                  "&.Mui-focused fieldset": {
                    borderWidth: 2,
                  },
                },
              }}
            />

            {/* Increase */}

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
            >
              <Tooltip title="Increase by 10">
                <span>
                  <IconButton
                    color="success"
                    disabled={loading}
                    onClick={() =>
                      changeQuantity(10)
                    }
                    sx={{
                      width: 44,
                      height: 44,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <AddRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Increase by 50">
                <span>
                  <IconButton
                    color="primary"
                    disabled={loading}
                    onClick={() =>
                      changeQuantity(50)
                    }
                    sx={{
                      width: 44,
                      height: 44,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <AddRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>

        {/* ====================================================
            Live Inventory Preview
        ==================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={3}
          >
            Live Inventory Preview
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
              },
              gap: {
                xs: 2,
                sm: 3,
              },
            }}
          >
            {/* Current */}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                Current Quantity
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  mt: 0.5,
                  fontSize: {
                    xs: "1.75rem",
                    sm: "2rem",
                  },
                }}
              >
                {currentStock}
              </Typography>
            </Box>

            {/* Updated */}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                Updated Quantity
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
                sx={{
                  mt: 0.5,
                  fontSize: {
                    xs: "1.75rem",
                    sm: "2rem",
                  },
                }}
              >
                {newStock}
              </Typography>
            </Box>

            {/* Difference */}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
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
                sx={{
                  mt: 0.5,
                  fontSize: {
                    xs: "1.75rem",
                    sm: "2rem",
                  },
                }}
              >
                {stockDifference > 0
                  ? `+${stockDifference}`
                  : stockDifference}
              </Typography>
            </Box>
          </Box>

          {/* Reorder Warning */}

          {newStock <= minimumStock ||
          newStock <= reorderLevel ? (
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
          ) : null}

          {/* Overstock Warning */}

          {maximumStock > 0 &&
          newStock > maximumStock ? (
            <Alert
              severity="info"
              sx={{
                mt: 2,
                borderRadius: 2,
              }}
            >
              Updated stock exceeds the
              configured maximum stock level.
              Consider reviewing the inventory
              capacity.
            </Alert>
          ) : null}

          {/* Out of Stock Warning */}

          {newStock <= 0 ? (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                borderRadius: 2,
              }}
            >
              This update will make the product
              completely out of stock.
            </Alert>
          ) : null}
        </Paper>

        {/* ====================================================
            Validation Error
        ==================================================== */}

        {error ? (
          <Alert
            severity="error"
            sx={{
              mt: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        ) : null}
      </DialogContent>

      <Divider />

      {/* ======================================================
          Footer
      ====================================================== */}

      <DialogActions
        sx={{
          px: {
            xs: 2,
            sm: 3,
          },
          py: {
            xs: 2,
            sm: 2.5,
          },
          display: "flex",
          flexDirection: {
            xs: "column-reverse",
            sm: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
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
            maxWidth: {
              xs: "100%",
              sm: 400,
            },
          }}
        >
          Updating stock immediately refreshes
          inventory, dashboard analytics and
          low-stock monitoring.
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            disabled={loading}
            onClick={onClose}
            sx={{
              minWidth: {
                xs: "100%",
                sm: 120,
              },
              minHeight: 46,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            variant="contained"
            disableElevation
            disabled={
              loading ||
              !inventory
            }
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
              minWidth: {
                xs: "100%",
                sm: 170,
              },
              minHeight: 46,
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
};

// ==========================================================
// PropTypes
// ==========================================================

UpdateStockModal.propTypes = {
  open: PropTypes.bool,

  inventory: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    product_id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    product_name: PropTypes.string,

    sku: PropTypes.string,

    current_stock: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    minimum_stock: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    maximum_stock: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    reorder_level: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    safety_stock: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    warehouse: PropTypes.string,

    supplier: PropTypes.string,

    status: PropTypes.string,

    product: PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),

      name: PropTypes.string,

      sku: PropTypes.string,
    }),
  }),

  loading: PropTypes.bool,

  onClose: PropTypes.func.isRequired,

  onSave: PropTypes.func.isRequired,
};

// ==========================================================
// Default Props
// ==========================================================

UpdateStockModal.defaultProps = {
  open: false,
  inventory: null,
  loading: false,
};

export default UpdateStockModal;
