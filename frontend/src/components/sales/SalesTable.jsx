import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "../../utils/salesHelpers";

/* ==========================================================
   Sales Table
========================================================== */

const SalesTable = ({
  sales = [],
  loading = false,
  error = null,
  onView,
  onEdit,
  onDelete,
}) => {
  /* ========================================================
      Loading
  ======================================================== */

  if (loading) {
    return (
      <Box
        sx={{
          py: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CircularProgress />

        <Typography mt={2} color="text.secondary">
          Loading sales...
        </Typography>
      </Box>
    );
  }

  /* ========================================================
      Error
  ======================================================== */

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 3,
          textAlign: "center",
          border: "1px solid",
          borderColor: "error.light",
        }}
      >
        <Typography color="error" fontWeight={600}>
          {error}
        </Typography>
      </Paper>
    );
  }

  /* ========================================================
      Table
  ======================================================== */

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflowX: "auto",

        "&::-webkit-scrollbar": {
          height: 8,
        },
      }}
    >
      <Table
        stickyHeader
        sx={{
          minWidth: 1000,
        }}
      >
        
        {/* ======================================================
            Header
        ====================================================== */}

        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Invoice</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              Qty
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Total
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              Payment
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              Status
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        {/* ======================================================
            Body
        ====================================================== */}

        <TableBody>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <TableRow
                hover
                key={sale.id}
                sx={{
                  "& td": {
                    py: 2,
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                {/* Invoice */}
                <TableCell>
                  {sale.invoice_number || `INV-${sale.id}`}
                </TableCell>

                {/* Date */}
                <TableCell>{formatDate(sale.sale_date)}</TableCell>

                {/* Product */}
                <TableCell>
                  <Typography fontWeight={600}>
                    {sale.product_name ?? "-"}
                  </Typography>
                </TableCell>

                {/* Customer */}
                <TableCell>
                  {sale.customer_name || "Walk-in Customer"}
                </TableCell>

                {/* Quantity */}
                <TableCell align="center">{sale.quantity_sold}</TableCell>

                {/* Total */}
                <TableCell align="right">
                  <Typography color="success.main" fontWeight={700}>
                    {formatCurrency(sale.total_amount)}
                  </Typography>
                </TableCell>

                {/* Payment */}
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={sale.payment_method || "Cash"}
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>

                {/* Status */}
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={sale.status || "Completed"}
                    color={getStatusColor(sale.status)}
                  />
                </TableCell>

                {/* Actions */}
                <TableCell align="center">
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                  >
                    <Tooltip title="View">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onView?.(sale)}
                      >
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton
                        color="info"
                        size="small"
                        onClick={() => onEdit?.(sale)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete?.(sale)}
                      >
                        {/* THIS LINE IS FIXED */}
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={9}
                align="center"
                sx={{
                  py: 8,
                }}
              >
                <Typography
                  variant="h6"
                  color="text.secondary"
                  gutterBottom
                >
                  No Sales Found
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Your sales will appear here after creating the first sale.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SalesTable;