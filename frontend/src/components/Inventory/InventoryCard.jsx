// src/components/inventory/InventoryCard.jsx

import PropTypes from "prop-types";
import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
  Tooltip,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import StockBadge from "./StockBadge";

/* ============================================================
   Animation Variants
============================================================ */

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.985,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const iconVariants = {
  rest: {
    rotate: 0,
    scale: 1,
  },

  hover: {
    rotate: [0, -8, 8, -4, 0],
    scale: 1.08,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const statusDotVariants = {
  initial: {
    scale: 0.85,
    opacity: 0.65,
  },

  animate: {
    scale: [0.85, 1, 0.85],
    opacity: [0.65, 1, 0.65],
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* ============================================================
   Small Information Item
============================================================ */

const InfoItem = ({
  icon,
  label,
  value,
  accent = false,
}) => {
  return (
    <Box
      sx={{
        minWidth: 0,
        flex: 1,
        px: 1.25,
        py: 1.05,
        borderRadius: "11px",
        background: accent
          ? "linear-gradient(135deg, rgba(76, 185, 190, 0.09), rgba(255,255,255,0.8))"
          : "rgba(248, 251, 252, 0.9)",
        border: "1px solid rgba(148, 190, 199, 0.16)",
        transition:
          "transform .2s ease, background-color .2s ease, border-color .2s ease",

        "&:hover": {
          transform: {
            xs: "none",
            md: "translateY(-2px)",
          },
          background: "rgba(236, 248, 249, 0.95)",
          borderColor: "rgba(76, 185, 190, 0.28)",
        },
      }}
    >
      <Stack direction="row" spacing={0.75} alignItems="center">
        <Box
          sx={{
            width: 25,
            height: 25,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            background: "rgba(76, 185, 190, 0.10)",
            color: "#23858B",
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.64rem",
              lineHeight: 1.1,
              fontWeight: 650,
              color: "#78909C",
              textTransform: "uppercase",
              letterSpacing: "0.045em",
            }}
          >
            {label}
          </Typography>

          <Typography
            noWrap
            sx={{
              mt: 0.35,
              fontSize: "0.78rem",
              lineHeight: 1.2,
              fontWeight: 750,
              color: "#263B43",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value || "-"}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

/* ============================================================
   Inventory Card
============================================================ */

const InventoryCard = ({
  inventory,
  onView,
  onEdit,
  onDelete,
  onUpdateStock,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (!inventory) return null;

  const productName =
    inventory.product?.name || "Unknown Product";

  const sku = inventory.product?.sku || "-";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: -5,
            }
      }
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Card
        elevation={0}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",

          overflow: "hidden",

          borderRadius: {
            xs: "16px",
            sm: "18px",
            md: "20px",
          },

          border: "1px solid rgba(148, 190, 199, 0.22)",

          background:
            "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(249,253,253,0.98) 100%)",

          boxShadow:
            "0 8px 28px rgba(36, 89, 99, 0.07)",

          transition:
            "box-shadow .3s ease, border-color .3s ease, background-color .3s ease",

          "&:hover": {
            borderColor: "rgba(76, 185, 190, 0.38)",
            boxShadow:
              "0 18px 42px rgba(36, 89, 99, 0.12)",
          },

          /* Top blue accent */
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,

            background:
              "linear-gradient(90deg, #54BFC3 0%, #77D3D5 50%, #A4E4E3 100%)",

            zIndex: 3,
          },

          /* Soft background glow */
          "&::after": {
            content: '""',
            position: "absolute",

            top: -90,
            right: -80,

            width: 220,
            height: 220,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(84,191,195,0.10) 0%, rgba(84,191,195,0.035) 42%, transparent 72%)",

            pointerEvents: "none",
          },
        }}
      >
        <CardContent
          sx={{
            position: "relative",
            zIndex: 1,

            p: {
              xs: 1.75,
              sm: 2,
              md: 2.25,
            },

            "&:last-child": {
              pb: {
                xs: 1.75,
                sm: 2,
                md: 2.25,
              },
            },
          }}
        >
          {/* ==================================================
              Header
          ================================================== */}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={1.5}
          >
            <Stack
              direction="row"
              spacing={1.15}
              alignItems="center"
              minWidth={0}
              flex={1}
            >
              {/* Animated inventory icon */}

              <motion.div
                variants={iconVariants}
                initial="rest"
                whileHover="hover"
                style={{
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: 38,
                      sm: 42,
                    },

                    height: {
                      xs: 38,
                      sm: 42,
                    },

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    borderRadius: "12px",

                    background:
                      "linear-gradient(135deg, rgba(84,191,195,0.15), rgba(235,249,249,0.9))",

                    border:
                      "1px solid rgba(84,191,195,0.22)",

                    color: "#23858B",

                    boxShadow:
                      "0 5px 15px rgba(84,191,195,0.10)",
                  }}
                >
                  <Inventory2OutlinedIcon
                    sx={{
                      fontSize: {
                        xs: 20,
                        sm: 22,
                      },
                    }}
                  />
                </Box>
              </motion.div>

              {/* Product information */}

              <Box minWidth={0}>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "0.92rem",
                      sm: "0.98rem",
                      md: "1rem",
                    },

                    lineHeight: 1.25,

                    fontWeight: 800,

                    color: "#21363D",

                    letterSpacing: "-0.015em",

                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {productName}
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.6}
                  alignItems="center"
                  sx={{ mt: 0.45 }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.66rem",
                      fontWeight: 700,
                      color: "#82969D",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    SKU
                  </Typography>

                  <Typography
                    noWrap
                    sx={{
                      maxWidth: 130,
                      fontSize: "0.72rem",
                      fontWeight: 650,
                      color: "#526A72",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {sku}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            {/* Stock badge */}

            <Box sx={{ flexShrink: 0 }}>
              <StockBadge
                status={inventory.status}
                currentStock={inventory.current_stock}
                minimumStock={inventory.minimum_stock}
                maximumStock={inventory.maximum_stock}
              />
            </Box>
          </Stack>

          <Divider
            sx={{
              my: {
                xs: 1.75,
                sm: 2,
              },

              borderColor: "rgba(148,190,199,0.18)",
            }}
          />

          {/* ==================================================
              Stock Information
          ================================================== */}

          <Grid
            container
            spacing={{
              xs: 0.8,
              sm: 1,
            }}
          >
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  position: "relative",
                  px: 1.1,
                  py: 1,
                  minHeight: 65,

                  borderRadius: "11px",

                  background:
                    "linear-gradient(135deg, rgba(84,191,195,0.12), rgba(255,255,255,0.9))",

                  border:
                    "1px solid rgba(84,191,195,0.20)",

                  overflow: "hidden",

                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: 50,
                    height: 50,
                    right: -20,
                    bottom: -22,
                    borderRadius: "50%",
                    background:
                      "rgba(84,191,195,0.08)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: "#78909C",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Current
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.45}
                  alignItems="center"
                  sx={{ mt: 0.5 }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "1.05rem",
                        sm: "1.15rem",
                      },

                      fontWeight: 850,
                      color: "#237F85",
                    }}
                  >
                    {inventory.current_stock}
                  </Typography>

                  <motion.div
                    variants={statusDotVariants}
                    initial="initial"
                    animate={shouldReduceMotion ? "initial" : "animate"}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#54BFC3",
                      }}
                    />
                  </motion.div>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  px: 1.1,
                  py: 1,
                  minHeight: 65,
                  borderRadius: "11px",
                  bgcolor: "rgba(248,251,252,0.85)",
                  border:
                    "1px solid rgba(148,190,199,0.15)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: "#78909C",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Minimum
                </Typography>

                <Typography
                  sx={{
                    mt: 0.55,
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    color: "#344D55",
                  }}
                >
                  {inventory.minimum_stock}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  px: 1.1,
                  py: 1,
                  minHeight: 65,
                  borderRadius: "11px",
                  bgcolor: "rgba(248,251,252,0.85)",
                  border:
                    "1px solid rgba(148,190,199,0.15)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: "#78909C",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Maximum
                </Typography>

                <Typography
                  sx={{
                    mt: 0.55,
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    color: "#344D55",
                  }}
                >
                  {inventory.maximum_stock}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  px: 1.1,
                  py: 1,
                  minHeight: 65,
                  borderRadius: "11px",
                  bgcolor:
                    "rgba(251,248,241,0.72)",
                  border:
                    "1px solid rgba(194,177,142,0.16)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: "#8C8170",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Safety
                </Typography>

                <Typography
                  sx={{
                    mt: 0.55,
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    color: "#5F5548",
                  }}
                >
                  {inventory.safety_stock}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider
            sx={{
              my: {
                xs: 1.75,
                sm: 2,
              },

              borderColor: "rgba(148,190,199,0.18)",
            }}
          />

          {/* ==================================================
              Warehouse / Supplier
          ================================================== */}

          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <InfoItem
                icon={
                  <WarehouseOutlinedIcon
                    sx={{ fontSize: 15 }}
                  />
                }
                label="Warehouse"
                value={inventory.warehouse || "-"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InfoItem
                icon={
                  <LocalShippingOutlinedIcon
                    sx={{ fontSize: 15 }}
                  />
                }
                label="Supplier"
                value={inventory.supplier || "-"}
              />
            </Grid>
          </Grid>

          <Divider
            sx={{
              my: {
                xs: 1.75,
                sm: 2,
              },

              borderColor: "rgba(148,190,199,0.18)",
            }}
          />

          {/* ==================================================
              Actions
          ================================================== */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={0.8}
          >
            <Tooltip title="View inventory details">
              <Button
                fullWidth
                variant="contained"
                startIcon={
                  <VisibilityOutlinedIcon
                    sx={{ fontSize: 17 }}
                  />
                }
                onClick={() => onView(inventory)}
                sx={{
                  minHeight: {
                    xs: 42,
                    sm: 40,
                  },

                  borderRadius: "10px",

                  textTransform: "none",

                  fontSize: "0.76rem",

                  fontWeight: 750,

                  color: "#155E63",

                  background:
                    "linear-gradient(135deg, #CBEDEF 0%, #B5E3E5 100%)",

                  boxShadow:
                    "0 5px 14px rgba(84,191,195,0.14)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #B8E4E6 0%, #9ED8DA 100%)",

                    boxShadow:
                      "0 8px 18px rgba(84,191,195,0.20)",

                    transform: {
                      xs: "none",
                      sm: "translateY(-1px)",
                    },
                  },

                  "&:active": {
                    transform: "scale(0.98)",
                  },

                  transition:
                    "transform .2s ease, box-shadow .2s ease, background .2s ease",
                }}
              >
                View
              </Button>
            </Tooltip>

            <Tooltip title="Edit inventory">
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <EditOutlinedIcon
                    sx={{ fontSize: 17 }}
                  />
                }
                onClick={() => onEdit(inventory)}
                sx={{
                  minHeight: {
                    xs: 42,
                    sm: 40,
                  },

                  borderRadius: "10px",

                  textTransform: "none",

                  fontSize: "0.76rem",

                  fontWeight: 750,

                  color: "#27777D",

                  borderColor:
                    "rgba(84,191,195,0.35)",

                  background:
                    "rgba(255,255,255,0.72)",

                  "&:hover": {
                    borderColor: "#54BFC3",
                    background:
                      "rgba(231,248,249,0.85)",

                    transform: {
                      xs: "none",
                      sm: "translateY(-1px)",
                    },
                  },

                  "&:active": {
                    transform: "scale(0.98)",
                  },

                  transition:
                    "transform .2s ease, background .2s ease, border-color .2s ease",
                }}
              >
                Edit
              </Button>
            </Tooltip>

            <Tooltip title="Update stock quantity">
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <Inventory2OutlinedIcon
                    sx={{ fontSize: 17 }}
                  />
                }
                onClick={() => onUpdateStock(inventory)}
                sx={{
                  minHeight: {
                    xs: 42,
                    sm: 40,
                  },

                  borderRadius: "10px",

                  textTransform: "none",

                  fontSize: "0.76rem",

                  fontWeight: 750,

                  color: "#4C746E",

                  borderColor:
                    "rgba(106,165,153,0.32)",

                  background:
                    "rgba(249,253,251,0.82)",

                  "&:hover": {
                    borderColor:
                      "rgba(106,165,153,0.55)",

                    background:
                      "rgba(235,247,243,0.95)",

                    transform: {
                      xs: "none",
                      sm: "translateY(-1px)",
                    },
                  },

                  "&:active": {
                    transform: "scale(0.98)",
                  },

                  transition:
                    "transform .2s ease, background .2s ease, border-color .2s ease",
                }}
              >
                Stock
              </Button>
            </Tooltip>

            <Tooltip title="Delete inventory">
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <DeleteOutlineOutlinedIcon
                    sx={{ fontSize: 17 }}
                  />
                }
                onClick={() => onDelete(inventory)}
                sx={{
                  minHeight: {
                    xs: 42,
                    sm: 40,
                  },

                  borderRadius: "10px",

                  textTransform: "none",

                  fontSize: "0.76rem",

                  fontWeight: 750,

                  color: "#A76565",

                  borderColor:
                    "rgba(190,128,128,0.28)",

                  background:
                    "rgba(255,251,250,0.82)",

                  "&:hover": {
                    borderColor:
                      "rgba(190,128,128,0.48)",

                    background:
                      "rgba(253,241,240,0.95)",

                    transform: {
                      xs: "none",
                      sm: "translateY(-1px)",
                    },
                  },

                  "&:active": {
                    transform: "scale(0.98)",
                  },

                  transition:
                    "transform .2s ease, background .2s ease, border-color .2s ease",
                }}
              >
                Delete
              </Button>
            </Tooltip>
          </Stack>

          {/* Small visual inventory hint */}

          <Stack
            direction="row"
            spacing={0.55}
            alignItems="center"
            justifyContent="center"
            sx={{
              mt: 1.25,
              opacity: 0.7,
            }}
          >
            <TrendingUpRoundedIcon
              sx={{
                fontSize: 13,
                color: "#54AEB2",
              }}
            />

            <Typography
              sx={{
                fontSize: "0.61rem",
                fontWeight: 650,
                color: "#78909C",
              }}
            >
              Inventory intelligence
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* ============================================================
   PropTypes
============================================================ */

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
