import PropTypes from "prop-types";
import { memo } from "react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import StockBadge from "./StockBadge";

const InventoryCard = ({
  inventory,
  onView,
  onEdit,
  onDelete,
  onUpdateStock,
}) => {
  if (!inventory) return null;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 8px 24px rgba(0,0,0,.06)",
        transition: "all .25s ease",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 36px rgba(0,0,0,.10)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 3,
          "&:last-child": {
            pb: 3,
          },
        }}
      >
        {/* ====================================================== */}
        {/* Header */}
        {/* ====================================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box flex={1} minWidth={0}>
            <Typography
              variant="h6"
              fontWeight={700}
              noWrap
            >
              {inventory.product?.name || "Unknown Product"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mt={0.5}
            >
              SKU : {inventory.product?.sku || "-"}
            </Typography>
          </Box>

          <StockBadge
            status={inventory.status}
            currentStock={inventory.current_stock}
            minimumStock={inventory.minimum_stock}
            maximumStock={inventory.maximum_stock}
          />
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        {/* ====================================================== */}
        {/* Stock Information */}
        {/* ====================================================== */}

        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Current Stock
            </Typography>

            <Chip
              color="primary"
              label={inventory.current_stock}
              sx={{
                mt: 0.8,
                width: 70,
                fontWeight: 700,
              }}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Minimum
            </Typography>

            <Typography
              mt={1}
              fontWeight={700}
            >
              {inventory.minimum_stock}
            </Typography>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Maximum
            </Typography>

            <Typography
              mt={1}
              fontWeight={700}
            >
              {inventory.maximum_stock}
            </Typography>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Safety Stock
            </Typography>

            <Typography
              mt={1}
              fontWeight={700}
            >
              {inventory.safety_stock}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* ====================================================== */}
        {/* Warehouse & Supplier */}
        {/* ====================================================== */}

        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <WarehouseOutlinedIcon
              fontSize="small"
              color="action"
            />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Warehouse
              </Typography>

              <Typography fontWeight={600}>
                {inventory.warehouse || "-"}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <LocalShippingOutlinedIcon
              fontSize="small"
              color="action"
            />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Supplier
              </Typography>

              <Typography fontWeight={600}>
                {inventory.supplier || "-"}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        {/* ====================================================== */}
        {/* Action Buttons */}
        {/* ====================================================== */}

        <Stack spacing={1.5}>
                      <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => onView(inventory)}
            sx={{
              minHeight: 48,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            View Details
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="warning"
            startIcon={<EditOutlinedIcon />}
            onClick={() => onEdit(inventory)}
            sx={{
              minHeight: 48,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Edit Inventory
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<Inventory2OutlinedIcon />}
            onClick={() => onUpdateStock(inventory)}
            sx={{
              minHeight: 48,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Update Stock
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={() => onDelete(inventory)}
            sx={{
              minHeight: 48,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Delete Inventory
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

InventoryCard.propTypes = {
  inventory: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    product: PropTypes.shape({
      name: PropTypes.string,
      sku: PropTypes.string,
    }),
    current_stock: PropTypes.number,
    minimum_stock: PropTypes.number,
    maximum_stock: PropTypes.number,
    safety_stock: PropTypes.number,
    warehouse: PropTypes.string,
    supplier: PropTypes.string,
    status: PropTypes.string,
  }),
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdateStock: PropTypes.func,
};

InventoryCard.defaultProps = {
  inventory: null,
  onView: () => {},
  onEdit: () => {},
  onDelete: () => {},
  onUpdateStock: () => {},
};

export default memo(InventoryCard);
      