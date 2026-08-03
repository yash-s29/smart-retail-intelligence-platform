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
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

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

  const {
    alerts,
    loading,
    error,
  } = useSelector((state) => state.inventory);

  const [search, setSearch] = useState("");

  const [stockOpen, setStockOpen] = useState(false);

  const [selectedInventory, setSelectedInventory] =
    useState(null);

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  const filteredAlerts = useMemo(() => {
    if (!alerts) return [];

    return alerts.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.product_name
          ?.toLowerCase()
          .includes(keyword) ||

        item.supplier
          ?.toLowerCase()
          .includes(keyword) ||

        item.warehouse
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [alerts, search]);

  const stats = useMemo(() => {
    const total = filteredAlerts.length;

    const outOfStock = filteredAlerts.filter(
      (item) => item.current_stock === 0
    ).length;

    const critical = filteredAlerts.filter(
      (item) =>
        item.current_stock > 0 &&
        item.current_stock <= item.minimum_stock
    ).length;

    const low = filteredAlerts.filter(
      (item) =>
        item.current_stock > item.minimum_stock &&
        item.current_stock <= item.reorder_level
    ).length;

    return {
      total,
      inStock: 0,
      lowStock: low,
      outOfStock,
      criticalStock: critical,
    };
  }, [filteredAlerts]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            md: 3,
          },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          spacing={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
            >
              Inventory Alerts
            </Typography>

            <Typography
              color="text.secondary"
            >
              Monitor low stock, critical stock
              and out-of-stock products.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1.5}
          >
            <Tooltip title="Refresh Alerts">
              <IconButton
                color="primary"
                onClick={() =>
                  dispatch(fetchAlerts())
                }
              >
                <RefreshRoundedIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={
                <Inventory2RoundedIcon />
              }
              onClick={() =>
                navigate("/inventory")
              }
            >
              Inventory
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <InventoryStats
          stats={stats}
          loading={loading}
        />

        <Divider sx={{ my: 3 }} />

        <InventorySearch
          value={search}
          loading={loading}
          onSearch={setSearch}
        />
                <Divider sx={{ my: 3 }} />

        {/* ==========================================
            Error State
        ========================================== */}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* ==========================================
            Loading State
        ========================================== */}

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={10}
          >
            <Typography
              variant="h6"
              color="text.secondary"
            >
              Loading inventory alerts...
            </Typography>
          </Box>
        ) : filteredAlerts.length === 0 ? (

          /* ======================================
              Empty State
          ====================================== */

          <Box
            py={10}
            textAlign="center"
          >
            <WarningAmberRoundedIcon
              color="warning"
              sx={{
                fontSize: 70,
                mb: 2,
              }}
            />

            <Typography
              variant="h5"
              fontWeight={700}
              gutterBottom
            >
              No Inventory Alerts
            </Typography>

            <Typography
              color="text.secondary"
            >
              Great! None of your products currently
              require immediate attention.
            </Typography>
          </Box>

        ) : (

          /* ======================================
              Alerts List
          ====================================== */

          <Stack spacing={2} mt={1}>
            {filteredAlerts.map((item) => (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  transition: "0.25s",

                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Stack
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  {/* ==========================
                      Product Details
                  ========================== */}

                  <Box flex={1}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {item.product_name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      SKU: {item.sku || "N/A"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Warehouse:{" "}
                      {item.warehouse || "N/A"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Supplier:{" "}
                      {item.supplier || "N/A"}
                    </Typography>
                  </Box>

                  {/* ==========================
                      Stock Information
                  ========================== */}

                  <Stack
                    spacing={1}
                    alignItems={{
                      xs: "flex-start",
                      md: "center",
                    }}
                  >
                    <Typography
                      fontWeight={700}
                    >
                      Current Stock
                    </Typography>

                    <Typography
                      variant="h5"
                      color="primary"
                    >
                      {item.current_stock}
                    </Typography>

                    <StockBadge
                      status={item.status}
                    />
                  </Stack>

                  {/* ==========================
                      Actions
                  ========================== */}

                  <Stack
                    direction={{
                      xs: "row",
                      md: "column",
                    }}
                    spacing={1}
                    justifyContent="center"
                  >
                    <Button
                      variant="outlined"
                      startIcon={
                        <VisibilityRoundedIcon />
                      }
                      onClick={() =>
                        navigate(
                          `/inventory/${item.id}`
                        )
                      }
                    >
                      View
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedInventory(item);
                        setStockOpen(true);
                      }}
                    >
                      Update Stock
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
                {/* ==========================================
            Update Stock Modal
        ========================================== */}

        <UpdateStockModal
          open={stockOpen}
          inventory={selectedInventory}
          loading={loading}
          onClose={() => {
            setStockOpen(false);
            setSelectedInventory(null);
          }}
          onSave={async (quantity) => {
            if (!selectedInventory) return;

            try {
              await dispatch(
                updateInventory({
                  id: selectedInventory.id,
                  data: {
                    current_stock: quantity,
                  },
                })
              ).unwrap();

              setStockOpen(false);
              setSelectedInventory(null);

              dispatch(fetchAlerts());
            } catch (error) {
              console.error("Failed to update stock:", error);
            }
          }}
        />
      </Paper>
    </Container>
  );
}

export default InventoryAlerts;