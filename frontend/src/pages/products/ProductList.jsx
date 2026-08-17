// src/pages/products/ProductList.jsx
// Updated Product List UI
// Backend/API logic preserved.
// UI: responsive, animated, compact, HCI-focused, sea-water blue + white + subtle beige.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { motion, AnimatePresence } from "framer-motion";

import {
  deleteProduct,
  getProducts,
} from "../../services/productApi";

import {
  PrimaryButton,
  FormField,
} from "../../components/ui";

/* ============================================================
   Constants
============================================================ */

const PAGE_SIZE = 10;

const COLORS = {
  sea: "#2F9FC0",
  seaDark: "#247F9B",
  seaLight: "#EAF7FB",
  seaSoft: "#F3FBFD",
  border: "#DCEFF4",
  beige: "#F8F5EE",
  text: "#17323D",
  muted: "#6D8188",
  green: "#2E9B70",
  greenSoft: "#EAF7F1",
  amber: "#D89128",
  amberSoft: "#FFF5E5",
  red: "#D65B5B",
  redSoft: "#FFF0F0",
  white: "#FFFFFF",
};

const CATEGORIES = [
  "All",
  "Dairy & Eggs",
  "Beverages",
  "Snacks & Confectionery",
  "Grains & Pulses",
  "Fruits & Vegetables",
  "Bakery",
  "Frozen Foods",
  "Personal Care",
  "Household Cleaning",
  "Health & Wellness",
  "Baby Products",
  "Other",
];

/* ============================================================
   Helpers
============================================================ */

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n ?? 0);

function stockStatus(product) {
  const stock = product.current_stock ?? 0;
  const reorder = product.reorder_level ?? 10;
  const safety = product.safety_stock ?? 20;

  if (stock === 0) {
    return {
      label: "Out of stock",
      color: "error",
      bg: COLORS.redSoft,
      text: COLORS.red,
    };
  }

  if (stock <= reorder) {
    return {
      label: "Critical",
      color: "error",
      bg: COLORS.redSoft,
      text: COLORS.red,
    };
  }

  if (stock <= safety) {
    return {
      label: "Low stock",
      color: "warning",
      bg: COLORS.amberSoft,
      text: COLORS.amber,
    };
  }

  return {
    label: "In stock",
    color: "success",
    bg: COLORS.greenSoft,
    text: COLORS.green,
  };
}

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "PR"
  );
}

function getMargin(product) {
  if (!product?.selling_price || product.selling_price <= 0) {
    return "0.0";
  }

  return (
    ((product.selling_price - (product.cost_price ?? 0)) /
      product.selling_price) *
    100
  ).toFixed(1);
}

/* ============================================================
   Animation
============================================================ */

const pageVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const rowVariants = {
  hidden: {
    opacity: 0,
    y: 7,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: {
      duration: 0.2,
    },
  },
};

/* ============================================================
   Loading Skeleton
============================================================ */

function SkeletonRow() {
  return (
    <TableRow>
      {[170, 100, 130, 90, 90, 70, 70, 100, 100].map(
        (width, index) => (
          <TableCell key={index}>
            <Skeleton
              variant="rounded"
              width={width}
              height={20}
              animation="wave"
            />
          </TableCell>
        )
      )}
    </TableRow>
  );
}

function SkeletonCard() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "16px",
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Skeleton
          variant="rounded"
          width={46}
          height={46}
          animation="wave"
          sx={{ borderRadius: "12px" }}
        />

        <Box sx={{ flex: 1 }}>
          <Skeleton width="65%" height={18} />
          <Skeleton width="40%" height={15} />
        </Box>

        <Skeleton
          width={70}
          height={24}
          variant="rounded"
        />
      </Stack>

      <Divider sx={{ my: 1.75 }} />

      <Grid container spacing={1}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={6} key={item}>
            <Skeleton
              height={48}
              variant="rounded"
              animation="wave"
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

/* ============================================================
   Empty State
============================================================ */

function EmptyState({ hasSearch, onAdd }) {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        px: 2,
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "18px",
            bgcolor: COLORS.seaLight,
            color: COLORS.sea,
          }}
        >
          <InventoryIcon sx={{ fontSize: 30 }} />
        </Box>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1rem",
            color: COLORS.text,
            mb: 0.6,
          }}
        >
          {hasSearch
            ? "No matching products"
            : "Your product list is empty"}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.8rem",
            color: COLORS.muted,
            maxWidth: 360,
            mx: "auto",
            mb: 2.5,
          }}
        >
          {hasSearch
            ? "Try another search or category."
            : "Add a product to start managing your catalogue."}
        </Typography>

        {!hasSearch && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={primaryButtonSx}
          >
            Add Product
          </Button>
        )}
      </motion.div>
    </Box>
  );
}

