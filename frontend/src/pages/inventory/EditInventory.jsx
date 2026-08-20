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
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import InventoryForm from "../../components/Inventory/InventoryForm";

import {
  fetchInventoryById,
  updateInventory,
} from "../../redux/slices/inventorySlice";

import { fetchProducts } from "../../redux/slices/productSlice";

function EditInventory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  // ==========================================================
  // Redux State
  // ==========================================================

  const {
    selectedItem,
    loading,
  } = useSelector((state) => state.inventory);

  const {
    products = [],
    loading: productsLoading,
  } = useSelector((state) => state.products);

  // ==========================================================
  // Local State
  // ==========================================================

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================================
  // Load Products
  // ==========================================================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ==========================================================
  // Load Inventory
  // ==========================================================

  useEffect(() => {
    if (id) {
      dispatch(fetchInventoryById(id));
    }
  }, [dispatch, id]);

  // ==========================================================
  // Update Inventory
  // ==========================================================

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
          error?.payload?.message ||
          "Unable to update inventory."
      );

      setErrorOpen(true);
    }
  };

  // ==========================================================
  // Navigate Back
  // ==========================================================

  const handleBack = () => {
    navigate("/inventory");
  };

  // ==========================================================
  // Retry Loading
  // ==========================================================

  const handleRetry = () => {
    if (id) {
      dispatch(fetchInventoryById(id));
    }

    dispatch(fetchProducts());
  };

  // ==========================================================
  // Shared Button Style
  // ==========================================================

  const actionButtonSx = {
    minHeight: 48,
    minWidth: {
      xs: "100%",
      sm: 165,
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
  // Loading State
  // ==========================================================

  if (loading && !selectedItem) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          minHeight: "70vh",
          py: {
            xs: 3,
            sm: 5,
            md: 6,
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 520,
            p: {
              xs: 3,
              sm: 4,
            },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Stack
            spacing={2}
            alignItems="center"
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <Inventory2RoundedIcon fontSize="large" />
            </Box>

            <CircularProgress size={34} />

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
              >
                Loading Inventory
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Loading inventory details. Please wait...
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // ==========================================================
  // Inventory Not Found
  // ==========================================================

  if (!loading && !selectedItem) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 3,
            sm: 4,
            md: 5,
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            p: {
              xs: 3,
              sm: 5,
              md: 6,
            },
          }}
        >
          <Stack
            spacing={2.5}
            alignItems="center"
            textAlign="center"
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "error.light",
                color: "error.dark",
              }}
            >
              <Inventory2RoundedIcon fontSize="large" />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
              >
                Inventory Not Found
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: 520,
                  lineHeight: 1.7,
                }}
              >
                The inventory record you are trying to edit
                could not be found or may have been removed.
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
                  sm: "auto",
                },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<RefreshRoundedIcon />}
                onClick={handleRetry}
                sx={actionButtonSx}
              >
                Try Again
              </Button>

              <Button
                variant="contained"
                startIcon={<ArrowBackRoundedIcon />}
                onClick={handleBack}
                sx={actionButtonSx}
              >
                Back to Inventory
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // ==========================================================
  // Main Page
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
          borderRadius: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          backgroundColor: "background.paper",
        }}
      >
        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          {/* ======================================================
              Breadcrumbs
          ====================================================== */}

          <Breadcrumbs
            separator="/"
            sx={{
              mb: {
                xs: 2.5,
                sm: 3,
              },

              "& .MuiBreadcrumbs-ol": {
                flexWrap: "wrap",
              },
            }}
          >
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/dashboard")}
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.875rem",
                },
              }}
            >
              Dashboard
            </Link>

            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/inventory")}
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.875rem",
                },
              }}
            >
              Inventory
            </Link>

            <Typography
              color="text.primary"
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.875rem",
                },
              }}
            >
              Edit Inventory
            </Typography>
          </Breadcrumbs>

          {/* ======================================================
              Page Header
          ====================================================== */}

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
            spacing={{
              xs: 2.5,
              md: 3,
            }}
            mb={{
              xs: 3,
              sm: 4,
            }}
          >
            <Stack
              direction="row"
              spacing={{
                xs: 1.5,
                sm: 2,
              }}
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
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  boxShadow: "0 8px 20px rgba(25,118,210,0.18)",
                }}
              >
                <EditRoundedIcon
                  sx={{
                    fontSize: {
                      xs: 23,
                      sm: 27,
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    fontSize: {
                      xs: "1.65rem",
                      sm: "2rem",
                      md: "2.25rem",
                    },
                    lineHeight: 1.2,
                    mb: 0.75,
                  }}
                >
                  Edit Inventory
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: 720,
                    lineHeight: 1.7,
                    fontSize: {
                      xs: "0.875rem",
                      sm: "0.95rem",
                      md: "1rem",
                    },
                  }}
                >
                  Update product stock levels, warehouse
                  information, supplier details, and inventory
                  settings while keeping your inventory records
                  accurate.
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={handleBack}
              sx={{
                ...actionButtonSx,
                alignSelf: {
                  xs: "stretch",
                  md: "center",
                },
              }}
            >
              Back to Inventory
            </Button>
          </Stack>

          {/* ======================================================
              Current Inventory Information
          ====================================================== */}

          <Paper
            elevation={0}
            sx={{
              mb: 3,
              p: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.default",
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={{
                xs: 2,
                sm: 3,
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  Editing Inventory Record
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    mt: 0.5,
                    wordBreak: "break-word",
                  }}
                >
                  {selectedItem?.product?.name ||
                    selectedItem?.product_name ||
                    "Inventory Item"}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  SKU:{" "}
                  {selectedItem?.product?.sku ||
                    selectedItem?.sku ||
                    "-"}
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
              >
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: "primary.light",
                    color: "primary.dark",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                  }}
                >
                  ID: {selectedItem?.id || id}
                </Box>

                {selectedItem?.warehouse && (
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2,
                      bgcolor: "grey.100",
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                    }}
                  >
                    {selectedItem.warehouse}
                  </Box>
                )}
              </Stack>
            </Stack>
          </Paper>

          {/* ======================================================
              Inventory Form
          ====================================================== */}

          <InventoryForm
            mode="edit"
            initialValues={selectedItem}
            products={products}
            loading={loading || productsLoading}
            submitButtonText="Update Inventory"
            onSubmit={handleSubmit}
          />

          {/* ======================================================
              Bottom Information Section
          ====================================================== */}

          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
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
              justifyContent="space-between"
              alignItems={{
                xs: "stretch",
                lg: "center",
              }}
              spacing={{
                xs: 2.5,
                lg: 3,
              }}
            >
              {/* ==================================================
                  Information
              ================================================== */}

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
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
                    maxWidth: 720,
                    lineHeight: 1.75,
                  }}
                >
                  Review the selected product, stock quantities,
                  warehouse, supplier, reorder level, and other
                  inventory settings before saving your changes.
                  Keeping these values accurate helps maintain
                  reliable stock monitoring and replenishment
                  recommendations.
                </Typography>
              </Box>

              {/* ==================================================
                  Actions
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
                    lg: "auto",
                  },
                  flexShrink: 0,
                }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<ArrowBackRoundedIcon />}
                  onClick={handleBack}
                  disabled={loading}
                  sx={actionButtonSx}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  startIcon={<EditRoundedIcon />}
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                  disabled={loading}
                  sx={{
                    ...actionButtonSx,
                    minWidth: {
                      xs: "100%",
                      sm: 190,
                    },
                  }}
                >
                  Review Changes
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Paper>

      {/* ========================================================
          Success Snackbar
      ======================================================== */}

      <Snackbar
        open={successOpen}
        autoHideDuration={2500}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          mt: {
            xs: 1,
            sm: 2,
          },
          mx: {
            xs: 1,
            sm: 0,
          },
        }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          variant="filled"
          elevation={6}
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
          Inventory updated successfully.
        </Alert>
      </Snackbar>

      {/* ========================================================
          Error Snackbar
      ======================================================== */}

      <Snackbar
        open={errorOpen}
        autoHideDuration={5000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          mt: {
            xs: 1,
            sm: 2,
          },
          mx: {
            xs: 1,
            sm: 0,
          },
        }}
      >
        <Alert
          onClose={() => setErrorOpen(false)}
          severity="error"
          variant="filled"
          elevation={6}
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

export default EditInventory;
