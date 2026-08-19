// src/components/inventory/InventoryTable.jsx

import PropTypes from "prop-types";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
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
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import StockBadge from "./StockBadge";

/* ============================================================
   Helpers
============================================================ */

const getProductName = (item) =>
  item?.product?.name || item?.product_name || "Unknown Product";

const getProductSku = (item) =>
  item?.product?.sku || item?.sku || "-";

const getProductId = (item) =>
  item?.product_id ?? item?.product?.id ?? "-";

const getStockStatus = (item) => ({
  status: item?.status || "",
  currentStock: Number(item?.current_stock ?? 0),
  minimumStock: Number(item?.minimum_stock ?? 0),
  maximumStock: Number(item?.maximum_stock ?? 0),
});

/* ============================================================
   Action Icon Button
============================================================ */

function ActionButton({
  title,
  color,
  icon,
  onClick,
}) {
  return (
    <Tooltip title={title} arrow>
      <IconButton
        size="small"
        color={color}
        onClick={onClick}
        aria-label={title}
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          transition: "all .25s ease",

          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 5px 12px rgba(0,0,0,.08)",
          },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}

ActionButton.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    "inherit",
    "primary",
    "secondary",
    "success",
    "error",
    "info",
    "warning",
  ]),
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

ActionButton.defaultProps = {
  color: "inherit",
};

