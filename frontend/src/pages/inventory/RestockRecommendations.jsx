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
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";

import InventoryStats from "../../components/Inventory/InventoryStats";
import InventorySearch from "../../components/Inventory/InventorySearch";

import {
  fetchRecommendations,
} from "../../redux/slices/inventorySlice";

function RestockRecommendations() {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    recommendations,
    loading,
    error,
  } = useSelector(
    (state) => state.inventory
  );

  // =====================================================
  // Local State
  // =====================================================

  const [search, setSearch] = useState("");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [warehouseFilter, setWarehouseFilter] =
    useState("All");

  const [supplierFilter, setSupplierFilter] =
    useState("All");

  const [snackbarOpen, setSnackbarOpen] =
    useState(false);

  // =====================================================
  // Load Recommendations
  // =====================================================

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  // =====================================================
  // Warehouse Options
  // =====================================================

  const warehouseOptions = useMemo(() => {

    const warehouses = [
      ...new Set(
        recommendations
          ?.map((item) => item.warehouse)
          .filter(Boolean)
      ),
    ];

    return ["All", ...warehouses];

  }, [recommendations]);

  // =====================================================
  // Supplier Options
  // =====================================================

  const supplierOptions = useMemo(() => {

    const suppliers = [
      ...new Set(
        recommendations
          ?.map((item) => item.supplier)
          .filter(Boolean)
      ),
    ];

    return ["All", ...suppliers];

  }, [recommendations]);

  // =====================================================
  // Filter Recommendations
  // =====================================================

  const filteredRecommendations =
    useMemo(() => {

      if (!recommendations) return [];

      return recommendations

        .filter((item) => {

          const keyword =
            search.toLowerCase();

          const matchesSearch =
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

          const priority = {
            High: 3,
            Medium: 2,
            Low: 1,
          };

          return (
            priority[b.priority] -
            priority[a.priority]
          );

        });

    }, [
      recommendations,
      search,
      priorityFilter,
      warehouseFilter,
      supplierFilter,
    ]);

  // =====================================================
  // Dashboard Statistics
  // =====================================================

  const stats = useMemo(() => {

    const total =
      filteredRecommendations.length;

    const urgent =
      filteredRecommendations.filter(
        (item) =>
          item.priority === "High"
      ).length;

    const medium =
      filteredRecommendations.filter(
        (item) =>
          item.priority === "Medium"
      ).length;

    const low =
      filteredRecommendations.filter(
        (item) =>
          item.priority === "Low"
      ).length;

    return {

      totalProducts: total,

      inStock: urgent,

      lowStock: medium,

      outOfStock: low,

    };

  }, [filteredRecommendations]);

  // =====================================================
  // Estimated Purchase Cost
  // =====================================================

  const totalEstimatedCost =
    useMemo(() => {

      return filteredRecommendations.reduce(
        (sum, item) =>
          sum +
          Number(
            item.estimated_cost || 0
          ),
        0
      );

    }, [filteredRecommendations]);

  // =====================================================
  // Average Recommended Quantity
  // =====================================================

  const averageRecommended =
    useMemo(() => {

      if (
        filteredRecommendations.length === 0
      )
        return 0;

      const total =
        filteredRecommendations.reduce(
          (sum, item) =>
            sum +
            Number(
              item.recommended_quantity || 0
            ),
          0
        );

      return Math.round(
        total /
          filteredRecommendations.length
      );

    }, [filteredRecommendations]);

  // =====================================================
  // Helpers
  // =====================================================

  const getPriorityColor = (
    priority
  ) => {

    switch (priority) {

      case "High":
        return "error";

      case "Medium":
        return "warning";

      default:
        return "success";

    }

  };

  const getStockProgress = (
    current,
    minimum
  ) => {

    if (!minimum) return 100;

    return Math.min(
      (current / minimum) * 100,
      100
    );

  };

  // =====================================================
  // UI Starts Here
  // =====================================================

  return (
    <Container
  maxWidth="xl"
  sx={{
    py: {
      xs: 2,
      md: 3,
    },
  }}
>
  <Paper
    elevation={0}
    sx={{
      p: {
        xs: 2,
        sm: 3,
        md: 4,
      },
      borderRadius: 4,
      border: "1px solid",
      borderColor: "divider",
      overflow: "hidden",
    }}
  >
    {/* =====================================================
        Header
    ====================================================== */}

    <Stack
      direction={{
        xs: "column",
        lg: "row",
      }}
      justifyContent="space-between"
      spacing={3}
      alignItems={{
        xs: "flex-start",
        lg: "center",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 60,
            height: 60,
            borderRadius: 3,
          }}
        >
          <AutoAwesomeRoundedIcon
            fontSize="large"
          />
        </Avatar>

        <Box>

          <Typography
            variant="h4"
            fontWeight={800}
          >
            AI Restock Recommendations
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Intelligent purchasing suggestions
            based on inventory levels,
            reorder policy, safety stock
            and warehouse availability.
          </Typography>

        </Box>
      </Stack>

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        width={{
          xs: "100%",
          lg: "auto",
        }}
      >
        <Tooltip title="Refresh Recommendations">

          <IconButton
            color="primary"
            size="large"
            onClick={() =>
              dispatch(fetchRecommendations())
            }
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
      mb={4}
    >
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <TrendingUpRoundedIcon
            color="primary"
          />

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Estimated Purchase Cost
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
            >
              ₹
              {totalEstimatedCost.toLocaleString()}
            </Typography>

          </Box>
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Inventory2RoundedIcon
            color="success"
          />

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Average Suggested Order
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
            >
              {averageRecommended}
            </Typography>

          </Box>
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <WarningAmberRoundedIcon
            color="warning"
          />

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              High Priority Products
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
            >
              {stats.inStock}
            </Typography>

          </Box>
        </Stack>
      </Paper>
    </Stack>

    {/* =====================================================
        AI Recommendation Banner
    ====================================================== */}

    <Alert
      icon={<AutoAwesomeRoundedIcon />}
      severity="info"
      sx={{
        borderRadius: 3,
        mb: 4,
      }}
    >
      AI recommendations are generated using
      current stock, reorder level, safety
      stock, supplier information and
      inventory thresholds. High-priority
      products appear first.
    </Alert>

    {/* =====================================================
        Filters
    ====================================================== */}

    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
        mb: 4,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          lg: "row",
        }}
        spacing={2}
      >
        <Box flex={2}>
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
          onChange={(e) =>
            setPriorityFilter(
              e.target.value
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
          onChange={(e) =>
            setWarehouseFilter(
              e.target.value
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
          onChange={(e) =>
            setSupplierFilter(
              e.target.value
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
    </Paper>

    {/* =====================================================
        Error State
    ====================================================== */}

    {error && (
      <Alert
        severity="error"
        sx={{ mb: 3 }}
      >
        {error}
      </Alert>
    )}

    {/* =====================================================
        Loading State
    ====================================================== */}

    {loading ? (
      <Box py={6}>
        <LinearProgress />

        <Typography
          align="center"
          mt={3}
          color="text.secondary"
        >
          AI is generating restock recommendations...
        </Typography>
      </Box>
    ) : filteredRecommendations.length === 0 ? (
      <Stack spacing={3}>

  {filteredRecommendations.map((item) => {

    const progress = getStockProgress(
      Number(item.current_stock || 0),
      Number(item.minimum_stock || 1)
    );

    const priorityColor = getPriorityColor(
      item.priority
    );

    return (

      <Paper
        key={item.id}
        variant="outlined"
        sx={{
          borderRadius: 4,
          p: 3,
          transition: "all .25s ease",

          "&:hover": {
            boxShadow: 6,
            transform: "translateY(-3px)",
          },
        }}
      >

        <Stack
          spacing={3}
        >

          {/* ======================================
              Top Section
          ====================================== */}

          <Stack
            direction={{
              xs: "column",
              lg: "row",
            }}
            spacing={3}
            justifyContent="space-between"
          >

            {/* Product */}

            <Stack
              direction="row"
              spacing={2}
              flex={2}
            >

              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  bgcolor: "primary.main",
                }}
              >
                <Inventory2RoundedIcon />
              </Avatar>

              <Box>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {item.product_name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  SKU : {item.sku || "N/A"}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Inventory ID : {item.id}
                </Typography>

              </Box>

            </Stack>

            {/* Priority */}

            <Stack
              spacing={1}
              alignItems={{
                xs: "flex-start",
                lg: "flex-end",
              }}
            >

              <Chip
                label={`${item.priority} Priority`}
                color={priorityColor}
              />

              <Typography
                variant="caption"
                color="text.secondary"
              >
                AI Recommendation
              </Typography>

            </Stack>

          </Stack>

          <Divider />

          {/* ======================================
              Stock Overview
          ====================================== */}

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={4}
          >

            <Box flex={1}>

              <Typography
                fontWeight={600}
                gutterBottom
              >
                Current Stock
              </Typography>

              <Typography
                variant="h4"
                color="primary"
                fontWeight={700}
              >
                {item.current_stock}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 5,
                }}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                mt={1}
                display="block"
              >
                Minimum Required :
                {" "}
                {item.minimum_stock}
              </Typography>

            </Box>

            <Box flex={1}>

              <Typography
                fontWeight={600}
                gutterBottom
              >
                Recommended Purchase
              </Typography>

              <Typography
                variant="h4"
                color="success.main"
                fontWeight={700}
              >
                {item.recommended_quantity}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
              >
                Suggested reorder quantity
                calculated using inventory
                policy.
              </Typography>

            </Box>

            <Box flex={1}>

              <Typography
                fontWeight={600}
                gutterBottom
              >
                Estimated Cost
              </Typography>

              <Typography
                variant="h4"
                color="warning.main"
                fontWeight={700}
              >
                ₹
                {Number(
                  item.estimated_cost || 0
                ).toLocaleString()}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
              >
                Approximate purchasing
                expense.
              </Typography>

            </Box>

          </Stack>

          <Divider />

          {/* ======================================
              Supplier Details
          ====================================== */}

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={4}
          >

            <Box flex={1}>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Supplier
              </Typography>

              <Typography
                fontWeight={700}
              >
                {item.supplier || "N/A"}
              </Typography>

            </Box>

            <Box flex={1}>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Warehouse
              </Typography>

              <Typography
                fontWeight={700}
              >
                {item.warehouse || "N/A"}
              </Typography>

            </Box>

            <Box flex={1}>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Current Status
              </Typography>

              <Chip
                size="small"
                color={
                  progress < 30
                    ? "error"
                    : progress < 70
                    ? "warning"
                    : "success"
                }
                label={
                  progress < 30
                    ? "Critical"
                    : progress < 70
                    ? "Low Stock"
                    : "Healthy"
                }
                sx={{
                  mt: 0.5,
                }}
              />

            </Box>

          </Stack>

          <Divider />

          {/* ======================================
              AI Insight
          ====================================== */}

          <Alert
            severity={
              item.priority === "High"
                ? "error"
                : item.priority === "Medium"
                ? "warning"
                : "info"
            }
            icon={
              <AutoAwesomeRoundedIcon />
            }
            sx={{
              borderRadius: 2,
            }}
          >
            <Typography
              fontWeight={600}
            >
              AI Insight
            </Typography>

            <Typography
              variant="body2"
            >
              {item.reason ||
                "Stock level is approaching the reorder threshold. Replenishment is recommended to maintain service availability and prevent stock shortages."}
            </Typography>

          </Alert>

          {/* ======================================
              Actions
          ====================================== */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            justifyContent="flex-end"
          >

            <Button
              variant="outlined"
              onClick={() =>
                navigate(
                  `/inventory/details/${item.id}`
                )
              }
            >
              View Details
            </Button>

            <Button
              variant="contained"
              startIcon={
                <LocalShippingRoundedIcon />
              }
              onClick={() =>
                setSnackbarOpen(true)
              }
            >
              Generate Purchase Order
            </Button>

          </Stack>

        </Stack>

      </Paper>

    );

  })}
</Stack>
        ) : (
          <Typography
            align="center"
            variant="body2"
            color="text.secondary"
          >
            No recommendations available at the moment.
          </Typography>
        )}

        {/* =====================================================
            Bottom Summary
        ====================================================== */}

        <Divider sx={{ my: 4 }} />

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(25,118,210,0.04), rgba(76,175,80,0.04))",
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

              <Typography
                variant="h6"
                fontWeight={700}
              >
                AI Purchasing Summary
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {filteredRecommendations.length}
                {" "}
                product
                {filteredRecommendations.length !== 1 && "s"}
                {" "}
                currently require replenishment.

                The estimated purchasing cost is

                {" "}
                <strong>
                  ₹
                  {totalEstimatedCost.toLocaleString()}
                </strong>

                {" "}
                with an average suggested order quantity of

                {" "}
                <strong>
                  {averageRecommended}
                </strong>

                {" "}
                units.
              </Typography>

            </Box>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              width={{
                xs: "100%",
                lg: "auto",
              }}
            >
              <Button
                variant="outlined"
                startIcon={
                  <RefreshRoundedIcon />
                }
                onClick={() =>
                  dispatch(fetchRecommendations())
                }
              >
                Refresh
              </Button>

              <Button
                variant="contained"
                startIcon={
                  <LocalShippingRoundedIcon />
                }
                onClick={() =>
                  setSnackbarOpen(true)
                }
              >
                Generate Purchase Order
              </Button>
            </Stack>

          </Stack>
        </Paper>

        {/* =====================================================
            AI Information
        ====================================================== */}

        <Alert
          severity="info"
          icon={<AutoAwesomeRoundedIcon />}
          sx={{
            mt: 4,
            borderRadius: 3,
          }}
        >
          Future versions of the Inventory Management
          System will automatically generate purchase
          orders, predict demand using AI,
          calculate supplier lead time,
          forecast seasonal demand,
          and optimize warehouse replenishment.
        </Alert>

        {/* =====================================================
            Snackbar
        ====================================================== */}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
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