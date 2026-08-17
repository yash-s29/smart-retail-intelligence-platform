// src/pages/products/ProductDetails.jsx
// GET /products/{id}  →  ProductWithStock schema
// UI enhanced only — existing backend/API logic preserved.

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { PrimaryButton } from "../../components/ui";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocalOfferIcon from "@mui/icons-material/Sell";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";

import { motion } from "framer-motion";
import { deleteProduct, getProduct } from "../../services/productApi";

/* ============================================================
   COLOR SYSTEM
   Light sea-water / blue / soft beige
============================================================ */

const COLORS = {
  primary: "#5B9FD8",
  primaryDark: "#4388C5",
  primarySoft: "#EAF5FC",

  sea: "#73B9D6",
  seaSoft: "#EDF8FB",

  beige: "#F8F5EE",
  beigeDark: "#EEE9DD",

  text: "#243447",
  muted: "#6B7C8F",

  border: "#E3EAF0",

  success: "#39A878",
  successSoft: "#EAF8F1",

  warning: "#D99A3D",
  warningSoft: "#FFF6E7",

  danger: "#D96B72",
  dangerSoft: "#FFF0F1",

  white: "#FFFFFF",
};

/* ============================================================
   Helpers
============================================================ */

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n ?? 0);

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

/* ============================================================
   Stock status
============================================================ */

function stockStatus(product) {
  const stock = product.current_stock ?? 0;
  const reorder = product.reorder_level ?? 10;
  const safety = product.safety_stock ?? 20;

  if (stock === 0) {
    return {
      label: "Out of Stock",
      color: "error",
      pct: 0,
      soft: COLORS.dangerSoft,
      accent: COLORS.danger,
    };
  }

  if (stock <= reorder) {
    return {
      label: "Critical",
      color: "error",
      pct: 15,
      soft: COLORS.dangerSoft,
      accent: COLORS.danger,
    };
  }

  if (stock <= safety) {
    return {
      label: "Low Stock",
      color: "warning",
      pct: 40,
      soft: COLORS.warningSoft,
      accent: COLORS.warning,
    };
  }

  return {
    label: "In Stock",
    color: "success",
    pct: 100,
    soft: COLORS.successSoft,
    accent: COLORS.success,
  };
}

/* ============================================================
   Animation presets
============================================================ */

const pageVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      staggerChildren: 0.07,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const slideRight = {
  hidden: {
    opacity: 0,
    x: -14,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ============================================================
   Reusable Surface
============================================================ */

function Surface({ children, sx = {}, ...props }) {
  return (
    <Card
      elevation={0}
      {...props}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: {
          xs: "16px",
          sm: "18px",
          md: "20px",
        },

        border: `1px solid ${COLORS.border}`,

        background: `
          radial-gradient(
            circle at 100% 0%,
            rgba(115,185,214,0.10),
            transparent 32%
          ),
          ${COLORS.white}
        `,

        boxShadow: "0 6px 24px rgba(43, 73, 94, 0.055)",

        transition:
          "transform .28s ease, box-shadow .28s ease, border-color .28s ease",

        "&:hover": {
          transform: {
            xs: "none",
            md: "translateY(-2px)",
          },

          boxShadow: "0 14px 34px rgba(43, 73, 94, 0.09)",

          borderColor: "rgba(91,159,216,0.30)",
        },

        ...sx,
      }}
    >
      {children}
    </Card>
  );
}

