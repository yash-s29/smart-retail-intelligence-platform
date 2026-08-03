import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import InventoryForm from "../../components/Inventory/InventoryForm";

import {
  fetchInventoryById,
  updateInventory,
} from "../../redux/slices/inventorySlice";

import {
  fetchProducts,
} from "../../redux/slices/productSlice";

function EditInventory() {

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

  const {
    products,
    loading: productsLoading,
  } = useSelector(
    (state) => state.products
  );

  // =====================================================
  // Local State
  // =====================================================

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [errorOpen, setErrorOpen] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  // =====================================================
  // Load Data
  // =====================================================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchInventoryById(id));
    }
  }, [dispatch, id]);

  // =====================================================
  // Update Inventory
  // =====================================================

  const handleSubmit = async (payload) => {
    try {

      await dispatch(
        updateInventory({
          id,
          inventoryData: payload,
        })
      ).unwrap();

      setSuccessOpen(true);

      setTimeout(() => {
        navigate("/inventory");
      }, 1200);

    } catch (error) {

      setErrorMessage(
        error?.message ||
        "Unable to update inventory."
      );

      setErrorOpen(true);
    }
  };

  // =====================================================
  // Shared Button Style
  // =====================================================

  const actionButtonSx = {
    height: 48,
    minWidth: 170,
    borderRadius: 2,
    fontWeight: 700,
    textTransform: "none",
    transition: "all .25s ease",

    "&:hover": {
      transform: "translateY(-2px)",
    },
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading && !selectedItem) {
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
            Edit Inventory
          </Typography>

        </Breadcrumbs>

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
              gutterBottom
            >
              Edit Inventory
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                lineHeight: 1.8,
              }}
            >
              Update inventory information, adjust stock
              quantities, modify warehouse and supplier
              details, and keep your inventory records
              accurate across all locations.
            </Typography>

          </Box>

          <Button
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

        </Stack>

        {/* ==========================================
            Inventory Form
        ========================================== */}
                {/* ==========================================
            Inventory Form
        ========================================== */}

        <InventoryForm
          mode="edit"
          initialValues={selectedItem}
          products={products}
          loading={loading || productsLoading}
          submitButtonText="Update Inventory"
          onSubmit={handleSubmit}
        />

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
              md: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              md: "center",
            }}
            spacing={3}
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
                Before Updating
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: 650,
                  lineHeight: 1.8,
                }}
              >
                Review all inventory information before
                saving your changes. Updating stock levels,
                warehouse assignments, supplier details,
                and inventory status ensures accurate
                reporting, reliable stock monitoring, and
                timely replenishment recommendations.
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
                  md: "auto",
                },
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ArrowBackRoundedIcon />}
                onClick={() =>
                  navigate("/inventory")
                }
                disabled={loading}
                fullWidth
                sx={actionButtonSx}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
                sx={{
                  ...actionButtonSx,
                  minWidth: 210,
                }}
              >
                Review Changes
              </Button>
            </Stack>
          </Stack>
        </Paper>

      </Paper>
            {/* ==========================================
          Success Snackbar
      ========================================== */}

      <Snackbar
        open={successOpen}
        autoHideDuration={2500}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          variant="filled"
          elevation={6}
          sx={{
            width: "100%",
            alignItems: "center",
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Inventory updated successfully.
        </Alert>
      </Snackbar>

      {/* ==========================================
          Error Snackbar
      ========================================== */}

      <Snackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setErrorOpen(false)}
          severity="error"
          variant="filled"
          elevation={6}
          sx={{
            width: "100%",
            alignItems: "center",
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

export default EditInventory;