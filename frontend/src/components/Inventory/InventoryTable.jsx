import PropTypes from "prop-types";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  Chip,
  Grid,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Divider,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import StockBadge from "./StockBadge";

const InventoryTable = ({
  inventory = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onUpdateStock,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  // ==========================================================
  // View Handler
  // ==========================================================

  const handleView = (item) => {
    if (typeof onView === "function") {
      onView(item);
      return;
    }

    navigate(`/inventory/${item.id}`);
  };

  // ==========================================================
  // Action Buttons
  // ==========================================================

  const renderActions = (item) => (
    <Stack
      direction="row"
      spacing={0.5}
      justifyContent="center"
      alignItems="center"
      flexWrap="nowrap"
    >
      <Tooltip title="View Details">
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleView(item)}
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            transition: "all .25s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit Inventory">
        <IconButton
          size="small"
          color="warning"
          onClick={() => onEdit(item)}
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            transition: "all .25s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Update Stock">
        <IconButton
          size="small"
          color="success"
          onClick={() => onUpdateStock(item)}
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            transition: "all .25s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <Inventory2OutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete Inventory">
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(item)}
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            transition: "all .25s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <DeleteOutlineOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  // ==========================================================
  // MOBILE CARD VIEW
  // ==========================================================

  if (mobile) {
    return (
      <Stack spacing={2.5}>
        {inventory.map((item) => (
          <Card
            key={item.id}
            elevation={0}
            sx={{
              borderRadius: 4,
              p: 2.5,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              transition: "all .25s ease",
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            <Stack spacing={2}>
              {/* Header */}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Box flex={1} minWidth={0}>
                  <Typography
  variant="subtitle1"
  fontWeight={700}
>
  #{item.product_id} - {item.product?.name}
</Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                  >
                    SKU : {item.product?.sku || "-"}
                  </Typography>
                </Box>

                <StockBadge
                  status={item.status}
                  currentStock={item.current_stock}
                  minimumStock={item.minimum_stock}
                  maximumStock={item.maximum_stock}
                />
              </Stack>

              <Divider />

              {/* Inventory Details */}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Current Stock
                  </Typography>

                  <Typography
                    fontWeight={700}
                    mt={0.3}
                  >
                    {item.current_stock}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Minimum Stock
                  </Typography>

                  <Typography
                    fontWeight={700}
                    mt={0.3}
                  >
                    {item.minimum_stock}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Maximum Stock
                  </Typography>

                  <Typography
                    fontWeight={700}
                    mt={0.3}
                  >
                    {item.maximum_stock}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Safety Stock
                  </Typography>

                  <Typography
                    fontWeight={700}
                    mt={0.3}
                  >
                    {item.safety_stock}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Warehouse
                  </Typography>

                  <Typography
                    fontWeight={600}
                    mt={0.3}
                  >
                    {item.warehouse || "—"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Supplier
                  </Typography>

                  <Typography
                    fontWeight={600}
                    mt={0.3}
                  >
                    {item.supplier || "—"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider />

              {/* Action Buttons */}

              <Stack spacing={1.25}>
                                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={() => handleView(item)}
                  sx={{
                    minHeight: 46,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  View Details
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => onEdit(item)}
                  sx={{
                    minHeight: 46,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Edit Inventory
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<Inventory2OutlinedIcon />}
                  onClick={() => onUpdateStock(item)}
                  sx={{
                    minHeight: 46,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Update Stock
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineOutlinedIcon />}
                  onClick={() => onDelete(item)}
                  sx={{
                    minHeight: 46,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Delete Inventory
                </Button>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    );
  }

  // ==========================================================
  // DESKTOP TABLE
  // ==========================================================

  return (
    <TableContainer
      component={Card}
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        overflowX: "auto",
        boxShadow: "0 8px 24px rgba(0,0,0,.06)",
      }}
    >
      <Table
        stickyHeader
        sx={{
          minWidth: 1200,

          "& .MuiTableHead-root .MuiTableCell-root": {
            bgcolor: "grey.100",
            fontWeight: 700,
            whiteSpace: "nowrap",
            py: 2,
            fontSize: "0.92rem",
            color: "text.primary",
          },

          "& .MuiTableBody-root .MuiTableCell-root": {
            py: 2,
            verticalAlign: "middle",
            fontSize: "0.92rem",
          },
        }}
      >
        <TableHead>
          <TableRow>

            <TableCell>Product</TableCell>

          

            <TableCell align="center">
              Current
            </TableCell>

            <TableCell align="center">
              Minimum
            </TableCell>

            <TableCell align="center">
              Maximum
            </TableCell>

            <TableCell align="center">
              Safety
            </TableCell>

            <TableCell>
              Warehouse
            </TableCell>

            <TableCell>
              Supplier
            </TableCell>

            <TableCell align="center">
              Status
            </TableCell>

            <TableCell align="center">
              Actions
            </TableCell>

          </TableRow>
        </TableHead>

        <TableBody>
                    {/* ==========================================================
              LOADING STATE
          ========================================================== */}

          {loading ? (
            <TableRow>
              <TableCell
                colSpan={10}
                align="center"
                sx={{
                  py: 8,
                }}
              >
                <Stack
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    Loading inventory...
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Please wait while inventory records are being loaded.
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
          ) : inventory.length === 0 ? (

            /* ==========================================================
                EMPTY STATE
            ========================================================== */

            <TableRow>
              <TableCell
                colSpan={10}
                align="center"
                sx={{
                  py: 10,
                }}
              >
                <Stack
                  spacing={2}
                  alignItems="center"
                >
                  <Inventory2OutlinedIcon
                    color="disabled"
                    sx={{
                      fontSize: 64,
                    }}
                  />

                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    No Inventory Found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    There are currently no inventory records available.
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>

          ) : (

            /* ==========================================================
                INVENTORY ROWS
            ========================================================== */

            inventory.map((item) => (
              <TableRow
                hover
                key={item.id}
                sx={{
                  transition: "all .25s ease",

                  "&:hover": {
                    backgroundColor:
                      theme.palette.action.hover,
                  },

                  "& td": {
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  },
                }}
              >
                {/* Product */}
<TableCell>
  <Stack spacing={0.3}>
    <Typography fontWeight={700}>
      {item.product_id}
    </Typography>

    <Typography
      variant="body2"
      color="text.secondary"
      noWrap
    >
      {item.product?.name}
    </Typography>
  </Stack>
</TableCell>
                

                {/* Current */}

                <TableCell align="center">
                  <Chip
                    label={item.current_stock}
                    color="primary"
                    size="small"
                    sx={{
                      minWidth: 60,
                      fontWeight: 700,
                    }}
                  />
                </TableCell>

                {/* Minimum */}

                <TableCell align="center">
                  {item.minimum_stock}
                </TableCell>

                {/* Maximum */}

                <TableCell align="center">
                  {item.maximum_stock}
                </TableCell>

                {/* Safety */}

                <TableCell align="center">
                  {item.safety_stock}
                </TableCell>

                {/* Warehouse */}

                <TableCell>
                  <Typography noWrap>
                    {item.warehouse || "-"}
                  </Typography>
                </TableCell>

                {/* Supplier */}

                <TableCell>
                  <Typography noWrap>
                    {item.supplier || "-"}
                  </Typography>
                </TableCell>

                {/* Status */}

                <TableCell align="center">
                  <StockBadge
                    status={item.status}
                    currentStock={
                      item.current_stock
                    }
                    minimumStock={
                      item.minimum_stock
                    }
                    maximumStock={
                      item.maximum_stock
                    }
                  />
                </TableCell>

                {/* Actions */}

                <TableCell align="center">
                  {renderActions(item)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

InventoryTable.propTypes = {
  inventory: PropTypes.array,
  loading: PropTypes.bool,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdateStock: PropTypes.func,
};

InventoryTable.defaultProps = {
  inventory: [],
  loading: false,
  onView: () => {},
  onEdit: () => {},
  onDelete: () => {},
  onUpdateStock: () => {},
};

export default memo(InventoryTable);
      