/* ============================================================
   Stat Card
============================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = COLORS.primary,
  soft = COLORS.primarySoft,
}) {
  return (
    <motion.div variants={fadeUp} style={{ height: "100%" }}>
      <Surface
        sx={{
          height: "100%",
          minHeight: {
            xs: 96,
            sm: 104,
          },
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 1.8,
              sm: 2.15,
            },

            "&:last-child": {
              pb: {
                xs: 1.8,
                sm: 2.15,
              },
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              minWidth: 0,
              height: "100%",
            }}
          >
            {/* Icon */}
            <Box
              component={motion.div}
              whileHover={{
                rotate: 8,
                scale: 1.06,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
              sx={{
                width: {
                  xs: 40,
                  sm: 44,
                },

                height: {
                  xs: 40,
                  sm: 44,
                },

                flexShrink: 0,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: "13px",

                background: soft,

                color: accent,

                border: `1px solid ${accent}18`,
              }}
            >
              <Icon
                sx={{
                  fontSize: {
                    xs: 20,
                    sm: 22,
                  },
                }}
              />
            </Box>

            {/* Content */}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: {
                    xs: "0.67rem",
                    sm: "0.70rem",
                  },

                  fontWeight: 700,

                  color: COLORS.muted,

                  textTransform: "uppercase",

                  letterSpacing: "0.055em",

                  mb: 0.3,

                  whiteSpace: "nowrap",

                  overflow: "hidden",

                  textOverflow: "ellipsis",
                }}
              >
                {label}
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.12rem",
                  },

                  lineHeight: 1.2,

                  fontWeight: 800,

                  color: COLORS.text,

                  whiteSpace: "nowrap",

                  overflow: "hidden",

                  textOverflow: "ellipsis",
                }}
              >
                {value}
              </Typography>

              {sub && (
                <Typography
                  sx={{
                    mt: 0.25,

                    fontSize: {
                      xs: "0.68rem",
                      sm: "0.72rem",
                    },

                    color: COLORS.muted,

                    whiteSpace: "nowrap",

                    overflow: "hidden",

                    textOverflow: "ellipsis",
                  }}
                >
                  {sub}
                </Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Surface>
    </motion.div>
  );
}

/* ============================================================
   Info Row
============================================================ */

