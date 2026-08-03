import React, {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowLeft,
  Download,
  Edit,
  Printer,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import salesApi from "../../services/salesApi";
import { PrimaryButton } from '../../components/ui';

import {
  formatCurrency,
  formatDate,
} from "../../utils/salesHelpers";

const SaleDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  /* ======================================================
      State
  ====================================================== */

  const [sale, setSale] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deleting, setDeleting] =
    useState(false);

  /* ======================================================
      Load Sale
  ====================================================== */

  useEffect(() => {
    const loadSale =
      async () => {
        try {
          setLoading(true);

          const data =
            await salesApi.getSaleById(id);

          setSale(data);
        } catch (err) {
          console.error(err);

          setError(
            err?.response?.data
              ?.detail ||
              "Unable to load sale."
          );
        } finally {
          setLoading(false);
        }
      };

    loadSale();
  }, [id]);

  /* ======================================================
      Print
  ====================================================== */

  const handlePrint = () => {
    window.print();
  };

  /* ======================================================
      PDF
  ====================================================== */

  const handleDownloadPDF =
    () => {
      alert(
        "PDF export will be added after Reports module."
      );
    };

  /* ======================================================
      Delete
  ====================================================== */

  const handleDelete = async () => {
    if (!sale) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete Sale #${sale.id}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await salesApi.deleteSale(sale.id);

      navigate("/sales");
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          "Unable to delete sale."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ======================================================
      Loading
  ====================================================== */

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          py: 10,
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  /* ======================================================
      Error
  ====================================================== */

  if (error) {
    return (
      <Container
        maxWidth="md"
        sx={{
          py: 5,
        }}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  /* ======================================================
      No Sale
  ====================================================== */

  if (!sale) {
    return (
      <Container
        maxWidth="md"
        sx={{
          py: 5,
        }}
      >
        <Alert severity="warning">
          Sale not found.
        </Alert>
      </Container>
    );
  }

  /* ======================================================
      Main Render
  ====================================================== */

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 5,
      }}
    >
      {/* Page Toolbar */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        mb={3}
      >
        <PrimaryButton variant="text" startIcon={<ArrowLeft size={18} />} onClick={() => navigate("/sales")}>
          Back to Sales
        </PrimaryButton>

        <Stack direction="row" spacing={2}>
          <PrimaryButton variant="outlined" startIcon={<Printer size={18} />} onClick={handlePrint}>Print</PrimaryButton>
          <PrimaryButton variant="outlined" startIcon={<Download size={18} />} onClick={handleDownloadPDF}>Download PDF</PrimaryButton>
        </Stack>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Invoice Header */}

        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              fontWeight={800}
              color="primary.main"
            >
              Invoice
            </Typography>

            <Typography
              variant="h6"
              fontWeight={700}
              mt={1}
            >
              Sale #{sale.id}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mt={1}
            >
              Created on {formatDate(sale.sale_date)}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            textAlign={{ xs: "left", md: "right" }}
          >
            <Chip
              label={sale.status}
              color={
                sale.status === "Completed"
                  ? "success"
                  : sale.status === "Pending"
                  ? "warning"
                  : "error"
              }
            />

            <Typography
              mt={2}
              variant="body2"
              color="text.secondary"
            >
              Payment Method
            </Typography>

            <Typography fontWeight={600}>
              {sale.payment_method || "Cash"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Customer Information */}

        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
        >
          Customer Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Customer Name
            </Typography>

            <Typography fontWeight={600}>
              {sale.customer_name || "Walk-in Customer"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Phone
            </Typography>

            <Typography fontWeight={600}>
              {sale.customer_phone || "--"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>

            <Typography fontWeight={600}>
              {sale.customer_email || "--"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Product Information */}

        <Typography
          variant="h6"
          fontWeight={700}
          mb={3}
        >
          Product Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Product
            </Typography>

            <Typography fontWeight={700}>
              {sale.product_name}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={2}>
            <Typography variant="body2" color="text.secondary">
              Quantity
            </Typography>

            <Typography fontWeight={700}>
              {sale.quantity_sold}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={2}>
            <Typography variant="body2" color="text.secondary">
              Unit Price
            </Typography>

            <Typography fontWeight={700}>
              {formatCurrency(sale.unit_price)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>

            <Typography
              fontWeight={800}
              color="success.main"
            >
              {formatCurrency(sale.total_amount)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Invoice Summary */}

        <Box
          sx={{
            mt: 5,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: {
                xs: "100%",
                sm: 380,
              },
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.default",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              mb={3}
            >
              Payment Summary
            </Typography>

            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">
                  Quantity
                </Typography>

                <Typography fontWeight={600}>
                  {sale.quantity_sold}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">
                  Unit Price
                </Typography>

                <Typography fontWeight={600}>
                  {formatCurrency(sale.unit_price)}
                </Typography>
              </Stack>

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography
                  fontWeight={700}
                >
                  Total Amount
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="success.main"
                >
                  {formatCurrency(sale.total_amount)}
                </Typography>
              </Stack>

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">
                  Payment
                </Typography>

                <Chip
                  size="small"
                  color="primary"
                  label={sale.payment_method || "Cash"}
                />
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">
                  Status
                </Typography>

                <Chip
                  size="small"
                  label={sale.status}
                  color={
                    sale.status === "Completed"
                      ? "success"
                      : sale.status === "Pending"
                      ? "warning"
                      : "error"
                  }
                />
              </Stack>
            </Stack>
          </Paper>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* Quick Actions */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Sale ID #{sale.id} • Created {formatDate(sale.sale_date)}
          </Typography>

          <Stack direction="row" spacing={2}>
            <PrimaryButton
              variant="outlined"
              startIcon={<Edit size={18} />}
              onClick={() =>
                navigate(`/sales/edit/${sale.id}`)
              }
              sx={{ textTransform: "none" }}
            >
              Edit Sale
            </PrimaryButton>

            <PrimaryButton
              color="error"
              variant="outlined"
              startIcon={<Trash2 size={18} />}
              onClick={handleDelete}
              disabled={deleting}
              sx={{ textTransform: "none" }}
            >
              {deleting ? "Deleting..." : "Delete Sale"}
            </PrimaryButton>
          </Stack>
        </Stack>

        <Box
          sx={{
            mt: 6,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
          >
            Thank you for your business!
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: "auto",
            }}
          >
            This invoice was generated automatically by the Smart Retail
            Intelligence Platform. Inventory has already been updated after
            this sale was completed.
          </Typography>

          <Typography
            variant="caption"
            display="block"
            sx={{
              mt: 3,
              color: "text.secondary",
            }}
          >
            Generated on {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SaleDetails;