import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Snackbar,
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
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

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

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // ==========================================================
  // Load Alerts
  // ==========================================================

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  // ==========================================================
  // Filter Alerts
  // ==========================================================

  const filteredAlerts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return alerts;
    }

    return alerts.filter((item) => {
      const productName =
        item.product_name?.toLowerCase() || "";

      const sku =
        item.sku?.toLowerCase() || "";

      const warehouse =
        item.warehouse?.toLowerCase() || "";

      const supplier =
        item.supplier?.toLowerCase() || "";

      return (
        productName.includes(keyword) ||
        sku.includes(keyword) ||
        warehouse.includes(keyword) ||
        supplier.includes(keyword)
      );
    });
  }, [alerts, search]);

  // ==========================================================
  // Statistics
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
          item.reorder_level ?? 0
        );

        return (
          current > minimum &&
          current <= reorder
        );
      }
    ).length;

    return {
      total,
      inStock: 0,
      lowStock,
      outOfStock,
      criticalStock,
    };
  }, [filteredAlerts]);

  // ==========================================================
  // Refresh
  // ==========================================================

  const handleRefresh = () => {
    dispatch(fetchAlerts());
  };

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

  const handleStockUpdate = async (quantity) => {
    if (!selectedInventory) {
      return;
    }

    try {
      setStockUpdating(true);

      await dispatch(
        updateInventory({
          id: selectedInventory.id,
          inventoryData: {
            current_stock: Number(quantity),
          },
        })
      ).unwrap();

      setStockOpen(false);
      setSelectedInventory(null);

      setSuccessMessage(
        "Inventory stock updated successfully."
      );

      dispatch(fetchAlerts());
    } catch (updateError) {
      setErrorMessage(
        updateError?.message ||
          "Unable to update inventory stock."
      );
    } finally {
      setStockUpdating(false);
    }
  };

  // ==========================================================
  // Error Message
  // ==========================================================

  const displayedError =
    errorMessage ||
    (typeof error === "string"
      ? error
      : error?.message);

  // ==========================================================
  // Loading Skeleton
  // ==========================================================

  const renderLoadingState = () => (
    <Stack spacing={2}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
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
            <Box flex={1}>
              <Skeleton
                width="45%"
                height={28}
              />

              <Skeleton
                width="30%"
                height={20}
              />

              <Skeleton
                width="55%"
                height={18}
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  md: 140,
                },
              }}
            >
              <Skeleton
                width="100%"
                height={70}
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  md: 210,
                },
              }}
            >
              <Skeleton
                width="100%"
                height={44}
              />
            </Box>
          </Stack>
        </Paper>
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
        position: "relative",
        overflow: "hidden",
        p: {
          xs: 4,
          sm: 6,
        },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        textAlign: "center",
        background:
          "linear-gradient(135deg, rgba(234,247,250,.75), rgba(255,255,255,.96))",

        "&::before": {
          content: '""',
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            "rgba(22,138,173,.06)",
          top: -90,
          right: -70,
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: 130,
          height: 130,
          borderRadius: "50%",
          background:
            "rgba(42,157,143,.05)",
          bottom: -70,
          left: -50,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(42,157,143,.10)",
            color: "success.main",
            animation:
              "inventoryAlertFloat 3.5s ease-in-out infinite",
          }}
        >
          <WarningAmberRoundedIcon
            sx={{ fontSize: 38 }}
          />
        </Box>

        <Typography
          variant="h5"
          fontWeight={800}
          gutterBottom
        >
          Inventory is looking healthy
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 500,
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          No products currently require
          immediate inventory attention.
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
            mt: 3,
            minHeight: 44,
            px: 3,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,

            "&:hover": {
              transform:
                "translateY(-2px)",
              boxShadow:
                "0 8px 20px rgba(22,138,173,.10)",
            },

            transition:
              "all .25s ease",
          }}
        >
          View Inventory
        </Button>
      </Box>
    </Paper>
  );

  // ==========================================================
  // Alert Card
  // ==========================================================

  const renderAlertCard = (item, index) => {
    const currentStock = Number(
      item.current_stock ?? 0
    );

    const minimumStock = Number(
      item.minimum_stock ?? 0
    );

    const maximumStock = Number(
      item.maximum_stock ?? 0
    );

    const reorderLevel = Number(
      item.reorder_level ?? 0
    );

    const isOutOfStock =
      currentStock <= 0;

    const isCritical =
      currentStock > 0 &&
      currentStock <= minimumStock;

    const severityLabel = isOutOfStock
      ? "Out of Stock"
      : isCritical
      ? "Critical Stock"
      : "Low Stock";

    return (
      <Paper
        key={item.id}
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: {
            xs: 2,
            sm: 2.5,
          },
          borderRadius: 3,
          border: "1px solid",
          borderColor: isOutOfStock
            ? "rgba(211,47,47,.20)"
            : isCritical
            ? "rgba(237,108,2,.20)"
            : "divider",

          animation:
            "inventoryAlertCardEnter .45s ease both",

          animationDelay:
            `${index * 45}ms`,

          transition:
            "transform .25s ease, box-shadow .25s ease, border-color .25s ease",

          "&:hover": {
            transform:
              "translateY(-3px)",
            boxShadow:
              "0 12px 30px rgba(23,49,59,.08)",
          },

          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: isOutOfStock
              ? "error.main"
              : isCritical
              ? "warning.main"
              : "primary.main",
          },
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={{
            xs: 2,
            md: 3,
          }}
          alignItems={{
            xs: "stretch",
            md: "center",
          }}
        >
          {/* ==================================================
              Product
          ================================================== */}

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flex={1}
            minWidth={0}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                flexShrink: 0,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor:
                  "rgba(22,138,173,.08)",
                color: "primary.main",
                transition:
                  "all .25s ease",
              }}
            >
              {isOutOfStock ? (
                <ErrorOutlineRoundedIcon />
              ) : (
                <TrendingDownRoundedIcon />
              )}
            </Box>

            <Box
              minWidth={0}
              flex={1}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={{
                  xs: 0.5,
                  sm: 1,
                }}
                alignItems={{
                  xs: "flex-start",
                  sm: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  noWrap
                  sx={{
                    maxWidth: {
                      xs: "100%",
                      sm: 280,
                    },
                  }}
                >
                  {item.product_name ||
                    "Unknown Product"}
                </Typography>

                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 1.5,
                    bgcolor:
                      isOutOfStock
                        ? "rgba(211,47,47,.08)"
                        : isCritical
                        ? "rgba(237,108,2,.08)"
                        : "rgba(22,138,173,.08)",
                    color:
                      isOutOfStock
                        ? "error.main"
                        : isCritical
                        ? "warning.dark"
                        : "primary.main",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {severityLabel}
                </Box>
              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={0.3}
              >
                SKU: {item.sku || "N/A"}
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={{
                  xs: 0.4,
                  sm: 2,
                }}
                mt={0.8}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                >
                  <WarehouseRoundedIcon
                    sx={{
                      fontSize: 15,
                      color:
                        "text.secondary",
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {item.warehouse ||
                      "Warehouse not assigned"}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                >
                  <LocalShippingRoundedIcon
                    sx={{
                      fontSize: 15,
                      color:
                        "text.secondary",
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {item.supplier ||
                      "Supplier not assigned"}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          {/* ==================================================
              Stock Information
          ================================================== */}

          <Box
            sx={{
              minWidth: {
                xs: "100%",
                md: 250,
              },
              px: {
                xs: 0,
                md: 2,
              },
              py: {
                xs: 1.5,
                md: 0,
              },
              borderTop: {
                xs: "1px solid",
                md: "none",
              },
              borderBottom: {
                xs: "1px solid",
                md: "none",
              },
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              justifyContent={{
                xs: "space-between",
                md: "center",
              }}
              alignItems="center"
              spacing={2}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Current stock
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={800}
                  color={
                    isOutOfStock
                      ? "error.main"
                      : isCritical
                      ? "warning.main"
                      : "primary.main"
                }
                  sx={{
                    lineHeight: 1.1,
                  }}
                >
                  {currentStock}
                </Typography>
              </Box>

              <Stack
                alignItems={{
                  xs: "flex-end",
                  md: "center",
                }}
                spacing={0.7}
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

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Reorder at{" "}
                  {reorderLevel}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* ==================================================
              Actions
          ================================================== */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
              md: "column",
            }}
            spacing={1}
            sx={{
              width: {
                xs: "100%",
                md: 150,
              },
              flexShrink: 0,
            }}
          >
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={
                <VisibilityRoundedIcon />
              }
              onClick={() =>
                navigate(
                  `/inventory/${item.id}`
                )
              }
              sx={{
                minHeight: 40,
                borderRadius: 2,
                textTransform:
                  "none",
                fontWeight: 700,
                transition:
                  "all .25s ease",

                "&:hover": {
                  transform:
                    "translateY(-2px)",
                },
              }}
            >
              View Details
            </Button>

            <Button
              fullWidth
              size="small"
              variant="contained"
              onClick={() =>
                handleOpenStockModal(item)
              }
              sx={{
                minHeight: 40,
                borderRadius: 2,
                textTransform:
                  "none",
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, #168aad, #2a9d8f)",
                boxShadow:
                  "0 5px 14px rgba(22,138,173,.16)",
                transition:
                  "all .25s ease",

                "&:hover": {
                  transform:
                    "translateY(-2px)",
                  boxShadow:
                    "0 8px 20px rgba(22,138,173,.22)",
                },
              }}
            >
              Update Stock
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  };

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },
        px: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: {
            xs: 2.5,
            md: 4,
          },
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",

          "&::before": {
            content: '""',
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "rgba(22,138,173,.035)",
            top: -170,
            right: -100,
            pointerEvents: "none",
          },

          "&::after": {
            content: '""',
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "rgba(42,157,143,.025)",
            bottom: -150,
            left: -100,
            pointerEvents: "none",
          },
        }}
      >
        {/* ==================================================
            Page Content
        ================================================== */}

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
              lg: 3.5,
            },
          }}
        >
          {/* ==================================================
              Header
          ================================================== */}

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
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              minWidth={0}
            >
              <Box
                sx={{
                  width: {
                    xs: 46,
                    sm: 52,
                  },
                  height: {
                    xs: 46,
                    sm: 52,
                  },
                  flexShrink: 0,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                  bgcolor:
                    "rgba(22,138,173,.09)",
                  animation:
                    "inventoryAlertFloat 4s ease-in-out infinite",
                }}
              >
                <WarningAmberRoundedIcon
                  sx={{
                    fontSize: {
                      xs: 26,
                      sm: 30,
                    },
                  }}
                />
              </Box>

              <Box minWidth={0}>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    fontSize: {
                      xs: "1.45rem",
                      sm: "1.7rem",
                      md: "2rem",
                    },
                    lineHeight: 1.2,
                  }}
                >
                  Inventory Alerts
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.4,
                    maxWidth: 620,
                  }}
                >
                  Review products that need
                  stock attention and take
                  action quickly.
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >
              <Tooltip title="Refresh alerts">
                <IconButton
                  onClick={
                    handleRefresh
                  }
                  disabled={loading}
                  sx={{
                    width: 42,
                    height: 42,
                    border: "1px solid",
                    borderColor:
                      "divider",
                    bgcolor:
                      "background.paper",
                    transition:
                      "all .25s ease",

                    "&:hover": {
                      transform:
                        "rotate(25deg)",
                      bgcolor:
                        "rgba(22,138,173,.06)",
                    },
                  }}
                >
                  <RefreshRoundedIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="outlined"
                startIcon={
                  <Inventory2RoundedIcon />
                }
                onClick={() =>
                  navigate("/inventory")
                }
                sx={{
                  minHeight: 42,
                  px: 2,
                  borderRadius: 2,
                  textTransform:
                    "none",
                  fontWeight: 700,
                  flex: {
                    xs: 1,
                    sm: "initial",
                  },
                  transition:
                    "all .25s ease",

                  "&:hover": {
                    transform:
                      "translateY(-2px)",
                  },
                }}
              >
                Inventory
              </Button>
            </Stack>
          </Stack>

          <Divider
            sx={{
              my: {
                xs: 2.5,
                md: 3,
              },
            }}
          />

          {/* ==================================================
              Stats
          ================================================== */}

          <InventoryStats
            stats={stats}
            loading={loading}
          />

          {/* ==================================================
              Search
          ================================================== */}

          <Box
            sx={{
              mt: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            <InventorySearch
              value={search}
              loading={loading}
              onSearch={setSearch}
            />
          </Box>

          {/* ==================================================
              Error
          ================================================== */}

          {displayedError && (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={
                    handleRefresh
                  }
                >
                  Retry
                </Button>
              }
              sx={{
                mt: 2.5,
                borderRadius: 2.5,
                alignItems: "center",
              }}
            >
              {displayedError}
            </Alert>
          )}

          {/* ==================================================
              Results Header
          ================================================== */}

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
              mt: {
                xs: 3,
                md: 3.5,
              },
              mb: 1.5,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.1rem",
                  },
                }}
              >
                Products requiring attention
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {loading
                  ? "Checking inventory..."
                  : search
                  ? `${filteredAlerts.length} matching alert${
                      filteredAlerts.length !==
                      1
                        ? "s"
                        : ""
                    }`
                  : `${filteredAlerts.length} active alert${
                      filteredAlerts.length !==
                      1
                        ? "s"
                        : ""
                    }`}
              </Typography>
            </Box>
          </Stack>

          {/* ==================================================
              Loading
          ================================================== */}

          {loading &&
            renderLoadingState()}

          {/* ==================================================
              Empty
          ================================================== */}

          {!loading &&
            filteredAlerts.length === 0 &&
            renderEmptyState()}

          {/* ==================================================
              Alert Cards
          ================================================== */}

          {!loading &&
            filteredAlerts.length > 0 && (
              <Stack spacing={1.5}>
                {filteredAlerts.map(
                  renderAlertCard
                )}
              </Stack>
            )}
        </Box>
      </Paper>

      {/* ======================================================
          Update Stock Modal
      ====================================================== */}

      <UpdateStockModal
        open={stockOpen}
        inventory={selectedInventory}
        loading={stockUpdating}
        onClose={
          handleCloseStockModal
        }
        onSave={handleStockUpdate}
      />

      {/* ======================================================
          Success Snackbar
      ====================================================== */}

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={2800}
        onClose={() =>
          setSuccessMessage("")
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() =>
            setSuccessMessage("")
          }
          sx={{
            width: "100%",
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* ======================================================
          Error Snackbar
      ====================================================== */}

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={4500}
        onClose={() =>
          setErrorMessage("")
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() =>
            setErrorMessage("")
          }
          sx={{
            width: "100%",
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* ======================================================
          Page Animations
      ====================================================== */}

      <style>
        {`
          @keyframes inventoryAlertCardEnter {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes inventoryAlertFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-4px);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        `}
      </style>
    </Container>
  );
}

export default InventoryAlerts;