function InfoRow({ label, value, icon: Icon }) {
  return (
    <Box
      component={motion.div}
      whileHover={{
        x: 2,
      }}
      transition={{
        duration: 0.18,
      }}
      sx={{
        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        gap: 2,

        minHeight: 42,

        py: 0.9,

        borderBottom: `1px solid ${COLORS.border}`,

        "&:last-child": {
          borderBottom: 0,
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          minWidth: 0,
        }}
      >
        {Icon && (
          <Box
            sx={{
              width: 27,
              height: 27,

              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: "8px",

              bgcolor: COLORS.seaSoft,

              color: COLORS.primary,
            }}
          >
            <Icon sx={{ fontSize: 15 }} />
          </Box>
        )}

        <Typography
          sx={{
            fontSize: {
              xs: "0.76rem",
              sm: "0.8rem",
            },

            color: COLORS.muted,

            fontWeight: 600,

            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography
        sx={{
          minWidth: 0,

          maxWidth: "58%",

          textAlign: "right",

          fontSize: {
            xs: "0.76rem",
            sm: "0.8rem",
          },

          color: COLORS.text,

          fontWeight: 700,

          overflow: "hidden",

          textOverflow: "ellipsis",

          whiteSpace: "nowrap",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
}

/* ============================================================
   Section Heading
============================================================ */

function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      sx={{
        mb: 1.7,
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,

          flexShrink: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: "10px",

          bgcolor: COLORS.primarySoft,

          color: COLORS.primary,
        }}
      >
        <Icon sx={{ fontSize: 18 }} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: {
              xs: "0.9rem",
              sm: "0.94rem",
            },

            fontWeight: 800,

            color: COLORS.text,

            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: COLORS.muted,
              mt: 0.25,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

/* ============================================================
   Page Skeleton
============================================================ */

function PageSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1180,
        mx: "auto",
      }}
    >
      <Skeleton
        width={150}
        height={24}
        sx={{
          mb: 1,
        }}
      />

      <Skeleton
        width={280}
        height={36}
        sx={{
          mb: 2.5,
        }}
      />

      <Grid
        container
        spacing={{
          xs: 1.25,
          sm: 1.75,
        }}
        sx={{
          mb: 2,
        }}
      >
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={6} md={3} key={item}>
            <Skeleton
              variant="rounded"
              height={100}
              sx={{
                borderRadius: 3,
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Grid
        container
        spacing={{
          xs: 1.5,
          md: 2,
        }}
      >
        <Grid item xs={12} md={7}>
          <Skeleton
            variant="rounded"
            height={350}
            sx={{
              borderRadius: 3,
            }}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <Skeleton
            variant="rounded"
            height={350}
            sx={{
              borderRadius: 3,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

/* ============================================================
   Delete Dialog
============================================================ */

function DeleteDialog({
  open,
  name,
  onClose,
  onConfirm,
  loading,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: {
            xs: "16px",
            sm: "20px",
          },

          border: `1px solid ${COLORS.border}`,

          boxShadow:
            "0 24px 70px rgba(34, 62, 80, 0.18)",

          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          height: 4,

          background:
            "linear-gradient(90deg, #D96B72, #E8A1A5)",
        }}
      />

      <DialogTitle
        sx={{
          px: {
            xs: 2.5,
            sm: 3,
          },

          pt: 2.5,

          fontSize: "1.05rem",

          fontWeight: 800,

          color: COLORS.text,
        }}
      >
        Delete product?
      </DialogTitle>

      <DialogContent
        sx={{
          px: {
            xs: 2.5,
            sm: 3,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-start"
        >
          <Box
            sx={{
              width: 38,
              height: 38,

              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: "11px",

              bgcolor: COLORS.dangerSoft,

              color: COLORS.danger,
            }}
          >
            <WarningAmberIcon fontSize="small" />
          </Box>

          <Typography
            sx={{
              fontSize: "0.8rem",

              lineHeight: 1.6,

              color: COLORS.muted,
            }}
          >
            <strong>{name}</strong> will be permanently
            deleted along with its inventory and sales
            history. This cannot be undone.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: {
            xs: 2.5,
            sm: 3,
          },

          pb: 2.5,

          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{
            minHeight: 40,

            borderRadius: "10px",

            textTransform: "none",

            fontSize: "0.8rem",

            fontWeight: 700,

            color: COLORS.text,

            borderColor: COLORS.border,

            "&:hover": {
              borderColor: COLORS.primary,
              bgcolor: COLORS.primarySoft,
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{
            minHeight: 40,

            minWidth: 90,

            borderRadius: "10px",

            textTransform: "none",

            fontSize: "0.8rem",

            fontWeight: 700,
          }}
        >
          {loading ? (
            <CircularProgress
              size={17}
              color="inherit"
            />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ============================================================
   Main Product Details Page
============================================================ */

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [delDialog, setDelDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ==========================================================
     Existing API logic — preserved
  ========================================================== */

  useEffect(() => {
    (async () => {
      try {
        const res = await getProduct(id);
        setProduct(res.data);
      } catch {
        setError(
          "Product not found or could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ==========================================================
     Existing delete logic — preserved
  ========================================================== */

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteProduct(id);
      navigate("/products");
    } catch {
      setError("Delete failed. Please try again.");
      setDelDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  /* ==========================================================
     Loading
  ========================================================== */

  if (loading) {
    return <PageSkeleton />;
  }

  /* ==========================================================
     Error
  ========================================================== */

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          mx: "auto",
          py: {
            xs: 3,
            sm: 5,
          },
          px: {
            xs: 1.5,
            sm: 0,
          },
        }}
      >
        <Alert
          severity="error"
          sx={{
            borderRadius: "14px",
          }}
        >
          {error}
        </Alert>

        <Button
          sx={{
            mt: 2,

            borderRadius: "10px",

            textTransform: "none",

            fontWeight: 700,

            color: COLORS.primary,
          }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/products")}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  /* ==========================================================
     Calculations
  ========================================================== */

  const status = stockStatus(product);

  const margin =
    product.selling_price > 0
      ? (
          ((product.selling_price -
            product.cost_price) /
            product.selling_price) *
          100
        ).toFixed(1)
      : "0.0";

  const stockPct =
    product.safety_stock > 0
      ? Math.min(
          100,
          Math.round(
            ((product.current_stock ?? 0) /
              product.safety_stock) *
              100
          )
        )
      : status.pct;

  const profit =
    (product.selling_price ?? 0) -
    (product.cost_price ?? 0);

  /* ==========================================================
     Page
  ========================================================== */

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        sx={{
          width: "100%",

          maxWidth: 1180,

          mx: "auto",

          px: {
            xs: 0,
            sm: 0.5,
          },

          pb: {
            xs: 2,
            md: 3,
          },
        }}
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <motion.div variants={fadeUp}>
          <Box
            sx={{
              position: "relative",

              mb: {
                xs: 2,
                sm: 2.5,
              },

              p: {
                xs: 1.5,
                sm: 2,
              },

              borderRadius: {
                xs: "15px",
                sm: "18px",
              },

              background: `
                radial-gradient(
                  circle at 95% 0%,
                  rgba(115,185,214,0.12),
                  transparent 28%
                ),
                linear-gradient(
                  135deg,
                  rgba(255,255,255,0.96),
                  rgba(248,245,238,0.72)
                )
              `,

              border: `1px solid ${COLORS.border}`,
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              alignItems={{
                xs: "stretch",
                sm: "center",
              }}
              justifyContent="space-between"
              spacing={{
                xs: 1.5,
                sm: 2,
              }}
            >
              {/* Product identity */}

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Button
                  startIcon={
                    <ArrowBackIcon
                      sx={{
                        fontSize: "17px !important",
                      }}
                    />
                  }
                  onClick={() => navigate("/products")}
                  sx={{
                    minHeight: 30,

                    p: 0,

                    mb: 0.5,

                    textTransform: "none",

                    fontSize: "0.75rem",

                    fontWeight: 700,

                    color: COLORS.muted,

                    "&:hover": {
                      color: COLORS.primary,
                      bgcolor: "transparent",
                    },

                    "& .MuiButton-startIcon": {
                      transition:
                        "transform .2s ease",
                    },

                    "&:hover .MuiButton-startIcon": {
                      transform:
                        "translateX(-3px)",
                    },
                  }}
                >
                  Products
                </Button>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    minWidth: 0,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    component="h1"
                    sx={{
                      minWidth: 0,

                      maxWidth: {
                        xs: "100%",
                        sm: "65%",
                      },

                      fontSize: {
                        xs: "1.25rem",
                        sm: "1.45rem",
                        md: "1.65rem",
                      },

                      lineHeight: 1.2,

                      fontWeight: 800,

                      letterSpacing: "-0.025em",

                      color: COLORS.text,

                      overflow: "hidden",

                      textOverflow: "ellipsis",

                      whiteSpace: {
                        xs: "normal",
                        sm: "nowrap",
                      },
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Chip
                    label={status.label}
                    size="small"
                    sx={{
                      height: 25,

                      borderRadius: "8px",

                      bgcolor: status.soft,

                      color: status.accent,

                      border: `1px solid ${status.accent}22`,

                      fontSize: "0.68rem",

                      fontWeight: 800,
                    }}
                  />
                </Stack>

                {(product.category ||
                  product.sku) && (
                  <Stack
                    direction="row"
                    spacing={0.7}
                    alignItems="center"
                    sx={{
                      mt: 0.55,

                      minWidth: 0,
                    }}
                  >
                    <CategoryIcon
                      sx={{
                        fontSize: 14,
                        color: COLORS.muted,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "0.72rem",

                        color: COLORS.muted,

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.category || "Product"}

                      {product.sku
                        ? ` · SKU ${product.sku}`
                        : ""}
                    </Typography>
                  </Stack>
                )}
              </Box>

              {/* Actions */}

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  flexShrink: 0,

                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() =>
                    setDelDialog(true)
                  }
                  sx={{
                    minHeight: 40,

                    minWidth: {
                      sm: 90,
                    },

                    px: 1.6,

                    borderRadius: "10px",

                    textTransform: "none",

                    fontSize: "0.78rem",

                    fontWeight: 700,

                    color: COLORS.danger,

                    borderColor: "#E8C7CA",

                    bgcolor: "#fff",

                    transition:
                      "all .22s ease",

                    "&:hover": {
                      borderColor:
                        COLORS.danger,

                      bgcolor:
                        COLORS.dangerSoft,

                      transform: {
                        xs: "none",
                        sm: "translateY(-1px)",
                      },
                    },
                  }}
                >
                  Delete
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() =>
                    navigate(
                      `/products/edit/${product.id}`
                    )
                  }
                  sx={{
                    minHeight: 40,

                    minWidth: {
                      sm: 130,
                    },

                    px: 1.8,

                    borderRadius: "10px",

                    textTransform: "none",

                    fontSize: "0.78rem",

                    fontWeight: 700,

                    color: "#fff",

                    background: `linear-gradient(
                      135deg,
                      ${COLORS.primary},
                      ${COLORS.sea}
                    )`,

                    boxShadow:
                      "0 6px 16px rgba(91,159,216,0.22)",

                    transition:
                      "all .22s ease",

                    "&:hover": {
                      background: `linear-gradient(
                        135deg,
                        ${COLORS.primaryDark},
                        ${COLORS.primary}
                      )`,

                      boxShadow:
                        "0 9px 22px rgba(91,159,216,0.30)",

                      transform: {
                        xs: "none",
                        sm: "translateY(-2px)",
                      },
                    },

                    "& .MuiButton-startIcon": {
                      transition:
                        "transform .22s ease",
                    },

                    "&:hover .MuiButton-startIcon": {
                      transform:
                        "rotate(-8deg)",
                    },
                  }}
                >
                  Edit Product
                </Button>
              </Stack>
            </Stack>
          </Box>
        </motion.div>

        {/* ====================================================
            STAT CARDS
        ==================================================== */}

        <Grid
          container
          spacing={{
            xs: 1.25,
            sm: 1.5,
            md: 1.75,
          }}
          sx={{
            mb: {
              xs: 1.75,
              sm: 2,
            },
          }}
        >
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={LocalOfferIcon}
              label="Selling Price"
              value={fmt(
                product.selling_price
              )}
              accent={COLORS.primary}
              soft={COLORS.primarySoft}
            />
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={LocalOfferIcon}
              label="Cost Price"
              value={fmt(product.cost_price)}
              accent={COLORS.warning}
              soft={COLORS.warningSoft}
            />
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={TrendingUpIcon}
              label="Gross Margin"
              value={`${margin}%`}
              sub={
                parseFloat(margin) >= 20
                  ? "Healthy margin"
                  : "Review pricing"
              }
              accent={
                parseFloat(margin) >= 20
                  ? COLORS.success
                  : COLORS.warning
              }
              soft={
                parseFloat(margin) >= 20
                  ? COLORS.successSoft
                  : COLORS.warningSoft
              }
            />
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={InventoryIcon}
              label="Current Stock"
              value={`${product.current_stock ?? 0}`}
              sub={`Reorder at ${
                product.reorder_level ?? 10
              }`}
              accent={status.accent}
              soft={status.soft}
            />
          </Grid>
        </Grid>

        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}

        <Grid
          container
          spacing={{
            xs: 1.5,
            md: 2,
          }}
          alignItems="stretch"
        >
          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}

          <Grid item xs={12} md={7}>
            <motion.div
              variants={slideRight}
              style={{
                height: "100%",
              }}
            >
              <Surface
                sx={{
                  height: "100%",
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 2,
                      sm: 2.5,
                      md: 2.75,
                    },

                    "&:last-child": {
                      pb: {
                        xs: 2,
                        sm: 2.5,
                        md: 2.75,
                      },
                    },
                  }}
                >
                  <SectionHeading
                    icon={InventoryIcon}
                    title="Product details"
                    subtitle="Core product information"
                  />

                  <Divider
                    sx={{
                      mb: 0.5,
                      borderColor:
                        COLORS.border,
                    }}
                  />

                  <InfoRow
                    label="Product name"
                    value={product.name}
                  />

                  <InfoRow
                    icon={CategoryIcon}
                    label="Category"
                    value={product.category}
                  />

                  <InfoRow
                    label="SKU"
                    value={product.sku}
                  />

                  <InfoRow
                    label="Selling price"
                    value={fmt(
                      product.selling_price
                    )}
                  />

                  <InfoRow
                    label="Cost price"
                    value={fmt(
                      product.cost_price
                    )}
                  />

                  <InfoRow
                    label="Gross margin"
                    value={`${margin}%`}
                  />

                  <InfoRow
                    icon={CalendarIcon}
                    label="Added on"
                    value={fmtDate(
                      product.created_at
                    )}
                  />
                </CardContent>
              </Surface>
            </motion.div>
          </Grid>

          {/* ==================================================
              INVENTORY + PROFIT
          ================================================== */}

          <Grid item xs={12} md={5}>
            <Stack
              spacing={{
                xs: 1.5,
                md: 2,
              }}
              sx={{
                height: "100%",
              }}
            >
              {/* Inventory */}

              <motion.div variants={fadeUp}>
                <Surface>
                  <CardContent
                    sx={{
                      p: {
                        xs: 2,
                        sm: 2.5,
                      },

                      "&:last-child": {
                        pb: {
                          xs: 2,
                          sm: 2.5,
                        },
                      },
                    }}
                  >
                    <SectionHeading
                      icon={InventoryIcon}
                      title="Inventory status"
                      subtitle="Current stock position"
                    />

                    {/* Stock level */}

                    <Box
                      sx={{
                        p: 1.5,

                        mb: 1.5,

                        borderRadius: "13px",

                        bgcolor:
                          COLORS.beige,

                        border: `1px solid ${COLORS.beigeDark}`,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          mb: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize:
                              "0.76rem",

                            fontWeight: 700,

                            color:
                              COLORS.muted,
                          }}
                        >
                          Stock level
                        </Typography>

                        <Chip
                          label={status.label}
                          size="small"
                          sx={{
                            height: 22,

                            borderRadius: "7px",

                            bgcolor:
                              status.soft,

                            color:
                              status.accent,

                            fontSize:
                              "0.65rem",

                            fontWeight: 800,
                          }}
                        />
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={stockPct}
                        sx={{
                          height: 7,

                          borderRadius: 10,

                          bgcolor: "#E2EAF0",

                          "& .MuiLinearProgress-bar":
                            {
                              borderRadius: 10,

                              background:
                                `linear-gradient(
                                  90deg,
                                  ${status.accent},
                                  ${status.accent}CC
                                )`,
                            },
                        }}
                      />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                          mt: 0.65,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize:
                              "0.65rem",

                            color:
                              COLORS.muted,
                          }}
                        >
                          0
                        </Typography>

                        <Typography
                          sx={{
                            fontSize:
                              "0.65rem",

                            color:
                              COLORS.muted,
                          }}
                        >
                          {product.safety_stock ??
                            20}{" "}
                          safe
                        </Typography>
                      </Stack>
                    </Box>

                    <InfoRow
                      label="Current stock"
                      value={`${product.current_stock ?? 0} units`}
                    />

                    <InfoRow
                      label="Reorder level"
                      value={`${product.reorder_level ?? 10} units`}
                    />

                    <InfoRow
                      label="Safety stock"
                      value={`${product.safety_stock ?? 20} units`}
                    />

                    {(product.current_stock ??
                      0) <=
                      (product.reorder_level ??
                        10) && (
                      <Alert
                        severity="warning"
                        icon={
                          <WarningAmberIcon
                            fontSize="small"
                          />
                        }
                        sx={{
                          mt: 1.5,

                          borderRadius: "11px",

                          fontSize:
                            "0.72rem",

                          bgcolor:
                            COLORS.warningSoft,

                          color:
                            "#8A641F",

                          border:
                            "1px solid #F0D8A8",

                          "& .MuiAlert-icon":
                            {
                              color:
                                COLORS.warning,
                            },
                        }}
                      >
                        Stock is at reorder level.
                        Consider restocking soon.
                      </Alert>
                    )}
                  </CardContent>
                </Surface>
              </motion.div>

              {/* Profit card */}

              <motion.div
                variants={fadeUp}
                style={{
                  flex: 1,
                }}
              >
                <Box
                  component={motion.div}
                  whileHover={{
                    y: -2,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  sx={{
                    position: "relative",

                    height: "100%",

                    minHeight: {
                      xs: 128,
                      md: 140,
                    },

                    overflow: "hidden",

                    borderRadius: {
                      xs: "16px",
                      sm: "18px",
                    },

                    p: {
                      xs: 2,
                      sm: 2.5,
                    },

                    color: COLORS.text,

                    background: `
                      radial-gradient(
                        circle at 90% 15%,
                        rgba(91,159,216,0.20),
                        transparent 34%
                      ),
                      linear-gradient(
                        135deg,
                        #F5FAFD 0%,
                        #FFFFFF 55%,
                        #F8F5EE 100%
                      )
                    `,

                    border:
                      "1px solid rgba(91,159,216,0.18)",

                    boxShadow:
                      "0 8px 25px rgba(72,112,139,0.07)",
                  }}
                >
                  {/* Decorative moving ring */}

                  <Box
                    component={motion.div}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    sx={{
                      position: "absolute",

                      width: 110,
                      height: 110,

                      right: -38,
                      bottom: -52,

                      borderRadius: "50%",

                      border:
                        "1px dashed rgba(91,159,216,0.24)",

                      pointerEvents: "none",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize:
                        "0.68rem",

                      fontWeight: 800,

                      color: COLORS.primary,

                      textTransform:
                        "uppercase",

                      letterSpacing:
                        "0.07em",

                      mb: 0.8,
                    }}
                  >
                    Profit per unit
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "1.45rem",
                        sm: "1.65rem",
                      },

                      lineHeight: 1.1,

                      fontWeight: 900,

                      color: COLORS.text,

                      mb: 0.5,
                    }}
                  >
                    {fmt(profit)}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize:
                        "0.72rem",

                      color: COLORS.muted,

                      position:
                        "relative",

                      zIndex: 1,
                    }}
                  >
                    {margin}% gross margin
                    {" · "}
                    Cost {fmt(
                      product.cost_price
                    )}
                  </Typography>
                </Box>
              </motion.div>
            </Stack>
          </Grid>
        </Grid>

        {/* ====================================================
            DELETE DIALOG
        ==================================================== */}

        <DeleteDialog
          open={delDialog}
          name={product.name}
          onClose={() => setDelDialog(false)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      </Box>
    </motion.div>
  );
}
