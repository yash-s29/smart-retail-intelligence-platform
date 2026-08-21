// src/pages/Inventory/Inventory.jsx

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import { motion, MotionConfig } from "framer-motion";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import InventoryStats from "../../components/Inventory/InventoryStats";
import InventorySearch from "../../components/Inventory/InventorySearch";
import InventoryFilters from "../../components/Inventory/InventoryFilters";
import InventoryTable from "../../components/Inventory/InventoryTable";
import DeleteInventoryModal from "../../components/Inventory/DeleteInventoryModal";
import UpdateStockModal from "../../components/Inventory/UpdateStockModal";

import {
  fetchInventory,
  deleteInventory,
  updateInventory,
} from "../../redux/slices/inventorySlice";

import {
  COLORS,
  containerVariants,
  itemVariants,
  cardHoverSx,
  pageBackdropSx,
  panelSx,
  topAccentSx,
  actionButtonSx,
  primaryButtonSx,
  iconBadgeSx,
} from "./inventory.theme";


// ==========================================================
// Motion Components
// ==========================================================

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);


// ==========================================================
// Inventory Page
// ==========================================================

const Inventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================================
  // Redux State
  // ==========================================================

  const inventoryState = useSelector(
    (state) => state.inventory
  );

  const inventory = inventoryState?.inventory || [];
  const loading = Boolean(inventoryState?.loading);
  const error = inventoryState?.error || null;


  // ==========================================================
  // Local State
  // ==========================================================

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    warehouse: "",
    supplier: "",
    status: "",
  });

  const [selectedInventory, setSelectedInventory] =
    useState(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [stockOpen, setStockOpen] =
    useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  // ==========================================================
  // Initial Load
  // ==========================================================

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);


  // ==========================================================
  // Snackbar Helper
  // ==========================================================

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      severity,
      message,
    });
  };


  const closeSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };


  // ==========================================================
  // Refresh Inventory
  // ==========================================================

  const handleRefresh = async () => {
    try {
      await dispatch(fetchInventory()).unwrap();

      showSnackbar(
        "Inventory refreshed successfully.",
        "success"
      );
    } catch (refreshError) {
      console.error(
        "Failed to refresh inventory:",
        refreshError
      );

      showSnackbar(
        refreshError?.message ||
          "Unable to refresh inventory.",
        "error"
      );
    }
  };


  // ==========================================================
  // Statistics
  // ==========================================================

  const stats = useMemo(() => {
    const totalProducts = inventory.length;

    const inStock = inventory.filter(
      (item) =>
        item?.status === "In Stock"
    ).length;

    const lowStock = inventory.filter(
      (item) =>
        item?.status === "Low Stock"
    ).length;

    const outOfStock = inventory.filter(
      (item) =>
        item?.status === "Out of Stock"
    ).length;

    return {
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [inventory]);


  // ==========================================================
  // Filter Inventory
  // ==========================================================

  const filteredInventory = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return inventory.filter((item) => {
      const productName =
        item?.product?.name
          ?.toLowerCase() || "";

      const productSku =
        item?.product?.sku
          ?.toLowerCase() || "";

      const supplier =
        item?.supplier
          ?.toLowerCase() || "";

      const warehouse =
        item?.warehouse
          ?.toLowerCase() || "";

      const status =
        item?.status
          ?.toLowerCase() || "";

      const matchesSearch =
        !keyword ||
        productName.includes(keyword) ||
        productSku.includes(keyword) ||
        supplier.includes(keyword) ||
        warehouse.includes(keyword) ||
        status.includes(keyword);

      const matchesWarehouse =
        !filters.warehouse ||
        item?.warehouse === filters.warehouse;

      const matchesSupplier =
        !filters.supplier ||
        item?.supplier === filters.supplier;

      const matchesStatus =
        !filters.status ||
        item?.status === filters.status;

      return (
        matchesSearch &&
        matchesWarehouse &&
        matchesSupplier &&
        matchesStatus
      );
    });
  }, [
    inventory,
    search,
    filters,
  ]);


  // ==========================================================
  // Dropdown Data
  // ==========================================================

  const warehouses = useMemo(() => {
    return [
      ...new Set(
        inventory
          .map((item) => item?.warehouse)
          .filter(Boolean)
      ),
    ];
  }, [inventory]);


  const suppliers = useMemo(() => {
    return [
      ...new Set(
        inventory
          .map((item) => item?.supplier)
          .filter(Boolean)
      ),
    ];
  }, [inventory]);


  // ==========================================================
  // Active Filters
  // ==========================================================

  const hasActiveFilters =
    Boolean(
      search.trim() ||
      filters.warehouse ||
      filters.supplier ||
      filters.status
    );


  // ==========================================================
  // Clear Filters
  // ==========================================================

  const handleClearFilters = () => {
    setSearch("");

    setFilters({
      warehouse: "",
      supplier: "",
      status: "",
    });
  };


  // ==========================================================
  // Delete Inventory
  // ==========================================================

  const handleDelete = async () => {
    if (!selectedInventory?.id) {
      return;
    }

    try {
      await dispatch(
        deleteInventory(
          selectedInventory.id
        )
      ).unwrap();

      setDeleteOpen(false);
      setSelectedInventory(null);

      await dispatch(
        fetchInventory()
      ).unwrap();

      showSnackbar(
        "Inventory item deleted successfully.",
        "success"
      );
    } catch (deleteError) {
      console.error(
        "Failed to delete inventory:",
        deleteError
      );

      showSnackbar(
        deleteError?.message ||
          "Unable to delete inventory item.",
        "error"
      );
    }
  };


  // ==========================================================
  // Update Stock
  // ==========================================================

  const handleStockUpdate = async (
    quantity
  ) => {
    if (!selectedInventory?.id) {
      return;
    }

    try {
      await dispatch(
        updateInventory({
          id: selectedInventory.id,

          inventoryData: {
            current_stock: Number(quantity),
          },
        })
      ).unwrap();

      setStockOpen(false);
      setSelectedInventory(null);

      await dispatch(
        fetchInventory()
      ).unwrap();

      showSnackbar(
        "Stock quantity updated successfully.",
        "success"
      );
    } catch (stockError) {
      console.error(
        "Failed to update stock:",
        stockError
      );

      showSnackbar(
        stockError?.message ||
          "Unable to update stock quantity.",
        "error"
      );
    }
  };


  // ==========================================================
  // Shared Button Styles
  // ==========================================================

  const secondaryButtonSx = {
    ...actionButtonSx,

    minWidth: {
      xs: "100%",
      sm: 132,
    },

    color: COLORS.primary,

    borderColor: COLORS.border,

    backgroundColor: COLORS.white,

    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: COLORS.primary,
      backgroundColor: COLORS.aquaSoft,
    },

    "&:focus-visible": {
      outline: `3px solid ${COLORS.aqua}`,
      outlineOffset: 2,
    },

    "&:disabled": {
      opacity: 0.6,
    },
  };


  const addButtonSx = {
    ...primaryButtonSx,

    minWidth: {
      xs: "100%",
      sm: 165,
    },

    height: 44,

    "&:focus-visible": {
      outline: `3px solid ${COLORS.aqua}`,
      outlineOffset: 2,
    },
  };


  // ==========================================================
  // Render
  // ==========================================================

  return (
    <MotionConfig reducedMotion="user">

      <Box
        sx={{
          minHeight: "100%",
          ...pageBackdropSx,
        }}
      >

        <Container
          maxWidth="xl"
          sx={{
            py: {
              xs: 2,
              sm: 3,
              md: 4,
              lg: 5,
            },

            px: {
              xs: 1.5,
              sm: 2,
              md: 3,
            },
          }}
        >

          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <MotionBox
              variants={itemVariants}
              sx={{
                mb: {
                  xs: 2.5,
                  sm: 3,
                  md: 4,
                },
              }}
            >

              <Paper
                elevation={0}
                sx={{
                  ...panelSx,

                  p: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                    lg: 3.5,
                  },
                }}
              >

                <Box sx={topAccentSx} />

                <Stack
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "stretch",
                    md: "center",
                  }}
                  spacing={{
                    xs: 2.5,
                    md: 3,
                  }}
                >

                  {/* ==================================================
                      TITLE
                  ================================================== */}

                  <Stack
                    direction="row"
                    spacing={{
                      xs: 1.5,
                      sm: 2,
                    }}
                    alignItems="center"
                    minWidth={0}
                  >

                    <MotionBox
                      animate={{
                        y: [0, -3, 0],
                        rotate: [
                          0,
                          1.5,
                          0,
                          -1.5,
                          0,
                        ],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      sx={iconBadgeSx(52)}
                    >

                      <Inventory2RoundedIcon
                        sx={{
                          fontSize: {
                            xs: 25,
                            sm: 28,
                          },
                        }}
                      />

                    </MotionBox>


                    <Box minWidth={0}>

                      <Typography
                        component="h1"
                        fontWeight={800}
                        sx={{
                          color: COLORS.ink,

                          fontSize: {
                            xs: "1.65rem",
                            sm: "1.95rem",
                            md: "2.25rem",
                          },

                          lineHeight: 1.15,

                          letterSpacing:
                            "-0.02em",
                        }}
                      >
                        Inventory
                      </Typography>


                      <Typography
                        color="text.secondary"
                        sx={{
                          mt: 0.7,

                          fontSize: {
                            xs: ".82rem",
                            sm: ".9rem",
                            md: ".95rem",
                          },

                          lineHeight: 1.6,

                          maxWidth: 700,
                        }}
                      >
                        Manage products,
                        warehouses,
                        suppliers, stock
                        levels and inventory
                        availability from one
                        centralized workspace.
                      </Typography>

                    </Box>

                  </Stack>


                  {/* ==================================================
                      HEADER ACTIONS
                  ================================================== */}

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={1.25}
                    sx={{
                      width: {
                        xs: "100%",
                        md: "auto",
                      },
                    }}
                  >

                    <Button
                      variant="outlined"
                      startIcon={
                        <RefreshRoundedIcon />
                      }
                      onClick={handleRefresh}
                      disabled={loading}
                      fullWidth
                      sx={{
                        ...secondaryButtonSx,

                        width: {
                          xs: "100%",
                          sm: "auto",
                        },
                      }}
                    >
                      Refresh
                    </Button>


                    <Button
                      variant="contained"
                      startIcon={
                        <AddRoundedIcon />
                      }
                      onClick={() =>
                        navigate(
                          "/inventory/add"
                        )
                      }
                      fullWidth
                      sx={{
                        ...addButtonSx,

                        width: {
                          xs: "100%",
                          sm: "auto",
                        },
                      }}
                    >
                      Add Inventory
                    </Button>

                  </Stack>

                </Stack>

              </Paper>

            </MotionBox>


            {/* ==================================================
                ERROR ALERT
            ================================================== */}

            {error && (
              <MotionBox
                variants={itemVariants}
                sx={{
                  mb: 3,
                }}
              >

                <Alert
                  severity="error"
                  icon={
                    <WarningAmberRoundedIcon />
                  }
                  sx={{
                    borderRadius: 2.5,

                    border: `1px solid ${COLORS.errorSoft}`,

                    backgroundColor:
                      COLORS.errorSoft,

                    color: COLORS.error,

                    "& .MuiAlert-icon": {
                      color: COLORS.error,
                    },
                  }}
                >

                  {typeof error === "string"
                    ? error
                    : error?.message ||
                      "Unable to load inventory. Please try again."}

                </Alert>

              </MotionBox>
            )}


            {/* ==================================================
                MAIN INVENTORY PANEL
            ================================================== */}

            <MotionPaper
              variants={itemVariants}
              elevation={0}
              sx={{
                ...panelSx,

                p: {
                  xs: 1.5,
                  sm: 2,
                  md: 3,
                  lg: 3.5,
                },
              }}
            >

              <Box sx={topAccentSx} />


              {/* ==================================================
                  STATISTICS
              ================================================== */}

              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                }}
              >

                <InventoryStats
                  stats={stats}
                  loading={loading}
                />

              </Box>


              <Divider
                sx={{
                  my: {
                    xs: 2.5,
                    sm: 3,
                  },

                  borderColor:
                    COLORS.border,
                }}
              />


              {/* ==================================================
                  SEARCH + FILTER SECTION
              ================================================== */}

              <Box>

                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  sx={{
                    color: COLORS.ink,
                    mb: 1.5,
                  }}
                >
                  Inventory Records
                </Typography>


                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2.5,
                    lineHeight: 1.6,
                  }}
                >
                  Search and filter inventory
                  records by product, SKU,
                  warehouse, supplier or
                  stock status.
                </Typography>


                {/* ==================================================
                    SEARCH
                ================================================== */}

                <Paper
                  elevation={0}
                  sx={{
                    p: {
                      xs: 1.25,
                      sm: 1.5,
                    },

                    mb: 2,

                    borderRadius: 2.5,

                    background:
                      COLORS.aquaPale,

                    border:
                      `1px solid ${COLORS.border}`,

                    ...cardHoverSx,
                  }}
                >

                  <InventorySearch
                    value={search}
                    loading={loading}
                    onSearch={setSearch}
                  />

                </Paper>


                {/* ==================================================
                    FILTERS
                ================================================== */}

                <Paper
                  elevation={0}
                  sx={{
                    p: {
                      xs: 1.25,
                      sm: 1.5,
                    },

                    borderRadius: 2.5,

                    background:
                      COLORS.beigeSoft,

                    border:
                      `1px solid ${COLORS.border}`,
                  }}
                >

                  <InventoryFilters
                    warehouses={warehouses}
                    suppliers={suppliers}
                    value={filters}
                    loading={loading}
                    onChange={setFilters}
                  />

                </Paper>


                {/* ==================================================
                    ACTIVE FILTER SUMMARY
                ================================================== */}

                {hasActiveFilters && (
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                      xs: "flex-start",
                      sm: "center",
                    }}
                    spacing={1}
                    sx={{
                      mt: 2,
                      px: 0.5,
                    }}
                  >

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Showing{" "}
                      <strong>
                        {
                          filteredInventory.length
                        }
                      </strong>{" "}
                      of{" "}
                      <strong>
                        {inventory.length}
                      </strong>{" "}
                      inventory records.
                    </Typography>


                    <Button
                      variant="text"
                      onClick={
                        handleClearFilters
                      }
                      sx={{
                        ...actionButtonSx,

                        minWidth: "auto",

                        px: 1.5,

                        color: COLORS.primary,

                        "&:hover": {
                          backgroundColor:
                            COLORS.aqua,

                          transform:
                            "translateY(-1px)",
                        },
                      }}
                    >
                      Clear Filters
                    </Button>

                  </Stack>
                )}

              </Box>


              {/* ==================================================
                  TABLE / LOADING / EMPTY
              ================================================== */}

              <Box
                sx={{
                  mt: {
                    xs: 2.5,
                    sm: 3,
                  },
                }}
              >

                {/* ==================================================
                    LOADING STATE
                ================================================== */}

                {loading ? (

                  <Box
                    sx={{
                      minHeight: {
                        xs: 260,
                        sm: 320,
                      },

                      display: "flex",

                      flexDirection:
                        "column",

                      justifyContent:
                        "center",

                      alignItems: "center",

                      textAlign: "center",

                      px: 2,
                    }}
                  >

                    <CircularProgress
                      size={42}
                      thickness={4}
                      sx={{
                        color:
                          COLORS.primary,
                        mb: 2,
                      }}
                    />


                    <Typography
                      fontWeight={700}
                      sx={{
                        color: COLORS.ink,
                      }}
                    >
                      Loading inventory...
                    </Typography>


                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.7,
                      }}
                    >
                      Fetching the latest
                      inventory records.
                    </Typography>

                  </Box>

                ) : filteredInventory.length ===
                  0 ? (

                  /* ==================================================
                      EMPTY STATE
                  ================================================== */

                  <Box
                    sx={{
                      minHeight: {
                        xs: 300,
                        sm: 350,
                      },

                      display: "flex",

                      flexDirection:
                        "column",

                      justifyContent:
                        "center",

                      alignItems: "center",

                      textAlign: "center",

                      px: {
                        xs: 2,
                        sm: 4,
                      },

                      py: 5,
                    }}
                  >

                    <MotionBox
                      animate={{
                        y: [0, -4, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      sx={{
                        ...iconBadgeSx(68),

                        borderRadius:
                          "18px",

                        mb: 2.5,

                        background:
                          COLORS.aquaSoft,
                      }}
                    >

                      <Inventory2RoundedIcon
                        sx={{
                          fontSize: 34,
                        }}
                      />

                    </MotionBox>


                    <Typography
                      variant="h5"
                      fontWeight={800}
                      sx={{
                        color: COLORS.ink,
                      }}
                    >
                      No Inventory Found
                    </Typography>


                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 1,

                        maxWidth: 500,

                        lineHeight: 1.7,
                      }}
                    >
                      {hasActiveFilters
                        ? "No inventory records match your current search and filters. Try changing your filters or clearing them."
                        : "Your inventory is currently empty. Add your first inventory item to start managing stock."}
                    </Typography>


                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      spacing={1.5}
                      sx={{
                        mt: 3,

                        width: {
                          xs: "100%",
                          sm: "auto",
                        },
                      }}
                    >

                      {hasActiveFilters && (
                        <Button
                          variant="outlined"
                          onClick={
                            handleClearFilters
                          }
                          fullWidth
                          sx={{
                            ...secondaryButtonSx,
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}


                      <Button
                        variant="contained"
                        startIcon={
                          <AddRoundedIcon />
                        }
                        onClick={() =>
                          navigate(
                            "/inventory/add"
                          )
                        }
                        fullWidth
                        sx={{
                          ...primaryButtonSx,
                        }}
                      >
                        Add Inventory
                      </Button>

                    </Stack>

                  </Box>

                ) : (

                  /* ==================================================
                      INVENTORY TABLE
                  ================================================== */

                  <MotionBox
                    variants={itemVariants}
                    sx={{
                      width: "100%",
                      minWidth: 0,
                    }}
                  >

                    <InventoryTable
                      inventory={
                        filteredInventory
                      }
                      loading={loading}

                      onView={(row) => {
                        if (!row?.id) {
                          return;
                        }

                        navigate(
                          `/inventory/${row.id}`
                        );
                      }}

                      onEdit={(row) => {
                        if (!row?.id) {
                          return;
                        }

                        navigate(
                          `/inventory/edit/${row.id}`
                        );
                      }}

                      onDelete={(row) => {
                        if (!row) {
                          return;
                        }

                        setSelectedInventory(
                          row
                        );

                        setDeleteOpen(true);
                      }}

                      onUpdateStock={(row) => {
                        if (!row) {
                          return;
                        }

                        setSelectedInventory(
                          row
                        );

                        setStockOpen(true);
                      }}
                    />

                  </MotionBox>

                )}

              </Box>

            </MotionPaper>


            {/* ==================================================
                BOTTOM INFORMATION PANEL
            ================================================== */}

            <MotionPaper
              variants={itemVariants}
              elevation={0}
              sx={{
                ...panelSx,

                mt: {
                  xs: 2.5,
                  md: 3,
                },

                p: {
                  xs: 2,
                  sm: 2.5,
                  md: 3,
                },

                background:
                  `linear-gradient(135deg, ${COLORS.aquaPale} 0%, ${COLORS.white} 55%, ${COLORS.beigeSoft} 100%)`,
              }}
            >

              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                spacing={{
                  xs: 2,
                  md: 3,
                }}
                alignItems={{
                  xs: "flex-start",
                  md: "center",
                }}
                justifyContent="space-between"
              >

                {/* ==================================================
                    INFORMATION
                ================================================== */}

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                  minWidth={0}
                >

                  <Box
                    sx={{
                      ...iconBadgeSx(42),

                      width: 42,
                      height: 42,

                      borderRadius:
                        "11px",
                    }}
                  >

                    <WarningAmberRoundedIcon
                      sx={{
                        fontSize: 22,
                      }}
                    />

                  </Box>


                  <Box>

                    <Typography
                      variant="subtitle1"
                      fontWeight={800}
                      sx={{
                        color: COLORS.ink,
                      }}
                    >
                      Inventory Management
                    </Typography>


                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,

                        lineHeight: 1.7,

                        maxWidth: 760,
                      }}
                    >
                      Keep stock quantities,
                      warehouse assignments,
                      suppliers and inventory
                      thresholds accurate to
                      support reliable reporting,
                      stock monitoring and future
                      AI-powered replenishment
                      recommendations.
                    </Typography>

                  </Box>

                </Stack>


                {/* ==================================================
                    BOTTOM REFRESH
                ================================================== */}

                <Button
                  variant="outlined"
                  startIcon={
                    <RefreshRoundedIcon />
                  }
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{
                    ...secondaryButtonSx,

                    width: {
                      xs: "100%",
                      md: "auto",
                    },

                    flexShrink: 0,
                  }}
                >
                  Refresh Inventory
                </Button>

              </Stack>

            </MotionPaper>

          </MotionBox>

        </Container>


        {/* ==================================================
            DELETE INVENTORY MODAL
        ================================================== */}

        <DeleteInventoryModal
          open={deleteOpen}
          inventory={selectedInventory}
          loading={loading}

          onClose={() => {
            if (loading) {
              return;
            }

            setDeleteOpen(false);
            setSelectedInventory(null);
          }}

          onConfirm={handleDelete}
        />


        {/* ==================================================
            UPDATE STOCK MODAL
        ================================================== */}

        <UpdateStockModal
          open={stockOpen}
          inventory={selectedInventory}
          loading={loading}

          onClose={() => {
            if (loading) {
              return;
            }

            setStockOpen(false);
            setSelectedInventory(null);
          }}

          onSave={handleStockUpdate}
        />


        {/* ==================================================
            GLOBAL PAGE SNACKBAR
        ================================================== */}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3500}
          onClose={closeSnackbar}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            mt: {
              xs: 1,
              sm: 2,
            },

            mr: {
              xs: 1,
              sm: 2,
            },

            ml: {
              xs: 1,
              sm: 0,
            },
          }}
        >

          <Alert
            severity={snackbar.severity}
            variant="filled"
            elevation={6}
            onClose={closeSnackbar}
            sx={{
              width: "100%",

              minWidth: {
                xs: "auto",
                sm: 340,
              },

              borderRadius: 2.5,

              fontWeight: 600,
            }}
          >
            {snackbar.message}
          </Alert>

        </Snackbar>

      </Box>

    </MotionConfig>
  );
};


export default Inventory;
