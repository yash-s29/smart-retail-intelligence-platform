import PropTypes from "prop-types";
import { memo, useMemo } from "react";

import { Chip } from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

/**
 * StockBadge
 *
 * Displays the current inventory status using:
 * - In Stock
 * - Low Stock
 * - Out of Stock
 * - Overstock
 *
 * If a valid status is not supplied, the status is automatically
 * calculated using currentStock, minimumStock and maximumStock.
 */
const StockBadge = ({
  status = "",
  currentStock = 0,
  minimumStock = 0,
  maximumStock = 0,
}) => {
  // ==========================================================
  // Normalize Stock Values
  // ==========================================================

  const stockValues = useMemo(() => {
    const current = Number(currentStock) || 0;
    const minimum = Number(minimumStock) || 0;
    const maximum = Number(maximumStock) || 0;

    return {
      current,
      minimum,
      maximum,
    };
  }, [currentStock, minimumStock, maximumStock]);

  // ==========================================================
  // Calculate / Normalize Status
  // ==========================================================

  const normalizedStatus = useMemo(() => {
    const suppliedStatus =
      typeof status === "string" ? status.trim() : "";

    if (suppliedStatus) {
      const statusMap = {
        "in stock": "In Stock",
        "low stock": "Low Stock",
        "out of stock": "Out of Stock",
        overstock: "Overstock",
      };

      return (
        statusMap[suppliedStatus.toLowerCase()] ||
        suppliedStatus
      );
    }

    const {
      current,
      minimum,
      maximum,
    } = stockValues;

    if (current <= 0) {
      return "Out of Stock";
    }

    if (minimum > 0 && current <= minimum) {
      return "Low Stock";
    }

    if (maximum > 0 && current >= maximum) {
      return "Overstock";
    }

    return "In Stock";
  }, [status, stockValues]);

  // ==========================================================
  // Badge Configuration
  // ==========================================================

  const badgeConfig = useMemo(() => {
    switch (normalizedStatus.toLowerCase()) {
      case "out of stock":
        return {
          color: "error",
          icon: <CancelRoundedIcon fontSize="small" />,
        };

      case "low stock":
        return {
          color: "warning",
          icon: <WarningAmberRoundedIcon fontSize="small" />,
        };

      case "overstock":
        return {
          color: "info",
          icon: <Inventory2RoundedIcon fontSize="small" />,
        };

      case "in stock":
      default:
        return {
          color: "success",
          icon: <CheckCircleRoundedIcon fontSize="small" />,
        };
    }
  }, [normalizedStatus]);

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <Chip
      icon={badgeConfig.icon}
      label={normalizedStatus}
      color={badgeConfig.color}
      variant="filled"
      size="small"
      sx={{
        height: {
          xs: 30,
          sm: 32,
          md: 34,
        },

        minWidth: {
          xs: 112,
          sm: 125,
          md: 135,
        },

        maxWidth: "100%",

        px: 0.5,

        borderRadius: 2,

        justifyContent: "flex-start",

        fontWeight: 700,

        fontSize: {
          xs: "0.72rem",
          sm: "0.78rem",
          md: "0.82rem",
        },

        letterSpacing: 0.2,

        transition:
          "transform .25s ease, box-shadow .25s ease",

        "& .MuiChip-icon": {
          fontSize: {
            xs: 16,
            sm: 17,
            md: 18,
          },

          ml: 0.5,
        },

        "& .MuiChip-label": {
          px: 1,

          whiteSpace: "nowrap",

          overflow: "hidden",

          textOverflow: "ellipsis",
        },

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 2,
        },

        // ======================================================
        // Success
        // ======================================================

        "&.MuiChip-colorSuccess": {
          bgcolor: "success.light",
          color: "success.dark",
        },

        // ======================================================
        // Warning
        // ======================================================

        "&.MuiChip-colorWarning": {
          bgcolor: "warning.light",
          color: "warning.dark",
        },

        // ======================================================
        // Error
        // ======================================================

        "&.MuiChip-colorError": {
          bgcolor: "error.light",
          color: "error.dark",
        },

        // ======================================================
        // Info
        // ======================================================

        "&.MuiChip-colorInfo": {
          bgcolor: "info.light",
          color: "info.dark",
        },
      }}
    />
  );
};

// ==========================================================
// PropTypes
// ==========================================================

StockBadge.propTypes = {
  /**
   * Inventory status.
   * If omitted, status is automatically calculated.
   */
  status: PropTypes.string,

  /**
   * Current quantity available in inventory.
   */
  currentStock: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),

  /**
   * Minimum stock threshold.
   */
  minimumStock: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),

  /**
   * Maximum stock threshold.
   */
  maximumStock: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

// ==========================================================
// Default Props
// ==========================================================

StockBadge.defaultProps = {
  status: "",
  currentStock: 0,
  minimumStock: 0,
  maximumStock: 0,
};

export default memo(StockBadge);