/* ============================================================
   Inventory Table
============================================================ */

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

  /* ==========================================================
     View
  ========================================================== */

  const handleView = useCallback(
    (item) => {
      if (!item) return;

      if (typeof onView === "function") {
        onView(item);
        return;
      }

      if (item.id !== undefined && item.id !== null) {
        navigate(`/inventory/${item.id}`);
      }
    },
    [navigate, onView]
  );

  /* ==========================================================
     Edit
  ========================================================== */

  const handleEdit = useCallback(
    (item) => {
      if (!item) return;

      if (typeof onEdit === "function") {
        onEdit(item);
        return;
      }

      if (item.id !== undefined && item.id !== null) {
        navigate(`/inventory/${item.id}/edit`);
      }
    },
    [navigate, onEdit]
  );

  /* ==========================================================
     Delete
  ========================================================== */

  const handleDelete = useCallback(
    (item) => {
      if (!item) return;

      if (typeof onDelete === "function") {
        onDelete(item);
      }
    },
    [onDelete]
  );

  /* ==========================================================
     Update Stock
  ========================================================== */

  const handleUpdateStock = useCallback(
    (item) => {
      if (!item) return;

      if (typeof onUpdateStock === "function") {
        onUpdateStock(item);
      }
    },
    [onUpdateStock]
  );

  /* ==========================================================
     Actions
  ========================================================== */

  const renderActions = useCallback(
    (item) => (
      <Stack
        direction="row"
        spacing={0.75}
        justifyContent="center"
        alignItems="center"
        flexWrap="nowrap"
      >
        <ActionButton
          title="View Details"
          color="primary"
          icon={<VisibilityOutlinedIcon fontSize="small" />}
          onClick={() => handleView(item)}
        />

        <ActionButton
          title="Edit Inventory"
          color="warning"
          icon={<EditOutlinedIcon fontSize="small" />}
          onClick={() => handleEdit(item)}
        />

        <ActionButton
          title="Update Stock"
          color="success"
          icon={<Inventory2OutlinedIcon fontSize="small" />}
          onClick={() => handleUpdateStock(item)}
        />

        <ActionButton
          title="Delete Inventory"
          color="error"
          icon={<DeleteOutlineOutlinedIcon fontSize="small" />}
          onClick={() => handleDelete(item)}
        />
      </Stack>
    ),
    [
      handleView,
      handleEdit,
      handleDelete,
      handleUpdateStock,
    ]
  );

  /* ==========================================================
     Loading State
  ========================================================== */

  const LoadingState = () => (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        py: 10,
        px: 3,
      }}
    >
      <CircularProgress size={36} />

      <Typography
        variant="h6"
        fontWeight={700}
        color="text.primary"
      >
        Loading inventory...
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
      >
        Please wait while inventory records are being loaded.
      </Typography>
    </Stack>
  );

  /* ==========================================================
     Empty State
  ========================================================== */

  const EmptyState = () => (
    <Stack
      spacing={1.5}
      alignItems="center"
      justifyContent="center"
      sx={{
        py: 10,
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "action.hover",
          color: "text.secondary",
          mb: 1,
        }}
      >
        <Inventory2OutlinedIcon sx={{ fontSize: 38 }} />
      </Box>

      <Typography
        variant="h5"
        fontWeight={800}
      >
        No Inventory Found
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{
          maxWidth: 420,
        }}
      >
        There are currently no inventory records matching
        your search or filter criteria.
      </Typography>
    </Stack>
  );

  /* ==========================================================
     MOBILE CARD VIEW
  ========================================================== */

  if (mobile) {
    return (
      <Stack spacing={2.5}>
        {loading ? (
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <LoadingState />
            </CardContent>
          </Card>
        ) : inventory.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <EmptyState />
            </CardContent>
          </Card>
        ) : (
          inventory.map((item) => {
            const stock = getStockStatus(item);

            return (
              <Card
                key={item.id}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  overflow: "hidden",
                  transition: "all .25s ease",

                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow:
                      "0 12px 30px rgba(0,0,0,.08)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 2, sm: 2.5 },

                    "&:last-child": {
                      pb: { xs: 2, sm: 2.5 },
                    },
                  }}
                >
                  <Stack spacing={2.25}>

                    {/* ================================
                        Header
                    ================================= */}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={1.5}
                    >
                      <Box
                        flex={1}
                        minWidth={0}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          Product #{getProductId(item)}
                        </Typography>

                        <Typography
                          variant="h6"
                          fontWeight={800}
                          noWrap
                          sx={{
                            mt: 0.25,
                          }}
                        >
                          {getProductName(item)}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{
                            mt: 0.4,
                          }}
                        >
                          SKU: {getProductSku(item)}
                        </Typography>
                      </Box>

                      <StockBadge
                        status={stock.status}
                        currentStock={stock.currentStock}
                        minimumStock={stock.minimumStock}
                        maximumStock={stock.maximumStock}
                      />
                    </Stack>

                    <Divider />

                    {/* ================================
                        Stock Information
                    ================================= */}

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(2, minmax(0, 1fr))",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Current Stock
                        </Typography>

                        <Chip
                          label={stock.currentStock}
                          color="primary"
                          size="small"
                          sx={{
                            mt: 0.6,
                            minWidth: 60,
                            fontWeight: 700,
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Minimum Stock
                        </Typography>

                        <Typography
                          fontWeight={700}
                          mt={0.6}
                        >
                          {item.minimum_stock ?? 0}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Maximum Stock
                        </Typography>

                        <Typography
                          fontWeight={700}
                          mt={0.6}
                        >
                          {item.maximum_stock ?? 0}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Safety Stock
                        </Typography>

                        <Typography
                          fontWeight={700}
                          mt={0.6}
                        >
                          {item.safety_stock ?? 0}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    {/* ================================
                        Warehouse
                    ================================= */}

                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "action.hover",
                          color: "text.secondary",
                          flexShrink: 0,
                        }}
                      >
                        <WarehouseOutlinedIcon
                          fontSize="small"
                        />
                      </Box>

                      <Box minWidth={0}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Warehouse
                        </Typography>

                        <Typography
                          fontWeight={600}
                          noWrap
                        >
                          {item.warehouse || "—"}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* ================================
                        Supplier
                    ================================= */}

                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "action.hover",
                          color: "text.secondary",
                          flexShrink: 0,
                        }}
                      >
                        <LocalShippingOutlinedIcon
                          fontSize="small"
                        />
                      </Box>

                      <Box minWidth={0}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Supplier
                        </Typography>

                        <Typography
                          fontWeight={600}
                          noWrap
                        >
                          {item.supplier || "—"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider />

                    {/* ================================
                        Mobile Actions
                    ================================= */}

                    <Stack spacing={1.25}>

                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={
                          <VisibilityOutlinedIcon />
                        }
                        onClick={() =>
                          handleView(item)
                        }
                        sx={{
                          minHeight: 46,
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        View Details
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        color="warning"
                        startIcon={
                          <EditOutlinedIcon />
                        }
                        onClick={() =>
                          handleEdit(item)
                        }
                        sx={{
                          minHeight: 46,
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        Edit Inventory
                      </Button>

                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={
                          <Inventory2OutlinedIcon />
                        }
                        onClick={() =>
                          handleUpdateStock(item)
                        }
                        sx={{
                          minHeight: 46,
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        Update Stock
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={
                          <DeleteOutlineOutlinedIcon />
                        }
                        onClick={() =>
                          handleDelete(item)
                        }
                        sx={{
                          minHeight: 46,
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        Delete Inventory
                      </Button>

                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        )}
      </Stack>
    );
  }

  /* ==========================================================
     DESKTOP TABLE
  ========================================================== */

  return (
    <TableContainer
      component={Card}
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        overflowX: "auto",
        bgcolor: "background.paper",
        boxShadow: "0 8px 24px rgba(0,0,0,.06)",
      }}
    >
      <Table
        stickyHeader
        sx={{
          minWidth: 1250,

          "& .MuiTableHead-root .MuiTableCell-root": {
            bgcolor: "grey.100",
            fontWeight: 800,
            whiteSpace: "nowrap",
            py: 2,
            px: 2,
            fontSize: "0.88rem",
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
          },

          "& .MuiTableBody-root .MuiTableCell-root": {
            py: 2,
            px: 2,
            verticalAlign: "middle",
            fontSize: "0.9rem",
            borderBottom: "1px solid",
            borderColor: "divider",
          },

          "& .MuiTableBody-root .MuiTableRow:last-child .MuiTableCell-root":
            {
              borderBottom: "none",
            },
        }}
      >
        {/* ======================================================
            HEADER
        ====================================================== */}

        <TableHead>
          <TableRow>

            <TableCell>
              Product
            </TableCell>

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

            <TableCell
              align="center"
              sx={{
                minWidth: 180,
              }}
            >
              Actions
            </TableCell>

          </TableRow>
        </TableHead>

        {/* ======================================================
            BODY
        ====================================================== */}

        <TableBody>

          {/* ================================
              Loading
          ================================= */}

          {loading && (
            <TableRow>
              <TableCell
                colSpan={9}
                align="center"
              >
                <LoadingState />
              </TableCell>
            </TableRow>
          )}

          {/* ================================
              Empty
          ================================= */}

          {!loading && inventory.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                align="center"
              >
                <EmptyState />
              </TableCell>
            </TableRow>
          )}

          {/* ================================
              Inventory Rows
          ================================= */}

          {!loading &&
            inventory.length > 0 &&
            inventory.map((item) => {
              const stock = getStockStatus(item);

              return (
                <TableRow
                  hover
                  key={item.id}
                  sx={{
                    transition: "all .2s ease",

                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >

                  {/* Product */}

                  <TableCell>
                    <Stack
                      spacing={0.25}
                      minWidth={180}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        ID: {getProductId(item)}
                      </Typography>

                      <Typography
                        fontWeight={800}
                        noWrap
                      >
                        {getProductName(item)}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      >
                        SKU: {getProductSku(item)}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Current */}

                  <TableCell align="center">
                    <Chip
                      label={stock.currentStock}
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
                    <Typography fontWeight={600}>
                      {item.minimum_stock ?? 0}
                    </Typography>
                  </TableCell>

                  {/* Maximum */}

                  <TableCell align="center">
                    <Typography fontWeight={600}>
                      {item.maximum_stock ?? 0}
                    </Typography>
                  </TableCell>

                  {/* Safety */}

                  <TableCell align="center">
                    <Typography fontWeight={600}>
                      {item.safety_stock ?? 0}
                    </Typography>
                  </TableCell>

                  {/* Warehouse */}

                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      minWidth={150}
                    >
                      <WarehouseOutlinedIcon
                        fontSize="small"
                        color="action"
                      />

                      <Typography noWrap>
                        {item.warehouse || "-"}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Supplier */}

                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      minWidth={150}
                    >
                      <LocalShippingOutlinedIcon
                        fontSize="small"
                        color="action"
                      />

                      <Typography noWrap>
                        {item.supplier || "-"}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Status */}

                  <TableCell align="center">
                    <StockBadge
                      status={stock.status}
                      currentStock={stock.currentStock}
                      minimumStock={stock.minimumStock}
                      maximumStock={stock.maximumStock}
                    />
                  </TableCell>

                  {/* Actions */}

                  <TableCell align="center">
                    {renderActions(item)}
                  </TableCell>

                </TableRow>
              );
            })}

        </TableBody>
      </Table>
    </TableContainer>
  );
};

/* ============================================================
   PropTypes
============================================================ */

InventoryTable.propTypes = {
  inventory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),

      product_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),

      product: PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),

        name: PropTypes.string,

        sku: PropTypes.string,
      }),

      product_name: PropTypes.string,

      sku: PropTypes.string,

      current_stock: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),

      minimum_stock: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),

      maximum_stock: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),

      safety_stock: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),

      reorder_level: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),

      warehouse: PropTypes.string,

      supplier: PropTypes.string,

      status: PropTypes.string,
    })
  ),

  loading: PropTypes.bool,

  onView: PropTypes.func,

  onEdit: PropTypes.func,

  onDelete: PropTypes.func,

  onUpdateStock: PropTypes.func,
};

/* ============================================================
   Defaults
============================================================ */

InventoryTable.defaultProps = {
  inventory: [],
  loading: false,
  onView: () => {},
  onEdit: () => {},
  onDelete: () => {},
  onUpdateStock: () => {},
};

export default memo(InventoryTable);
