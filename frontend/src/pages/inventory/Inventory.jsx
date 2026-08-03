import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import InventoryStats from "../../components/Inventory/InventoryStats";
import InventorySearch from "../../components/Inventory/InventorySearch";
import InventoryFilters from "../../components/Inventory/InventoryFilters";
import InventoryTable from "../../components/Inventory/InventoryTable";
import DeleteInventoryModal from "../../components/Inventory/DeleteInventoryModal";
import UpdateStockModal from "../../components/Inventory/UpdateStockModal";
import {
  fetchInventory,
  deleteInventory,
  updateInventory,
} from "../../redux/slices/inventorySlice";
import { PrimaryButton } from '../../components/ui';
const Inventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================================
  // Redux State
  // ==========================================================

  const {
    inventory,
    loading,
    error,
  } = useSelector((state) => state.inventory);

  // ==========================================================
  // Local State
  // ==========================================================

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    warehouse: "",
    supplier: "",
    status: "",
  });

  const [selectedInventory, setSelectedInventory] =
    useState(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [stockOpen, setStockOpen] =
    useState(false);

  // ==========================================================
  // Initial Load
  // ==========================================================

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // ==========================================================
  // Refresh Inventory
  // ==========================================================

  const handleRefresh = () => {
    dispatch(fetchInventory());
  };

  // ==========================================================
  // Statistics
  // ==========================================================

  const stats = useMemo(() => {
    const totalProducts = inventory.length;

    const inStock = inventory.filter(
      (item) =>
        item.status === "In Stock"
    ).length;

    const lowStock = inventory.filter(
      (item) =>
        item.status === "Low Stock"
    ).length;

    const outOfStock = inventory.filter(
      (item) =>
        item.status === "Out of Stock"
    ).length;

    return {
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [inventory]);

  // ==========================================================
  // Filter Inventory
  // ==========================================================

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        item.product?.name
          ?.toLowerCase()
          .includes(keyword) ||
        item.product?.sku
          ?.toLowerCase()
          .includes(keyword) ||
        item.supplier
          ?.toLowerCase()
          .includes(keyword);

      const matchesWarehouse =
        !filters.warehouse ||
        item.warehouse === filters.warehouse;

      const matchesSupplier =
        !filters.supplier ||
        item.supplier === filters.supplier;

      const matchesStatus =
        !filters.status ||
        item.status === filters.status;

      return (
        matchesSearch &&
        matchesWarehouse &&
        matchesSupplier &&
        matchesStatus
      );
    });
  }, [inventory, search, filters]);

  // ==========================================================
  // Dropdown Data
  // ==========================================================

  const warehouses = [
    ...new Set(
      inventory
        .map((item) => item.warehouse)
        .filter(Boolean)
    ),
  ];

  const suppliers = [
    ...new Set(
      inventory
        .map((item) => item.supplier)
        .filter(Boolean)
    ),
  ];

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
      }}
    >
      {/* ==========================================
          Header
      ========================================== */}

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
        mb={4}
      >
        <Box>

         <Typography
    variant="h4"
    fontWeight={700}
    sx={{
        fontSize:{
            xs:"1.8rem",
            sm:"2rem",
            md:"2.3rem"
        },
        lineHeight:1.2
    }}
>
            Inventory
          </Typography>

          <Typography
            color="text.secondary"
          >
            Manage inventory,
            warehouses, suppliers,
            and stock levels.
          </Typography>

        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          width="100%"
          justifyContent="flex-end"
        >
          <PrimaryButton
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={handleRefresh}
            sx={{ width: { xs: "100%", sm: "auto" }, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Refresh
          </PrimaryButton>

          <PrimaryButton
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate("/inventory/add")}
            sx={{ width: { xs: "100%", sm: "auto" }, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Add Inventory
          </PrimaryButton>
        </Stack>

      </Stack>

      {/* ==========================================
          Error Alert
      ========================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {/* ==========================================
          Inventory Content
          (Continue in Part 2)
      ========================================== */}

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        {/* ==========================================
            Statistics
        ========================================== */}

        <InventoryStats
          stats={stats}
          loading={loading}
        />

        <Divider sx={{ my: 3 }} />

        {/* ==========================================
            Search
        ========================================== */}

        <InventorySearch
          value={search}
          loading={loading}
          onSearch={setSearch}
        />

        {/* ==========================================
            Filters
        ========================================== */}

        <InventoryFilters
          warehouses={warehouses}
          suppliers={suppliers}
          value={filters}
          loading={loading}
          onChange={setFilters}
        />

        {/* ==========================================
            Loading State
        ========================================== */}

        {loading ? (
          
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={8}
          >
            
            <Typography
              variant="h6"
              color="text.secondary"
            >
              Loading inventory...
            </Typography>
            
          </Box>
        ) : filteredInventory.length === 0 ? (

          /* ======================================
              Empty State
          ====================================== */

          <Box
            py={10}
            textAlign="center"
          >
            <Typography
              variant="h5"
              gutterBottom
            >
              No Inventory Found
            </Typography>

            <Typography
              color="text.secondary"
              mb={4}
            >
              Add inventory items or
              change your search filters.
            </Typography>

            <PrimaryButton
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => navigate("/inventory/add")}
            >
              Add Inventory
            </PrimaryButton>
          </Box>

        ) : (

          /* ======================================
              Inventory Table
          ====================================== */

          <InventoryTable
            inventory={filteredInventory}
            loading={loading}
            onView={(row) =>
              navigate(`/inventory/${row.id}`)
            }
            onEdit={(row) =>
              navigate(`/inventory/edit/${row.id}`)
            }
            onDelete={(row) => {
              setSelectedInventory(row);
              setDeleteOpen(true);
            }}
            onUpdateStock={(row) => {
              setSelectedInventory(row);
              setStockOpen(true);
            }}
          />

        )}
      </Paper>
            {/* ==========================================
          Delete Inventory Modal
      ========================================== */}

      <DeleteInventoryModal
        open={deleteOpen}
        inventory={selectedInventory}
        loading={loading}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedInventory(null);
        }}
        onConfirm={async () => {
          if (!selectedInventory) return;

          try {
            await dispatch(
              deleteInventory(selectedInventory.id)
            ).unwrap();

            setDeleteOpen(false);
            setSelectedInventory(null);

            dispatch(fetchInventory());
          } catch (error) {
            console.error(error);
          }
        }}
      />

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
                inventoryData: {
                  current_stock: quantity,
                },
              })
            ).unwrap();

            setStockOpen(false);
            setSelectedInventory(null);

            dispatch(fetchInventory());
          } catch (error) {
            console.error(error);
          }
        }}
      />
    </Container>
  );
}

export default Inventory;