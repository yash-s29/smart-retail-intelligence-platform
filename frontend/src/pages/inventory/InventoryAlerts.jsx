import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import InventoryStats from "../../components/Inventory/InventoryStats";
import InventorySearch from "../../components/Inventory/InventorySearch";
import UpdateStockModal from "../../components/Inventory/UpdateStockModal";
import StockBadge from "../../components/Inventory/StockBadge";

import {
  fetchAlerts,
  updateInventory,
} from "../../redux/slices/inventorySlice";

function InventoryAlerts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================================
  // Redux State
  // ==========================================================

  const {
    alerts = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.inventory);

  // ==========================================================
  // Local State
  // ==========================================================

  const [search, setSearch] = useState("");

  const [stockOpen, setStockOpen] = useState(false);

  const [selectedInventory, setSelectedInventory] =
    useState(null);

  const [stockUpdating, setStockUpdating] =
    useState(false);

  // ==========================================================
  // Load Alerts
  // ==========================================================

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  // ==========================================================
  // Refresh Alerts
  // ==========================================================

  const handleRefresh = () => {
    dispatch(fetchAlerts());
  };

  // ==========================================================
  // Search / Filter
  // ==========================================================

  const filteredAlerts = useMemo(() => {
    if (!Array.isArray(alerts)) {
      return [];
    }

    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return alerts;
    }

    return alerts.filter((item) => {
      const productName =
        item.product_name ||
        item.product?.name ||
        "";

      const sku =
        item.sku ||
        item.product?.sku ||
        "";

      const supplier =
        item.supplier ||
        "";

      const warehouse =
        item.warehouse ||
        "";

      return (
        productName.toLowerCase().includes(keyword) ||
        sku.toLowerCase().includes(keyword) ||
        supplier.toLowerCase().includes(keyword) ||
        warehouse.toLowerCase().includes(keyword)
      );
    });
  }, [alerts, search]);

  // ==========================================================
  // Alert Statistics
  // ==========================================================

  const stats = useMemo(() => {
    const total = filteredAlerts.length;

    const outOfStock = filteredAlerts.filter(
      (item) =>
        Number(item.current_stock ?? 0) <= 0
    ).length;

    const criticalStock = filteredAlerts.filter(
      (item) => {
        const current = Number(
          item.current_stock ?? 0
        );

        const minimum = Number(
          item.minimum_stock ?? 0
        );

        return (
          current > 0 &&
          current <= minimum
        );
      }
    ).length;

    const lowStock = filteredAlerts.filter(
      (item) => {
        const current = Number(
          item.current_stock ?? 0
        );

        const minimum = Number(
          item.minimum_stock ?? 0
        );

        const reorder = Number(
          item.reorder_level ??
            minimum
        );

        return (
          current > minimum &&
          current <= reorder
        );
      }
    ).length;

    return {
      totalProducts: total,
      inStock: Math.max(
        0,
        total -
          outOfStock -
          criticalStock -
          lowStock
      ),
      lowStock:
        lowStock + criticalStock,
      outOfStock,
    };
  }, [filteredAlerts]);

  // ==========================================================
  // Open Stock Modal
  // ==========================================================

  const handleOpenStockModal = (item) => {
    setSelectedInventory(item);
    setStockOpen(true);
  };

  // ==========================================================
  // Close Stock Modal
  // ==========================================================

  const handleCloseStockModal = () => {
    if (stockUpdating) return;

    setStockOpen(false);
    setSelectedInventory(null);
  };

  // ==========================================================
  // Update Stock
  // ==========================================================

  const handleUpdateStock = async (quantity) => {
    if (!selectedInventory) return;

    try {
      setStockUpdating(true);

      await dispatch(
        updateInventory({
          id: selectedInventory.id,
          inventoryData: {
            current_stock: quantity,
          },
        })
      ).unwrap();

      setStockOpen(false);
      setSelectedInventory(null);

      await dispatch(fetchAlerts()).unwrap();
    } catch (updateError) {
      console.error(
        "Failed to update stock:",
        updateError
      );
    } finally {
      setStockUpdating(false);
    }
  };

  // ==========================================================
  // Common Button Style
  // ==========================================================

  const actionButtonSx = {
    minHeight: 44,
    borderRadius: 2.5,
    textTransform: "none",
    fontWeight: 700,
    transition: "all .25s ease",

    "&:hover": {
      transform: "translateY(-2px)",
    },
  };

  // ==========================================================
  // Loading Skeleton
  // ==========================================================

  const renderLoadingState = () => (
    <Stack spacing={2}>
      {[1, 2, 3].map((item) => (
        <Card
          key={item}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            p: {
              xs: 2,
              sm: 2.5,
            },
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box flex={1}>
                <Skeleton
                  variant="text"
                  width="45%"
                  height={30}
                />

                <Skeleton
                  variant="text"
                  width="30%"
                />

                <Skeleton
                  variant="text"
                  width="55%"
                />
              </Box>

              <Skeleton
                variant="rounded"
                width={135}
                height={34}
              />
            </Stack>

            <Divider />

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
            >
              <Skeleton
                variant="rounded"
                height={44}
                sx={{
                  flex: 1,
                }}
              />

              <Skeleton
                variant="rounded"
                height={44}
                sx={{
                  flex: 1,
                }}
              />
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );

  // ==========================================================
  // Empty State
  // ==========================================================

  const renderEmptyState = () => (
    <Paper
      elevation={0}
      sx={{
        py: {
          xs: 7,
          sm: 9,
        },
        px: 2,
        textAlign: "center",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: {
            xs: 64,
            sm: 76,
          },
          height: {
            xs: 64,
            sm: 76,
          },
          mx: "auto",
          mb: 2.5,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "success.light",
          color: "success.dark",
        }}
      >
        <CheckCircleIconSafe />
      </Box>

      <Typography
        variant="h5"
        fontWeight={700}
        gutterBottom
      >
        No Inventory Alerts
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          maxWidth: 550,
          mx: "auto",
          lineHeight: 1.7,
        }}
      >
        Great! None of your products currently
        require immediate attention. Your inventory
        levels are currently within the monitored
        thresholds.
      </Typography>

      <Button
        variant="outlined"
        startIcon={
          <Inventory2RoundedIcon />
        }
        onClick={() =>
          navigate("/inventory")
        }
        sx={{
          ...actionButtonSx,
          mt: 3,
          px: 3,
        }}
      >
        View Inventory
      </Button>
    </Paper>
  );

  // ==========================================================
  // Alert Card
  // ==========================================================

  const renderAlertCard = (item) => {
    const currentStock = Number(
      item.current_stock ?? 0
    );

    const minimumStock = Number(
      item.minimum_stock ?? 0
    );

    const maximumStock = Number(
      item.maximum_stock ?? 0
    );

    const productName =
      item.product_name ||
      item.product?.name ||
      "Unknown Product";

    const sku =
      item.sku ||
      item.product?.sku ||
      "-";

    return (
      <Card
        key={item.id}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          transition: "all .25s ease",
          backgroundColor:
            "background.paper",

          "&:hover": {
            transform:
              "translateY(-3px)",
            boxShadow:
              "0 12px 28px rgba(0,0,0,0.09)",
          },
        }}
      >
        <Box
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          {/* ==================================================
              Top Section
          ================================================== */}

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            spacing={2.5}
          >
            {/* Product Information */}

            <Box
              flex={1}
              minWidth={0}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
              >
                <Box
                  sx={{
                    width: {
                      xs: 44,
                      sm: 48,
                    },
                    height: {
                      xs: 44,
                      sm: 48,
                    },
                    minWidth: {
                      xs: 44,
                      sm: 48,
                    },
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    bgcolor:
                      currentStock <= 0
                        ? "error.light"
                        : "warning.light",
                    color:
                      currentStock <= 0
                        ? "error.dark"
                        : "warning.dark",
                  }}
                >
                  {currentStock <= 0 ? (
                    <ErrorOutlineRoundedIcon />
                  ) : (
                    <WarningAmberRoundedIcon />
                  )}
                </Box>

                <Box
                  minWidth={0}
                  flex={1}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      fontSize: {
                        xs: "1rem",
                        sm: "1.1rem",
                      },
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {productName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.4,
                    }}
                  >
                    SKU: {sku}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Status */}

            <Box
              sx={{
                alignSelf: {
                  xs: "flex-start",
                  md: "center",
                },
              }}
            >
              <StockBadge
                status={item.status}
                currentStock={
                  currentStock
                }
                minimumStock={
                  minimumStock
                }
                maximumStock={
                  maximumStock
                }
              />
            </Box>
          </Stack>

          <Divider
            sx={{
              my: 2.5,
            }}
          />

          {/* ==================================================
              Information Grid
          ================================================== */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(4, 1fr)",
              },
              gap: {
                xs: 1.5,
                sm: 2,
              },
            }}
          >
            {/* Current Stock */}

            <Box
              sx={{
                p: 1.75,
                borderRadius: 2.5,
                bgcolor:
                  "action.hover",
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
                variant="h6"
                fontWeight={700}
                sx={{
                  mt: 0.3,
                }}
              >
                {currentStock}
              </Typography>
            </Box>

            {/* Minimum */}

            <Box
              sx={{
                p: 1.75,
                borderRadius: 2.5,
                bgcolor:
                  "action.hover",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                Minimum
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  mt: 0.3,
                }}
              >
                {minimumStock}
              </Typography>
            </Box>

            {/* Warehouse */}

            <Box
              sx={{
                p: 1.75,
                borderRadius: 2.5,
                bgcolor:
                  "action.hover",
                minWidth: 0,
              }}
            >
              <Stack
                direction="row"
                spacing={0.7}
                alignItems="center"
              >
                <WarehouseRoundedIcon
                  sx={{
                    fontSize: 17,
                    color:
                      "text.secondary",
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  Warehouse
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                sx={{
                  mt: 0.5,
                }}
              >
                {item.warehouse ||
                  "—"}
              </Typography>
            </Box>

            {/* Supplier */}

            <Box
              sx={{
                p: 1.75,
                borderRadius: 2.5,
                bgcolor:
                  "action.hover",
                minWidth: 0,
              }}
            >
              <Stack
                direction="row"
                spacing={0.7}
                alignItems="center"
              >
                <LocalShippingRoundedIcon
                  sx={{
                    fontSize: 17,
                    color:
                      "text.secondary",
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  Supplier
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                sx={{
                  mt: 0.5,
                }}
              >
                {item.supplier ||
                  "—"}
              </Typography>
            </Box>
          </Box>

          <Divider
            sx={{
              my: 2.5,
            }}
          />

          {/* ==================================================
              Actions
          ================================================== */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <VisibilityRoundedIcon />
              }
              onClick={() =>
                navigate(
                  `/inventory/${item.id}`
                )
              }
              sx={actionButtonSx}
            >
              View Details
            </Button>

            <Button
              fullWidth
              variant="contained"
              startIcon={
                <Inventory2RoundedIcon />
              }
              onClick={() =>
                handleOpenStockModal(
                  item
                )
              }
              sx={actionButtonSx}
            >
              Update Stock
            </Button>
          </Stack>
        </Box>
      </Card>
    );
  };

  // ==========================================================
  // Main UI
  // ==========================================================

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: {
            xs: 3,
            md: 4,
          },
          border: "1px solid",
          borderColor: "divider",
          p: {
            xs: 1.75,
            sm: 2.5,
            md: 3,
          },
        }}
      >
        {/* ==================================================
            Page Header
        ================================================== */}

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            md: "center",
          }}
          spacing={2.5}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "1.65rem",
                  sm: "2rem",
                  md: "2.2rem",
                },
              }}
            >
              Inventory Alerts
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.75,
                maxWidth: 720,
                lineHeight: 1.7,
              }}
            >
              Monitor low-stock, critical-stock,
              and out-of-stock products so you can
              take action before inventory shortages
              affect sales.
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.25}
            sx={{
              width: {
                xs: "100%",
                md: "auto",
              },
            }}
          >
            <Tooltip title="Refresh inventory alerts">
              <span>
                <IconButton
                  color="primary"
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: 46,
                    },
                    height: 46,
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor:
                      "divider",
                  }}
                >
                  <RefreshRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>

            <Button
              fullWidth
              variant="contained"
              startIcon={
                <Inventory2RoundedIcon />
              }
              onClick={() =>
                navigate("/inventory")
              }
              sx={{
                ...actionButtonSx,
                minWidth: {
                  sm: 150,
                },
              }}
            >
              Inventory
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* ==================================================
            Statistics
        ================================================== */}

        <InventoryStats
          stats={stats}
          loading={loading}
        />

        <Divider sx={{ my: 3 }} />

        {/* ==================================================
            Search
        ================================================== */}

        <InventorySearch
          value={search}
          loading={loading}
          onSearch={setSearch}
        />

        <Divider sx={{ my: 3 }} />

        {/* ==================================================
            Error State
        ================================================== */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2.5,
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleRefresh}
                sx={{
                  fontWeight: 700,
                }}
              >
                Retry
              </Button>
            }
          >
            {typeof error === "string"
              ? error
              : "Unable to load inventory alerts."}
          </Alert>
        )}

        {/* ==================================================
            Results Header
        ================================================== */}

        {!loading &&
          filteredAlerts.length > 0 && (
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
              spacing={1}
              sx={{
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Stock Alerts
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {filteredAlerts.length}{" "}
                  alert
                  {filteredAlerts.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  require
                  {filteredAlerts.length ===
                  1
                    ? "s"
                    : ""}{" "}
                  attention.
                </Typography>
              </Box>
            </Stack>
          )}

        {/* ==================================================
            Loading
        ================================================== */}

        {loading ? (
          renderLoadingState()
        ) : filteredAlerts.length === 0 ? (
          renderEmptyState()
        ) : (
          /* ==================================================
              Alert Cards
          ================================================== */

          <Stack spacing={2}>
            {filteredAlerts.map(
              renderAlertCard
            )}
          </Stack>
        )}

        {/* ==================================================
            Update Stock Modal
        ================================================== */}

        <UpdateStockModal
          open={stockOpen}
          inventory={selectedInventory}
          loading={stockUpdating}
          onClose={handleCloseStockModal}
          onSave={handleUpdateStock}
        />
      </Paper>
    </Container>
  );
}

// ==========================================================
// Safe Success Icon
// ==========================================================

function CheckCircleIconSafe() {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.41-1.41L11 14.17l5.59-5.58L18 10Z" />
      </svg>
    </span>
  );
}

export default InventoryAlerts;
