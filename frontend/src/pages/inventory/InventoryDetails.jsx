import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Link,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";

import StockBadge from "../../components/Inventory/StockBadge";
import UpdateStockModal from "../../components/Inventory/UpdateStockModal";

import {
  fetchInventoryById,
  updateInventory,
} from "../../redux/slices/inventorySlice";

function InventoryDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  // ==========================================================
  // Redux State
  // ==========================================================

  const { selectedItem, loading, error } = useSelector(
    (state) => state.inventory
  );

  // ==========================================================
  // Local State
  // ==========================================================

  const [stockOpen, setStockOpen] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [errorOpen, setErrorOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================================
  // Load Inventory
  // ==========================================================

  useEffect(() => {
    if (id) {
      dispatch(fetchInventoryById(id));
    }
  }, [dispatch, id]);

  // ==========================================================
  // Inventory Values
  // ==========================================================

  const currentStock = Number(
    selectedItem?.current_stock ?? 0
  );

  const minimumStock = Number(
    selectedItem?.minimum_stock ?? 0
  );

  const maximumStock = Number(
    selectedItem?.maximum_stock ?? 0
  );

  const reorderLevel = Number(
    selectedItem?.reorder_level ?? minimumStock
  );

  const safetyStock = Number(
    selectedItem?.safety_stock ?? 0
  );

  // ==========================================================
  // Stock Capacity
  // ==========================================================

  const stockCapacity = useMemo(() => {
    if (maximumStock <= 0) return 0;

    return Math.min(
      (currentStock / maximumStock) * 100,
      100
    );
  }, [currentStock, maximumStock]);

  // ==========================================================
  // Stock Difference From Maximum
  // ==========================================================

  const stockDifference = useMemo(() => {
    if (maximumStock <= 0) return 0;

    return currentStock - maximumStock;
  }, [currentStock, maximumStock]);

  // ==========================================================
  // Stock Health
  // ==========================================================

  const stockHealth = useMemo(() => {
    if (currentStock <= 0) {
      return {
        label: "Out of Stock",
        color: "error",
        icon: <WarningAmberRoundedIcon />,
      };
    }

    if (currentStock <= minimumStock) {
      return {
        label: "Low Stock",
        color: "warning",
        icon: <WarningAmberRoundedIcon />,
      };
    }

    if (
      maximumStock > 0 &&
      currentStock >= maximumStock
    ) {
      return {
        label: "Overstock",
        color: "info",
        icon: <TrendingUpRoundedIcon />,
      };
    }

    return {
      label: "Healthy Inventory",
      color: "success",
      icon: <CheckCircleRoundedIcon />,
    };
  }, [
    currentStock,
    minimumStock,
    maximumStock,
  ]);

  // ==========================================================
  // Shared Button Style
  // ==========================================================

  const actionButtonSx = {
    minHeight: 48,
    minWidth: 150,
    borderRadius: 2.5,
    fontWeight: 700,
    textTransform: "none",
    transition: "all .25s ease",

    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: 3,
    },

    "&:disabled": {
      transform: "none",
    },
  };

  // ==========================================================
  // Refresh
  // ==========================================================

  const handleRefresh = () => {
    if (id) {
      dispatch(fetchInventoryById(id));
    }
  };

  // ==========================================================
  // Update Stock
  // ==========================================================

  const handleStockUpdate = async (quantity) => {
    if (!selectedItem) return;

    try {
      await dispatch(
        updateInventory({
          id: selectedItem.id,
          inventoryData: {
            current_stock: quantity,
          },
        })
      ).unwrap();

      setStockOpen(false);

      setSuccessOpen(true);

      dispatch(fetchInventoryById(id));
    } catch (err) {
      setErrorMessage(
        err?.message ||
          "Unable to update inventory stock."
      );

      setErrorOpen(true);
    }
  };

  // ==========================================================
  // Loading State
  // ==========================================================

  if (loading && !selectedItem) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
          textAlign="center"
        >
          <CircularProgress size={44} />

          <Typography
            variant="h6"
            fontWeight={600}
          >
            Loading inventory details...
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Please wait while we retrieve the
            inventory information.
          </Typography>
        </Stack>
      </Container>
    );
  }

  // ==========================================================
  // Error / Not Found
  // ==========================================================

  if (!loading && !selectedItem) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 3,
            sm: 4,
            md: 6,
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Inventory2RoundedIcon
            color="disabled"
            sx={{
              fontSize: 64,
              mb: 2,
            }}
          />

          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
          >
            Inventory Not Found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            {error ||
              "The requested inventory record could not be found."}
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/inventory")}
            sx={actionButtonSx}
          >
            Back to Inventory
          </Button>
        </Paper>
      </Container>
    );
  }

  // ==========================================================
  // Product Information
  // ==========================================================

  const productName =
    selectedItem?.product_name ||
    selectedItem?.product?.name ||
    "Inventory Details";

  const productSku =
    selectedItem?.sku ||
    selectedItem?.product?.sku ||
    "-";

  const productId =
    selectedItem?.product_id ||
    selectedItem?.product?.id ||
    "-";

  const warehouse =
    selectedItem?.warehouse || "-";

  const supplier =
    selectedItem?.supplier || "-";

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
          border: "1px solid",
          borderColor: "divider",
          borderRadius: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          overflow: "hidden",
        }}
      >
        {/* ======================================================
            Breadcrumbs
        ====================================================== */}

        <Breadcrumbs
          separator="/"
          sx={{
            mb: {
              xs: 2.5,
              md: 3,
            },
            "& .MuiBreadcrumbs-ol": {
              flexWrap: "wrap",
            },
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            onClick={() =>
              navigate("/dashboard")
            }
            sx={{
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Dashboard
          </Link>

          <Link
            underline="hover"
            color="inherit"
            onClick={() =>
              navigate("/inventory")
            }
            sx={{
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Inventory
          </Link>

          <Typography
            color="text.primary"
            fontWeight={600}
          >
            Details
          </Typography>
        </Breadcrumbs>

        {/* ======================================================
            Header
        ====================================================== */}

        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            lg: "center",
          }}
          spacing={3}
          mb={4}
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
            sx={{
              minWidth: 0,
              width: {
                xs: "100%",
                lg: "auto",
              },
            }}
          >
            <Box
              sx={{
                width: {
                  xs: 56,
                  sm: 64,
                },
                height: {
                  xs: 56,
                  sm: 64,
                },
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <Inventory2RoundedIcon
                sx={{
                  fontSize: {
                    xs: 30,
                    sm: 34,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={{
                  xs: 1,
                  sm: 1.5,
                }}
                alignItems={{
                  xs: "flex-start",
                  sm: "center",
                }}
                mb={1}
              >
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      xs: "1.7rem",
                      sm: "2rem",
                      md: "2.25rem",
                    },
                    wordBreak: "break-word",
                  }}
                >
                  {productName}
                </Typography>

                <StockBadge
                  status={selectedItem.status}
                  currentStock={currentStock}
                  minimumStock={minimumStock}
                  maximumStock={maximumStock}
                />
              </Stack>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 750,
                  lineHeight: 1.8,
                }}
              >
                View complete inventory information,
                stock configuration, warehouse assignment,
                supplier details and current stock health.
              </Typography>
            </Box>
          </Stack>

          {/* Header Actions */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
            sx={{
              width: {
                xs: "100%",
                lg: "auto",
              },
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <ArrowBackRoundedIcon />
              }
              onClick={() =>
                navigate("/inventory")
              }
              sx={actionButtonSx}
            >
              Back
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <RefreshRoundedIcon />
              }
              onClick={handleRefresh}
              disabled={loading}
              sx={actionButtonSx}
            >
              Refresh
            </Button>

            <Button
              fullWidth
              variant="contained"
              startIcon={
                <EditRoundedIcon />
              }
              onClick={() =>
                navigate(
                  `/inventory/edit/${id}`
                )
              }
              sx={{
                ...actionButtonSx,
                minWidth: 175,
              }}
            >
              Edit Inventory
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* ======================================================
            Top Overview
        ====================================================== */}

        <Grid
          container
          spacing={3}
          mb={3}
        >
          {/* Product Information */}

          <Grid
            item
            xs={12}
            lg={8}
          >
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3,
                },
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                justifyContent="space-between"
                spacing={3}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={2.5}
                  >
                    Product Information
                  </Typography>

                  <Grid
                    container
                    spacing={2.5}
                  >
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Product ID
                      </Typography>

                      <Typography
                        fontWeight={700}
                        mt={0.5}
                      >
                        #{productId}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        SKU
                      </Typography>

                      <Typography
                        fontWeight={700}
                        mt={0.5}
                        sx={{
                          wordBreak: "break-word",
                        }}
                      >
                        {productSku}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <WarehouseRoundedIcon
                          fontSize="small"
                          color="action"
                        />

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Warehouse
                          </Typography>

                          <Typography
                            fontWeight={600}
                            sx={{
                              wordBreak: "break-word",
                            }}
                          >
                            {warehouse}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <LocalShippingRoundedIcon
                          fontSize="small"
                          color="action"
                        />

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Supplier
                          </Typography>

                          <Typography
                            fontWeight={600}
                            sx={{
                              wordBreak: "break-word",
                            }}
                          >
                            {supplier}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>

                {/* Inventory ID */}

                <Box
                  sx={{
                    minWidth: {
                      xs: "100%",
                      sm: 150,
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Inventory ID
                  </Typography>

                  <Box mt={1}>
                    <Chip
                      label={`#${selectedItem.id}`}
                      color="primary"
                      sx={{
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Stock Health */}

          <Grid
            item
            xs={12}
            lg={4}
          >
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3,
                },
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                mb={2.5}
              >
                Stock Health
              </Typography>

              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Current Status
                  </Typography>

                  <Box mt={1}>
                    <StockBadge
                      status={selectedItem.status}
                      currentStock={currentStock}
                      minimumStock={minimumStock}
                      maximumStock={maximumStock}
                    />
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Inventory Health
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mt={1}
                  >
                    {stockHealth.icon}

                    <Typography
                      fontWeight={700}
                      color={`${stockHealth.color}.main`}
                    >
                      {stockHealth.label}
                    </Typography>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Last Updated
                  </Typography>

                  <Typography
                    fontWeight={600}
                    mt={0.5}
                  >
                    {selectedItem.updated_at
                      ? new Date(
                          selectedItem.updated_at
                        ).toLocaleString()
                      : "-"}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* ======================================================
            Stock Capacity
        ====================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2.5,
              sm: 3,
            },
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            spacing={1}
            mb={1.5}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Warehouse Capacity
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Current stock compared with maximum
                configured stock capacity.
              </Typography>
            </Box>

            <Typography
              variant="h6"
              fontWeight={700}
            >
              {Math.round(stockCapacity)}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={stockCapacity}
            sx={{
              height: 11,
              borderRadius: 10,
            }}
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            mt={1}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Current: {currentStock}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Maximum:{" "}
              {maximumStock || "Not configured"}
            </Typography>
          </Stack>

          {maximumStock > 0 &&
            stockDifference > 0 && (
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                }}
              >
                Current stock exceeds the configured
                maximum stock by{" "}
                <strong>
                  {stockDifference} units
                </strong>
                .
              </Alert>
            )}
        </Paper>

        {/* ======================================================
            Stock Information + Thresholds
        ====================================================== */}

        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
            lg={8}
          >
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3,
                },
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                justifyContent="space-between"
                spacing={2}
                mb={3}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Stock Configuration
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Current quantities and inventory
                    thresholds.
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={
                    <InventoryRoundedIcon />
                  }
                  onClick={() =>
                    setStockOpen(true)
                  }
                  sx={{
                    ...actionButtonSx,
                    minWidth: {
                      xs: "100%",
                      sm: 170,
                    },
                  }}
                >
                  Update Stock
                </Button>
              </Stack>

              <Grid
                container
                spacing={2}
              >
                {[
                  {
                    label: "Current Stock",
                    value: currentStock,
                    color: "primary.main",
                  },
                  {
                    label: "Minimum Stock",
                    value: minimumStock,
                    color: "warning.main",
                  },
                  {
                    label: "Maximum Stock",
                    value:
                      maximumStock || "-",
                    color: "info.main",
                  },
                  {
                    label: "Reorder Level",
                    value: reorderLevel,
                    color: "warning.dark",
                  },
                  {
                    label: "Safety Stock",
                    value: safetyStock,
                    color: "success.main",
                  },
                ].map((item) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={item.label}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        height: "100%",
                        borderRadius: 3,
                        transition:
                          "all .25s ease",

                        "&:hover": {
                          transform:
                            "translateY(-3px)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.label}
                      </Typography>

                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color={item.color}
                        mt={1}
                      >
                        {item.value}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        units
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* ====================================================
              Threshold Analysis
          ==================================================== */}

          <Grid
            item
            xs={12}
            lg={4}
          >
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3,
                },
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                mb={2.5}
              >
                Threshold Analysis
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Minimum Level
                    </Typography>

                    <Typography
                      fontWeight={700}
                    >
                      {minimumStock}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={
                      maximumStock > 0
                        ? Math.min(
                            (minimumStock /
                              maximumStock) *
                              100,
                            100
                          )
                        : 0
                    }
                    color="warning"
                    sx={{
                      mt: 1,
                      height: 7,
                      borderRadius: 10,
                    }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Reorder Level
                    </Typography>

                    <Typography
                      fontWeight={700}
                    >
                      {reorderLevel}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={
                      maximumStock > 0
                        ? Math.min(
                            (reorderLevel /
                              maximumStock) *
                              100,
                            100
                          )
                        : 0
                    }
                    color="info"
                    sx={{
                      mt: 1,
                      height: 7,
                      borderRadius: 10,
                    }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Current Level
                    </Typography>

                    <Typography
                      fontWeight={700}
                    >
                      {currentStock}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={stockCapacity}
                    color={
                      stockHealth.color
                    }
                    sx={{
                      mt: 1,
                      height: 7,
                      borderRadius: 10,
                    }}
                  />
                </Box>
              </Stack>

              {currentStock <= reorderLevel && (
                <Alert
                  severity={
                    currentStock <= 0
                      ? "error"
                      : "warning"
                  }
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                  }}
                >
                  {currentStock <= 0
                    ? "This product is currently out of stock."
                    : "Current stock is at or below the reorder level."}
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* ======================================================
            Warehouse & Supplier
        ====================================================== */}

        <Grid
          container
          spacing={3}
          mt={0}
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3,
                },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                mb={2}
              >
                <WarehouseRoundedIcon
                  color="primary"
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Warehouse Information
                </Typography>
              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Assigned Warehouse
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                mt={0.5}
                sx={{
                  wordBreak: "break-word",
                }}
              >
                {warehouse}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
              >
                This inventory record is currently
                assigned to the above warehouse location.
              </Typography>
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3,
                },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                mb={2}
              >
                <LocalShippingRoundedIcon
                  color="primary"
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Supplier Information
                </Typography>
              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Supplier
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                mt={0.5}
                sx={{
                  wordBreak: "break-word",
                }}
              >
                {supplier}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
              >
                Supplier information is used for
                inventory replenishment and future
                purchasing recommendations.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* ======================================================
            Future Enhancements
        ====================================================== */}

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: {
              xs: 2.5,
              sm: 3,
            },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.default",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={1}
          >
            Inventory Intelligence
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.8,
              maxWidth: 900,
              mb: 2.5,
            }}
          >
            This inventory record can later be enhanced
            with demand forecasting, stock movement
            history, supplier performance analytics,
            purchase recommendations and warehouse
            intelligence.
          </Typography>

          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1}
          >
            <Chip
              color="success"
              variant="outlined"
              label="Stock Movement History"
            />

            <Chip
              color="primary"
              variant="outlined"
              label="Supplier Analytics"
            />

            <Chip
              color="warning"
              variant="outlined"
              label="AI Demand Forecast"
            />

            <Chip
              color="secondary"
              variant="outlined"
              label="Purchase Recommendations"
            />

            <Chip
              color="info"
              variant="outlined"
              label="Warehouse Insights"
            />

            <Chip
              variant="outlined"
              label="Inventory Trends"
            />
          </Stack>
        </Paper>

        {/* ======================================================
            Bottom Actions
        ====================================================== */}

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: {
              xs: 2.5,
              sm: 3,
            },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.default",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              lg: "row",
            }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{
              xs: "stretch",
              lg: "center",
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                gutterBottom
              >
                Inventory Record
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: 750,
                  lineHeight: 1.8,
                }}
              >
                Keep stock quantities, warehouse
                assignments, supplier information and
                inventory thresholds up to date for
                accurate reporting and reliable
                replenishment decisions.
              </Typography>
            </Box>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
              sx={{
                width: {
                  xs: "100%",
                  lg: "auto",
                },
                flexShrink: 0,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <ArrowBackRoundedIcon />
                }
                onClick={() =>
                  navigate("/inventory")
                }
                sx={actionButtonSx}
              >
                Back to Inventory
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <RefreshRoundedIcon />
                }
                onClick={handleRefresh}
                disabled={loading}
                sx={actionButtonSx}
              >
                Refresh
              </Button>

              <Button
                fullWidth
                variant="contained"
                startIcon={
                  <EditRoundedIcon />
                }
                onClick={() =>
                  navigate(
                    `/inventory/edit/${id}`
                  )
                }
                sx={{
                  ...actionButtonSx,
                  minWidth: 180,
                }}
              >
                Edit Inventory
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Paper>

      {/* ======================================================
          Update Stock Modal
      ====================================================== */}

      <UpdateStockModal
        open={stockOpen}
        inventory={selectedItem}
        loading={loading}
        onClose={() => {
          setStockOpen(false);
        }}
        onSave={handleStockUpdate}
      />

      {/* ======================================================
          Success Snackbar
      ====================================================== */}

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() =>
          setSuccessOpen(false)
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() =>
            setSuccessOpen(false)
          }
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Inventory stock updated successfully.
        </Alert>
      </Snackbar>

      {/* ======================================================
          Error Snackbar
      ====================================================== */}

      <Snackbar
        open={errorOpen}
        autoHideDuration={4500}
        onClose={() =>
          setErrorOpen(false)
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() =>
            setErrorOpen(false)
          }
          severity="error"
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default InventoryDetails;
