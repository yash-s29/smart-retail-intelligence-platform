import PropTypes from "prop-types";

import { Chip } from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

const StockBadge = ({
  status,
  currentStock,
  minimumStock,
  maximumStock,
}) => {
  let badgeLabel = status;
  let badgeColor = "success";
  let badgeIcon = <CheckCircleRoundedIcon fontSize="small" />;

  // ==========================================================
  // Auto Calculate Status
  // ==========================================================

  if (!badgeLabel) {
    if (currentStock <= 0) {
      badgeLabel = "Out of Stock";
    } else if (currentStock <= minimumStock) {
      badgeLabel = "Low Stock";
    } else if (
      maximumStock > 0 &&
      currentStock >= maximumStock
    ) {
      badgeLabel = "Overstock";
    } else {
      badgeLabel = "In Stock";
    }
  }

  // ==========================================================
  // Badge Style
  // ==========================================================

  switch (badgeLabel.toLowerCase()) {
    case "out of stock":
      badgeColor = "error";
      badgeIcon = <CancelRoundedIcon fontSize="small" />;
      break;

    case "low stock":
      badgeColor = "warning";
      badgeIcon = <WarningAmberRoundedIcon fontSize="small" />;
      break;

    case "overstock":
      badgeColor = "info";
      badgeIcon = <Inventory2RoundedIcon fontSize="small" />;
      break;

    default:
      badgeColor = "success";
      badgeIcon = <CheckCircleRoundedIcon fontSize="small" />;
  }

  return (
    <Chip
      icon={badgeIcon}
      label={badgeLabel}
      color={badgeColor}
      variant="filled"
      size="small"
      sx={{
        height: 34,
        minWidth: 135,
        px: 0.5,

        borderRadius: 2,

        justifyContent: "flex-start",

        fontWeight: 700,

        fontSize: "0.82rem",

        letterSpacing: 0.2,

        transition: "all .25s ease",

        "& .MuiChip-icon": {
          fontSize: 18,
          ml: 0.5,
        },

        "& .MuiChip-label": {
          px: 1,
          whiteSpace: "nowrap",
        },

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 2,
        },

        "&.MuiChip-colorSuccess": {
          bgcolor: "success.light",
          color: "success.dark",
        },

        "&.MuiChip-colorWarning": {
          bgcolor: "warning.light",
          color: "warning.dark",
        },

        "&.MuiChip-colorError": {
          bgcolor: "error.light",
          color: "error.dark",
        },

        "&.MuiChip-colorInfo": {
          bgcolor: "info.light",
          color: "info.dark",
        },
      }}
    />
  );
};

StockBadge.propTypes = {
  status: PropTypes.string,

  currentStock: PropTypes.number.isRequired,

  minimumStock: PropTypes.number,

  maximumStock: PropTypes.number,
};

StockBadge.defaultProps = {
  status: "",

  minimumStock: 0,

  maximumStock: 0,
};

export default StockBadge;