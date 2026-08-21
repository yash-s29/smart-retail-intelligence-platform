import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";

import InventoryStats from "../../components/Inventory/InventoryStats";
import InventorySearch from "../../components/Inventory/InventorySearch";

import {
  fetchRecommendations,
} from "../../redux/slices/inventorySlice";

function RestockRecommendations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================================
  // Redux State
  // ==========================================================

  const {
    recommendations,
    loading,
    error,
  } = useSelector((state) => state.inventory);

  // ==========================================================
  // Local State
  // ==========================================================

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [warehouseFilter, setWarehouseFilter] = useState("All");
  const [supplierFilter, setSupplierFilter] = useState("All");

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // ==========================================================
  // Load Recommendations
  // ==========================================================

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  // ==========================================================
  // Safe Recommendation Data
  // ==========================================================

  const recommendationList = useMemo(() => {
    return Array.isArray(recommendations)
      ? recommendations
      : [];
  }, [recommendations]);

  // ==========================================================
  // Warehouse Options
  // ==========================================================

  const warehouseOptions = useMemo(() => {
    const warehouses = [
      ...new Set(
        recommendationList
          .map((item) => item.warehouse)
          .filter(Boolean)
      ),
    ];

    return ["All", ...warehouses];
  }, [recommendationList]);

  // ==========================================================
  // Supplier Options
  // ==========================================================

  const supplierOptions = useMemo(() => {
    const suppliers = [
      ...new Set(
        recommendationList
          .map((item) => item.supplier)
          .filter(Boolean)
      ),
    ];

    return ["All", ...suppliers];
  }, [recommendationList]);

  // ==========================================================
  // Filter Recommendations
  // ==========================================================

  const filteredRecommendations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return recommendationList
      .filter((item) => {
        const matchesSearch =
          !keyword ||
          item.product_name
            ?.toLowerCase()
            .includes(keyword) ||
          item.sku
            ?.toLowerCase()
            .includes(keyword) ||
          item.supplier
            ?.toLowerCase()
            .includes(keyword) ||
          item.warehouse
            ?.toLowerCase()
            .includes(keyword);

        const matchesPriority =
          priorityFilter === "All" ||
          item.priority === priorityFilter;

        const matchesWarehouse =
          warehouseFilter === "All" ||
          item.warehouse === warehouseFilter;

        const matchesSupplier =
          supplierFilter === "All" ||
          item.supplier === supplierFilter;

        return (
          matchesSearch &&
          matchesPriority &&
          matchesWarehouse &&
          matchesSupplier
        );
      })
      .sort((a, b) => {
        const priorityWeight = {
          High: 3,
          Medium: 2,
          Low: 1,
        };

        return (
          (priorityWeight[b.priority] || 0) -
          (priorityWeight[a.priority] || 0)
        );
      });
  }, [
    recommendationList,
    search,
    priorityFilter,
    warehouseFilter,
    supplierFilter,
  ]);

  // ==========================================================
  // Statistics
  // ==========================================================

  const stats = useMemo(() => {
    const total = filteredRecommendations.length;

    const high = filteredRecommendations.filter(
      (item) => item.priority === "High"
    ).length;

    const medium = filteredRecommendations.filter(
      (item) => item.priority === "Medium"
    ).length;

    const low = filteredRecommendations.filter(
      (item) => item.priority === "Low"
    ).length;

    return {
      totalProducts: total,
      inStock: high,
      lowStock: medium,
      outOfStock: low,
      criticalStock: high,
    };
  }, [filteredRecommendations]);

  // ==========================================================
  // Estimated Purchase Cost
  // ==========================================================

  const totalEstimatedCost = useMemo(() => {
    return filteredRecommendations.reduce(
      (sum, item) =>
        sum + Number(item.estimated_cost || 0),
      0
    );
  }, [filteredRecommendations]);

  // ==========================================================
  // Average Recommended Quantity
  // ==========================================================

  const averageRecommended = useMemo(() => {
    if (!filteredRecommendations.length) {
      return 0;
    }

    const total = filteredRecommendations.reduce(
      (sum, item) =>
        sum +
        Number(item.recommended_quantity || 0),
      0
    );

    return Math.round(
      total / filteredRecommendations.length
    );
  }, [filteredRecommendations]);

  // ==========================================================
  // Helpers
  // ==========================================================

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";

      case "Medium":
        return "warning";

      case "Low":
        return "success";

      default:
        return "default";
    }
  };

  const getStockProgress = (
    currentStock,
    minimumStock
  ) => {
    if (!minimumStock) {
      return 100;
    }

    return Math.min(
      Math.max(
        (currentStock / minimumStock) * 100,
        0
      ),
      100
    );
  };

  const getStockStatus = (
    currentStock,
    minimumStock
  ) => {
    if (currentStock <= 0) {
      return {
        label: "Out of Stock",
        color: "error",
      };
    }

    if (currentStock <= minimumStock) {
      return {
        label: "Low Stock",
        color: "warning",
      };
    }

    return {
      label: "Healthy",
      color: "success",
    };
  };

  // ==========================================================
  // Shared Styles
  // ==========================================================

  const actionButtonSx = {
    minHeight: 46,
    borderRadius: 2.5,
    textTransform: "none",
    fontWeight: 700,
    px: 2.5,
    transition: "all .25s ease",

    "&:hover": {
      transform: "translateY(-2px)",
    },
  };

  // ==========================================================
  // Render
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
          border: "1px solid",
          borderColor: "divider",
          borderRadius: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
          overflow: "hidden",
        }}
      >
        {/* =====================================================
            Page Header
        ====================================================== */}

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
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
          >
            {/* Header Information */}

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
                    xs: 54,
                    sm: 62,
                  },
                  height: {
                    xs: 54,
                    sm: 62,
                  },
                  bgcolor: "primary.main",
                  borderRadius: 3,
                  flexShrink: 0,
                }}
              >
                <AutoAwesomeRoundedIcon
                  fontSize="large"
                />
              </Avatar>

              <Box>
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={1}
                  alignItems={{
                    xs: "flex-start",
                    sm: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{
                      fontSize: {
                        xs: "1.7rem",
                        sm: "2rem",
                        md: "2.2rem",
                      },
                    }}
                  >
                    AI Restock Recommendations
                  </Typography>

                  <Chip
                    icon={
                      <AutoAwesomeRoundedIcon />
                    }
                    label="AI Powered"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    maxWidth: 760,
                    lineHeight: 1.7,
                  }}
                >
                  Intelligent purchasing suggestions
                  based on current inventory levels,
                  reorder policy, safety stock,
                  warehouse availability and
                  inventory thresholds.
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
              <Tooltip title="Refresh Recommendations">
                <IconButton
                  color="primary"
                  size="large"
                  onClick={() =>
                    dispatch(
                      fetchRecommendations()
                    )
                  }
                  disabled={loading}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2.5,
                    alignSelf: {
                      xs: "flex-start",
                      sm: "center",
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
                sx={actionButtonSx}
              >
                Inventory
              </Button>

              <Button
                variant="contained"
                startIcon={
                  <LocalShippingRoundedIcon />
                }
                onClick={() =>
                  setSnackbarOpen(true)
                }
                sx={actionButtonSx}
              >
                Generate Purchase List
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* =====================================================
              Statistics
          ====================================================== */}

          <InventoryStats
            stats={stats}
            loading={loading}
          />

          {/* =====================================================
              Executive Summary
          ====================================================== */}

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
            mt={4}
          >
            {/* Estimated Cost */}

            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                p: {
                  xs: 2.5,
                  md: 3,
                },
                borderRadius: 3,
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.dark",
                  }}
                >
                  <AttachMoneyRoundedIcon />
                </Avatar>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Estimated Purchase Cost
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    ₹
                    {totalEstimatedCost.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Average Order */}

            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                p: {
                  xs: 2.5,
                  md: 3,
                },
                borderRadius: 3,
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Avatar
                  sx={{
                    bgcolor: "success.light",
                    color: "success.dark",
                  }}
                >
                  <ShoppingCartRoundedIcon />
                </Avatar>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Average Suggested Order
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    {averageRecommended} units
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* High Priority */}

            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                p: {
                  xs: 2.5,
                  md: 3,
                },
                borderRadius: 3,
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Avatar
                  sx={{
                    bgcolor: "warning.light",
                    color: "warning.dark",
                  }}
                >
                  <WarningAmberRoundedIcon />
                </Avatar>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    High Priority Products
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    {filteredRecommendations.filter(
                      (item) =>
                        item.priority === "High"
                    ).length}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>

          {/* =====================================================
              AI Banner
          ====================================================== */}

          <Alert
            icon={<AutoAwesomeRoundedIcon />}
            severity="info"
            sx={{
              mt: 4,
              borderRadius: 3,
              alignItems: "flex-start",
            }}
          >
            <Typography fontWeight={700}>
              AI Inventory Insight
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
              }}
            >
              Recommendations are prioritized using
              current stock, minimum stock, reorder
              levels, safety stock, supplier details
              and warehouse availability. High-priority
              products are displayed first.
            </Typography>
          </Alert>

          {/* =====================================================
              Filters
          ====================================================== */}

          <Paper
            variant="outlined"
            sx={{
              p: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
              borderRadius: 3,
              mt: 4,
            }}
          >
            <Stack
              direction={{
                xs: "column",
                lg: "row",
              }}
              spacing={2}
            >
              <Box
                sx={{
                  flex: 2,
                  minWidth: 0,
                }}
              >
                <InventorySearch
                  value={search}
                  loading={loading}
                  onSearch={setSearch}
                />
              </Box>

              <TextField
                select
                fullWidth
                label="Priority"
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(
                    event.target.value
                  )
                }
              >
                <MenuItem value="All">
                  All Priorities
                </MenuItem>

                <MenuItem value="High">
                  High
                </MenuItem>

                <MenuItem value="Medium">
                  Medium
                </MenuItem>

                <MenuItem value="Low">
                  Low
                </MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                label="Warehouse"
                value={warehouseFilter}
                onChange={(event) =>
                  setWarehouseFilter(
                    event.target.value
                  )
                }
              >
                {warehouseOptions.map(
                  (warehouse) => (
                    <MenuItem
                      key={warehouse}
                      value={warehouse}
                    >
                      {warehouse}
                    </MenuItem>
                  )
                )}
              </TextField>

              <TextField
                select
                fullWidth
                label="Supplier"
                value={supplierFilter}
                onChange={(event) =>
                  setSupplierFilter(
                    event.target.value
                  )
                }
              >
                {supplierOptions.map(
                  (supplier) => (
                    <MenuItem
                      key={supplier}
                      value={supplier}
                    >
                      {supplier}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Stack>

            {/* Active Filters */}

            {(search ||
              priorityFilter !== "All" ||
              warehouseFilter !== "All" ||
              supplierFilter !== "All") && (
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                mt={2}
              >
                {search && (
                  <Chip
                    label={`Search: ${search}`}
                    onDelete={() => setSearch("")}
                    size="small"
                  />
                )}

                {priorityFilter !== "All" && (
                  <Chip
                    label={`Priority: ${priorityFilter}`}
                    onDelete={() =>
                      setPriorityFilter("All")
                    }
                    size="small"
                  />
                )}

                {warehouseFilter !== "All" && (
                  <Chip
                    label={`Warehouse: ${warehouseFilter}`}
                    onDelete={() =>
                      setWarehouseFilter("All")
                    }
                    size="small"
                  />
                )}

                {supplierFilter !== "All" && (
                  <Chip
                    label={`Supplier: ${supplierFilter}`}
                    onDelete={() =>
                      setSupplierFilter("All")
                    }
                    size="small"
                  />
                )}
              </Stack>
            )}
          </Paper>

          {/* =====================================================
              Error
          ====================================================== */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                borderRadius: 3,
              }}
            >
              {error}
            </Alert>
          )}

          {/* =====================================================
              Loading
          ====================================================== */}

          {loading ? (
            <Box
              sx={{
                py: 8,
              }}
            >
              <LinearProgress />

              <Typography
                align="center"
                mt={3}
                color="text.secondary"
              >
                AI is generating restock
                recommendations...
              </Typography>
            </Box>
          ) : filteredRecommendations.length ===
            0 ? (
            /* ===================================================
                Empty State
            ==================================================== */

            <Paper
              variant="outlined"
              sx={{
                mt: 4,
                py: {
                  xs: 7,
                  md: 10,
                },
                px: 3,
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "success.light",
                  color: "success.dark",
                }}
              >
                <Inventory2RoundedIcon
                  sx={{
                    fontSize: 36,
                  }}
                />
              </Avatar>

              <Typography
                variant="h5"
                fontWeight={800}
                gutterBottom
              >
                No Restock Recommendations
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  mx: "auto",
                  lineHeight: 1.7,
                }}
              >
                No products currently match the
                selected filters or require
                replenishment based on the available
                inventory information.
              </Typography>

              <Button
                variant="outlined"
                startIcon={
                  <RefreshRoundedIcon />
                }
                onClick={() => {
                  setSearch("");
                  setPriorityFilter("All");
                  setWarehouseFilter("All");
                  setSupplierFilter("All");
                  dispatch(
                    fetchRecommendations()
                  );
                }}
                sx={{
                  ...actionButtonSx,
                  mt: 3,
                }}
              >
                Reset & Refresh
              </Button>
            </Paper>
          ) : (
            /* ===================================================
                Recommendation Cards
            ==================================================== */

            <Stack
              spacing={2.5}
              mt={4}
            >
              {filteredRecommendations.map(
                (item) => {
                  const currentStock = Number(
                    item.current_stock || 0
                  );

                  const minimumStock = Number(
                    item.minimum_stock || 0
                  );

                  const recommendedQuantity =
                    Number(
                      item.recommended_quantity ||
                        0
                    );

                  const estimatedCost = Number(
                    item.estimated_cost || 0
                  );

                  const progress =
                    getStockProgress(
                      currentStock,
                      minimumStock
                    );

                  const priorityColor =
                    getPriorityColor(
                      item.priority
                    );

                  const stockStatus =
                    getStockStatus(
                      currentStock,
                      minimumStock
                    );

                  return (
                    <Paper
                      key={item.id}
                      variant="outlined"
                      sx={{
                        p: {
                          xs: 2,
                          sm: 2.5,
                          md: 3,
                        },
                        borderRadius: 3.5,
                        transition:
                          "all .25s ease",
                        overflow: "hidden",

                        "&:hover": {
                          boxShadow: 4,
                          transform:
                            "translateY(-2px)",
                        },
                      }}
                    >
                      <Stack spacing={3}>
                        {/* =================================
                            Product Header
                        ================================== */}

                        <Stack
                          direction={{
                            xs: "column",
                            md: "row",
                          }}
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{
                              minWidth: 0,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 58,
                                height: 58,
                                borderRadius: 3,
                                bgcolor:
                                  "primary.main",
                                flexShrink: 0,
                              }}
                            >
                              <Inventory2RoundedIcon />
                            </Avatar>

                            <Box
                              sx={{
                                minWidth: 0,
                              }}
                            >
                              <Typography
                                variant="h6"
                                fontWeight={800}
                                sx={{
                                  overflow:
                                    "hidden",
                                  textOverflow:
                                    "ellipsis",
                                  display:
                                    "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient:
                                    "vertical",
                                }}
                              >
                                {item.product_name ||
                                  "Unnamed Product"}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mt: 0.5,
                                }}
                              >
                                SKU:{" "}
                                {item.sku ||
                                  "N/A"}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Inventory ID:{" "}
                                {item.id}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack
                            direction={{
                              xs: "row",
                              md: "column",
                            }}
                            spacing={1}
                            alignItems={{
                              xs: "center",
                              md: "flex-end",
                            }}
                          >
                            <Chip
                              label={`${item.priority || "Low"} Priority`}
                              color={
                                priorityColor
                              }
                              icon={
                                <AutoAwesomeRoundedIcon />
                              }
                              sx={{
                                fontWeight: 700,
                              }}
                            />

                            <Chip
                              size="small"
                              label={
                                stockStatus.label
                              }
                              color={
                                stockStatus.color
                              }
                              variant="outlined"
                            />
                          </Stack>
                        </Stack>

                        <Divider />

                        {/* =================================
                            Stock Overview
                        ================================== */}

                        <Stack
                          direction={{
                            xs: "column",
                            md: "row",
                          }}
                          spacing={3}
                        >
                          {/* Current Stock */}

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
                              Current Stock
                            </Typography>

                            <Typography
                              variant="h4"
                              color="primary.main"
                              fontWeight={800}
                              sx={{
                                mt: 0.5,
                              }}
                            >
                              {currentStock}
                            </Typography>

                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                mt: 1.5,
                                height: 8,
                                borderRadius: 5,
                              }}
                            />

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                mt: 1,
                                display:
                                  "block",
                              }}
                            >
                              Minimum Required:{" "}
                              {minimumStock}
                            </Typography>
                          </Box>

                          {/* Recommended */}

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
                              Recommended Purchase
                            </Typography>

                            <Typography
                              variant="h4"
                              color="success.main"
                              fontWeight={800}
                              sx={{
                                mt: 0.5,
                              }}
                            >
                              {
                                recommendedQuantity
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 1,
                              }}
                            >
                              Suggested reorder
                              quantity based
                              on inventory
                              policy.
                            </Typography>
                          </Box>

                          {/* Cost */}

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
                              Estimated Cost
                            </Typography>

                            <Typography
                              variant="h4"
                              color="warning.main"
                              fontWeight={800}
                              sx={{
                                mt: 0.5,
                              }}
                            >
                              ₹
                              {estimatedCost.toLocaleString()}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 1,
                              }}
                            >
                              Approximate
                              purchasing
                              expense.
                            </Typography>
                          </Box>
                        </Stack>

                        <Divider />

                        {/* =================================
                            Supplier / Warehouse
                        ================================== */}

                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                          }}
                          spacing={3}
                        >
                          <Box
                            sx={{
                              flex: 1,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              mb={0.5}
                            >
                              <PersonRoundedIcon
                                fontSize="small"
                                color="action"
                              />

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Supplier
                              </Typography>
                            </Stack>

                            <Typography
                              fontWeight={700}
                            >
                              {item.supplier ||
                                "N/A"}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              flex: 1,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              mb={0.5}
                            >
                              <WarehouseRoundedIcon
                                fontSize="small"
                                color="action"
                              />

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Warehouse
                              </Typography>
                            </Stack>

                            <Typography
                              fontWeight={700}
                            >
                              {item.warehouse ||
                                "N/A"}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              flex: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Recommended Quantity
                            </Typography>

                            <Typography
                              fontWeight={700}
                              sx={{
                                mt: 0.5,
                              }}
                            >
                              {
                                recommendedQuantity
                              }{" "}
                              units
                            </Typography>
                          </Box>
                        </Stack>

                        <Divider />

                        {/* =================================
                            AI Insight
                        ================================== */}

                        <Alert
                          severity={
                            item.priority ===
                            "High"
                              ? "error"
                              : item.priority ===
                                "Medium"
                              ? "warning"
                              : "info"
                          }
                          icon={
                            <AutoAwesomeRoundedIcon />
                          }
                          sx={{
                            borderRadius: 2.5,
                            alignItems:
                              "flex-start",
                          }}
                        >
                          <Typography
                            fontWeight={700}
                          >
                            AI Insight
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mt: 0.5,
                              lineHeight: 1.6,
                            }}
                          >
                            {item.reason ||
                              "Stock level is approaching the reorder threshold. Replenishment is recommended to maintain product availability and prevent stock shortages."}
                          </Typography>
                        </Alert>

                        {/* =================================
                            Actions
                        ================================== */}

                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                          }}
                          spacing={1.5}
                          justifyContent="flex-end"
                        >
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() =>
                              navigate(
                                `/inventory/${item.id}`
                              )
                            }
                            sx={{
                              ...actionButtonSx,
                              width: {
                                xs: "100%",
                                sm: "auto",
                              },
                            }}
                          >
                            View Details
                          </Button>

                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={
                              <LocalShippingRoundedIcon />
                            }
                            onClick={() =>
                              setSnackbarOpen(
                                true
                              )
                            }
                            sx={{
                              ...actionButtonSx,
                              width: {
                                xs: "100%",
                                sm: "auto",
                              },
                            }}
                          >
                            Generate Purchase Order
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  );
                }
              )}
            </Stack>
          )}

          {/* =====================================================
              Bottom Purchasing Summary
          ====================================================== */}

          <Divider sx={{ my: 4 }} />

          <Paper
            variant="outlined"
            sx={{
              p: {
                xs: 2.5,
                sm: 3,
              },
              borderRadius: 3,
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
                xs: "flex-start",
                lg: "center",
              }}
            >
              <Box>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <AutoAwesomeRoundedIcon
                    color="primary"
                  />

                  <Typography
                    variant="h6"
                    fontWeight={800}
                  >
                    AI Purchasing Summary
                  </Typography>
                </Stack>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    lineHeight: 1.7,
                  }}
                >
                  {filteredRecommendations.length}{" "}
                  product
                  {filteredRecommendations.length !==
                    1 && "s"} currently require
                  replenishment. Estimated
                  purchasing cost is{" "}
                  <strong>
                    ₹
                    {totalEstimatedCost.toLocaleString()}
                  </strong>{" "}
                  with an average suggested order
                  quantity of{" "}
                  <strong>
                    {averageRecommended}
                  </strong>{" "}
                  units.
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
                }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={
                    <RefreshRoundedIcon />
                  }
                  onClick={() =>
                    dispatch(
                      fetchRecommendations()
                    )
                  }
                  sx={actionButtonSx}
                >
                  Refresh
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={
                    <LocalShippingRoundedIcon />
                  }
                  onClick={() =>
                    setSnackbarOpen(true)
                  }
                  sx={actionButtonSx}
                >
                  Generate Purchase Order
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* =====================================================
              Future AI Information
          ====================================================== */}

          <Alert
            severity="info"
            icon={<AutoAwesomeRoundedIcon />}
            sx={{
              mt: 4,
              borderRadius: 3,
              alignItems: "flex-start",
            }}
          >
            <Typography fontWeight={700}>
              Smart Retail Intelligence Roadmap
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                lineHeight: 1.7,
              }}
            >
              Future versions can automatically
              generate purchase orders, predict
              demand using AI, calculate supplier
              lead times, forecast seasonal demand
              and optimize warehouse replenishment.
            </Typography>
          </Alert>
        </Box>

        {/* =====================================================
            Snackbar
        ====================================================== */}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3500}
          onClose={() =>
            setSnackbarOpen(false)
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
              setSnackbarOpen(false)
            }
            sx={{
              width: "100%",
              borderRadius: 2.5,
              fontWeight: 600,
            }}
          >
            Purchase Order generation will be
            available in the next phase.
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default RestockRecommendations;
