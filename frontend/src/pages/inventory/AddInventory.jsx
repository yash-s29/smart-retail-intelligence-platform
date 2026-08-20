import { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import InventoryForm from "../../components/Inventory/InventoryForm";

import {
  createInventory,
} from "../../redux/slices/inventorySlice";

import {
  fetchProducts,
} from "../../redux/slices/productSlice";

// ==========================================================
// Component
// ==========================================================

function AddInventory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================================
  // Redux State
  // ==========================================================

  const inventoryState = useSelector(
    (state) => state.inventory
  );

  const productsState = useSelector(
    (state) => state.products
  );

  const inventoryLoading =
    inventoryState?.loading ?? false;

  const products = productsState?.products ?? [];

  const productsLoading =
    productsState?.loading ?? false;

  // ==========================================================
  // Local State
  // ==========================================================

  const [successOpen, setSuccessOpen] = useState(false);

  const [errorOpen, setErrorOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================================
  // Combined Loading
  // ==========================================================

  const loading =
    inventoryLoading || productsLoading;

  // ==========================================================
  // Load Products
  // ==========================================================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ==========================================================
  // Create Inventory
  // ==========================================================

  const handleSubmit = async (payload) => {
    try {
      setErrorOpen(false);
      setErrorMessage("");

      await dispatch(
        createInventory(payload)
      ).unwrap();

      setSuccessOpen(true);

      const timer = setTimeout(() => {
        navigate("/inventory");
      }, 1200);

      return () => clearTimeout(timer);
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message ||
            error?.detail ||
            error?.error ||
            "Unable to create inventory. Please try again.";

      setErrorMessage(message);
      setErrorOpen(true);
    }
  };

  // ==========================================================
  // Navigation
  // ==========================================================

  const handleBack = () => {
    if (!inventoryLoading) {
      navigate("/inventory");
    }
  };

  const handleDashboard = () => {
    if (!inventoryLoading) {
      navigate("/dashboard");
    }
  };

  // ==========================================================
  // Shared Button Styles
  // ==========================================================

  const actionButtonSx = {
    minHeight: 48,
    minWidth: {
      xs: "100%",
      sm: 160,
    },
    px: 2.5,
    borderRadius: 2.5,
    fontWeight: 700,
    textTransform: "none",
    transition: "all .25s ease",

    "&:hover": {
      transform: "translateY(-2px)",
    },

    "&:active": {
      transform: "translateY(0)",
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
      {/* ======================================================
          Main Page Container
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: {
            xs: 2.5,
            sm: 3,
          },
          overflow: "hidden",
          backgroundColor: "background.paper",
        }}
      >
        {/* ====================================================
            Page Header
        ==================================================== */}

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            pb: {
              xs: 2.5,
              sm: 3,
            },
          }}
        >
          {/* ==================================================
              Breadcrumbs
          ================================================== */}

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
              component="button"
              onClick={handleDashboard}
              sx={{
                border: 0,
                background: "none",
                cursor: "pointer",
                font: "inherit",
                fontWeight: 500,
                p: 0,
              }}
            >
              Dashboard
            </Link>

            <Link
              underline="hover"
              color="inherit"
              component="button"
              onClick={handleBack}
              sx={{
                border: 0,
                background: "none",
                cursor: "pointer",
                font: "inherit",
                fontWeight: 500,
                p: 0,
              }}
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

          {/* ==================================================
              Header Content
          ================================================== */}

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "stretch",
              md: "center",
            }}
            spacing={3}
          >
            {/* ----------------------------------------------
                Title
            ---------------------------------------------- */}

            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
              sx={{
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: 46,
                    sm: 54,
                  },
                  height: {
                    xs: 46,
                    sm: 54,
                  },
                  minWidth: {
                    xs: 46,
                    sm: 54,
                  },
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.light",
                  color: "primary.main",
                }}
              >
                <Inventory2RoundedIcon
                  sx={{
                    fontSize: {
                      xs: 24,
                      sm: 29,
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      xs: "1.65rem",
                      sm: "2rem",
                      md: "2.2rem",
                    },
                    lineHeight: 1.2,
                    mb: 0.8,
                  }}
                >
                  Add Inventory
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: 760,
                    lineHeight: 1.75,
                    fontSize: {
                      xs: "0.9rem",
                      sm: "0.95rem",
                    },
                  }}
                >
                  Create a new inventory record by
                  selecting a product, configuring stock
                  levels, assigning a warehouse, and
                  managing supplier details.
                </Typography>
              </Box>
            </Stack>

            {/* ----------------------------------------------
                Back Button
            ---------------------------------------------- */}

            <Button
              variant="outlined"
              color="inherit"
              startIcon={
                <ArrowBackRoundedIcon />
              }
              onClick={handleBack}
              disabled={inventoryLoading}
              sx={{
                ...actionButtonSx,
                minWidth: {
                  xs: "100%",
                  md: 175,
                },
                alignSelf: {
                  xs: "stretch",
                  md: "center",
                },
              }}
            >
              Back to Inventory
            </Button>
          </Stack>
        </Box>

        {/* ====================================================
            Divider
        ==================================================== */}

        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        />

        {/* ====================================================
            Form Section
        ==================================================== */}

        <Box
          sx={{
            p: {
              xs: 1.5,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          <InventoryForm
            mode="add"
            products={products}
            loading={loading}
            submitButtonText="Add Inventory"
            onSubmit={handleSubmit}
          />
        </Box>

        {/* ====================================================
            Information Section
        ==================================================== */}

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            pb: {
              xs: 2.5,
              sm: 3,
              md: 4,
            },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.default",
              p: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
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
              {/* ==================================================
                  Information
              ================================================== */}

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
                sx={{
                  minWidth: 0,
                }}
              >
                <CheckCircleRoundedIcon
                  color="success"
                  sx={{
                    mt: 0.2,
                    flexShrink: 0,
                  }}
                />

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
                      maxWidth: 700,
                      lineHeight: 1.8,
                    }}
                  >
                    Verify the selected product,
                    current stock, minimum and maximum
                    stock levels, reorder level, safety
                    stock, warehouse, supplier, and
                    inventory status before submitting.
                  </Typography>
                </Box>
              </Stack>

              {/* ==================================================
                  Secondary Actions
              ================================================== */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.5}
                sx={{
                  width: {
                    xs: "100%",
                    md: "auto",
                  },
                  flexShrink: 0,
                }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={
                    <ArrowBackRoundedIcon />
                  }
                  onClick={handleBack}
                  disabled={inventoryLoading}
                  sx={{
                    ...actionButtonSx,
                    minWidth: {
                      xs: "100%",
                      sm: 140,
                    },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="outlined"
                  startIcon={
                    <Inventory2RoundedIcon />
                  }
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                  sx={{
                    ...actionButtonSx,
                    minWidth: {
                      xs: "100%",
                      sm: 160,
                    },
                  }}
                >
                  Review Form
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Paper>

      {/* ======================================================
          Success Snackbar
      ====================================================== */}

      <Snackbar
        open={successOpen}
        autoHideDuration={2500}
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
          icon={<CheckCircleRoundedIcon />}
          sx={{
            width: "100%",
            minWidth: {
              xs: "auto",
              sm: 360,
            },
            alignItems: "center",
            borderRadius: 2.5,
            fontWeight: 600,
          }}
        >
          Inventory has been created
          successfully.
        </Alert>
      </Snackbar>

      {/* ======================================================
          Error Snackbar
      ====================================================== */}

      <Snackbar
        open={errorOpen}
        autoHideDuration={5000}
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
            minWidth: {
              xs: "auto",
              sm: 360,
            },
            alignItems: "center",
            borderRadius: 2.5,
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

// ==========================================================
// PropTypes
// ==========================================================

AddInventory.propTypes = {};

// ==========================================================
// Export
// ==========================================================

export default AddInventory;
