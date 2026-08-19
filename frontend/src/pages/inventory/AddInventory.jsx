import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
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
  createInventory,
} from "../../redux/slices/inventorySlice";

import {
  fetchProducts,
} from "../../redux/slices/productSlice";

function AddInventory() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =====================================================
  // Redux State
  // =====================================================

  const { loading } = useSelector(
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
  // Load Products
  // =====================================================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // =====================================================
  // Create Inventory
  // =====================================================

  const handleSubmit = async (payload) => {
    try {

      await dispatch(
        createInventory(payload)
      ).unwrap();

      setSuccessOpen(true);

      setTimeout(() => {
        navigate("/inventory");
      }, 1200);

    } catch (error) {

      setErrorMessage(
        error?.message ||
        "Unable to create inventory."
      );

      setErrorOpen(true);
    }
  };

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
            Add Inventory
          </Typography>

        </Breadcrumbs>

        {/* ==========================================
            Page Header
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
              Add Inventory
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                lineHeight: 1.8,
              }}
            >
              Create a new inventory record by selecting a
              product, configuring stock levels, assigning
              a warehouse, and managing supplier details.
              Maintaining accurate inventory ensures better
              stock visibility and timely replenishment.
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
                <InventoryForm
          mode="add"
          products={products}
          loading={loading || productsLoading}
          submitButtonText="Add Inventory"
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
                Before Saving
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: 650,
                  lineHeight: 1.8,
                }}
              >
                Verify the selected product, stock
                quantities, warehouse, supplier, and
                inventory status before creating the
                inventory record. Accurate inventory
                information helps maintain stock
                availability and improves reporting.
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
                startIcon={
                  <ArrowBackRoundedIcon />
                }
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
                  minWidth: 190,
                }}
              >
                Review Form
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
          Inventory has been created successfully.
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

export default AddInventory;
