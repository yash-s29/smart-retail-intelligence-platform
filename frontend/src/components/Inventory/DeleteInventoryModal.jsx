import PropTypes from "prop-types";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";

import StockBadge from "./StockBadge";

const DeleteInventoryModal = ({
  open = false,
  inventory = null,
  loading = false,
  onClose,
  onConfirm,
}) => {

  // =====================================================
  // Delete
  // =====================================================

  const handleDelete = () => {
    if (!inventory) return;

    onConfirm(inventory.id);
  };

  // =====================================================
  // Product Values
  // =====================================================

  const productName =
    inventory?.product?.name ||
    inventory?.product_name ||
    "-";

  const sku =
    inventory?.product?.sku ||
    inventory?.sku ||
    "-";

  const warehouse =
    inventory?.warehouse || "-";

  const supplier =
    inventory?.supplier || "-";

  const currentStock =
    inventory?.current_stock ?? 0;

  const minimumStock =
    inventory?.minimum_stock ?? 0;

  const maximumStock =
    inventory?.maximum_stock ?? 0;

  // =====================================================
  // UI
  // =====================================================

  return (

    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
        },
      }}
    >
            {/* =====================================================
          Header
      ===================================================== */}

      <DialogTitle
        sx={{
          pb: 2,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: "error.main",
              borderRadius: 3,
            }}
          >
            <DeleteForeverRoundedIcon />
          </Avatar>

          <Box flex={1}>
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Delete Inventory Record
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              This action permanently removes the inventory
              record and cannot be undone.
            </Typography>
          </Box>

          <Chip
            color="error"
            label="Permanent Delete"
            icon={<WarningAmberRoundedIcon />}
          />
        </Stack>
      </DialogTitle>

      <Divider />

      {/* =====================================================
          Content
      ===================================================== */}

      <DialogContent
        sx={{
          py: 3,
        }}
      >

        {/* ===============================================
            Warning Banner
        =============================================== */}

        <Alert
          severity="warning"
          icon={<WarningAmberRoundedIcon />}
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          <Typography fontWeight={700}>
            Warning
          </Typography>

          <Typography variant="body2">
            Once deleted, this inventory record cannot
            be recovered. Please verify the details
            before continuing.
          </Typography>
        </Alert>

        {/* ===============================================
            Product Card
        =============================================== */}

        {inventory && (

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
            }}
          >

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={3}
              justifyContent="space-between"
            >

              {/* Product */}

              <Box flex={1}>

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  mb={2}
                >
                  <Inventory2RoundedIcon
                    color="primary"
                  />

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {productName}
                  </Typography>

                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  SKU : {sku}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Supplier : {supplier}
                </Typography>

              </Box>

              {/* Warehouse */}

              <Box>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  mb={2}
                >
                  <WarehouseRoundedIcon
                    color="action"
                  />

                  <Typography fontWeight={600}>
                    {warehouse}
                  </Typography>

                </Stack>

                <StockBadge
                  currentStock={currentStock}
                  minimumStock={minimumStock}
                  maximumStock={maximumStock}
                />

              </Box>

            </Stack>

          </Paper>

        )}
                {/* ===============================================
            Inventory Summary
        =============================================== */}

        {inventory && (

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
            mb={3}
          >

            {/* Current Stock */}

            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: 3,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Current Stock
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
              >
                {currentStock}
              </Typography>
            </Paper>

            {/* Minimum Stock */}

            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: 3,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Minimum Stock
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="warning.main"
              >
                {minimumStock}
              </Typography>
            </Paper>

            {/* Maximum Stock */}

            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: 3,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Maximum Stock
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="success.main"
              >
                {maximumStock || "-"}
              </Typography>
            </Paper>

          </Stack>

        )}

        {/* ===============================================
            Additional Details
        =============================================== */}

        {inventory && (

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
            }}
          >

            <Typography
              variant="subtitle1"
              fontWeight={700}
              mb={2}
            >
              Inventory Details
            </Typography>

            <Stack
              spacing={1.5}
            >

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">
                  Inventory ID
                </Typography>

                <Typography fontWeight={600}>
                  #{inventory.id}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">
                  Product Name
                </Typography>

                <Typography fontWeight={600}>
                  {productName}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">
                  SKU
                </Typography>

                <Typography fontWeight={600}>
                  {sku}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">
                  Warehouse
                </Typography>

                <Typography fontWeight={600}>
                  {warehouse}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">
                  Supplier
                </Typography>

                <Typography fontWeight={600}>
                  {supplier}
                </Typography>
              </Stack>

            </Stack>

          </Paper>

        )}

        {/* ===============================================
            Final Warning
        =============================================== */}

        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
          }}
        >
          <Typography
            fontWeight={700}
            gutterBottom
          >
            Permanent Action
          </Typography>

          <Typography
            variant="body2"
          >
            Deleting this inventory record will permanently remove
            it from the inventory system. Stock history,
            dashboard totals, low-stock alerts and reports may be
            affected. This operation cannot be undone.
          </Typography>
        </Alert>
              </DialogContent>

      <Divider />

      {/* ===============================================
          Footer
      =============================================== */}

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          flexDirection: {
            xs: "column-reverse",
            sm: "row",
          },
          justifyContent: "space-between",
          gap: 2,
        }}
      >

        {/* Left Information */}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            textAlign: {
              xs: "center",
              sm: "left",
            },
            flex: 1,
          }}
        >
          This deletion is permanent and will immediately update
          inventory records, dashboard statistics and inventory
          alerts across the application.
        </Typography>

        {/* Buttons */}

        <Stack
          direction="row"
          spacing={2}
        >
          <Button
            variant="outlined"
            color="inherit"
            disabled={loading}
            onClick={onClose}
            sx={{
              minWidth: 120,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            disableElevation
            disabled={loading}
            onClick={handleDelete}
            startIcon={
              loading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <DeleteForeverRoundedIcon />
              )
            }
            sx={{
              minWidth: 190,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,

              "&:hover": {
                transform: "translateY(-1px)",
              },
            }}
          >
            {loading
              ? "Deleting..."
              : "Delete Inventory"}
          </Button>
        </Stack>

      </DialogActions>

    </Dialog>
  );
};

DeleteInventoryModal.propTypes = {
  open: PropTypes.bool,
  inventory: PropTypes.object,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

DeleteInventoryModal.defaultProps = {
  open: false,
  inventory: null,
  loading: false,
};

export default DeleteInventoryModal;