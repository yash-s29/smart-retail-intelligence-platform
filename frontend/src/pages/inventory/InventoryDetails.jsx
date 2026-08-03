import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import StockBadge from "../../components/Inventory/StockBadge";

import {
  fetchInventoryById,
} from "../../redux/slices/inventorySlice";

function InventoryDetails() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  // =====================================================
  // Redux State
  // =====================================================

  const {
    selectedItem,
    loading,
  } = useSelector(
    (state) => state.inventory
  );

  // =====================================================
  // Load Inventory
  // =====================================================

  useEffect(() => {
    if (id) {
      dispatch(fetchInventoryById(id));
    }
  }, [dispatch, id]);

  // =====================================================
  // Shared Button Style
  // =====================================================

  const actionButtonSx = {
    height: 48,
    minWidth: 160,
    borderRadius: 2,
    fontWeight: 700,
    textTransform: "none",
    transition: "all .25s ease",

    "&:hover": {
      transform: "translateY(-2px)",
    },
  };

  // =====================================================
  // Loading Screen
  // =====================================================

  if (loading || !selectedItem) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <CircularProgress size={42} />

          <Typography
            color="text.secondary"
          >
            Loading inventory details...
          </Typography>
        </Stack>
      </Container>
    );
  }

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
          borderRadius: 3,
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >

        {/* ==========================================
            Breadcrumbs
        ========================================== */}

        <Breadcrumbs
          separator="/"
          sx={{
            mb: 3,
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            sx={{
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </Link>

          <Link
            underline="hover"
            color="inherit"
            sx={{
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={() =>
              navigate("/inventory")
            }
          >
            Inventory
          </Link>

          <Typography
            color="text.primary"
            fontWeight={600}
          >
            Inventory Details
          </Typography>
        </Breadcrumbs>

        {/* ==========================================
            Header
        ========================================== */}

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
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Box
              sx={{
                width: 64,
                height: 64,
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
                  fontSize: 34,
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
              >
                {selectedItem.product_name ??
                  "Inventory Details"}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 700,
                  lineHeight: 1.8,
                }}
              >
                View complete inventory information,
                warehouse assignment, supplier details,
                stock configuration, and current inventory
                status for this product.
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
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
              onClick={() =>
                dispatch(fetchInventoryById(id))
              }
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
                navigate(`/inventory/edit/${id}`)
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

        <Divider sx={{ mb: 4 }} />

        {/* ==========================================
            Product Summary Card
        ========================================== */}
                {/* ==========================================
            Summary Section
        ========================================== */}

        <Grid
          container
          spacing={3}
        >
          <Grid container spacing={3}>
  <Grid item xs={12} md={4}>
    <Typography variant="caption" color="text.secondary">
      Product ID
    </Typography>

    <Typography variant="h6" fontWeight={700} mt={0.5}>
      #{selectedItem.product_id}
    </Typography>
  </Grid>

  <Grid item xs={12} md={4}>
    <Typography variant="caption" color="text.secondary">
      Product Name
    </Typography>

    <Typography variant="h6" fontWeight={700} mt={0.5}>
      {selectedItem.product?.name || "-"}
    </Typography>
  </Grid>

  <Grid item xs={12} md={4}>
    <Typography variant="caption" color="text.secondary">
      SKU
    </Typography>

    <Typography variant="body1" fontWeight={600} mt={0.5}>
      {selectedItem.product?.sku || "-"}
    </Typography>
  </Grid>

  <Grid item xs={12} md={6}>
    <Typography variant="caption" color="text.secondary">
      Warehouse
    </Typography>

    <Typography fontWeight={600} mt={0.5}>
      {selectedItem.warehouse || "-"}
    </Typography>
  </Grid>

  <Grid item xs={12} md={6}>
    <Typography variant="caption" color="text.secondary">
      Supplier
    </Typography>

    <Typography fontWeight={600} mt={0.5}>
      {selectedItem.supplier || "-"}
    </Typography>
  </Grid>
</Grid>

          {/* ======================================
              Quick Overview
          ====================================== */}

          <Grid
            item
            xs={12}
            lg={4}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
              >
                Quick Overview
              </Typography>

              <Stack spacing={2.5}>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Inventory ID
                  </Typography>

                  <Chip
                    label={`#${selectedItem.id}`}
                    color="primary"
                    size="small"
                    sx={{
                      mt: 1,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Divider />

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
                      currentStock={
                        selectedItem.current_stock
                      }
                      minimumStock={
                        selectedItem.minimum_stock
                      }
                      maximumStock={
                        selectedItem.maximum_stock
                      }
                    />
                  </Box>
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
                    mt={0.5}
                    fontWeight={500}
                  >
                    {selectedItem.updated_at
                      ? new Date(
                          selectedItem.updated_at
                        ).toLocaleString()
                      : "-"}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Stock Health
                  </Typography>

                  <Typography
                    mt={0.5}
                    fontWeight={600}
                    color={
                      selectedItem.current_stock <=
                      selectedItem.minimum_stock
                        ? "warning.main"
                        : "success.main"
                    }
                  >
                    {selectedItem.current_stock <=
                    selectedItem.minimum_stock
                      ? "Needs Restocking"
                      : "Healthy Inventory"}
                  </Typography>
                </Box>

              </Stack>
            </Paper>
          </Grid>
        </Grid>

                {/* ==========================================
            Inventory Details
        ========================================== */}

        <Grid
          container
          spacing={3}
          mt={1}
        >
          {/* ======================================
              Stock Information
          ====================================== */}

          <Grid
            item
            xs={12}
            lg={7}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
              >
                Stock Information
              </Typography>

              <Grid
                container
                spacing={2}
              >
                {[
                  {
                    label: "Current Stock",
                    value:
                      selectedItem.current_stock ?? 0,
                    color: "primary.main",
                  },
                  {
                    label: "Minimum Stock",
                    value:
                      selectedItem.minimum_stock ?? 0,
                    color: "warning.main",
                  },
                  {
                    label: "Maximum Stock",
                    value:
                      selectedItem.maximum_stock ?? 0,
                    color: "success.main",
                  },
                  {
                    label: "Reorder Level",
                    value:
                      selectedItem.reorder_level ?? 0,
                    color: "info.main",
                  },
                  {
                    label: "Safety Stock",
                    value:
                      selectedItem.safety_stock ?? 0,
                    color: "secondary.main",
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
                        borderRadius: 3,
                        height: "100%",
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
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* ======================================
              Future Roadmap
          ====================================== */}

          <Grid
            item
            xs={12}
            lg={5}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Future Enhancements
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                Upcoming versions of the inventory
                system will provide advanced analytics,
                AI-powered demand forecasting,
                warehouse intelligence, supplier
                performance tracking, and complete
                stock movement history.
              </Typography>

              <Stack spacing={1.5}>
                <Chip
                  color="success"
                  variant="outlined"
                  label="Stock Movement History"
                />

                <Chip
                  color="primary"
                  variant="outlined"
                  label="Supplier Performance Analytics"
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
                  color="default"
                  variant="outlined"
                  label="Inventory Trends Dashboard"
                />
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* ==========================================
            Bottom Actions
        ========================================== */}
                {/* ==========================================
            Bottom Action Section
        ========================================== */}

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
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
              xs: "flex-start",
              lg: "center",
            }}
          >
            {/* ======================================
                Information
            ====================================== */}

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
                  maxWidth: 700,
                  lineHeight: 1.8,
                }}
              >
                Review all inventory information before
                making changes. Keep stock quantities,
                supplier details, warehouse assignments,
                and inventory thresholds up to date to
                ensure accurate reporting and efficient
                stock management.
              </Typography>
            </Box>

            {/* ======================================
                Actions
            ====================================== */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
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
                Back to Inventory
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <RefreshRoundedIcon />
                }
                onClick={() =>
                  dispatch(fetchInventoryById(id))
                }
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
                  minWidth: 190,
                }}
              >
                Edit Inventory
              </Button>
            </Stack>
          </Stack>
        </Paper>

      </Paper>
    </Container>
  );
}

export default InventoryDetails;
