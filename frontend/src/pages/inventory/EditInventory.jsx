import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";

import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Link,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import InventoryForm from "../../components/Inventory/InventoryForm";

import {
  fetchInventoryById,
  updateInventory,
} from "../../redux/slices/inventorySlice";
import { fetchProducts } from "../../redux/slices/productSlice";

import {
  COLORS,
  containerVariants,
  itemVariants,
  iconFloatVariants,
  actionButtonSx,
  iconBadgeSx,
} from "../../components/Inventory/inventoryTheme";

function EditInventory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  // =====================================================
  // Redux State
  // =====================================================

  const { selectedItem, loading } = useSelector((state) => state.inventory);

  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );

  // =====================================================
  // Local State
  // =====================================================

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        updateInventory({ id, inventoryData: payload })
      ).unwrap();

      setSuccessOpen(true);

      setTimeout(() => {
        navigate("/inventory");
      }, 1200);
    } catch (error) {
      setErrorMessage(error?.message || "Unable to update inventory.");
      setErrorOpen(true);
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading && !selectedItem) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack spacing={1.5} alignItems="center">
          <CircularProgress size={38} sx={{ color: COLORS.primary }} />
          <Typography sx={{ color: COLORS.slate, fontSize: ".85rem" }}>
            Loading inventory details…
          </Typography>
        </Stack>
      </Container>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <MotionConfig reducedMotion="user">
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 2.5, md: 3.5 },
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ==========================================
              Header
          ========================================== */}

          <motion.div variants={itemVariants}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
              sx={{ mb: 2 }}
            >
              <Box>
                <Breadcrumbs separator="/" sx={{ mb: 0.75, fontSize: ".75rem" }}>
                  <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: "pointer", fontWeight: 500, fontSize: ".75rem" }}
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Link>
                  <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: "pointer", fontWeight: 500, fontSize: ".75rem" }}
                    onClick={() => navigate("/inventory")}
                  >
                    Inventory
                  </Link>
                  <Typography color="text.primary" fontWeight={600} sx={{ fontSize: ".75rem" }}>
                    Edit Inventory
                  </Typography>
                </Breadcrumbs>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <motion.div
                    variants={iconFloatVariants}
                    animate="animate"
                    style={{ display: "flex" }}
                  >
                    <Box sx={iconBadgeSx(42)}>
                      <EditRoundedIcon sx={{ fontSize: 21 }} />
                    </Box>
                  </motion.div>

                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      sx={{ color: COLORS.ink, letterSpacing: "-.02em", lineHeight: 1.2 }}
                    >
                      Edit Inventory
                    </Typography>
                    <Typography sx={{ fontSize: ".78rem", color: COLORS.slate, mt: 0.25 }}>
                      Update stock levels, warehouse and supplier details
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Tooltip title="Return to the inventory list">
                <Button
                  variant="outlined"
                  aria-label="Back to inventory"
                  startIcon={<ArrowBackRoundedIcon />}
                  onClick={() => navigate("/inventory")}
                  sx={{
                    ...actionButtonSx,
                    borderColor: COLORS.border,
                    color: COLORS.slate,
                    "&:hover": {
                      borderColor: "#A9D8E5",
                      bgcolor: COLORS.aquaSoft,
                      color: COLORS.primary,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Back to Inventory
                </Button>
              </Tooltip>
            </Stack>
          </motion.div>

          {/* ==========================================
              Form (InventoryForm renders its own card)
          ========================================== */}

          <motion.div variants={itemVariants}>
            <InventoryForm
              mode="edit"
              initialValues={selectedItem}
              products={products}
              loading={loading || productsLoading}
              submitButtonText="Update Inventory"
              onSubmit={handleSubmit}
            />
          </motion.div>
        </motion.div>

        {/* ==========================================
            Success Snackbar
        ========================================== */}

        <Snackbar
          open={successOpen}
          autoHideDuration={2500}
          onClose={() => setSuccessOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSuccessOpen(false)}
            severity="success"
            variant="filled"
            elevation={6}
            sx={{ width: "100%", alignItems: "center", borderRadius: 2, fontWeight: 600 }}
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
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setErrorOpen(false)}
            severity="error"
            variant="filled"
            elevation={6}
            sx={{ width: "100%", alignItems: "center", borderRadius: 2, fontWeight: 600 }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
    </MotionConfig>
  );
}

export default EditInventory;
