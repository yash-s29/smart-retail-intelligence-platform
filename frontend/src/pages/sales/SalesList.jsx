import React, { useMemo, useState } from "react";

import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Alert,
  Stack,
  Typography,
} from "@mui/material";
import { PrimaryButton } from '../../components/ui';

import {
  Plus,
  Download,
  RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import SalesFilters from "../../components/sales/SalesFilters";
import SalesTable from "../../components/sales/SalesTable";
import SalesStats from "../../components/sales/SalesStats";

import { useSales } from "../../hooks/useSales";
import salesApi from "../../services/salesApi";

const SalesList = () => {
  const navigate = useNavigate();

  /* ==========================================================
      Sales Hook
  ========================================================== */

  const {
    sales,
    analytics,
    loading,
    error,
    refreshSales,
  } = useSales();

  /* ==========================================================
      Filters
  ========================================================== */

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [dateFilter, setDateFilter] =
    useState({
      from: "",
      to: "",
    });

  /* ==========================================================
      Delete Dialog
  ========================================================== */

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedSale, setSelectedSale] =
    useState(null);

  /* ==========================================================
      Snackbar
  ========================================================== */

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      message: "",
      severity: "success",
    });

  /* ==========================================================
      Filter Sales
  ========================================================== */

  const filteredSales = useMemo(() => {
    let filtered = [...sales];

    if (searchQuery.trim()) {
      const search =
        searchQuery.toLowerCase();

      filtered = filtered.filter((sale) => {
        return (
          sale.id
            ?.toString()
            .includes(search) ||

          sale.customer_name
            ?.toLowerCase()
            .includes(search) ||

          sale.product_name
            ?.toLowerCase()
            .includes(search)
        );
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (sale) =>
          sale.status === statusFilter
      );
    }

    if (dateFilter.from) {
      filtered = filtered.filter(
        (sale) =>
          sale.sale_date >=
          dateFilter.from
      );
    }

    if (dateFilter.to) {
      filtered = filtered.filter(
        (sale) =>
          sale.sale_date <=
          dateFilter.to
      );
    }

    filtered.sort(
      (a, b) =>
        new Date(b.sale_date) -
        new Date(a.sale_date)
    );

    return filtered;
  }, [
    sales,
    searchQuery,
    statusFilter,
    dateFilter,
  ]);

  /* ==========================================================
      Clear Filters
  ========================================================== */

  const handleClearFilters = () => {
    setSearchQuery("");

    setStatusFilter("all");

    setDateFilter({
      from: "",
      to: "",
    });
  };

  /* ==========================================================
      Delete Sale
  ========================================================== */

  const handleDeleteSale = async () => {
    if (!selectedSale) return;

    try {
      await salesApi.deleteSale(
        selectedSale.id
      );

      await refreshSales();

      setSnackbar({
        open: true,
        severity: "success",
        message:
          "Sale deleted successfully.",
      });

      setDeleteDialogOpen(false);

      setSelectedSale(null);
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          err?.response?.data?.detail ||
          "Failed to delete sale.",
      });
    }
  };
  return (
  <>
    <Container
      maxWidth="xl"
      sx={{
        py: {
          xs: 3,
          md: 4,
        },
      }}
    >
      {/* ==========================================================
            Header
      ========================================================== */}

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
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Sales Management
          </Typography>

          <Typography
            color="text.secondary"
            mt={1}
          >
            Manage sales transactions, monitor revenue,
            and track customer purchases in real time.
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
          <PrimaryButton
            variant="outlined"
            startIcon={<RefreshCw size={18} />}
            onClick={refreshSales}
            disabled={loading}
            sx={{ height: 48, minWidth: 150, borderRadius: 2, textTransform: "none" }}
          >
            Refresh
          </PrimaryButton>

          <PrimaryButton
            variant="outlined"
            startIcon={<Download size={18} />}
            sx={{ height: 48, minWidth: 150, borderRadius: 2, textTransform: "none" }}
          >
            Export CSV
          </PrimaryButton>

          <PrimaryButton
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => navigate("/sales/add")}
            sx={{ height: 48, minWidth: 180, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Add New Sale
          </PrimaryButton>
        </Stack>
      </Stack>

      {/* ==========================================================
            KPI Cards
      ========================================================== */}

      <SalesStats
        analytics={analytics}
        loading={loading}
      />
            {/* ==========================================================
            Filters
      ========================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            md: 3,
          },
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <SalesFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          onClearFilters={handleClearFilters}
        />
      </Paper>

      {/* ==========================================================
            Error State
      ========================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* ==========================================================
            Results Summary
      ========================================================== */}

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
        mb={2}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Sales Records
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Showing{" "}
          <strong>
            {filteredSales.length}
          </strong>{" "}
          of{" "}
          <strong>
            {sales.length}
          </strong>{" "}
          sales
        </Typography>
      </Stack>
            {/* ==========================================================
            Sales Table
      ========================================================== */}

      <SalesTable
        sales={filteredSales}
        loading={loading}
        error={error}
        onView={(sale) =>
          navigate(`/sales/${sale.id}`)
        }
        onEdit={(sale) =>
          navigate(`/sales/edit/${sale.id}`)
        }
        onDelete={(sale) => {
          setSelectedSale(sale);
          setDeleteDialogOpen(true);
        }}
      />
    </Container>

    {/* ==========================================================
          Delete Confirmation Dialog
    ========================================================== */}

    <Dialog
      open={deleteDialogOpen}
      onClose={() => {
        setDeleteDialogOpen(false);
        setSelectedSale(null);
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        Delete Sale
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this sale?

          <br />
          <br />

          <strong>
            Sale ID:
          </strong>{" "}
          #{selectedSale?.id}

          <br />

          <strong>
            Customer:
          </strong>{" "}
          {selectedSale?.customer_name ||
            "Walk-in Customer"}

          <br />

          <strong>
            Amount:
          </strong>{" "}
          ₹{selectedSale?.total_amount}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <PrimaryButton
          variant="text"
          onClick={() => {
            setDeleteDialogOpen(false);
            setSelectedSale(null);
          }}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </PrimaryButton>

        <PrimaryButton
          color="error"
          variant="contained"
          onClick={handleDeleteSale}
          sx={{ textTransform: "none" }}
        >
          Delete
        </PrimaryButton>
      </DialogActions>
    </Dialog>

    {/* ==========================================================
          Snackbar
    ========================================================== */}

    <Snackbar
      open={snackbar.open}
      autoHideDuration={3500}
      onClose={() =>
        setSnackbar((prev) => ({
          ...prev,
          open: false,
        }))
      }
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Alert
        severity={snackbar.severity}
        variant="filled"
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        sx={{
          width: "100%",
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </>
);

};

export default SalesList;