/* ============================================================
   Delete Dialog
============================================================ */

function DeleteDialog({
  open,
  product,
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
          borderRadius: "20px",
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 24px 70px rgba(28, 72, 84, 0.18)",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
          fontWeight: 800,
          fontSize: "1.05rem",
          color: COLORS.text,
        }}
      >
        Delete product?
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: "12px",
              bgcolor: COLORS.redSoft,
              color: COLORS.red,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningAmberIcon fontSize="small" />
          </Box>

          <Typography
            sx={{
              fontSize: "0.82rem",
              lineHeight: 1.6,
              color: COLORS.muted,
            }}
          >
            <Box
              component="span"
              sx={{
                fontWeight: 800,
                color: COLORS.text,
              }}
            >
              {product?.name}
            </Box>{" "}
            will be permanently removed. This action cannot be undone.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={secondaryButtonSx}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          sx={{
            ...primaryButtonSx,
            bgcolor: COLORS.red,
            boxShadow: "0 7px 18px rgba(214,91,91,0.18)",
            "&:hover": {
              bgcolor: "#C84C4C",
              boxShadow: "0 10px 24px rgba(214,91,91,0.25)",
            },
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ============================================================
   Product Card — Mobile / Tablet
============================================================ */

function ProductCard({
  product,
  onEdit,
  onDelete,
  onView,
}) {
  const status = stockStatus(product);
  const margin = getMargin(product);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      whileHover={{
        y: -3,
        transition: { duration: 0.2 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 1.75, sm: 2 },
          borderRadius: "17px",
          border: `1px solid ${COLORS.border}`,
          background:
            "linear-gradient(145deg, #FFFFFF 0%, #FBFEFF 100%)",
          boxShadow: "0 5px 20px rgba(43, 101, 118, 0.055)",
          transition:
            "box-shadow .25s ease, border-color .25s ease",
          "&:hover": {
            borderColor: "#B8DFE9",
            boxShadow:
              "0 12px 32px rgba(43, 101, 118, 0.10)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: -55,
            right: -45,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(74,180,207,0.12), transparent 68%)",
            pointerEvents: "none",
          },
        }}
      >
        {/* Product heading */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ position: "relative" }}
        >
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{ minWidth: 0 }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 45,
                height: 45,
                flexShrink: 0,
                borderRadius: "12px",
                bgcolor: COLORS.seaLight,
                color: COLORS.seaDark,
                fontWeight: 800,
                fontSize: "0.78rem",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              {initials(product.name)}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 800,
                  fontSize: "0.87rem",
                  color: COLORS.text,
                  maxWidth: {
                    xs: 170,
                    sm: 250,
                  },
                }}
              >
                {product.name}
              </Typography>

              <Typography
                noWrap
                sx={{
                  mt: 0.25,
                  fontSize: "0.7rem",
                  color: COLORS.muted,
                  maxWidth: {
                    xs: 190,
                    sm: 280,
                  },
                }}
              >
                {product.sku || "No SKU"}{" "}
                {product.category
                  ? `· ${product.category}`
                  : ""}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={status.label}
            size="small"
            sx={{
              height: 24,
              flexShrink: 0,
              borderRadius: "7px",
              bgcolor: status.bg,
              color: status.text,
              border: `1px solid ${status.text}22`,
              fontWeight: 800,
              fontSize: "0.66rem",
            }}
          />
        </Stack>

        <Divider sx={{ my: 1.6, borderColor: "#EDF4F6" }} />

        {/* Compact information */}
        <Grid container spacing={1}>
          {[
            {
              label: "Selling",
              value: fmt(product.selling_price),
            },
            {
              label: "Cost",
              value: fmt(product.cost_price),
            },
            {
              label: "Stock",
              value: product.current_stock ?? 0,
            },
            {
              label: "Margin",
              value: `${margin}%`,
            },
          ].map((item) => (
            <Grid item xs={6} key={item.label}>
              <Box
                sx={{
                  p: 1.05,
                  borderRadius: "10px",
                  bgcolor: "#F8FBFC",
                  border: "1px solid #EEF5F7",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    color: COLORS.muted,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.045em",
                  }}
                >
                  {item.label}
                </Typography>

                <Typography
                  noWrap
                  sx={{
                    mt: 0.25,
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color:
                      item.label === "Margin"
                        ? Number(margin) >= 20
                          ? COLORS.green
                          : Number(margin) >= 10
                          ? COLORS.amber
                          : COLORS.red
                        : COLORS.text,
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Actions */}
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ mt: 1.5 }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => onView(product.id)}
            sx={{
              ...secondaryButtonSx,
              flex: 1,
              minWidth: 0,
              height: 36,
              fontSize: "0.72rem",
              "& .MuiButton-startIcon": {
                mr: 0.5,
              },
            }}
          >
            View
          </Button>

          <Button
            size="small"
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            onClick={() => onEdit(product.id)}
            sx={{
              ...primaryButtonSx,
              flex: 1,
              minWidth: 0,
              height: 36,
              fontSize: "0.72rem",
              boxShadow: "none",
              "& .MuiButton-startIcon": {
                mr: 0.5,
              },
            }}
          >
            Edit
          </Button>

          <Tooltip title="Delete product">
            <IconButton
              size="small"
              onClick={() => onDelete(product)}
              sx={{
                width: 36,
                height: 36,
                flexShrink: 0,
                borderRadius: "9px",
                border: `1px solid ${COLORS.red}35`,
                color: COLORS.red,
                transition: "all .2s ease",
                "&:hover": {
                  bgcolor: COLORS.redSoft,
                  transform: "translateY(-1px)",
                },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    </motion.div>
  );
}

/* ============================================================
   Shared Button Styles
============================================================ */

const primaryButtonSx = {
  minHeight: 40,
  px: 2,
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: "0.78rem",
  color: "#fff",
  bgcolor: COLORS.sea,
  boxShadow: "0 6px 17px rgba(47,159,192,0.20)",
  transition:
    "transform .2s ease, box-shadow .2s ease, background-color .2s ease",
  "&:hover": {
    bgcolor: COLORS.seaDark,
    transform: "translateY(-2px)",
    boxShadow:
      "0 10px 24px rgba(47,159,192,0.27)",
  },
  "&:active": {
    transform: "scale(.98)",
  },
};

const secondaryButtonSx = {
  minHeight: 40,
  px: 2,
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 700,
  fontSize: "0.78rem",
  color: COLORS.seaDark,
  borderColor: "#B8DDE7",
  backgroundColor: "#fff",
  transition:
    "all .2s ease",
  "&:hover": {
    borderColor: COLORS.sea,
    bgcolor: COLORS.seaSoft,
    transform: "translateY(-1px)",
  },
};

/* ============================================================
   Main Product List
============================================================ */

export default function ProductList() {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ==========================================================
     Fetch
  ========================================================== */

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      setError(
        "Could not load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ==========================================================
     Filtering
  ========================================================== */

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchCategory =
        category === "All" ||
        product.category === category;

      const matchSearch =
        !q ||
        product.name?.toLowerCase().includes(q) ||
        product.sku?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [products, search, category]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ==========================================================
     Handlers
  ========================================================== */

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategory = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await deleteProduct(deleteTarget.id);

      setProducts((previous) =>
        previous.filter(
          (product) =>
            product.id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
    } catch {
      setError(
        "Delete failed. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ==========================================================
     Render
  ========================================================== */

  return (
    <Box
      component={motion.main}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      sx={{
        width: "100%",
        maxWidth: 1320,
        mx: "auto",
        px: {
          xs: 0.5,
          sm: 1,
          md: 1.5,
        },
        pb: {
          xs: 2,
          md: 3,
        },

        /* subtle page texture */
        position: "relative",

        "&::before": {
          content: '""',
          position: "fixed",
          top: 100,
          right: -180,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(74,180,207,0.07), transparent 70%)",
          pointerEvents: "none",
          zIndex: -1,
        },
      }}
    >
      {/* ======================================================
          Header
      ====================================================== */}

      <motion.div variants={itemVariants}>
        <Box
          sx={{
            mb: {
              xs: 1.75,
              md: 2.25,
            },
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
            spacing={1.5}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
            >
              <Box
                component={motion.div}
                animate={{
                  y: [0, -3, 0],
                  rotate: [0, -2, 0, 2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                sx={{
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: COLORS.seaLight,
                  color: COLORS.seaDark,
                  border: `1px solid ${COLORS.border}`,
                  boxShadow:
                    "0 5px 16px rgba(47,159,192,0.10)",
                }}
              >
                <InventoryIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography
                  component="h1"
                  sx={{
                    fontWeight: 850,
                    fontSize: {
                      xs: "1.2rem",
                      sm: "1.35rem",
                      md: "1.5rem",
                    },
                    lineHeight: 1.15,
                    letterSpacing: "-0.025em",
                    color: COLORS.text,
                  }}
                >
                  Products
                </Typography>

                <Typography
                  sx={{
                    mt: 0.35,
                    fontSize: "0.74rem",
                    color: COLORS.muted,
                  }}
                >
                  {loading
                    ? "Loading catalogue..."
                    : `${filtered.length} product${
                        filtered.length !== 1
                          ? "s"
                          : ""
                      }`}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                navigate("/products/add")
              }
              sx={{
                ...primaryButtonSx,
                minWidth: {
                  xs: "100%",
                  sm: 145,
                },
              }}
            >
              Add Product
            </Button>
          </Stack>
        </Box>
      </motion.div>

      {/* ======================================================
          Error
      ====================================================== */}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
          >
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{
                mb: 1.75,
                borderRadius: "12px",
                fontSize: "0.78rem",
                border: `1px solid ${COLORS.red}30`,
              }}
            >
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================
          Search / Filter Toolbar
      ====================================================== */}

      <motion.div variants={itemVariants}>
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 1.25,
              sm: 1.5,
            },
            mb: 1.75,
            borderRadius: "15px",
            border: `1px solid ${COLORS.border}`,
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #FBFEFF 100%)",
            boxShadow:
              "0 5px 18px rgba(43,101,118,0.045)",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
          >
            <FormField
              fullWidth
              size="small"
              placeholder="Search products, SKU or category..."
              value={search}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        fontSize: 19,
                        color: COLORS.sea,
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  minHeight: 42,
                  borderRadius: "10px",
                  bgcolor: "#fff",
                  fontSize: "0.8rem",
                  transition: "all .2s ease",

                  "& fieldset": {
                    borderColor: "#DDECEF",
                  },

                  "&:hover fieldset": {
                    borderColor: "#A8D4E0",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: COLORS.sea,
                  },

                  "&.Mui-focused": {
                    boxShadow:
                      "0 0 0 3px rgba(47,159,192,0.08)",
                  },
                },
              }}
            />

            <Select
              size="small"
              value={category}
              onChange={handleCategory}
              startAdornment={
                <FilterListIcon
                  sx={{
                    fontSize: 18,
                    color: COLORS.sea,
                    mr: 0.75,
                  }}
                />
              }
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 215,
                },
                minHeight: 42,
                borderRadius: "10px",
                bgcolor: "#fff",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: COLORS.text,

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#DDECEF",
                },

                "&:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#A8D4E0",
                  },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: COLORS.sea,
                  },
              }}
            >
              {CATEGORIES.map((categoryName) => (
                <MenuItem
                  key={categoryName}
                  value={categoryName}
                  sx={{
                    fontSize: "0.8rem",
                  }}
                >
                  {categoryName}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Paper>
      </motion.div>

      {/* ======================================================
          Desktop Table
      ====================================================== */}

      {!isMobile && (
        <motion.div variants={itemVariants}>
          <Fade in timeout={500}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: "17px",
                border: `1px solid ${COLORS.border}`,
                overflow: "hidden",
                backgroundColor: "#fff",
                boxShadow:
                  "0 7px 24px rgba(43,101,118,0.055)",
              }}
            >
              <Table
                size="small"
                sx={{
                  minWidth: 1000,
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "#F5FBFD",
                      "& th": {
                        borderBottom:
                          "1px solid #DDEFF3",
                      },
                    }}
                  >
                    {[
                      "Product",
                      "SKU",
                      "Category",
                      "Selling",
                      "Cost",
                      "Margin",
                      "Stock",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <TableCell
                        key={heading}
                        sx={{
                          py: 1.55,
                          px: 1.5,
                          whiteSpace: "nowrap",
                          fontSize: "0.65rem",
                          fontWeight: 850,
                          letterSpacing: "0.055em",
                          textTransform: "uppercase",
                          color: COLORS.muted,
                        }}
                      >
                        {heading}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    Array.from({ length: 7 }).map(
                      (_, index) => (
                        <SkeletonRow key={index} />
                      )
                    )
                  ) : paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <EmptyState
                          hasSearch={
                            !!search ||
                            category !== "All"
                          }
                          onAdd={() =>
                            navigate(
                              "/products/add"
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map(
                      (product, index) => {
                        const status =
                          stockStatus(product);
                        const margin =
                          getMargin(product);

                        return (
                          <motion.tr
                            key={product.id}
                            component={TableRow}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{
                              delay:
                                index * 0.035,
                              duration: 0.35,
                            }}
                            sx={{
                              cursor: "default",

                              "& td": {
                                py: 1.35,
                                px: 1.5,
                                borderBottom:
                                  "1px solid #EEF5F7",
                              },

                              "&:last-child td": {
                                borderBottom: "none",
                              },

                              "&:hover": {
                                bgcolor: "#F9FCFD",
                              },

                              "&:hover .product-avatar":
                                {
                                  transform:
                                    "scale(1.06) rotate(-2deg)",
                                },
                            }}
                          >
                            {/* Product */}
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={1.25}
                                alignItems="center"
                                sx={{
                                  minWidth: 190,
                                }}
                              >
                                <Avatar
                                  className="product-avatar"
                                  variant="rounded"
                                  sx={{
                                    width: 37,
                                    height: 37,
                                    borderRadius:
                                      "10px",
                                    bgcolor:
                                      COLORS.seaLight,
                                    color:
                                      COLORS.seaDark,
                                    border: `1px solid ${COLORS.border}`,
                                    fontWeight: 800,
                                    fontSize:
                                      "0.72rem",
                                    transition:
                                      "transform .25s ease",
                                  }}
                                >
                                  {initials(
                                    product.name
                                  )}
                                </Avatar>

                                <Box
                                  sx={{
                                    minWidth: 0,
                                  }}
                                >
                                  <Typography
                                    noWrap
                                    sx={{
                                      maxWidth: 210,
                                      fontWeight: 800,
                                      fontSize:
                                        "0.79rem",
                                      color:
                                        COLORS.text,
                                    }}
                                  >
                                    {product.name}
                                  </Typography>

                                  <Typography
                                    sx={{
                                      fontSize:
                                        "0.66rem",
                                      color:
                                        COLORS.muted,
                                      mt: 0.15,
                                    }}
                                  >
                                    Product
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>

                            {/* SKU */}
                            <TableCell>
                              <Typography
                                sx={{
                                  fontFamily:
                                    "monospace",
                                  fontSize:
                                    "0.72rem",
                                  color:
                                    COLORS.muted,
                                }}
                              >
                                {product.sku ||
                                  "—"}
                              </Typography>
                            </TableCell>

                            {/* Category */}
                            <TableCell>
                              <Typography
                                noWrap
                                sx={{
                                  maxWidth: 145,
                                  fontSize:
                                    "0.73rem",
                                  color:
                                    COLORS.muted,
                                }}
                              >
                                {product.category ||
                                  "—"}
                              </Typography>
                            </TableCell>

                            {/* Selling */}
                            <TableCell>
                              <Typography
                                sx={{
                                  fontSize:
                                    "0.77rem",
                                  fontWeight: 800,
                                  color:
                                    COLORS.text,
                                }}
                              >
                                {fmt(
                                  product.selling_price
                                )}
                              </Typography>
                            </TableCell>

                            {/* Cost */}
                            <TableCell>
                              <Typography
                                sx={{
                                  fontSize:
                                    "0.72rem",
                                  color:
                                    COLORS.muted,
                                }}
                              >
                                {fmt(
                                  product.cost_price
                                )}
                              </Typography>
                            </TableCell>

                            {/* Margin */}
                            <TableCell>
                              <Typography
                                sx={{
                                  fontSize:
                                    "0.74rem",
                                  fontWeight: 800,
                                  color:
                                    Number(
                                      margin
                                    ) >= 20
                                      ? COLORS.green
                                      : Number(
                                          margin
                                        ) >= 10
                                      ? COLORS.amber
                                      : COLORS.red,
                                }}
                              >
                                {margin}%
                              </Typography>
                            </TableCell>

                            {/* Stock */}
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={0.6}
                                alignItems="center"
                              >
                                <InventoryIcon
                                  sx={{
                                    fontSize: 15,
                                    color:
                                      status.text,
                                  }}
                                />

                                <Typography
                                  sx={{
                                    fontWeight: 800,
                                    fontSize:
                                      "0.76rem",
                                    color:
                                      status.text,
                                  }}
                                >
                                  {product.current_stock ??
                                    0}
                                </Typography>
                              </Stack>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              <Chip
                                label={
                                  status.label
                                }
                                size="small"
                                sx={{
                                  height: 24,
                                  borderRadius:
                                    "7px",
                                  bgcolor:
                                    status.bg,
                                  color:
                                    status.text,
                                  border: `1px solid ${status.text}22`,
                                  fontWeight: 800,
                                  fontSize:
                                    "0.64rem",
                                }}
                              />
                            </TableCell>

                            {/* Actions */}
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={0.35}
                              >
                                <Tooltip title="View details">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      navigate(
                                        `/products/${product.id}`
                                      )
                                    }
                                    sx={{
                                      width: 31,
                                      height: 31,
                                      borderRadius:
                                        "8px",
                                      color:
                                        COLORS.seaDark,
                                      "&:hover":
                                        {
                                          bgcolor:
                                            COLORS.seaLight,
                                        },
                                    }}
                                  >
                                    <VisibilityOutlinedIcon
                                      sx={{
                                        fontSize:
                                          17,
                                      }}
                                    />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Edit product">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      navigate(
                                        `/products/edit/${product.id}`
                                      )
                                    }
                                    sx={{
                                      width: 31,
                                      height: 31,
                                      borderRadius:
                                        "8px",
                                      color:
                                        COLORS.muted,
                                      "&:hover":
                                        {
                                          bgcolor:
                                            COLORS.seaLight,
                                          color:
                                            COLORS.seaDark,
                                        },
                                    }}
                                  >
                                    <EditOutlinedIcon
                                      sx={{
                                        fontSize:
                                          17,
                                      }}
                                    />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete product">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      setDeleteTarget(
                                        product
                                      )
                                    }
                                    sx={{
                                      width: 31,
                                      height: 31,
                                      borderRadius:
                                        "8px",
                                      color:
                                        COLORS.muted,
                                      "&:hover":
                                        {
                                          bgcolor:
                                            COLORS.redSoft,
                                          color:
                                            COLORS.red,
                                        },
                                    }}
                                  >
                                    <DeleteOutlineIcon
                                      sx={{
                                        fontSize:
                                          17,
                                      }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </motion.tr>
                        );
                      }
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Fade>
        </motion.div>
      )}

      {/* ======================================================
          Mobile / Tablet Cards
      ====================================================== */}

      {isMobile && (
        <Box>
          {loading ? (
            <Stack spacing={1.25}>
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <SkeletonCard key={index} />
                )
              )}
            </Stack>
          ) : paginated.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                borderRadius: "17px",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <EmptyState
                hasSearch={
                  !!search ||
                  category !== "All"
                }
                onAdd={() =>
                  navigate("/products/add")
                }
              />
            </Paper>
          ) : (
            <AnimatePresence mode="popLayout">
              <Stack spacing={1.25}>
                {paginated.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={(id) =>
                      navigate(
                        `/products/${id}`
                      )
                    }
                    onEdit={(id) =>
                      navigate(
                        `/products/edit/${id}`
                      )
                    }
                    onDelete={setDeleteTarget}
                  />
                ))}
              </Stack>
            </AnimatePresence>
          )}
        </Box>
      )}

      {/* ======================================================
          Pagination
      ====================================================== */}

      {!loading && filtered.length > PAGE_SIZE && (
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems="center"
            justifyContent="center"
            spacing={1.25}
            sx={{
              mt: 2.25,
              pb: 1,
            }}
          >
            <Typography
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
                fontSize: "0.7rem",
                color: COLORS.muted,
              }}
            >
              Page {page} of {totalPages}
            </Typography>

            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => {
                setPage(value);

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              shape="rounded"
              size="small"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root":
                  {
                    minWidth: 32,
                    height: 32,
                    borderRadius: "9px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: COLORS.muted,
                  },

                "& .Mui-selected": {
                  bgcolor:
                    `${COLORS.sea} !important`,
                  color:
                    "#fff !important",
                  boxShadow:
                    "0 4px 12px rgba(47,159,192,0.20)",
                },

                "& .MuiPaginationItem-root:hover":
                  {
                    bgcolor:
                      COLORS.seaLight,
                  },
              }}
            />
          </Stack>
        </motion.div>
      )}

      {/* ======================================================
          Delete Dialog
      ====================================================== */}

      <DeleteDialog
        open={!!deleteTarget}
        product={deleteTarget}
        onClose={() =>
          setDeleteTarget(null)
        }
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  );
}
