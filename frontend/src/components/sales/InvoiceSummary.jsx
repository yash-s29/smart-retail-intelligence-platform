import React from "react";

import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { PrimaryButton } from '../../components/ui';

import {
  Calculator,
  Package,
  ReceiptText,
  Save,
} from "lucide-react";

import { formatCurrency } from "../../utils/salesHelpers";

const InvoiceSummary = ({
  product = null,
  quantity = 0,
  paymentMethod = "Cash",
  taxRate = 0.18,
  isSubmitting = false,
  onSubmit,
}) => {
  /* ==========================================================
      Calculations
  ========================================================== */

  const unitPrice =
    product?.selling_price || 0;

  const subtotal =
    quantity * unitPrice;

  const taxAmount =
    subtotal * taxRate;

  const grandTotal =
    subtotal + taxAmount;

  /* ==========================================================
      Component
  ========================================================== */

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        position: { lg: "sticky" },
        top: "var(--navbar-height)",
      }}
    >
      {/* ============================================= */}

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        mb={3}
      >
        <ReceiptText size={24} />

        <Typography
          variant="h6"
          fontWeight={700}
        >
          Invoice Summary
        </Typography>
      </Stack>

      {/* ============================================= */}

      {product ? (
        <>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack spacing={0.5}>
                <Typography
                  fontWeight={700}
                >
                  {product.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  SKU :
                  {" "}
                  {product.sku || "-"}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Category :
                  {" "}
                  {product.category ||
                    "General"}
                </Typography>
              </Stack>

              <Chip
                icon={<Package size={16} />}
                label={
                  product.inventory
                    ?.current_stock ?? 0
                }
                color="primary"
                variant="outlined"
              />
            </Stack>
          </Paper>

          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography color="text.secondary">
                Unit Price
              </Typography>

              <Typography fontWeight={600}>
                {formatCurrency(
                  unitPrice
                )}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography color="text.secondary">
                Quantity
              </Typography>

              <Typography fontWeight={600}>
                {quantity}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography color="text.secondary">
                Subtotal
              </Typography>

              <Typography fontWeight={700}>
                {formatCurrency(
                  subtotal
                )}
              </Typography>
            </Stack>

            <Divider />
                        <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography color="text.secondary">
                GST ({taxRate * 100}%)
              </Typography>

              <Typography fontWeight={600}>
                {formatCurrency(taxAmount)}
              </Typography>
            </Stack>

            <Divider />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Grand Total
              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                color="primary.main"
              >
                {formatCurrency(grandTotal)}
              </Typography>
            </Stack>

            <Divider />

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography color="text.secondary">
                Payment Method
              </Typography>

              <Chip
                label={paymentMethod}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Available Stock
              </Typography>

              <Typography
                fontWeight={700}
                color={
                  (product.inventory?.current_stock ?? 0) > quantity
                    ? "success.main"
                    : "error.main"
                }
              >
                {product.inventory?.current_stock ?? 0} Units
              </Typography>

              {(product.inventory?.current_stock ?? 0) <= quantity && (
                <Chip
                  size="small"
                  color="warning"
                  label="Stock will reach minimum level"
                />
              )}
            </Stack>
          </Stack>
        </>
      ) : (
        <Box
          sx={{
            py: 6,
            textAlign: "center",
          }}
        >
          <Calculator
            size={48}
            color="#94A3B8"
          />

          <Typography
            mt={2}
            fontWeight={600}
          >
            No Product Selected
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Select a product to generate the invoice summary.
          </Typography>
        </Box>
      )}

      <PrimaryButton
        fullWidth
        variant="contained"
        size="large"
        startIcon={<Save size={20} />}
        disabled={!product || quantity <= 0 || isSubmitting}
        onClick={onSubmit}
        sx={{ mt: 4, height: 54, borderRadius: 3, textTransform: "none", fontWeight: 700, fontSize: "1rem" }}
      >
        {isSubmitting ? "Processing Sale..." : `Complete Sale • ${formatCurrency(grandTotal)}`}
      </PrimaryButton>

      <Typography
        variant="caption"
        color="text.secondary"
        textAlign="center"
        display="block"
        mt={2}
      >
        Completing this sale will automatically deduct inventory
        and update your dashboard analytics.
      </Typography>
    </Paper>
  );
};

export default InvoiceSummary;